"use client";

import { useEffect } from "react";

interface AdSenseLoaderProps {
  clientId?: string;
  autoAdsEnabled?: boolean | string;
}

export default function AdSenseScriptLoader({
  clientId,
  autoAdsEnabled = true,
}: AdSenseLoaderProps) {
  useEffect(() => {
    if (!clientId) return;
    if (autoAdsEnabled === false || autoAdsEnabled === "false") return;

    let loaded = false;

    const loadScript = () => {
      if (loaded) return;
      loaded = true;

      // Clean up event listeners once triggered
      window.removeEventListener("scroll", loadScript);
      window.removeEventListener("mousemove", loadScript);
      window.removeEventListener("touchstart", loadScript);
      window.removeEventListener("keydown", loadScript);

      const existing = document.getElementById("google-adsense-script");
      if (!existing) {
        const script = document.createElement("script");
        script.id = "google-adsense-script";
        script.async = true;
        script.crossOrigin = "anonymous";
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
        document.head.appendChild(script);
      }
    };

    // Only load when a real human interacts (scrolling, clicking, moving mouse, touching screen)
    // This stops automated scrapers/headless bots from inflating AdSense page views without viewing ads
    window.addEventListener("scroll", loadScript, { passive: true, once: true });
    window.addEventListener("mousemove", loadScript, { passive: true, once: true });
    window.addEventListener("touchstart", loadScript, { passive: true, once: true });
    window.addEventListener("keydown", loadScript, { passive: true, once: true });

    // Fallback timer for stationary users (loads after 4 seconds)
    const fallbackTimer = setTimeout(loadScript, 4000);

    return () => {
      clearTimeout(fallbackTimer);
      window.removeEventListener("scroll", loadScript);
      window.removeEventListener("mousemove", loadScript);
      window.removeEventListener("touchstart", loadScript);
      window.removeEventListener("keydown", loadScript);
    };
  }, [clientId, autoAdsEnabled]);

  return null;
}
