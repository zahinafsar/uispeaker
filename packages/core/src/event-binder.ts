import type { UISpeakerEvent } from "./types";

/**
 * Infer the default event type based on the element's tag and attributes.
 *
 * Priority:
 * 1. Checkboxes / radio / range → "click" (they respond to click, not text input)
 * 2. Text-like inputs, textarea, search → "input" (debounced keystroke sounds)
 * 3. Select → "click" (dropdown interaction)
 * 4. Buttons, links, ARIA roles → "click"
 * 5. Details, dialog → "open" (with automatic close handling)
 * 6. Elements with data-state attribute (Radix/headless UI) → "open"
 * 7. Everything else → "click"
 */
export function inferEvent(el: Element): UISpeakerEvent {
  const tag = el.tagName.toLowerCase();
  const role = el.getAttribute("role");

  // Input elements — must check type before generic input catch
  if (tag === "input") {
    const inputType = (el as HTMLInputElement).type.toLowerCase();
    // Checkboxes, radios, and range sliders respond to click, not text input
    if (
      inputType === "checkbox" ||
      inputType === "radio" ||
      inputType === "range" ||
      inputType === "color" ||
      inputType === "file"
    ) {
      return "click";
    }
    // All other input types (text, search, email, number, tel, url, password, etc.)
    return "input";
  }

  // Textarea — always text input
  if (tag === "textarea") {
    return "input";
  }

  // Select — dropdown click interaction
  if (tag === "select") {
    return "click";
  }

  // Contenteditable elements — treated as text input
  if (el.getAttribute("contenteditable") === "true") {
    return "input";
  }

  // Interactive click targets: buttons, links, and ARIA roles
  if (
    tag === "button" ||
    tag === "a" ||
    role === "button" ||
    role === "link" ||
    role === "checkbox" ||
    role === "switch" ||
    role === "radio" ||
    role === "tab" ||
    role === "menuitem" ||
    role === "option"
  ) {
    return "click";
  }

  // Toggle elements: details and dialog
  if (tag === "details" || tag === "dialog") {
    return "open";
  }

  // Elements with data-state (Radix UI, Headless UI patterns)
  if (el.hasAttribute("data-state")) {
    return "open";
  }

  // Default to click for everything else
  return "click";
}

/**
 * Bind the appropriate DOM event(s) to an element and return a cleanup handle.
 *
 * For "open" events on toggle-capable elements (details, dialog, data-state),
 * the binding also handles the close transition so a single binding covers
 * the full open/close lifecycle.
 *
 * @param onTrigger  - Called when the primary event fires (plays the main sound).
 * @param onClose    - Optional callback for close transitions (plays the close sound).
 *                     Only used when event is "open" and the element supports toggling.
 */
export function bindEvent(
  el: Element,
  event: UISpeakerEvent,
  onTrigger: () => void,
  options: {
    inputDebounce: number;
    mousemoveThrottle: number;
    onClose?: () => void;
  }
): () => void {
  const cleanups: (() => void)[] = [];

  const listen = (
    target: EventTarget,
    type: string,
    handler: EventListener,
    opts?: AddEventListenerOptions
  ) => {
    target.addEventListener(type, handler, opts);
    cleanups.push(() => target.removeEventListener(type, handler, opts));
  };

  switch (event) {
    case "click": {
      listen(el, "click", onTrigger);
      break;
    }

    case "input": {
      // Debounced input handler to prevent sound spam while typing.
      // Listens to both "input" (covers paste, autocomplete, etc.)
      // and "keydown" (covers key presses before value changes).
      // Only one sound fires per debounce window regardless of source.
      let timer: ReturnType<typeof setTimeout> | null = null;
      const debounced = () => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(onTrigger, options.inputDebounce);
      };
      listen(el, "input", debounced);
      listen(el, "keydown", debounced);
      cleanups.push(() => {
        if (timer) clearTimeout(timer);
      });
      break;
    }

    case "hover": {
      listen(el, "mouseenter", onTrigger);
      break;
    }

    case "mousemove": {
      // Throttled mousemove: fires at most once per throttle interval.
      // Sound plays continuously while mouse moves over the element.
      let lastFired = 0;
      const throttled = () => {
        const now = Date.now();
        if (now - lastFired >= options.mousemoveThrottle) {
          lastFired = now;
          onTrigger();
        }
      };
      listen(el, "mousemove", throttled);
      break;
    }

    case "focus": {
      listen(el, "focus", onTrigger);
      break;
    }

    case "blur": {
      listen(el, "blur", onTrigger);
      break;
    }

    case "open": {
      const closeFn = options.onClose || (() => {});

      // <details> element — fires "toggle" event on open/close
      if (el.tagName.toLowerCase() === "details") {
        listen(el, "toggle", () => {
          if ((el as HTMLDetailsElement).open) {
            onTrigger();
          } else {
            closeFn();
          }
        });
      }
      // <dialog> element — open attribute added/removed, "close" event
      else if (el.tagName.toLowerCase() === "dialog") {
        // Watch for the open attribute being added (dialog.show() or dialog.showModal())
        const obs = new MutationObserver((mutations) => {
          for (const m of mutations) {
            if (m.attributeName === "open") {
              if (el.hasAttribute("open")) {
                onTrigger();
              } else {
                closeFn();
              }
            }
          }
        });
        obs.observe(el, { attributes: true, attributeFilter: ["open"] });
        cleanups.push(() => obs.disconnect());

        // Also listen for the native "close" event (dialog.close())
        listen(el, "close", closeFn);
      }
      // Generic: watch for data-state attribute changes.
      // Covers Radix UI, Headless UI, and custom component patterns.
      // Triggers on transitions: "closed" → "open" and "open" → "closed"
      else {
        const obs = new MutationObserver((mutations) => {
          for (const m of mutations) {
            if (m.attributeName === "data-state") {
              const state = (el as HTMLElement).dataset.state;
              if (state === "open") {
                onTrigger();
              } else if (state === "closed") {
                closeFn();
              }
            }
          }
        });
        obs.observe(el, { attributes: true, attributeFilter: ["data-state"] });
        cleanups.push(() => obs.disconnect());
      }
      break;
    }

    case "close": {
      // Standalone close binding (when user explicitly sets data-uispeaker-event="close")
      if (el.tagName.toLowerCase() === "details") {
        listen(el, "toggle", () => {
          if (!(el as HTMLDetailsElement).open) onTrigger();
        });
      } else if (el.tagName.toLowerCase() === "dialog") {
        listen(el, "close", onTrigger);
        // Also watch for open attribute removal
        const obs = new MutationObserver((mutations) => {
          for (const m of mutations) {
            if (m.attributeName === "open" && !el.hasAttribute("open")) {
              onTrigger();
            }
          }
        });
        obs.observe(el, { attributes: true, attributeFilter: ["open"] });
        cleanups.push(() => obs.disconnect());
      } else {
        const obs = new MutationObserver((mutations) => {
          for (const m of mutations) {
            if (
              m.attributeName === "data-state" &&
              (el as HTMLElement).dataset.state === "closed"
            ) {
              onTrigger();
            }
          }
        });
        obs.observe(el, { attributes: true, attributeFilter: ["data-state"] });
        cleanups.push(() => obs.disconnect());
      }
      break;
    }

    // Notification events (success/error/warning) are primarily programmatic
    // (called via UISpeaker.play('success')). When bound to elements via
    // data-uispeaker="success", they trigger on click as a convenience.
    case "success":
    case "error":
    case "warning": {
      listen(el, "click", onTrigger);
      break;
    }
  }

  return () => {
    for (const fn of cleanups) fn();
  };
}
