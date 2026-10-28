async function run() {
  const url = "https://discord.com/servers/genshin-impact-official-522681957373575168";
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });
  const t = await res.text();
  const invite = (t.match(/discord\.gg\/([a-zA-Z0-9_\-]+)/) || [])[1];
  const title = (t.match(/<h1[^>]*>(.*?)<\/h1>/) || [])[1]
    ?.replace(/<[^>]+>/g, "")
    .trim();
  const metaDesc = (t.match(/name="description" content="(.*?)"/) || [])[1];
  const icon = (t.match(/cdn\.discordapp\.com\/icons\/[0-9]+\/[a-zA-Z0-9_]+\.(png|webp|jpg)/) || [])[0];
  const memberMatches = Array.from(t.matchAll(/([0-9,]+)\s*(members|Members|Online|online)/g));
  const memberCounts = memberMatches.map((m) => m[0]);

  console.log({
    invite,
    title,
    metaDesc,
    icon: icon ? `https://${icon}` : null,
    memberCounts,
  });
}

run().catch(console.error);
