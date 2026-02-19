import { CodeIcon, GlobeIcon, PackageIcon, ZapIcon } from "../icons";

const FEATURES = [
  {
    icon: CodeIcon,
    title: "One Data Attribute",
    description:
      'Add data-uispeaker="click" to any element. No JavaScript required. The library handles the rest automatically.',
  },
  {
    icon: GlobeIcon,
    title: "Framework Agnostic",
    description:
      "Works with React, Vue, Svelte, plain HTML, or any framework. Drop in a script tag and you're set.",
  },
  {
    icon: PackageIcon,
    title: "CDN-Loaded Sounds",
    description:
      "13 curated sounds loaded on demand. Under 50KB each. No bundling required. Your package stays tiny.",
  },
  {
    icon: ZapIcon,
    title: "Smart Event Detection",
    description:
      "Buttons get click sounds. Inputs get keystroke sounds. Hovers, toggles, notifications -- all auto-detected.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="border-t border-border">
      <div className="mx-auto max-w-screen-xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Sound made simple
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Everything you need to add interactive sounds to your UI, nothing you
            don&apos;t.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-lg border border-border bg-card p-6 transition-colors hover:border-foreground/20"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-muted">
                <feature.icon className="h-4 w-4 text-foreground" />
              </div>
              <h3 className="text-sm font-semibold">{feature.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
