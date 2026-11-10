"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, ShieldCheck, X } from "lucide-react";

export default function CookieConsentBanner() {
  const [mounted, setMounted] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const consent = localStorage.getItem("dsl_cookie_consent");
      if (!consent) {
        // Small delay so it appears smoothly after page load
        const timer = setTimeout(() => setShowBanner(true), 1000);
        return () => clearTimeout(timer);
      }
    } catch {
      // localStorage may be disabled
    }
  }, []);

  if (!mounted || !showBanner) {
    return null;
  }

  const handleConsent = (type: "accepted" | "essential") => {
    try {
      localStorage.setItem("dsl_cookie_consent", type);
    } catch {}
    setShowBanner(false);
  };

  return (
    <div
      role="region"
      aria-label="Cookie Consent Banner"
      className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 transition-all animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="max-w-5xl mx-auto rounded-3xl bg-zinc-950/95 border border-zinc-800 backdrop-blur-xl p-5 sm:p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative">
        <button
          onClick={() => handleConsent("essential")}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white md:hidden p-1 rounded-lg"
          aria-label="Close cookie banner"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4 pr-6 md:pr-0 max-w-3xl">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
            <Cookie className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>We value your privacy &amp; transparency</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline" />
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              DiscordServerLink uses cookies and local storage to remember your search preferences, enable real-time server bumping, analyze web traffic, and support advertising partners. You can choose to accept all cookies or only essential session cookies. Read our{" "}
              <Link
                href="/privacy-policy"
                className="text-discord-blurple underline font-semibold hover:text-discord-hover"
              >
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link
                href="/terms"
                className="text-discord-blurple underline font-semibold hover:text-discord-hover"
              >
                Terms &amp; Conditions
              </Link>{" "}
              for complete details.
            </p>
          </div>
        </div>

        <div className="flex flex-row items-center gap-2.5 w-full md:w-auto shrink-0 justify-end">
          <button
            onClick={() => handleConsent("essential")}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 hover:text-white transition-colors border border-zinc-700/80 cursor-pointer"
          >
            Essential Only
          </button>
          <button
            onClick={() => handleConsent("accepted")}
            className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-discord-blurple hover:bg-discord-hover text-white text-xs font-bold shadow-glow-sm hover:shadow-glow transition-all cursor-pointer"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
