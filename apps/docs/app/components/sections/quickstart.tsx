"use client";

import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";
import { CopyButton } from "../copy-button";
import { useTheme } from "../theme-provider";

const SCRIPT_TAG_CODE = `<!-- Add the script tag -->
<script src="https://unpkg.com/uispeaker"></script>

<!-- Add sounds to any element -->
<button data-uispeaker="click">Save</button>
<input data-uispeaker="keystroke" />
<div data-uispeaker="swoosh"
     data-uispeaker-event="hover">
  Hover me
</div>`;

const ESM_CODE = `import { UISpeaker } from 'uispeaker';

const speaker = new UISpeaker();
speaker.init();

// That's it! Elements with data-uispeaker
// attributes now play sounds automatically.

// Programmatic API:
speaker.play('success');
speaker.volume(0.5);
speaker.mute();`;

function HighlightedPre({
  code,
  language,
}: {
  code: string;
  language: string;
}) {
  const { resolvedTheme } = useTheme();
  const [html, setHtml] = useState("");

  useEffect(() => {
    const theme = resolvedTheme === "dark" ? "github-dark" : "github-light";
    codeToHtml(code, { lang: language, theme })
      .then(setHtml)
      .catch(() => setHtml(""));
  }, [code, language, resolvedTheme]);

  if (html) {
    return (
      <div
        className="overflow-x-auto [&>pre]:!bg-transparent [&>pre]:p-4 [&>pre]:m-0 [&>pre>code]:font-mono [&>pre>code]:text-xs [&>pre>code]:leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-muted-foreground">
      <code>{code}</code>
    </pre>
  );
}

export function QuickStartSection() {
  return (
    <section id="quickstart" className="border-t border-border">
      <div className="mx-auto max-w-screen-xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Get started in seconds
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Choose your integration method. Both work with any framework.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
          {/* Script tag */}
          <div className="overflow-hidden rounded-lg border border-border">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  Script Tag (CDN)
                </span>
              </div>
              <CopyButton text={SCRIPT_TAG_CODE} />
            </div>
            <HighlightedPre code={SCRIPT_TAG_CODE} language="html" />
          </div>

          {/* ES Module */}
          <div className="overflow-hidden rounded-lg border border-border">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  ES Module (npm)
                </span>
              </div>
              <CopyButton text={ESM_CODE} />
            </div>
            <HighlightedPre code={ESM_CODE} language="javascript" />
          </div>
        </div>

        {/* Supported events */}
        <div className="mx-auto mt-12 max-w-3xl">
          <h3 className="mb-4 text-center text-sm font-semibold">
            Supported Events
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "click",
              "input",
              "hover",
              "mousemove",
              "open",
              "close",
              "focus",
              "blur",
              "success",
              "error",
              "warning",
            ].map((event) => (
              <span
                key={event}
                className="rounded-md border border-border bg-muted/50 px-2.5 py-1 font-mono text-xs text-muted-foreground"
              >
                {event}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
