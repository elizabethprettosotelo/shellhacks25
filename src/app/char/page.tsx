"use client";

import { useState } from "react";
import { useSimpleNavigation } from "@/hooks/useSimpleNavigation";
import { useCharacterContext } from "@/contexts/CharacterContext";
import CharacterCreator from "../../components/CharacterCreator";
import { Button } from "@/components/ui/button";
import { Character } from "@/lib/characterData";

export default function CharacterPage() {
  useSimpleNavigation();
  const { saveCharacter, setCurrentCharacter, currentCharacter } = useCharacterContext();
  const [mode, setMode] = useState<'selection' | 'create-manual' | 'create-photo'>('selection');

  const handleCharacterComplete = (character: Character) => {
    saveCharacter(character);
    setCurrentCharacter(character);
    setMode('selection');
  };

  const handleTakePhoto = () => {
    // Navigate to capture page for photo-based character creation
    window.location.href = '/capture?mode=character';
  };

  if (mode === 'create-manual') {
    return (
      <div className="min-h-screen w-screen bg-gradient-to-br from-yellow-100 to-orange-100 p-4 overflow-auto">
        <div className="mb-4">
          <Button 
            variant="outline"
            onClick={() => setMode('selection')}
            className="mb-4"
          >
            ← Back to Character Selection
          </Button>
        </div>
        <CharacterCreator onCharacterComplete={handleCharacterComplete} />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 to-orange-100 p-8">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Create Your Character</h1>
          <p className="text-lg text-gray-600 mb-8">
            Every great adventure needs a hero. Choose how you&rsquo;d like to create your character:
          </p>
        </div>

        {/* Current Character Display */}
        {currentCharacter && (
          <div className="bg-white rounded-lg p-6 shadow-lg border-2 border-green-200 mb-8">
            <h2 className="text-xl font-semibold text-green-800 mb-2">Your Current Character</h2>
            <div className="flex items-center justify-center space-x-4">
              <div className="w-16 h-20 bg-blue-200 rounded-lg flex items-center justify-center">
                🧑‍🎨
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold">{currentCharacter.name}</h3>
                <p className="text-sm text-gray-600">
                  {currentCharacter.personality?.slice(0, 3).join(', ')}
                </p>
                <p className="text-xs text-gray-500">
                  Created {currentCharacter.createdAt.toLocaleDateString()}
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setMode('create-manual')}
              className="mt-4"
            >
              Edit Character
            </Button>
          </div>
        )}

        {/* Character Creation Options */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Manual Creation */}
          <div className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-6xl mb-4">🎨</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Create Manually</h2>
            <p className="text-gray-600 mb-6">
              Design your character from scratch using our character builder. 
              Choose appearance, personality traits, and write their backstory.
            </p>
            <ul className="text-left text-sm text-gray-600 mb-6 space-y-2">
              <li>✓ Choose body type, hair, eyes, and clothing</li>
              <li>✓ Select personality traits</li>
              <li>✓ Write custom backstory</li>
              <li>✓ Full creative control</li>
            </ul>
            <Button 
              onClick={() => setMode('create-manual')}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Start Creating →
            </Button>
          </div>

          {/* Photo-Based Creation */}
          <div className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-6xl mb-4">📸</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Create from Photo</h2>
            <p className="text-gray-600 mb-6">
              Take a photo of yourself and let AI analyze it to suggest character 
              traits, appearance, and personality based on your image.
            </p>
            <ul className="text-left text-sm text-gray-600 mb-6 space-y-2">
              <li>✓ AI analyzes your photo</li>
              <li>✓ Suggests character traits</li>
              <li>✓ Creates personality profile</li>
              <li>✓ Quick and personalized</li>
            </ul>
            <Button 
              onClick={handleTakePhoto}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Take Photo →
            </Button>
          </div>
        </div>

        <div className="text-gray-500 text-sm mt-8">
          <p>Use ← → arrow keys to navigate between pages</p>
        </div>
      </div>
    </div>
  );
}
