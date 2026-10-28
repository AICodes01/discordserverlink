/**
 * Utility to verify if real, valid ad code has been provided.
 * Ensures ad containers remain 100% invisible (return null) when:
 * - No code is provided (undefined, null, empty string)
 * - Only whitespace or line breaks are present
 * - Only HTML comments (e.g. <!-- paste code here -->) are present
 * - No executable tags (<script, <ins, <iframe, <a, <img, <div) exist
 */
export function hasValidAdCode(code?: string | null): boolean {
  if (!code) return false;

  // Trim whitespace
  const trimmed = code.trim();
  if (!trimmed) return false;

  // Strip all HTML comments: <!-- ... -->
  const withoutComments = trimmed.replace(/<!--[\s\S]*?-->/g, "").trim();
  if (!withoutComments || withoutComments.length === 0) return false;

  // Verify that there is at least one HTML tag like <ins, <script, <iframe, <div>, <a>, <img>
  const hasTag = /<[a-z0-9]+(\s[^>]*)?>[\s\S]*?<\/[a-z0-9]+>|<[a-z0-9]+(\s[^>]*)?\/?>/i.test(withoutComments);
  if (!hasTag) return false;

  return true;
}
