"use client"; // needed because CharacterCustomizer uses useState

import CharacterCustomizer from "@/components/characters";

export default function CharPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <CharacterCustomizer />
    </div>
  );
}
