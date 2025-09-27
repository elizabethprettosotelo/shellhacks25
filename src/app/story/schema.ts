// src/story/schema.ts
export type Effect = { set?: Record<string, boolean> };

export type Choice = {
  id: string;               // stable choice id
  label: string;            // shown to player
  target: string;           // next scene id
  requires?: Record<string, boolean>; // optional flag gates
  effects?: Effect;         // flags to set after choosing
};

export type Scene = {
  id: string;               // stable scene id
  text: string;             // prose (<= ~120 words recommended)
  setting?: string;         // optional setting tag
  terminal?: boolean;       // true = end of path
  choices?: Choice[];       // 0 or more choices
};

export type Story = {
  meta: { version: number; title: string };
  scenes: Scene[];
  start: string;            // id of first scene
};
