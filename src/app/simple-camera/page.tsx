"use client";

import { useState, useRef, useCallback } from 'react';

export default function SimpleCameraTest() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
        };
      }
      
      setStream(mediaStream);
      setCameraActive(true);
      alert('Camera started successfully!');
    } catch (error) {
      console.error("Camera error:", error);
      const err = error as { name?: string; message?: string };
      
      let message = 'Camera failed to start: ';
      if (err.name === 'NotAllowedError') {
        message += 'Permission denied. Please allow camera access.';
      } else if (err.name === 'NotFoundError') {
        message += 'No camera found.';
      } else if (err.name === 'NotReadableError') {
        message += 'Camera already in use.';
      } else {
        message += err.message || 'Unknown error';
      }
      alert(message);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setCameraActive(false);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageDataUrl);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Simple Camera Test</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Camera Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Camera Feed</h2>
            
            <video
              ref={videoRef}
              className="w-full bg-gray-200 rounded-lg mb-4"
              style={{ aspectRatio: '4/3' }}
              autoPlay
              playsInline
              muted
            />
            
            <div className="flex gap-2">
              <button
                onClick={startCamera}
                disabled={cameraActive}
                className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
              >
                {cameraActive ? 'Camera Active' : 'Start Camera'}
              </button>
              
              <button
                onClick={stopCamera}
                disabled={!cameraActive}
                className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
              >
                Stop Camera
              </button>
            </div>
            
            <button
              onClick={capturePhoto}
              disabled={!cameraActive}
              className="w-full mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Capture Photo
            </button>
          </div>

          {/* Captured Image Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Captured Image</h2>
            
            {capturedImage ? (
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full bg-gray-200 rounded-lg"
                style={{ aspectRatio: '4/3', objectFit: 'cover' }}
              />
            ) : (
              <div
                className="w-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500"
                style={{ aspectRatio: '4/3' }}
              >
                No image captured yet
              </div>
            )}
          </div>
        </div>
        
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
}