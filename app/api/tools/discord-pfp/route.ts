import { NextRequest, NextResponse } from "next/server";

const DISCORD_EPOCH = 1420070400000n;

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    const cleanId = (userId || "").trim();

    if (!cleanId) {
      return NextResponse.json(
        { error: "Please enter a Discord User ID." },
        { status: 400 }
      );
    }

    // Must be a snowflake ID (17-21 numeric digits)
    if (!/^\d{17,21}$/.test(cleanId)) {
      return NextResponse.json(
        {
          error:
            "Invalid Discord User ID format. User IDs are 17 to 20 digit numbers (e.g. 159985870458322944). Make sure you copied the User ID and not a username.",
        },
        { status: 400 }
      );
    }

    // Calculate creation timestamp from Snowflake
    let createdAt = "";
    let accountAge = "";
    try {
      const snowflakeBig = BigInt(cleanId);
      const timestampMs = Number((snowflakeBig >> 22n) + DISCORD_EPOCH);
      const createdDate = new Date(timestampMs);
      createdAt = createdDate.toISOString();
      const diffDays = Math.floor(
        (Date.now() - timestampMs) / (1000 * 60 * 60 * 24)
      );
      accountAge = `${diffDays} days ago (${(diffDays / 365.25).toFixed(1)} years)`;
    } catch (e) {
      // ignore
    }

    let userData: any = null;

    // 1. If DISCORD_BOT_TOKEN is available in env, use official Discord API
    if (process.env.DISCORD_BOT_TOKEN) {
      try {
        const discordRes = await fetch(
          `https://discord.com/api/v10/users/${cleanId}`,
          {
            headers: {
              Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
              "User-Agent": "DiscordServerLink/1.0",
            },
            cache: "no-store",
          }
        );
        if (discordRes.ok) {
          userData = await discordRes.json();
        }
      } catch (err) {
        console.warn("Direct Discord API lookup failed, falling back to public lookup:", err);
      }
    }

    // 2. Fallback to public Discord user lookup service
    if (!userData) {
      try {
        const japiRes = await fetch(
          `https://japi.rest/discord/v1/user/${cleanId}`,
          {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) DiscordServerLink/1.0",
            },
            cache: "no-store",
          }
        );

        if (japiRes.ok) {
          const json = await japiRes.json();
          if (json?.data && !json?.data?.message) {
            userData = json.data;
          }
        }
      } catch (err) {
        console.warn("Public lookup error:", err);
      }
    }

    if (!userData) {
      return NextResponse.json(
        {
          error:
            "User Not Found. Double-check that you copied the User ID (a long string of numbers like 159985870458322944) and not the username. Also, ensure the user account still exists and hasn't been deleted.",
        },
        { status: 404 }
      );
    }

    const {
      id,
      username,
      discriminator,
      global_name,
      avatar,
      banner,
      accent_color,
      bot,
    } = userData;

    const isAnimatedAvatar = Boolean(avatar && avatar.startsWith("a_"));
    const isAnimatedBanner = Boolean(banner && banner.startsWith("a_"));

    // Build Avatar URLs
    let avatarUrl: string;
    let avatarPng: string;
    let avatarWebp: string;
    let avatarGif: string | null = null;

    if (avatar) {
      const baseAvatar = `https://cdn.discordapp.com/avatars/${id}/${avatar}`;
      avatarUrl = isAnimatedAvatar
        ? `${baseAvatar}.gif?size=1024`
        : `${baseAvatar}.png?size=1024`;
      avatarPng = `${baseAvatar}.png?size=1024`;
      avatarWebp = `${baseAvatar}.webp?size=1024`;
      avatarGif = isAnimatedAvatar ? `${baseAvatar}.gif?size=1024` : null;
    } else {
      // Default Discord avatar calculation
      let defaultIdx = 0;
      try {
        defaultIdx = Number((BigInt(id) >> 22n) % 6n);
      } catch {
        defaultIdx = 0;
      }
      avatarUrl = `https://cdn.discordapp.com/embed/avatars/${defaultIdx}.png`;
      avatarPng = avatarUrl;
      avatarWebp = avatarUrl;
      avatarGif = null;
    }

    // Build Banner URLs
    let bannerUrl: string | null = null;
    let bannerPng: string | null = null;
    let bannerGif: string | null = null;

    if (banner) {
      const baseBanner = `https://cdn.discordapp.com/banners/${id}/${banner}`;
      bannerUrl = isAnimatedBanner
        ? `${baseBanner}.gif?size=1024`
        : `${baseBanner}.png?size=1024`;
      bannerPng = `${baseBanner}.png?size=1024`;
      bannerGif = isAnimatedBanner ? `${baseBanner}.gif?size=1024` : null;
    }

    const hexAccent = accent_color
      ? `#${accent_color.toString(16).padStart(6, "0")}`
      : null;

    return NextResponse.json({
      success: true,
      user: {
        id,
        username: username || "Unknown",
        globalName: global_name || username || "Discord User",
        tag:
          discriminator && discriminator !== "0"
            ? `${username}#${discriminator}`
            : `@${username}`,
        avatar,
        hasCustomAvatar: Boolean(avatar),
        isAnimatedAvatar,
        avatarUrl,
        avatarPng,
        avatarWebp,
        avatarGif,
        hasBanner: Boolean(banner),
        isAnimatedBanner,
        bannerUrl,
        bannerPng,
        bannerGif,
        accentColor: hexAccent,
        isBot: Boolean(bot),
        createdAt,
        accountAge,
      },
    });
  } catch (error: any) {
    console.error("Error fetching Discord profile:", error);
    return NextResponse.json(
      {
        error:
          "Internal server error while fetching user profile. Please verify the ID and try again.",
      },
      { status: 500 }
    );
  }
}
