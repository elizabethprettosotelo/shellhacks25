"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Character,
  CharacterCategory,
  defaultCharacter,
  characterParts,
  getPartById,
  personalityTraits,
} from "@/lib/characterData";

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
    <div className="relative w-64 h-80 border-2 border-gray-300 rounded-lg bg-gray-50 overflow-hidden">
      {/* Layer the character parts in proper order */}
      
      {/* Hair (back layer - behind everything) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-48 h-48" style={{ transform: 'translate(0px, -10px)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getPartById('hair', character.hair)?.imageUrl}
            alt="Hair"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      
      {/* Body (base layer - should be visible behind most things) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-56 h-56" style={{ transform: 'translate(0px, -10px)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getPartById('body', character.body)?.imageUrl}
            alt="Body"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      
      {/* Clothes (covers body but NOT head/face) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-34 h-34" style={{ transform: 'translate(0px, -10px) scale(0.7)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getPartById('clothes', character.clothes)?.imageUrl}
            alt="Clothes"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      
      {/* Eyes (on face - should be visible over clothes) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-48 h-48" style={{ transform: 'translate(0px, -10px)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getPartById('eyes', character.eyes)?.imageUrl}
            alt="Eyes"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      
      {/* Mouth (on face - should be visible over clothes) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-48 h-48" style={{ transform: 'translate(0px, -10px)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getPartById('mouth', character.mouth)?.imageUrl}
            alt="Mouth"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Blush (on face - should be visible over clothes) */}
      {character.blush && character.blush !== 'blush-none' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-48 h-48" style={{ transform: 'translate(0px, -10px)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getPartById('blush', character.blush)?.imageUrl}
              alt="Blush"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}

      {/* Facial Accessories (covers face but should appear over clothes) */}
      {character.facialAccessory && character.facialAccessory !== 'facialAccessory-none' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-48 h-48" style={{ transform: 'translate(0px, -10px)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getPartById('facialAccessory', character.facialAccessory)?.imageUrl}
              alt="Facial Accessory"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}

      {/* Facial Hair (covers lower body/face) */}
      {character.facialHair && character.facialHair !== 'facialHair-none' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-48 h-48" style={{ transform: 'translate(0px, -10px)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getPartById('facialHair', character.facialHair)?.imageUrl}
              alt="Facial Hair"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}

      {/* Bangs (covers body/hair) */}
      {character.bangs && character.bangs !== 'bangs-none' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-48 h-48" style={{ transform: 'translate(0px, -10px)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getPartById('bangs', character.bangs)?.imageUrl}
              alt="Bangs"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}

      {/* Accessories (covers everything) */}
      {character.accessory && character.accessory !== 'accessory-none' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-48 h-48" style={{ transform: 'translate(0px, -10px)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getPartById('accessory', character.accessory)?.imageUrl}
              alt="Accessory"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );

  // Part selector component
  const PartSelector = ({ category, title }: { category: CharacterCategory; title: string }) => (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {characterParts[category].map((part) => (
          <button
            key={part.id}
            onClick={() => updateCharacterPart(category, part.id)}
            className={`p-2 border-2 rounded-lg transition-all ${
              character[category] === part.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="w-12 h-12 bg-gray-100 rounded mx-auto mb-2 overflow-hidden">
              {part.imageUrl ? (
                <Image
                  src={part.imageUrl}
                  alt={part.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                  None
                </div>
              )}
            </div>
            <p className="text-xs font-medium truncate">{part.name}</p>
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
              <PartSelector category="accessory" title="Glasses" />
              <PartSelector category="blush" title="Blush" />
              <PartSelector category="facialAccessory" title="Moles" />
              <PartSelector category="facialHair" title="Facial Hair" />
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