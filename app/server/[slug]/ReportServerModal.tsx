"use client";

import { useState } from "react";
import { Flag, X, AlertTriangle, CheckCircle2, ShieldAlert, Loader2 } from "lucide-react";

interface ReportServerModalProps {
  serverId: string;
  serverName: string;
  serverSlug: string;
  className?: string;
  buttonVariant?: "header" | "sidebar";
}

const REPORT_REASONS = [
  "Broken / Expired Invite Link",
  "Scam, Phishing, or Financial Fraud",
  "NSFW, Explicit, or Inappropriate Content",
  "Harassment, Hate Speech, or Raiding",
  "Impersonation or Copyright Infringement",
  "Fake Members, Botting, or Spam Listing",
  "Other Community Policy Violation",
];

export default function ReportServerModal({
  serverId,
  serverName,
  serverSlug,
  className = "",
  buttonVariant = "header",
}: ReportServerModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState(REPORT_REASONS[0]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !comment.trim() || !reason) {
      setError("Please fill out all required fields.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/servers/${serverId}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          reason,
          comment: comment.trim(),
          serverSlug,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit report");
      }

      setSuccess(true);
      setName("");
      setEmail("");
      setComment("");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setError(null);
    setSuccess(false);
  };

  return (
    <>
      {buttonVariant === "header" ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-900/90 hover:bg-rose-950/40 border border-zinc-800 hover:border-rose-500/50 text-xs font-semibold text-zinc-300 hover:text-rose-300 transition-all ${className}`}
          title={`Report ${serverName}`}
        >
          <Flag className="w-3.5 h-3.5 text-rose-400" />
          <span>Report Server</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-zinc-950/80 hover:bg-rose-950/30 border border-zinc-800/80 hover:border-rose-500/40 text-xs font-medium text-zinc-400 hover:text-rose-300 transition-all ${className}`}
          title={`Report ${serverName}`}
        >
          <Flag className="w-3.5 h-3.5 text-rose-400" />
          <span>Report this server listing</span>
        </button>
      )}

      {/* Modal Backdrop & Window */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-lg rounded-3xl bg-zinc-900 border border-zinc-800 p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">Report Discord Server</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Target: <span className="text-zinc-200 font-semibold">{serverName}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {success ? (
              <div className="py-6 text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-lg font-bold text-white">Report Submitted</h4>
                  <p className="text-xs text-zinc-300 max-w-md mx-auto leading-relaxed">
                    Thank you for keeping DiscordServerLink safe and high quality. Our moderation team has received your report regarding <strong className="text-zinc-100">{serverName}</strong> and will review it promptly.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white transition"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Your Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex M."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Your Email <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 transition"
                    />
                  </div>
                </div>

                {/* Reason Selection */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Reason for Report <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-rose-500 transition"
                  >
                    {REPORT_REASONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Comment / Details */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Report Details & Comments <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Describe what is wrong with this listing (e.g. invalid invite link, toxic behavior, scam server)..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 transition leading-relaxed resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-xs font-bold text-white shadow-[0_0_15px_rgba(225,29,72,0.4)] transition"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Flag className="w-3.5 h-3.5" />
                        <span>Submit Report</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
