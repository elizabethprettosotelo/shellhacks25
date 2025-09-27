"use client";

import { useKeyNavigation } from "@/hooks/useKeyNavigation";

const PAGE_NAMES = {
  '/': 'Home',
  '/capture': 'Camera',
  '/char': 'Character',
  '/story': 'Story'
};

export function NavigationIndicator() {
  const { currentPage, pages, getCurrentIndex } = useKeyNavigation();
  const currentIndex = getCurrentIndex();

  return (
    <div className="fixed top-4 right-4 bg-black/70 text-white px-4 py-2 rounded-lg text-sm z-50">
      <div className="flex items-center gap-2">
        <span>Page {currentIndex + 1}/{pages.length}:</span>
        <span className="font-semibold">{PAGE_NAMES[currentPage as keyof typeof PAGE_NAMES]}</span>
      </div>
      <div className="text-xs opacity-75 mt-1">
        Use ← → arrow keys to navigate
      </div>
    </div>
  );
}