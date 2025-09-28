"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useCharacterContext } from "@/contexts/CharacterContext";
import { story } from "./runtime";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { generateScenesSequential, getGeneratedImage } from '@/lib/generation';

export default function StoryReaderPage() {
  const { currentCharacter } = useCharacterContext();
  
  // Track visited scenes for choice exclusivity
  const [visitedScenes, setVisitedScenes] = useState<Set<string>>(new Set());
  
  // Redirect to character creation if no character exists
  useEffect(() => {
    if (!currentCharacter) {
      window.location.href = '/char';
    }
  }, [currentCharacter]);

  // Scenes list
  const scenes = useMemo(() => story.scenes || [], []);
  const startIndex = useMemo(() => Math.max(0, scenes.findIndex(s => s.id === story.start)), [scenes]);

  // We show two scenes per spread: left = index, right = index + 1
  const [index, setIndex] = useState(startIndex);
  // phase: 0 = left revealed only, 1 = right revealed (full spread)
  const [phase, setPhase] = useState(0);
  const [leftVisible, setLeftVisible] = useState(false);
  const [rightVisible, setRightVisible] = useState(false);
  const [choiceMessage, setChoiceMessage] = useState('');

  useEffect(() => {
    const left = getScene(index);
    const right = getScene(index + 1);

    // Reset states unless it's a special case
    if (!(['3a1', '3a2'].includes(left?.id) && right?.id === '3b')) {
      setPhase(0);
      setLeftVisible(false);
      setRightVisible(false);
    }
    
    // Show left page immediately
    const leftTimer = setTimeout(() => setLeftVisible(true), 10);
    
    // Show right page immediately for special cases
    if (left?.terminal || (left?.id && ['3a1', '3a2'].includes(left.id) && right?.id === '3b')) {
      const rightTimer = setTimeout(() => {
        setPhase(1);
        setRightVisible(true);
      }, 20);
      return () => {
        clearTimeout(leftTimer);
        clearTimeout(rightTimer);
      };
    }
    
    return () => clearTimeout(leftTimer);
  }, [index]);

  // If we land on a terminal scene, reveal the spread and lock progression forward
  useEffect(() => {
    const left = getScene(index);
    const right = getScene(index + 1);
    if (left?.terminal || right?.terminal) {
      setPhase(1);
      setLeftVisible(true);
      setRightVisible(true);
      // Clear any choices to prevent navigation from terminal scenes
      if (left?.choices) left.choices = [];
      if (right?.choices) right.choices = [];
    }
  }, [index]);

  // Helper to get scene by absolute index
  const getScene = (i: number) => scenes[i] || null;

  // Prefetch logic: keep prior prefetch behavior for decision node
  useEffect(() => {
    const left = getScene(index);
    if (left?.id === '1d' && currentCharacter) {
      const scenesToPrefetch = ['2a','2b','4a','4b'];
      generateScenesSequential(scenesToPrefetch, currentCharacter, (r)=> console.log('prefetch', r.sceneId));
    }
  }, [index, currentCharacter]);

  const onKey = useCallback((e: KeyboardEvent) => {
    if (!currentCharacter) return;
    if (e.key === 'ArrowRight') {
      // If left scene requires a choice, block reveal/advance
      const left = getScene(index);
      const right = getScene(index + 1);
      // If either visible scene is terminal, block forward progression
      if (left?.terminal || right?.terminal) {
        setChoiceMessage('The story has ended — press Retry to play again');
        setTimeout(() => setChoiceMessage(''), 2000);
        return;
      }
      if (phase === 0) {
        if (left?.choices && left.choices.length > 1) {
          // prompt user to choose
          setChoiceMessage('Please select an option to continue');
          setTimeout(() => setChoiceMessage(''), 1200);
          return;
        }
        setPhase(1);
        // reveal right image after short delay
        setTimeout(() => setRightVisible(true), 80);
      } else {
        // when trying to advance from right, ensure right scene doesn't require a choice
        if (right?.choices && right.choices.length > 1) {
          setChoiceMessage('Please select an option on the right page to continue');
          setTimeout(() => setChoiceMessage(''), 1200);
          return;
        }
        // advance two pages (next spread)
        setIndex(i => Math.min(i + 2, Math.max(0, scenes.length - 1)));
      }
    } else if (e.key === 'ArrowLeft') {
      if (phase === 1) {
        setPhase(0);
        setRightVisible(false);
      } else {
        setIndex(i => Math.max(0, i - 2));
      }
    }
  }, [phase, scenes.length, currentCharacter]);

  useEffect(() => {
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onKey]);

  if (!currentCharacter) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[url('/images/notebook-lined-paper-texture-background_35652-715.jpg')] bg-repeat">
        <div className="max-w-2xl p-8 bg-white/80 rounded shadow text-center backdrop-blur-sm">
          <h2 className="text-2xl font-semibold mb-4">Create your character first</h2>
          <p className="text-gray-600 mb-6">You need a character to begin the story. Head to the character creator to make one.</p>
          <div className="flex justify-center">
            <a href="/char"><Button className="bg-blue-600 hover:bg-blue-700">Go to Character Creator</Button></a>
          </div>
        </div>
      </div>
    );
  }

  // Scenes for the spread
  const leftScene = getScene(index);
  const rightScene = getScene(index + 1);

  // Get images: prefer generated result (could be imageUrl or inline data)
  const leftGen = leftScene ? getGeneratedImage(leftScene.id) : null;
  const rightGen = rightScene ? getGeneratedImage(rightScene.id) : null;

  const sceneFallback = (sceneId?: string) => sceneId ? `/charassets/${sceneId}.png` : '/charassets/placeholder-left.png';

  const leftImage = leftGen?.imageData || leftScene?.imageLeft || sceneFallback(leftScene?.id);
  const rightImage = rightGen?.imageData || rightScene?.imageRight || sceneFallback(rightScene?.id);

  // Navigation helpers
    // Navigation helpers
  const goToSceneById = (sceneId: string) => {
    const left = getScene(index);
    const right = getScene(index + 1);
    
    // If current scene is terminal, block all navigation
    if (left?.terminal || right?.terminal) {
      setChoiceMessage('The story has ended — restart to play again');
      setTimeout(() => setChoiceMessage(''), 2000);
      return;
    }

    // Find the source and target scenes
    const sourceScene = scenes.find(s => s.id === (left?.id || right?.id));
    const targetScene = scenes.find(s => s.id === sceneId);
    if (!targetScene) return;

    // 🚫 Rule 1: block scene 4a if coming from any "3*" path
    if (sceneId === '4a' && sourceScene?.id?.startsWith('3')) {
      setChoiceMessage('You cannot reach 4a from this path');
      setTimeout(() => setChoiceMessage(''), 2000);
      return;
    }

    // 🚫 Rule 2: 3a1 and 3a2 are mutually exclusive
    if (sceneId === '3a1' || sceneId === '3a2') {
      const mutuallyExclusive = new Set(['3a1', '3a2']);
      const hasVisitedOther = Array.from(mutuallyExclusive).some(
        id => id !== sceneId && visitedScenes.has(id)
      );
      if (hasVisitedOther) {
        setChoiceMessage('You cannot visit this path after choosing the other option');
        setTimeout(() => setChoiceMessage(''), 2000);
        return;
      }
    }

    // Update visited scenes
    setVisitedScenes(prev => new Set([...prev, sceneId]));

    const targetIndex = scenes.findIndex(s => s.id === sceneId);
    if (targetIndex < 0) return;

    // ⭐ Special handling for 3a1/3a2 → always show with 3b
    if (sceneId === '3a1' || sceneId === '3a2') {
      setIndex(targetIndex); // set to 3a1 or 3a2
      setPhase(1);
      setLeftVisible(true);
      setRightVisible(true);
      return;
    }

    // Normal navigation → align to even numbers for spread
    setIndex(Math.floor(targetIndex / 2) * 2);
  };


  // When story ends (no more scenes), offer retry
  const atEnd = index >= scenes.length - 1;

  return (
    <div className="min-h-screen p-8 bg-[url('/images/notebook-lined-paper-texture-background_35652-715.jpg')] bg-repeat">
      <div className="max-w-6xl mx-auto bg-white/90 shadow-lg rounded-lg overflow-hidden">
        {/* Open book spread */}
        <div className="grid grid-cols-2 gap-6 p-8 items-start">
          {/* Left page */}
          <div className="flex flex-col items-center">
            <div className="w-[360px] h-[480px] bg-white rounded-md shadow-inner overflow-hidden relative">
              {/* left image */}
              <div className={`absolute inset-6 rounded-md overflow-hidden transition-opacity duration-700 ${leftVisible ? 'opacity-100' : 'opacity-0'}`}>
                <Image src={leftImage} alt={`Left ${leftScene?.id}`} fill style={{ objectFit: 'cover' }} />
              </div>
              {/* text box */}
              <div className={`absolute left-8 bottom-8 bg-white/90 p-4 rounded-md shadow transition-all duration-700 ${leftVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <h3 className="text-lg font-semibold">{leftScene?.id}</h3>
                <p className="text-sm text-gray-700 mt-1 max-w-[300px]">{leftScene?.text}</p>
              </div>
            </div>
            {/* If left scene has multiple choices, show them after image/text fade */}
            <div className="mt-4">
              {leftVisible && leftScene?.choices && leftScene.choices.length > 1 && (
                <div className="flex gap-2 transition-opacity duration-700 opacity-100">
                  {leftScene.choices.map((c: any) => (
                    <Button key={c.id} variant="outline" onClick={() => goToSceneById(c.target)}>
                      {c.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right page */}
          <div className="flex flex-col items-center">
            <div className="w-[360px] h-[480px] bg-white rounded-md shadow-inner overflow-hidden relative">
              <div className={`absolute inset-6 rounded-md overflow-hidden transition-opacity duration-700 ${rightVisible && phase === 1 ? 'opacity-100' : 'opacity-0'}`}>
                <Image src={rightImage} alt={`Right ${rightScene?.id}`} fill style={{ objectFit: 'cover' }} />
              </div>
              <div className={`absolute left-8 bottom-8 bg-white/90 p-4 rounded-md shadow transition-all duration-700 ${rightVisible && phase === 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <h3 className="text-lg font-semibold">{rightScene?.id}</h3>
                <p className="text-sm text-gray-700 mt-1 max-w-[300px]">{rightScene?.text}</p>
              </div>
            </div>

            <div className="mt-4">
              {rightVisible && phase === 1 && rightScene?.choices && rightScene.choices.length > 1 && (
                <div className="flex gap-2 transition-opacity duration-700 opacity-100">
                  {rightScene.choices.map((c: any) => (
                    <Button key={c.id} variant="outline" onClick={() => goToSceneById(c.target)}>
                      {c.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer controls */}
        <div className="border-t px-8 py-4 bg-white/80 flex items-center justify-between">
          <div className="text-sm text-gray-600">Use ← / → to navigate spreads. Press → to reveal the right page, → again to advance.</div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-700">Character: <strong>{currentCharacter?.id}</strong></div>
            <div>
              <Button variant="ghost" onClick={() => { setIndex(0); setPhase(0); setLeftVisible(true); setRightVisible(false); }}>Restart</Button>
            </div>
          </div>
        </div>

        {choiceMessage && (
          <div className="px-8 py-2 text-center text-sm text-red-600">{choiceMessage}</div>
        )}

        {/* End of story prompt */}
        {atEnd && (
          <div className="p-6 bg-yellow-50 border-t mt-4 text-center">
            <h3 className="text-lg font-semibold">You've reached the end</h3>
            <p className="text-sm text-gray-700 mb-4">Would you like to try again or explore another ending?</p>
            <div className="flex justify-center gap-3">
              <Button onClick={() => { setIndex(0); setPhase(0); setLeftVisible(true); setRightVisible(false); }}>Retry story</Button>
              <Button variant="outline" onClick={() => { /* maybe clear generated images or navigate home */ window.location.href = '/'; }}>Exit</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
