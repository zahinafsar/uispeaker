"use client";

import { Volume2Icon } from "./icons";

interface SoundSelectorProps {
  sounds: string[];
  selected: string;
  onChange: (sound: string) => void;
}

export function SoundSelector({
  sounds,
  selected,
  onChange,
}: SoundSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Volume2Icon className="h-4 w-4 text-muted-foreground" />
      <label className="text-sm text-muted-foreground">Sound:</label>
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 rounded-md border border-border bg-background px-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"
        data-uispeaker="click"
      >
        {sounds.map((sound) => (
          <option key={sound} value={sound}>
            {sound}
          </option>
        ))}
      </select>
    </div>
  );
}
