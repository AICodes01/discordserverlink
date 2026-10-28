"use client";

import { useState, useEffect } from "react";
import { Rocket, Check, Clock, Sparkles } from "lucide-react";

interface ServerBumpButtonProps {
  serverId: string;
  initialBumps: number;
  lastBumpedAt: string | Date;
  cooldownHours?: number;
}

export default function ServerBumpButton({
  serverId,
  initialBumps,
  lastBumpedAt,
  cooldownHours = 2,
}: ServerBumpButtonProps) {
  const [bumps, setBumps] = useState(initialBumps);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [remainingTime, setRemainingTime] = useState<string | null>(null);
  const [canBump, setCanBump] = useState(false);

  useEffect(() => {
    const calculateCooldown = () => {
      const cooldownMs = cooldownHours * 60 * 60 * 1000;
      const last = new Date(lastBumpedAt).getTime();
      const now = Date.now();
      const diff = now - last;

      if (diff < cooldownMs) {
        setCanBump(false);
        const remMs = cooldownMs - diff;
        const hours = Math.floor(remMs / (1000 * 60 * 60));
        const mins = Math.floor((remMs % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((remMs % (1000 * 60)) / 1000);

        if (hours > 0) {
          setRemainingTime(`${hours}h ${mins}m`);
        } else if (mins > 0) {
          setRemainingTime(`${mins}m ${secs}s`);
        } else {
          setRemainingTime(`${secs}s`);
        }
      } else {
        setCanBump(true);
        setRemainingTime(null);
      }
    };

    calculateCooldown();
    const interval = setInterval(calculateCooldown, 1000);
    return () => clearInterval(interval);
  }, [lastBumpedAt, cooldownHours]);

  const handleBump = async () => {
    if (!canBump || loading) return;
    setLoading(true);
    setStatusMsg(null);
    setIsError(false);

    try {
      const res = await fetch(`/api/servers/${serverId}/bump`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        setIsError(true);
        setStatusMsg(data.error || "Failed to bump server");
      } else {
        setBumps((prev) => prev + 1);
        setCanBump(false);
        setStatusMsg("🚀 Bumped to top! Your server is now #1.");
      }
    } catch (err: any) {
      setIsError(true);
      setStatusMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleBump}
        disabled={!canBump || loading}
        className={`w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 ${
          canBump
            ? "bg-gradient-to-r from-discord-blurple to-indigo-600 hover:from-discord-hover hover:to-indigo-500 text-white shadow-glow hover:scale-[1.02] cursor-pointer"
            : "bg-zinc-800/80 text-zinc-400 border border-zinc-700/50 cursor-not-allowed"
        }`}
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : canBump ? (
          <>
            <Rocket className="w-5 h-5 animate-bounce" />
            <span>Bump Server to Top</span>
          </>
        ) : (
          <>
            <Clock className="w-4 h-4 text-zinc-500" />
            <span>Bump ready in {remainingTime}</span>
          </>
        )}
      </button>

      {/* Bump counter and status pill */}
      <div className="flex items-center gap-2 mt-2 text-xs text-zinc-400">
        <span className="flex items-center gap-1 font-semibold text-zinc-300">
          <Sparkles className="w-3.5 h-3.5 text-discord-yellow" />
          {bumps.toLocaleString()} total bumps
        </span>
      </div>

      {statusMsg && (
        <p
          className={`text-xs mt-2 text-center px-3 py-1.5 rounded-lg ${
            isError
              ? "bg-red-500/10 text-red-400 border border-red-500/20"
              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          }`}
        >
          {statusMsg}
        </p>
      )}
    </div>
  );
}
