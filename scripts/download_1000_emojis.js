const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const PROJECT_DIR = 'C:\\Users\\Nirmal\\.gemini\\antigravity\\scratch\\discordserverlink';
const EMOJIS_DIR = path.join(PROJECT_DIR, 'public', 'emojis');

if (!fs.existsSync(EMOJIS_DIR)) {
  fs.mkdirSync(EMOJIS_DIR, { recursive: true });
}

const rawList = JSON.parse(fs.readFileSync(path.join(PROJECT_DIR, 'scraped_emojis.json'), 'utf8'));

// Take exactly 1000 emojis
const targetEmojis = rawList.slice(0, 1000);
console.log(`Starting download of ${targetEmojis.length} emojis to ${EMOJIS_DIR}...`);

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://discadia.com/'
      },
      timeout: 10000
    }, (res) => {
      if (res.statusCode === 200) {
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      } else if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // follow redirect
        downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      } else {
        reject(new Error(`HTTP ${res.statusCode}`));
      }
    });

    req.on('error', (err) => {
      if (fs.existsSync(dest)) fs.unlink(dest, () => {});
      reject(err);
    });

    req.on('timeout', () => {
      req.destroy();
      if (fs.existsSync(dest)) fs.unlink(dest, () => {});
      reject(new Error('Timeout'));
    });
  });
}

function getCategory(item) {
  const text = `${item.title} ${(item.best_guess_labels || []).join(' ')} ${item.queryCategory || ''}`.toLowerCase();
  const isGif = item.emote && item.emote.toLowerCase().endsWith('.gif');

  if (text.includes('pepe') || text.includes('frog') || text.includes('monka') || text.includes('kekw') || text.includes('bttv')) {
    return { slug: 'pepe', label: 'Pepe & Frogs' };
  }
  if (text.includes('anime') || text.includes('waifu') || text.includes('genshin') || text.includes('naruto') || text.includes('manga')) {
    return { slug: 'anime', label: 'Anime & Waifu' };
  }
  if (text.includes('gaming') || text.includes('minecraft') || text.includes('pokemon') || text.includes('roblox') || text.includes('mario') || text.includes('game') || text.includes('fortnite') || text.includes('valorant')) {
    return { slug: 'gaming', label: 'Gaming & Minecraft' };
  }
  if (text.includes('cute') || text.includes('cat') || text.includes('aesthetic') || text.includes('heart') || text.includes('love') || text.includes('duck') || text.includes('capoo') || text.includes('hamster')) {
    return { slug: 'aesthetic', label: 'Aesthetic & Cute' };
  }
  if (text.includes('meme') || text.includes('chad') || text.includes('troll') || text.includes('giga') || text.includes('cursed') || text.includes('doge') || text.includes('wojak') || text.includes('shrek')) {
    return { slug: 'memes', label: 'Memes & Trolls' };
  }
  if (text.includes('sad') || text.includes('happy') || text.includes('cry') || text.includes('rage') || text.includes('party') || text.includes('reaction') || text.includes('vibing') || text.includes('dance')) {
    return { slug: 'reactions', label: 'Reactions & Chat' };
  }
  if (isGif) {
    return { slug: 'animated', label: 'Animated & Nitro' };
  }
  return { slug: 'memes', label: 'Memes & Trolls' };
}

async function run() {
  const finalEmojis = [];
  const CONCURRENCY = 15;
  let completed = 0;
  let failed = 0;

  for (let i = 0; i < targetEmojis.length; i += CONCURRENCY) {
    const chunk = targetEmojis.slice(i, i + CONCURRENCY);
    await Promise.all(chunk.map(async (item, chunkIdx) => {
      const idx = i + chunkIdx;
      let fn = path.basename(item.emote);
      if (!fn.includes('.')) {
        fn += '.png';
      }
      const dest = path.join(EMOJIS_DIR, fn);
      const originUrl = `https://emoji.discadia.com/${item.emote}`;
      const fallbackUrl = item.resized_url;

      let success = false;
      // Skip if already exists and non-empty
      if (fs.existsSync(dest) && fs.statSync(dest).size > 100) {
        success = true;
      } else {
        try {
          await downloadFile(originUrl, dest);
          success = true;
        } catch (e1) {
          if (fallbackUrl) {
            try {
              await downloadFile(fallbackUrl, dest);
              success = true;
            } catch (e2) {
              // Failed both
            }
          }
        }
      }

      if (success) {
        completed++;
        const cat = getCategory(item);
        const cleanTitle = (item.title || 'Emoji')
          .trim()
          .replace(/[\"\'\<\>]/g, '')
          .slice(0, 30);
        const slugCode = cleanTitle
          .toLowerCase()
          .replace(/[^a-z0-9_]/g, '_')
          .replace(/_+/g, '_')
          .replace(/^_|_$/g, '') || `emoji_${idx + 1}`;

        finalEmojis.push({
          id: `discadia-${item.id || idx + 1}`,
          name: cleanTitle,
          shortcode: `:${slugCode}:`,
          category: cat.slug,
          categoryLabel: cat.label,
          url: `/emojis/${fn}`,
          isAnimated: fn.toLowerCase().endsWith('.gif'),
        });
      } else {
        failed++;
      }
    }));

    if ((i + CONCURRENCY) % 75 === 0 || i + CONCURRENCY >= targetEmojis.length) {
      console.log(`Progress: ${completed} downloaded, ${failed} failed (${Math.min(targetEmojis.length, i + CONCURRENCY)}/${targetEmojis.length})`);
    }
  }

  console.log(`\nDownload completed: ${completed} saved, ${failed} failed.`);

  // Save JSON metadata
  const jsonPath = path.join(PROJECT_DIR, 'public', 'data', 'emojis.json');
  if (!fs.existsSync(path.dirname(jsonPath))) {
    fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
  }
  fs.writeFileSync(jsonPath, JSON.stringify(finalEmojis, null, 2));
  console.log(`Saved metadata to ${jsonPath} (${finalEmojis.length} items)`);

  // Also save a compiled TS export file lib/emojisData.ts so SSG / SSR works instantaneously
  const tsContent = `// Auto-generated 1,000+ Discord Emojis hosted directly on the server
export interface DiscordEmoji {
  id: string;
  name: string;
  shortcode: string;
  category: "all" | "pepe" | "memes" | "anime" | "gaming" | "aesthetic" | "animated" | "reactions";
  categoryLabel: string;
  url: string;
  isAnimated?: boolean;
}

export const EMOJI_CATEGORIES = [
  { slug: "all", name: "All Emojis", icon: "Smile" },
  { slug: "pepe", name: "Pepe & Frogs", icon: "Flame" },
  { slug: "memes", name: "Memes & Trolls", icon: "Laugh" },
  { slug: "anime", name: "Anime & Waifu", icon: "Heart" },
  { slug: "gaming", name: "Gaming & Minecraft", icon: "Gamepad2" },
  { slug: "aesthetic", name: "Aesthetic & Cute", icon: "Sparkles" },
  { slug: "animated", name: "Animated & Nitro", icon: "Zap" },
  { slug: "reactions", name: "Reactions & Chat", icon: "Smile" },
];

export const DISCORD_EMOJIS: DiscordEmoji[] = ${JSON.stringify(finalEmojis, null, 2)};
`;

  const tsPath = path.join(PROJECT_DIR, 'lib', 'emojisData.ts');
  fs.writeFileSync(tsPath, tsContent);
  console.log(`Updated ${tsPath} with ${finalEmojis.length} emojis!`);
}

run();
