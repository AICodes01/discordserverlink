export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://discordserverlink.com";
export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "DiscordServerLink";
export const SITE_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || "discordserverlink.com";

export const DEFAULT_OG_IMAGES = [
  {
    url: "/og-image.png",
    width: 1200,
    height: 630,
    alt: `${SITE_NAME} - Discord Server Directory`,
  },
];

export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/servers?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateServerSchema(server: {
  name: string;
  slug: string;
  shortDescription: string;
  iconUrl?: string | null;
  memberCount: number;
  lastBumpedAt?: Date | string;
  categorySlug: string;
  ratingValue?: string | number | null;
  reviewCount?: number | null;
}) {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "OnlineBusiness",
    name: `${server.name} Discord Server`,
    url: `${SITE_URL}/server/${server.slug}`,
    image: server.iconUrl || `${SITE_URL}/og-default.png`,
    description: server.shortDescription,
    category: server.categorySlug,
    interactionStatistic: {
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/JoinAction",
      userInteractionCount: server.memberCount,
    },
  };

  // Only emit AggregateRating if genuine user reviews exist to strictly follow Google Search Quality & Rich Snippet Guidelines
  if (server.reviewCount && server.reviewCount > 0 && server.ratingValue) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: String(server.ratingValue),
      reviewCount: server.reviewCount,
      bestRating: "5",
      worstRating: "1",
    };
  }

  return schema;
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function generateItemListSchema(
  items: { name: string; url: string; image?: string | null; position?: number }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Top Discord Servers List 2026",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: item.position || index + 1,
      name: item.name,
      url: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
      ...(item.image ? { image: item.image } : {}),
    })),
  };
}
