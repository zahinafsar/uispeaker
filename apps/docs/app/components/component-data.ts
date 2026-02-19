/**
 * Component showcase data — defines all components, their descriptions,
 * available sounds, and code examples for the documentation pages.
 */

export interface ComponentDef {
  slug: string;
  name: string;
  description: string;
  /** Default sound for this component */
  defaultSound: string;
  /** Which sounds make sense for this component */
  availableSounds: string[];
  /** The default data-uispeaker-event (if different from the sound's default) */
  defaultEvent?: string;
  /** Code example template — {{sound}} is replaced with the selected sound */
  codeExample: string;
}

export const COMPONENTS: ComponentDef[] = [
  {
    slug: "button",
    name: "Button",
    description:
      "Add satisfying click feedback to buttons. Users hear a sound on every press, making interactions feel tactile and responsive.",
    defaultSound: "click",
    availableSounds: ["click", "tap", "pop"],
    codeExample: `<button data-uispeaker="{{sound}}">
  Click me
</button>`,
  },
  {
    slug: "input",
    name: "Input",
    description:
      "Give text inputs a typing sound. Each keystroke triggers audio feedback, creating an immersive typing experience.",
    defaultSound: "keystroke",
    availableSounds: ["keystroke", "typewriter"],
    codeExample: `<input
  type="text"
  placeholder="Type something..."
  data-uispeaker="{{sound}}"
/>`,
  },
  {
    slug: "checkbox",
    name: "Checkbox",
    description:
      "Make checkboxes feel satisfying to toggle. A subtle sound confirms each check and uncheck action.",
    defaultSound: "tap",
    availableSounds: ["tap", "click", "pop"],
    codeExample: `<input
  type="checkbox"
  data-uispeaker="{{sound}}"
/>`,
  },
  {
    slug: "toggle",
    name: "Toggle",
    description:
      "Add open/close sounds to toggle switches. Different sounds for on and off states create a rich interaction.",
    defaultSound: "open",
    availableSounds: ["open", "close", "tap", "click", "pop"],
    codeExample: `<!-- Toggle on -->
<button data-uispeaker="open">
  Toggle
</button>

<!-- Toggle off -->
<button data-uispeaker="close">
  Toggle
</button>`,
  },
  {
    slug: "dropdown",
    name: "Dropdown",
    description:
      "Sound-enabled dropdowns that play an opening sound when expanded and a closing sound when collapsed.",
    defaultSound: "open",
    availableSounds: ["open", "close", "pop", "swoosh", "click"],
    codeExample: `<!-- Dropdown trigger -->
<button data-uispeaker="{{sound}}">
  Select option
</button>

<!-- Or use open/close pair -->
<button data-uispeaker="open">Open</button>
<button data-uispeaker="close">Close</button>`,
  },
  {
    slug: "dialog",
    name: "Dialog",
    description:
      "Announce dialogs and modals with sound. An opening tone draws attention, while a closing tone confirms dismissal.",
    defaultSound: "open",
    availableSounds: ["open", "close", "pop", "swoosh"],
    codeExample: `<!-- Open dialog -->
<button data-uispeaker="open">
  Open dialog
</button>

<!-- Close dialog -->
<button data-uispeaker="close">
  Close
</button>`,
  },
  {
    slug: "notification",
    name: "Notification",
    description:
      "Play distinct sounds for success, error, and warning notifications. Each type has its own tone for instant recognition.",
    defaultSound: "success",
    availableSounds: ["success", "error", "warning"],
    codeExample: `<!-- Trigger programmatically -->
<script>
  UISpeaker.play("{{sound}}");
</script>

<!-- Or via data attribute -->
<button data-uispeaker="{{sound}}">
  Show notification
</button>`,
  },
];

export function getComponentBySlug(slug: string): ComponentDef | undefined {
  return COMPONENTS.find((c) => c.slug === slug);
}

/** All valid slugs for static params generation */
export function getAllSlugs(): string[] {
  return COMPONENTS.map((c) => c.slug);
}
