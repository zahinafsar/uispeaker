"use client";

import { useState } from "react";

export function InteractiveDemo() {
  const [checked, setChecked] = useState(false);
  const [toggled, setToggled] = useState(false);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* Button demo */}
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Button
        </p>
        <button
          className="inline-flex h-9 items-center justify-center rounded-md bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          data-uispeaker="click"
        >
          Click me
        </button>
        <pre className="mt-3 rounded-md bg-muted px-3 py-2 font-mono text-xs text-muted-foreground">
          <code>{`<button data-uispeaker="click">`}</code>
        </pre>
      </div>

      {/* Input demo */}
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Text Input
        </p>
        <input
          type="text"
          placeholder="Type something..."
          className="flex h-9 w-full rounded-md border border-border bg-transparent px-3 py-1 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"
          data-uispeaker="keystroke"
        />
        <pre className="mt-3 rounded-md bg-muted px-3 py-2 font-mono text-xs text-muted-foreground">
          <code>{`<input data-uispeaker="keystroke">`}</code>
        </pre>
      </div>

      {/* Checkbox demo */}
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Checkbox
        </p>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="h-4 w-4 rounded border-border accent-foreground"
            data-uispeaker="tap"
          />
          <span>Enable sounds</span>
        </label>
        <pre className="mt-3 rounded-md bg-muted px-3 py-2 font-mono text-xs text-muted-foreground">
          <code>{`<input type="checkbox" data-uispeaker="tap">`}</code>
        </pre>
      </div>

      {/* Hover demo */}
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Hover
        </p>
        <div
          className="flex h-9 cursor-default items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
          data-uispeaker="swoosh"
          data-uispeaker-event="hover"
        >
          Hover over me
        </div>
        <pre className="mt-3 rounded-md bg-muted px-3 py-2 font-mono text-xs text-muted-foreground">
          <code>{`<div data-uispeaker="swoosh"\n     data-uispeaker-event="hover">`}</code>
        </pre>
      </div>

      {/* Toggle demo */}
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Toggle
        </p>
        <button
          onClick={() => setToggled(!toggled)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
            toggled ? "bg-foreground" : "bg-muted"
          }`}
          data-uispeaker={toggled ? "close" : "open"}
          role="switch"
          aria-checked={toggled}
        >
          <span
            className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${
              toggled ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
        <pre className="mt-3 rounded-md bg-muted px-3 py-2 font-mono text-xs text-muted-foreground">
          <code>{`<button data-uispeaker="open">`}</code>
        </pre>
      </div>

      {/* Notification demo */}
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Notifications
        </p>
        <div className="flex gap-2">
          <button
            className="inline-flex h-8 items-center rounded-md border border-green-500/30 bg-green-500/10 px-3 text-xs font-medium text-green-500 transition-colors hover:bg-green-500/20"
            data-uispeaker="success"
          >
            Success
          </button>
          <button
            className="inline-flex h-8 items-center rounded-md border border-red-500/30 bg-red-500/10 px-3 text-xs font-medium text-red-500 transition-colors hover:bg-red-500/20"
            data-uispeaker="error"
          >
            Error
          </button>
          <button
            className="inline-flex h-8 items-center rounded-md border border-yellow-500/30 bg-yellow-500/10 px-3 text-xs font-medium text-yellow-500 transition-colors hover:bg-yellow-500/20"
            data-uispeaker="warning"
          >
            Warning
          </button>
        </div>
        <pre className="mt-3 rounded-md bg-muted px-3 py-2 font-mono text-xs text-muted-foreground">
          <code>{`UISpeaker.play("success")`}</code>
        </pre>
      </div>
    </div>
  );
}
