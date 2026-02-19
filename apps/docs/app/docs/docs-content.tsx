"use client";

import { useState, useCallback } from "react";
import { CodeBlock } from "../components/code-block";
import { PlayIcon } from "../components/icons";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const INSTALL_TABS = [
  {
    id: "npm",
    label: "npm",
    code: "npm install uispeaker",
  },
  {
    id: "yarn",
    label: "yarn",
    code: "yarn add uispeaker",
  },
  {
    id: "pnpm",
    label: "pnpm",
    code: "pnpm add uispeaker",
  },
  {
    id: "cdn",
    label: "CDN / Script Tag",
    code: `<script src="https://cdn.jsdelivr.net/npm/uispeaker/dist/uispeaker.global.js"></script>`,
  },
];

const QUICK_START_HTML = `<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.jsdelivr.net/npm/uispeaker/dist/uispeaker.global.js"><\/script>
</head>
<body>
  <!-- Just add data-uispeaker to any element -->
  <button data-uispeaker="click">Click me</button>
  <input type="text" data-uispeaker="keystroke" placeholder="Type here..." />
  <button data-uispeaker="success">Show success</button>
</body>
</html>`;

const QUICK_START_ESM = `import { init } from 'uispeaker';

// Initialize with optional config
const speaker = init({
  volume: 0.8,
  // cdnBase: '/my-sounds', // optional: custom sound path
});

// That's it! Now add data-uispeaker attributes to your HTML.
// UISpeaker auto-detects elements and binds events.`;

const DATA_ATTRIBUTES = [
  {
    name: "data-uispeaker",
    type: "string",
    required: true,
    description:
      'The primary sound name to play. Can be a built-in sound name (e.g. "click", "success") or a URL to a custom sound file.',
    example: '<button data-uispeaker="click">Click me</button>',
  },
  {
    name: "data-uispeaker-event",
    type: "UISpeakerEvent",
    required: false,
    description:
      'Override the auto-detected event type. By default, UISpeaker infers the event from the element type (buttons get "click", inputs get "input", etc.).',
    example:
      '<div data-uispeaker="hover" data-uispeaker-event="hover">Hover me</div>',
  },
  {
    name: "data-uispeaker-close",
    type: "string",
    required: false,
    description:
      'Secondary sound to play on close transitions. Only works with toggle elements (details, dialog, or elements with data-state). Requires the primary event to be "open".',
    example:
      '<details data-uispeaker="open" data-uispeaker-close="close">\n  <summary>Toggle</summary>\n  <p>Content</p>\n</details>',
  },
];

const EVENT_TYPES = [
  {
    event: "click",
    description: "Fires on mouse click",
    autoDetected: "button, a, select, input[checkbox/radio/range], ARIA roles",
  },
  {
    event: "input",
    description: "Fires on text input (debounced)",
    autoDetected: "input[text/search/email/...], textarea, contenteditable",
  },
  {
    event: "hover",
    description: "Fires on mouse enter",
    autoDetected: "Must be set explicitly via data-uispeaker-event",
  },
  {
    event: "mousemove",
    description: "Fires on mouse move (throttled)",
    autoDetected: "Must be set explicitly via data-uispeaker-event",
  },
  {
    event: "focus",
    description: "Fires when element receives focus",
    autoDetected: "Must be set explicitly via data-uispeaker-event",
  },
  {
    event: "blur",
    description: "Fires when element loses focus",
    autoDetected: "Must be set explicitly via data-uispeaker-event",
  },
  {
    event: "open",
    description: "Fires on open transitions (toggle, dialog, data-state)",
    autoDetected: "details, dialog, elements with data-state attribute",
  },
  {
    event: "close",
    description: "Fires on close transitions",
    autoDetected: "Must be set explicitly via data-uispeaker-event",
  },
  {
    event: "success",
    description: "Triggers on click (notification convenience)",
    autoDetected: "Must be set explicitly",
  },
  {
    event: "error",
    description: "Triggers on click (notification convenience)",
    autoDetected: "Must be set explicitly",
  },
  {
    event: "warning",
    description: "Triggers on click (notification convenience)",
    autoDetected: "Must be set explicitly",
  },
];

const JS_API_METHODS = [
  {
    method: "init(root?)",
    returns: "void",
    description:
      "Initialize UISpeaker: scans the DOM for data-uispeaker elements and starts observing mutations. Safe to call multiple times (idempotent). Optionally pass a root HTMLElement to scope scanning.",
    example: `const speaker = new UISpeaker({ volume: 0.8 });
speaker.init();

// Or scope to a specific container
speaker.init(document.getElementById('app'));`,
  },
  {
    method: "play(soundName)",
    returns: "void",
    description:
      'Play a sound programmatically by name. Works with built-in sounds, registered custom sounds, or direct URLs.',
    example: `speaker.play('success');
speaker.play('click');
speaker.play('https://example.com/custom.mp3');`,
  },
  {
    method: "volume(v)",
    returns: "void",
    description: "Set the master volume. Accepts a number between 0 (silent) and 1 (full volume).",
    example: `speaker.volume(0.5); // 50% volume`,
  },
  {
    method: "getVolume()",
    returns: "number",
    description: "Get the current volume level (0-1).",
    example: `const vol = speaker.getVolume(); // e.g. 0.5`,
  },
  {
    method: "mute()",
    returns: "void",
    description: "Mute all sounds. The previous volume level is preserved.",
    example: `speaker.mute();`,
  },
  {
    method: "unmute()",
    returns: "void",
    description: "Unmute, restoring the previous volume level.",
    example: `speaker.unmute();`,
  },
  {
    method: "isMuted()",
    returns: "boolean",
    description: "Check if currently muted.",
    example: `if (speaker.isMuted()) { /* ... */ }`,
  },
  {
    method: "register(name, entry)",
    returns: "void",
    description:
      "Register a custom sound. The entry object requires a url property and optionally defaultEvent, category, and description.",
    example: `speaker.register('ding', {
  url: '/sounds/ding.mp3',
  defaultEvent: 'click',
  category: 'notification',
  description: 'Custom ding sound',
});`,
  },
  {
    method: "setCdnBase(base)",
    returns: "void",
    description:
      "Set the CDN base URL for built-in sound files. Overrides the default jsdelivr CDN.",
    example: `speaker.setCdnBase('/my-sounds');`,
  },
  {
    method: "sounds()",
    returns: "string[]",
    description: "List all available sound names (built-in + custom).",
    example: `const allSounds = speaker.sounds();
// ['click', 'tap', 'pop', 'keystroke', ...]`,
  },
  {
    method: "destroy()",
    returns: "void",
    description:
      "Tear down: stop observing DOM mutations, unbind all event listeners, and close audio resources.",
    example: `speaker.destroy();`,
  },
];

const CONFIG_OPTIONS = [
  {
    option: "cdnBase",
    type: "string",
    default: "jsdelivr CDN",
    description: "Base URL for loading built-in sound files.",
  },
  {
    option: "volume",
    type: "number",
    default: "1",
    description: "Initial volume (0-1).",
  },
  {
    option: "muted",
    type: "boolean",
    default: "false",
    description: "Whether to start muted.",
  },
  {
    option: "root",
    type: "HTMLElement",
    default: "document.body",
    description: "Root element to observe for data-uispeaker attributes.",
  },
  {
    option: "inputDebounce",
    type: "number",
    default: "80",
    description: "Debounce time in ms for input events.",
  },
  {
    option: "mousemoveThrottle",
    type: "number",
    default: "100",
    description: "Throttle time in ms for mousemove events.",
  },
];

const SOUND_CATALOG = [
  {
    name: "click",
    category: "Interaction",
    defaultEvent: "click",
    description: "Short digital click for buttons and links",
    duration: "0.5s",
  },
  {
    name: "tap",
    category: "Interaction",
    defaultEvent: "click",
    description: "Soft tap for toggles and checkboxes",
    duration: "2.5s",
  },
  {
    name: "pop",
    category: "Interaction",
    defaultEvent: "click",
    description: "Bubble pop for playful interactions",
    duration: "2.2s",
  },
  {
    name: "keystroke",
    category: "Input",
    defaultEvent: "input",
    description: "Single key press for text input feedback",
    duration: "0.9s",
  },
  {
    name: "typewriter",
    category: "Input",
    defaultEvent: "input",
    description: "Mechanical typewriter key for vintage feel",
    duration: "0.5s",
  },
  {
    name: "hover",
    category: "Hover",
    defaultEvent: "hover",
    description: "Subtle swoosh for hover interactions",
    duration: "1.1s",
  },
  {
    name: "swoosh",
    category: "Hover",
    defaultEvent: "hover",
    description: "Pronounced swoosh for emphasis on hover",
    duration: "2.6s",
  },
  {
    name: "slide",
    category: "Motion",
    defaultEvent: "mousemove",
    description: "Smooth slide for continuous mouse movement",
    duration: "1.0s",
  },
  {
    name: "open",
    category: "Toggle",
    defaultEvent: "open",
    description: "Opening tone for dropdowns, dialogs, and popups",
    duration: "2.0s",
  },
  {
    name: "close",
    category: "Toggle",
    defaultEvent: "close",
    description: "Closing tone for dismissing UI elements",
    duration: "1.1s",
  },
  {
    name: "success",
    category: "Notification",
    defaultEvent: "success",
    description: "Positive chime for success notifications",
    duration: "2.7s",
  },
  {
    name: "error",
    category: "Notification",
    defaultEvent: "error",
    description: "Alert tone for error notifications",
    duration: "2.7s",
  },
  {
    name: "warning",
    category: "Notification",
    defaultEvent: "warning",
    description: "Cautionary beep for warning notifications",
    duration: "0.8s",
  },
];

/* ------------------------------------------------------------------ */
/*  Components                                                         */
/* ------------------------------------------------------------------ */

function SectionHeading({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <h2
      id={id}
      className="mb-4 scroll-mt-20 text-2xl font-bold tracking-tight"
    >
      {children}
    </h2>
  );
}

function SubHeading({
  id,
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <h3
      id={id}
      className="mb-3 scroll-mt-20 text-lg font-semibold tracking-tight"
    >
      {children}
    </h3>
  );
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
      {children}
    </code>
  );
}

function InstallTabs() {
  const [active, setActive] = useState("npm");
  const tab = INSTALL_TABS.find((t) => t.id === active)!;

  return (
    <div>
      <div className="flex gap-0 border-b border-border">
        {INSTALL_TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              active === t.id
                ? "border-b-2 border-foreground text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            data-uispeaker="tap"
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        <CodeBlock
          code={tab.code}
          language={tab.id === "cdn" ? "html" : "bash"}
        />
      </div>
    </div>
  );
}

function SoundCatalogTable() {
  const playSound = useCallback((name: string) => {
    if (typeof window !== "undefined" && window.__uispeaker) {
      window.__uispeaker.play(name);
    }
  }, []);

  const categories = Array.from(
    new Set(SOUND_CATALOG.map((s) => s.category))
  );

  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <div key={category}>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {category}
          </h4>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                    Sound
                  </th>
                  <th className="hidden px-4 py-2.5 text-left font-medium text-muted-foreground sm:table-cell">
                    Event
                  </th>
                  <th className="hidden px-4 py-2.5 text-left font-medium text-muted-foreground md:table-cell">
                    Duration
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                    Description
                  </th>
                  <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">
                    Preview
                  </th>
                </tr>
              </thead>
              <tbody>
                {SOUND_CATALOG.filter((s) => s.category === category).map(
                  (sound) => (
                    <tr
                      key={sound.name}
                      className="border-b border-border last:border-0"
                    >
                      <td className="px-4 py-2.5">
                        <InlineCode>{sound.name}</InlineCode>
                      </td>
                      <td className="hidden px-4 py-2.5 text-muted-foreground sm:table-cell">
                        {sound.defaultEvent}
                      </td>
                      <td className="hidden px-4 py-2.5 text-muted-foreground md:table-cell">
                        {sound.duration}
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        {sound.description}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <button
                          onClick={() => playSound(sound.name)}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-accent text-muted-foreground transition-colors hover:bg-foreground hover:text-background"
                          aria-label={`Play ${sound.name} sound`}
                          data-uispeaker="click"
                        >
                          <PlayIcon className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Content                                                       */
/* ------------------------------------------------------------------ */

export function DocsContent() {
  return (
    <div className="max-w-3xl">
      {/* Page title */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Documentation</h1>
        <p className="mt-2 text-base text-muted-foreground">
          Everything you need to add sound to your UI. Install UISpeaker, learn
          the API, browse available sounds, and troubleshoot common issues.
        </p>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/*  Installation                                                     */}
      {/* ---------------------------------------------------------------- */}
      <section className="mb-14">
        <SectionHeading id="installation">Installation</SectionHeading>

        <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
          UISpeaker works everywhere -- vanilla HTML, React, Vue, Svelte, or any
          framework. Choose your preferred installation method:
        </p>

        <InstallTabs />

        <div className="mt-8">
          <SubHeading>Quick Start (Script Tag)</SubHeading>
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
            The fastest way to get started. Add the script tag and use{" "}
            <InlineCode>data-uispeaker</InlineCode> attributes on any element.
            UISpeaker auto-initializes and handles everything.
          </p>
          <CodeBlock code={QUICK_START_HTML} language="html" />
        </div>

        <div className="mt-8">
          <SubHeading>Quick Start (ES Module)</SubHeading>
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
            For bundled projects using npm/yarn/pnpm. Import and initialize
            UISpeaker, then use data attributes in your markup.
          </p>
          <CodeBlock code={QUICK_START_ESM} language="javascript" />
        </div>

        <div className="mt-6 rounded-lg border border-border bg-card p-5">
          <p className="text-sm font-medium text-foreground">
            How it works
          </p>
          <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <span className="font-mono text-foreground">1.</span>{" "}
              UISpeaker scans the DOM for elements with{" "}
              <InlineCode>data-uispeaker</InlineCode> attributes
            </li>
            <li>
              <span className="font-mono text-foreground">2.</span>{" "}
              It auto-detects the element type and binds the appropriate event
              (click for buttons, input for text fields, etc.)
            </li>
            <li>
              <span className="font-mono text-foreground">3.</span>{" "}
              When the event fires, the specified sound plays from the CDN
            </li>
            <li>
              <span className="font-mono text-foreground">4.</span>{" "}
              A MutationObserver watches for dynamically added elements, so it
              works with SPAs and lazy-loaded content
            </li>
          </ol>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/*  API Reference                                                    */}
      {/* ---------------------------------------------------------------- */}
      <section className="mb-14">
        <SectionHeading id="api-reference">API Reference</SectionHeading>

        {/* Data Attributes */}
        <div className="mb-10">
          <SubHeading id="data-attributes">Data Attributes</SubHeading>
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
            The primary way to use UISpeaker. Add these attributes to any HTML
            element to bind sounds.
          </p>

          <div className="space-y-4">
            {DATA_ATTRIBUTES.map((attr) => (
              <div
                key={attr.name}
                className="rounded-lg border border-border bg-card p-5"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <InlineCode>{attr.name}</InlineCode>
                  <span className="text-xs text-muted-foreground">
                    {attr.type}
                  </span>
                  {attr.required && (
                    <span className="rounded bg-foreground/10 px-1.5 py-0.5 text-xs font-medium text-foreground">
                      required
                    </span>
                  )}
                </div>
                <p className="mb-3 text-sm text-muted-foreground">
                  {attr.description}
                </p>
                <CodeBlock code={attr.example} language="html" />
              </div>
            ))}
          </div>
        </div>

        {/* Event Types */}
        <div className="mb-10">
          <SubHeading id="event-types">Event Types</SubHeading>
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
            UISpeaker automatically detects the right event based on the element
            type. You can override this with{" "}
            <InlineCode>data-uispeaker-event</InlineCode>.
          </p>

          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                    Event
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                    Description
                  </th>
                  <th className="hidden px-4 py-2.5 text-left font-medium text-muted-foreground md:table-cell">
                    Auto-Detected For
                  </th>
                </tr>
              </thead>
              <tbody>
                {EVENT_TYPES.map((et) => (
                  <tr
                    key={et.event}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-4 py-2.5">
                      <InlineCode>{et.event}</InlineCode>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {et.description}
                    </td>
                    <td className="hidden px-4 py-2.5 text-muted-foreground md:table-cell">
                      {et.autoDetected}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* JavaScript API */}
        <div className="mb-10">
          <SubHeading id="javascript-api">JavaScript API</SubHeading>
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
            For programmatic control. When using the CDN script tag, methods are
            available on the global <InlineCode>UISpeaker</InlineCode> object.
            When using ESM, call methods on the instance returned by the
            constructor.
          </p>

          <div className="mb-4 rounded-lg border border-border bg-card p-5">
            <p className="mb-3 text-sm font-medium text-foreground">
              CDN (global) usage:
            </p>
            <CodeBlock
              code={`// Methods available globally after script tag loads
UISpeaker.play('success');
UISpeaker.volume(0.5);
UISpeaker.mute();`}
              language="javascript"
            />
          </div>

          <div className="mb-6 rounded-lg border border-border bg-card p-5">
            <p className="mb-3 text-sm font-medium text-foreground">
              ESM (instance) usage:
            </p>
            <CodeBlock
              code={`import { UISpeaker } from 'uispeaker';

const speaker = new UISpeaker({ volume: 0.8 });
speaker.init();
speaker.play('success');`}
              language="javascript"
            />
          </div>

          <div className="space-y-4">
            {JS_API_METHODS.map((m) => (
              <div
                key={m.method}
                className="rounded-lg border border-border bg-card p-5"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm font-semibold text-foreground">
                    .{m.method}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    &rarr; {m.returns}
                  </span>
                </div>
                <p className="mb-3 text-sm text-muted-foreground">
                  {m.description}
                </p>
                <CodeBlock code={m.example} language="javascript" />
              </div>
            ))}
          </div>
        </div>

        {/* Configuration */}
        <div className="mb-10">
          <SubHeading id="configuration">Configuration Options</SubHeading>
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
            Pass these options to the <InlineCode>UISpeaker</InlineCode>{" "}
            constructor or the <InlineCode>init()</InlineCode> convenience
            function.
          </p>

          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                    Option
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                    Type
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                    Default
                  </th>
                  <th className="hidden px-4 py-2.5 text-left font-medium text-muted-foreground sm:table-cell">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {CONFIG_OPTIONS.map((opt) => (
                  <tr
                    key={opt.option}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-4 py-2.5">
                      <InlineCode>{opt.option}</InlineCode>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {opt.type}
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {opt.default}
                    </td>
                    <td className="hidden px-4 py-2.5 text-muted-foreground sm:table-cell">
                      {opt.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4">
            <CodeBlock
              code={`const speaker = new UISpeaker({
  cdnBase: '/my-sounds',
  volume: 0.8,
  muted: false,
  root: document.getElementById('app'),
  inputDebounce: 80,
  mousemoveThrottle: 100,
});
speaker.init();`}
              language="javascript"
            />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/*  Sound Catalog                                                    */}
      {/* ---------------------------------------------------------------- */}
      <section className="mb-14">
        <SectionHeading id="sound-catalog">Sound Catalog</SectionHeading>
        <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
          UISpeaker ships with 13 built-in sounds covering all interaction
          types. Click the play button to preview each sound.
        </p>

        <SoundCatalogTable />

        <div className="mt-6 rounded-lg border border-border bg-card p-5">
          <p className="text-sm font-medium text-foreground">
            Custom sounds
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            You can register your own sounds to extend the catalog:
          </p>
          <div className="mt-3">
            <CodeBlock
              code={`// Register a custom sound
speaker.register('custom-ding', {
  url: '/sounds/ding.mp3',
  defaultEvent: 'click',
  category: 'notification',
  description: 'Custom notification ding',
});

// Use it in HTML
// <button data-uispeaker="custom-ding">Ding!</button>

// Or play it programmatically
speaker.play('custom-ding');`}
              language="javascript"
            />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/*  Troubleshooting                                                  */}
      {/* ---------------------------------------------------------------- */}
      <section className="mb-14">
        <SectionHeading id="troubleshooting">Troubleshooting</SectionHeading>

        <div className="space-y-6">
          {/* Autoplay */}
          <div className="rounded-lg border border-border bg-card p-5">
            <p className="text-sm font-semibold text-foreground">
              Sounds not playing on page load
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Modern browsers block audio playback until the user interacts with
              the page (click, tap, or key press). This is by design -- the Web
              Audio API requires a user gesture to create or resume an
              AudioContext. UISpeaker handles this automatically: the first user
              interaction unlocks audio and sounds work from that point forward.
            </p>
            <div className="mt-3">
              <CodeBlock
                code={`// No workaround needed -- UISpeaker handles this.
// Audio starts working after the user's first click/tap.
// If you need to notify users, consider a visual hint:
<button data-uispeaker="click">
  Click to enable sound
</button>`}
                language="html"
              />
            </div>
          </div>

          {/* Mobile */}
          <div className="rounded-lg border border-border bg-card p-5">
            <p className="text-sm font-semibold text-foreground">
              Mobile browser considerations
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              iOS Safari and some Android browsers have stricter autoplay
              policies. Sounds will only play after a direct user touch event
              (not programmatic triggers). This means{" "}
              <InlineCode>UISpeaker.play()</InlineCode> calls inside{" "}
              <InlineCode>setTimeout</InlineCode> or async callbacks may not
              work on mobile. Always trigger sounds in direct response to user
              interaction for maximum compatibility.
            </p>
          </div>

          {/* Silent mode */}
          <div className="rounded-lg border border-border bg-card p-5">
            <p className="text-sm font-semibold text-foreground">
              Device on silent / Do Not Disturb
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              When a mobile device is on silent or Do Not Disturb mode, web
              audio may be suppressed by the OS. This is expected behavior and
              cannot be overridden by web apps. UISpeaker sounds will resume when
              the device is taken off silent.
            </p>
          </div>

          {/* Multiple instances */}
          <div className="rounded-lg border border-border bg-card p-5">
            <p className="text-sm font-semibold text-foreground">
              Sound overlapping / too many sounds
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Input events are debounced (80ms default) and mousemove events are
              throttled (100ms default) to prevent sound spam. If you still
              experience overlapping, increase these values:
            </p>
            <div className="mt-3">
              <CodeBlock
                code={`const speaker = new UISpeaker({
  inputDebounce: 150,    // increase debounce
  mousemoveThrottle: 200, // increase throttle
});`}
                language="javascript"
              />
            </div>
          </div>

          {/* Custom CDN */}
          <div className="rounded-lg border border-border bg-card p-5">
            <p className="text-sm font-semibold text-foreground">
              Sounds loading slowly or CORS errors
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              By default, sounds load from the jsdelivr CDN. If you experience
              slow loading or CORS issues, host the sound files yourself and set
              a custom CDN base:
            </p>
            <div className="mt-3">
              <CodeBlock
                code={`// Self-host sounds in your public directory
const speaker = new UISpeaker({
  cdnBase: '/sounds', // relative to your site root
});`}
                language="javascript"
              />
            </div>
          </div>

          {/* Cleanup */}
          <div className="rounded-lg border border-border bg-card p-5">
            <p className="text-sm font-semibold text-foreground">
              Memory leaks in SPAs
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              UISpeaker uses a MutationObserver to track elements. When elements
              are removed from the DOM, their event listeners are automatically
              cleaned up. If you unmount your entire app or switch routes in a
              SPA, call <InlineCode>destroy()</InlineCode> to fully release
              resources:
            </p>
            <div className="mt-3">
              <CodeBlock
                code={`// React cleanup example
useEffect(() => {
  const speaker = new UISpeaker();
  speaker.init();

  return () => speaker.destroy();
}, []);`}
                language="javascript"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/*  Framework Integration                                            */}
      {/* ---------------------------------------------------------------- */}
      <section className="mb-14">
        <SectionHeading id="framework-integration">
          Framework Integration
        </SectionHeading>

        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-5">
            <p className="text-sm font-semibold text-foreground">React</p>
            <div className="mt-3">
              <CodeBlock
                code={`import { useEffect, useRef } from 'react';
import { UISpeaker } from 'uispeaker';

function UISpeakerProvider() {
  const ref = useRef<UISpeaker | null>(null);

  useEffect(() => {
    const speaker = new UISpeaker({ volume: 0.5 });
    speaker.init();
    ref.current = speaker;

    return () => {
      speaker.destroy();
      ref.current = null;
    };
  }, []);

  return null; // Renders nothing, just initializes
}

// In your App:
function App() {
  return (
    <>
      <UISpeakerProvider />
      <button data-uispeaker="click">Click me</button>
    </>
  );
}`}
                language="tsx"
              />
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-5">
            <p className="text-sm font-semibold text-foreground">
              Vue
            </p>
            <div className="mt-3">
              <CodeBlock
                code={`<script setup>
import { onMounted, onBeforeUnmount } from 'vue';
import { UISpeaker } from 'uispeaker';

let speaker;

onMounted(() => {
  speaker = new UISpeaker({ volume: 0.5 });
  speaker.init();
});

onBeforeUnmount(() => {
  speaker?.destroy();
});
</script>

<template>
  <button data-uispeaker="click">Click me</button>
</template>`}
                language="vue"
              />
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-5">
            <p className="text-sm font-semibold text-foreground">
              Svelte
            </p>
            <div className="mt-3">
              <CodeBlock
                code={`<script>
  import { onMount, onDestroy } from 'svelte';
  import { UISpeaker } from 'uispeaker';

  let speaker;

  onMount(() => {
    speaker = new UISpeaker({ volume: 0.5 });
    speaker.init();
  });

  onDestroy(() => {
    speaker?.destroy();
  });
</script>

<button data-uispeaker="click">Click me</button>`}
                language="svelte"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
