"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { COMPONENTS } from "./component-data";

const DOC_LINKS = [
  { href: "/docs", label: "Installation & Setup" },
  { href: "/docs#api-reference", label: "API Reference" },
  { href: "/docs#sound-catalog", label: "Sound Catalog" },
  { href: "/docs#troubleshooting", label: "Troubleshooting" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 md:w-56 lg:w-64">
      <div className="sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto py-6 pr-4 md:py-8">
        <nav className="space-y-6">
          {/* Documentation section */}
          <div>
            <h4 className="mb-2 text-sm font-semibold tracking-tight">
              Documentation
            </h4>
            <ul className="space-y-0.5">
              {DOC_LINKS.map((link) => {
                const isActive =
                  link.href === "/docs"
                    ? pathname === "/docs"
                    : pathname === "/docs" && false; // hash links don't match pathname

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`block rounded-md px-3 py-1.5 text-sm transition-colors ${
                        isActive
                          ? "bg-accent font-medium text-foreground"
                          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                      }`}
                      data-uispeaker="hover"
                      data-uispeaker-event="hover"
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Components section */}
          <div>
            <h4 className="mb-2 text-sm font-semibold tracking-tight">
              Components
            </h4>
            <ul className="space-y-0.5">
              {COMPONENTS.map((component) => {
                const href = `/components/${component.slug}`;
                const isActive = pathname === href;

                return (
                  <li key={component.slug}>
                    <Link
                      href={href}
                      className={`block rounded-md px-3 py-1.5 text-sm transition-colors ${
                        isActive
                          ? "bg-accent font-medium text-foreground"
                          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                      }`}
                      data-uispeaker="hover"
                      data-uispeaker-event="hover"
                    >
                      {component.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
}
