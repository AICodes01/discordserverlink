async function test() {
  const res = await fetch("https://discord.com/servers", {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });
  const text = await res.text();
  console.log("HTML length:", text.length);

  // Look for any JSON data or __NEXT_DATA__ or similar script tags
  const scripts = text.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || [];
  console.log("Script tags count:", scripts.length);

  // Search for server URLs like /servers/... or discord.gg or guild IDs
  const serverUrls = text.match(/\/servers\/[a-zA-Z0-9_\-\.]+/g) || [];
  const uniqueUrls = [...new Set(serverUrls)];
  console.log("Unique /servers/ paths:", uniqueUrls.length, uniqueUrls.slice(0, 20));

  const invites = text.match(/discord\.gg\/[a-zA-Z0-9_-]+/g) || [];
  console.log("Direct discord.gg invites:", [...new Set(invites)].length);

  // Look for guild objects or discovery data in script tags
  for (const s of scripts) {
    if (s.includes("guilds") || s.includes("approximate_member_count") || s.includes("vanity_url_code")) {
      console.log("Found discovery script tag! Length:", s.length, s.slice(0, 300));
    }
  }
}

test().catch(console.error);
