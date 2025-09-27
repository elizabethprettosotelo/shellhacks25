"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { generateContentWithImage } from "../lib/gemini";
import { Button } from "@/components/ui/button";

export default function CameraCapture() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [geminiResponse, setGeminiResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  // Start camera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user' // Use front camera
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
      setCameraActive(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Error accessing camera. Please make sure you've granted camera permissions.");
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

  // Send image to Gemini
  const analyzeWithGemini = async (prompt: string = "Describe what you see in this image") => {
    if (!capturedImage) {
      alert("Please capture a photo first!");
      return;
    }

    setLoading(true);
    try {
      // Remove the data:image/jpeg;base64, prefix
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
      <h1 className="text-3xl font-bold text-gray-800 text-center">Camera + Gemini AI</h1>
      
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
            </div>
          )}

          {/* Analysis controls */}
          <div className="space-y-2">
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