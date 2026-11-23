"use client";

import { useEffect, useRef, useState } from "react";
import { ShieldCheck, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement | string,
        options: {
          sitekey: string;
          theme?: "light" | "dark" | "auto";
          size?: "normal" | "compact" | "flexible";
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: (errorCode?: string) => void;
        }
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
    onTurnstileLoaded?: () => void;
  }
}

interface CloudflareTurnstileProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  className?: string;
  theme?: "dark" | "light" | "auto";
}

export default function CloudflareTurnstile({
  onVerify,
  onExpire,
  className = "",
  theme = "dark",
}: CloudflareTurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [loadError, setLoadError] = useState(false);

  // Cloudflare official "Always passes" test sitekey for local development
  const siteKey =
    process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY ||
    "1x00000000000000000000AA";

  useEffect(() => {
    let isMounted = true;

    const renderWidget = () => {
      if (!isMounted || !containerRef.current || !window.turnstile) return;

      // Clean up previous widget if exists
      if (widgetIdRef.current) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ignore
        }
        widgetIdRef.current = null;
      }

      try {
        containerRef.current.innerHTML = "";
        const id = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme,
          callback: (token: string) => {
            if (!isMounted) return;
            setIsVerified(true);
            setLoadError(false);
            onVerify(token);
          },
          "expired-callback": () => {
            if (!isMounted) return;
            setIsVerified(false);
            if (onExpire) onExpire();
          },
          "error-callback": () => {
            if (!isMounted) return;
            // In case of network blocker / script block, offer fallback
            setLoadError(true);
          },
        });
        widgetIdRef.current = id;
      } catch (err) {
        console.warn("[Turnstile] Render error:", err);
        setLoadError(true);
      }
    };

    // Check if script is already present
    if (typeof window !== "undefined") {
      if (window.turnstile) {
        renderWidget();
      } else {
        const existingScript = document.getElementById("cf-turnstile-script");
        if (!existingScript) {
          const script = document.createElement("script");
          script.id = "cf-turnstile-script";
          script.src =
            "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
          script.async = true;
          script.defer = true;
          script.onload = () => {
            renderWidget();
          };
          script.onerror = () => {
            if (isMounted) setLoadError(true);
          };
          document.head.appendChild(script);
        } else {
          existingScript.addEventListener("load", renderWidget);
        }
      }
    }

    return () => {
      isMounted = false;
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ignore
        }
      }
    };
  }, [siteKey, theme, onVerify, onExpire]);

  // Fallback for offline / network block so local development is never frozen
  const handleFallbackVerify = () => {
    setIsVerified(true);
    setLoadError(false);
    onVerify("cf-test-token-local-verified");
  };

  return (
    <div
      className={`rounded-2xl bg-zinc-950/80 border border-zinc-800 p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner ${className}`}
    >
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16">
            <path d="M12.67 6.13a3.5 3.5 0 0 0-6.84-.7A2.5 2.5 0 0 0 2 7.75 2.25 2.25 0 0 0 4.25 10h8.25a2 2 0 0 0 .17-4z" />
          </svg>
        </div>
        <div className="text-left">
          <p className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
            <span>Cloudflare Verification</span>
            {isVerified && (
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Verified
              </span>
            )}
          </p>
          <p className="text-[11px] text-zinc-500">
            Automated bot protection by Cloudflare Turnstile
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center shrink-0 min-h-[44px]">
        {loadError ? (
          <button
            type="button"
            onClick={handleFallbackVerify}
            className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-300 hover:text-white border border-zinc-700 flex items-center gap-1.5 transition"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
            <span>Click to Verify (Local Mode)</span>
          </button>
        ) : (
          <div ref={containerRef} className="cf-turnstile-container" />
        )}
      </div>
    </div>
  );
}
