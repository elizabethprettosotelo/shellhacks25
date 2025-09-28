"use client";

import { Character, getPartById } from "../lib/characterData";

interface CharacterDisplayProps {
  character: Character;
  size?: 'small' | 'medium' | 'large';
  showDetails?: boolean;
}

export default function CharacterDisplay({ 
  character, 
  size = 'medium', 
  showDetails = true 
}: CharacterDisplayProps) {
  const sizeClasses = {
    small: 'w-48 h-60',
    medium: 'w-96 h-[28rem]',
    large: 'w-[28rem] h-[32rem]'
  };

  const textSizes = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm mx-auto">
      {/* Character Preview */}
      <div className={`relative ${sizeClasses[size]} mx-auto border-2 border-gray-300 rounded-lg bg-gray-50 overflow-hidden mb-4`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full">
            {/* Layer the character parts - Hair behind, bangs in front */}
            
            {/* Hair (behind everything) */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getPartById('hair', character.hair)?.imageUrl}
                alt="Hair"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            
            {/* Body (base layer) */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getPartById('body', character.body)?.imageUrl}
                alt="Body"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            
            {/* Clothes */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getPartById('clothes', character.clothes)?.imageUrl}
                alt="Clothes"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            
            {/* Eyes */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getPartById('eyes', character.eyes)?.imageUrl}
                alt="Eyes"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            
            {/* Mouth */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getPartById('mouth', character.mouth)?.imageUrl}
                alt="Mouth"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            
            {/* Bangs (in front of everything) */}
            {character.bangs && character.bangs !== 'bangs-none' && (
              <div className="absolute inset-0 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getPartById('bangs', character.bangs)?.imageUrl}
                  alt="Bangs"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Character name overlay */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-xs font-semibold">
          {character.name}
        </div>
      </div>

      {/* Character Details */}
      {showDetails && (
        <div className="space-y-3">
          <div>
            <h3 className={`font-bold text-gray-800 ${textSizes[size]}`}>
              {character.name}
            </h3>
            <p className={`text-gray-600 ${textSizes[size]}`}>
              Created on {new Date(character.createdAt).toLocaleDateString()}
            </p>
          </div>

          {character.personality && character.personality.length > 0 && (
            <div>
              <h4 className={`font-semibold text-gray-700 ${textSizes[size]} mb-1`}>
                Personality Traits
              </h4>
              <div className="flex flex-wrap gap-1">
                {character.personality.map((trait, index) => (
                  <span
                    key={index}
                    className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          )}

          {character.backstory && (
            <div>
              <h4 className={`font-semibold text-gray-700 ${textSizes[size]} mb-1`}>
                Backstory
              </h4>
              <p className={`text-gray-600 ${textSizes[size]} leading-relaxed`}>
                {character.backstory}
              </p>
            </div>
          )}

          <div>
            <p className={`text-gray-500 ${textSizes[size]}`}>
              {character.createdFrom === 'ai-photo' ? '📸 Created from photo' : '🎨 Manually created'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}