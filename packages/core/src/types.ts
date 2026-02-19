/**
 * Supported event types for UISpeaker sound triggers.
 */
export type UISpeakerEvent =
  | "click"
  | "input"
  | "hover"
  | "mousemove"
  | "open"
  | "close"
  | "focus"
  | "blur"
  | "success"
  | "error"
  | "warning";

/**
 * Configuration options for UISpeaker initialization.
 */
export interface UISpeakerConfig {
  /** Base URL for loading sound files. Defaults to bundled CDN. */
  cdnBase?: string;
  /** Initial volume (0-1). Defaults to 1. */
  volume?: number;
  /** Whether to start muted. Defaults to false. */
  muted?: boolean;
  /** Root element to observe. Defaults to document.body. */
  root?: HTMLElement;
  /** Debounce time in ms for input events. Defaults to 80. */
  inputDebounce?: number;
  /** Throttle time in ms for mousemove events. Defaults to 100. */
  mousemoveThrottle?: number;
}

/**
 * Internal metadata attached to a bound element.
 */
export interface BoundElement {
  element: Element;
  soundName: string;
  event: UISpeakerEvent;
  cleanup: () => void;
}

/**
 * Sound registry entry mapping a sound name to its URL and metadata.
 */
export interface SoundEntry {
  url: string;
  /** Default event type this sound is designed for. */
  defaultEvent?: UISpeakerEvent;
  /** Category for grouping in docs. */
  category?: string;
  /** Human-readable description of the sound. */
  description?: string;
  /** Approximate duration in seconds. */
  duration?: number;
}

/**
 * Built-in sound definition (before URL resolution).
 * Used internally by the registry to map names to files.
 */
export interface BuiltinSoundDef {
  file: string;
  defaultEvent: UISpeakerEvent;
  category: string;
  description?: string;
  duration?: number;
}

/**
 * Shape of the registry.json file served from CDN/public directory.
 */
export interface SoundRegistryManifest {
  version: string;
  description?: string;
  sounds: Record<string, {
    file: string;
    defaultEvent?: UISpeakerEvent;
    category?: string;
    description?: string;
    duration?: number;
    source?: string;
    license?: string;
  }>;
}
