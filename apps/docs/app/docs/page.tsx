import type { Metadata } from "next";
import { DocsContent } from "./docs-content";

export const metadata: Metadata = {
  title: "Documentation - UISpeaker",
  description:
    "Installation guide, API reference, sound catalog, and troubleshooting for UISpeaker.",
};

export default function DocsPage() {
  return <DocsContent />;
}
