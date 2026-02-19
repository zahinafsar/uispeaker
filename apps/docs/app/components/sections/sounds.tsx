import { SoundDemo } from "../sound-demo";

export function SoundsSection() {
  return (
    <section id="sounds" className="border-t border-border">
      <div className="mx-auto max-w-screen-xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Sound library
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            13 curated sounds across 5 categories. Click any sound to preview
            it.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <SoundDemo />
        </div>
      </div>
    </section>
  );
}
