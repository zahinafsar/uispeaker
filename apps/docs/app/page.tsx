import { Header } from "./components/header";
import { HeroSection } from "./components/sections/hero";
import { FeaturesSection } from "./components/sections/features";
import { DemoSection } from "./components/sections/demo";
import { SoundsSection } from "./components/sections/sounds";
import { QuickStartSection } from "./components/sections/quickstart";
import { FooterSection } from "./components/sections/footer";
import { UISpeakerProvider } from "./components/uispeaker-provider";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background font-sans">
      <UISpeakerProvider />
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <DemoSection />
        <SoundsSection />
        <QuickStartSection />
      </main>
      <FooterSection />
    </div>
  );
}
