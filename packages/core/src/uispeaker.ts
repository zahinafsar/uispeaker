import type { UISpeakerConfig, UISpeakerEvent, SoundEntry } from "./types";
import { AudioManager } from "./audio-manager";
import { SoundRegistry } from "./registry";
import { DOMScanner } from "./dom-scanner";

/**
 * UISpeaker — the main class that orchestrates DOM scanning, sound resolution,
 * and audio playback.
 *
 * Usage (ESM):
 *   import { UISpeaker } from 'uispeaker';
 *   const speaker = new UISpeaker();
 *   speaker.init();
 *
 * Usage (script tag — auto-initializes):
 *   <script src="uispeaker.global.js"></script>
 */
export class UISpeaker {
  private audio: AudioManager;
  private registry: SoundRegistry;
  private scanner: DOMScanner | null = null;
  private config: Required<UISpeakerConfig>;
  private initialized = false;

  constructor(config?: UISpeakerConfig) {
    this.config = {
      cdnBase: config?.cdnBase ?? "",
      volume: config?.volume ?? 1,
      muted: config?.muted ?? false,
      root: config?.root ?? (typeof document !== "undefined" ? document.body : (null as any)),
      inputDebounce: config?.inputDebounce ?? 80,
      mousemoveThrottle: config?.mousemoveThrottle ?? 100,
    };

    this.audio = new AudioManager();
    this.registry = new SoundRegistry(this.config.cdnBase || undefined);

    // Apply initial state
    this.audio.setVolume(this.config.volume);
    if (this.config.muted) {
      this.audio.mute();
    }
  }

  /**
   * Initialize: scan the DOM and start observing mutations.
   * Safe to call multiple times (idempotent).
   */
  init(root?: HTMLElement): void {
    if (this.initialized) return;
    this.initialized = true;

    const targetRoot = root || this.config.root;
    if (!targetRoot) {
      if (typeof console !== "undefined") {
        console.warn("UISpeaker: no root element available. Call init() after DOM is ready.");
      }
      return;
    }

    this.scanner = new DOMScanner(
      targetRoot,
      (soundName: string, _event: UISpeakerEvent, _el: Element) => {
        // Return a trigger function that plays the sound
        return () => this.playSound(soundName);
      },
      this.config.inputDebounce,
      this.config.mousemoveThrottle
    );

    this.scanner.start();
  }

  /**
   * Play a sound by name. Used both internally and as a public API for
   * programmatic triggers (e.g., UISpeaker.play('success')).
   */
  play(soundName: string): void {
    this.playSound(soundName);
  }

  private playSound(soundName: string): void {
    const entry = this.registry.resolve(soundName);
    if (!entry) {
      if (typeof console !== "undefined") {
        console.warn(`UISpeaker: unknown sound "${soundName}"`);
      }
      return;
    }
    this.audio.play(entry.url);
  }

  /**
   * Set master volume (0-1).
   */
  volume(v: number): void {
    this.audio.setVolume(v);
  }

  /**
   * Get current volume.
   */
  getVolume(): number {
    return this.audio.getVolume();
  }

  /**
   * Mute all sounds.
   */
  mute(): void {
    this.audio.mute();
  }

  /**
   * Unmute, restoring previous volume.
   */
  unmute(): void {
    this.audio.unmute();
  }

  /**
   * Check if currently muted.
   */
  isMuted(): boolean {
    return this.audio.isMuted();
  }

  /**
   * Register a custom sound.
   */
  register(name: string, entry: SoundEntry): void {
    this.registry.register(name, entry);
  }

  /**
   * Set the CDN base URL for built-in sounds.
   */
  setCdnBase(base: string): void {
    this.registry.setCdnBase(base);
  }

  /**
   * List all available sound names.
   */
  sounds(): string[] {
    return this.registry.list();
  }

  /**
   * Tear down: stop observing, unbind all elements, close audio.
   */
  destroy(): void {
    if (this.scanner) {
      this.scanner.stop();
      this.scanner = null;
    }
    this.audio.destroy();
    this.initialized = false;
  }
}
