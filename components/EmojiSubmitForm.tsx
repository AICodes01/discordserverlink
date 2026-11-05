"use client";

import { useState, useRef } from "react";
import { UploadCloud, CheckCircle2, AlertCircle, Sparkles, Smile, X, Image as ImageIcon } from "lucide-react";
import { EMOJI_CATEGORIES } from "@/lib/emojisData";

export default function EmojiSubmitForm({ onEmojiSubmitted }: { onEmojiSubmitted?: () => void }) {
  const [name, setName] = useState("");
  const [shortcode, setShortcode] = useState("");
  const [category, setCategory] = useState("memes");
  const [submitterName, setSubmitterName] = useState("");
  const [submitterDiscord, setSubmitterDiscord] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNameChange = (val: string) => {
    setName(val);
    const slug = val
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "");
    setShortcode(slug ? `:${slug}:` : "");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 256KB for Discord standard)
    if (file.size > 256 * 1024) {
      setFileError("File is larger than 256KB. Discord requires emojis to be under 256KB.");
      return;
    }

    // Check extension
    const validTypes = ["image/gif", "image/png", "image/webp", "image/jpeg"];
    if (!validTypes.includes(file.type)) {
      setFileError("Please upload a GIF, PNG, or WebP image.");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Auto-fill name if empty
    if (!name.trim()) {
      const cleanFileName = file.name.replace(/\.[^/.]+$/, "");
      handleNameChange(cleanFileName);
    }
  };

  const handleClearFile = () => {
    setImageFile(null);
    setPreviewUrl(null);
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg("Please provide an emoji name.");
      return;
    }
    if (!previewUrl || !imageFile) {
      setErrorMsg("Please select an image file to upload.");
      return;
    }

    setLoading(true);

    try {
      const ext = imageFile.name.split(".").pop() || "png";
      const res = await fetch("/api/emojis/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          shortcode: shortcode.trim(),
          category,
          submitterName: submitterName.trim(),
          submitterDiscord: submitterDiscord.trim(),
          imageData: previewUrl,
          imageExt: ext,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Submission failed.");
      }

      setSuccess(true);
      if (onEmojiSubmitted) onEmojiSubmitted();
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred while submitting.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setShortcode("");
    setCategory("memes");
    setSubmitterName("");
    setSubmitterDiscord("");
    setImageFile(null);
    setPreviewUrl(null);
    setFileError(null);
    setSuccess(false);
    setErrorMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div
      id="submit-emoji"
      className="relative rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-amber-500/30 p-6 sm:p-10 shadow-2xl overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Community Emoji Creator & Submissions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Submit <span className="text-amber-400">Discord Emoji</span>
          </h2>
          <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
            Do you have a unique emoji pack you’d like to share with others? On our website, you can submit your own emojis for free and showcase them to thousands of Discord users. This helps others discover new creative designs while giving your collection the visibility it deserves.
          </p>
        </div>

        {/* Success State */}
        {success ? (
          <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4 animate-in fade-in">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Emoji Submitted Successfully!</h3>
              <p className="text-xs text-zinc-300 max-w-md mx-auto">
                Thank you for contributing! Your emoji &ldquo;{name}&rdquo; has been received and queued for review. Once verified, it will be added to the live directory for thousands of Discord communities.
              </p>
            </div>
            <button
              onClick={resetForm}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              Submit Another Emoji
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Image Upload & Live Preview */}
              <div className="space-y-4">
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Emoji Asset (GIF, PNG, or WebP) <span className="text-amber-400">*</span>
                </label>

                {!previewUrl ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-zinc-700 hover:border-amber-400/80 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-zinc-950/50 hover:bg-zinc-900/40 group"
                  >
                    <UploadCloud className="w-10 h-10 text-zinc-500 group-hover:text-amber-400 transition-colors mb-2" />
                    <p className="text-xs font-bold text-white mb-1">
                      Click to upload or drag & drop
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      GIF, PNG, or WebP (Max 256KB, Square recommended)
                    </p>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                        <span>Live Discord Preview</span>
                      </span>
                      <button
                        type="button"
                        onClick={handleClearFile}
                        className="text-zinc-400 hover:text-red-400 p-1 rounded transition-colors"
                        title="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Preview Mockup in Dark and Light Chat Bubble */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-zinc-900/90 rounded-xl p-3 border border-zinc-800 flex flex-col items-center justify-center space-y-1">
                        <span className="text-[10px] text-zinc-500">Dark Chat</span>
                        <div className="w-12 h-12 flex items-center justify-center p-1">
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="max-w-full max-h-full object-contain filter drop-shadow"
                          />
                        </div>
                      </div>
                      <div className="bg-zinc-100 rounded-xl p-3 border border-zinc-200 flex flex-col items-center justify-center space-y-1">
                        <span className="text-[10px] text-zinc-600">Light Chat</span>
                        <div className="w-12 h-12 flex items-center justify-center p-1">
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="max-w-full max-h-full object-contain filter drop-shadow"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="text-[11px] text-zinc-400 truncate">
                      File: <span className="text-white font-mono">{imageFile?.name}</span> ({Math.round((imageFile?.size || 0) / 1024)} KB)
                    </div>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/gif,image/png,image/webp,image/jpeg"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {fileError && (
                  <p className="text-[11px] text-red-400 font-semibold">{fileError}</p>
                )}
              </div>

              {/* Right Column: Metadata Fields */}
              <div className="space-y-4">
                {/* Emoji Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-zinc-300">
                    Emoji Name <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Pepe Hype, Gigachad, Anya Smug"
                    className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                  />
                </div>

                {/* Shortcode preview */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-zinc-300">
                    Discord Shortcode
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={shortcode}
                      onChange={(e) => setShortcode(e.target.value)}
                      placeholder=":emoji_name:"
                      className="w-full bg-zinc-950/80 border border-zinc-800 font-mono text-amber-400 rounded-xl px-3.5 py-2.5 text-xs placeholder-zinc-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                    />
                  </div>
                  <p className="text-[10px] text-zinc-500">
                    This is what users will type in Discord chat (e.g. <code>:partyjam:</code>).
                  </p>
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-zinc-300">
                    Category <span className="text-amber-400">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                  >
                    {EMOJI_CATEGORIES.filter((c) => c.slug !== "all").map((cat) => (
                      <option key={cat.slug} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Submitter Info (Optional) */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-zinc-400">
                      Creator / Submitter Name
                    </label>
                    <input
                      type="text"
                      value={submitterName}
                      onChange={(e) => setSubmitterName(e.target.value)}
                      placeholder="Optional nickname"
                      className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-zinc-400">
                      Discord Handle
                    </label>
                    <input
                      type="text"
                      value={submitterDiscord}
                      onChange={(e) => setSubmitterDiscord(e.target.value)}
                      placeholder="@username"
                      className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-zinc-800/80">
              <p className="text-[11px] text-zinc-400">
                ⚡ 100% Free submission. No registration or credit card required.
              </p>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs transition-all shadow-lg shadow-amber-500/10 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                <Smile className="w-3.5 h-3.5" />
                <span>{loading ? "Submitting..." : "Submit Emoji Now"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
