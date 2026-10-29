import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";
import staticPosts from "./blogData.json";

export interface BlogPost {
  id: string | number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  modified?: string;
  featuredImage: string;
  author: string;
  link?: string;
  readingTime?: string;
  category?: string;
  published?: boolean;
}

// Compute reading time
export function estimateReadingTime(content: string): string {
  const words = (content || "").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 220));
  return `${minutes} min read`;
}

// Map tags/categories based on title/slug
export function detectCategory(slug: string, title: string): string {
  const lower = (slug + " " + title).toLowerCase();
  if (lower.includes("bot")) return "Bots & Tools";
  if (lower.includes("anime") || lower.includes("jujutsu")) return "Anime";
  if (
    lower.includes("fortnite") ||
    lower.includes("call of duty") ||
    lower.includes("among us") ||
    lower.includes("basketball") ||
    lower.includes("game")
  )
    return "Gaming";
  if (lower.includes("ai")) return "AI & Tech";
  if (
    lower.includes("checker") ||
    lower.includes("downloader") ||
    lower.includes("pfp") ||
    lower.includes("viewer")
  )
    return "Tools";
  if (lower.includes("advertising")) return "Growth";
  return "Discord Servers";
}

function getStaticPosts(): BlogPost[] {
  // Read dynamically from blogData.json to pick up live edits
  try {
    const filePath = path.join(process.cwd(), "lib", "blogData.json");
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(raw);
      return parsed.map((p: any) => ({
        ...p,
        readingTime: p.readingTime || estimateReadingTime(p.content),
        category: p.category || detectCategory(p.slug, p.title),
      }));
    }
  } catch (err) {}

  return (staticPosts as any[]).map((p) => ({
    ...p,
    readingTime: p.readingTime || estimateReadingTime(p.content),
    category: p.category || detectCategory(p.slug, p.title),
  }));
}

export function getAllPostsSync(): BlogPost[] {
  return getStaticPosts().sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    if (prisma && (prisma as any).blogPost) {
      const dbPosts = await (prisma as any).blogPost.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
      });

      if (dbPosts && dbPosts.length > 0) {
        return dbPosts.map((p: any) => ({
          id: p.id,
          slug: p.slug,
          title: p.title,
          excerpt: p.excerpt,
          content: p.content,
          date: p.createdAt.toISOString(),
          modified: p.updatedAt ? p.updatedAt.toISOString() : p.createdAt.toISOString(),
          featuredImage: p.featuredImage || "/og-image.png",
          author: p.author || "DiscordServerLink Team",
          readingTime: p.readingTime || estimateReadingTime(p.content),
          category: p.category || detectCategory(p.slug, p.title),
          published: p.published,
        }));
      }
    }
  } catch (e) {
    // Database query failed or uninitialized, fallback to static JSON
  }

  return getAllPostsSync();
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const cleanSlug = slug.toLowerCase().replace(/\/$/, "");

  try {
    if (prisma && (prisma as any).blogPost) {
      const dbPost = await (prisma as any).blogPost.findUnique({
        where: { slug: cleanSlug },
      });
      if (dbPost) {
        return {
          id: dbPost.id,
          slug: dbPost.slug,
          title: dbPost.title,
          excerpt: dbPost.excerpt,
          content: dbPost.content,
          date: dbPost.createdAt.toISOString(),
          modified: dbPost.updatedAt ? dbPost.updatedAt.toISOString() : dbPost.createdAt.toISOString(),
          featuredImage: dbPost.featuredImage || "/og-image.png",
          author: dbPost.author || "DiscordServerLink Team",
          readingTime: dbPost.readingTime || estimateReadingTime(dbPost.content),
          category: dbPost.category || detectCategory(dbPost.slug, dbPost.title),
          published: dbPost.published,
        };
      }
    }
  } catch (e) {}

  const all = getAllPostsSync();
  return all.find((p) => p.slug.toLowerCase() === cleanSlug);
}

export async function getRelatedPosts(currentSlug: string, limit = 3): Promise<BlogPost[]> {
  const current = await getPostBySlug(currentSlug);
  const all = await getAllPosts();

  return all
    .filter((p) => p.slug !== currentSlug)
    .sort((a, b) => {
      if (current && a.category === current.category && b.category !== current.category) return -1;
      if (current && b.category === current.category && a.category !== current.category) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, limit);
}
