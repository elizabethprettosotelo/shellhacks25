// src/app/story/page.tsx
"use client";

import { useMemo, useState } from "react";
import { story, getScene, allowedChoices, applyEffects } from "../story/runtime"; // or "@/story/runtime"

export default function StoryPage() {
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [sceneId, setSceneId] = useState<string>(story.start);

  const scene = useMemo(() => getScene(sceneId), [sceneId]);
  const choices = useMemo(() => allowedChoices(scene, flags), [scene, flags]);

  function choose(choiceId: string) {
    const c = (choices ?? []).find(x => x.id === choiceId);
    if (!c) return;
    setFlags(prev => {
      const next = { ...prev };
      applyEffects(next, c.effects);
      return next;
    });
    setSceneId(c.target);
  }

  function reset() {
    setFlags({});
    setSceneId(story.start);
  }

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">{story.meta.title}</h1>
        {scene.setting && <p className="text-sm opacity-70">Setting: {scene.setting}</p>}
      </header>

      <article className="text-lg leading-relaxed whitespace-pre-wrap">{scene.text}</article>

      {scene.terminal ? (
        <button className="rounded-xl px-4 py-2 border" onClick={reset}>Play Again</button>
      ) : (
        <ul className="space-y-2">
          {(choices ?? []).map(c => (
            <li key={c.id}>
              <button
                className="w-full text-left rounded-xl px-4 py-2 border hover:opacity-80"
                onClick={() => choose(c.id)}
              >
                {c.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
