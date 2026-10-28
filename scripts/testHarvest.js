const SEARCH_KEYWORDS = [
  // Gaming
  "gaming", "minecraft", "roblox", "valorant", "fortnite", "genshin", "honkai", "fivem",
  "rust", "gta", "cs2", "counter strike", "apex legends", "overwatch", "league of legends",
  "pokemon", "destiny", "rocket league", "call of duty", "warzone", "steam", "lfg", "esports",
  "terraria", "zelda", "brawlhalla", "deadlock", "clover", "lethal company", "helldivers",
  // Anime & Manga
  "anime", "manga", "vtuber", "weeb", "naruto", "one piece", "jujutsu kaisen", "demon slayer",
  "dragon ball", "attack on titan", "bleach", "my hero academia", "chainsaw man", "solo leveling",
  "mudae", "karuta", "anigame", "otaku", "cosplay", "gacha", "fate", "blue lock",
  // Technology & Programming
  "technology", "coding", "programming", "python", "javascript", "typescript", "react", "nextjs",
  "web dev", "developer", "software", "ai", "machine learning", "chatgpt", "linux", "cybersecurity",
  "ethical hacking", "devops", "rust lang", "golang", "csharp", "cpp", "game dev", "unity", "unreal",
  // Music & Audio
  "music", "beatmaker", "producer", "fl studio", "ableton", "audio engineering", "mixing",
  "vocalist", "songwriter", "hip hop", "rap", "edm", "lofi", "rock", "metal", "guitar", "piano",
  // Education & Study
  "education", "study", "homework", "math", "physics", "chemistry", "biology", "science",
  "languages", "english", "spanish", "japanese", "korean", "french", "german", "college",
  "university", "med school", "pomodoro", "study hall",
  // Finance & Crypto
  "finance", "crypto", "bitcoin", "ethereum", "stocks", "trading", "investing", "options",
  "forex", "solana", "nft", "defi", "web3", "personal finance", "real estate",
  // Art & Creative
  "art", "design", "drawing", "illustration", "digital art", "3d", "blender", "animation",
  "photoshop", "concept art", "ui ux", "graphic design", "cgi",
  // Community & Social
  "community", "chill", "hangout", "friends", "social", "chat", "vibes", "wholesome", "lounge",
  "memes", "international", "lgbtq", "voice chat", "movie night", "trivia"
];

async function collectLinks() {
  const discovered = new Map(); // slug -> { url, guildId, inviteCode }

  for (const kw of SEARCH_KEYWORDS) {
    const url = `https://discord.com/servers?query=${encodeURIComponent(kw)}`;
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });
      if (res.ok) {
        const text = await res.text();
        const matches = text.match(/\/servers\/[a-zA-Z0-9_\-\.]*?[0-9]{15,22}/g) || [];
        for (const m of matches) {
          const guildIdMatch = m.match(/([0-9]{15,22})$/);
          if (guildIdMatch) {
            const guildId = guildIdMatch[1];
            if (!discovered.has(guildId)) {
              discovered.set(guildId, { path: m, guildId });
            }
          }
        }
      }
    } catch (e) {
      // ignore
    }
    process.stdout.write(`\rKeyword: "${kw}" | Total discovered so far: ${discovered.size}`);
    if (discovered.size >= 1100) break;
  }
  console.log(`\nFinal unique discovered servers: ${discovered.size}`);
}

collectLinks().catch(console.error);
