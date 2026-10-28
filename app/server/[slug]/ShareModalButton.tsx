"use client";

import { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";

export default function ShareModalButton({
  serverName,
  slug,
}: {
  serverName: string;
  slug: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const url = `${window.location.origin}/server/${slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <button
      onClick={handleCopy}
      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-sm transition"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-400">Copied to Clipboard!</span>
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4" />
          <span>Share Server</span>
        </>
      )}
    </button>
  );
}
