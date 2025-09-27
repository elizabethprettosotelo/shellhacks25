// Character creation types and data
export interface CharacterPart {
  id: string;
  name: string;
  imageUrl: string;
  category: CharacterCategory;
}

export type CharacterCategory = 'body' | 'hair' | 'bangs' | 'eyes' | 'mouth' | 'clothes';

export interface Character {
  id: string;
  name: string;
  body: string;
  hair: string;
  bangs?: string;
  eyes: string;
  mouth: string;
  clothes: string;
  personality?: string[];
  backstory?: string;
  createdAt: Date;
  createdFrom?: 'manual' | 'ai-photo';
}

// Sample character parts data - in real app, these would come from your Google Drive assets
export const characterParts: Record<CharacterCategory, CharacterPart[]> = {
  body: [
    { id: 'body-1', name: 'Light Skin', imageUrl: '/assets/body/light-skin.png', category: 'body' },
    { id: 'body-2', name: 'Medium Skin', imageUrl: '/assets/body/medium-skin.png', category: 'body' },
    { id: 'body-3', name: 'Dark Skin', imageUrl: '/assets/body/dark-skin.png', category: 'body' },
  ],
  hair: [
    { id: 'hair-1', name: 'Short Brown', imageUrl: '/assets/hair/short-brown.png', category: 'hair' },
    { id: 'hair-2', name: 'Long Blonde', imageUrl: '/assets/hair/long-blonde.png', category: 'hair' },
    { id: 'hair-3', name: 'Curly Black', imageUrl: '/assets/hair/curly-black.png', category: 'hair' },
    { id: 'hair-4', name: 'Red Waves', imageUrl: '/assets/hair/red-waves.png', category: 'hair' },
  ],
  bangs: [
    { id: 'bangs-1', name: 'Side Swept', imageUrl: '/assets/bangs/side-swept.png', category: 'bangs' },
    { id: 'bangs-2', name: 'Straight', imageUrl: '/assets/bangs/straight.png', category: 'bangs' },
    { id: 'bangs-3', name: 'Wispy', imageUrl: '/assets/bangs/wispy.png', category: 'bangs' },
    { id: 'bangs-none', name: 'No Bangs', imageUrl: '/assets/bangs/none.png', category: 'bangs' },
  ],
  eyes: [
    { id: 'eyes-1', name: 'Brown Eyes', imageUrl: '/assets/eyes/brown.png', category: 'eyes' },
    { id: 'eyes-2', name: 'Blue Eyes', imageUrl: '/assets/eyes/blue.png', category: 'eyes' },
    { id: 'eyes-3', name: 'Green Eyes', imageUrl: '/assets/eyes/green.png', category: 'eyes' },
    { id: 'eyes-4', name: 'Hazel Eyes', imageUrl: '/assets/eyes/hazel.png', category: 'eyes' },
  ],
  mouth: [
    { id: 'mouth-1', name: 'Smile', imageUrl: '/assets/mouth/smile.png', category: 'mouth' },
    { id: 'mouth-2', name: 'Neutral', imageUrl: '/assets/mouth/neutral.png', category: 'mouth' },
    { id: 'mouth-3', name: 'Smirk', imageUrl: '/assets/mouth/smirk.png', category: 'mouth' },
    { id: 'mouth-4', name: 'Surprised', imageUrl: '/assets/mouth/surprised.png', category: 'mouth' },
  ],
  clothes: [
    { id: 'clothes-1', name: 'Casual T-Shirt', imageUrl: '/assets/clothes/tshirt.png', category: 'clothes' },
    { id: 'clothes-2', name: 'Button-Up', imageUrl: '/assets/clothes/button-up.png', category: 'clothes' },
    { id: 'clothes-3', name: 'Hoodie', imageUrl: '/assets/clothes/hoodie.png', category: 'clothes' },
    { id: 'clothes-4', name: 'Dress', imageUrl: '/assets/clothes/dress.png', category: 'clothes' },
  ],
};

// Default character for new creations
export const defaultCharacter: Omit<Character, 'id' | 'createdAt'> = {
  name: 'New Character',
  body: 'body-1',
  hair: 'hair-1',
  bangs: 'bangs-none',
  eyes: 'eyes-1',
  mouth: 'mouth-1',
  clothes: 'clothes-1',
  personality: [],
  backstory: '',
};

// Personality traits for character building
export const personalityTraits = [
  'Brave', 'Curious', 'Funny', 'Kind', 'Smart', 'Creative', 'Adventurous',
  'Loyal', 'Mysterious', 'Optimistic', 'Determined', 'Witty', 'Caring',
  'Bold', 'Thoughtful', 'Energetic', 'Patient', 'Imaginative'
];

// Helper functions
export const getPartById = (category: CharacterCategory, id: string): CharacterPart | undefined => {
  return characterParts[category].find(part => part.id === id);
};

export const getPartsByCategory = (category: CharacterCategory): CharacterPart[] => {
  return characterParts[category];
};