/**
 * Global / IIFE entry point.
 *
 * When loaded via <script> tag, this creates window.UISpeaker and auto-initializes
 * once the DOM is ready.
 */
import { UISpeaker } from "./uispeaker";

// Create the singleton instance
const instance = new UISpeaker();

// Auto-initialize when DOM is ready
function autoInit() {
  instance.init();
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoInit);
  } else {
    // DOM already loaded
    autoInit();
  }
}

// Export methods on the global object.
// tsup's IIFE wraps this as window.UISpeaker = { ... }
export const volume = instance.volume.bind(instance);
export const mute = instance.mute.bind(instance);
export const unmute = instance.unmute.bind(instance);
export const isMuted = instance.isMuted.bind(instance);
export const play = instance.play.bind(instance);
export const register = instance.register.bind(instance);
export const setCdnBase = instance.setCdnBase.bind(instance);
export const sounds = instance.sounds.bind(instance);
export const getVolume = instance.getVolume.bind(instance);
export const destroy = instance.destroy.bind(instance);
export const init = instance.init.bind(instance);
export const VERSION = "0.1.0";
