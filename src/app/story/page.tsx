"use client";

import { useSimpleNavigation } from "@/hooks/useSimpleNavigation";
import Image from "next/image";

export default function Page4() {
  useSimpleNavigation();

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-800">Page 4 - Abstract</h1>
        <Image 
          src="https://picsum.photos/300/200?random=4" 
          alt="Random Abstract" 
          width={300}
          height={200}
          className="rounded-lg shadow-lg"
        />
        <p className="text-lg text-gray-600">Use ← → arrow keys to navigate</p>
      </div>
    </div>
  );
}
