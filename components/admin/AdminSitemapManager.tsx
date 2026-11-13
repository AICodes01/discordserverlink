"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Compass,
  ExternalLink,
  Copy,
  Check,
  Save,
  Send,
  Layers,
  Server as ServerIcon,
  Bot,
  BookOpen,
  Wrench,
  Tag,
  ShieldAlert,
  Globe,
  Sliders,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { ChangeFrequency } from "@/lib/seoSettings";

interface AdminSitemapManagerProps {
  settings: Record<string, string>;
  onSaveSettings: (updated: Record<string, string>) => Promise<void>;
  showToast: (msg: string, type?: "success" | "error") => void;
  serverCount?: number;
  categoryCount?: number;
  blogCount?: number;
}

export default function AdminSitemapManager({
  settings,
  onSaveSettings,
  showToast,
  serverCount = 31209,
  categoryCount = 15,
  blogCount = 14,
}: AdminSitemapManagerProps) {
  const [localSettings, setLocalSettings] = useState<Record<string, string>>({
    ...settings,
  });
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pinging, setPinging] = useState(false);
  const [pingResults, setPingResults] = useState<{
    google?: string;
    bing?: string;
    timestamp?: string;
  } | null>(null);

  const getBool = (key: string, def = true) => {
    const val = localSettings[key];
    if (val === undefined) return def;
    return val === "true" || val === "1";
  };

  const setBool = (key: string, val: boolean) => {
    setLocalSettings((prev) => ({
      ...prev,
      [key]: val ? "true" : "false",
    }));
  };

  const getStr = (key: string, def: string) => {
    return localSettings[key] !== undefined ? localSettings[key] : def;
  };

  const setStr = (key: string, val: string) => {
    setLocalSettings((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  const sitemapUrl = "https://discordserverlink.com/sitemap.xml";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(sitemapUrl);
    setCopied(true);
    showToast("Sitemap URL copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePing = async () => {
    setPinging(true);
    try {
      const res = await fetch("/api/admin/sitemap/ping", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setPingResults(data.results || {});
        showToast("Search engines pinged successfully!");
      } else {
        showToast(data.error || "Failed to ping search engines", "error");
      }
    } catch {
      showToast("Network error pinging search engines", "error");
    } finally {
      setPinging(false);
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      await onSaveSettings(localSettings);
      showToast("Sitemap configuration saved! /sitemap.xml is updated live.");
    } catch {
      showToast("Failed to save sitemap configuration", "error");
    } finally {
      setSaving(false);
    }
  };

  // Calculations for preview badge
  const incStatic = getBool("sitemap_include_static", true);
  const incTools = getBool("sitemap_include_tools", true);
  const incServers = getBool("sitemap_include_servers", true);
  const serversLimit = parseInt(getStr("sitemap_servers_limit", "5000"), 10) || 5000;
  const incCategories = getBool("sitemap_include_categories", true);
  const incBots = getBool("sitemap_include_bots", true);
  const incBlog = getBool("sitemap_include_blog", true);
  const incTags = getBool("sitemap_include_tags", true);

  const customUrlsLines = getStr("sitemap_custom_urls", "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const estimatedTotal =
    (incStatic ? 11 : 0) +
    (incTools ? 8 : 0) +
    (incServers ? Math.min(serverCount, serversLimit) : 0) +
    (incCategories ? categoryCount : 0) +
    (incBots ? 50 : 0) +
    (incBlog ? blogCount : 0) +
    (incTags ? 200 : 0) +
    customUrlsLines.length;

  const FREQ_OPTIONS: ChangeFrequency[] = [
    "always",
    "hourly",
    "daily",
    "weekly",
    "monthly",
    "yearly",
    "never",
  ];

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-6xl pb-24">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-zinc-900 via-emerald-950/20 to-zinc-900 border border-zinc-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400">
            <Compass className="w-3.5 h-3.5" />
            <span>Search Engine Indexing Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            XML Sitemap Configuration
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl">
            Control which sections, server listings, crawl priorities, and frequencies are published to Google &amp; Bing at <code className="text-zinc-200">/sitemap.xml</code>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 relative z-10">
          <button
            type="button"
            onClick={handlePing}
            disabled={pinging}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-200 transition flex items-center gap-1.5 shadow"
          >
            <Send className="w-3.5 h-3.5 text-emerald-400" />
            <span>{pinging ? "Pinging..." : "Ping Search Engines"}</span>
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-discord-green hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition flex items-center gap-2 shadow-lg"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving..." : "Save Sitemap Config"}</span>
          </button>
        </div>
      </div>

      {/* Live Sitemap Status Card */}
      <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Live Serverless Sitemap Status
              </div>
              <div className="text-sm font-mono text-zinc-200">{sitemapUrl}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-300 transition flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied!" : "Copy Link"}</span>
            </button>
            <Link
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-discord-blurple hover:bg-discord-hover text-xs font-bold text-white transition flex items-center gap-1.5 shadow"
            >
              <span>View Live XML</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Breakdown Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 pt-2">
          <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80">
            <div className="text-[10px] text-zinc-500 uppercase font-bold">Estimated Total</div>
            <div className="text-base font-black text-emerald-400 mt-0.5">
              {estimatedTotal.toLocaleString("en-US")}
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80">
            <div className="text-[10px] text-zinc-500 uppercase font-bold">Static Pages</div>
            <div className="text-base font-bold text-zinc-200 mt-0.5">{incStatic ? 11 : 0}</div>
          </div>
          <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80">
            <div className="text-[10px] text-zinc-500 uppercase font-bold">Tools</div>
            <div className="text-base font-bold text-zinc-200 mt-0.5">{incTools ? 8 : 0}</div>
          </div>
          <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80">
            <div className="text-[10px] text-zinc-500 uppercase font-bold">Servers Listed</div>
            <div className="text-base font-bold text-zinc-200 mt-0.5">
              {incServers ? Math.min(serverCount, serversLimit).toLocaleString("en-US") : 0}
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80">
            <div className="text-[10px] text-zinc-500 uppercase font-bold">Categories</div>
            <div className="text-base font-bold text-zinc-200 mt-0.5">{incCategories ? categoryCount : 0}</div>
          </div>
          <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80">
            <div className="text-[10px] text-zinc-500 uppercase font-bold">Bots</div>
            <div className="text-base font-bold text-zinc-200 mt-0.5">{incBots ? 50 : 0}</div>
          </div>
          <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80">
            <div className="text-[10px] text-zinc-500 uppercase font-bold">Articles</div>
            <div className="text-base font-bold text-zinc-200 mt-0.5">{incBlog ? blogCount : 0}</div>
          </div>
          <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80">
            <div className="text-[10px] text-zinc-500 uppercase font-bold">Custom URLs</div>
            <div className="text-base font-bold text-zinc-200 mt-0.5">{customUrlsLines.length}</div>
          </div>
        </div>

        {pingResults && (
          <div className="mt-3 p-3 rounded-2xl bg-zinc-950 border border-emerald-500/30 text-xs text-zinc-300 space-y-1">
            <div className="font-bold text-emerald-400">Search Engine Ping Response:</div>
            <div>Google: {pingResults.google || "Pending"}</div>
            <div>Bing: {pingResults.bing || "Pending"}</div>
          </div>
        )}
      </div>

      {/* Section Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Discord Servers Section Card */}
        <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-5 shadow-xl md:col-span-2">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2.5">
              <ServerIcon className="w-5 h-5 text-discord-blurple" />
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Discord Servers Directory Index
                </h3>
                <p className="text-xs text-zinc-400">
                  Control how thousands of individual server profile pages are indexed in the sitemap
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={incServers}
                onChange={(e) => setBool("sitemap_include_servers", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-discord-blurple"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                Max Servers to Include in Sitemap
              </label>
              <select
                value={getStr("sitemap_servers_limit", "5000")}
                onChange={(e) => setStr("sitemap_servers_limit", e.target.value)}
                disabled={!incServers}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-discord-blurple disabled:opacity-40"
              >
                <option value="1000">Top 1,000 Most Active Servers</option>
                <option value="2500">Top 2,500 Most Active Servers</option>
                <option value="5000">Top 5,000 Most Active Servers (Recommended)</option>
                <option value="10000">Top 10,000 Most Active Servers</option>
                <option value="20000">Top 20,000 Most Active Servers</option>
                <option value="50000">All 31,000+ Servers (Full Database Index)</option>
              </select>
              <p className="text-[11px] text-zinc-500 mt-1">
                Sorted by most recently bumped and verified communities.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                Servers Priority (0.1 - 1.0)
              </label>
              <input
                type="number"
                step="0.05"
                min="0.1"
                max="1.0"
                value={getStr("sitemap_servers_priority", "0.85")}
                onChange={(e) => setStr("sitemap_servers_priority", e.target.value)}
                disabled={!incServers}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-discord-blurple disabled:opacity-40"
              />
              <p className="text-[11px] text-zinc-500 mt-1">Default: 0.85</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                Change Frequency
              </label>
              <select
                value={getStr("sitemap_servers_freq", "daily")}
                onChange={(e) => setStr("sitemap_servers_freq", e.target.value)}
                disabled={!incServers}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-discord-blurple disabled:opacity-40"
              >
                {FREQ_OPTIONS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-zinc-500 mt-1">Default: daily</p>
            </div>
          </div>
        </div>

        {/* Static Pages Card */}
        <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-bold text-white">Static Core Pages</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={incStatic}
                onChange={(e) => setBool("sitemap_include_static", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-discord-blurple"></div>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-zinc-400 mb-1">Priority</label>
              <input
                type="number"
                step="0.05"
                min="0.1"
                max="1.0"
                value={getStr("sitemap_static_priority", "0.9")}
                onChange={(e) => setStr("sitemap_static_priority", e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-discord-blurple"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-zinc-400 mb-1">Frequency</label>
              <select
                value={getStr("sitemap_static_freq", "daily")}
                onChange={(e) => setStr("sitemap_static_freq", e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-discord-blurple"
              >
                {FREQ_OPTIONS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-[11px] text-zinc-500">
            Homepage, /servers, /categories, /bots, /emojis, about, contact, terms, dmca, privacy.
          </p>
        </div>

        {/* Tools & Utilities Card */}
        <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-bold text-white">Tools Hub &amp; Particular Tools (8)</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={incTools}
                onChange={(e) => setBool("sitemap_include_tools", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-discord-blurple"></div>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-zinc-400 mb-1">Priority</label>
              <input
                type="number"
                step="0.05"
                min="0.1"
                max="1.0"
                value={getStr("sitemap_tools_priority", "0.8")}
                onChange={(e) => setStr("sitemap_tools_priority", e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-discord-blurple"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-zinc-400 mb-1">Frequency</label>
              <select
                value={getStr("sitemap_tools_freq", "weekly")}
                onChange={(e) => setStr("sitemap_tools_freq", e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-discord-blurple"
              >
                {FREQ_OPTIONS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-[11px] text-zinc-500">
            Discord PFP Viewer, Invite Checker, Fancy Fonts, ANSI Colored Text, Snowflake Timestamp, Webhook Sender, Permissions Calculator.
          </p>
        </div>

        {/* Categories Section Card */}
        <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-bold text-white">Categories ({categoryCount})</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={incCategories}
                onChange={(e) => setBool("sitemap_include_categories", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-discord-blurple"></div>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-zinc-400 mb-1">Priority</label>
              <input
                type="number"
                step="0.05"
                min="0.1"
                max="1.0"
                value={getStr("sitemap_categories_priority", "0.8")}
                onChange={(e) => setStr("sitemap_categories_priority", e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-discord-blurple"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-zinc-400 mb-1">Frequency</label>
              <select
                value={getStr("sitemap_categories_freq", "daily")}
                onChange={(e) => setStr("sitemap_categories_freq", e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-discord-blurple"
              >
                {FREQ_OPTIONS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-[11px] text-zinc-500">
            Dedicated landing pages for Gaming, Anime, AI, Technology, Education, etc.
          </p>
        </div>

        {/* Bots Directory Card */}
        <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-bold text-white">Bots Directory (~50 Bots)</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={incBots}
                onChange={(e) => setBool("sitemap_include_bots", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-discord-blurple"></div>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-zinc-400 mb-1">Priority</label>
              <input
                type="number"
                step="0.05"
                min="0.1"
                max="1.0"
                value={getStr("sitemap_bots_priority", "0.8")}
                onChange={(e) => setStr("sitemap_bots_priority", e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-discord-blurple"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-zinc-400 mb-1">Frequency</label>
              <select
                value={getStr("sitemap_bots_freq", "weekly")}
                onChange={(e) => setStr("sitemap_bots_freq", e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-discord-blurple"
              >
                {FREQ_OPTIONS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-[11px] text-zinc-500">
            Individual bot pages for MEE6, Carl-bot, Dyno, ProBot, Midjourney, etc.
          </p>
        </div>

        {/* Blog Posts Card */}
        <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-bold text-white">Blog &amp; SEO Articles ({blogCount})</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={incBlog}
                onChange={(e) => setBool("sitemap_include_blog", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-discord-blurple"></div>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-zinc-400 mb-1">Priority</label>
              <input
                type="number"
                step="0.05"
                min="0.1"
                max="1.0"
                value={getStr("sitemap_blog_priority", "0.75")}
                onChange={(e) => setStr("sitemap_blog_priority", e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-discord-blurple"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-zinc-400 mb-1">Frequency</label>
              <select
                value={getStr("sitemap_blog_freq", "weekly")}
                onChange={(e) => setStr("sitemap_blog_freq", e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-discord-blurple"
              >
                {FREQ_OPTIONS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-[11px] text-zinc-500">
            Curated guides, top server lists, and Discord tutorials.
          </p>
        </div>

        {/* Tags Index Card */}
        <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-pink-400" />
              <span className="text-sm font-bold text-white">Tags Directory Index (~200 Tags)</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={incTags}
                onChange={(e) => setBool("sitemap_include_tags", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-discord-blurple"></div>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-zinc-400 mb-1">Priority</label>
              <input
                type="number"
                step="0.05"
                min="0.1"
                max="1.0"
                value={getStr("sitemap_tags_priority", "0.75")}
                onChange={(e) => setStr("sitemap_tags_priority", e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-discord-blurple"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-zinc-400 mb-1">Frequency</label>
              <select
                value={getStr("sitemap_tags_freq", "weekly")}
                onChange={(e) => setStr("sitemap_tags_freq", e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-discord-blurple"
              >
                {FREQ_OPTIONS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-[11px] text-zinc-500">
            Dedicated tag landing pages: /tag/gaming, /tag/anime, /tag/fivem, etc.
          </p>
        </div>
      </div>

      {/* Advanced Custom & Excluded URLs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-3 shadow-xl">
          <label className="block text-xs font-bold text-white uppercase tracking-wider">
            Custom Extra URLs to Include (One per line)
          </label>
          <p className="text-xs text-zinc-400">
            Add any custom landing pages or seasonal marketing URLs to inject into the sitemap.
          </p>
          <textarea
            rows={4}
            value={getStr("sitemap_custom_urls", "")}
            onChange={(e) => setStr("sitemap_custom_urls", e.target.value)}
            placeholder="https://discordserverlink.com/special-page&#10;/custom-event"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 font-mono placeholder-zinc-600 focus:outline-none focus:border-discord-blurple"
          />
        </div>

        <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-3 shadow-xl">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <label className="block text-xs font-bold text-white uppercase tracking-wider">
              Excluded URL Patterns (One per line)
            </label>
          </div>
          <p className="text-xs text-zinc-400">
            Prevent specific URL paths from being indexed (e.g. admin, login, private tools).
          </p>
          <textarea
            rows={4}
            value={getStr("sitemap_excluded_urls", "/admin\n/login\n/taplu\n/api")}
            onChange={(e) => setStr("sitemap_excluded_urls", e.target.value)}
            placeholder="/admin&#10;/login&#10;/taplu&#10;/api"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 font-mono placeholder-zinc-600 focus:outline-none focus:border-discord-blurple"
          />
        </div>
      </div>

      {/* Bottom Save Action */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 rounded-xl bg-discord-green hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition flex items-center gap-2 shadow-xl"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving..." : "Save Sitemap Settings"}</span>
        </button>
      </div>
    </form>
  );
}
