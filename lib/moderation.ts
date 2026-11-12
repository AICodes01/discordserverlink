// Automated Server Moderation & Review Engine for DiscordServerLink

export interface ModerationResult {
  needsReview: boolean;
  status: "APPROVED" | "PENDING";
  reasons: string[];
}

// Minimum member count for instant auto-approval
export const MIN_MEMBERS_AUTO_APPROVE = 25;

// NSFW / Adult keywords list
export const ADULT_KEYWORDS = [
  "nsfw",
  "18+",
  "adult",
  "porn",
  "hentai",
  "erotic",
  "dating",
  "onlyfans",
  "leaks",
  "sex",
  "xxx",
  "uncensored",
  "nudity",
  "escort",
  "camgirl",
  "fetish",
  "bdsm",
  "milf",
  "r34",
  "rule34",
];

// Suspicious / Scam / Malicious / Raid keywords list
export const ILLEGAL_SUSPICIOUS_KEYWORDS = [
  "free nitro",
  "nitro gen",
  "nitro generator",
  "nitro drop",
  "carding",
  "dox",
  "doxx",
  "doxxing",
  "raiding",
  "raid tool",
  "nuke bot",
  "server nuke",
  "hack",
  "hacks",
  "cheat",
  "cheats",
  "ddos",
  "botnet",
  "stealer",
  "token logger",
  "token grabber",
  "crack",
  "cracked",
  "account gen",
  "leak dump",
  "warez",
];

/**
 * Checks text against keyword array using whole-word or boundary matching where appropriate
 */
function findMatchedKeywords(text: string, keywords: string[]): string[] {
  const normalized = ` ${text.toLowerCase().replace(/[^a-z0-9+]/g, " ")} `;
  const matched: string[] = [];

  for (const keyword of keywords) {
    const target = keyword.toLowerCase().trim();
    // For short tokens like '18+' or 'xxx', search with word boundaries
    if (target.includes(" ")) {
      if (normalized.includes(target)) {
        matched.push(keyword);
      }
    } else {
      const regex = new RegExp(`\\b${target.replace("+", "\\+")}\\b`, "i");
      if (regex.test(normalized)) {
        matched.push(keyword);
      }
    }
  }

  return matched;
}

export function evaluateServerModeration(data: {
  name: string;
  shortDescription?: string;
  longDescription?: string;
  tags?: string | string[];
  memberCount?: number;
  isNsfw?: boolean;
  requireSiteApproval?: boolean;
}): ModerationResult {
  const reasons: string[] = [];

  const textToScan = [
    data.name || "",
    data.shortDescription || "",
    data.longDescription || "",
    Array.isArray(data.tags) ? data.tags.join(" ") : (data.tags || ""),
  ].join(" ");

  // 1. Mandatory Site Setting
  if (data.requireSiteApproval) {
    reasons.push("Site-wide manual review policy active");
  }

  // 2. Member Count Filter (less than 25 members)
  const count = typeof data.memberCount === "number" ? data.memberCount : 0;
  if (count < MIN_MEMBERS_AUTO_APPROVE) {
    reasons.push(
      `Low member count (${count} members; minimum ${MIN_MEMBERS_AUTO_APPROVE} required for instant auto-approval)`
    );
  }

  // 3. NSFW / Adult Content Detection
  const matchedAdult = findMatchedKeywords(textToScan, ADULT_KEYWORDS);
  if (data.isNsfw || matchedAdult.length > 0) {
    const tagsFound = matchedAdult.length > 0 ? ` [flagged terms: ${matchedAdult.slice(0, 3).join(", ")}]` : "";
    reasons.push(`Adult/NSFW content detected${tagsFound}`);
  }

  // 4. Illegal / Scam / Abuse Keywords Detection
  const matchedIllegal = findMatchedKeywords(textToScan, ILLEGAL_SUSPICIOUS_KEYWORDS);
  if (matchedIllegal.length > 0) {
    reasons.push(
      `Suspicious/Scam keywords detected [flagged terms: ${matchedIllegal.slice(0, 3).join(", ")}]`
    );
  }

  const needsReview = reasons.length > 0;

  return {
    needsReview,
    status: needsReview ? "PENDING" : "APPROVED",
    reasons,
  };
}
