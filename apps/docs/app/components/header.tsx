"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./theme-provider";
import { Volume2Icon, SunIcon, MoonIcon, GitHubIcon } from "./icons";
import { COMPONENTS } from "./component-data";

const NAV_LINKS = [
  { href: "/#features", label: "Features" },
  { href: "/#demo", label: "Demo" },
  { href: "/#sounds", label: "Sounds" },
  { href: "/docs", label: "Docs" },
  { href: "/components/button", label: "Components" },
];

const DOC_LINKS = [
  { href: "/docs", label: "Installation & Setup" },
  { href: "/docs#api-reference", label: "API Reference" },
  { href: "/docs#sound-catalog", label: "Sound Catalog" },
  { href: "/docs#troubleshooting", label: "Troubleshooting" },
];

export function Header() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isDocsOrComponents =
    pathname.startsWith("/docs") || pathname.startsWith("/components");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:hidden"
            aria-label="Toggle menu"
            data-uispeaker="click"
          >
            {mobileOpen ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>

          <Link href="/" className="flex items-center gap-2">
            <Volume2Icon className="h-5 w-5" />
            <span className="text-base font-semibold tracking-tight">
              UISpeaker
            </span>
          </Link>
        </div>

        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground"
              data-uispeaker="hover"
            >
              {link.label}
            </Link>
          ))}
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

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="mx-auto max-w-screen-xl px-4 py-4 sm:px-6">
            <div className="space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  data-uispeaker="hover"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Show sidebar nav on docs/components pages */}
            {isDocsOrComponents && (
              <>
                <div className="my-3 border-t border-border" />
                <div className="space-y-3">
                  <div>
                    <h4 className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Documentation
                    </h4>
                    <div className="space-y-0.5">
                      {DOC_LINKS.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          className="block rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
                          data-uispeaker="hover"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Components
                    </h4>
                    <div className="space-y-0.5">
                      {COMPONENTS.map((component) => (
                        <Link
                          key={component.slug}
                          href={`/components/${component.slug}`}
                          onClick={() => setMobileOpen(false)}
                          className={`block rounded-md px-3 py-1.5 text-sm transition-colors ${
                            pathname === `/components/${component.slug}`
                              ? "bg-accent font-medium text-foreground"
                              : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                          }`}
                          data-uispeaker="hover"
                        >
                          {component.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
