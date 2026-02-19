"use client";

import { useState, useCallback } from "react";

interface PreviewProps {
  sound: string;
}

/* ------------------------------------------------------------------ */
/*  Button                                                             */
/* ------------------------------------------------------------------ */
export function ButtonPreview({ sound }: PreviewProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        className="inline-flex h-9 items-center justify-center rounded-md bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
        data-uispeaker={sound}
      >
        Primary
      </button>
      <button
        className="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        data-uispeaker={sound}
      >
        Secondary
      </button>
      <button
        className="inline-flex h-9 items-center justify-center rounded-md bg-red-500 px-4 text-sm font-medium text-white transition-colors hover:bg-red-600"
        data-uispeaker={sound}
      >
        Destructive
      </button>
      <button
        className="inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium text-foreground underline-offset-4 transition-colors hover:underline"
        data-uispeaker={sound}
      >
        Link
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Input                                                              */
/* ------------------------------------------------------------------ */
export function InputPreview({ sound }: PreviewProps) {
  return (
    <div className="flex max-w-sm flex-col gap-3">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          Email
        </label>
        <input
          type="email"
          placeholder="you@example.com"
          className="flex h-9 w-full rounded-md border border-border bg-transparent px-3 py-1 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"
          data-uispeaker={sound}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          Message
        </label>
        <textarea
          placeholder="Type your message..."
          rows={3}
          className="flex w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"
          data-uispeaker={sound}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Checkbox                                                           */
/* ------------------------------------------------------------------ */
export function CheckboxPreview({ sound }: PreviewProps) {
  const [values, setValues] = useState([true, false, false]);

  const toggle = (index: number) => {
    setValues((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const labels = ["Enable sounds", "Dark mode", "Notifications"];

  return (
    <div className="flex flex-col gap-3">
      {labels.map((label, i) => (
        <label
          key={label}
          className="flex cursor-pointer items-center gap-2.5 text-sm"
        >
          <input
            type="checkbox"
            checked={values[i]}
            onChange={() => toggle(i)}
            className="h-4 w-4 rounded border-border accent-foreground"
            data-uispeaker={sound}
          />
          <span>{label}</span>
        </label>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Toggle                                                             */
/* ------------------------------------------------------------------ */
export function TogglePreview({ sound }: PreviewProps) {
  const [states, setStates] = useState([false, true, false]);

  const toggle = (index: number) => {
    setStates((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const labels = ["Airplane mode", "Wi-Fi", "Bluetooth"];

  return (
    <div className="flex flex-col gap-4">
      {labels.map((label, i) => (
        <div key={label} className="flex items-center justify-between">
          <span className="text-sm">{label}</span>
          <button
            onClick={() => toggle(i)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
              states[i] ? "bg-foreground" : "bg-muted"
            }`}
            data-uispeaker={states[i] ? "close" : sound}
            role="switch"
            aria-checked={states[i]}
          >
            <span
              className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${
                states[i] ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Dropdown                                                           */
/* ------------------------------------------------------------------ */
export function DropdownPreview({ sound }: PreviewProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Select a framework...");
  const options = ["React", "Vue", "Svelte", "Angular", "Solid"];

  const handleSelect = (option: string) => {
    setSelected(option);
    setOpen(false);
    if (window.__uispeaker) window.__uispeaker.play("close");
  };

  const handleToggle = useCallback(() => {
    setOpen((prev) => {
      const next = !prev;
      if (window.__uispeaker) {
        window.__uispeaker.play(next ? sound : "close");
      }
      return next;
    });
  }, [sound]);

  return (
    <div className="relative max-w-xs">
      <button
        onClick={handleToggle}
        className="flex h-9 w-full items-center justify-between rounded-md border border-border bg-transparent px-3 text-sm transition-colors hover:bg-accent"
      >
        <span className={selected.startsWith("Select") ? "text-muted-foreground" : ""}>{selected}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-full rounded-md border border-border bg-card shadow-lg">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className="block w-full px-3 py-2 text-left text-sm transition-colors hover:bg-accent first:rounded-t-md last:rounded-b-md"
              data-uispeaker="hover"
              data-uispeaker-event="hover"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Dialog                                                             */
/* ------------------------------------------------------------------ */
export function DialogPreview({ sound }: PreviewProps) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    if (window.__uispeaker) window.__uispeaker.play(sound);
  };

  const handleClose = () => {
    setOpen(false);
    if (window.__uispeaker) window.__uispeaker.play("close");
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="inline-flex h-9 items-center justify-center rounded-md bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
      >
        Open Dialog
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />
          {/* Dialog */}
          <div className="relative z-10 w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-xl">
            <h3 className="text-lg font-semibold">Dialog Title</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              This is a dialog with sound feedback. The opening and closing
              actions each play a distinct sound to provide auditory cues.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={handleClose}
                className="inline-flex h-9 items-center justify-center rounded-md border border-border px-4 text-sm font-medium transition-colors hover:bg-accent"
              >
                Cancel
              </button>
              <button
                onClick={handleClose}
                className="inline-flex h-9 items-center justify-center rounded-md bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                data-uispeaker="success"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Notification                                                       */
/* ------------------------------------------------------------------ */
export function NotificationPreview({ sound: selectedSound }: PreviewProps) {
  const [notification, setNotification] = useState<{
    type: string;
    message: string;
  } | null>(null);

  const show = useCallback(
    (type: string) => {
      const messages: Record<string, string> = {
        success: "Changes saved successfully!",
        error: "Something went wrong. Please try again.",
        warning: "Your session will expire in 5 minutes.",
      };
      const soundToPlay = type || selectedSound;
      setNotification({ type: soundToPlay, message: messages[soundToPlay] || messages.success });
      if (window.__uispeaker) window.__uispeaker.play(soundToPlay);
      setTimeout(() => setNotification(null), 3000);
    },
    [selectedSound]
  );

  const colorMap: Record<string, string> = {
    success:
      "border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400",
    error: "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400",
    warning:
      "border-yellow-500/30 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => show("success")}
          className="inline-flex h-9 items-center rounded-md border border-green-500/30 bg-green-500/10 px-4 text-sm font-medium text-green-600 transition-colors hover:bg-green-500/20 dark:text-green-400"
        >
          Success
        </button>
        <button
          onClick={() => show("error")}
          className="inline-flex h-9 items-center rounded-md border border-red-500/30 bg-red-500/10 px-4 text-sm font-medium text-red-600 transition-colors hover:bg-red-500/20 dark:text-red-400"
        >
          Error
        </button>
        <button
          onClick={() => show("warning")}
          className="inline-flex h-9 items-center rounded-md border border-yellow-500/30 bg-yellow-500/10 px-4 text-sm font-medium text-yellow-600 transition-colors hover:bg-yellow-500/20 dark:text-yellow-400"
        >
          Warning
        </button>
      </div>

      {notification && (
        <div
          className={`mt-4 rounded-lg border px-4 py-3 text-sm ${colorMap[notification.type] || colorMap.success}`}
        >
          {notification.message}
        </div>
      )}
    </div>
  );
}
