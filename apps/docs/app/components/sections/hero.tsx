"use client";

import { CopyButton } from "../copy-button";
import { ArrowRightIcon, Volume2Icon } from "../icons";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-background to-transparent" />

      <div className="relative mx-auto max-w-screen-xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
            <Volume2Icon className="h-3 w-3" />
            <span>Open Source UI Sound Library</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Add sound to{" "}
            <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              your UI
            </span>
          </h1>

          {/* Subheading */}
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg">
            A single data attribute is all it takes. Framework-agnostic,
            CDN-loaded, zero dependencies. Make your interfaces feel alive.
          </p>

          {/* Install command */}
          <div className="mx-auto mt-8 flex max-w-sm items-center justify-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-2.5 font-mono text-sm">
            <span className="text-muted-foreground">$</span>
            <span className="flex-1 text-left">npm i uispeaker</span>
            <CopyButton text="npm i uispeaker" />
          </div>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#demo"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
              data-uispeaker="click"
            >
              Try the Demo
              <ArrowRightIcon className="h-4 w-4" />
            </a>
            <a
              href="#quickstart"
              className="inline-flex h-10 items-center justify-center rounded-md border border-border px-5 text-sm font-medium transition-colors hover:bg-accent"
              data-uispeaker="click"
            >
              Quick Start
            </a>
          </div>

          {/* One-liner code example */}
          <div className="mx-auto mt-12 max-w-lg overflow-hidden rounded-lg border border-border bg-muted/30">
            <div className="flex items-center gap-2 border-b border-border px-4 py-2">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
              </div>
              <span className="text-xs text-muted-foreground">index.html</span>
            </div>
            <div className="px-4 py-3 text-left font-mono text-sm leading-relaxed">
              <span className="text-muted-foreground">&lt;</span>
              <span className="text-blue-400">button</span>
              <span className="text-purple-400"> data-uispeaker</span>
              <span className="text-muted-foreground">=</span>
              <span className="text-green-400">&quot;click&quot;</span>
              <span className="text-muted-foreground">&gt;</span>
              <br />
              <span className="ml-4 text-foreground">Save Changes</span>
              <br />
              <span className="text-muted-foreground">&lt;/</span>
              <span className="text-blue-400">button</span>
              <span className="text-muted-foreground">&gt;</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
