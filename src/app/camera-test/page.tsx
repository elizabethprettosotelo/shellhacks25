"use client";

import { useState, useRef } from 'react';

export default function CameraTest() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const log = (message: string) => {
    console.log(message);
    setLogs(prev => [...prev, message]);
  };

  const startCamera = async () => {
    try {
      setLogs([]);
      log('🔍 Checking browser support...');
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        log('❌ getUserMedia not supported');
        return;
      }
      
      log('✅ getUserMedia supported');
      log(`🔒 Secure context: ${window.isSecureContext}`);
      log(`📍 Location: ${window.location.href}`);
      
      // Check devices
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(d => d.kind === 'videoinput');
        log(`🎥 Video devices found: ${videoDevices.length}`);
        videoDevices.forEach((device, i) => {
          log(`  Device ${i + 1}: ${device.label || 'Unknown camera'}`);
        });
      } catch (e: unknown) {
        const error = e as Error;
        log(`⚠️ Could not enumerate devices: ${error.message}`);
      }
      
      log('📹 Requesting camera access...');
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        videoRef.current.play();
      }
      setStream(newStream);
      log('✅ Camera started successfully!');
      
    } catch (error: unknown) {
      const err = error as { name?: string; message?: string; constraint?: string; stack?: string };
      log(`❌ Error: ${err.name} - ${err.message}`);
      log(`📝 Error details: ${JSON.stringify({
        name: err.name,
        message: err.message,
        constraint: err.constraint,
        stack: err.stack?.split('\n')[0]
      }, null, 2)}`);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      log('🛑 Camera stopped');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Camera Debug Test</h1>
      
      <video
        ref={videoRef}
        width="640"
        height="480"
        autoPlay
        playsInline
        className="border-2 border-gray-300 mb-4"
      />
      
      <div className="mb-4">
        <button
          onClick={startCamera}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
        >
          Start Camera
        </button>
        <button
          onClick={stopCamera}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Stop Camera
        </button>
      </div>
      
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-bold mb-2">Debug Log:</h2>
        <div className="max-h-96 overflow-y-auto">
          {logs.map((log, i) => (
            <div key={i} className="font-mono text-sm mb-1">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}