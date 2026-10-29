import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawInput = searchParams.get("code") || "";

  if (!rawInput.trim()) {
    return NextResponse.json({ error: "Please enter an invite link or code." }, { status: 400 });
  }

  // Extract invite code from URLs like:
  // https://discord.gg/minecraft
  // discord.gg/minecraft
  // https://discord.com/invite/minecraft
  // minecraft
  const cleanCode = rawInput
    .trim()
    .replace(/^https?:\/\/(www\.)?discord\.(gg|com\/invite)\//i, "")
    .replace(/^discord\.gg\//i, "")
    .split("/")[0]
    .split("?")[0];

  if (!cleanCode) {
    return NextResponse.json({ error: "Invalid Discord invite format." }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://discord.com/api/v10/invites/${encodeURIComponent(cleanCode)}?with_counts=true&with_expiration=true`,
      {
        headers: {
          "User-Agent": "DiscordServerLink-Bot/1.0",
        },
        next: { revalidate: 30 },
      }
    );

    if (res.status === 404) {
      return NextResponse.json(
        { error: "This invite link is invalid, expired, or the server was deleted." },
        { status: 404 }
      );
    }

    if (res.status === 429) {
      return NextResponse.json(
        { error: "Discord API rate limit reached. Please wait a few seconds and try again." },
        { status: 429 }
      );
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: `Discord API returned an error (${res.status}).` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to connect to Discord API: " + (err.message || "Unknown error") },
      { status: 500 }
    );
  }
}
