"use client";

import Link from "next/link";
import { useTheme } from "./theme-provider";
import { Volume2Icon, SunIcon, MoonIcon, GitHubIcon } from "./icons";

export function Header() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Volume2Icon className="h-5 w-5" />
          <span className="text-base font-semibold tracking-tight">
            UISpeaker
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          <Link
            href="/#features"
            className="transition-colors hover:text-foreground"
            data-uispeaker="hover"
          >
            Features
          </Link>
          <Link
            href="/#demo"
            className="transition-colors hover:text-foreground"
            data-uispeaker="hover"
          >
            Demo
          </Link>
          <Link
            href="/#sounds"
            className="transition-colors hover:text-foreground"
            data-uispeaker="hover"
          >
            Sounds
          </Link>
          <Link
            href="/docs"
            className="transition-colors hover:text-foreground"
            data-uispeaker="hover"
          >
            Docs
          </Link>
          <Link
            href="/components/button"
            className="transition-colors hover:text-foreground"
            data-uispeaker="hover"
          >
            Components
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="https://github.com/zahinafsar/uispeaker"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            data-uispeaker="click"
          >
            <GitHubIcon className="h-4 w-4" />
            <span className="sr-only">GitHub</span>
          </a>
          <button
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            data-uispeaker="click"
          >
            {resolvedTheme === "dark" ? (
              <SunIcon className="h-4 w-4" />
            ) : (
              <MoonIcon className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle theme</span>
          </button>
        </div>
      </div>
    </header>
  );
}
