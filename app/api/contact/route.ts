import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

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

    // Attempt to log contact inquiry into AuditLog or console
    try {
      await prisma.auditLog.create({
        data: {
          action: "CONTACT_FORM_SUBMISSION",
          details: JSON.stringify({
            name: name.trim().slice(0, 100),
            email: email.trim().slice(0, 120),
            subject: subject.trim().slice(0, 150),
            message: message.trim().slice(0, 2000),
            submittedAt: new Date().toISOString(),
          }),
        },
      });
    } catch {
      // In case AuditLog table has specific schema or offline, proceed gracefully
      console.log("[CONTACT_FORM]", { name, email, subject, message });
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
