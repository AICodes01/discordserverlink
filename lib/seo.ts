export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://discordserverlink.com";
export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "DiscordServerLink";
export const SITE_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || "discordserverlink.com";

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
}) {
  return {
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
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: Math.max(12, Math.floor(server.memberCount / 100)),
      bestRating: "5",
      worstRating: "1",
    },
  };
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
