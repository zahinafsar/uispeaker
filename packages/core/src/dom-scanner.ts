import type { UISpeakerEvent, BoundElement } from "./types";
import { inferEvent, bindEvent } from "./event-binder";

const ATTR = "data-uispeaker";
const ATTR_EVENT = "data-uispeaker-event";
const ATTR_CLOSE = "data-uispeaker-close";

/**
 * DOMScanner scans the DOM for [data-uispeaker] elements, binds events,
 * and watches for mutations to handle dynamically added/removed elements.
 *
 * Supports three data attributes:
 * - data-uispeaker="{sound-name}"       — the primary sound for this element
 * - data-uispeaker-event="{event-type}" — override the inferred event type
 * - data-uispeaker-close="{sound-name}" — (optional) sound to play on close
 *       transitions for toggle elements (details, dialog, [data-state])
 */
export class DOMScanner {
  private bound: Map<Element, BoundElement> = new Map();
  private observer: MutationObserver | null = null;
  private root: HTMLElement;
  private onBind: (soundName: string, event: UISpeakerEvent, el: Element) => () => void;
  private inputDebounce: number;
  private mousemoveThrottle: number;

  constructor(
    root: HTMLElement,
    onBind: (soundName: string, event: UISpeakerEvent, el: Element) => () => void,
    inputDebounce: number,
    mousemoveThrottle: number
  ) {
    this.root = root;
    this.onBind = onBind;
    this.inputDebounce = inputDebounce;
    this.mousemoveThrottle = mousemoveThrottle;
  }

  /**
   * Perform initial DOM scan and start observing mutations.
   */
  start(): void {
    this.scanAll();
    this.observe();
  }

  /**
   * Stop observing and unbind all elements.
   */
  stop(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    for (const [, entry] of this.bound) {
      entry.cleanup();
    }
    this.bound.clear();
  }

  /**
   * Scan the root for all [data-uispeaker] elements and bind them.
   */
  private scanAll(): void {
    const elements = this.root.querySelectorAll(`[${ATTR}]`);
    for (let i = 0; i < elements.length; i++) {
      this.bindElement(elements[i]);
    }
  }

  /**
   * Bind a single element.
   */
  private bindElement(el: Element): void {
    // Skip if already bound
    if (this.bound.has(el)) return;

    const soundName = el.getAttribute(ATTR);
    if (!soundName) return;

    // Determine event: explicit override or inferred from element type
    const explicitEvent = el.getAttribute(ATTR_EVENT) as UISpeakerEvent | null;
    const event = explicitEvent || inferEvent(el);

    // Create the trigger callback via the onBind hook (plays the main sound)
    const triggerFn = this.onBind(soundName, event, el);

    // For "open" events, check if a separate close sound is specified
    const closeSoundName = el.getAttribute(ATTR_CLOSE);
    let onClose: (() => void) | undefined;
    if (closeSoundName && event === "open") {
      onClose = this.onBind(closeSoundName, "close", el);
    }

    // Bind DOM event listeners
    const eventCleanup = bindEvent(el, event, triggerFn, {
      inputDebounce: this.inputDebounce,
      mousemoveThrottle: this.mousemoveThrottle,
      onClose,
    });

    this.bound.set(el, {
      element: el,
      soundName,
      event,
      cleanup: eventCleanup,
    });
  }

  /**
   * Unbind and clean up a single element.
   */
  private unbindElement(el: Element): void {
    const entry = this.bound.get(el);
    if (entry) {
      entry.cleanup();
      this.bound.delete(el);
    }
  }

  /**
   * Watch for DOM mutations: added/removed nodes and attribute changes.
   */
  private observe(): void {
    this.observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        // Handle added nodes
        if (mutation.type === "childList") {
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            const node = mutation.addedNodes[i];
            if (node.nodeType === Node.ELEMENT_NODE) {
              const el = node as Element;
              if (el.hasAttribute(ATTR)) {
                this.bindElement(el);
              }
              // Also scan children of added subtree
              const children = el.querySelectorAll(`[${ATTR}]`);
              for (let j = 0; j < children.length; j++) {
                this.bindElement(children[j]);
              }
            }
          }

          // Handle removed nodes — clean up all event listeners
          for (let i = 0; i < mutation.removedNodes.length; i++) {
            const node = mutation.removedNodes[i];
            if (node.nodeType === Node.ELEMENT_NODE) {
              const el = node as Element;
              if (this.bound.has(el)) {
                this.unbindElement(el);
              }
              // Also unbind children of removed subtree
              const children = el.querySelectorAll(`[${ATTR}]`);
              for (let j = 0; j < children.length; j++) {
                this.unbindElement(children[j]);
              }
            }
          }
        }

        // Handle attribute changes on existing elements.
        // The attributeFilter ensures we only get mutations for data-uispeaker,
        // data-uispeaker-event, or data-uispeaker-close, so just rebind as needed.
        if (mutation.type === "attributes" && mutation.target.nodeType === Node.ELEMENT_NODE) {
          const el = mutation.target as Element;
          // Unbind first (noop if not bound), then rebind if attribute still present
          this.unbindElement(el);
          if (el.hasAttribute(ATTR)) {
            this.bindElement(el);
          }
        }
      }
    });

    this.observer.observe(this.root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: [ATTR, ATTR_EVENT, ATTR_CLOSE],
    });
  }

  /**
   * Get count of currently bound elements (useful for debugging/testing).
   */
  get boundCount(): number {
    return this.bound.size;
  }
}
