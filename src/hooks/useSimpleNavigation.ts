"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const PAGES = ['/', '/char', '/story'];

export function useSimpleNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) {
        return;
      }

      event.preventDefault();
      
      const currentIndex = PAGES.indexOf(pathname);
      if (currentIndex === -1) return;

      let nextIndex;
      if (event.key === 'ArrowRight') {
        nextIndex = (currentIndex + 1) % PAGES.length;
      } else if (event.key === 'ArrowLeft') {
        nextIndex = currentIndex === 0 ? PAGES.length - 1 : currentIndex - 1;
      }

      if (nextIndex !== undefined) {
        router.push(PAGES[nextIndex]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [pathname, router]);
}