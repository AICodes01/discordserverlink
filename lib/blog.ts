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

// Strip WordPress wrappers, Gutenberg blocks, and Table of Contents, keeping pure clean text and images
export function cleanPostContent(rawHtml: string): string {
  if (!rawHtml) return "";

  let html = rawHtml;

  // 1. Remove Gutenberg block comments
  html = html.replace(/<!--\s*\/?wp:[^>]*-->/gi, "");

  // 2. Remove entire Table of Contents (ez-toc or similar)
  html = html.replace(/<div[^>]*id=["']ez-toc-container["'][\s\S]*?<\/nav>\s*<\/div>/gi, "");
  html = html.replace(/<div[^>]*class=["'][^"']*ez-toc-container[^"']*["'][\s\S]*?<\/nav>\s*<\/div>/gi, "");
  html = html.replace(/<div[^>]*id=["']ez-toc-container["'][\s\S]*?<\/div>\s*<\/div>/gi, "");
  html = html.replace(/<span[^>]*class=["']ez-toc-section["'][^>]*><\/span>/gi, "");
  html = html.replace(/<span[^>]*class=["']ez-toc-section-end["'][^>]*><\/span>/gi, "");
  html = html.replace(/<nav[^>]*class=["'][^"']*ez-toc[^"']*["'][\s\S]*?<\/nav>/gi, "");

  // 3. Extract and normalize clean images
  html = html.replace(/<img[^>]+>/gi, (match) => {
    const srcMatch = match.match(/src=["']([^"']+)["']/i);
    const altMatch = match.match(/alt=["']([^"']*)["']/i);
    if (!srcMatch) return "";
    const src = srcMatch[1];
    const alt = altMatch ? altMatch[1].replace(/["']/g, "").trim() : "";
    return `<img src="${src}" alt="${alt}" loading="lazy" />`;
  });

  // 4. Unwrap wrappers: figure, div, span
  html = html.replace(/<\/?figure[^>]*>/gi, "");
  html = html.replace(/<\/?div[^>]*>/gi, "");
  html = html.replace(/<\/?span[^>]*>/gi, "");

  // 5. Strip all 'class', 'style', 'data-*', 'decoding', 'sizes', etc. from all tags
  html = html.replace(/<([a-z0-9]+)\b([^>]*)>/gi, (match, tag, attrs) => {
    const lowerTag = tag.toLowerCase();

    // Preserve clean img
    if (lowerTag === "img") {
      const srcMatch = attrs.match(/src=["']([^"']+)["']/i);
      const altMatch = attrs.match(/alt=["']([^"']*)["']/i);
      const src = srcMatch ? srcMatch[1] : "";
      const alt = altMatch ? altMatch[1].replace(/["']/g, "").trim() : "";
      return `<img src="${src}" alt="${alt}" loading="lazy" />`;
    }

    // Preserve clean a (hyperlinks)
    if (lowerTag === "a") {
      const hrefMatch = attrs.match(/href=["']([^"']+)["']/i);
      if (!hrefMatch) return "<a>";
      const href = hrefMatch[1];
      if (href.startsWith("#")) {
        return `<a href="${href}">`;
      }
      return `<a href="${href}" target="_blank" rel="noopener noreferrer">`;
    }

    // Pure semantic HTML for all other tags
    return `<${lowerTag}>`;
  });

  // 6. Clean empty tags
  html = html.replace(/<p>\s*<\/p>/gi, "");
  html = html.replace(/<p>&nbsp;<\/p>/gi, "");
  html = html.replace(/<p>\s*&nbsp;\s*<\/p>/gi, "");
  html = html.replace(/<h[1-6]>\s*<\/h[1-6]>/gi, "");

  // 7. Normalize multiple blank lines
  html = html.replace(/\n\s*\n\s*\n+/g, "\n\n").trim();

  return html;
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
      return parsed.map((p: any) => {
        const cleaned = cleanPostContent(p.content);
        return {
          ...p,
          content: cleaned,
          readingTime: p.readingTime || estimateReadingTime(cleaned),
          category: p.category || detectCategory(p.slug, p.title),
        };
      });
    }
  } catch (err) {}

  return (staticPosts as any[]).map((p) => {
    const cleaned = cleanPostContent(p.content);
    return {
      ...p,
      content: cleaned,
      readingTime: p.readingTime || estimateReadingTime(cleaned),
      category: p.category || detectCategory(p.slug, p.title),
    };
  });
}

export function getAllPostsSync(): BlogPost[] {
  return getStaticPosts().sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const staticList = getAllPostsSync();
  const postsMap = new Map<string, BlogPost>();

  // 1. Populate all static posts first (all 14 articles)
  for (const p of staticList) {
    postsMap.set(p.slug.toLowerCase(), p);
  }

  // 2. Overlay any database posts (including edits and admin posts)
  try {
    if (prisma && (prisma as any).blogPost) {
      const dbPosts = await (prisma as any).blogPost.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
      });

      if (dbPosts && dbPosts.length > 0) {
        for (const p of dbPosts) {
          const cleaned = cleanPostContent(p.content);
          postsMap.set(p.slug.toLowerCase(), {
            id: p.id,
            slug: p.slug,
            title: p.title,
            excerpt: p.excerpt,
            content: cleaned,
            date: p.createdAt.toISOString(),
            modified: p.updatedAt ? p.updatedAt.toISOString() : p.createdAt.toISOString(),
            featuredImage: p.featuredImage || "/og-image.png",
            author: p.author || "DiscordServerLink Team",
            readingTime: p.readingTime || estimateReadingTime(cleaned),
            category: p.category || detectCategory(p.slug, p.title),
            published: p.published,
          });
        }
      }
    }
  } catch (e) {
    // Database query failed or uninitialized, fallback to static JSON
  }

  return Array.from(postsMap.values()).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const cleanSlug = slug.toLowerCase().replace(/\/$/, "");

  try {
    if (prisma && (prisma as any).blogPost) {
      const dbPost = await (prisma as any).blogPost.findUnique({
        where: { slug: cleanSlug },
      });
      if (dbPost) {
        const cleaned = cleanPostContent(dbPost.content);
        return {
          id: dbPost.id,
          slug: dbPost.slug,
          title: dbPost.title,
          excerpt: dbPost.excerpt,
          content: cleaned,
          date: dbPost.createdAt.toISOString(),
          modified: dbPost.updatedAt ? dbPost.updatedAt.toISOString() : dbPost.createdAt.toISOString(),
          featuredImage: dbPost.featuredImage || "/og-image.png",
          author: dbPost.author || "DiscordServerLink Team",
          readingTime: dbPost.readingTime || estimateReadingTime(cleaned),
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
