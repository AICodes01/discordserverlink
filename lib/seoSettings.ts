import prisma from "@/lib/prisma";

export interface PageSeoConfig {
  key: string;
  path: string;
  label: string;
  group: "main" | "tools";
  defaultTitle: string;
  defaultDescription: string;
}

export const CONFIGURABLE_SEO_PAGES: PageSeoConfig[] = [
  // Core Directory Pages
  {
    key: "home",
    path: "/",
    label: "Homepage",
    group: "main",
    defaultTitle: "Discord Servers List (2026) - Find, Join & Promote Top Communities",
    defaultDescription:
      "Explore 31,000+ active Discord servers. Find gaming squads, anime hubs, coding groups, and chill voice chats. Join instantly or add your server for free on discordserverlink.com!",
  },
  {
    key: "servers",
    path: "/servers",
    label: "Servers Page",
    group: "main",
    defaultTitle: "Explore Discord Servers 2026 - Search & Browse Communities",
    defaultDescription:
      "Search and discover thousands of active Discord servers by topic, game, tags, and category on discordserverlink.com.",
  },
  {
    key: "categories",
    path: "/categories",
    label: "Categories Page",
    group: "main",
    defaultTitle: "All Discord Server Categories 2026",
    defaultDescription:
      "Browse Discord servers across Gaming, Anime, Technology, AI, Movies, eSports, Fitness, Memes, Podcasts, and more on discordserverlink.com.",
  },
  {
    key: "bots",
    path: "/bots",
    label: "Bots Page",
    group: "main",
    defaultTitle: "Best Discord Bots List 2026 - Top Discord Bots Directory",
    defaultDescription:
      "Explore the Best Discord Bots List 2026 to automate tasks on your server. Find pre-made bots for music, moderation, gaming, giveaways, verification, leveling, and AI chatbots.",
  },
  {
    key: "emojis",
    path: "/emojis",
    label: "Emojis Page",
    group: "main",
    defaultTitle: "Discord Emojis & Animated Stickers 2026 - Copy & Download",
    defaultDescription:
      "Browse thousands of Discord emojis and animated stickers for your server. Copy emoji names, download PNGs & GIFs, and enhance your server chat on discordserverlink.com.",
  },

  // Tools Hub & Particular Tools
  {
    key: "tools",
    path: "/tools",
    label: "Tools Hub",
    group: "tools",
    defaultTitle: "Free Discord Tools & Utilities 2026",
    defaultDescription:
      "Collection of free Discord tools: Discord PFP Viewer & Grabber, Discord Invite Link Inspector, Permissions Calculator, Snowflake to Timestamp ID Finder, Colored ANSI Text Formatter, Webhook Sender, and Fancy Fonts.",
  },
  {
    key: "tool_discord_pfp_viewer",
    path: "/tools/discord-pfp-viewer",
    label: "Tool: Discord PFP Viewer",
    group: "tools",
    defaultTitle: "Discord PFP Viewer & Avatar Grabber (HD/GIF) 2026",
    defaultDescription:
      "View and download any Discord user's avatar, server banner, and Nitro GIF in high resolution (1024x1024) using only their Discord User ID. 100% free and anonymous.",
  },
  {
    key: "tool_fancy_fonts",
    path: "/tools/fancy-fonts",
    label: "Tool: Fancy Fonts Generator",
    group: "tools",
    defaultTitle: "Discord Fancy Font Generator & Bio Text Decorator 2026",
    defaultDescription:
      "Generate cool, stylish fancy fonts, bold cursive symbols, and aesthetic text for your Discord username, server channels, nicknames, and role names with one-click copy.",
  },
  {
    key: "tool_invite_checker",
    path: "/tools/invite-checker",
    label: "Tool: Invite Checker",
    group: "tools",
    defaultTitle: "Discord Invite Link Checker & Guild Inspector 2026",
    defaultDescription:
      "Instantly inspect any Discord invite link or code. Check member counts, online users, server icon, banner, channel, and validity safely without joining.",
  },
  {
    key: "tool_markdown_color_text",
    path: "/tools/markdown-color-text",
    label: "Tool: Markdown Color Text",
    group: "tools",
    defaultTitle: "Discord Colored Text Generator (ANSI Markdown) 2026",
    defaultDescription:
      "Easily format colored Discord messages using ANSI code blocks. Highlight text in green, blue, cyan, red, yellow, and bold formatting with instant copyable codes.",
  },
  {
    key: "tool_permissions_calculator",
    path: "/tools/permissions-calculator",
    label: "Tool: Permissions Calculator",
    group: "tools",
    defaultTitle: "Discord Permissions Calculator (Bot & Role Bitwise) 2026",
    defaultDescription:
      "Interactive bitwise Discord permissions calculator for bot OAuth2 invite links and server roles. Select permissions and instantly compute integer values.",
  },
  {
    key: "tool_snowflake_timestamp",
    path: "/tools/snowflake-timestamp",
    label: "Tool: Snowflake Timestamp",
    group: "tools",
    defaultTitle: "Discord Snowflake to Timestamp Converter & ID Decoder 2026",
    defaultDescription:
      "Decode any Discord Snowflake ID into an exact creation timestamp, date, and age. Works for users, guilds, channels, roles, and message IDs.",
  },
  {
    key: "tool_webhook_sender",
    path: "/tools/webhook-sender",
    label: "Tool: Webhook Sender",
    group: "tools",
    defaultTitle: "Discord Webhook Sender & Rich Embed Builder 2026",
    defaultDescription:
      "Send test messages and build rich embedded Discord messages with custom usernames, avatars, embeds, color highlights, and links directly via Discord Webhooks.",
  },
];

export async function getPageSeo(
  pageKey: string
): Promise<{ title: string; description: string }> {
  const pageConfig = CONFIGURABLE_SEO_PAGES.find((p) => p.key === pageKey);
  const defaultTitle =
    pageConfig?.defaultTitle || "DiscordServerLink - Discover, Join & Promote Discord Servers";
  const defaultDescription =
    pageConfig?.defaultDescription ||
    "Explore top Discord servers directory. Find active communities for gaming, anime, coding, and chat on discordserverlink.com.";

  try {
    const [titleSetting, descSetting] = await Promise.all([
      prisma.siteSetting.findUnique({
        where: { key: `page_seo_${pageKey}_title` },
      }),
      prisma.siteSetting.findUnique({
        where: { key: `page_seo_${pageKey}_description` },
      }),
    ]);

    const title = titleSetting?.value?.trim() || defaultTitle;
    const description = descSetting?.value?.trim() || defaultDescription;

    return { title, description };
  } catch (error) {
    return { title: defaultTitle, description: defaultDescription };
  }
}

export type ChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export interface SitemapConfig {
  includeStatic: boolean;
  staticPriority: number;
  staticFreq: ChangeFrequency;

  includeServers: boolean;
  serversLimit: number;
  serversPriority: number;
  serversFreq: ChangeFrequency;

  includeCategories: boolean;
  categoriesPriority: number;
  categoriesFreq: ChangeFrequency;

  includeTags: boolean;
  tagsPriority: number;
  tagsFreq: ChangeFrequency;

  includeBots: boolean;
  botsPriority: number;
  botsFreq: ChangeFrequency;

  includeBlog: boolean;
  blogPriority: number;
  blogFreq: ChangeFrequency;

  includeTools: boolean;
  toolsPriority: number;
  toolsFreq: ChangeFrequency;

  customUrls: string[];
  excludedUrls: string[];
}

export async function getSitemapConfig(): Promise<SitemapConfig> {
  const defaults: SitemapConfig = {
    includeStatic: true,
    staticPriority: 0.9,
    staticFreq: "daily",

    includeServers: true,
    serversLimit: 5000,
    serversPriority: 0.85,
    serversFreq: "daily",

    includeCategories: true,
    categoriesPriority: 0.8,
    categoriesFreq: "daily",

    includeTags: true,
    tagsPriority: 0.75,
    tagsFreq: "weekly",

    includeBots: true,
    botsPriority: 0.8,
    botsFreq: "weekly",

    includeBlog: true,
    blogPriority: 0.75,
    blogFreq: "weekly",

    includeTools: true,
    toolsPriority: 0.8,
    toolsFreq: "weekly",

    customUrls: [],
    excludedUrls: ["/admin", "/login", "/taplu", "/api"],
  };

  try {
    const settings = await prisma.siteSetting.findMany({
      where: {
        key: {
          startsWith: "sitemap_",
        },
      },
    });

    const map = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    const parseBool = (val: string | undefined, def: boolean) =>
      val !== undefined ? val === "true" || val === "1" : def;
    const parseNum = (val: string | undefined, def: number) => {
      if (!val) return def;
      const n = parseFloat(val);
      return isNaN(n) ? def : n;
    };
    const parseFreq = (val: string | undefined, def: ChangeFrequency): ChangeFrequency => {
      const allowed: ChangeFrequency[] = [
        "always",
        "hourly",
        "daily",
        "weekly",
        "monthly",
        "yearly",
        "never",
      ];
      return allowed.includes(val as any) ? (val as ChangeFrequency) : def;
    };
    const parseLines = (val: string | undefined, def: string[]) => {
      if (!val) return def;
      return val
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
    };

    return {
      includeStatic: parseBool(map.sitemap_include_static, defaults.includeStatic),
      staticPriority: parseNum(map.sitemap_static_priority, defaults.staticPriority),
      staticFreq: parseFreq(map.sitemap_static_freq, defaults.staticFreq),

      includeServers: parseBool(map.sitemap_include_servers, defaults.includeServers),
      serversLimit: Math.max(10, Math.min(50000, Math.floor(parseNum(map.sitemap_servers_limit, defaults.serversLimit)))),
      serversPriority: parseNum(map.sitemap_servers_priority, defaults.serversPriority),
      serversFreq: parseFreq(map.sitemap_servers_freq, defaults.serversFreq),

      includeCategories: parseBool(map.sitemap_include_categories, defaults.includeCategories),
      categoriesPriority: parseNum(map.sitemap_categories_priority, defaults.categoriesPriority),
      categoriesFreq: parseFreq(map.sitemap_categories_freq, defaults.categoriesFreq),

      includeTags: parseBool(map.sitemap_include_tags, defaults.includeTags),
      tagsPriority: parseNum(map.sitemap_tags_priority, defaults.tagsPriority),
      tagsFreq: parseFreq(map.sitemap_tags_freq, defaults.tagsFreq),

      includeBots: parseBool(map.sitemap_include_bots, defaults.includeBots),
      botsPriority: parseNum(map.sitemap_bots_priority, defaults.botsPriority),
      botsFreq: parseFreq(map.sitemap_bots_freq, defaults.botsFreq),

      includeBlog: parseBool(map.sitemap_include_blog, defaults.includeBlog),
      blogPriority: parseNum(map.sitemap_blog_priority, defaults.blogPriority),
      blogFreq: parseFreq(map.sitemap_blog_freq, defaults.blogFreq),

      includeTools: parseBool(map.sitemap_include_tools, defaults.includeTools),
      toolsPriority: parseNum(map.sitemap_tools_priority, defaults.toolsPriority),
      toolsFreq: parseFreq(map.sitemap_tools_freq, defaults.toolsFreq),

      customUrls: parseLines(map.sitemap_custom_urls, defaults.customUrls),
      excludedUrls: parseLines(map.sitemap_excluded_urls, defaults.excludedUrls),
    };
  } catch (error) {
    return defaults;
  }
}
