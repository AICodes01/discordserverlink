import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import prisma from "@/lib/prisma";

export default async function AnnouncementBanner() {
  try {
    const [enabledSetting, textSetting, linkSetting] = await Promise.all([
      prisma.siteSetting.findUnique({ where: { key: "announcement_banner_enabled" } }),
      prisma.siteSetting.findUnique({ where: { key: "announcement_text" } }),
      prisma.siteSetting.findUnique({ where: { key: "announcement_link" } }),
    ]);

    if (enabledSetting?.value !== "true" || !textSetting?.value) {
      return null;
    }

    const text = textSetting.value;
    const link = linkSetting?.value || "/servers/new";

    return (
      <div className="bg-gradient-to-r from-discord-blurple/20 via-indigo-900/30 to-discord-blurple/20 border-b border-discord-blurple/30 py-2.5 px-4 text-center text-xs sm:text-sm font-medium text-zinc-200">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
          <Sparkles className="w-4 h-4 text-discord-yellow flex-shrink-0" />
          <span>{text}</span>
          <Link
            href={link}
            className="inline-flex items-center gap-1 font-bold text-discord-blurple hover:text-indigo-300 underline underline-offset-4 ml-1 transition"
          >
            <span>List for free</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  } catch (error) {
    return null;
  }
}
