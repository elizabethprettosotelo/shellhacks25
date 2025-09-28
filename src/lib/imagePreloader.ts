// Preload character assets for better performance
import { characterParts } from './characterData';

let preloadingPromise: Promise<void> | null = null;

export const preloadCharacterAssets = (): Promise<void> => {
  if (preloadingPromise) return preloadingPromise;

  preloadingPromise = new Promise((resolve) => {
    const imagesToPreload: string[] = [];
    
    // Collect all non-empty image URLs
    Object.values(characterParts).forEach(parts => {
      parts.forEach(part => {
        if (part.imageUrl && part.imageUrl.trim()) {
          imagesToPreload.push(part.imageUrl);
        }
      });
    });

    // Preload images
    let loadedCount = 0;
    const totalImages = imagesToPreload.length;

    if (totalImages === 0) {
      resolve();
      return;
    }

    const checkComplete = () => {
      loadedCount++;
      if (loadedCount === totalImages) {
        resolve();
      }
    };

    imagesToPreload.forEach(url => {
      const img = new Image();
      img.onload = checkComplete;
      img.onerror = checkComplete; // Continue even if some images fail
      img.src = url;
    });
  });

  return preloadingPromise;
};

// Preload only essential assets (body, hair, eyes, mouth, clothes)
export const preloadEssentialAssets = (): Promise<void> => {
  const essentialCategories = ['body', 'hair', 'eyes', 'mouth', 'clothes'];
  const imagesToPreload: string[] = [];
  
  essentialCategories.forEach(category => {
    const parts = characterParts[category as keyof typeof characterParts];
    if (parts) {
      parts.slice(0, 5).forEach(part => { // Only preload first 5 of each category
        if (part.imageUrl && part.imageUrl.trim()) {
          imagesToPreload.push(part.imageUrl);
        }
      });
    }
  });

  return new Promise((resolve) => {
    let loadedCount = 0;
    const totalImages = imagesToPreload.length;

    if (totalImages === 0) {
      resolve();
      return;
    }

    const checkComplete = () => {
      loadedCount++;
      if (loadedCount === totalImages) {
        resolve();
      }
    };

    imagesToPreload.forEach(url => {
      const img = new Image();
      img.onload = checkComplete;
      img.onerror = checkComplete;
      img.src = url;
    });
  });
};