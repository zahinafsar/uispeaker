"use client";

import { CopyButton } from "./copy-button";

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language = "html" }: CodeBlockProps) {
  return (
    <div className="group relative rounded-lg border border-border bg-muted">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="text-xs font-medium text-muted-foreground">
          {language}
        </span>
        <CopyButton text={code} />
      </div>
      <pre className="overflow-x-auto p-4">
        <code className="font-mono text-sm text-foreground">{code}</code>
      </pre>
    </div>
  );
}
