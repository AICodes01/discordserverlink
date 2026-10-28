"use client";

import { useEffect, useRef } from "react";
import { hasValidAdCode } from "@/lib/adUtils";

interface AdBannerProps {
  code?: string;
  enabled?: boolean | string;
}

export default function HeaderAdBanner({ code, enabled }: AdBannerProps) {
  const isEnabled = enabled === true || enabled === "true";
  const isValid = hasValidAdCode(code);
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEnabled && isValid && adRef.current) {
      try {
        const scripts = adRef.current.getElementsByTagName("script");
        for (let i = 0; i < scripts.length; i++) {
          const script = scripts[i];
          const newScript = document.createElement("script");
          Array.from(script.attributes).forEach((attr) =>
            newScript.setAttribute(attr.name, attr.value)
          );
          newScript.appendChild(document.createTextNode(script.innerHTML));
          script.parentNode?.replaceChild(newScript, script);
        }
      } catch (e) {
        // Silently ignore
      }
    }
  }, [isEnabled, isValid, code]);

  // Completely invisible if not enabled or no ad code entered
  if (!isEnabled || !isValid || !code) {
    return null;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      <div className="relative rounded-2xl bg-zinc-950/60 border border-zinc-800/80 p-3 text-center overflow-hidden">
        <span className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">
          Advertisement
        </span>
        <div
          ref={adRef}
          className="min-h-[90px] flex items-center justify-center overflow-hidden"
          dangerouslySetInnerHTML={{ __html: code }}
        />
      </div>
    </div>
  );
}
