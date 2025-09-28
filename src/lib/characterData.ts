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
  bangs?: string; // Optional bangs that render in front
  eyes: string;
  mouth: string;
  clothes: string;
  personality?: string[];
  backstory?: string;
  createdAt: Date | string; // Can be Date object or ISO string
  createdFrom?: 'manual' | 'ai-photo';
}

// Character parts data using real assets from public/charassets
export const characterParts: Record<CharacterCategory, CharacterPart[]> = {
  body: [
    { id: 'body-1', name: 'Body 1', imageUrl: '/charassets/body/Body 1.PNG', category: 'body' },
    { id: 'body-2', name: 'Body 2', imageUrl: '/charassets/body/Body 2.PNG', category: 'body' },
    { id: 'body-3', name: 'Body 3', imageUrl: '/charassets/body/Body 3.PNG', category: 'body' },
    { id: 'body-4', name: 'Body 4', imageUrl: '/charassets/body/Body 4.PNG', category: 'body' },
    { id: 'body-5', name: 'Body 5', imageUrl: '/charassets/body/Body 5.PNG', category: 'body' },
    { id: 'body-6', name: 'Body 6', imageUrl: '/charassets/body/Body 6.PNG', category: 'body' },
    { id: 'body-7', name: 'Body 7', imageUrl: '/charassets/body/Body 7.PNG', category: 'body' },
    { id: 'body-8', name: 'Body 8', imageUrl: '/charassets/body/Body 8.PNG', category: 'body' },
    { id: 'body-9', name: 'Body 9', imageUrl: '/charassets/body/Body 9.PNG', category: 'body' },
  ],
  hair: [
    { id: 'hair-1', name: 'Hair 1', imageUrl: '/charassets/hair/Hair 1.PNG', category: 'hair' },
    { id: 'hair-2', name: 'Hair 2', imageUrl: '/charassets/hair/Hair 2.PNG', category: 'hair' },
    { id: 'hair-3', name: 'Hair 3', imageUrl: '/charassets/hair/Hair 3.PNG', category: 'hair' },
    { id: 'hair-4', name: 'Hair 4', imageUrl: '/charassets/hair/Hair 4.PNG', category: 'hair' },
    { id: 'hair-5', name: 'Hair 5', imageUrl: '/charassets/hair/Hair 5.PNG', category: 'hair' },
    { id: 'hair-6', name: 'Hair 6', imageUrl: '/charassets/hair/Hair 6.PNG', category: 'hair' },
    { id: 'hair-7', name: 'Hair 7', imageUrl: '/charassets/hair/Hair 7.PNG', category: 'hair' },
  ],
  bangs: [
    { id: 'bangs-none', name: 'No Bangs', imageUrl: '', category: 'bangs' },
    { id: 'bangs-1', name: 'Bangs 1', imageUrl: '/charassets/bangs/Bangs 1.PNG', category: 'bangs' },
    { id: 'bangs-2', name: 'Bangs 2', imageUrl: '/charassets/bangs/Bangs 2.PNG', category: 'bangs' },
    { id: 'bangs-3', name: 'Bangs 3', imageUrl: '/charassets/bangs/Bangs 3.PNG', category: 'bangs' },
    { id: 'bangs-4', name: 'Bangs 4', imageUrl: '/charassets/bangs/Bangs 4.PNG', category: 'bangs' },
    { id: 'bangs-5', name: 'Bangs 5', imageUrl: '/charassets/bangs/Bangs 5.PNG', category: 'bangs' },
    { id: 'bangs-6', name: 'Bangs 6', imageUrl: '/charassets/bangs/Bangs 6.PNG', category: 'bangs' },
    { id: 'bangs-7', name: 'Bangs 7', imageUrl: '/charassets/bangs/Bangs 7.PNG', category: 'bangs' },
  ],
  eyes: [
    { id: 'eyes-1', name: 'Eyes 1', imageUrl: '/charassets/eyes/Eyes 1.PNG', category: 'eyes' },
    { id: 'eyes-2', name: 'Eyes 2', imageUrl: '/charassets/eyes/Eyes 2.PNG', category: 'eyes' },
    { id: 'eyes-3', name: 'Eyes 3', imageUrl: '/charassets/eyes/Eyes 3.PNG', category: 'eyes' },
    { id: 'eyes-4', name: 'Eyes 4', imageUrl: '/charassets/eyes/Eyes 4.PNG', category: 'eyes' },
    { id: 'eyes-5', name: 'Eyes 5', imageUrl: '/charassets/eyes/Eyes 5.PNG', category: 'eyes' },
  ],
  mouth: [
    { id: 'mouth-1', name: 'Mouth 1', imageUrl: '/charassets/mouth/Mouth 1.PNG', category: 'mouth' },
    { id: 'mouth-2', name: 'Mouth 2', imageUrl: '/charassets/mouth/Mouth 2.PNG', category: 'mouth' },
    { id: 'mouth-3', name: 'Mouth 3', imageUrl: '/charassets/mouth/Mouth 3 .PNG', category: 'mouth' },
    { id: 'mouth-4', name: 'Mouth 4', imageUrl: '/charassets/mouth/Mouth 4.PNG', category: 'mouth' },
    { id: 'mouth-5', name: 'Mouth 5', imageUrl: '/charassets/mouth/Mouth 5.PNG', category: 'mouth' },
    { id: 'mouth-6', name: 'Mouth 6', imageUrl: '/charassets/mouth/Mouth 6.PNG', category: 'mouth' },
    { id: 'mouth-7', name: 'Mouth 7', imageUrl: '/charassets/mouth/Mouth 7.PNG', category: 'mouth' },
    { id: 'mouth-8', name: 'Mouth 8', imageUrl: '/charassets/mouth/Mouth 8.PNG', category: 'mouth' },
    { id: 'mouth-9', name: 'Mouth 9', imageUrl: '/charassets/mouth/Mouth 9.PNG', category: 'mouth' },
    { id: 'mouth-10', name: 'Mouth 10', imageUrl: '/charassets/mouth/Mouth 10.PNG', category: 'mouth' },
    { id: 'mouth-11', name: 'Mouth 11', imageUrl: '/charassets/mouth/Mouth 11.PNG', category: 'mouth' },
    { id: 'mouth-12', name: 'Mouth 12', imageUrl: '/charassets/mouth/Mouth 12.PNG', category: 'mouth' },
    { id: 'mouth-13', name: 'Mouth 13', imageUrl: '/charassets/mouth/Mouth 13.PNG', category: 'mouth' },
    { id: 'mouth-14', name: 'Mouth 14', imageUrl: '/charassets/mouth/Mouth 14.PNG', category: 'mouth' },
  ],
  clothes: [
    { id: 'clothes-1', name: 'Clothes 1', imageUrl: '/charassets/clothes/Clothes 1.PNG', category: 'clothes' },
    { id: 'clothes-2', name: 'Clothes 2', imageUrl: '/charassets/clothes/Clothes 2.PNG', category: 'clothes' },
    { id: 'clothes-3', name: 'Clothes 3', imageUrl: '/charassets/clothes/Clothes 3.PNG', category: 'clothes' },
    { id: 'clothes-4', name: 'Clothes 4', imageUrl: '/charassets/clothes/Clothes 4.PNG', category: 'clothes' },
    { id: 'clothes-5', name: 'Clothes 5', imageUrl: '/charassets/clothes/Clothes 5.PNG', category: 'clothes' },
    { id: 'clothes-6', name: 'Clothes 6', imageUrl: '/charassets/clothes/Clothes 6.PNG', category: 'clothes' },
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