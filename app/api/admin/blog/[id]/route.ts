import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";
import slugify from "slugify";
import { estimateReadingTime, detectCategory } from "@/lib/blog";

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

// PUT /api/admin/blog/[id] - Edit existing article
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (role !== "ADMIN" && role !== "MODERATOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = params;
    const body = await req.json();
    const { title, slug, excerpt, content, featuredImage, category, author, published } = body;

    const existingPosts = getJsonPosts();
    const postIndex = existingPosts.findIndex(
      (p) => String(p.id) === String(id) || p.slug === id
    );

    if (postIndex === -1) {
      return NextResponse.json({ error: "Article not found." }, { status: 404 });
    }

    const current = existingPosts[postIndex];
    const finalSlug = slug
      ? slugify(slug, { lower: true, strict: true })
      : current.slug;
    const finalCategory = category || current.category || detectCategory(finalSlug, title || current.title);
    const finalReadingTime = content ? estimateReadingTime(content) : current.readingTime;

    const updatedPost = {
      ...current,
      title: title !== undefined ? title.trim() : current.title,
      slug: finalSlug,
      excerpt: excerpt !== undefined ? excerpt.trim() : current.excerpt,
      content: content !== undefined ? content.trim() : current.content,
      featuredImage: featuredImage !== undefined ? featuredImage.trim() : current.featuredImage,
      category: finalCategory,
      author: author !== undefined ? author.trim() : current.author,
      readingTime: finalReadingTime,
      modified: new Date().toISOString(),
      published: published !== undefined ? published : (current.published ?? true),
    };

    // 1. Update in database
    try {
      if (prisma && (prisma as any).blogPost) {
        await (prisma as any).blogPost.upsert({
          where: { slug: current.slug },
          update: {
            title: updatedPost.title,
            slug: updatedPost.slug,
            excerpt: updatedPost.excerpt,
            content: updatedPost.content,
            featuredImage: updatedPost.featuredImage,
            category: updatedPost.category,
            author: updatedPost.author,
            readingTime: updatedPost.readingTime,
            published: updatedPost.published,
          },
          create: {
            title: updatedPost.title,
            slug: updatedPost.slug,
            excerpt: updatedPost.excerpt,
            content: updatedPost.content,
            featuredImage: updatedPost.featuredImage,
            category: updatedPost.category,
            author: updatedPost.author,
            readingTime: updatedPost.readingTime,
            published: updatedPost.published,
          },
        });
      }
    } catch (e) {}

    // 2. Update in JSON file
    existingPosts[postIndex] = updatedPost;
    updateJsonFile(existingPosts);

    // 3. Log audit action
    try {
      await prisma.auditLog.create({
        data: {
          userId: (session?.user as any)?.id || null,
          action: "UPDATE_BLOG_POST",
          targetType: "BLOG",
          targetId: updatedPost.slug,
          details: `Updated article: "${updatedPost.title}"`,
        },
      });
    } catch {}

    return NextResponse.json({ success: true, post: updatedPost });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/admin/blog/[id] - Delete an article
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Only admins can delete articles." }, { status: 403 });
    }

    const { id } = params;
    const existingPosts = getJsonPosts();
    const postToDelete = existingPosts.find(
      (p) => String(p.id) === String(id) || p.slug === id
    );

    if (!postToDelete) {
      return NextResponse.json({ error: "Article not found." }, { status: 404 });
    }

    // 1. Delete from database
    try {
      if (prisma && (prisma as any).blogPost) {
        await (prisma as any).blogPost.delete({
          where: { slug: postToDelete.slug },
        });
      }
    } catch (e) {}

    // 2. Delete from JSON file
    const filtered = existingPosts.filter(
      (p) => String(p.id) !== String(id) && p.slug !== id
    );
    updateJsonFile(filtered);

    // 3. Log audit action
    try {
      await prisma.auditLog.create({
        data: {
          userId: (session?.user as any)?.id || null,
          action: "DELETE_BLOG_POST",
          targetType: "BLOG",
          targetId: postToDelete.slug,
          details: `Deleted article: "${postToDelete.title}"`,
        },
      });
    } catch {}

    return NextResponse.json({ success: true, message: "Article deleted successfully." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
