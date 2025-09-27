"use client";

import { useSimpleNavigation } from "@/hooks/useSimpleNavigation";
import { useSearchParams } from 'next/navigation';
import CameraCapture from "../../components/CameraCapture";

export default function CapturePage() {
  useSimpleNavigation();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') === 'character' ? 'character' : 'analysis';

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-green-100 to-blue-100 p-4 overflow-auto">
      <CameraCapture mode={mode} />
    </div>
  );
}
