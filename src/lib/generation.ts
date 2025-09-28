import { story } from '@/app/story/runtime';

export type GeneratedResult = { sceneId: string; imageData: string; note?: string };

export async function generateScene(sceneId: string, character: any): Promise<GeneratedResult> {
  // Check scene metadata: if imageNeedsGemini === false, return early with existing image
  const scene = story.scenes.find((s: any) => s.id === sceneId);
  if (scene && scene.imageNeedsGemini === false) {
    const imageData = scene.imageRight || scene.imageLeft || '';
    const res = { sceneId, imageData, note: 'skipped - no gemini required' };
    try { localStorage.setItem(`generated-image:${sceneId}`, JSON.stringify(res)); } catch {}
    return res;
  }

  // First, ask the server to generate (or return an existing persisted URL)
  const res = await fetch('/api/generate-scene', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sceneId, character })
  });
  const json = await res.json();

  // Server may return either imageUrl (persisted file) or imageData (inline base64)
  const imageData = json.imageData || json.imageUrl || '';
  const result: GeneratedResult = {
    sceneId,
    imageData,
    note: json.note
  };
  try { localStorage.setItem(`generated-image:${sceneId}`, JSON.stringify(result)); } catch {}
  return result;
}

export async function generateScenesSequential(sceneIds: string[], character: any, onProgress?: (r: GeneratedResult)=>void) {
  for (const id of sceneIds) {
    try {
      // Skip if already generated
      try {
        const existing = localStorage.getItem(`generated-image:${id}`);
        if (existing) {
          const parsed = JSON.parse(existing) as GeneratedResult;
          onProgress?.(parsed);
          continue;
        }
      } catch {}

      // Quick server-side cached check: call the server and if it says cached-on-disk, store that URL and continue
      try {
        const check = await fetch('/api/generate-scene', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sceneId: id, character })
        });
        const j = await check.json();
        if (j.imageUrl) {
          const res = { sceneId: id, imageData: j.imageUrl, note: j.note } as GeneratedResult;
          try { localStorage.setItem(`generated-image:${id}`, JSON.stringify(res)); } catch {}
          onProgress?.(res);
          continue;
        }
      } catch {}

      const scene = story.scenes.find((s: any) => s.id === id);
      if (scene && scene.imageNeedsGemini === false) {
        const res = { sceneId: id, imageData: scene.imageRight || scene.imageLeft || '', note: 'skipped - no gemini required' };
        try { localStorage.setItem(`generated-image:${id}`, JSON.stringify(res)); } catch {}
        onProgress?.(res);
        continue;
      }

      const result = await generateScene(id, character);
      onProgress?.(result);
    } catch (err) {
      console.error('Generation failed for', id, err);
      onProgress?.({ sceneId: id, imageData: '', note: 'error' });
    }
  }
}

export function getGeneratedImage(sceneId: string): GeneratedResult | null {
  try {
    const raw = localStorage.getItem(`generated-image:${sceneId}`);
    return raw ? JSON.parse(raw) as GeneratedResult : null;
  } catch {
    return null;
  }
}
