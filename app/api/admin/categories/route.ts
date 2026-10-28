import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import slugify from "slugify";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { displayOrder: "asc" },
    });
    return NextResponse.json({ categories });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { name, icon, description, seoTitle, seoDescription } = await req.json();

    if (!name || !description) {
      return NextResponse.json({ error: "Name and description required" }, { status: 400 });
    }

    const slug = slugify(name, { lower: true, strict: true });

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        icon: icon || "Compass",
        description,
        seoTitle: seoTitle || `${name} Discord Servers | DiscordServerLink`,
        seoDescription: seoDescription || description,
      },
    });

    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
