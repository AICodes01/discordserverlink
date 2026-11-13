"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  ExternalLink,
  RotateCcw,
  Save,
  CheckCircle,
  AlertCircle,
  Globe,
  Sparkles,
  Layers,
  Wrench,
} from "lucide-react";
import { CONFIGURABLE_SEO_PAGES, PageSeoConfig } from "@/lib/seoSettings";

interface AdminPageSeoManagerProps {
  settings: Record<string, string>;
  onSaveSettings: (updated: Record<string, string>) => Promise<void>;
  showToast: (msg: string, type?: "success" | "error") => void;
}

export default function AdminPageSeoManager({
  settings,
  onSaveSettings,
  showToast,
}: AdminPageSeoManagerProps) {
  const [localSettings, setLocalSettings] = useState<Record<string, string>>({
    ...settings,
  });
  const [filterGroup, setFilterGroup] = useState<"all" | "main" | "tools">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const getPageTitle = (page: PageSeoConfig) => {
    const val = localSettings[`page_seo_${page.key}_title`];
    return val !== undefined ? val : page.defaultTitle;
  };

  const getPageDescription = (page: PageSeoConfig) => {
    const val = localSettings[`page_seo_${page.key}_description`];
    return val !== undefined ? val : page.defaultDescription;
  };

  const handleChange = (key: string, value: string) => {
    setLocalSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
    setHasChanges(true);
  };

  const handleResetSingle = (page: PageSeoConfig) => {
    setLocalSettings((prev) => ({
      ...prev,
      [`page_seo_${page.key}_title`]: page.defaultTitle,
      [`page_seo_${page.key}_description`]: page.defaultDescription,
    }));
    setHasChanges(true);
    showToast(`Reset "${page.label}" to default SEO values.`);
  };

  const handleResetAll = () => {
    if (!window.confirm("Are you sure you want to reset all 13 pages to their default SEO titles and descriptions?")) {
      return;
    }
    const updated = { ...localSettings };
    CONFIGURABLE_SEO_PAGES.forEach((p) => {
      updated[`page_seo_${p.key}_title`] = p.defaultTitle;
      updated[`page_seo_${p.key}_description`] = p.defaultDescription;
    });
    setLocalSettings(updated);
    setHasChanges(true);
    showToast("Reset all pages to defaults. Click 'Save All SEO Settings' to persist.");
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      await onSaveSettings(localSettings);
      setHasChanges(false);
      showToast("Page SEO settings saved and applied live across the website!");
    } catch {
      showToast("Failed to save Page SEO settings", "error");
    } finally {
      setSaving(false);
    }
  };

  const filteredPages = CONFIGURABLE_SEO_PAGES.filter((p) => {
    if (filterGroup === "main" && p.group !== "main") return false;
    if (filterGroup === "tools" && p.group !== "tools") return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.label.toLowerCase().includes(q) ||
        p.path.toLowerCase().includes(q) ||
        p.defaultTitle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8 max-w-6xl pb-24">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-zinc-900 via-indigo-950/30 to-zinc-900 border border-zinc-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-discord-blurple/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-bold text-cyan-400">
            <FileText className="w-3.5 h-3.5" />
            <span>Targeted Page SEO Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Page Title & Meta Description Editor
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl">
            Custom-tune the Google search titles and meta descriptions for Homepage, Servers, Categories, Bots, Emojis, and all Tools pages.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 relative z-10">
          <button
            type="button"
            onClick={handleResetAll}
            className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-300 transition flex items-center gap-1.5"
            title="Reset all pages to defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Defaults</span>
          </button>
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={saving}
            className={`px-5 py-2 rounded-xl font-bold text-xs transition flex items-center gap-2 shadow-lg ${
              hasChanges
                ? "bg-discord-green hover:bg-emerald-400 text-zinc-950 animate-pulse"
                : "bg-discord-blurple hover:bg-discord-hover text-white"
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving..." : hasChanges ? "Save Changes*" : "Save All SEO"}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterGroup("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              filterGroup === "all"
                ? "bg-discord-blurple text-white shadow-glow-sm"
                : "bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>All Pages ({CONFIGURABLE_SEO_PAGES.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterGroup("main")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              filterGroup === "main"
                ? "bg-discord-blurple text-white shadow-glow-sm"
                : "bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Core Directory (5)</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterGroup("tools")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              filterGroup === "tools"
                ? "bg-discord-blurple text-white shadow-glow-sm"
                : "bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800"
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Tools & Utilities (8)</span>
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search pages or paths..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-discord-blurple"
          />
        </div>
      </div>

      {/* Pages Grid */}
      <div className="space-y-6">
        {filteredPages.map((page) => {
          const currentTitle = getPageTitle(page);
          const currentDesc = getPageDescription(page);
          const titleLen = currentTitle.length;
          const descLen = currentDesc.length;

          // Title status: 40-60 optimal
          const isTitleOptimal = titleLen >= 40 && titleLen <= 60;
          const isTitleWarning = titleLen > 65;

          // Description status: 120-160 optimal
          const isDescOptimal = descLen >= 120 && descLen <= 160;
          const isDescWarning = descLen > 165;

          const isModified =
            currentTitle !== page.defaultTitle || currentDesc !== page.defaultDescription;

          return (
            <div
              key={page.key}
              className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition space-y-6 shadow-xl"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800/80">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl ${
                      page.group === "main"
                        ? "bg-indigo-500/10 text-discord-blurple"
                        : "bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    {page.group === "main" ? (
                      <Layers className="w-4 h-4" />
                    ) : (
                      <Wrench className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{page.label}</h3>
                      {isModified && (
                        <span className="px-1.5 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold">
                          Custom
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-xs text-zinc-400">{page.path}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <Link
                    href={page.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 transition flex items-center gap-1.5"
                  >
                    <span>Visit Page</span>
                    <ExternalLink className="w-3 h-3 text-zinc-400" />
                  </Link>
                  {isModified && (
                    <button
                      type="button"
                      onClick={() => handleResetSingle(page)}
                      className="px-3 py-1.5 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 text-xs font-semibold text-zinc-400 hover:text-white transition flex items-center gap-1"
                      title="Reset this page to default recommended title & description"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Form Inputs & Google Snippet Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Inputs Column */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Title Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                        <span>Page Title (SEO Title)</span>
                      </label>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                          isTitleOptimal
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : isTitleWarning
                            ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        {titleLen} / 60 chars
                      </span>
                    </div>
                    <input
                      type="text"
                      value={currentTitle}
                      onChange={(e) =>
                        handleChange(`page_seo_${page.key}_title`, e.target.value)
                      }
                      placeholder={page.defaultTitle}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-discord-blurple"
                    />
                    <p className="text-[11px] text-zinc-500 mt-1">
                      Recommended: 50-60 characters. Appears as the clickable headline on Google search results.
                    </p>
                  </div>

                  {/* Description Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                        <span>Meta Description</span>
                      </label>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                          isDescOptimal
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : isDescWarning
                            ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        {descLen} / 160 chars
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={currentDesc}
                      onChange={(e) =>
                        handleChange(`page_seo_${page.key}_description`, e.target.value)
                      }
                      placeholder={page.defaultDescription}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-discord-blurple"
                    />
                    <p className="text-[11px] text-zinc-500 mt-1">
                      Recommended: 130-160 characters. Summarizes the page content under the Google title link.
                    </p>
                  </div>
                </div>

                {/* Live Google Search Preview Column */}
                <div className="lg:col-span-5 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Live Google Search Snippet Preview</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 shadow-inner space-y-2">
                    {/* Google URL Breadcrumb */}
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-discord-blurple flex items-center justify-center text-[9px] font-black text-white">
                        D
                      </div>
                      <div className="text-[11px] text-zinc-400 truncate">
                        <span>discordserverlink.com</span>
                        {page.path !== "/" && (
                          <span className="text-zinc-500"> &rsaquo; {page.path.replace(/^\//, "")}</span>
                        )}
                      </div>
                    </div>

                    {/* Google Title */}
                    <div className="text-sm font-semibold text-blue-400 hover:underline cursor-pointer line-clamp-1 leading-snug">
                      {currentTitle || page.defaultTitle}
                    </div>

                    {/* Google Snippet Description */}
                    <div className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {currentDesc || page.defaultDescription}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Save Action Bar */}
      {hasChanges && (
        <div className="fixed bottom-6 right-6 z-40 bg-zinc-900 border border-discord-green/50 shadow-2xl rounded-2xl px-5 py-3 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-discord-green animate-ping" />
            <span className="text-xs font-bold text-zinc-200">
              Unsaved Page SEO changes detected
            </span>
          </div>
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-discord-green hover:bg-emerald-400 text-zinc-950 text-xs font-bold transition flex items-center gap-1.5 shadow-md"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? "Saving..." : "Save Now"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
