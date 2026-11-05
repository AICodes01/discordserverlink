import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, shortcode, category, submitterName, submitterDiscord, imageData, imageExt } = body;

    if (!name || !shortcode || !imageData) {
      return NextResponse.json(
        { error: "Emoji name, shortcode, and image are required." },
        { status: 400 }
      );
    }

    // Prepare submissions directory
    const submissionsDir = path.join(process.cwd(), "public", "submissions", "emojis");
    if (!fs.existsSync(submissionsDir)) {
      fs.mkdirSync(submissionsDir, { recursive: true });
    }

    // Save submission record
    const submissionId = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const ext = (imageExt || "png").replace(/^\./, "").toLowerCase();
    const fileName = `${submissionId}.${ext}`;
    const filePath = path.join(submissionsDir, fileName);

    // Save base64 image data if provided
    if (imageData.startsWith("data:")) {
      const base64Data = imageData.split(",")[1];
      if (base64Data) {
        fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));
      }
    }

    const logPath = path.join(process.cwd(), "public", "submissions", "emojis_log.json");
    let log = [];
    if (fs.existsSync(logPath)) {
      try {
        log = JSON.parse(fs.readFileSync(logPath, "utf8"));
      } catch {
        log = [];
      }
    }

    const newEntry = {
      id: submissionId,
      name,
      shortcode,
      category: category || "memes",
      submitterName: submitterName || "Anonymous",
      submitterDiscord: submitterDiscord || "",
      imageUrl: `/submissions/emojis/${fileName}`,
      submittedAt: new Date().toISOString(),
      status: "pending_review",
    };

    log.unshift(newEntry);
    fs.writeFileSync(logPath, JSON.stringify(log, null, 2));

    return NextResponse.json({
      success: true,
      message: "Emoji submitted successfully! Our moderators will review it shortly.",
      submission: newEntry,
    });
  } catch (error: any) {
    console.error("Emoji submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit emoji. Please try again." },
      { status: 500 }
    );
  }
}
