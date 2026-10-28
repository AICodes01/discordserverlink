"use client";

import { useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";
import { hasValidAdCode } from "@/lib/adUtils";

interface InFeedAdProps {
  code?: string;
  enabled?: boolean | string;
}

export default function InFeedAd({ code, enabled }: InFeedAdProps) {
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
        // Silently fail
      }
    }
  }, [isEnabled, isValid, code]);

  // Completely invisible if not enabled or no ad code entered
  if (!isEnabled || !isValid || !code) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 p-5 flex flex-col justify-between relative overflow-hidden transition hover:border-zinc-700">
      <div className="flex items-center justify-between mb-3">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 border border-amber-400/20">
          <Sparkles className="w-3 h-3" />
          <span>Sponsored</span>
        </span>
        <span className="text-[10px] text-zinc-500 font-mono">Ad</span>
      </div>

      <div
        ref={adRef}
        className="min-h-[160px] flex items-center justify-center text-center overflow-hidden"
        dangerouslySetInnerHTML={{ __html: code }}
      />

      <div className="mt-3 text-center text-[11px] text-zinc-500">
        Support DiscordServerLink with our verified sponsors
      </div>
    </div>
  );
}
