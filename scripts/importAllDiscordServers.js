/**
 * Import 31,209 Discord Servers from desktop SQLite database into DiscordServerLink
 */
const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const srcDbPath = 'C:/Users/Nirmal/Desktop/Discord DB/discord_servers.db';
const destDbPath = path.join(__dirname, '..', 'prisma', 'dev.db');

if (!fs.existsSync(srcDbPath)) {
  console.error(`Source DB not found at: ${srcDbPath}`);
  process.exit(1);
}

if (!fs.existsSync(destDbPath)) {
  console.error(`Destination DB not found at: ${destDbPath}`);
  process.exit(1);
}

console.log('=== DISCORD SERVERS COMPLETE IMPORT ===');
console.log(`Source DB:      ${srcDbPath}`);
console.log(`Destination DB: ${destDbPath}`);

const srcDb = new DatabaseSync(srcDbPath, { open: true, readOnly: true });
const destDb = new DatabaseSync(destDbPath, { open: true });

// Optimize SQLite settings for batch processing
destDb.exec('PRAGMA foreign_keys = OFF;');
destDb.exec('PRAGMA synchronous = OFF;');
destDb.exec('PRAGMA journal_mode = MEMORY;');

// 1. Get default admin owner ID
const adminUser = destDb.prepare("SELECT id FROM User WHERE role = 'ADMIN' LIMIT 1").get();
const ownerId = adminUser ? adminUser.id : 'cmvqr9ryj0000m12nbl63i1cg';
console.log(`Assigned server ownerId: ${ownerId}`);

// 2. Count existing servers before deletion
const beforeCount = destDb.prepare("SELECT count(*) as count FROM Server").get().count;
console.log(`Removing ${beforeCount} existing servers from database...`);

// 3. Delete previous servers & associated bumps/reviews
destDb.exec('DELETE FROM Bump;');
destDb.exec('DELETE FROM Review;');
destDb.exec('DELETE FROM PromotionRequest;');
destDb.exec('DELETE FROM Server;');
console.log('Previous servers and related records removed cleanly.');

// 4. Category Mapping Function
function mapCategoryRefined(primaryCat, catListRaw, keywordsRaw, name, desc) {
  const pCat = (primaryCat || '').toLowerCase().trim();
  const cList = (catListRaw || '').toLowerCase();
  const kw = (keywordsRaw || '').toLowerCase();
  const n = (name || '').toLowerCase();
  const d = (desc || '').toLowerCase();
  const fullText = `${n} ${d} ${kw}`;

  if (fullText.includes('anime') || fullText.includes('manga') || fullText.includes('vtuber') || fullText.includes('genshin') || fullText.includes('honkai') || cList.includes('anime & manga')) {
    return 'anime';
  }
  if (fullText.includes('artificial intelligence') || fullText.includes('midjourney') || fullText.includes('chatgpt') || kw.includes('ai') || n.includes(' ai ') || n.endsWith(' ai') || fullText.includes('machine learning') || fullText.includes('stable diffusion')) {
    return 'artificial-intelligence';
  }
  if (fullText.includes('crypto') || fullText.includes('bitcoin') || fullText.includes('trading') || fullText.includes('forex') || fullText.includes('stocks') || fullText.includes('web3') || fullText.includes('solana') || fullText.includes('ethereum') || fullText.includes('defi')) {
    return 'finance';
  }
  if (fullText.includes('meme') || fullText.includes('humor') || fullText.includes('shitpost') || fullText.includes('dank')) {
    return 'memes-humor';
  }
  if (pCat === 'esports' || n.includes('esport') || n.includes('tournament') || fullText.includes('scrims') || fullText.includes('championship')) {
    return 'esports-tournaments';
  }
  if (pCat === 'science & tech' || cList.includes('science & tech') || fullText.includes('coding') || fullText.includes('programming') || fullText.includes('developer') || fullText.includes('software') || fullText.includes('linux') || fullText.includes('python') || fullText.includes('javascript') || fullText.includes('hardware')) {
    return 'technology';
  }
  if (pCat === 'education' || pCat === 'student hubs' || cList.includes('education') || cList.includes('student hubs') || fullText.includes('study') || fullText.includes('university') || fullText.includes('school') || fullText.includes('homework') || fullText.includes('academy')) {
    return 'education';
  }
  if (pCat === 'music' || cList.includes('music') || fullText.includes('music') || fullText.includes('beats') || fullText.includes('producer') || fullText.includes('hip hop') || fullText.includes('guitar') || fullText.includes('kpop')) {
    return 'music';
  }
  if (cList.includes('creative arts') || fullText.includes('art ') || fullText.includes('artist') || fullText.includes('drawing') || fullText.includes('illustration') || fullText.includes('graphic design') || fullText.includes('3d model') || fullText.includes('blender')) {
    return 'art';
  }
  if (fullText.includes('fitness') || fullText.includes('gym ') || fullText.includes('workout') || fullText.includes('football') || fullText.includes('soccer') || fullText.includes('nba') || fullText.includes('basketball') || fullText.includes('baseball') || fullText.includes('f1') || fullText.includes('formula 1') || fullText.includes('bodybuilding')) {
    return 'sports-fitness';
  }
  if (pCat === 'podcasts' || fullText.includes('podcast') || fullText.includes('talk show') || fullText.includes('radio')) {
    return 'podcasts-talk';
  }
  if (cList.includes('movies & tv') || fullText.includes('movies') || fullText.includes('cinema') || fullText.includes('television') || fullText.includes('netflix') || fullText.includes('film')) {
    return 'movies-television';
  }
  if (pCat === 'gaming' || cList.includes('gaming') || cList.includes('rpg') || cList.includes('mmo') || cList.includes('strategy') || fullText.includes('game') || fullText.includes('gaming') || fullText.includes('minecraft') || fullText.includes('roblox') || fullText.includes('steam') || fullText.includes('pokemon') || fullText.includes('valorant') || fullText.includes('fortnite') || fullText.includes('playstation') || fullText.includes('xbox') || fullText.includes('nintendo') || fullText.includes('server') || fullText.includes('smp')) {
    return 'gaming';
  }
  if (pCat === 'entertainment' || fullText.includes('entertainment')) {
    return 'movies-entertainment';
  }

  return 'community';
}

// 5. Fetch all source servers
console.log('Fetching servers from source database...');
const selectStmt = srcDb.prepare(`
  SELECT 
    id, name, slug, vanity_url_code, invite_url, 
    description, about, member_count, online_count, 
    primary_category_name, categories, preferred_locale, 
    icon_url, banner_url, splash_url, keywords, features, 
    established_at, scraped_at 
  FROM servers
  ORDER BY member_count DESC
`);
const sourceServers = selectStmt.all();
console.log(`Fetched ${sourceServers.length} servers to import.`);

// 6. Prepared insert statement
const insertStmt = destDb.prepare(`
  INSERT INTO Server (
    id, guildId, name, slug, shortDescription, longDescription,
    inviteUrl, inviteCode, iconUrl, bannerUrl, memberCount, onlineCount,
    categorySlug, tags, language, isNsfw, isFeatured, isVerified,
    isPartnered, status, bumpsCount, viewsCount, joinsCount,
    ownerId, lastBumpedAt, createdAt, updatedAt
  ) VALUES (
    ?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?,
    ?, ?, ?, ?
  )
`);

// 7. Execute batch insertion in a single transaction
const nowIso = new Date().toISOString();
console.log('Beginning database batch insertion...');
const startTime = Date.now();

destDb.exec('BEGIN TRANSACTION;');

let inserted = 0;
for (let i = 0; i < sourceServers.length; i++) {
  const row = sourceServers[i];

  const guildId = String(row.id);
  const serverId = `srv_${guildId}`;
  const name = (row.name || 'Discord Community').trim();
  const slug = (row.slug || `server-${guildId}`).trim();

  // Short description formatting
  let shortDesc = (row.description || '').trim();
  if (!shortDesc) {
    if (row.about) {
      shortDesc = row.about.replace(/\s+/g, ' ').slice(0, 200).trim();
    } else {
      shortDesc = `Official Discord community for ${name}. Connect, chat, and hangout with fellow members!`;
    }
  }

  // Long description formatting
  let longDesc = (row.about || '').trim();
  if (!longDesc || longDesc.length < shortDesc.length) {
    longDesc = shortDesc;
  }

  // Invite URL and Code
  let inviteUrl = (row.invite_url || '').trim();
  const inviteCode = (row.vanity_url_code || '').trim() || null;
  if (!inviteUrl && inviteCode) {
    inviteUrl = `https://discord.gg/${inviteCode}`;
  } else if (!inviteUrl) {
    inviteUrl = `https://discord.com/servers/${slug}`;
  }

  const iconUrl = row.icon_url || null;
  const bannerUrl = row.banner_url || row.splash_url || null;
  const memberCount = typeof row.member_count === 'number' ? row.member_count : 0;
  const onlineCount = typeof row.online_count === 'number' ? row.online_count : Math.floor(memberCount * 0.15);

  const categorySlug = mapCategoryRefined(
    row.primary_category_name,
    row.categories,
    row.keywords,
    name,
    shortDesc
  );

  // Parse keywords / tags
  let tags = '';
  if (row.keywords) {
    try {
      const parsedKw = JSON.parse(row.keywords);
      if (Array.isArray(parsedKw)) {
        tags = parsedKw.slice(0, 10).join(', ');
      }
    } catch {}
  }
  if (!tags) {
    tags = `${categorySlug}, discord, community`;
  }

  const language = row.preferred_locale ? row.preferred_locale.slice(0, 2).toLowerCase() : 'en';

  const featuresStr = row.features || '';
  const isVerified = featuresStr.includes('VERIFIED') ? 1 : 0;
  const isPartnered = featuresStr.includes('PARTNERED') ? 1 : 0;
  // Feature top 30 largest servers on discovery
  const isFeatured = i < 30 ? 1 : 0;
  const isNsfw = 0;
  const status = 'APPROVED';

  // Realistic starting engagement metrics
  const bumpsCount = Math.floor(Math.random() * 80) + 5;
  const viewsCount = Math.floor(memberCount * 0.08) + bumpsCount * 12 + 25;
  const joinsCount = Math.floor(memberCount * 0.015) + bumpsCount * 2 + 5;

  // Staggered last bumped timestamp within last 24 hours
  const randomMinutesAgo = Math.floor(Math.random() * 1440);
  const lastBumpedAt = new Date(Date.now() - randomMinutesAgo * 60 * 1000).toISOString();
  const createdAt = row.established_at || row.scraped_at || nowIso;
  const updatedAt = nowIso;

  insertStmt.run(
    serverId,
    guildId,
    name,
    slug,
    shortDesc,
    longDesc,
    inviteUrl,
    inviteCode,
    iconUrl,
    bannerUrl,
    memberCount,
    onlineCount,
    categorySlug,
    tags,
    language,
    isNsfw,
    isFeatured,
    isVerified,
    isPartnered,
    status,
    bumpsCount,
    viewsCount,
    joinsCount,
    ownerId,
    lastBumpedAt,
    createdAt,
    updatedAt
  );

  inserted++;
}

destDb.exec('COMMIT;');

const duration = ((Date.now() - startTime) / 1000).toFixed(2);
console.log(`Successfully inserted ${inserted} servers in ${duration} seconds!`);

// Re-enable pragmas and optimize DB
destDb.exec('PRAGMA foreign_keys = ON;');
destDb.exec('PRAGMA synchronous = NORMAL;');
destDb.exec('PRAGMA journal_mode = WAL;');

console.log('Running VACUUM to defragment and optimize SQLite database...');
destDb.exec('VACUUM;');

// Final Verification
const afterCount = destDb.prepare("SELECT count(*) as count FROM Server").get().count;
console.log(`\n=== IMPORT COMPLETE ===`);
console.log(`Total servers currently in website DB: ${afterCount}`);

const catSummary = destDb.prepare(`
  SELECT categorySlug, count(*) as count 
  FROM Server 
  GROUP BY categorySlug 
  ORDER BY count DESC
`).all();
console.log('\nServers per category:');
console.table(catSummary);
