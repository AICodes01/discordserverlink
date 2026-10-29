const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Fetching posts from https://discordserverlink.com/wp-json/wp/v2/posts...");
  
  let allPosts = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const url = `https://discordserverlink.com/wp-json/wp/v2/posts?per_page=100&page=${page}`;
    console.log(`Fetching page ${page} from: ${url}`);
    
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!res.ok) {
      console.error(`Failed to fetch page ${page}: status ${res.status}`);
      break;
    }

    const total = res.headers.get("x-wp-total");
    totalPages = parseInt(res.headers.get("x-wp-totalpages") || "1", 10);
    console.log(`x-wp-total: ${total}, x-wp-totalpages: ${totalPages}`);

    const rawText = await res.text();
    // Check if there is PHP notice/style before or after JSON
    let posts;
    try {
      posts = JSON.parse(rawText);
    } catch (e) {
      // Find where [ starts and ] ends
      const start = rawText.indexOf("[");
      const end = rawText.lastIndexOf("]");
      if (start !== -1 && end !== -1) {
        posts = JSON.parse(rawText.slice(start, end + 1));
      } else {
        console.error("Raw response:", rawText.slice(0, 500));
        throw e;
      }
    }
    console.log(`Page ${page} returned ${posts.length} posts.`);
    allPosts.push(...posts);
    page++;
  }

  console.log(`Successfully fetched a total of ${allPosts.length} posts.`);

  // Process posts into a clean structure
  const cleanPosts = allPosts.map((p) => {
    // Featured image
    let featuredImage = null;
    if (p._embedded && p._embedded["wp:featuredmedia"] && p._embedded["wp:featuredmedia"][0]) {
      featuredImage = p._embedded["wp:featuredmedia"][0].source_url;
    } else if (p.featured_media_src_url) {
      featuredImage = p.featured_media_src_url;
    } else {
      // Try to find first image in content
      const match = p.content.rendered.match(/<img[^>]+src=["']([^"']+)["']/i);
      if (match) featuredImage = match[1];
    }

    // Clean excerpt: strip HTML tags
    const cleanExcerpt = p.excerpt.rendered
      .replace(/<[^>]+>/g, "")
      .replace(/&hellip;/g, "...")
      .replace(/&#8217;/g, "'")
      .replace(/&#8216;/g, "'")
      .replace(/&#8220;/g, '"')
      .replace(/&#8221;/g, '"')
      .replace(/&#038;/g, "&")
      .replace(/\n+/g, " ")
      .trim();

    const cleanTitle = p.title.rendered
      .replace(/&#8217;/g, "'")
      .replace(/&#8216;/g, "'")
      .replace(/&#8220;/g, '"')
      .replace(/&#8221;/g, '"')
      .replace(/&#038;/g, "&")
      .replace(/&amp;/g, "&")
      .trim();

    return {
      id: p.id,
      slug: p.slug,
      title: cleanTitle,
      excerpt: cleanExcerpt,
      content: p.content.rendered,
      date: p.date,
      modified: p.modified,
      featuredImage: featuredImage || "/og-image.png",
      author: p._embedded?.author?.[0]?.name || "DiscordServerLink Team",
      link: p.link,
    };
  });

  const outputPath = path.join(__dirname, "..", "lib", "blogData.json");
  fs.writeFileSync(outputPath, JSON.stringify(cleanPosts, null, 2), "utf-8");
  console.log(`Saved ${cleanPosts.length} posts to ${outputPath}`);

  console.log("\nSample titles:");
  cleanPosts.slice(0, 10).forEach((p, idx) => {
    console.log(`${idx + 1}. [${p.slug}] ${p.title} (${p.date})`);
  });
}

main().catch(console.error);
