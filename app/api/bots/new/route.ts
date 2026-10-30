import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { DiscordBot } from "@/lib/botsData";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = (body.name || "").trim();
    const shortDescription = (body.shortDescription || "").trim();
    const longDescription = (body.longDescription || "").trim() || shortDescription;
    const category = body.category || "utility";
    let inviteUrl = (body.inviteUrl || "").trim();
    const clientId = (body.clientId || "").trim();
    const prefix = (body.prefix || "/").trim();
    const iconUrl =
      (body.iconUrl || "").trim() ||
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=256&auto=format&fit=crop&q=80";
    const websiteUrl = (body.websiteUrl || "").trim() || inviteUrl;

    if (!name || name.length < 2) {
      return NextResponse.json(
        { error: "Bot name must be at least 2 characters long." },
        { status: 400 }
      );
    }

    if (!shortDescription || shortDescription.length < 10) {
      return NextResponse.json(
        { error: "Short description must be at least 10 characters long." },
        { status: 400 }
      );
    }

    // Auto-generate invite URL if clientId is provided and inviteUrl is empty
    if (!inviteUrl && clientId) {
      inviteUrl = `https://discord.com/oauth2/authorize?client_id=${encodeURIComponent(clientId)}&scope=bot%20applications.commands&permissions=8`;
    }

    if (!inviteUrl) {
      return NextResponse.json(
        { error: "Please provide either a valid Discord Client ID or Invite URL." },
        { status: 400 }
      );
    }

    // Process tags
    let tags: string[] = [];
    if (Array.isArray(body.tags)) {
      tags = body.tags.map((t: string) => t.trim().toLowerCase()).filter(Boolean);
    } else if (typeof body.tags === "string") {
      tags = body.tags
        .split(",")
        .map((t: string) => t.trim().toLowerCase())
        .filter(Boolean);
    }
    if (tags.length === 0) {
      tags = [category, "discord", "bot"];
    }

    // Process features
    let features: string[] = [];
    if (Array.isArray(body.features)) {
      features = body.features.map((f: string) => f.trim()).filter(Boolean);
    } else if (typeof body.features === "string") {
      features = body.features
        .split(",")
        .map((f: string) => f.trim())
        .filter(Boolean);
    }
    if (features.length === 0) {
      features = ["Slash Commands support", "Customizable settings", "24/7 Uptime"];
    }

    // Category label
    const categoryLabels: Record<string, string> = {
      moderation: "Moderation",
      music: "Music",
      ai: "AI & Chatbots",
      utility: "Utility",
      gaming: "Gaming",
      economy: "Economy",
      anime: "Anime",
    };
    const categoryLabel = categoryLabels[category] || "Utility";

    // Create unique slug
    let baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    if (!baseSlug) baseSlug = `bot-${Date.now()}`;

    const filePath = path.join(process.cwd(), "lib", "customBots.json");
    let currentBots: DiscordBot[] = [];
    try {
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        currentBots = JSON.parse(fileContent);
      }
    } catch (e) {
      currentBots = [];
    }

    // Check slug collision
    let finalSlug = baseSlug;
    let counter = 1;
    while (currentBots.some((b) => b.slug === finalSlug)) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newBot: DiscordBot = {
      id: `bot-${Date.now()}`,
      name,
      slug: finalSlug,
      shortDescription,
      longDescription,
      iconUrl,
      category: category as any,
      categoryLabel,
      tags,
      prefix,
      serverCount: 1,
      formattedServers: "1",
      votesCount: 1,
      rating: 5.0,
      inviteUrl,
      websiteUrl,
      isVerified: false,
      features,
    };

    currentBots.unshift(newBot);

    // Save back to JSON file
    fs.writeFileSync(filePath, JSON.stringify(currentBots, null, 2), "utf-8");

    return NextResponse.json({
      success: true,
      bot: newBot,
      slug: finalSlug,
      message: "Discord bot submitted and listed successfully!",
    });
  } catch (error: any) {
    console.error("Error creating bot:", error);
    return NextResponse.json(
      { error: "Internal server error while adding bot." },
      { status: 500 }
    );
  }
}
