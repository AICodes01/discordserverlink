"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Send,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sparkles,
  Bot,
  Layers,
} from "lucide-react";

export default function WebhookSenderPage() {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [username, setUsername] = useState("DiscordServerLink Bot");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [content, setContent] = useState("Hello from DiscordServerLink Tools! 🚀");
  const [embedTitle, setEmbedTitle] = useState("Server Announcement");
  const [embedDescription, setEmbedDescription] = useState(
    "This is a test rich embed sent via the DiscordServerLink Webhook Tool."
  );
  const [embedColor, setEmbedColor] = useState("#5865F2");
  const [includeEmbed, setIncludeEmbed] = useState(true);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!webhookUrl.trim()) {
      setStatus({ ok: false, msg: "Please enter your Discord Webhook URL." });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const payload: any = {
        webhookUrl: webhookUrl.trim(),
        username: username.trim() || undefined,
        avatar_url: avatarUrl.trim() || undefined,
        content: content.trim() || undefined,
      };

      if (includeEmbed && (embedTitle.trim() || embedDescription.trim())) {
        const hex = embedColor.replace("#", "");
        const decimalColor = parseInt(hex, 16) || 0x5865f2;
        payload.embeds = [
          {
            title: embedTitle.trim() || undefined,
            description: embedDescription.trim() || undefined,
            color: decimalColor,
            timestamp: new Date().toISOString(),
            footer: {
              text: "Sent via discordserverlink.com/tools",
            },
          },
        ];
      }

      const res = await fetch("/api/tools/webhook-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus({ ok: true, msg: "Message successfully delivered to your Discord channel!" });
      } else {
        setStatus({ ok: false, msg: data.error || "Failed to send webhook message." });
      }
    } catch (err: any) {
      setStatus({ ok: false, msg: "Network error: " + err.message });
    } finally {
      setLoading(false);
    }
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
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-rose-500/20 text-rose-400 text-xs font-bold border border-rose-500/30">
            <Send className="w-3.5 h-3.5" />
            <span>Webhook Message Dispatcher</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Discord Webhook Message Sender & Embed Tester
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
            Send custom messages and rich embeds to any Discord channel using webhooks. Perfect for testing announcements, bot alerts, and formatting before deploying.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSend} className="space-y-6">
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white border-b border-zinc-800 pb-3">
            Webhook Credentials
          </h2>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-zinc-300">
              Discord Webhook URL <span className="text-red-400">*</span>
            </label>
            <input
              type="url"
              required
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://discord.com/api/webhooks/123456789/abcdef..."
              className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 font-mono"
            />
            <p className="text-[11px] text-zinc-500">
              Get this from: Discord Channel Settings &rarr; Integrations &rarr; Webhooks &rarr; New Webhook &rarr; Copy Webhook URL.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-300">
                Custom Bot Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Custom Bot Name"
                className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-4 py-2 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-300">
                Custom Avatar Image URL
              </label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.png"
                className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-4 py-2 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <label className="block text-xs font-bold text-zinc-300">
              Message Content (Text)
            </label>
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type your normal message text here..."
              className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        {/* Optional Embed Builder */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Rich Embed (Optional)
            </h2>
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-zinc-300">
              <input
                type="checkbox"
                checked={includeEmbed}
                onChange={(e) => setIncludeEmbed(e.target.checked)}
                className="rounded border-zinc-700 text-rose-500 focus:ring-rose-500"
              />
              <span>Include Embed</span>
            </label>
          </div>

          {includeEmbed && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-2">
                  <label className="block text-xs font-bold text-zinc-300">
                    Embed Title
                  </label>
                  <input
                    type="text"
                    value={embedTitle}
                    onChange={(e) => setEmbedTitle(e.target.value)}
                    placeholder="Announcement Title"
                    className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-4 py-2 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-zinc-300">
                    Embed Accent Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={embedColor}
                      onChange={(e) => setEmbedColor(e.target.value)}
                      className="w-10 h-9 rounded-lg bg-zinc-950 border border-zinc-700 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={embedColor}
                      onChange={(e) => setEmbedColor(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-3 py-2 text-xs font-mono text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-zinc-300">
                  Embed Description
                </label>
                <textarea
                  rows={3}
                  value={embedDescription}
                  onChange={(e) => setEmbedDescription(e.target.value)}
                  placeholder="Embed description..."
                  className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Live Preview */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-rose-400" />
            <span>Discord Message Preview</span>
          </span>

          <div className="rounded-2xl bg-[#313338] border border-zinc-700/60 p-4 text-sm shadow-inner space-y-3">
            <div className="flex items-start gap-3">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover bg-zinc-800 shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-discord-blurple flex items-center justify-center text-white font-bold text-xs shrink-0">
                  BOT
                </div>
              )}

              <div className="flex-1 space-y-1.5 min-w-0">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-white truncate">
                    {username || "Discord Bot"}
                  </span>
                  <span className="bg-[#5865F2] text-white text-[10px] font-bold px-1.5 py-0.2 rounded">
                    BOT
                  </span>
                  <span className="text-[#949ba4] text-[11px]">Today at 12:00 PM</span>
                </div>

                {content && (
                  <p className="text-[#dbdee1] text-xs sm:text-sm whitespace-pre-wrap">
                    {content}
                  </p>
                )}

                {includeEmbed && (embedTitle || embedDescription) && (
                  <div
                    className="mt-2 p-3.5 rounded-lg bg-[#2b2d31] max-w-md border-l-4 space-y-2"
                    style={{ borderLeftColor: embedColor }}
                  >
                    {embedTitle && (
                      <h4 className="font-bold text-white text-xs sm:text-sm">
                        {embedTitle}
                      </h4>
                    )}
                    {embedDescription && (
                      <p className="text-xs text-[#dbdee1] whitespace-pre-wrap">
                        {embedDescription}
                      </p>
                    )}
                    <span className="text-[10px] text-[#949ba4] block pt-1 border-t border-[#35373c]">
                      Sent via discordserverlink.com/tools
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Status Alert */}
        {status && (
          <div
            className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-start gap-3 animate-in fade-in duration-200 ${
              status.ok
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {status.ok ? (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0" />
            )}
            <span>{status.msg}</span>
          </div>
        )}

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading || !webhookUrl.trim()}
            className="w-full inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white py-3.5 rounded-2xl text-sm font-bold shadow-glow-sm hover:shadow-glow transition-all"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Sending to Discord...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Send Webhook Message</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
