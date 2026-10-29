import postsData from "./blogData.json";

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  modified: string;
  featuredImage: string;
  author: string;
  link: string;
  readingTime?: string;
  category?: string;
}

// Compute reading time
function estimateReadingTime(content: string): string {
  const words = content.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 220));
  return `${minutes} min read`;
}

// Map tags/categories based on title/slug
function detectCategory(slug: string, title: string): string {
  const lower = (slug + " " + title).toLowerCase();
  if (lower.includes("bot")) return "Bots & Tools";
  if (lower.includes("anime") || lower.includes("jujutsu")) return "Anime";
  if (lower.includes("fortnite") || lower.includes("call of duty") || lower.includes("among us") || lower.includes("basketball") || lower.includes("game")) return "Gaming";
  if (lower.includes("ai")) return "AI & Tech";
  if (lower.includes("checker") || lower.includes("downloader") || lower.includes("pfp") || lower.includes("viewer")) return "Tools";
  if (lower.includes("advertising")) return "Growth";
  return "Discord Servers";
}

const enrichedPosts: BlogPost[] = (postsData as any[]).map((p) => ({
  ...p,
  readingTime: estimateReadingTime(p.content),
  category: detectCategory(p.slug, p.title),
}));

export function getAllPosts(): BlogPost[] {
  return enrichedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  const cleanSlug = slug.toLowerCase().replace(/\/$/, "");
  return enrichedPosts.find((p) => p.slug.toLowerCase() === cleanSlug);
}

export function getRelatedPosts(currentSlug: string, limit = 3): BlogPost[] {
  const current = getPostBySlug(currentSlug);
  return enrichedPosts
    .filter((p) => p.slug !== currentSlug)
    .sort((a, b) => {
      // Prioritize same category
      if (current && a.category === current.category && b.category !== current.category) return -1;
      if (current && b.category === current.category && a.category !== current.category) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, limit);
}
