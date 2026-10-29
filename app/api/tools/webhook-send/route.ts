import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { webhookUrl, username, avatar_url, content, embeds } = body;

    if (!webhookUrl || typeof webhookUrl !== "string") {
      return NextResponse.json(
        { error: "Webhook URL is required." },
        { status: 400 }
      );
    }

    if (!webhookUrl.startsWith("https://discord.com/api/webhooks/")) {
      return NextResponse.json(
        { error: "Invalid Discord webhook URL format. Must start with https://discord.com/api/webhooks/" },
        { status: 400 }
      );
    }

    if (!content && (!embeds || embeds.length === 0)) {
      return NextResponse.json(
        { error: "Please enter a message or an embed." },
        { status: 400 }
      );
    }

    const payload: any = {};
    if (content) payload.content = content;
    if (username) payload.username = username;
    if (avatar_url) payload.avatar_url = avatar_url;
    if (embeds && embeds.length > 0) payload.embeds = embeds;

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (res.status === 204 || res.status === 200) {
      return NextResponse.json({ success: true, message: "Message sent successfully!" });
    }

    const errorData = await res.json().catch(() => ({}));
    return NextResponse.json(
      { error: errorData.message || `Discord API returned error code ${res.status}` },
      { status: res.status }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to deliver webhook: " + err.message },
      { status: 500 }
    );
  }
}
