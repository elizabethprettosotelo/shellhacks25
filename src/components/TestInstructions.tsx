"use client";

import { useSimpleNavigation } from "@/hooks/useSimpleNavigation";

export default function TestInstructions() {
  useSimpleNavigation();

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-purple-100 to-pink-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">
          📸 Camera Test Instructions
        </h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Instructions */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">🎯 How to Test</h2>
            <ol className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">1</span>
                <span>Navigate to <code className="bg-gray-100 px-2 py-1 rounded">/char</code> page and select &ldquo;Create from Photo&rdquo;</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">2</span>
                <span>Click <strong>&ldquo;Start Camera&rdquo;</strong> button</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">3</span>
                <span>Allow camera permissions when prompted</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">4</span>
                <span>See yourself in the live video feed</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">5</span>
                <span>Click <strong>&ldquo;Capture Photo&rdquo;</strong> to take picture</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">6</span>
                <span>See captured image appear on the right</span>
              </li>
            </ol>
          </div>

          {/* Where Pictures Go */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">💾 Where Are Pictures?</h2>
            <div className="space-y-4 text-gray-700">
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                <h3 className="font-semibold text-green-800">✅ Visible in Browser</h3>
                <p className="text-sm">Images appear in the web interface immediately</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <h3 className="font-semibold text-blue-800">🤖 Sent to Gemini AI</h3>
                <p className="text-sm">Images are analyzed for emotions, content, etc.</p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                <h3 className="font-semibold text-yellow-800">📥 Download Available</h3>
                <p className="text-sm">Click &ldquo;Download Image&rdquo; to save to your Downloads folder</p>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                <h3 className="font-semibold text-red-800">⚠️ Not Auto-Saved</h3>
                <p className="text-sm">Images disappear when you refresh unless downloaded</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">🚀 Quick Actions</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <a 
              href="/char" 
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-center transition-colors"
            >
              📸 Go to Character Creator
            </a>
            <button 
              onClick={() => window.location.reload()}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              🔄 Refresh Page
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-600">
          <p>Use ← → arrow keys to navigate between pages</p>
        </div>
      </div>
    </div>
  );
}