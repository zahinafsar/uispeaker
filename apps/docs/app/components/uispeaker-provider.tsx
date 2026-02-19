"use client";

import { useEffect, useRef } from "react";
import { UISpeaker } from "uispeaker";

declare global {
  interface Window {
    __uispeaker?: UISpeaker;
  }
}

export function UISpeakerProvider() {
  const speakerRef = useRef<UISpeaker | null>(null);

  useEffect(() => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
    const speaker = new UISpeaker({
      cdnBase: `${basePath}/sounds`,
      volume: 0.5,
    });
    speaker.init();
    speakerRef.current = speaker;

    // Expose globally for programmatic triggers on the landing page
    window.__uispeaker = speaker;

    return () => {
      speaker.destroy();
      speakerRef.current = null;
      delete window.__uispeaker;
    };
  }, []);

  return null;
}
