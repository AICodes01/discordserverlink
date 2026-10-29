import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";
import slugify from "slugify";
import { estimateReadingTime, detectCategory, cleanPostContent } from "@/lib/blog";

// Helper to update blogData.json
function updateJsonFile(posts: any[]) {
  try {
    const filePath = path.join(process.cwd(), "lib", "blogData.json");
    fs.writeFileSync(filePath, JSON.stringify(posts, null, 2), "utf-8");
  } catch (err) {
    console.error("Could not write blogData.json:", err);
  }
}

function getJsonPosts(): any[] {
  try {
    const filePath = path.join(process.cwd(), "lib", "blogData.json");
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
  } catch (err) {}
  return [];
}

// GET /api/admin/blog - Return all posts
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (role !== "ADMIN" && role !== "MODERATOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Try DB first
    try {
      if (prisma && (prisma as any).blogPost) {
        const posts = await (prisma as any).blogPost.findMany({
          orderBy: { createdAt: "desc" },
        });
        if (posts && posts.length > 0) {
          return NextResponse.json({ posts });
        }
      }
    } catch (e) {}

    // Fallback to JSON
    const posts = getJsonPosts();
    return NextResponse.json({ posts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/admin/blog - Publish new article
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (role !== "ADMIN" && role !== "MODERATOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { title, slug, excerpt, content, featuredImage, category, author } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required." },
        { status: 400 }
      );
    }

    const finalSlug = slug
      ? slugify(slug, { lower: true, strict: true })
      : slugify(title, { lower: true, strict: true });

    const cleanedContent = cleanPostContent(content.trim());
    const finalCategory = category || detectCategory(finalSlug, title);
    const readingTime = estimateReadingTime(cleanedContent);
    const finalAuthor = author || session?.user?.name || "DiscordServerLink Team";
    const now = new Date().toISOString();

    const newPostData = {
      id: Date.now().toString(),
      slug: finalSlug,
      title: title.trim(),
      excerpt: (excerpt || cleanedContent.replace(/<[^>]+>/g, " ").slice(0, 160) + "...").trim(),
      content: cleanedContent,
      featuredImage: featuredImage?.trim() || "/og-image.png",
      category: finalCategory,
      author: finalAuthor,
      readingTime,
      date: now,
      modified: now,
      published: true,
    };

    // 1. Save to PostgreSQL if connected
    try {
      if (prisma && (prisma as any).blogPost) {
        await (prisma as any).blogPost.create({
          data: {
            slug: newPostData.slug,
            title: newPostData.title,
            excerpt: newPostData.excerpt,
            content: newPostData.content,
            featuredImage: newPostData.featuredImage,
            category: newPostData.category,
            author: newPostData.author,
            readingTime: newPostData.readingTime,
            published: true,
          },
        });
      }
    } catch (dbErr) {
      console.warn("DB save note:", dbErr);
    }

    // 2. Save to JSON file on disk
    const existing = getJsonPosts();
    // Prepend new post
    const updated = [newPostData, ...existing.filter((p) => p.slug !== finalSlug)];
    updateJsonFile(updated);

    // 3. Log audit action
    try {
      await prisma.auditLog.create({
        data: {
          userId: (session?.user as any)?.id || null,
          action: "CREATE_BLOG_POST",
          targetType: "BLOG",
          targetId: finalSlug,
          details: `Published article: "${title}"`,
        },
      });
    } catch {}

    return NextResponse.json({ success: true, post: newPostData });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
