"use client";

import { useSimpleNavigation } from "@/hooks/useSimpleNavigation";
import Image from "next/image";

export default function Page2() {
  useSimpleNavigation();

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-blue-100">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-800">Page 2 - Nature</h1>
        <Image 
          src="https://picsum.photos/300/200?random=2" 
          alt="Random Nature" 
          width={300}
          height={200}
          className="rounded-lg shadow-lg"
        />
        <p className="text-lg text-gray-600">Use ← → arrow keys to navigate</p>
      </div>
    </div>
  );
}
