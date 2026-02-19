"use client";

import { useEffect, useState, useRef } from "react";
import { codeToHtml } from "shiki";
import { CopyButton } from "./copy-button";
import { useTheme } from "./theme-provider";

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language = "html" }: CodeBlockProps) {
  const { resolvedTheme } = useTheme();
  const [html, setHtml] = useState<string>("");
  const prevKeyRef = useRef("");

  useEffect(() => {
    const theme = resolvedTheme === "dark" ? "github-dark" : "github-light";
    const key = `${code}:${language}:${theme}`;
    if (key === prevKeyRef.current) return;
    prevKeyRef.current = key;

    // Map non-standard language ids to shiki-supported ones
    const langMap: Record<string, string> = {
      vue: "vue",
      svelte: "svelte",
      tsx: "tsx",
      jsx: "jsx",
      bash: "bash",
      html: "html",
      javascript: "javascript",
      js: "javascript",
      typescript: "typescript",
      ts: "typescript",
    };
    const lang = langMap[language] || "text";

    codeToHtml(code, {
      lang,
      theme,
    })
      .then((result) => setHtml(result))
      .catch(() => setHtml(""));
  }, [code, language, resolvedTheme]);

  return (
    <div className="group relative rounded-lg border border-border bg-muted overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="text-xs font-medium text-muted-foreground">
          {language}
        </span>
        <CopyButton text={code} />
      </div>
      {html ? (
        <div
          className="code-block-content overflow-x-auto [&>pre]:!bg-transparent [&>pre]:p-4 [&>pre]:m-0 [&>pre>code]:font-mono [&>pre>code]:text-sm"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="overflow-x-auto p-4">
          <code className="font-mono text-sm text-foreground">{code}</code>
        </pre>
      )}
    </div>
  );
}
