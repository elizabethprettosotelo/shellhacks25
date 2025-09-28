import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

// POST /api/generate-scene
// Body: { sceneId: string, character: object }
// This scaffold will persist generated images to public/generated/<sceneId>.png
// so that once a scene is generated it can be reused across sessions and paths.

function placeholderBase64Png(): string {
  // 1x1 transparent PNG
  return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';
}

const GENERATED_DIR = path.join(process.cwd(), 'public', 'generated');

function sanitizeSceneId(id: string) {
  return id.replace(/[^a-z0-9_-]/gi, '_');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sceneId, character } = body || {};

    if (!sceneId) {
      return NextResponse.json({ error: 'Missing sceneId' }, { status: 400 });
    }

    const cleanId = sanitizeSceneId(sceneId);
    const outPath = path.join(GENERATED_DIR, `${cleanId}.png`);
    const publicUrl = `/generated/${cleanId}.png`;

    // If a persisted file already exists, return its URL immediately
    try {
      await fs.access(outPath);
      return NextResponse.json({ sceneId, imageUrl: publicUrl, note: 'cached-on-disk' });
    } catch {
      // file does not exist, proceed to generate
    }

  // Only use a server-side GEMINI_API_KEY for real generation. Do not use NEXT_PUBLIC_* here.
  const key = process.env.GEMINI_API_KEY;
    let imageBase64 = placeholderBase64Png();
    let note = 'placeholder';

  if (key) {
      // Attempt to call Gemini image generation. This is guarded: only runs when GEMINI_API_KEY is set.
      try {
        // Initialize client with server-side key (prefer GEMINI_API_KEY)
  const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

        // Simple image generation prompt: include the character JSON and the scene id.
        const prompt = `Generate a 1:1 PNG scene image for scene ${sceneId}. Style: colorful illustrated storybook, place the character described as: ${JSON.stringify(character)}. Keep background coherent with scene id ${sceneId}. Return a PNG image.`;

        // Use the text-to-image (image generation) API surface if available on the model.
        // NOTE: SDK specifics may vary; here's an illustrative usage that requests an image and expects base64 in the response.
        const model = client.getGenerativeModel({ model: 'gemini-image-alpha' as any });

        // Some SDKs support a method like generateImage or generateContent with imageConfig — try a conservative approach.
        // We'll try generateContent and look for base64 in the response. If this fails, we fall back to placeholder.
        const res = await model.generateContent({
          text: prompt,
          // optional image config could be placed here depending on SDK version
        } as any);

        const response = await res.response;
        const outText = response?.text?.() || '';

        // Attempt to extract base64 png data from the response text (if the model returns data URI or base64 chunk)
        const maybeBase64 = (outText || '').match(/data:image\/(png|jpeg);base64,[A-Za-z0-9+/=]+/i);
        if (maybeBase64) {
          imageBase64 = maybeBase64[0];
          note = 'generated-by-gemini-inline';
        } else {
          // If response included raw base64 without data: prefix it
          const rawBase64 = (outText || '').trim();
          if (/^[A-Za-z0-9+/=\s]+$/.test(rawBase64) && rawBase64.length > 100) {
            imageBase64 = 'data:image/png;base64,' + rawBase64.replace(/\s+/g, '');
            note = 'generated-by-gemini-rawbase64';
          } else {
            note = 'gemini-response-not-image';
          }
        }
      } catch (gErr) {
        console.error('Gemini generation failed:', gErr);
        note = `gemini-error:${(gErr as Error).message}`;
      }
    } else {
      note = 'no-gemini-key';
    }

    // Ensure output directory exists and write the PNG file
    try {
      const base64 = imageBase64.replace(/^data:image\/png;base64,/, '');
      const buffer = Buffer.from(base64, 'base64');
      await fs.mkdir(GENERATED_DIR, { recursive: true });
      await fs.writeFile(outPath, buffer);
      return NextResponse.json({ sceneId, imageUrl: publicUrl, note });
    } catch (fsErr) {
      // Fall back to returning inline base64 if writing failed
      return NextResponse.json({ sceneId, imageData: imageBase64, note: `failed-to-write:${(fsErr as Error).message}` });
    }

  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
