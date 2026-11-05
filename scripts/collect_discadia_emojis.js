const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const vm = require('vm');

const PROJECT_DIR = 'C:\\Users\\Nirmal\\.gemini\\antigravity\\scratch\\discordserverlink';
const cosmicAesCode = fs.readFileSync(path.join(PROJECT_DIR, 'cosmic_aes.js'), 'utf8');

function getCookie() {
  const initialCmd = `curl.exe -k -L -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" -o "${PROJECT_DIR}\\challenge.html" http://discadia.com/emojis/`;
  execSync(initialCmd);
  const html = fs.readFileSync(path.join(PROJECT_DIR, 'challenge.html'), 'utf8');
  const match = html.match(/var i=e\("([0-9a-f]+)"\),a=e\("([0-9a-f]+)"\),s=e\("([0-9a-f]+)"\)/);
  if (!match) throw new Error('No challenge match');

  const sandbox = { hexI: match[1], hexA: match[2], hexS: match[3] };
  const codeToRun = `
    ${cosmicAesCode}
    var hexToBytes = function(h) {
      var bytes = [];
      h.replace(/(..)/g, function(b) { bytes.push(parseInt(b, 16)); });
      return bytes;
    };
    var decrypted = slowAES.decrypt(hexToBytes(hexS), 2, hexToBytes(hexI), hexToBytes(hexA));
    var hex = '';
    for (var idx = 0; idx < decrypted.length; idx++) {
      var b = decrypted[idx];
      hex += (b < 16 ? '0' : '') + b.toString(16);
    }
    hex.toLowerCase();
  `;
  return vm.runInNewContext(codeToRun, sandbox);
}

const cookie = getCookie();
console.log('Active cookie:', cookie);

const queries = [
  '', 'pepe', 'meme', 'anime', 'cat', 'gaming', 'minecraft', 'cute', 'aesthetic',
  'troll', 'reaction', 'dancing', 'bttv', 'doge', 'kekw', 'vibing', 'love', 'sad',
  'happy', 'party', 'fire', 'chad', 'popcat', 'pokemon', 'among', 'genshin',
  'naruto', 'blobs', 'duck', 'frog', 'rage', 'cool', 'skull', 'cry', 'sus',
  'giga', 'shrek', 'heart', 'catjam', 'smug', 'dance', 'bonk', 'wojak', 'capoo',
  'blob', 'catto', 'hamster', 'monkey', 'snoop', 'clown', 'laugh', 'cursed',
  'sponge', 'rick', 'pika', 'valorant', 'roblox', 'fortnite', 'gta', 'mario'
];

const emojisMap = new Map();

for (const q of queries) {
  if (emojisMap.size >= 1050) break;
  try {
    const out = path.join(PROJECT_DIR, 'temp_q.html');
    const url = q ? `https://discadia.com/emojis/?q=${encodeURIComponent(q)}` : `https://discadia.com/emojis/`;
    execSync(`curl.exe -s -k -L -b "_cosmic_auth=${cookie}" -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" -o "${out}" "${url}"`);
    const html = fs.readFileSync(out, 'utf8');
    const m = html.match(/<script id="server-provided-emojis" type="application\/json">([\s\S]*?)<\/script>/);
    if (m) {
      const list = JSON.parse(m[1]);
      let added = 0;
      for (const item of list) {
        if (!emojisMap.has(item.emote)) {
          emojisMap.set(item.emote, {
            ...item,
            queryCategory: q || 'popular'
          });
          added++;
        }
      }
      console.log(`Query "${q || 'ALL'}": +${added} new emojis. Total unique: ${emojisMap.size}`);
    } else {
      console.log(`Query "${q}": no JSON script found`);
    }
  } catch (err) {
    console.error(`Error querying "${q}":`, err.message);
  }
}

console.log('Final collected unique emojis count:', emojisMap.size);
fs.writeFileSync(path.join(PROJECT_DIR, 'scraped_emojis.json'), JSON.stringify(Array.from(emojisMap.values()), null, 2));
console.log('Saved to scraped_emojis.json');
