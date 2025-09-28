"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { generateContentWithImage } from "../lib/gemini";
import { Button } from "@/components/ui/button";
import { useCharacterContext } from "@/contexts/CharacterContext";
import { Character, defaultCharacter, personalityTraits, characterParts } from "../lib/characterData";
import CameraTroubleshooting from "./CameraTroubleshooting";
import CharacterDisplay from "./CharacterDisplay";

interface CameraCaptureProps {
  mode?: 'analysis' | 'character';
  onCharacterCreated?: (character: Character) => void;
}

export default function CameraCapture({ mode = 'analysis', onCharacterCreated }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [geminiResponse, setGeminiResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [characterSuggestion, setCharacterSuggestion] = useState<Partial<Character> | null>(null);
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);
  const [diagnosticInfo, setDiagnosticInfo] = useState<string>("");
  
  const { saveCharacter, setCurrentCharacter } = useCharacterContext();

  // Check browser capabilities on mount
  useEffect(() => {
    const checkCapabilities = async () => {
      let info = "🔍 Browser Diagnostics:\n\n";
      
      // Check secure context
      info += `🔒 Secure Context: ${window.isSecureContext ? '✅ Yes' : '❌ No (HTTPS required)'}\n`;
      
      // Check getUserMedia support
      info += `📹 getUserMedia: ${(navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') ? '✅ Supported' : '❌ Not supported'}\n`;
      
      // Check if we can enumerate devices
      try {
        if (navigator.mediaDevices?.enumerateDevices) {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoDevices = devices.filter(d => d.kind === 'videoinput');
          info += `🎥 Video Devices: ${videoDevices.length} found\n`;
        } else {
          info += `🎥 Device Enumeration: ❌ Not supported\n`;
        }
      } catch {
        info += `🎥 Device Enumeration: ❌ Permission needed\n`;
      }
      
      // Browser info
      info += `🌐 User Agent: ${navigator.userAgent.split(' ')[0]}\n`;
      info += `📍 Location: ${window.location.protocol}//${window.location.host}\n`;
      
      setDiagnosticInfo(info);
    };
    
    checkCapabilities();
  }, []);

  // Start camera
  const startCamera = async () => {
    try {
      console.log('🔍 Starting camera diagnostics...');
      console.log('User Agent:', navigator.userAgent);
      console.log('Location:', window.location.href);
      console.log('Secure Context:', window.isSecureContext);
      
      // Check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        const message = "Camera not supported on this browser or environment. Please use Chrome, Firefox, or Safari on a regular browser window (not embedded).";
        console.error('❌', message);
        alert(message);
        return;
      }

      // Check if we're in a secure context
      if (!window.isSecureContext) {
        const message = "Camera requires HTTPS or localhost. Please make sure you're accessing the site securely.";
        console.error('❌', message);
        alert(message);
        return;
      }

      console.log('📹 Requesting camera permission...');
      
      // First try to enumerate devices to see if any cameras are available
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        console.log(`Found ${videoDevices.length} video input devices`);
        
        if (videoDevices.length === 0) {
          alert("No camera devices found. Please make sure a camera is connected and not being used by other applications.");
          return;
        }
      } catch (enumError) {
        console.warn("Could not enumerate devices:", enumError);
        // Continue anyway as some browsers don't allow enumeration without permission
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 },
          facingMode: 'user' // Use front camera
        }
      });
      
      console.log("Camera permission granted, setting up video...");
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        // Wait for video to load
        videoRef.current.onloadedmetadata = () => {
          console.log("Video metadata loaded successfully");
          videoRef.current?.play().catch(playError => {
            console.error("Error playing video:", playError);
          });
        };
      }
      setStream(mediaStream);
      setCameraActive(true);
      console.log("Camera started successfully");
    } catch (error: unknown) {
      console.error("Error accessing camera:", error);
      
      let errorMessage = "Error accessing camera. ";
      const err = error as { name?: string; message?: string }; // Cast for error properties
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage += "Camera permission denied. This commonly happens in embedded browsers.\n\n";
        errorMessage += "SOLUTIONS:\n";
        errorMessage += "1. If you're in VS Code: Click the external browser icon (↗️) in the top-right corner to open in your regular browser\n";
        errorMessage += "2. In regular browser: Click the camera icon 🎥 in the address bar and select 'Allow'\n";
        errorMessage += "3. Make sure no other apps are using your camera\n";
        errorMessage += "4. Try refreshing the page after allowing permissions\n";
        errorMessage += "5. Check browser settings: Site Settings → Camera → Allow\n\n";
        errorMessage += "TIP: VS Code's embedded browser has limited camera support. Use Chrome, Firefox, or Safari directly for best results.";
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMessage += "No camera found. Please:\n\n1. Make sure a camera is connected\n2. Close other apps that might be using the camera\n3. Try refreshing the page";
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMessage += "Camera is already in use by another application. Please:\n\n1. Close other apps using the camera\n2. Restart your browser\n3. Try again";
      } else if (err.name === 'OverconstrainedError' || err.name === 'ConstraintNotSatisfiedError') {
        errorMessage += "Camera constraints not supported. Trying with basic settings...";
        
        // Try again with minimal constraints
        try {
          const basicStream = await navigator.mediaDevices.getUserMedia({
            video: true
          });
          if (videoRef.current) {
            videoRef.current.srcObject = basicStream;
          }
          setStream(basicStream);
          setCameraActive(true);
          return;
        } catch {
          errorMessage += "\n\nBasic camera access also failed. Please check your camera settings.";
        }
      } else {
        errorMessage += `Unknown error (${err.name}): ${err.message}\n\nPlease try:\n1. Refreshing the page\n2. Using a different browser\n3. Checking camera permissions`;
      }
      
      alert(errorMessage);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setCameraActive(false);
    }
  };

  // Capture photo
  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        // Convert to base64
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageDataUrl);
        
        return imageDataUrl;
      }
    }
    return null;
  }, []);

  // Send image to Gemini to generate character JSON
  const analyzeImageToCharacterJson = async () => {
    if (!capturedImage) {
      alert("Please capture a photo first!");
      return;
    }

    setLoading(true);
    try {
      const base64Data = capturedImage.split(',')[1];
      
      // Build comprehensive asset list for Gemini
      const buildAssetPrompt = () => {
        const categories = Object.keys(characterParts) as (keyof typeof characterParts)[];
        return categories.map(category => {
          const parts = characterParts[category];
          const assetList = parts.map(part => `${part.id} (${part.name})`).join(', ');
          return `${String(category).toUpperCase()}: ${assetList}`;
        }).join('\n');
      };
      
      const characterPrompt = `Analyze this photo of a person and create a character that matches their physical appearance. You MUST respond with ONLY valid JSON wrapped in markers.

AVAILABLE ASSETS:
${buildAssetPrompt()}

CRITICAL INSTRUCTIONS:
1. Respond with ONLY the JSON object wrapped in these exact markers: ===START_JSON=== and ===END_JSON===
2. No other text outside the markers
3. Use only the asset IDs listed above
4. Choose assets that best match the person's appearance

===START_JSON===
{
  "name": "character name",
  "personality": ["trait1", "trait2"],
  "backstory": "character backstory",
  "body": "body-X",
  "hair": "hair-X", 
  "bangs": "bangs-X or bangs-none",
  "eyes": "eyes-X",
  "mouth": "mouth-X",
  "clothes": "clothes-X",
  "accessory": "accessory-X or accessory-none (optional)",
  "blush": "blush-X or blush-none (optional)",
  "facialAccessory": "facialAccessory-X or facialAccessory-none (optional)",
  "facialHair": "facialHair-X or facialHair-none (optional)",
  "reasoning": "brief explanation of choices"
}
===END_JSON===

Remember: ONLY return the JSON wrapped in the markers above, nothing else.`;
      
      const response = await generateContentWithImage(
        characterPrompt,
        base64Data,
        'image/jpeg',
        'gemini-2.0-flash-exp'
      );
      
      setGeminiResponse(response);
      
      // Parse JSON response with robust extraction
      let characterData: Partial<Character & { reasoning?: string }>;
      try {
        // First try to extract JSON from markers
        const markerMatch = response.match(/===START_JSON===([\s\S]*?)===END_JSON===/);
        if (markerMatch) {
          characterData = JSON.parse(markerMatch[1].trim());
        } else {
          // Fallback: Extract JSON from response (in case there's extra text)
          const jsonMatch = response.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            characterData = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error("No valid JSON found in response");
          }
        }
        
        // Validate required fields
        const required: (keyof Character)[] = ['body', 'hair', 'eyes', 'mouth', 'clothes'];
        const missing = required.filter(field => !characterData[field]);
        if (missing.length > 0) {
          throw new Error(`Missing required fields: ${missing.join(', ')}`);
        }
        
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        console.log("Raw response:", response);
        
        const errorMessage = parseError instanceof Error ? parseError.message : 'Unknown error';
        
        // Download error JSON instead
        const errorData = {
          error: "Failed to parse Gemini response as JSON",
          details: errorMessage,
          rawResponse: response,
          timestamp: new Date().toISOString()
        };
        
        const errorBlob = new Blob([JSON.stringify(errorData, null, 2)], { type: 'application/json' });
        const errorUrl = URL.createObjectURL(errorBlob);
        const errorLink = document.createElement('a');
        errorLink.href = errorUrl;
        errorLink.download = `character-error-${Date.now()}.json`;
        document.body.appendChild(errorLink);
        errorLink.click();
        document.body.removeChild(errorLink);
        URL.revokeObjectURL(errorUrl);
        
        setGeminiResponse(`ERROR: ${errorMessage}\n\nRaw response:\n${response}`);
        return;
      }
      
      // Create full character object
      const newCharacter: Character = {
        ...defaultCharacter,
        ...characterData,
        id: `char-${Date.now()}`,
        createdAt: new Date(),
        createdFrom: 'ai-photo'
      };
      
      // Set character suggestion for preview
      setCharacterSuggestion(newCharacter);
      
      // Download JSON file
      const jsonOutput = {
        character: newCharacter,
        assets: {
          body: characterParts.body.find(p => p.id === newCharacter.body),
          hair: characterParts.hair.find(p => p.id === newCharacter.hair),
          bangs: characterParts.bangs.find(p => p.id === newCharacter.bangs),
          eyes: characterParts.eyes.find(p => p.id === newCharacter.eyes),
          mouth: characterParts.mouth.find(p => p.id === newCharacter.mouth),
          clothes: characterParts.clothes.find(p => p.id === newCharacter.clothes),
          accessory: newCharacter.accessory ? characterParts.accessory.find(p => p.id === newCharacter.accessory) : null,
          blush: newCharacter.blush ? characterParts.blush.find(p => p.id === newCharacter.blush) : null,
          facialAccessory: newCharacter.facialAccessory ? characterParts.facialAccessory.find(p => p.id === newCharacter.facialAccessory) : null,
          facialHair: newCharacter.facialHair ? characterParts.facialHair.find(p => p.id === newCharacter.facialHair) : null
        },
        timestamp: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(jsonOutput, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `character-${newCharacter.id}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error("Error analyzing image:", error);
      setGeminiResponse("Error analyzing image. Please check your API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Send image to Gemini for character analysis
  const generateCharacterFromImage = async () => {
    if (!capturedImage) {
      alert("Please capture a photo first!");
      return;
    }

    setLoading(true);
    try {
      const base64Data = capturedImage.split(',')[1];
      
      const characterPrompt = `Analyze this photo of a person and create a character that matches their physical appearance using the available game assets. 

AVAILABLE ASSETS TO CHOOSE FROM:
Body Types: body-1 (slim), body-2 (average), body-3 (athletic), body-4 (curvy), body-5 (tall), body-6 (short), body-7 (muscular), body-8 (large), body-9 (petite)
Hair Styles: hair-1 (short straight), hair-2 (long wavy), hair-3 (curly afro), hair-4 (bob cut), hair-5 (ponytail), hair-6 (braids), hair-7 (pixie cut)
Bangs: bangs-none (no bangs), bangs-1 (straight across), bangs-2 (side swept), bangs-3 (wispy), bangs-4 (thick), bangs-5 (curtain), bangs-6 (asymmetric), bangs-7 (choppy)
Eyes: eyes-1 (round), eyes-2 (almond), eyes-3 (wide), eyes-4 (narrow), eyes-5 (hooded)
Mouth: mouth-1 through mouth-14 (various expressions and shapes)
Clothes: clothes-1 (casual shirt), clothes-2 (dress), clothes-3 (hoodie), clothes-4 (formal), clothes-5 (tank top), clothes-6 (jacket)

INSTRUCTIONS:
1. Look at their body build and choose the closest matching body type
2. Analyze their hair length, style, and texture to pick the most similar hair
3. Check if they have bangs and what style
4. Look at their eye shape and select the most matching eyes
5. Observe their mouth/facial expression for the best mouth choice
6. Consider their clothing style for appropriate clothes
7. Generate personality traits based on their appearance/vibe
8. Create a character name and backstory

Respond EXACTLY in this format:
BODY: [body-X]
HAIR: [hair-X]
BANGS: [bangs-X or bangs-none]  
EYES: [eyes-X]
MOUTH: [mouth-X]
CLOTHES: [clothes-X]
NAME: [character name]
TRAITS: [comma separated personality traits from: ${personalityTraits.join(', ')}]
BACKSTORY: [2-3 sentence backstory]
REASONING: [brief explanation of why you chose these specific assets to match their appearance]`;
      
      const response = await generateContentWithImage(
        characterPrompt,
        base64Data,
        'image/jpeg',
        'gemini-2.0-flash-exp'
      );
      
      // Parse the response and create character suggestion
      const suggestion = parseCharacterResponse(response);
      setCharacterSuggestion(suggestion);
      setGeminiResponse(response);
      
    } catch (error) {
      console.error("Error generating character:", error);
      setGeminiResponse("Error generating character. Please check your API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Parse Gemini's character response
  const parseCharacterResponse = (response: string): Partial<Character> => {
    const lines = response.split('\n');
    let name = 'Adventurer';
    let traits: string[] = [];
    let backstory = '';
    let body = defaultCharacter.body;
    let hair = defaultCharacter.hair;
    let bangs = defaultCharacter.bangs;
    let eyes = defaultCharacter.eyes;
    let mouth = defaultCharacter.mouth;
    let clothes = defaultCharacter.clothes;
    
    lines.forEach(line => {
      if (line.startsWith('NAME:')) {
        name = line.replace('NAME:', '').trim();
      } else if (line.startsWith('TRAITS:')) {
        const traitsText = line.replace('TRAITS:', '').trim();
        traits = traitsText.split(',').map(t => t.trim()).filter(t => personalityTraits.includes(t));
      } else if (line.startsWith('BACKSTORY:')) {
        backstory = line.replace('BACKSTORY:', '').trim();
      } else if (line.startsWith('BODY:')) {
        const bodyId = line.replace('BODY:', '').trim();
        if (bodyId && bodyId.startsWith('body-')) {
          body = bodyId;
        }
      } else if (line.startsWith('HAIR:')) {
        const hairId = line.replace('HAIR:', '').trim();
        if (hairId && hairId.startsWith('hair-')) {
          hair = hairId;
        }
      } else if (line.startsWith('BANGS:')) {
        const bangsId = line.replace('BANGS:', '').trim();
        if (bangsId && (bangsId.startsWith('bangs-') || bangsId === 'bangs-none')) {
          bangs = bangsId;
        }
      } else if (line.startsWith('EYES:')) {
        const eyesId = line.replace('EYES:', '').trim();
        if (eyesId && eyesId.startsWith('eyes-')) {
          eyes = eyesId;
        }
      } else if (line.startsWith('MOUTH:')) {
        const mouthId = line.replace('MOUTH:', '').trim();
        if (mouthId && mouthId.startsWith('mouth-')) {
          mouth = mouthId;
        }
      } else if (line.startsWith('CLOTHES:')) {
        const clothesId = line.replace('CLOTHES:', '').trim();
        if (clothesId && clothesId.startsWith('clothes-')) {
          clothes = clothesId;
        }
      }
    });

    return {
      name,
      personality: traits,
      backstory,
      body,
      hair,
      bangs,
      eyes,
      mouth,
      clothes,
      createdFrom: 'ai-photo'
    };
  };

  // Create character from AI suggestion
  const createCharacterFromSuggestion = () => {
    if (!characterSuggestion) return;
    
    const newCharacter: Character = {
      ...defaultCharacter,
      ...characterSuggestion,
      id: `char-${Date.now()}`,
      createdAt: new Date(),
      createdFrom: 'ai-photo',
    };
    
    saveCharacter(newCharacter);
    setCurrentCharacter(newCharacter);
    onCharacterCreated?.(newCharacter);
    
    // Navigate back to character page
    window.location.href = '/char';
  };

  // Download captured image
  const downloadImage = () => {
    if (!capturedImage) {
      alert("Please capture a photo first!");
      return;
    }

    const link = document.createElement('a');
    link.href = capturedImage;
    link.download = `camera-capture-${new Date().getTime()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get diagnostic information
  const getDiagnostics = async () => {
    try {
      let info = "🖥️ Browser & Device Diagnostics:\n\n";
      
      // Browser info
      info += `🌐 User Agent: ${navigator.userAgent}\n`;
      info += `📍 Protocol: ${window.location.protocol}\n`;
      info += `🏠 Host: ${window.location.host}\n`;
      info += `🔒 Secure Context: ${window.isSecureContext ? '✅ Yes' : '❌ No (HTTPS required for camera)'}\n`;
      
      // Check if we're in an embedded browser
      if (navigator.userAgent.includes('VS Code')) {
        info += `⚠️ Embedded Browser: VS Code Simple Browser detected\n`;
        info += `💡 Tip: Camera might not work in embedded browsers. Try external browser.\n`;
      }
      
      // Check getUserMedia support
      info += `📹 getUserMedia: ${(navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') ? '✅ Supported' : '❌ Not supported'}\n`;
      
      // Check if we can enumerate devices
      try {
        if (navigator.mediaDevices?.enumerateDevices) {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoDevices = devices.filter(d => d.kind === 'videoinput');
          info += `🎥 Video Devices: ${videoDevices.length} found\n`;
          if (videoDevices.length === 0) {
            info += `❌ No camera devices detected. Make sure camera is connected and not in use.\n`;
          }
        } else {
          info += `🎥 Device Enumeration: ❌ Not supported\n`;
        }
      } catch {
        info += `🎥 Device Enumeration: ❌ Permission needed or blocked\n`;
      }
      
      // Check current camera state
      info += `📺 Camera Active: ${cameraActive ? '✅ Yes' : '❌ No'}\n`;
      info += `📸 Image Captured: ${capturedImage ? '✅ Yes' : '❌ No'}\n`;
      
      // Add troubleshooting tips
      info += `\n🔧 Troubleshooting Tips:\n`;
      info += `• Try opening this page in Chrome/Firefox (not embedded browser)\n`;
      info += `• Make sure camera isn't used by other apps\n`;
      info += `• Check browser permissions for camera access\n`;
      info += `• Ensure you're on HTTPS or localhost\n`;
      
      setDiagnosticInfo(info);
    } catch (error) {
      setDiagnosticInfo(`Error getting diagnostics: ${error}`);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 text-center">
        {mode === 'character' ? 'Create Character from Photo' : 'Camera + Gemini AI'}
      </h1>
      
      {/* Troubleshooting section */}
      {showTroubleshooting && (
        <CameraTroubleshooting onDismiss={() => setShowTroubleshooting(false)} />
      )}
      
      {/* Help button */}
      {!cameraActive && !showTroubleshooting && (
        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={() => setShowTroubleshooting(true)}
            className="mb-4"
          >
            📹 Camera Not Working? Get Help
          </Button>
        </div>
      )}
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Camera Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Camera</h2>
          
          {/* Video feed */}
          <div className="relative bg-gray-200 rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-64 object-cover"
              style={{ display: cameraActive ? 'block' : 'none' }}
            />
            {!cameraActive && (
              <div className="w-full h-64 flex items-center justify-center text-gray-500">
                Camera not active
              </div>
            )}
          </div>

          {/* Camera controls */}
          <div className="flex gap-2">
            {!cameraActive ? (
              <Button onClick={startCamera} className="flex-1">
                Start Camera
              </Button>
            ) : (
              <Button onClick={stopCamera} variant="outline" className="flex-1">
                Stop Camera
              </Button>
            )}
            
            <Button 
              onClick={capturePhoto} 
              disabled={!cameraActive}
              className="flex-1"
            >
              Capture Photo
            </Button>
          </div>

          {/* Diagnostics button */}
          <div className="text-center">
            <Button 
              onClick={getDiagnostics} 
              variant="outline"
              size="sm"
            >
              🔍 Check Camera Support
            </Button>
          </div>

          {/* Diagnostics display */}
          {diagnosticInfo && (
            <div className="bg-gray-100 p-3 rounded-lg text-xs">
              <h4 className="font-semibold mb-2">Camera Diagnostics:</h4>
              <pre className="whitespace-pre-wrap text-gray-700">{diagnosticInfo}</pre>
            </div>
          )}

          {/* Hidden canvas for image capture */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>

        {/* Captured Image & Analysis */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Analysis</h2>
          
          {/* Captured image preview */}
          {capturedImage && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Captured Image:</h3>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={capturedImage} 
                alt="Captured" 
                className="w-full h-64 object-cover rounded-lg border"
              />
              <Button 
                onClick={downloadImage}
                variant="outline"
                className="w-full mt-2"
              >
                📥 Download Image
              </Button>
            </div>
          )}

          {/* Analysis controls */}
          <div className="space-y-2">
            {mode === 'character' ? (
              // Character creation mode
              <>
                <Button 
                  onClick={generateCharacterFromImage}
                  disabled={!capturedImage || loading}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {loading ? "Analyzing Photo & Creating Character..." : "🎭 Create Character from My Photo"}
                </Button>
                
                {/* API Key Warning */}
                {!process.env.NEXT_PUBLIC_GEMINI_API_KEY && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm">
                    <p className="text-yellow-800">
                      <strong>⚠️ API Key Required:</strong> To use character generation, add your Gemini API key to .env.local
                    </p>
                    <p className="text-yellow-700 text-xs mt-1">
                      Get a free API key at <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="underline">aistudio.google.com</a>
                    </p>
                  </div>
                )}
                
                {/* Character Preview */}
                {characterSuggestion && (
                  <div className="my-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Generated Character:</h3>
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <div className="flex gap-4">
                        {/* Character Visual */}
                        <div className="flex-shrink-0">
                          <CharacterDisplay 
                            character={characterSuggestion as Character} 
                            size="small"
                          />
                        </div>
                        {/* Character Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-lg">{characterSuggestion.name}</h4>
                          {characterSuggestion.personality && characterSuggestion.personality.length > 0 && (
                            <p className="text-sm text-gray-600 mb-2">
                              <strong>Traits:</strong> {characterSuggestion.personality.join(', ')}
                            </p>
                          )}
                          {characterSuggestion.backstory && (
                            <p className="text-sm text-gray-700">
                              <strong>Story:</strong> {characterSuggestion.backstory}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {characterSuggestion && (
                  <Button 
                    onClick={createCharacterFromSuggestion}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    ✨ Use This Character
                  </Button>
                )}
                
                <Button 
                  onClick={() => window.location.href = '/char'}
                  variant="outline"
                  className="w-full"
                >
                  ← Back to Character Page
                </Button>
              </>
            ) : (
              // Regular analysis mode
              <>
                <Button 
                  onClick={analyzeImageToCharacterJson}
                  disabled={!capturedImage || loading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? "Analyzing Photo & Creating Character JSON..." : "📋 Analyze Picture → Character JSON"}
                </Button>
                
                {/* API Key Warning */}
                {!process.env.NEXT_PUBLIC_GEMINI_API_KEY && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm">
                    <p className="text-yellow-800">
                      <strong>⚠️ API Key Required:</strong> To use character generation, add your Gemini API key to .env.local
                    </p>
                    <p className="text-yellow-700 text-xs mt-1">
                      Get a free API key at <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="underline">aistudio.google.com</a>
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Character Preview for Analysis Mode */}
          {mode === 'analysis' && characterSuggestion && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Generated Character Preview:</h3>
              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex gap-4">
                  {/* Character Visual */}
                  <div className="flex-shrink-0">
                    <CharacterDisplay 
                      character={characterSuggestion as Character} 
                      size="small"
                    />
                  </div>
                  {/* Character Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-lg">{characterSuggestion.name}</h4>
                    {characterSuggestion.personality && characterSuggestion.personality.length > 0 && (
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Traits:</strong> {characterSuggestion.personality.join(', ')}
                      </p>
                    )}
                    {characterSuggestion.backstory && (
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>Story:</strong> {characterSuggestion.backstory}
                      </p>
                    )}
                    <div className="text-xs text-gray-500">
                      <p><strong>Core Assets:</strong> {characterSuggestion.body}, {characterSuggestion.hair}, {characterSuggestion.bangs}, {characterSuggestion.eyes}, {characterSuggestion.mouth}, {characterSuggestion.clothes}</p>
                      {(characterSuggestion.accessory && characterSuggestion.accessory !== 'accessory-none') ||
                       (characterSuggestion.blush && characterSuggestion.blush !== 'blush-none') ||
                       (characterSuggestion.facialAccessory && characterSuggestion.facialAccessory !== 'facialAccessory-none') ||
                       (characterSuggestion.facialHair && characterSuggestion.facialHair !== 'facialHair-none') ? (
                        <p><strong>Additional:</strong> {[
                          characterSuggestion.accessory && characterSuggestion.accessory !== 'accessory-none' ? characterSuggestion.accessory : null,
                          characterSuggestion.blush && characterSuggestion.blush !== 'blush-none' ? characterSuggestion.blush : null,
                          characterSuggestion.facialAccessory && characterSuggestion.facialAccessory !== 'facialAccessory-none' ? characterSuggestion.facialAccessory : null,
                          characterSuggestion.facialHair && characterSuggestion.facialHair !== 'facialHair-none' ? characterSuggestion.facialHair : null
                        ].filter(Boolean).join(', ')}</p>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <Button 
                    onClick={createCharacterFromSuggestion}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    ✨ Save This Character
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Gemini response */}
          {geminiResponse && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Gemini Analysis:</h3>
              <div className="p-4 bg-blue-50 rounded-lg border text-sm">
                <pre className="whitespace-pre-wrap text-gray-700">
                  {geminiResponse}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}