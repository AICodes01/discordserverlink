"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Link2,
  ArrowLeft,
  Search,
  CheckCircle2,
  AlertCircle,
  Users,
  Activity,
  Hash,
  Clock,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  Copy,
  Check,
} from "lucide-react";

export default function InviteCheckerPage() {
  const [inviteInput, setInviteInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  const handleInspect = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inviteInput.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(
        `/api/tools/invite-inspect?code=${encodeURIComponent(inviteInput.trim())}`
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to inspect invite link.");
      } else {
        setResult(data);
      }
    } catch (err: any) {
      setError("An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const copyGuildId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const loadExample = (code: string) => {
    setInviteInput(code);
    setError(null);
    // trigger check
    setTimeout(() => {
      const btn = document.getElementById("inspect-btn");
      if (btn) btn.click();
    }, 50);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Tools</span>
        </Link>
      </div>

      {/* Header */}
      <div className="relative rounded-3xl bg-zinc-900/80 border border-zinc-800 p-6 sm:p-10 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-discord-blurple/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-discord-blurple/20 text-discord-blurple text-xs font-bold border border-discord-blurple/30">
            <Link2 className="w-3.5 h-3.5" />
            <span>Discord Server Inspector</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Discord Invite Link Inspector & Status Checker
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
            Paste any Discord invite link or vanity code to inspect live server metadata directly from Discord&apos;s API. Verify member counts, online count, server banner, guild ID, and expiration.
          </p>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <form onSubmit={handleInspect} className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
            Enter Discord Invite Link or Code
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={inviteInput}
                onChange={(e) => setInviteInput(e.target.value)}
                placeholder="discord.gg/minecraft or https://discord.gg/valorant"
                className="w-full bg-zinc-950 border border-zinc-700/80 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-discord-blurple focus:ring-1 focus:ring-discord-blurple transition-all"
              />
              <Link2 className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
            <button
              id="inspect-btn"
              type="submit"
              disabled={loading || !inviteInput.trim()}
              className="inline-flex items-center justify-center gap-2 bg-discord-blurple hover:bg-discord-hover disabled:opacity-50 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-glow transition-all shrink-0"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Checking...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Inspect Server</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick Examples */}
        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-zinc-400">
          <span className="font-semibold text-zinc-500">Quick Test:</span>
          {["minecraft", "valorant", "genshinimpact", "reactiflux"].map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => loadExample(code)}
              className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-[11px] border border-zinc-700/60 transition-colors"
            >
              discord.gg/{code}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs sm:text-sm animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Inspection Failed: </span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Result Card */}
      {result && result.guild && (
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 space-y-6">
          {/* Banner */}
          {result.guild.banner ? (
            <div className="h-40 sm:h-52 w-full relative overflow-hidden bg-zinc-800">
              <img
                src={`https://cdn.discordapp.com/banners/${result.guild.id}/${result.guild.banner}.png?size=1024`}
                alt={`${result.guild.name} banner`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
            </div>
          ) : (
            <div className="h-20 bg-gradient-to-r from-discord-blurple/30 to-indigo-950/40" />
          )}

          <div className="px-6 sm:px-8 pb-8 space-y-6 -mt-12 relative z-10">
            {/* Header with Icon */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="flex items-end gap-4">
                {result.guild.icon ? (
                  <img
                    src={`https://cdn.discordapp.com/icons/${result.guild.id}/${result.guild.icon}.webp?size=128`}
                    alt={`${result.guild.name} icon`}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover bg-zinc-800 border-4 border-zinc-900 shadow-xl shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-discord-blurple border-4 border-zinc-900 flex items-center justify-center text-white font-bold text-2xl shadow-xl shrink-0">
                    {result.guild.name.slice(0, 2).toUpperCase()}
                  </div>
                )}

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-white">
                      {result.guild.name}
                    </h2>
                    {result.guild.verification_level !== undefined && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Valid Invite</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <span>Guild ID:</span>
                    <button
                      onClick={() => copyGuildId(result.guild.id)}
                      className="inline-flex items-center gap-1 font-mono text-[11px] bg-zinc-800 hover:bg-zinc-700 px-2 py-0.5 rounded text-zinc-300 transition-colors"
                      title="Copy Guild ID"
                    >
                      <span>{result.guild.id}</span>
                      {copiedId ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3 text-zinc-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Join Server CTA */}
              <a
                href={`https://discord.gg/${result.code}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-discord-green hover:bg-discord-green/90 text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-lg transition-all shrink-0"
              >
                <span>Join Discord Server</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Description */}
            {result.guild.description && (
              <p className="text-xs sm:text-sm text-zinc-300 bg-zinc-950/60 p-4 rounded-2xl border border-zinc-800 leading-relaxed">
                {result.guild.description}
              </p>
            )}

            {/* Stats Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-1">
                <span className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Online Members</span>
                </span>
                <p className="text-lg font-black text-white">
                  {(result.approximate_presence_count || 0).toLocaleString()}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-1">
                <span className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-discord-blurple" />
                  <span>Total Members</span>
                </span>
                <p className="text-lg font-black text-white">
                  {(result.approximate_member_count || 0).toLocaleString()}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-1">
                <span className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-amber-400" />
                  <span>Invite Channel</span>
                </span>
                <p className="text-sm font-bold text-white truncate">
                  #{result.channel?.name || "welcome"}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-1">
                <span className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-purple-400" />
                  <span>Expiration</span>
                </span>
                <p className="text-sm font-bold text-white">
                  {result.expires_at ? new Date(result.expires_at).toLocaleDateString() : "Never Expires"}
                </p>
              </div>
            </div>

            {/* Server Features Tags */}
            {result.guild.features && result.guild.features.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-zinc-800">
                <span className="text-xs font-semibold text-zinc-400">Server Perks & Features:</span>
                <div className="flex flex-wrap gap-1.5">
                  {result.guild.features.map((feat: string) => (
                    <span
                      key={feat}
                      className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700/60"
                    >
                      {feat.toLowerCase().replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
