"use client";

import { useSimpleNavigation } from "@/hooks/useSimpleNavigation";

export default function HomePage() {
  useSimpleNavigation();

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="text-center space-y-6 max-w-md mx-auto p-6">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">Character Creator</h1>
        <div className="bg-white/80 backdrop-blur rounded-lg p-6 shadow-lg">
          <p className="text-lg text-gray-700 mb-4">
            Create amazing characters with AI-powered photo analysis or manual customization
          </p>
          <div className="space-y-2 text-sm text-gray-600">
            <p>📸 <strong>Capture</strong> - Take photos and generate characters</p>
            <p>🎨 <strong>Create</strong> - Manually design your character</p>
            <p>📖 <strong>Story</strong> - Generate backstories and personalities</p>
          </div>
        </div>
        <p className="text-lg text-gray-600">Use ← → arrow keys to navigate</p>
      </div>
    </div>
  );
}
