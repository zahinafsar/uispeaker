import type { SoundEntry, BuiltinSoundDef, SoundRegistryManifest, UISpeakerEvent } from "./types";

/**
 * Registry version — incremented when built-in sounds change.
 */
export const REGISTRY_VERSION = "1.0.0";

/**
 * Default CDN base for sound files.
 * For MVP this points to the docs app public directory;
 * will migrate to proper CDN later.
 */
const DEFAULT_CDN_BASE =
  "https://cdn.jsdelivr.net/gh/zahinafsar/uispeaker@main/sounds";

/**
 * Built-in sound registry. Maps sound names to metadata.
 * URLs are resolved relative to the configured cdnBase.
 *
 * These 13 sounds cover all UISpeaker event categories:
 * click (3), input (2), hover (2), mousemove (1), toggle (2), notification (3)
 */
const BUILTIN_SOUNDS: Record<string, BuiltinSoundDef> = {
  // Click / tap sounds
  click: {
    file: "click.mp3",
    defaultEvent: "click",
    category: "click",
    description: "Short digital click for buttons and links",
    duration: 0.5,
  },
  tap: {
    file: "tap.mp3",
    defaultEvent: "click",
    category: "click",
    description: "Soft tap for toggles and checkboxes",
    duration: 2.5,
  },
  pop: {
    file: "pop.mp3",
    defaultEvent: "click",
    category: "click",
    description: "Bubble pop for playful interactions",
    duration: 2.2,
  },

  // Typing
  keystroke: {
    file: "keystroke.mp3",
    defaultEvent: "input",
    category: "input",
    description: "Single key press for text input feedback",
    duration: 0.9,
  },
  typewriter: {
    file: "typewriter.mp3",
    defaultEvent: "input",
    category: "input",
    description: "Mechanical typewriter key for vintage feel",
    duration: 0.5,
  },

  // Hover
  hover: {
    file: "hover.mp3",
    defaultEvent: "hover",
    category: "hover",
    description: "Subtle swoosh for hover interactions",
    duration: 1.1,
  },
  swoosh: {
    file: "swoosh.mp3",
    defaultEvent: "hover",
    category: "hover",
    description: "Pronounced swoosh for emphasis on hover",
    duration: 2.6,
  },

  // Mousemove
  slide: {
    file: "slide.mp3",
    defaultEvent: "mousemove",
    category: "mousemove",
    description: "Smooth slide for continuous mouse movement",
    duration: 1.0,
  },

  // Open / close
  open: {
    file: "open.mp3",
    defaultEvent: "open",
    category: "toggle",
    description: "Opening tone for dropdowns, dialogs, and popups",
    duration: 2.0,
  },
  close: {
    file: "close.mp3",
    defaultEvent: "close",
    category: "toggle",
    description: "Closing tone for dismissing UI elements",
    duration: 1.1,
  },

  // Notifications
  success: {
    file: "success.mp3",
    defaultEvent: "success",
    category: "notification",
    description: "Positive chime for success notifications",
    duration: 2.7,
  },
  error: {
    file: "error.mp3",
    defaultEvent: "error",
    category: "notification",
    description: "Alert tone for error notifications",
    duration: 2.7,
  },
  warning: {
    file: "warning.mp3",
    defaultEvent: "warning",
    category: "notification",
    description: "Cautionary beep for warning notifications",
    duration: 0.8,
  },
};

/**
 * SoundRegistry resolves sound names to full URLs and manages custom registrations.
 *
 * Resolution order:
 * 1. Custom sounds (registered via register())
 * 2. Remote manifest sounds (loaded via loadManifest())
 * 3. Built-in sounds (hardcoded above)
 * 4. Direct URL (if name starts with http:// or https:// or /)
 */
export class SoundRegistry {
  private cdnBase: string;
  private custom: Map<string, SoundEntry> = new Map();
  private manifestSounds: Map<string, BuiltinSoundDef> = new Map();
  private manifestVersion: string | null = null;

  constructor(cdnBase?: string) {
    this.cdnBase = (cdnBase || DEFAULT_CDN_BASE).replace(/\/+$/, "");
  }

  /**
   * Load a remote sound registry manifest (registry.json).
   * Sounds from the manifest are merged with built-in sounds,
   * with manifest sounds taking precedence over built-ins.
   */
  async loadManifest(url: string): Promise<void> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load registry manifest: ${response.status}`);
      }
      const manifest: SoundRegistryManifest = await response.json();
      this.manifestVersion = manifest.version;

      for (const [name, def] of Object.entries(manifest.sounds)) {
        this.manifestSounds.set(name, {
          file: def.file,
          defaultEvent: (def.defaultEvent || "click") as UISpeakerEvent,
          category: def.category || "other",
          description: def.description,
          duration: def.duration,
        });
      }
    } catch (err) {
      if (typeof console !== "undefined") {
        console.warn("UISpeaker: failed to load registry manifest", err);
      }
    }
  }

  /**
   * Resolve a sound name to its full URL and metadata.
   * Checks custom registry first, then manifest, then built-in,
   * then treats name as a direct URL.
   */
  resolve(name: string): SoundEntry | null {
    // Custom sounds take precedence
    const custom = this.custom.get(name);
    if (custom) return custom;

    // Manifest sounds (from remote registry.json)
    const manifest = this.manifestSounds.get(name);
    if (manifest) {
      return {
        url: `${this.cdnBase}/${manifest.file}`,
        defaultEvent: manifest.defaultEvent,
        category: manifest.category,
        description: manifest.description,
        duration: manifest.duration,
      };
    }

    // Built-in sound
    const builtin = BUILTIN_SOUNDS[name];
    if (builtin) {
      return {
        url: `${this.cdnBase}/${builtin.file}`,
        defaultEvent: builtin.defaultEvent,
        category: builtin.category,
        description: builtin.description,
        duration: builtin.duration,
      };
    }

    // If the name looks like a URL, use it directly
    if (name.startsWith("http://") || name.startsWith("https://") || name.startsWith("/")) {
      return { url: name };
    }

    return null;
  }

  /**
   * Register a custom sound.
   */
  register(name: string, entry: SoundEntry): void {
    this.custom.set(name, entry);
  }

  /**
   * Unregister a custom sound.
   */
  unregister(name: string): boolean {
    return this.custom.delete(name);
  }

  /**
   * Get all known sound names (built-in + manifest + custom).
   */
  list(): string[] {
    const names = new Set<string>([
      ...Object.keys(BUILTIN_SOUNDS),
      ...this.manifestSounds.keys(),
      ...this.custom.keys(),
    ]);
    return Array.from(names).sort();
  }

  /**
   * Get metadata for all sounds (useful for docs/UI).
   */
  listDetailed(): Array<{ name: string } & SoundEntry> {
    const result: Array<{ name: string } & SoundEntry> = [];
    for (const name of this.list()) {
      const entry = this.resolve(name);
      if (entry) {
        result.push({ name, ...entry });
      }
    }
    return result;
  }

  /**
   * Get the registry version (manifest version or built-in).
   */
  getVersion(): string {
    return this.manifestVersion || REGISTRY_VERSION;
  }

  /**
   * Update the CDN base URL.
   */
  setCdnBase(base: string): void {
    this.cdnBase = base.replace(/\/+$/, "");
  }

  /**
   * Get the current CDN base URL.
   */
  getCdnBase(): string {
    return this.cdnBase;
  }
}
