"use client";

import { ExternalLink } from "lucide-react";

interface JoinButtonProps {
  serverId: string;
  inviteUrl: string;
  serverName?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function JoinButton({
  serverId,
  inviteUrl,
  serverName,
  className,
  children,
}: JoinButtonProps) {
  const handleClick = () => {
    try {
      fetch(`/api/servers/${serverId}/join`, {
        method: "POST",
        keepalive: true,
      }).catch(() => {});
    } catch {}
  };

  return (
    <a
      href={inviteUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={
        className ||
        "w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-discord-blurple hover:bg-discord-hover text-white font-bold text-base shadow-glow hover:shadow-glow-sm transition text-center"
      }
    >
      {children || (
        <>
          <span>Join Discord</span>
          <ExternalLink className="w-4 h-4" />
        </>
      )}
    </a>
  );
}
