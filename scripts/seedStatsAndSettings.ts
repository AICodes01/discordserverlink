import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding settings, videos, and page views...");

  // 1. Seed SiteSettings
  const defaultSettings = [
    {
      key: "ads_txt_code",
      value: `# ads.txt for discordserverlink.com\ngoogle.com, pub-8893452174092183, DIRECT, f08c47fec0942fa0\n# Additional ad networks can be listed below:`,
      description: "Plain text served dynamically at /ads.txt for Google AdSense and ad exchanges",
    },
    {
      key: "adsense_client_id",
      value: "ca-pub-8893452174092183",
      description: "Google AdSense Publisher ID",
    },
    {
      key: "adsense_auto_ads_enabled",
      value: "true",
      description: "Enable or disable Google AdSense Auto Ads",
    },
    {
      key: "ad_header_enabled",
      value: "true",
      description: "Enable responsive header leaderboard banner",
    },
    {
      key: "ad_header_code",
      value: `<!-- Google AdSense - Top Leaderboard 728x90 / Responsive -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-8893452174092183"
     data-ad-slot="1234567890"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>`,
      description: "HTML code for top header ad placement",
    },
    {
      key: "ad_infeed_enabled",
      value: "true",
      description: "Enable in-feed ad card inside server directory grids",
    },
    {
      key: "ad_infeed_code",
      value: `<!-- Google AdSense - In-Feed Server Grid Unit -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-format="fluid"
     data-ad-layout-key="-fb+5w+4e-db+86"
     data-ad-client="ca-pub-8893452174092183"
     data-ad-slot="9876543210"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>`,
      description: "HTML code for in-feed ad unit",
    },
    {
      key: "ad_sidebar_enabled",
      value: "true",
      description: "Enable ad banner on server profile & category sidebars",
    },
    {
      key: "ad_sidebar_code",
      value: `<!-- Google AdSense - Sidebar 300x250 Medium Rectangle -->
<ins class="adsbygoogle"
     style="display:inline-block;width:300px;height:250px"
     data-ad-client="ca-pub-8893452174092183"
     data-ad-slot="5432109876"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>`,
      description: "HTML code for sidebar ad placement",
    },
    {
      key: "ad_footer_enabled",
      value: "true",
      description: "Enable bottom footer ad banner",
    },
    {
      key: "ad_footer_code",
      value: `<!-- Google AdSense - Bottom Footer Leaderboard -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-8893452174092183"
     data-ad-slot="6789012345"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>`,
      description: "HTML code for footer ad unit",
    },
    {
      key: "head_code",
      value: `<!-- Google tag (gtag.js) / AdSense Auto Ads Script -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8893452174092183" crossorigin="anonymous"></script>
<meta name="google-site-verification" content="GSC-DISCORD-SERVER-LINK-VERIFICATION-TOKEN-2026" />`,
      description: "Custom scripts and meta tags injected into HTML <head>",
    },
    {
      key: "body_end_code",
      value: `<!-- Custom Footer / Analytics Beacon Script -->`,
      description: "Custom scripts injected right before </body>",
    },
    {
      key: "google_analytics_id",
      value: "G-DSL8893452",
      description: "Google Analytics 4 Measurement ID",
    },
    {
      key: "google_verification_code",
      value: "GSC-DISCORD-SERVER-LINK-VERIFICATION-TOKEN-2026",
      description: "Google Search Console Verification Tag",
    },
  ];

  for (const s of defaultSettings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }
  console.log("Site settings seeded.");

  // 2. Seed Videos (VideoItem)
  const existingVideos = await prisma.videoItem.count();
  if (existingVideos === 0) {
    const sampleVideos = [
      {
        title: "How to Build & Scale a Discord Community to 10,000+ Members (2026 Guide)",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
        platform: "youtube",
        viewsCount: 14250,
        categorySlug: "community",
        featured: true,
      },
      {
        title: "Top 7 Essential Discord Bots Every Server Owner Needs in 2026",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80",
        platform: "youtube",
        viewsCount: 9840,
        categorySlug: "technology",
        featured: true,
      },
      {
        title: "Discord Server Anti-Raid & Security Setup Tutorial (Complete Walkthrough)",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80",
        platform: "youtube",
        viewsCount: 7620,
        categorySlug: "technology",
        featured: false,
      },
      {
        title: "How to Grow Your Gaming Discord & Host Successful Scrims & Tournaments",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80",
        platform: "youtube",
        viewsCount: 11300,
        categorySlug: "gaming",
        featured: true,
      },
      {
        title: "How to Setup Auto-Roles, Reaction Roles, and Leveling Bots on Discord",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
        platform: "youtube",
        viewsCount: 5410,
        categorySlug: "community",
        featured: false,
      },
      {
        title: "Discord Server Monetization & Server Subscriptions Guide for Creators",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        thumbnail: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&auto=format&fit=crop&q=80",
        platform: "youtube",
        viewsCount: 8940,
        categorySlug: "finance",
        featured: true,
      },
    ];

    for (const v of sampleVideos) {
      await prisma.videoItem.create({ data: v });
    }
    console.log(`Seeded ${sampleVideos.length} video items.`);
  }

  // 3. Seed PageViews for Today, Yesterday, and past days
  const existingViews = await prisma.pageView.count();
  if (existingViews < 100) {
    const pages = [
      { path: "/", title: "DiscordServerLink - Discover, Join & Promote Discord Servers", weightToday: 420, weightYesterday: 380, weightOlder: 1800 },
      { path: "/category/gaming", title: "Gaming Discord Servers 2026 - Top Communities", weightToday: 260, weightYesterday: 240, weightOlder: 1200 },
      { path: "/category/anime", title: "Anime & Manga Discord Servers 2026", weightToday: 190, weightYesterday: 180, weightOlder: 950 },
      { path: "/category/technology", title: "Technology, Coding & AI Discord Servers 2026", weightToday: 175, weightYesterday: 155, weightOlder: 820 },
      { path: "/category/finance", title: "Crypto, Stocks & Finance Discord Servers 2026", weightToday: 110, weightYesterday: 95, weightOlder: 560 },
      { path: "/category/music", title: "Music Production & Audio Discord Servers 2026", weightToday: 85, weightYesterday: 80, weightOlder: 420 },
      { path: "/category/community", title: "Hangout, Chill & Social Discord Servers 2026", weightToday: 140, weightYesterday: 130, weightOlder: 710 },
      { path: "/category/education", title: "Education, Study & Science Discord Servers 2026", weightToday: 75, weightYesterday: 65, weightOlder: 390 },
      { path: "/category/art", title: "Art, Design & Creative Discord Servers 2026", weightToday: 60, weightYesterday: 50, weightOlder: 310 },
      { path: "/categories", title: "All Discord Server Categories", weightToday: 120, weightYesterday: 110, weightOlder: 580 },
      { path: "/servers/new", title: "+ Add Your Discord Server - Free Listing", weightToday: 95, weightYesterday: 70, weightOlder: 440 },
      { path: "/server/aetheria-gaming", title: "Aetheria Gaming & Esports Discord Server", weightToday: 115, weightYesterday: 105, weightOlder: 620 },
      { path: "/tag/minecraft", title: "Minecraft Discord Servers", weightToday: 65, weightYesterday: 55, weightOlder: 290 },
      { path: "/tag/valorant", title: "Valorant Discord Servers", weightToday: 55, weightYesterday: 45, weightOlder: 240 },
    ];

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);

    const referrers = ["https://www.google.com/", "https://discord.com/", "direct", "https://reddit.com/r/discordapp", "https://twitter.com/"];
    const devices = ["desktop", "desktop", "mobile", "mobile", "mobile", "tablet"];

    const viewRecords: any[] = [];

    for (const page of pages) {
      // Today views (distributed between todayStart and now)
      for (let i = 0; i < page.weightToday; i++) {
        const randOffset = Math.random() * (now.getTime() - todayStart.getTime());
        viewRecords.push({
          path: page.path,
          title: page.title,
          referrer: referrers[Math.floor(Math.random() * referrers.length)],
          device: devices[Math.floor(Math.random() * devices.length)],
          userAgent: "Mozilla/5.0",
          createdAt: new Date(todayStart.getTime() + randOffset),
        });
      }

      // Yesterday views (distributed between yesterdayStart and todayStart)
      for (let i = 0; i < page.weightYesterday; i++) {
        const randOffset = Math.random() * 24 * 60 * 60 * 1000;
        viewRecords.push({
          path: page.path,
          title: page.title,
          referrer: referrers[Math.floor(Math.random() * referrers.length)],
          device: devices[Math.floor(Math.random() * devices.length)],
          userAgent: "Mozilla/5.0",
          createdAt: new Date(yesterdayStart.getTime() + randOffset),
        });
      }

      // Older views (past 2-7 days)
      for (let i = 0; i < Math.min(page.weightOlder, 150); i++) {
        const daysAgo = 2 + Math.floor(Math.random() * 5);
        const time = yesterdayStart.getTime() - daysAgo * 24 * 60 * 60 * 1000 + Math.random() * 24 * 60 * 60 * 1000;
        viewRecords.push({
          path: page.path,
          title: page.title,
          referrer: referrers[Math.floor(Math.random() * referrers.length)],
          device: devices[Math.floor(Math.random() * devices.length)],
          userAgent: "Mozilla/5.0",
          createdAt: new Date(time),
        });
      }
    }

    // Insert in batches of 500
    for (let i = 0; i < viewRecords.length; i += 500) {
      const batch = viewRecords.slice(i, i + 500);
      await prisma.pageView.createMany({ data: batch });
    }
    console.log(`Seeded ${viewRecords.length} page view records.`);
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
