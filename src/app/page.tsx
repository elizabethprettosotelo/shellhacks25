"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function StartMenu() {
  const router = useRouter();

  const handleStart = () => {
    router.push("/capture"); // navigate to your camera page
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200">
      <div className="text-center space-y-6">
        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-800 drop-shadow-lg">
          📖 Choose Your Own Insurance Adventure!
        </h1>
        <p className="text-lg text-gray-600">
          A fun way to learn about insurance while building your character ✨
        </p>

        {/* Start Button */}
        <Button
          className="px-6 py-3 text-xl bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg transition-all"
          onClick={handleStart}
        >
          🚀 Start Adventure
        </Button>
      </div>
    </div>
  );
}
