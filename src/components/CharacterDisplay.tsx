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
    small: 'w-32 h-40',
    medium: 'w-48 h-60',
    large: 'w-64 h-80'
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
                style={{ transform: 'scale(0.7)' }}
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

            {/* Blush */}
            {character.blush && character.blush !== 'blush-none' && (
              <div className="absolute inset-0 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getPartById('blush', character.blush)?.imageUrl}
                  alt="Blush"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}

            {/* Facial Accessories (moles, etc.) */}
            {character.facialAccessory && character.facialAccessory !== 'facialAccessory-none' && (
              <div className="absolute inset-0 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getPartById('facialAccessory', character.facialAccessory)?.imageUrl}
                  alt="Facial Accessory"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}

            {/* Facial Hair */}
            {character.facialHair && character.facialHair !== 'facialHair-none' && (
              <div className="absolute inset-0 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getPartById('facialHair', character.facialHair)?.imageUrl}
                  alt="Facial Hair"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}
            
            {/* Hair */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getPartById('hair', character.hair)?.imageUrl}
                alt="Hair"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            
            {/* Bangs (in front of hair) */}
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

            {/* Accessories (glasses, etc. - in front of everything) */}
            {character.accessory && character.accessory !== 'accessory-none' && (
              <div className="absolute inset-0 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getPartById('accessory', character.accessory)?.imageUrl}
                  alt="Accessory"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Character Details */}
      {showDetails && (
        <div className="space-y-3">
          <div>
            <h3 className={`font-bold text-gray-800 ${textSizes[size]}`}>
              Character
            </h3>
            <p className={`text-gray-600 ${textSizes[size]}`}>
              Created on {new Date(character.createdAt).toLocaleDateString()}
            </p>
          </div>

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