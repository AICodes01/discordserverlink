"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Palette,
  ArrowLeft,
  Copy,
  Check,
  Sparkles,
  RotateCcw,
  Eye,
} from "lucide-react";

interface ColorOption {
  name: string;
  code: string;
  css: string;
  bgCss?: string;
}

const FOREGROUND_COLORS: ColorOption[] = [
  { name: "Gray", code: "30", css: "text-zinc-500" },
  { name: "Red", code: "31", css: "text-red-500" },
  { name: "Green", code: "32", css: "text-emerald-400" },
  { name: "Yellow", code: "33", css: "text-yellow-400" },
  { name: "Blue", code: "34", css: "text-blue-400" },
  { name: "Pink", code: "35", css: "text-pink-400" },
  { name: "Cyan", code: "36", css: "text-cyan-400" },
  { name: "White", code: "37", css: "text-white" },
];

export default function MarkdownColorTextPage() {
  const [selectedColor, setSelectedColor] = useState("32"); // Green by default
  const [isBold, setIsBold] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [text, setText] = useState("Hello Discord! This is colored text generated with DiscordServerLink.");
  const [copied, setCopied] = useState(false);

  // Build ANSI code string
  // Format: \u001b[{style};{color}m{text}\u001b[0m
  const formatPrefix = () => {
    const parts: string[] = [];
    if (isBold) parts.push("1");
    if (isUnderline) parts.push("4");
    parts.push(selectedColor);
    return `\u001b[${parts.join(";")}m`;
  };

  const getDiscordCode = () => {
    const lines = text.split("\n");
    const prefix = formatPrefix();
    const formatted = lines.map((l) => `${prefix}${l}\u001b[0m`).join("\n");
    return "```ansi\n" + formatted + "\n```";
  };

  const copyDiscordCode = () => {
    navigator.clipboard.writeText(getDiscordCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeColorObj =
    FOREGROUND_COLORS.find((c) => c.code === selectedColor) || FOREGROUND_COLORS[2];

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
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">
            <Palette className="w-3.5 h-3.5" />
            <span>Discord ANSI Text Generator</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Colored ANSI Text & Markdown Styler for Discord
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
            Write vibrant colored messages in Discord chats using native ANSI escape sequences. Choose text color, styles, and copy the formatted code block ready to paste into Discord.
          </p>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        {/* Colors Palette */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
            Select Foreground Color
          </label>
          <div className="flex flex-wrap gap-2">
            {FOREGROUND_COLORS.map((c) => {
              const isActive = selectedColor === c.code;
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => setSelectedColor(c.code)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                    isActive
                      ? "bg-zinc-800 border-white text-white shadow-lg scale-105"
                      : "bg-zinc-950/60 hover:bg-zinc-800/80 border-zinc-800 text-zinc-400"
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full ${
                      c.code === "30"
                        ? "bg-zinc-500"
                        : c.code === "31"
                        ? "bg-red-500"
                        : c.code === "32"
                        ? "bg-emerald-400"
                        : c.code === "33"
                        ? "bg-yellow-400"
                        : c.code === "34"
                        ? "bg-blue-400"
                        : c.code === "35"
                        ? "bg-pink-400"
                        : c.code === "36"
                        ? "bg-cyan-400"
                        : "bg-white"
                    }`}
                  />
                  <span>{c.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Styles Toggle */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => setIsBold(!isBold)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
              isBold
                ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            Bold (1)
          </button>
          <button
            type="button"
            onClick={() => setIsUnderline(!isUnderline)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
              isUnderline
                ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            Underline (4)
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedColor("32");
              setIsBold(false);
              setIsUnderline(false);
              setText("");
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Input Textarea */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
            Type Your Message
          </label>
          <textarea
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message here..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-all font-mono"
          />
        </div>

        {/* Live Discord Dark Chat Preview */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>Discord Chat Preview</span>
            </span>
            <span className="text-[11px] text-zinc-500 font-mono">Simulated Discord Client</span>
          </div>

          <div className="rounded-2xl bg-[#313338] border border-zinc-700/60 p-4 font-mono text-sm shadow-inner space-y-2">
            <div className="flex items-center gap-2 mb-2 text-xs text-[#949ba4]">
              <div className="w-5 h-5 rounded-full bg-discord-blurple flex items-center justify-center text-[10px] text-white font-bold">
                U
              </div>
              <span className="font-bold text-white">DiscordUser</span>
              <span>Today at 12:00 PM</span>
            </div>

            <div className="bg-[#2b2d31] border border-[#1e1f22] p-3 rounded-lg overflow-x-auto">
              <p
                className={`${activeColorObj.css} ${
                  isBold ? "font-bold" : "font-normal"
                } ${isUnderline ? "underline" : ""} whitespace-pre-wrap`}
              >
                {text || "Preview appears here..."}
              </p>
            </div>
          </div>
        </div>

        {/* Copy Button */}
        <div className="pt-2">
          <button
            onClick={copyDiscordCode}
            disabled={!text.trim()}
            className="w-full inline-flex items-center justify-center gap-2 bg-discord-blurple hover:bg-discord-hover disabled:opacity-50 text-white py-3.5 rounded-2xl text-sm font-bold shadow-glow hover:shadow-glow-lg transition-all"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Copied to Clipboard! Ready to paste in Discord</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Code for Discord (```ansi)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
