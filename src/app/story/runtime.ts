// src/story/runtime.ts
import storyData from "./content/story.json";
import type { Story, Scene } from "./schema";

export const story: Story = storyData as Story;

export function getScene(id: string): Scene {
  const s = story.scenes.find(x => x.id === id);
  if (!s) throw new Error(`Scene not found: ${id}`);
  return s;
}

export function allowedChoices(scene: Scene, flags: Record<string, boolean>): Scene["choices"] {
  if (!scene.choices) return [];
  return scene.choices.filter(c => {
    if (!c.requires) return true;
    return Object.entries(c.requires).every(([k, v]) => !!flags[k] === v);
  });
}

export function applyEffects(flags: Record<string, boolean>, effects?: { set?: Record<string, boolean> }) {
  if (effects?.set) {
    for (const [k, v] of Object.entries(effects.set)) flags[k] = v;
  }
}
