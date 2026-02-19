/**
 * AudioManager — handles Web Audio API context, loading, caching, and playback.
 *
 * Sounds are fetched lazily on first use and decoded AudioBuffers are cached
 * so subsequent plays are instant.
 */
export class AudioManager {
  private ctx: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private cache: Map<string, AudioBuffer> = new Map();
  private loading: Map<string, Promise<AudioBuffer>> = new Map();
  private _volume = 1;
  private _muted = false;

  /**
   * Lazily create the AudioContext (must happen after a user gesture in most browsers).
   */
  private ensureContext(): AudioContext {
    if (!this.ctx) {
      const Ctor =
        (window as any).AudioContext || (window as any).webkitAudioContext;
      this.ctx = new Ctor() as AudioContext;
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.value = this._muted ? 0 : this._volume;
      this.gainNode.connect(this.ctx.destination);
    }
    // Resume if suspended (autoplay policy)
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Load and decode an audio file from a URL. Returns cached buffer if available.
   */
  async load(url: string): Promise<AudioBuffer> {
    const cached = this.cache.get(url);
    if (cached) return cached;

    // Deduplicate in-flight requests
    const inflight = this.loading.get(url);
    if (inflight) return inflight;

    const promise = this.fetchAndDecode(url);
    this.loading.set(url, promise);

    try {
      const buffer = await promise;
      this.cache.set(url, buffer);
      return buffer;
    } finally {
      this.loading.delete(url);
    }
  }

  private async fetchAndDecode(url: string): Promise<AudioBuffer> {
    const ctx = this.ensureContext();
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`UISpeaker: failed to load sound from ${url} (${response.status})`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return ctx.decodeAudioData(arrayBuffer);
  }

  /**
   * Play a previously loaded (or lazy-loaded) sound.
   */
  async play(url: string): Promise<void> {
    if (this._muted) return;

    try {
      const buffer = await this.load(url);
      const ctx = this.ensureContext();
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(this.gainNode!);
      source.start(0);
    } catch (err) {
      // Silently fail — sounds are non-critical UI enhancement
      if (typeof console !== "undefined") {
        console.warn("UISpeaker: playback failed", err);
      }
    }
  }

  /**
   * Set master volume (0-1).
   */
  setVolume(v: number): void {
    this._volume = Math.max(0, Math.min(1, v));
    if (this.gainNode && !this._muted) {
      this.gainNode.gain.value = this._volume;
    }
  }

  getVolume(): number {
    return this._volume;
  }

  /**
   * Mute all playback.
   */
  mute(): void {
    this._muted = true;
    if (this.gainNode) {
      this.gainNode.gain.value = 0;
    }
  }

  /**
   * Unmute, restoring previous volume.
   */
  unmute(): void {
    this._muted = false;
    if (this.gainNode) {
      this.gainNode.gain.value = this._volume;
    }
  }

  isMuted(): boolean {
    return this._muted;
  }

  /**
   * Tear down the AudioContext.
   */
  destroy(): void {
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
      this.gainNode = null;
    }
    this.cache.clear();
    this.loading.clear();
  }
}
