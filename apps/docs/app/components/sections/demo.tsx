import { InteractiveDemo } from "../interactive-demo";

export function DemoSection() {
  return (
    <section id="demo" className="border-t border-border">
      <div className="mx-auto max-w-screen-xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Try it yourself
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Every element on this page uses UISpeaker. Interact with the
            components below to hear sounds in action.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <InteractiveDemo />
        </div>
      </div>
    </section>
  );
}
