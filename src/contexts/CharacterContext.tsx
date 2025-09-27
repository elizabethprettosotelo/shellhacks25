"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Character } from '../lib/characterData';

interface CharacterContextType {
  characters: Character[];
  currentCharacter: Character | null;
  saveCharacter: (character: Character) => void;
  setCurrentCharacter: (character: Character | null) => void;
  deleteCharacter: (characterId: string) => void;
  getCharacterById: (characterId: string) => Character | undefined;
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

const STORAGE_KEY = 'shellhacks-characters';
const CURRENT_CHARACTER_KEY = 'shellhacks-current-character';

export function CharacterProvider({ children }: { children: ReactNode }) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [currentCharacter, setCurrentCharacter] = useState<Character | null>(null);

  // Load characters from localStorage on mount
  useEffect(() => {
    try {
      const savedCharacters = localStorage.getItem(STORAGE_KEY);
      const savedCurrentCharacter = localStorage.getItem(CURRENT_CHARACTER_KEY);
      
      if (savedCharacters) {
        const parsedCharacters = JSON.parse(savedCharacters);
        setCharacters(parsedCharacters);
      }
      
      if (savedCurrentCharacter) {
        const parsedCurrentCharacter = JSON.parse(savedCurrentCharacter);
        setCurrentCharacter(parsedCurrentCharacter);
      }
    } catch (error) {
      console.error('Error loading characters from localStorage:', error);
    }
  }, []);

  // Save characters to localStorage whenever characters change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
    } catch (error) {
      console.error('Error saving characters to localStorage:', error);
    }
  }, [characters]);

  // Save current character to localStorage whenever it changes
  useEffect(() => {
    try {
      if (currentCharacter) {
        localStorage.setItem(CURRENT_CHARACTER_KEY, JSON.stringify(currentCharacter));
      } else {
        localStorage.removeItem(CURRENT_CHARACTER_KEY);
      }
    } catch (error) {
      console.error('Error saving current character to localStorage:', error);
    }
  }, [currentCharacter]);

  const saveCharacter = (character: Character) => {
    setCharacters(prev => {
      const existing = prev.find(c => c.id === character.id);
      if (existing) {
        // Update existing character
        return prev.map(c => c.id === character.id ? character : c);
      } else {
        // Add new character
        return [...prev, character];
      }
    });
  };

  const deleteCharacter = (characterId: string) => {
    setCharacters(prev => prev.filter(c => c.id !== characterId));
    
    // If this was the current character, clear it
    if (currentCharacter?.id === characterId) {
      setCurrentCharacter(null);
    }
  };

  const getCharacterById = (characterId: string): Character | undefined => {
    return characters.find(c => c.id === characterId);
  };

  const contextValue: CharacterContextType = {
    characters,
    currentCharacter,
    saveCharacter,
    setCurrentCharacter,
    deleteCharacter,
    getCharacterById,
  };

  return (
    <CharacterContext.Provider value={contextValue}>
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacterContext(): CharacterContextType {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error('useCharacterContext must be used within a CharacterProvider');
  }
  return context;
}