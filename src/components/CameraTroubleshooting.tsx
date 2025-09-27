"use client";

import { Button } from "@/components/ui/button";

interface CameraTroubleshootingProps {
  onDismiss: () => void;
}

export default function CameraTroubleshooting({ onDismiss }: CameraTroubleshootingProps) {
  return (
    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-yellow-800 mb-4">
        📹 Camera Not Working? Here&rsquo;s How to Fix It:
      </h3>
      
      <div className="space-y-4 text-sm text-yellow-700">
        <div>
          <h4 className="font-semibold mb-2">🔒 Permission Issues:</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Look for a camera icon in your browser&rsquo;s address bar</li>
            <li>Click it and select &ldquo;Always allow&rdquo; for camera access</li>
            <li>Refresh the page after granting permission</li>
            <li>In Chrome: Settings → Privacy → Site Settings → Camera</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">📱 Browser Compatibility:</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>✅ Chrome, Firefox, Safari (modern versions)</li>
            <li>❌ Internet Explorer not supported</li>
            <li>🔒 HTTPS required (localhost works for development)</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">🔧 Other Issues:</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Close other apps using your camera (Zoom, Teams, etc.)</li>
            <li>Try refreshing the page</li>
            <li>Restart your browser</li>
            <li>Check if your camera works in other applications</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">🖥️ Desktop vs Mobile:</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Desktop: Usually front webcam</li>
            <li>Mobile: Front-facing camera by default</li>
            <li>Make sure camera isn&rsquo;t covered or disabled</li>
          </ul>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <Button onClick={onDismiss} className="bg-yellow-600 hover:bg-yellow-700">
          Got It, Let Me Try
        </Button>
        <Button 
          variant="outline"
          onClick={() => window.open('https://support.google.com/chrome/answer/2693767', '_blank')}
        >
          📖 Chrome Camera Help
        </Button>
      </div>
    </div>
  );
}