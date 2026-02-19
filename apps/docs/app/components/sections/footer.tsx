import { Volume2Icon } from "../icons";

export function FooterSection() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-screen-xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Volume2Icon className="h-4 w-4" />
          <span>UISpeaker</span>
          <span className="text-border">|</span>
          <span>Open source UI sound library</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <a
            href="https://github.com/zahinafsar/uispeaker"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            GitHub
          </a>
          <a
            href="https://npmjs.com/package/uispeaker"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            npm
          </a>
        </div>
      </div>
    </footer>
  );
}
