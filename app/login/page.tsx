"use client";

import { Suspense, useState, useEffect } from "react";
import { signIn, getProviders } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import {
  Rocket,
  Star,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  Users,
  AlertTriangle,
  Info,
  ExternalLink,
  Lock,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

function UserLoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const error = searchParams.get("error");

  const [hasDiscordProvider, setHasDiscordProvider] = useState<boolean | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [currentOrigin, setCurrentOrigin] = useState("http://localhost:3000");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentOrigin(window.location.origin);
    }

    getProviders().then((providers) => {
      setHasDiscordProvider(Boolean(providers && providers.discord));
    });
  }, []);

  const handleDiscordLogin = () => {
    setIsLoggingIn(true);
    signIn("discord", { callbackUrl });
  };

  const handleDemoLogin = () => {
    setIsLoggingIn(true);
    signIn("credentials", {
      email: "demo@discordserverlink.com",
      password: "demo123456",
      callbackUrl,
    });
  };

  const getErrorMessage = () => {
    if (!error) return null;
    switch (error) {
      case "discord":
      case "OAuthSignin":
      case "Configuration":
        return "Discord authentication is not configured yet. Make sure DISCORD_CLIENT_ID and DISCORD_CLIENT_SECRET are set in your .env or .env.local file.";
      case "OAuthCallback":
        return "Discord callback rejected. Ensure your Redirect URI matches in the Discord Developer Portal.";
      case "AccessDenied":
        return "Access was canceled or denied on Discord.";
      default:
        return `Sign-in error: ${error}. Please try again.`;
    }
  };

  const errorMsg = getErrorMessage();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-discord-blurple/15 rounded-full blur-[140px]" />
      </div>

      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="w-12 h-12 rounded-2xl bg-discord-blurple flex items-center justify-center text-white shadow-glow hover:scale-105 transition-transform">
              <svg className="w-7 h-7 fill-current" viewBox="0 0 127.14 96.36">
                <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,45.91,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,45.91,96.12,53,91.08,65.69,84.69,65.69Z" />
              </svg>
            </div>
          </Link>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Sign in to DiscordServer<span className="text-discord-blurple">Link</span>
          </h1>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
            Connect with Discord to sync your servers, bump communities, write verified reviews, and track analytics.
          </p>
        </div>

        {/* Error Alert if any */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs sm:text-sm flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400" />
            <div className="space-y-1">
              <p className="font-bold text-white">Authentication Notice</p>
              <p className="text-xs text-red-300 leading-relaxed">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Discord OAuth Login Card */}
        <div className="rounded-3xl bg-zinc-900/90 border border-zinc-800 p-7 space-y-6 shadow-2xl backdrop-blur-xl">
          <button
            onClick={handleDiscordLogin}
            disabled={isLoggingIn}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl bg-discord-blurple hover:bg-discord-hover text-white font-bold text-sm shadow-glow transition hover:scale-[1.01] disabled:opacity-50 cursor-pointer"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 127.14 96.36">
              <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,45.91,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,45.91,96.12,53,91.08,65.69,84.69,65.69Z" />
            </svg>
            <span>{isLoggingIn ? "Redirecting..." : "Continue with Discord"}</span>
          </button>

          {/* Setup Notice if Discord Provider is not yet configured */}
          {hasDiscordProvider === false && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs space-y-3">
              <div className="flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-white">Discord OAuth2 Setup Required</p>
                  <p className="text-zinc-300 leading-relaxed">
                    To enable live Discord login, create an application at the{" "}
                    <a
                      href="https://discord.com/developers/applications"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-discord-blurple underline font-semibold inline-flex items-center gap-0.5"
                    >
                      Discord Developer Portal <ExternalLink className="w-3 h-3 inline" />
                    </a>
                    , add the redirect URI:
                  </p>
                  <code className="block p-2 rounded-lg bg-zinc-950 font-mono text-[11px] text-zinc-300 select-all border border-zinc-800 break-all">
                    {currentOrigin}/api/auth/callback/discord
                  </code>
                  <p className="text-zinc-400 text-[11px]">
                    Then add <strong className="text-zinc-200">DISCORD_CLIENT_ID</strong> and <strong className="text-zinc-200">DISCORD_CLIENT_SECRET</strong> to your <code className="text-amber-200">.env.local</code>.
                  </p>
                </div>
              </div>

              {/* Instant Dev / Demo Login Button */}
              <div className="pt-1 border-t border-amber-500/20">
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-semibold transition border border-zinc-700"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>One-Click Dev / Demo User Login</span>
                </button>
              </div>
            </div>
          )}

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-zinc-800"></div>
            <span className="flex-shrink mx-4 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              Membership Benefits
            </span>
            <div className="flex-grow border-t border-zinc-800"></div>
          </div>

          {/* Member Benefits List */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-zinc-950/60 border border-zinc-800/80">
              <div className="w-8 h-8 rounded-xl bg-discord-blurple/20 flex items-center justify-center shrink-0">
                <Rocket className="w-4 h-4 text-discord-blurple" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-zinc-200">Free Community Bumps</p>
                <p className="text-[11px] text-zinc-400">
                  Bump your Discord servers every 2 hours to appear at the top of directory listings.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-zinc-950/60 border border-zinc-800/80">
              <div className="w-8 h-8 rounded-xl bg-discord-yellow/20 flex items-center justify-center shrink-0">
                <Star className="w-4 h-4 text-discord-yellow" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-zinc-200">Verified Reviews &amp; Ratings</p>
                <p className="text-[11px] text-zinc-400">
                  Share your experiences, write feedback, and build your community reputation.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-zinc-950/60 border border-zinc-800/80">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-zinc-200">Live Traffic &amp; Join Metrics</p>
                <p className="text-[11px] text-zinc-400">
                  Track visits, click-through rates, and new member conversions in real time.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 text-center text-[11px] text-zinc-500 space-y-1">
            <p className="flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
              <span>We never ask for your Discord password or server management tokens.</span>
            </p>
            <p>
              By signing in, you agree to our{" "}
              <Link href="/terms" className="text-discord-blurple hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy-policy" className="text-discord-blurple hover:underline">
                Privacy Policy
              </Link>.
            </p>
          </div>
        </div>

        {/* Home link */}
        <div className="text-center">
          <Link
            href="/"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition"
          >
            &larr; Back to DiscordServerLink Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center text-zinc-500 text-sm">
          Loading login portal...
        </div>
      }
    >
      <UserLoginForm />
    </Suspense>
  );
}
