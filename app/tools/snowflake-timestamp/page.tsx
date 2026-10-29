"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Clock,
  ArrowLeft,
  Search,
  Calendar,
  Layers,
  Copy,
  Check,
  Cpu,
  Info,
} from "lucide-react";

export default function SnowflakeConverterPage() {
  const [snowflakeInput, setSnowflakeInput] = useState("");
  const [decoded, setDecoded] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedDate, setCopiedDate] = useState(false);

  const DISCORD_EPOCH = 1420070400000n;

  const handleDecode = (val?: string) => {
    const input = (val !== undefined ? val : snowflakeInput).trim();
    if (!input) return;

    setError(null);
    setDecoded(null);

    // Validate that input is numeric and roughly between 15 and 20 digits
    if (!/^\d{16,21}$/.test(input)) {
      setError("Invalid Discord Snowflake ID. Snowflakes must be a 17-20 digit integer (e.g. 1198555191834247269).");
      return;
    }

    try {
      const snowflakeBigInt = BigInt(input);
      const timestampMs = Number((snowflakeBigInt >> 22n) + DISCORD_EPOCH);
      const date = new Date(timestampMs);

      // Sanity check
      if (isNaN(date.getTime()) || timestampMs < 1420070400000 || timestampMs > 2500000000000) {
        setError("This ID produces an impossible timestamp. Please check your Discord ID.");
        return;
      }

      const workerId = Number((snowflakeBigInt & 0x3e0000n) >> 17n);
      const processId = Number((snowflakeBigInt & 0x1f000n) >> 12n);
      const increment = Number(snowflakeBigInt & 0xfffn);

      // Calculate relative time
      const diffMs = Date.now() - timestampMs;
      const daysAgo = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const yearsAgo = (daysAgo / 365.25).toFixed(1);

      setDecoded({
        id: input,
        timestampMs,
        unixSeconds: Math.floor(timestampMs / 1000),
        isoString: date.toISOString(),
        utcDateString: date.toUTCString(),
        localDateString: date.toLocaleString(undefined, {
          dateStyle: "full",
          timeStyle: "medium",
        }),
        daysAgo,
        yearsAgo,
        workerId,
        processId,
        increment,
      });
    } catch (err: any) {
      setError("Failed to parse Snowflake ID: " + err.message);
    }
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDate(true);
    setTimeout(() => setCopiedDate(false), 2000);
  };

  const loadExample = (id: string) => {
    setSnowflakeInput(id);
    handleDecode(id);
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
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-purple-500/20 text-purple-400 text-xs font-bold border border-purple-500/30">
            <Clock className="w-3.5 h-3.5" />
            <span>64-Bit Snowflake Decoder</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Discord Snowflake to Timestamp & Account Age
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
            Every Discord User, Server, Channel, Role, and Message has a unique 64-bit Snowflake ID that contains the exact millisecond it was created. Paste any ID to decode its creation timestamp and age.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleDecode();
          }}
          className="space-y-3"
        >
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
            Paste Discord Snowflake ID
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={snowflakeInput}
                onChange={(e) => setSnowflakeInput(e.target.value)}
                placeholder="e.g. 1198555191834247269 or 80351110224678912"
                className="w-full bg-zinc-950 border border-zinc-700/80 rounded-2xl pl-11 pr-4 py-3 text-sm text-white font-mono placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-all"
              />
              <Clock className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              disabled={!snowflakeInput.trim()}
              className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-glow-sm transition-all shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Decode ID</span>
            </button>
          </div>
        </form>

        {/* Examples */}
        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-zinc-400">
          <span className="font-semibold text-zinc-500">Quick Test IDs:</span>
          {[
            { label: "Wumpus Bot", id: "1198555191834247269" },
            { label: "Discord First User", id: "80351110224678912" },
            { label: "Modern Account", id: "1076543210987654321" },
          ].map((ex) => (
            <button
              key={ex.id}
              type="button"
              onClick={() => loadExample(ex.id)}
              className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-[11px] border border-zinc-700/60 transition-colors"
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs sm:text-sm">
          {error}
        </div>
      )}

      {/* Decoded Results Card */}
      {decoded && (
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
            <div>
              <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">
                Decoded Discord ID
              </span>
              <p className="font-mono text-xl sm:text-2xl font-black text-white mt-0.5">
                {decoded.id}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-bold">
                {decoded.yearsAgo} years old ({decoded.daysAgo.toLocaleString()} days ago)
              </span>
            </div>
          </div>

          {/* Timestamps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-1.5">
              <span className="text-xs text-zinc-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                <span>Exact Local Date & Time</span>
              </span>
              <p className="text-sm sm:text-base font-bold text-white">
                {decoded.localDateString}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-1.5">
              <span className="text-xs text-zinc-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>UTC Time</span>
              </span>
              <p className="text-sm sm:text-base font-bold text-white">
                {decoded.utcDateString}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-1.5">
              <span className="text-xs text-zinc-400">Unix Timestamp (Seconds)</span>
              <div className="flex items-center justify-between">
                <p className="text-sm font-mono font-bold text-zinc-200">
                  {decoded.unixSeconds}
                </p>
                <button
                  onClick={() => copyText(decoded.unixSeconds.toString())}
                  className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white"
                  title="Copy Unix seconds"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-1.5">
              <span className="text-xs text-zinc-400">ISO 8601 String</span>
              <div className="flex items-center justify-between">
                <p className="text-xs font-mono font-bold text-zinc-200 truncate">
                  {decoded.isoString}
                </p>
                <button
                  onClick={() => copyText(decoded.isoString)}
                  className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white"
                  title="Copy ISO string"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Low Level Snowflake Anatomy */}
          <div className="pt-4 border-t border-zinc-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              <span>Internal Discord Snowflake Structure</span>
            </h4>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-zinc-950/40 border border-zinc-800">
                <span className="text-zinc-500 block">Worker ID</span>
                <span className="font-mono font-bold text-white">{decoded.workerId}</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950/40 border border-zinc-800">
                <span className="text-zinc-500 block">Process ID</span>
                <span className="font-mono font-bold text-white">{decoded.processId}</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950/40 border border-zinc-800">
                <span className="text-zinc-500 block">Sequence Increment</span>
                <span className="font-mono font-bold text-white">{decoded.increment}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
