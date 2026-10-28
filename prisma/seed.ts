import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database for DiscordServerLink.com...");

  // Clean old records
  await prisma.review.deleteMany();
  await prisma.bump.deleteMany();
  await prisma.server.deleteMany();
  await prisma.category.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const adminPasswordHash = await bcrypt.hash("J6H!nnQ#8", 10);
  const adminUser = await prisma.user.create({
    data: {
      name: "Chief Admin",
      email: "admin@discordserverlink.com",
      password: adminPasswordHash,
      role: "ADMIN",
      username: "ServerLinkAdmin",
      discriminator: "0001",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
  });

  const moderatorUser = await prisma.user.create({
    data: {
      name: "Community Mod",
      email: "mod@discordserverlink.com",
      password: adminPasswordHash,
      role: "MODERATOR",
      username: "LinkModerator",
      discriminator: "1337",
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    },
  });

  const demoUser = await prisma.user.create({
    data: {
      name: "NeonGamer",
      email: "gamer@discordserverlink.com",
      role: "USER",
      username: "NeonViper",
      discriminator: "4200",
      image: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
    },
  });

  // Create Categories
  const categoriesData = [
    {
      name: "Gaming",
      slug: "gaming",
      icon: "Gamepad2",
      description: "Discover the best gaming Discord servers, esports squads, LFG hubs, and gaming communities worldwide.",
      seoTitle: "Top Gaming Discord Servers 2026 | DiscordServerLink",
      seoDescription: "Browse thousands of active gaming Discord servers. Find teammates for Minecraft, Valorant, GTA, Roblox, Apex Legends, and more.",
      displayOrder: 1,
    },
    {
      name: "Anime & Manga",
      slug: "anime",
      icon: "Flame",
      description: "Connect with fellow anime lovers, manga readers, artists, and cosplayers in active community servers.",
      seoTitle: "Best Anime & Manga Discord Servers | DiscordServerLink",
      seoDescription: "Join popular anime Discord servers. Discuss new releases, read manga, share fan art, and participate in anime watch parties.",
      displayOrder: 2,
    },
    {
      name: "Technology & Coding",
      slug: "technology",
      icon: "Code2",
      description: "Join tech enthusiasts, software developers, AI engineers, and hardware builders sharing knowledge and code.",
      seoTitle: "Technology, Programming & AI Discord Servers | DiscordServerLink",
      seoDescription: "Find developer communities for Python, JavaScript, Web3, AI/LLMs, Rust, and systems engineering. Get coding help and collaborate.",
      displayOrder: 3,
    },
    {
      name: "Community & Hangout",
      slug: "community",
      icon: "Users",
      description: "Friendly spaces to chat, make friends, listen to music, play casual games, and hang out in voice channels.",
      seoTitle: "Chill Hangout & Social Discord Servers | DiscordServerLink",
      seoDescription: "Find welcoming hangout servers to make new friends, vibe in voice calls, share memes, and chat about everyday life.",
      displayOrder: 4,
    },
    {
      name: "Music & Audio",
      slug: "music",
      icon: "Headphones",
      description: "Servers for musicians, beatmakers, producers, audio engineers, and avid music listeners across all genres.",
      seoTitle: "Music Production & Listener Discord Servers | DiscordServerLink",
      seoDescription: "Join music Discord communities. Share beats, collaborate on tracks, get mixing feedback, and listen to tunes together.",
      displayOrder: 5,
    },
    {
      name: "Education & Science",
      slug: "education",
      icon: "GraduationCap",
      description: "Study rooms, academic help, language exchange, science discussions, and learning circles.",
      seoTitle: "Education, Study & Science Discord Servers | DiscordServerLink",
      seoDescription: "Find study group Discord servers, 24/7 focus rooms, homework assistance, language exchange partners, and STEM hubs.",
      displayOrder: 6,
    },
    {
      name: "Crypto & Finance",
      slug: "finance",
      icon: "TrendingUp",
      description: "Markets discussion, stocks analysis, cryptocurrency insights, and entrepreneurship networks.",
      seoTitle: "Crypto, Stocks & Finance Discord Servers | DiscordServerLink",
      seoDescription: "Explore financial Discord servers for market news, technical analysis, crypto discussion, personal finance, and trading.",
      displayOrder: 7,
    },
    {
      name: "Art & Design",
      slug: "art",
      icon: "Palette",
      description: "Showcase digital art, 3D modeling, UI/UX, animation, graphic design, and receive constructive critiques.",
      seoTitle: "Art, Illustration & Graphic Design Discord Servers | DiscordServerLink",
      seoDescription: "Connect with digital artists, illustrators, 3D artists, and UI designers. Share portfolios and participate in art challenges.",
      displayOrder: 8,
    },
  ];

  for (const cat of categoriesData) {
    await prisma.category.create({ data: cat });
  }

  // Create Tags
  const tagsData = [
    { name: "Minecraft", slug: "minecraft", description: "Servers dedicated to Minecraft SMP, PvP, mods, and building" },
    { name: "Roblox", slug: "roblox", description: "Roblox developers, trading, games, and community servers" },
    { name: "Valorant", slug: "valorant", description: "Competitive Valorant squads, scrims, LFG, and coaching" },
    { name: "Programming", slug: "programming", description: "Software development, code reviews, and programming help" },
    { name: "Chill", slug: "chill", description: "Relaxed atmosphere, friendly members, non-toxic vibes" },
    { name: "AI & Machine Learning", slug: "ai", description: "Generative AI, machine learning, prompt engineering, and models" },
    { name: "Anime", slug: "anime", description: "Anime discussions, fan art, watch parties, and emotes" },
    { name: "Voice Chat", slug: "voice-chat", description: "Active voice channels 24/7 for talking and gaming" },
    { name: "Roleplay", slug: "roleplay", description: "Text and voice roleplaying communities" },
    { name: "Giveaways", slug: "giveaways", description: "Servers with regular Nitro, game keys, and prize giveaways" },
  ];

  for (const t of tagsData) {
    await prisma.tag.create({ data: t });
  }

  // Seed Rich Discord Servers
  const serversData = [
    {
      name: "Aetheria Gaming & Esports",
      slug: "aetheria-gaming",
      guildId: "109823487654321001",
      shortDescription: "The premier multi-gaming hub with 24/7 active voice chats, weekly tournaments, custom Minecraft SMP, and LFG for all games.",
      longDescription: `## Welcome to Aetheria Gaming! 🎮
We are one of the most welcoming and active gaming communities on Discord. Whether you're a competitive esports warrior or looking for chill teammates after work, you'll find a home here.

### What We Offer:
- **Active LFG Channels:** Instantly find duos and full squads for Valorant, Apex Legends, Overwatch 2, League of Legends, and CS2.
- **Custom Minecraft SMP:** Whitelisted 1.21+ survival multiplayer server with custom biomes, economy, and friendly grief protection.
- **Weekly Cash Tournaments:** Free-to-enter community cups with Discord Nitro and cash prize pools.
- **Level 3 Boost Perks:** 500+ custom emojis, animated stickers, and 384kbps high-fidelity voice channels.
- **Friendly & Moderated:** Strict zero-tolerance policy against toxic behavior, hate speech, and harassment.

Join today and become part of our growing family!`,
      inviteUrl: "https://discord.gg/gaming",
      inviteCode: "gaming",
      iconUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80",
      memberCount: 84320,
      onlineCount: 19450,
      categorySlug: "gaming",
      tags: "gaming,minecraft,valorant,voice-chat,chill",
      language: "en",
      isFeatured: true,
      isVerified: true,
      isPartnered: true,
      status: "APPROVED",
      bumpsCount: 412,
      lastBumpedAt: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
      viewsCount: 34200,
      joinsCount: 8950,
      ownerId: adminUser.id,
    },
    {
      name: "Developers Hub & Code Lab",
      slug: "developers-hub",
      guildId: "109823487654321002",
      shortDescription: "A worldwide community of 50,000+ developers, software engineers, and learners. Live code reviews, tech talks, and open-source projects.",
      longDescription: `## The Ultimate Tech & Developer Discord 🚀
Welcome to Developers Hub! Whether you are writing your first line of Python or architecting distributed systems at scale, this is your creative space.

### Channels & Topics:
- **Frontend & Fullstack:** React, Next.js, Vue, Svelte, Tailwind CSS, TypeScript.
- **Backend & Cloud:** Node.js, Go, Rust, Python, Docker, Kubernetes, AWS & GCP.
- **Artificial Intelligence:** Prompt engineering, PyTorch, LangChain, local LLM deployment.
- **Career & Interview Prep:** Resume reviews, mock coding challenges, and job board with remote tech roles.
- **Code Review & Debugging:** Get fast answers to your programming roadblocks from verified senior engineers.

Hop in and code with us!`,
      inviteUrl: "https://discord.gg/devs",
      inviteCode: "devs",
      iconUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&auto=format&fit=crop&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80",
      memberCount: 52190,
      onlineCount: 11840,
      categorySlug: "technology",
      tags: "programming,ai,technology",
      language: "en",
      isFeatured: true,
      isVerified: true,
      isPartnered: true,
      status: "APPROVED",
      bumpsCount: 380,
      lastBumpedAt: new Date(Date.now() - 1000 * 60 * 35), // 35 mins ago
      viewsCount: 28900,
      joinsCount: 6410,
      ownerId: adminUser.id,
    },
    {
      name: "Sakura Lounge Anime & Chill",
      slug: "sakura-lounge",
      guildId: "109823487654321003",
      shortDescription: "Cozy aesthetic anime community. Weekly anime stream nights, manga discussions, 300+ custom cute emojis, and soundboards.",
      longDescription: `## Welcome to Sakura Lounge 🌸
A cozy, aesthetic sanctuary for anime fans, gamers, and chill souls.

### Features:
- 🌸 **Anime Watch Parties:** Stream the latest seasonal episodes every Friday and Saturday evening!
- 🎨 **Art Gallery & Critique:** Dedicated channels for traditional and digital artists.
- 💬 **Active Friendly Chat:** Relaxed conversation with zero toxicity.
- 🎁 **Monthly Nitro Giveaways:** Free Discord Nitro raffles for active chatters.
- 🍣 **Custom Bot Mini-Games:** Mudae, Karuta, and custom leveling roles with colorful rewards.

Come say hi in general chat!`,
      inviteUrl: "https://discord.gg/sakura",
      inviteCode: "sakura",
      iconUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200&auto=format&fit=crop&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80",
      memberCount: 67400,
      onlineCount: 15320,
      categorySlug: "anime",
      tags: "anime,chill,giveaways,voice-chat",
      language: "en",
      isFeatured: true,
      isVerified: true,
      isPartnered: false,
      status: "APPROVED",
      bumpsCount: 295,
      lastBumpedAt: new Date(Date.now() - 1000 * 60 * 50),
      viewsCount: 22100,
      joinsCount: 5120,
      ownerId: moderatorUser.id,
    },
    {
      name: "CyberRealm 2077 Roleplay",
      slug: "cyberrealm-roleplay",
      guildId: "109823487654321004",
      shortDescription: "Immersive dystopian cyberpunk text RP server. Deep lore, interactive faction warfare, custom economy bots, and character progression.",
      longDescription: `## Enter the Underbelly of New Kyoto ⚡
CyberRealm is a detailed narrative-driven text roleplay server set in 2088.

### Lore & Systems:
- **Faction Control:** Join MegaCorps, Syndicate syndicates, or street rebel factions fighting for district influence.
- **Dynamic Economy:** Earn creds through contracts, cyberware upgrades, and black-market trade.
- **Literate to Semi-Lit:** Welcoming writers of all styles with helpful writing assistants and lore masters.`,
      inviteUrl: "https://discord.gg/cyberrp",
      inviteCode: "cyberrp",
      iconUrl: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=200&auto=format&fit=crop&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80",
      memberCount: 14200,
      onlineCount: 3100,
      categorySlug: "community",
      tags: "roleplay,chill",
      language: "en",
      isFeatured: false,
      isVerified: true,
      isPartnered: false,
      status: "APPROVED",
      bumpsCount: 142,
      lastBumpedAt: new Date(Date.now() - 1000 * 60 * 75),
      viewsCount: 9400,
      joinsCount: 2180,
      ownerId: demoUser.id,
    },
    {
      name: "Lo-Fi Beats & Music Producers Hub",
      slug: "lofi-music-producers",
      guildId: "109823487654321005",
      shortDescription: "Collaborative music producer server. FL Studio, Ableton, Logic Pro sharing, sample packs, feedback exchanges, and 24/7 radio.",
      longDescription: `## Make Beats, Level Up Your Mixes, and Collaborate 🎧
The home for music creators, beatmakers, songwriters, and audio enthusiasts.

- Daily track feedback rounds
- Royalty-free sample swaps & preset trading
- Monthly beat battles with studio plugin prizes
- 24/7 Lo-Fi listening voice rooms for deep work and studying`,
      inviteUrl: "https://discord.gg/beats",
      inviteCode: "beats",
      iconUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&auto=format&fit=crop&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80",
      memberCount: 38400,
      onlineCount: 8200,
      categorySlug: "music",
      tags: "voice-chat,chill",
      language: "en",
      isFeatured: false,
      isVerified: true,
      isPartnered: false,
      status: "APPROVED",
      bumpsCount: 188,
      lastBumpedAt: new Date(Date.now() - 1000 * 60 * 95),
      viewsCount: 15300,
      joinsCount: 3750,
      ownerId: moderatorUser.id,
    },
    {
      name: "Study With Me & Focus Academy",
      slug: "study-focus-academy",
      guildId: "109823487654321006",
      shortDescription: "Productivity & virtual study rooms with Pomodoro timers, cam-on study sessions, accountability partners, and college prep.",
      longDescription: `## Achieve Your Academic & Life Goals Together 📚
Struggling to stay focused? Join 45,000 students and professionals holding each other accountable.

- 🍅 Automated Pomodoro voice channels (25/5 and 50/10)
- 📹 Cam/Screen share focus rooms
- 🏆 Daily study leaderboard and productivity streaks
- 🔬 Dedicated STEM, Medicine, Law, and Language channels`,
      inviteUrl: "https://discord.gg/study",
      inviteCode: "study",
      iconUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&auto=format&fit=crop&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&auto=format&fit=crop&q=80",
      memberCount: 46100,
      onlineCount: 10500,
      categorySlug: "education",
      tags: "voice-chat,chill",
      language: "en",
      isFeatured: false,
      isVerified: true,
      isPartnered: true,
      status: "APPROVED",
      bumpsCount: 215,
      lastBumpedAt: new Date(Date.now() - 1000 * 60 * 120),
      viewsCount: 19800,
      joinsCount: 4420,
      ownerId: adminUser.id,
    },
    {
      name: "VoxelVerse Minecraft Network",
      slug: "voxelverse-minecraft",
      guildId: "109823487654321007",
      shortDescription: "Top rated crossplay Minecraft server (Java & Bedrock). Custom Survival SMP, Skyblock, Bedwars, and friendly non-toxic player base.",
      longDescription: `## Play on VoxelVerse Minecraft! ⛏️
Join thousands of active miners and builders on our custom high-tickrate servers.

- 🌐 Full Java & Bedrock Crossplay support
- 🏰 Custom dungeons, MMO leveling system, and player economy
- 🛡️ Land claims so your builds are 100% safe from griefers
- 🎁 Daily rewards, seasonal events, and rank giveaways!`,
      inviteUrl: "https://discord.gg/minecraft",
      inviteCode: "minecraft",
      iconUrl: "https://images.unsplash.com/photo-1587573089734-09cb69c0f2b4?w=200&auto=format&fit=crop&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=1200&auto=format&fit=crop&q=80",
      memberCount: 98500,
      onlineCount: 24100,
      categorySlug: "gaming",
      tags: "minecraft,gaming,giveaways",
      language: "en",
      isFeatured: true,
      isVerified: true,
      isPartnered: true,
      status: "APPROVED",
      bumpsCount: 512,
      lastBumpedAt: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago!
      viewsCount: 48900,
      joinsCount: 14200,
      ownerId: demoUser.id,
    },
    {
      name: "Alpha Trade & Financial Markets",
      slug: "alpha-trade-finance",
      guildId: "109823487654321008",
      shortDescription: "Daily stock market watchlist, options analysis, macro economics breakdown, and crypto insights by certified financial analysts.",
      longDescription: `## Master the Markets with Clear Signals & Education 📈
Alpha Trade brings together traders, investors, and analysts.

- 📊 Pre-market briefings every Monday through Friday
- 💡 Deep-dive fundamental research and earnings calendars
- 📉 Technical analysis workshops & live charting streams
- 🔒 Disclaimer: Educational community, not financial advice.`,
      inviteUrl: "https://discord.gg/markets",
      inviteCode: "markets",
      iconUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=200&auto=format&fit=crop&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=1200&auto=format&fit=crop&q=80",
      memberCount: 31200,
      onlineCount: 7100,
      categorySlug: "finance",
      tags: "chill",
      language: "en",
      isFeatured: false,
      isVerified: false,
      isPartnered: false,
      status: "APPROVED",
      bumpsCount: 98,
      lastBumpedAt: new Date(Date.now() - 1000 * 60 * 180),
      viewsCount: 11200,
      joinsCount: 2650,
      ownerId: adminUser.id,
    },
  ];

  for (const s of serversData) {
    const createdServer = await prisma.server.create({ data: s });

    // Seed some reviews
    await prisma.review.create({
      data: {
        serverId: createdServer.id,
        userId: demoUser.id,
        rating: 5,
        content: `Amazing community! Active moderators, super friendly members, and always something fun happening. Easily 5 stars.`,
        status: "APPROVED",
      },
    });

    // Seed bump record
    await prisma.bump.create({
      data: {
        serverId: createdServer.id,
        userId: adminUser.id,
        createdAt: s.lastBumpedAt,
      },
    });
  }

  // Site Settings
  const settings = [
    { key: "site_name", value: "DiscordServerLink", description: "Brand name of the website" },
    { key: "site_domain", value: "discordserverlink.com", description: "Primary domain name" },
    { key: "site_tagline", value: "Find & Join the Best Discord Servers in the World", description: "Hero tagline" },
    { key: "bump_cooldown_hours", value: "2", description: "Hours required between server bumps" },
    { key: "require_server_approval", value: "false", description: "Whether new submissions require manual admin approval" },
    { key: "announcement_banner_enabled", value: "true", description: "Toggle homepage announcement bar" },
    { key: "announcement_text", value: "🚀 Welcome to discordserverlink.com! List your Discord server today to gain instant real members.", description: "Announcement bar copy" },
    { key: "announcement_link", value: "/servers/new", description: "Announcement link target" },
    { key: "seo_meta_title", value: "DiscordServerLink - Discover, Join & Promote Discord Servers", description: "Default SEO Title" },
    { key: "seo_meta_description", value: "Find the best Discord servers by category, game, language, and interests on DiscordServerLink. Add your server for free and reach thousands of daily members.", description: "Default SEO Description" },
  ];

  for (const set of settings) {
    await prisma.siteSetting.create({ data: set });
  }

  // Initial Audit Log
  await prisma.auditLog.create({
    data: {
      userId: adminUser.id,
      action: "SYSTEM_INITIALIZED",
      details: "Initial database seed completed with verified categories and starter servers.",
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
