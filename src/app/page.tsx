"use client";

import { useSimpleNavigation } from "@/hooks/useSimpleNavigation";
import Image from "next/image";

export default function Page1() {
  useSimpleNavigation();

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-800">Page 1 - Ocean</h1>
        <Image 
          src="https://picsum.photos/300/200?random=1" 
          alt="Random Ocean" 
          width={300}
          height={200}
          className="rounded-lg shadow-lg"
          priority
        />
        <p className="text-lg text-gray-600">Use ← → arrow keys to navigate</p>
      </div>
    </div>
  );
}
