"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calculator,
  ArrowLeft,
  Copy,
  Check,
  ExternalLink,
  ShieldAlert,
  Bot,
  Sparkles,
  CheckSquare,
  Square,
} from "lucide-react";

interface PermissionItem {
  id: string;
  name: string;
  description: string;
  value: bigint;
  danger?: boolean;
}

const GENERAL_PERMISSIONS: PermissionItem[] = [
  { id: "ADMINISTRATOR", name: "Administrator", description: "Grants all permissions and bypasses channel overrides.", value: 1n << 3n, danger: true },
  { id: "MANAGE_GUILD", name: "Manage Server", description: "Change server name, region, and settings.", value: 1n << 5n, danger: true },
  { id: "MANAGE_ROLES", name: "Manage Roles", description: "Create, edit, and delete roles lower than highest role.", value: 1n << 28n, danger: true },
  { id: "MANAGE_CHANNELS", name: "Manage Channels", description: "Create, edit, or delete channels.", value: 1n << 4n, danger: true },
  { id: "KICK_MEMBERS", name: "Kick Members", description: "Remove members from the server.", value: 1n << 1n },
  { id: "BAN_MEMBERS", name: "Ban Members", description: "Permanently ban members from the server.", value: 1n << 2n },
  { id: "CREATE_INSTANT_INVITE", name: "Create Instant Invite", description: "Allow creating server invite links.", value: 1n << 0n },
  { id: "CHANGE_NICKNAME", name: "Change Nickname", description: "Allow changing own nickname.", value: 1n << 26n },
  { id: "MANAGE_NICKNAMES", name: "Manage Nicknames", description: "Modify nicknames of other members.", value: 1n << 27n },
  { id: "MANAGE_EMOJIS_AND_STICKERS", name: "Manage Emojis & Stickers", description: "Upload and delete custom server emojis.", value: 1n << 30n },
  { id: "MANAGE_WEBHOOKS", name: "Manage Webhooks", description: "Create, edit, and delete webhooks.", value: 1n << 29n },
  { id: "VIEW_AUDIT_LOG", name: "View Audit Log", description: "View server administrative audit logs.", value: 1n << 7n },
  { id: "VIEW_CHANNEL", name: "View Channels", description: "Allow reading messages or seeing channels.", value: 1n << 10n },
];

const TEXT_PERMISSIONS: PermissionItem[] = [
  { id: "SEND_MESSAGES", name: "Send Messages", description: "Send messages in text channels.", value: 1n << 11n },
  { id: "SEND_MESSAGES_IN_THREADS", name: "Send Messages in Threads", description: "Post inside active thread discussions.", value: 1n << 38n },
  { id: "CREATE_PUBLIC_THREADS", name: "Create Public Threads", description: "Allow starting public threads.", value: 1n << 35n },
  { id: "EMBED_LINKS", name: "Embed Links", description: "Display link previews and rich embeds.", value: 1n << 14n },
  { id: "ATTACH_FILES", name: "Attach Files", description: "Upload images, videos, and files.", value: 1n << 15n },
  { id: "READ_MESSAGE_HISTORY", name: "Read Message History", description: "Scroll back and read previous messages.", value: 1n << 16n },
  { id: "MENTION_EVERYONE", name: "Mention @everyone & @here", description: "Ping all server members.", value: 1n << 17n, danger: true },
  { id: "USE_EXTERNAL_EMOJIS", name: "Use External Emojis", description: "Use emojis from other servers.", value: 1n << 18n },
  { id: "ADD_REACTIONS", name: "Add Reactions", description: "Add emoji reactions to messages.", value: 1n << 6n },
  { id: "MANAGE_MESSAGES", name: "Manage Messages", description: "Delete messages from other members.", value: 1n << 13n, danger: true },
  { id: "USE_APPLICATION_COMMANDS", name: "Use Application (Slash) Commands", description: "Execute bot slash commands.", value: 1n << 31n },
];

const VOICE_PERMISSIONS: PermissionItem[] = [
  { id: "CONNECT", name: "Connect", description: "Join voice and stage channels.", value: 1n << 20n },
  { id: "SPEAK", name: "Speak", description: "Talk in voice channels.", value: 1n << 21n },
  { id: "STREAM", name: "Video / Screen Share", description: "Share screen or camera in voice.", value: 1n << 9n },
  { id: "MUTE_MEMBERS", name: "Mute Members", description: "Mute other members in voice channels.", value: 1n << 22n },
  { id: "DEAFEN_MEMBERS", name: "Deafen Members", description: "Deafen other members in voice.", value: 1n << 23n },
  { id: "MOVE_MEMBERS", name: "Move Members", description: "Drag members between voice channels.", value: 1n << 24n },
  { id: "USE_VAD", name: "Use Voice Activity", description: "Speak without push-to-talk.", value: 1n << 25n },
  { id: "PRIORITY_SPEAKER", name: "Priority Speaker", description: "Lower other members' volume while speaking.", value: 1n << 8n },
];

export default function PermissionsCalculatorPage() {
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
    new Set(["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "READ_MESSAGE_HISTORY"])
  );
  const [clientId, setClientId] = useState("");
  const [copiedValue, setCopiedValue] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Calculate permission bitwise integer
  let totalPermissionBigInt = 0n;
  const allPerms = [...GENERAL_PERMISSIONS, ...TEXT_PERMISSIONS, ...VOICE_PERMISSIONS];

  allPerms.forEach((p) => {
    if (selectedPermissions.has(p.id)) {
      totalPermissionBigInt |= p.value;
    }
  });

  const permissionIntegerString = totalPermissionBigInt.toString();

  const togglePermission = (id: string) => {
    const updated = new Set(selectedPermissions);
    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }
    setSelectedPermissions(updated);
  };

  const selectAll = () => {
    setSelectedPermissions(new Set(allPerms.map((p) => p.id)));
  };

  const clearAll = () => {
    setSelectedPermissions(new Set());
  };

  const selectAdmin = () => {
    setSelectedPermissions(new Set(["ADMINISTRATOR"]));
  };

  const inviteUrl = clientId.trim()
    ? `https://discord.com/oauth2/authorize?client_id=${clientId.trim()}&permissions=${permissionIntegerString}&scope=bot%20applications.commands`
    : "";

  const copyToClipboard = (text: string, type: "value" | "link") => {
    navigator.clipboard.writeText(text);
    if (type === "value") {
      setCopiedValue(true);
      setTimeout(() => setCopiedValue(false), 2000);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
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
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
            <Calculator className="w-3.5 h-3.5" />
            <span>OAuth2 Permission Bitwise Calculator</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Discord Permissions Calculator & Bot Invite Link Generator
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
            Select role or bot permissions to calculate the exact decimal integer for Discord bots. Enter your Application Client ID to generate an official 1-click bot authorization invite URL.
          </p>
        </div>
      </div>

      {/* Sticky Bottom / Top Output Bar */}
      <div className="sticky top-20 z-40 bg-zinc-900/95 backdrop-blur-md border border-zinc-700/80 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Calculated Permission Integer:
            </span>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xl sm:text-2xl font-black text-emerald-400">
                {permissionIntegerString}
              </span>
              <button
                onClick={() => copyToClipboard(permissionIntegerString, "value")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 border border-zinc-700 transition-colors"
              >
                {copiedValue ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Integer</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={selectAll}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 transition-colors"
            >
              Select All
            </button>
            <button
              onClick={selectAdmin}
              className="px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 text-xs font-semibold transition-colors"
            >
              Admin Only (8)
            </button>
            <button
              onClick={clearAll}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-400 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Bot Invite Generator Section */}
        <div className="pt-3 border-t border-zinc-800 flex flex-col sm:flex-row items-center gap-3">
          <div className="w-full sm:w-72">
            <input
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="Paste Bot Client ID (e.g. 1198555...)"
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          {inviteUrl ? (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => copyToClipboard(inviteUrl, "link")}
                className="inline-flex items-center justify-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2 rounded-xl text-xs font-semibold border border-zinc-700 transition-colors shrink-0"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Link Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Invite Link</span>
                  </>
                )}
              </button>
              <a
                href={inviteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-glow-sm transition-all shrink-0"
              >
                <span>Authorize & Invite Bot</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ) : (
            <span className="text-xs text-zinc-500 italic">
              Enter your Application Client ID above to generate a 1-click Discord invite URL.
            </span>
          )}
        </div>
      </div>

      {/* Permissions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* General Permissions */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-5 sm:p-6 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white border-b border-zinc-800 pb-3 flex items-center justify-between">
            <span>General Permissions</span>
            <span className="text-xs font-mono text-zinc-500">{GENERAL_PERMISSIONS.length}</span>
          </h2>

          <div className="space-y-2">
            {GENERAL_PERMISSIONS.map((p) => {
              const isChecked = selectedPermissions.has(p.id);
              return (
                <div
                  key={p.id}
                  onClick={() => togglePermission(p.id)}
                  className={`p-3 rounded-xl border cursor-pointer select-none transition-all ${
                    isChecked
                      ? "bg-emerald-950/20 border-emerald-500/40 text-white"
                      : "bg-zinc-950/40 hover:bg-zinc-900 border-zinc-800 text-zinc-400"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <Square className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-200">{p.name}</span>
                        {p.danger && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                            DANGEROUS
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-500 leading-snug mt-0.5">
                        {p.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Text Channel Permissions */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-5 sm:p-6 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white border-b border-zinc-800 pb-3 flex items-center justify-between">
            <span>Text Permissions</span>
            <span className="text-xs font-mono text-zinc-500">{TEXT_PERMISSIONS.length}</span>
          </h2>

          <div className="space-y-2">
            {TEXT_PERMISSIONS.map((p) => {
              const isChecked = selectedPermissions.has(p.id);
              return (
                <div
                  key={p.id}
                  onClick={() => togglePermission(p.id)}
                  className={`p-3 rounded-xl border cursor-pointer select-none transition-all ${
                    isChecked
                      ? "bg-emerald-950/20 border-emerald-500/40 text-white"
                      : "bg-zinc-950/40 hover:bg-zinc-900 border-zinc-800 text-zinc-400"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <Square className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-200">{p.name}</span>
                        {p.danger && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                            DANGEROUS
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-500 leading-snug mt-0.5">
                        {p.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Voice Channel Permissions */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-5 sm:p-6 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white border-b border-zinc-800 pb-3 flex items-center justify-between">
            <span>Voice Permissions</span>
            <span className="text-xs font-mono text-zinc-500">{VOICE_PERMISSIONS.length}</span>
          </h2>

          <div className="space-y-2">
            {VOICE_PERMISSIONS.map((p) => {
              const isChecked = selectedPermissions.has(p.id);
              return (
                <div
                  key={p.id}
                  onClick={() => togglePermission(p.id)}
                  className={`p-3 rounded-xl border cursor-pointer select-none transition-all ${
                    isChecked
                      ? "bg-emerald-950/20 border-emerald-500/40 text-white"
                      : "bg-zinc-950/40 hover:bg-zinc-900 border-zinc-800 text-zinc-400"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <Square className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-200">{p.name}</span>
                      </div>
                      <p className="text-[11px] text-zinc-500 leading-snug mt-0.5">
                        {p.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
