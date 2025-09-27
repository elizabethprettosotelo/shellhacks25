"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function CameraPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [optedOut, setOptedOut] = useState(false);
  const router = useRouter();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error(err);
    }
  };

  const snapPhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      setCapturedImage(canvas.toDataURL("image/png"));
    }
  };

  const handleOptOut = () => {
    setOptedOut(true);
    setCapturedImage(null); // ensure no image is displayed
  };

  const goToCharacterPage = () => {
    router.push("/char"); // navigate to character selection page
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="text-xl font-bold mb-2">Take a Picture</h1>

      {/* Video feed */}
      {!capturedImage && !optedOut && (
        <video
          ref={videoRef}
          autoPlay
          className="w-80 h-60 border mb-2 object-cover"
          onCanPlay={startCamera}
        />
      )}

      <canvas ref={canvasRef} className="hidden" />

      {/* Snapshot preview */}
      {capturedImage && (
        <img
          src={capturedImage}
          alt="Snapshot"
          className="w-80 h-60 mb-2 object-cover"
        />
      )}

      {/* Snap button */}
      {!capturedImage && !optedOut && (
        <button
          onClick={snapPhoto}
          className="px-4 py-2 bg-blue-600 text-white rounded mb-2 hover:bg-blue-700 transition"
        >
          📸 Snap
        </button>
      )}

      {/* Opt-out */}
      {!optedOut && (
        <p
          onClick={handleOptOut}
          className="text-blue-600 underline cursor-pointer"
        >
          I don’t want to take a picture
        </p>
      )}

      {/* Next button appears if user snapped a photo OR opted out */}
      {(capturedImage || optedOut) && (
        <button
          onClick={goToCharacterPage}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition mt-4"
        >
          ➡️ Next: Choose Character
        </button>
      )}
    </div>
  );
}
