"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function ContactFormClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("General Inquiry");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus({ ok: false, msg: "Please fill out all required fields." });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus({
          ok: true,
          msg: data.message || "Message sent successfully! Our team will respond within 24-48 business hours.",
        });
        setName("");
        setEmail("");
        setMessage("");
        setSubject("General Inquiry");
      } else {
        setStatus({ ok: false, msg: data.error || "Failed to send message. Please try again." });
      }
    } catch {
      setStatus({
        ok: false,
        msg: "A network error occurred. You can also email us directly at support@discordserverlink.com.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
            Your Full Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-discord-blurple transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
            Email Address <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-discord-blurple transition-all"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
          Inquiry Department / Subject <span className="text-red-400">*</span>
        </label>
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-discord-blurple transition-all cursor-pointer"
        >
          <option value="General Inquiry">General Question / Feedback</option>
          <option value="Server Report">Report a Server Violation / NSFW Flag</option>
          <option value="Verification Request">Server Verification / Partner Badge Request</option>
          <option value="Advertising">Advertising &amp; Sponsored Listings</option>
          <option value="DMCA Copyright">DMCA / Copyright Infringement Notice</option>
          <option value="Bug Report">Technical Bug Report / Suggestion</option>
          <option value="Emoji Submission">Emoji Submission Query</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
          Message Details <span className="text-red-400">*</span>
        </label>
        <textarea
          rows={5}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Please describe your question or issue in detail. If reporting a server, include the server listing URL..."
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-discord-blurple transition-all"
        />
        <p className="text-[11px] text-zinc-500">
          Include relevant server invite links or user IDs if your inquiry relates to moderation.
        </p>
      </div>

      {status && (
        <div
          className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-start gap-3 animate-in fade-in duration-200 ${
            status.ok
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
        >
          {status.ok ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          )}
          <span className="leading-relaxed">{status.msg}</span>
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={loading || !name.trim() || !email.trim() || !message.trim()}
          className="w-full inline-flex items-center justify-center gap-2 bg-discord-blurple hover:bg-discord-hover disabled:opacity-50 text-white py-3.5 rounded-2xl text-sm font-bold shadow-glow hover:shadow-glow-lg transition-all cursor-pointer"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Sending Message...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Send Message to Support</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
