"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldAlert,
  Key,
  Terminal,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

function TapluLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    urlError === "unauthorized"
      ? "Access denied. Administrator privileges required."
      : null
  );
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both admin email and password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: email.trim().toLowerCase(),
        password,
        callbackUrl,
      });

      if (res?.error) {
        setError(
          res.error === "CredentialsSignin"
            ? "Invalid email or password. Access denied."
            : res.error
        );
      } else if (res?.ok) {
        setSuccess(true);
        // Short timeout for seamless visual feedback
        setTimeout(() => {
          router.push(callbackUrl.startsWith("/admin") ? callbackUrl : "/admin");
          router.refresh();
        }, 500);
      }
    } catch {
      setError("A security error occurred while establishing your session.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[350px] bg-discord-blurple/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[350px] h-[250px] bg-emerald-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md space-y-6">
        {/* Terminal Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono font-semibold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ROOT OWNER GATEWAY</span>
          </div>

          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 p-0.5 shadow-2xl flex items-center justify-center group">
              <div className="w-full h-full rounded-[14px] bg-zinc-950/80 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-emerald-400" />
              </div>
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Owner Administration
            </h1>
            <p className="text-xs text-zinc-400 mt-1 font-mono">
              Restricted portal • discordserverlink.com/taplu
            </p>
          </div>
        </div>

        {/* Login Box */}
        <div className="rounded-3xl bg-zinc-900/90 border border-zinc-800 p-7 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-discord-blurple via-emerald-500 to-discord-blurple" />

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">Authentication Failed</p>
                <p className="text-red-400/90 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <p className="font-semibold">
                Access authorized. Redirecting to admin panel...
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1.5 font-mono">
                Admin Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@discordserverlink.com"
                  autoComplete="email"
                  required
                  className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition font-mono"
                />
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1.5 font-mono">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl pl-10 pr-11 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition font-mono"
                />
                <Key className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || success}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-zinc-950 font-bold text-sm transition-all shadow-lg hover:shadow-emerald-500/20 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Authorize & Enter Admin</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Security Features Info */}
          <div className="mt-6 pt-5 border-t border-zinc-800/80 space-y-2">
            <div className="flex items-center gap-2 text-[11px] text-zinc-400">
              <Terminal className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Dedicated Root Terminal with encrypted sessions</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-zinc-400">
              <ShieldCheck className="w-3.5 h-3.5 text-discord-blurple shrink-0" />
              <span>Protected against brute-force & unverified origins</span>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            href="/"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition inline-flex items-center gap-1"
          >
            ← Return to DiscordServerLink Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function TapluPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] flex items-center justify-center text-zinc-500 text-sm font-mono">
          Initializing Owner Terminal...
        </div>
      }
    >
      <TapluLoginForm />
    </Suspense>
  );
}
