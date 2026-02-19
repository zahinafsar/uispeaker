"use client";

import { useCallback } from "react";
import { PlayIcon } from "./icons";

const DEMO_SOUNDS = [
  { name: "click", label: "Click", category: "Interaction" },
  { name: "tap", label: "Tap", category: "Interaction" },
  { name: "pop", label: "Pop", category: "Interaction" },
  { name: "hover", label: "Hover", category: "Interaction" },
  { name: "keystroke", label: "Keystroke", category: "Input" },
  { name: "typewriter", label: "Typewriter", category: "Input" },
  { name: "open", label: "Open", category: "Toggle" },
  { name: "close", label: "Close", category: "Toggle" },
  { name: "success", label: "Success", category: "Notification" },
  { name: "error", label: "Error", category: "Notification" },
  { name: "warning", label: "Warning", category: "Notification" },
  { name: "swoosh", label: "Swoosh", category: "Motion" },
  { name: "slide", label: "Slide", category: "Motion" },
];

export function SoundDemo() {
  const playSound = useCallback((name: string) => {
    if (window.__uispeaker) window.__uispeaker.play(name);
  }, []);

  const categories = Array.from(
    new Set(DEMO_SOUNDS.map((s) => s.category))
  );

  return (
    <div className="grid gap-6">
      {categories.map((category) => (
        <div key={category}>
          <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {category}
          </h4>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {DEMO_SOUNDS.filter((s) => s.category === category).map(
              (sound) => (
                <button
                  key={sound.name}
                  onClick={() => playSound(sound.name)}
                  className="group flex items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-2.5 text-left text-sm transition-all hover:border-foreground/20 hover:bg-accent"
                  data-uispeaker="click"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent text-muted-foreground transition-colors group-hover:bg-foreground group-hover:text-background">
                    <PlayIcon className="h-3 w-3" />
                  </span>
                  <span className="font-medium">{sound.label}</span>
                </button>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
