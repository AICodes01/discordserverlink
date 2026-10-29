const fs = require("fs");
const path = require("path");

function cleanPostContent(rawHtml) {
  if (!rawHtml) return "";

  let html = rawHtml;

  // 1. Remove Gutenberg block comments
  html = html.replace(/<!--\s*\/?wp:[^>]*-->/gi, "");

  // 2. Remove entire Table of Contents (ez-toc or similar)
  html = html.replace(/<div[^>]*id=["']ez-toc-container["'][\s\S]*?<\/nav>\s*<\/div>/gi, "");
  html = html.replace(/<div[^>]*class=["'][^"']*ez-toc-container[^"']*["'][\s\S]*?<\/nav>\s*<\/div>/gi, "");
  html = html.replace(/<div[^>]*id=["']ez-toc-container["'][\s\S]*?<\/div>\s*<\/div>/gi, "");
  html = html.replace(/<span[^>]*class=["']ez-toc-section["'][^>]*><\/span>/gi, "");
  html = html.replace(/<span[^>]*class=["']ez-toc-section-end["'][^>]*><\/span>/gi, "");
  html = html.replace(/<nav[^>]*class=["'][^"']*ez-toc[^"']*["'][\s\S]*?<\/nav>/gi, "");

  // 3. Extract and normalize clean images
  html = html.replace(/<img[^>]+>/gi, (match) => {
    const srcMatch = match.match(/src=["']([^"']+)["']/i);
    const altMatch = match.match(/alt=["']([^"']*)["']/i);
    if (!srcMatch) return "";
    const src = srcMatch[1];
    const alt = altMatch ? altMatch[1].replace(/["']/g, "").trim() : "";
    return `<img src="${src}" alt="${alt}" loading="lazy" />`;
  });

  // 4. Unwrap wrappers: figure, div, span
  html = html.replace(/<\/?figure[^>]*>/gi, "");
  html = html.replace(/<\/?div[^>]*>/gi, "");
  html = html.replace(/<\/?span[^>]*>/gi, "");

  // 5. Strip all 'class', 'style', 'data-*', 'decoding', 'sizes', etc. from all tags
  html = html.replace(/<([a-z0-9]+)\b([^>]*)>/gi, (match, tag, attrs) => {
    const lowerTag = tag.toLowerCase();

    // Preserve clean img
    if (lowerTag === "img") {
      const srcMatch = attrs.match(/src=["']([^"']+)["']/i);
      const altMatch = attrs.match(/alt=["']([^"']*)["']/i);
      const src = srcMatch ? srcMatch[1] : "";
      const alt = altMatch ? altMatch[1].replace(/["']/g, "").trim() : "";
      return `<img src="${src}" alt="${alt}" loading="lazy" />`;
    }

    // Preserve clean a (hyperlinks)
    if (lowerTag === "a") {
      const hrefMatch = attrs.match(/href=["']([^"']+)["']/i);
      if (!hrefMatch) return "<a>";
      const href = hrefMatch[1];
      if (href.startsWith("#")) {
        return `<a href="${href}">`;
      }
      return `<a href="${href}" target="_blank" rel="noopener noreferrer">`;
    }

    // Pure semantic HTML for all other tags
    return `<${lowerTag}>`;
  });

  // 6. Clean empty tags
  html = html.replace(/<p>\s*<\/p>/gi, "");
  html = html.replace(/<p>&nbsp;<\/p>/gi, "");
  html = html.replace(/<p>\s*&nbsp;\s*<\/p>/gi, "");
  html = html.replace(/<h[1-6]>\s*<\/h[1-6]>/gi, "");

  // 7. Normalize multiple blank lines
  html = html.replace(/\n\s*\n\s*\n+/g, "\n\n").trim();

  return html;
}

const dataPath = path.join(__dirname, "..", "lib", "blogData.json");
const posts = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

console.log(`Processing ${posts.length} posts...`);

const cleanedPosts = posts.map((post, idx) => {
  const cleanContent = cleanPostContent(post.content);
  console.log(`[${idx + 1}] Cleaned "${post.slug}": from ${post.content.length} -> ${cleanContent.length} chars`);
  return {
    ...post,
    content: cleanContent,
  };
});

fs.writeFileSync(dataPath, JSON.stringify(cleanedPosts, null, 2), "utf-8");
console.log(`\nSuccessfully updated ${dataPath} with clean text and images!`);
