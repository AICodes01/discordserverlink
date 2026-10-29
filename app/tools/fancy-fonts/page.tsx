"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Type,
  ArrowLeft,
  Copy,
  Check,
  Sparkles,
  Shuffle,
} from "lucide-react";

interface FontTransform {
  name: string;
  badge: string;
  transform: (str: string) => string;
}

// Maps for unicode fonts
const FONT_TRANSFORMS: FontTransform[] = [
  {
    name: "Small Caps",
    badge: "Most Popular",
    transform: (text) => {
      const map: Record<string, string> = {
        a: "ᴀ", b: "ʙ", c: "ᴄ", d: "ᴅ", e: "ᴇ", f: "ꜰ", g: "ɢ", h: "ʜ", i: "ɪ",
        j: "ᴊ", k: "ᴋ", l: "ʟ", m: "ᴍ", n: "ɴ", o: "ᴏ", p: "ᴘ", q: "ǫ", r: "ʀ",
        s: "ꜱ", t: "ᴛ", u: "ᴜ", v: "ᴠ", w: "ᴡ", x: "x", y: "ʏ", z: "ᴢ",
      };
      return text.toLowerCase().split("").map((c) => map[c] || c).join("");
    },
  },
  {
    name: "Bold Sans",
    badge: "Clean",
    transform: (text) => {
      return text.split("").map((c) => {
        const code = c.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(0x1d5d4 + (code - 65));
        if (code >= 97 && code <= 122) return String.fromCodePoint(0x1d5ee + (code - 97));
        if (code >= 48 && code <= 57) return String.fromCodePoint(0x1d7ec + (code - 48));
        return c;
      }).join("");
    },
  },
  {
    name: "Gothic / Fraktur",
    badge: "Aesthetic",
    transform: (text) => {
      return text.split("").map((c) => {
        const code = c.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(0x1d504 + (code - 65));
        if (code >= 97 && code <= 122) return String.fromCodePoint(0x1d51e + (code - 97));
        return c;
      }).join("");
    },
  },
  {
    name: "Double-Struck (Outline)",
    badge: "Stylish",
    transform: (text) => {
      return text.split("").map((c) => {
        const code = c.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(0x1d538 + (code - 65));
        if (code >= 97 && code <= 122) return String.fromCodePoint(0x1d552 + (code - 97));
        if (code >= 48 && code <= 57) return String.fromCodePoint(0x1d7d8 + (code - 48));
        return c;
      }).join("");
    },
  },
  {
    name: "Cursive Script",
    badge: "Elegant",
    transform: (text) => {
      return text.split("").map((c) => {
        const code = c.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(0x1d49c + (code - 65));
        if (code >= 97 && code <= 122) return String.fromCodePoint(0x1d4b6 + (code - 97));
        return c;
      }).join("");
    },
  },
  {
    name: "Bubble / Circled",
    badge: "Cute",
    transform: (text) => {
      return text.split("").map((c) => {
        const code = c.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(0x24b6 + (code - 65));
        if (code >= 97 && code <= 122) return String.fromCodePoint(0x24d0 + (code - 97));
        if (code >= 49 && code <= 57) return String.fromCodePoint(0x2460 + (code - 49));
        if (code === 48) return "⓪";
        return c;
      }).join("");
    },
  },
  {
    name: "Dark Bubble (Inverted)",
    badge: "Standout",
    transform: (text) => {
      return text.split("").map((c) => {
        const code = c.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(0x1f150 + (code - 65));
        if (code >= 97 && code <= 122) return String.fromCodePoint(0x1f150 + (code - 97));
        return c;
      }).join("");
    },
  },
  {
    name: "Monospace",
    badge: "Code",
    transform: (text) => {
      return text.split("").map((c) => {
        const code = c.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(0x1d670 + (code - 65));
        if (code >= 97 && code <= 122) return String.fromCodePoint(0x1d68a + (code - 97));
        if (code >= 48 && code <= 57) return String.fromCodePoint(0x1d7f6 + (code - 48));
        return c;
      }).join("");
    },
  },
  {
    name: "Vaporwave / Fullwidth",
    badge: "Retro",
    transform: (text) => {
      return text.split("").map((c) => {
        const code = c.charCodeAt(0);
        if (code >= 33 && code <= 126) return String.fromCharCode(code + 65248);
        return c;
      }).join("");
    },
  },
  {
    name: "Squared Letters",
    badge: "Blocks",
    transform: (text) => {
      return text.split("").map((c) => {
        const code = c.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(0x1f130 + (code - 65));
        if (code >= 97 && code <= 122) return String.fromCodePoint(0x1f130 + (code - 97));
        return c;
      }).join("");
    },
  },
  {
    name: "Italic Sans",
    badge: "Smooth",
    transform: (text) => {
      return text.split("").map((c) => {
        const code = c.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(0x1d608 + (code - 65));
        if (code >= 97 && code <= 122) return String.fromCodePoint(0x1d622 + (code - 97));
        return c;
      }).join("");
    },
  },
  {
    name: "Upside Down",
    badge: "Fun",
    transform: (text) => {
      const flipMap: Record<string, string> = {
        a: "ɐ", b: "q", c: "ɔ", d: "p", e: "ǝ", f: "ɟ", g: "ƃ", h: "ɥ", i: "ı",
        j: "ɾ", k: "ʞ", l: "l", m: "ɯ", n: "u", o: "o", p: "d", q: "b", r: "ɹ",
        s: "s", t: "ʇ", u: "n", v: "ʌ", w: "ʍ", x: "x", y: "ʎ", z: "z",
        A: "∀", B: "q", C: "Ɔ", D: "p", E: "Ǝ", F: "Ⅎ", G: "פ", H: "H", I: "I",
        J: "ſ", K: "ʞ", L: "˥", M: "W", N: "N", O: "O", P: "Ԁ", Q: "Ò", R: "ɹ",
        S: "S", T: "┴", U: "∩", V: "Λ", W: "M", X: "X", Y: "⅄", Z: "Z",
      };
      return text.split("").reverse().map((c) => flipMap[c] || c).join("");
    },
  },
];

export default function FancyFontsPage() {
  const [inputText, setInputText] = useState("Discord Legend");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
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
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-400 text-xs font-bold border border-cyan-500/30">
            <Type className="w-3.5 h-3.5" />
            <span>Unicode Font & Nickname Styler</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Discord Fancy Fonts & Aesthetic Nickname Generator
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
            Generate aesthetic unicode fonts that work directly in Discord usernames, channel names, role titles, and status messages. 1-click copy any font style.
          </p>
        </div>
      </div>

      {/* Input Card */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-3 shadow-xl">
        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
          Enter Your Text / Server Nickname
        </label>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your name or channel title..."
          className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-5 py-3.5 text-base sm:text-lg text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-all font-medium"
        />
      </div>

      {/* Font Variations Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            Converted Font Styles ({FONT_TRANSFORMS.length})
          </h2>
          <span className="text-xs text-zinc-500">Click &ldquo;Copy&rdquo; to paste directly into Discord</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {FONT_TRANSFORMS.map((font, idx) => {
            const transformed = font.transform(inputText || "Discord");
            const isCopied = copiedIndex === idx;

            return (
              <div
                key={font.name}
                className="group flex flex-col justify-between bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 hover:border-cyan-500/40 rounded-2xl p-4 sm:p-5 transition-all shadow-sm hover:shadow-md"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-zinc-400">{font.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                      {font.badge}
                    </span>
                  </div>

                  <p className="text-base sm:text-lg text-white font-medium break-all py-1">
                    {transformed}
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-end">
                  <button
                    onClick={() => handleCopy(transformed, idx)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-200 transition-colors"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
