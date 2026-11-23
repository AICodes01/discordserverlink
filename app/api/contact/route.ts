import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyTurnstileToken } from "@/lib/turnstile";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message, turnstileToken } = body;

    // Verify Cloudflare Turnstile token
    const clientIp =
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const turnstileCheck = await verifyTurnstileToken(turnstileToken, clientIp);
    if (!turnstileCheck.success) {
      return NextResponse.json(
        { error: "Cloudflare verification failed. Please complete the security check." },
        { status: 403 }
      );
    }

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields (name, email, subject, message) are required." },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (message.trim().length < 10) {
      return NextResponse.json(
        { error: "Message must be at least 10 characters long." },
        { status: 400 }
      );
    }

    // Attempt to log contact inquiry into AuditLog
    const msgId = "msg_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7);
    const newInquiry = {
      id: msgId,
      name: name.trim().slice(0, 100),
      email: email.trim().slice(0, 120),
      subject: subject.trim().slice(0, 150),
      message: message.trim().slice(0, 3000),
      status: "UNREAD",
      submittedAt: new Date().toISOString(),
    };

    try {
      await prisma.auditLog.create({
        data: {
          action: "CONTACT_FORM_SUBMISSION",
          targetType: "ContactMessage",
          targetId: msgId,
          details: JSON.stringify(newInquiry),
        },
      });
    } catch (err) {
      console.warn("[CONTACT_FORM] Fallback logging:", err, newInquiry);
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for reaching out! Our support team will review your inquiry and reply within 24-48 business hours.",
    });
  } catch (error: any) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again or email support@discordserverlink.com directly." },
      { status: 500 }
    );
  }
}
