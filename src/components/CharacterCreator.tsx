"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Character,
  CharacterCategory,
  defaultCharacter,
  characterParts,
  personalityTraits,
  getPartById,
} from "../lib/characterData";

interface CharacterCreatorProps {
  onCharacterComplete?: (character: Character) => void;
  initialCharacter?: Partial<Character>;
}

export default function CharacterCreator({ onCharacterComplete, initialCharacter }: CharacterCreatorProps) {
  const [character, setCharacter] = useState<Omit<Character, 'id' | 'createdAt'>>({
    ...defaultCharacter,
    ...initialCharacter,
  });

  const [currentStep, setCurrentStep] = useState<'appearance' | 'personality' | 'story'>('appearance');

  // Update character part
  const updateCharacterPart = (category: CharacterCategory, partId: string) => {
    setCharacter(prev => ({
      ...prev,
      [category]: partId,
    }));
  };

  // Toggle personality trait
  const togglePersonalityTrait = (trait: string) => {
    setCharacter(prev => ({
      ...prev,
      personality: prev.personality?.includes(trait)
        ? prev.personality.filter(t => t !== trait)
        : [...(prev.personality || []), trait],
    }));
  };

  // Update character name
  const updateName = (name: string) => {
    setCharacter(prev => ({ ...prev, name }));
  };

  // Update backstory
  const updateBackstory = (backstory: string) => {
    setCharacter(prev => ({ ...prev, backstory }));
  };

  // Complete character creation
  const completeCharacter = () => {
    const finalCharacter: Character = {
      ...character,
      id: `char-${Date.now()}`,
      createdAt: new Date(),
      createdFrom: 'manual',
    };
    onCharacterComplete?.(finalCharacter);
  };

  // Character preview component
  const CharacterPreview = () => (
    <div className="relative w-48 h-64 mx-auto border-2 border-gray-300 rounded-lg bg-gray-50 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        {/* This would layer the character parts */}
        <div className="relative w-full h-full">
          {/* Body */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-40 bg-blue-200 rounded-full flex items-end justify-center text-xs text-gray-600">
              {getPartById('body', character.body)?.name}
            </div>
          </div>
          
          {/* Clothes */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="w-24 h-16 bg-green-200 rounded text-xs text-center pt-1">
              {getPartById('clothes', character.clothes)?.name}
            </div>
          </div>
          
          {/* Hair */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
            <div className="w-20 h-12 bg-yellow-600 rounded-full text-xs text-center pt-1 text-white">
              {getPartById('hair', character.hair)?.name}
            </div>
          </div>
          
          {/* Eyes */}
          <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
            <div className="w-16 h-8 bg-blue-400 rounded-full text-xs text-center pt-1 text-white">
              {getPartById('eyes', character.eyes)?.name}
            </div>
          </div>
          
          {/* Mouth */}
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
            <div className="w-12 h-4 bg-red-300 rounded-full text-xs text-center">
              {getPartById('mouth', character.mouth)?.name.split(' ')[0]}
            </div>
          </div>
        </div>
      </div>
      
      {/* Character name */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded text-sm font-semibold">
        {character.name}
      </div>
    </div>
  );

  // Part selector component
  const PartSelector = ({ category, title }: { category: CharacterCategory; title: string }) => (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {characterParts[category].map((part) => (
          <button
            key={part.id}
            onClick={() => updateCharacterPart(category, part.id)}
            className={`p-3 border-2 rounded-lg transition-all ${
              character[category] === part.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="w-16 h-16 bg-gray-100 rounded mx-auto mb-2 flex items-center justify-center text-xs">
              🎨
            </div>
            <p className="text-sm font-medium">{part.name}</p>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Your Character</h1>
        <p className="text-gray-600">Design your hero for the adventure ahead!</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Character Preview */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <h2 className="text-xl font-semibold mb-4 text-center">Preview</h2>
            <CharacterPreview />
            
            {/* Character name input */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Character Name
              </label>
              <input
                type="text"
                value={character.name}
                onChange={(e) => updateName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter character name"
              />
            </div>
          </div>
        </div>

        {/* Character Creator */}
        <div className="lg:col-span-2">
          <Tabs value={currentStep} onValueChange={(value) => setCurrentStep(value as 'appearance' | 'personality' | 'story')}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="personality">Personality</TabsTrigger>
              <TabsTrigger value="story">Story</TabsTrigger>
            </TabsList>

            <TabsContent value="appearance" className="space-y-6">
              <PartSelector category="body" title="Body Type" />
              <PartSelector category="hair" title="Hair Style" />
              <PartSelector category="bangs" title="Bangs" />
              <PartSelector category="eyes" title="Eyes" />
              <PartSelector category="mouth" title="Expression" />
              <PartSelector category="clothes" title="Outfit" />
            </TabsContent>

            <TabsContent value="personality" className="space-y-4">
              <h3 className="text-lg font-semibold">Personality Traits</h3>
              <p className="text-gray-600">Select traits that describe your character (choose up to 5):</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {personalityTraits.map((trait) => (
                  <button
                    key={trait}
                    onClick={() => togglePersonalityTrait(trait)}
                    disabled={!character.personality?.includes(trait) && (character.personality?.length || 0) >= 5}
                    className={`p-3 border-2 rounded-lg transition-all ${
                      character.personality?.includes(trait)
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-gray-300'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {trait}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                Selected: {character.personality?.length || 0}/5
              </p>
            </TabsContent>

            <TabsContent value="story" className="space-y-4">
              <h3 className="text-lg font-semibold">Character Backstory</h3>
              <p className="text-gray-600">Tell us about your character&rsquo;s background:</p>
              <textarea
                value={character.backstory || ''}
                onChange={(e) => updateBackstory(e.target.value)}
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Where did your character come from? What motivates them? What's their goal?"
              />
              
              <div className="flex justify-between pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep('personality')}
                >
                  ← Back
                </Button>
                <Button 
                  onClick={completeCharacter}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Complete Character ✨
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {/* Navigation buttons for appearance and personality tabs */}
          {currentStep === 'appearance' && (
            <div className="flex justify-end pt-4">
              <Button onClick={() => setCurrentStep('personality')}>
                Next: Personality →
              </Button>
            </div>
          )}

          {currentStep === 'personality' && (
            <div className="flex justify-between pt-4">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep('appearance')}
              >
                ← Back
              </Button>
              <Button onClick={() => setCurrentStep('story')}>
                Next: Story →
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}