"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { ComponentDef } from "../component-data";
import { SoundSelector } from "../sound-selector";
import { CodeBlock } from "../code-block";
import {
  ButtonPreview,
  InputPreview,
  CheckboxPreview,
  TogglePreview,
  DropdownPreview,
  DialogPreview,
  NotificationPreview,
} from "../component-previews";
import { ArrowRightIcon } from "../icons";

const PREVIEW_MAP: Record<
  string,
  React.ComponentType<{ sound: string }>
> = {
  button: ButtonPreview,
  input: InputPreview,
  checkbox: CheckboxPreview,
  toggle: TogglePreview,
  dropdown: DropdownPreview,
  dialog: DialogPreview,
  notification: NotificationPreview,
};

interface ComponentShowcaseProps {
  component: ComponentDef;
  prev: ComponentDef | null;
  next: ComponentDef | null;
}

export function ComponentShowcase({
  component,
  prev,
  next,
}: ComponentShowcaseProps) {
  const [selectedSound, setSelectedSound] = useState(component.defaultSound);

  const PreviewComponent = PREVIEW_MAP[component.slug];

  const codeExample = useMemo(
    () => component.codeExample.replace(/\{\{sound\}\}/g, selectedSound),
    [component.codeExample, selectedSound]
  );

  return (
    <div className="max-w-3xl">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{component.name}</h1>
        <p className="mt-2 text-base text-muted-foreground">
          {component.description}
        </p>
      </div>

      {/* Preview */}
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Preview
          </h2>
          <SoundSelector
            sounds={component.availableSounds}
            selected={selectedSound}
            onChange={setSelectedSound}
          />
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          {PreviewComponent && <PreviewComponent sound={selectedSound} />}
        </div>
      </div>

      {/* Code */}
      <div className="mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Code
        </h2>
        <CodeBlock code={codeExample} />
      </div>

      {/* Usage notes */}
      <div className="mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Usage
        </h2>
        <div className="rounded-lg border border-border bg-card p-6 text-sm leading-relaxed text-muted-foreground">
          <p>
            Add the <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">data-uispeaker</code> attribute
            to any HTML element with the sound name as the value. UISpeaker
            automatically detects the element type and binds the appropriate
            event listener.
          </p>
          <div className="mt-4">
            <p className="font-medium text-foreground">Available sounds for this component:</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {component.availableSounds.map((sound) => (
                <span
                  key={sound}
                  className="inline-flex items-center rounded-md bg-muted px-2 py-1 font-mono text-xs text-foreground"
                >
                  {sound}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Prev / Next navigation */}
      <div className="flex items-center justify-between border-t border-border pt-6">
        {prev ? (
          <Link
            href={`/components/${prev.slug}`}
            className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            data-uispeaker="click"
          >
            <ArrowRightIcon className="h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-0.5" />
            {prev.name}
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/components/${next.slug}`}
            className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            data-uispeaker="click"
          >
            {next.name}
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
