import fs from "fs";
import path from "path";
import zlib from "zlib";

export interface FallbackServer {
  id: string;
  guildId?: string | null;
  name: string;
  slug: string;
  shortDescription: string;
  longDescription?: string;
  inviteUrl: string;
  inviteCode?: string | null;
  iconUrl?: string | null;
  bannerUrl?: string | null;
  memberCount: number;
  onlineCount: number;
  categorySlug: string;
  tags?: string;
  language?: string;
  isNsfw?: boolean;
  isFeatured?: boolean;
  isVerified?: boolean;
  isPartnered?: boolean;
  status: string;
  reviewReason?: string | null;
  bumpsCount: number;
  viewsCount: number;
  joinsCount: number;
  ownerId?: string;
  lastBumpedAt?: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface FallbackCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  displayOrder: number;
}

// Global cached state across requests in warm serverless lambdas
let cachedServers: FallbackServer[] | null = null;
let cachedSlugMap: Map<string, FallbackServer> | null = null;
let cachedCountMap: Record<string, number> | null = null;

// Total known server count in production database
export const TOTAL_SERVERS_COUNT = 31209;

// Default categories in the system
export const DEFAULT_CATEGORIES: FallbackCategory[] = [
  { id: "cm2vi22k90000m15l9w8u7x6y", name: "Gaming", slug: "gaming", description: "Esports, Minecraft, Roblox, FPS squads, and gaming clans.", icon: "Gamepad2", color: "#5865F2", displayOrder: 1 },
  { id: "cm2vi22k90001m15la1b2c3d4", name: "Anime & Manga", slug: "anime", description: "Anime discussions, fan art, cosplay, and seasonal simulcasts.", icon: "Sparkles", color: "#EB459E", displayOrder: 2 },
  { id: "cm2vi22k90002m15le5f6g7h8", name: "Technology & Coding", slug: "technology", description: "Software development, web dev, Python, AI, and hardware enthusiasts.", icon: "Code2", color: "#57F287", displayOrder: 3 },
  { id: "cm2vi22k90003m15li9j0k1l2", name: "Community & Hangout", slug: "community", description: "Social lounges, wholesome chill chats, meetups, and friendly hubs.", icon: "Users", color: "#FEE75C", displayOrder: 4 },
  { id: "cm2vi22k90004m15lm3n4o5p6", name: "Music & Audio", slug: "music", description: "Music production, beatmakers, musicians, album listening sessions, and artists.", icon: "Music", color: "#ED4245", displayOrder: 5 },
  { id: "cm2vi22k90005m15lq7r8s9t0", name: "Education & Science", slug: "education", description: "Study groups, academic research, STEM, language exchange, and tutor help.", icon: "GraduationCap", color: "#3BA55C", displayOrder: 6 },
  { id: "cm2vi22k90006m15lu1v2w3x4", name: "Crypto & Finance", slug: "finance", description: "Stock markets, personal finance, Bitcoin, DeFi trading, and investing talks.", icon: "Coins", color: "#F47B67", displayOrder: 7 },
  { id: "cm2vi22k90007m15ly5z6a7b8", name: "Art & Design", slug: "art", description: "Digital art, 3D modeling, graphic designers, UI/UX, and creative portfolio critiques.", icon: "Palette", color: "#FF73FA", displayOrder: 8 },
  { id: "cm2vi22k90008m15lc9d0e1f2", name: "Movies & Entertainment", slug: "movies-entertainment", description: "Cinema lovers, Netflix watch parties, television shows, and pop culture.", icon: "Film", color: "#FFA500", displayOrder: 9 },
  { id: "cm2vi22k90009m15lg3h4i5j6", name: "eSports & Tournaments", slug: "esports-tournaments", description: "Competitive scrims, leagues, leaderboards, and professional gaming tournaments.", icon: "Trophy", color: "#9B59B6", displayOrder: 10 },
  { id: "cm2vi22k90010m15lk7l8m9n0", name: "Artificial Inteligence", slug: "artificial-intelligence", description: "Generative AI, LLMs, ChatGPT, Midjourney, machine learning, and neural nets.", icon: "Bot", color: "#00C7B7", displayOrder: 11 },
  { id: "cm2vi22k90011m15lo1p2q3r4", name: "Sports & Fitness", slug: "sports-fitness", description: "Football, basketball, gym workouts, bodybuilding, and athletic fitness coaching.", icon: "Activity", color: "#1ABC9C", displayOrder: 12 },
  { id: "cm2vi22k90012m15ls5t6u7v8", name: "Movies & Television", slug: "movies-television", description: "TV shows, movie reviews, box office, streaming releases, and cinematography.", icon: "Tv", color: "#E67E22", displayOrder: 13 },
  { id: "cm2vi22k90013m15lw9x0y1z2", name: "Podcasts & Talk", slug: "podcasts-talk", description: "Live podcasts, talk shows, creator roundtables, and audio storytelling.", icon: "Mic", color: "#3498DB", displayOrder: 14 },
  { id: "cm2vi22k90014m15la3b4c5d6", name: "Memes & Humor", slug: "memes-humor", description: "Dank memes, comedy, shitposting, funny clips, and community laughs.", icon: "Smile", color: "#F1C40F", displayOrder: 15 },
];

/**
 * Locate the compressed 31k dataset across various Next.js serverless execution paths
 */
function findServersGzPath(): string | null {
  const candidates = [
    path.join(process.cwd(), "prisma", "servers-31k.json.gz"),
    path.join(process.cwd(), ".next", "server", "prisma", "servers-31k.json.gz"),
    path.resolve("./prisma/servers-31k.json.gz"),
    path.join(__dirname, "..", "..", "prisma", "servers-31k.json.gz"),
    path.join(__dirname, "..", "prisma", "servers-31k.json.gz"),
    path.join(__dirname, "prisma", "servers-31k.json.gz"),
  ];

  for (const c of candidates) {
    try {
      if (fs.existsSync(c)) {
        return c;
      }
    } catch {
      // continue checking
    }
  }
  return null;
}

/**
 * Retrieve all 31,209 servers with lazy loading and memory caching
 */
export function getAllFallbackServers(): FallbackServer[] {
  if (cachedServers && cachedServers.length > 0) {
    return cachedServers;
  }

  // 1. Try reading the gzipped 31k servers archive
  const gzPath = findServersGzPath();
  if (gzPath) {
    try {
      const gzBuffer = fs.readFileSync(gzPath);
      const jsonStr = zlib.gunzipSync(gzBuffer).toString("utf-8");
      const list: FallbackServer[] = JSON.parse(jsonStr);

      if (Array.isArray(list) && list.length > 0) {
        cachedServers = list;
        buildLookupCaches(list);
        return cachedServers;
      }
    } catch (gzErr) {
      console.warn("Failed to decompress servers-31k.json.gz:", gzErr);
    }
  }

  // 2. Secondary fallback: seed-data.json if available
  try {
    const seedPath = path.join(process.cwd(), "prisma", "seed-data.json");
    if (fs.existsSync(seedPath)) {
      const seedData = JSON.parse(fs.readFileSync(seedPath, "utf-8"));
      if (Array.isArray(seedData.servers) && seedData.servers.length > 0) {
        cachedServers = seedData.servers as FallbackServer[];
        buildLookupCaches(seedData.servers);
        return cachedServers;
      }
    }
  } catch (seedErr) {
    console.warn("Failed to load seed-data.json fallback:", seedErr);
  }

  return [];
}

/**
 * Prebuild in-memory Map lookup and category count map for sub-millisecond queries
 */
function buildLookupCaches(servers: FallbackServer[]) {
  const slugMap = new Map<string, FallbackServer>();
  const countMap: Record<string, number> = {};

  for (let i = 0; i < servers.length; i++) {
    const s = servers[i];
    if (s.slug) {
      slugMap.set(s.slug.toLowerCase(), s);
    }
    if (s.id) {
      slugMap.set(s.id, s);
    }
    if (s.categorySlug) {
      countMap[s.categorySlug] = (countMap[s.categorySlug] || 0) + 1;
    }
  }

  cachedSlugMap = slugMap;
  cachedCountMap = countMap;
}

/**
 * Find single server by slug or ID
 */
export function findFallbackServer(slugOrId: string): FallbackServer | null {
  if (!slugOrId) return null;
  getAllFallbackServers(); // ensure cache is primed

  if (cachedSlugMap) {
    const found = cachedSlugMap.get(slugOrId.toLowerCase()) || cachedSlugMap.get(slugOrId);
    if (found) return found;
  }

  const all = getAllFallbackServers();
  return all.find((s) => s.slug === slugOrId || s.id === slugOrId) || null;
}

/**
 * Get category server count map
 */
export function getFallbackCategoryCounts(): Record<string, number> {
  if (cachedCountMap) {
    return cachedCountMap;
  }
  getAllFallbackServers();
  if (cachedCountMap) {
    return cachedCountMap;
  }
  // Hardcoded verified breakdown of the 31,209 servers if archive is not yet loaded
  return {
    education: 8083,
    gaming: 7509,
    anime: 5340,
    "artificial-intelligence": 2360,
    technology: 2201,
    "esports-tournaments": 1219,
    finance: 1086,
    art: 816,
    "memes-humor": 735,
    music: 635,
    community: 539,
    "sports-fitness": 322,
    "movies-television": 192,
    "podcasts-talk": 130,
    "movies-entertainment": 42,
  };
}

/**
 * Query, filter, sort, and paginate fallback servers
 */
export interface QueryServersOptions {
  query?: string;
  category?: string;
  tag?: string;
  sort?: string;
  skip?: number;
  limit?: number;
}

export function queryFallbackServers(options: QueryServersOptions = {}) {
  const all = getAllFallbackServers();
  const { query = "", category = "", tag = "", sort = "bumped", skip = 0, limit = 24 } = options;

  let list = all;

  if (category) {
    const catLower = category.toLowerCase();
    list = list.filter((s) => s.categorySlug?.toLowerCase() === catLower);
  }

  if (tag) {
    const tagLower = tag.toLowerCase();
    list = list.filter((s) => s.tags?.toLowerCase().includes(tagLower));
  }

  if (query) {
    const qLower = query.toLowerCase();
    list = list.filter(
      (s) =>
        s.name?.toLowerCase().includes(qLower) ||
        s.shortDescription?.toLowerCase().includes(qLower) ||
        s.tags?.toLowerCase().includes(qLower)
    );
  }

  // Sorting
  if (sort === "members") {
    list = [...list].sort((a, b) => (b.memberCount || 0) - (a.memberCount || 0));
  } else if (sort === "newest") {
    list = [...list].sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  } else if (sort === "popular") {
    list = [...list].sort((a, b) => (b.joinsCount || 0) - (a.joinsCount || 0));
  } else if (sort === "bumps") {
    list = [...list].sort((a, b) => (b.bumpsCount || 0) - (a.bumpsCount || 0));
  }

  const totalCount = list.length;
  const servers = list.slice(skip, skip + limit);

  return {
    servers,
    totalCount,
    allServersCount: all.length || TOTAL_SERVERS_COUNT,
  };
}
