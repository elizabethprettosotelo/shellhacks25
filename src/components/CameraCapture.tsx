"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { generateContentWithImage } from "../lib/gemini";
import { Button } from "@/components/ui/button";
import { useCharacterContext } from "@/contexts/CharacterContext";
import { Character, defaultCharacter, personalityTraits } from "../lib/characterData";
import CameraTroubleshooting from "./CameraTroubleshooting";

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
  
  const { saveCharacter, setCurrentCharacter } = useCharacterContext();

  // Start camera
  const startCamera = async () => {
    try {
      // Check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Camera not supported on this browser. Please use Chrome, Firefox, or Safari.");
        return;
      }

      console.log("Requesting camera permission...");
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
        errorMessage += "Camera permission denied. Please:\n\n1. Click the camera icon in your browser's address bar\n2. Select 'Allow' for camera access\n3. Refresh the page and try again\n\nOr check your browser settings to allow camera access for this site.";
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

  // Send image to Gemini for regular analysis
  const analyzeWithGemini = async (prompt: string = "Describe what you see in this image") => {
    if (!capturedImage) {
      alert("Please capture a photo first!");
      return;
    }

    setLoading(true);
    try {
      const base64Data = capturedImage.split(',')[1];
      
      const response = await generateContentWithImage(
        prompt,
        base64Data,
        'image/jpeg',
        'gemini-1.5-flash'
      );
      
      setGeminiResponse(response);
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
      
      const characterPrompt = `Analyze this person's photo and suggest character traits for a fantasy adventure story. 
      Based on their appearance, suggest:
      1. 3-5 personality traits from this list: ${personalityTraits.join(', ')}
      2. A character name that fits their appearance
      3. A brief backstory (2-3 sentences)
      4. Their likely role in an adventure (hero, scholar, warrior, etc.)
      
      Format your response as:
      NAME: [suggested name]
      TRAITS: [trait1, trait2, trait3]
      BACKSTORY: [backstory]
      ROLE: [adventure role]`;
      
      const response = await generateContentWithImage(
        characterPrompt,
        base64Data,
        'image/jpeg',
        'gemini-1.5-flash'
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
    
    lines.forEach(line => {
      if (line.startsWith('NAME:')) {
        name = line.replace('NAME:', '').trim();
      } else if (line.startsWith('TRAITS:')) {
        const traitsText = line.replace('TRAITS:', '').trim();
        traits = traitsText.split(',').map(t => t.trim()).filter(t => personalityTraits.includes(t));
      } else if (line.startsWith('BACKSTORY:')) {
        backstory = line.replace('BACKSTORY:', '').trim();
      }
    });

    return {
      name,
      personality: traits,
      backstory,
      // Don't override the name from defaultCharacter
      body: defaultCharacter.body,
      hair: defaultCharacter.hair,
      bangs: defaultCharacter.bangs,
      eyes: defaultCharacter.eyes,
      mouth: defaultCharacter.mouth,
      clothes: defaultCharacter.clothes,
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
                  {loading ? "Creating Character..." : "🎭 Generate Character"}
                </Button>
                
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
                  onClick={() => analyzeWithGemini("Describe what you see in this image in detail")}
                  disabled={!capturedImage || loading}
                  className="w-full"
                >
                  {loading ? "Analyzing..." : "Analyze Image"}
                </Button>
                
                <Button 
                  onClick={() => analyzeWithGemini("What emotions or mood do you detect in this person's face?")}
                  disabled={!capturedImage || loading}
                  variant="outline"
                  className="w-full"
                >
                  Analyze Emotions
                </Button>
                
                <Button 
                  onClick={() => analyzeWithGemini("Describe the setting, lighting, and composition of this photo")}
                  disabled={!capturedImage || loading}
                  variant="outline"
                  className="w-full"
                >
                  Analyze Composition
                </Button>
              </>
            )}
          </div>

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