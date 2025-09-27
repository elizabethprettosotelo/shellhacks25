import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// Define the page order for navigation
const PAGES = [
  '/',
  '/capture',
  '/char',
  '/story'
];

export function useKeyNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle arrow keys
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) {
        return;
      }

      // Prevent default behavior (like scrolling)
      event.preventDefault();

      const currentIndex = PAGES.indexOf(pathname);
      if (currentIndex === -1) return; // Current page not in navigation list

      let nextIndex;
      if (event.key === 'ArrowRight') {
        // Go to next page, wrap around to first if at the end
        nextIndex = (currentIndex + 1) % PAGES.length;
      } else if (event.key === 'ArrowLeft') {
        // Go to previous page, wrap around to last if at the beginning
        nextIndex = currentIndex === 0 ? PAGES.length - 1 : currentIndex - 1;
      }

      if (nextIndex !== undefined) {
        router.push(PAGES[nextIndex]);
      }
    };

    // Add event listener to document
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup event listener on unmount
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [pathname, router]);

  return {
    currentPage: pathname,
    pages: PAGES,
    getCurrentIndex: () => PAGES.indexOf(pathname),
    navigateToPage: (index: number) => {
      if (index >= 0 && index < PAGES.length) {
        router.push(PAGES[index]);
      }
    }
  };
}