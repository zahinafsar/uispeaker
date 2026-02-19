/**
 * UISpeaker — Add interactive sounds to UI elements via data attributes.
 *
 * @packageDocumentation
 */

import { UISpeaker } from "./uispeaker";
import type { UISpeakerConfig } from "./types";

export { UISpeaker } from "./uispeaker";
export { REGISTRY_VERSION } from "./registry";
export type {
  UISpeakerConfig,
  UISpeakerEvent,
  SoundEntry,
  SoundRegistryManifest,
  BuiltinSoundDef,
  BoundElement,
} from "./types";

export const VERSION = "0.1.0";

/**
 * Convenience function: create a UISpeaker instance and initialize it.
 *
 * @example
 * ```ts
 * import { init } from 'uispeaker';
 * const speaker = init({ volume: 0.8 });
 * ```
 */
export function init(config?: UISpeakerConfig): UISpeaker {
  const speaker = new UISpeaker(config);
  speaker.init();
  return speaker;
}
