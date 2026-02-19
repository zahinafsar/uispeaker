import { Header } from "../components/header";
import { Sidebar } from "../components/sidebar";
import { UISpeakerProvider } from "../components/uispeaker-provider";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-background font-sans">
      <UISpeakerProvider />
      <Header />
      <div className="mx-auto flex max-w-screen-xl gap-0 px-4 sm:px-6 lg:px-8">
        <Sidebar />
        <main className="min-w-0 flex-1 py-6 md:border-l md:border-border md:py-8 md:pl-8">
          {children}
        </main>
      </div>
    </div>
  );
}
