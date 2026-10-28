import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import HeaderAdBanner from "@/components/ads/HeaderAdBanner";
import FooterAdBanner from "@/components/ads/FooterAdBanner";
import prisma from "@/lib/prisma";
import { generateWebSiteSchema, SITE_URL, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - Discover, Join & Promote Discord Servers`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Explore the top Discord servers directory. Find active communities for Gaming, Minecraft, Anime, Coding, Music, and Chill hangouts. Add your server for free on discordserverlink.com.",
  keywords: [
    "discord servers",
    "discord server list",
    "discord directory",
    "discordserverlink",
    "discord invite links",
    "minecraft discord",
    "gaming discord servers",
    "anime discord servers",
    "disboard alternative",
    "top discord communities",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} - Best Discord Server Directory`,
    description:
      "Find and join the best Discord servers by category, game, language, and interests. Fast, SEO-optimized community sharing platform.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} Preview`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - Best Discord Servers`,
    description:
      "Discover active Discord servers for gaming, anime, tech and chill chats on discordserverlink.com.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const websiteSchema = generateWebSiteSchema();

  let settingsMap: Record<string, string> = {};
  try {
    const settings = await prisma.siteSetting.findMany();
    settingsMap = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);
  } catch (e) {
    // Graceful fallback if database is updating
  }

  const headCode = settingsMap.head_code || "";
  const bodyEndCode = settingsMap.body_end_code || "";

  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <meta name="theme-color" content="#5865F2" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="bg-[#0c0e14] text-zinc-100 min-h-screen flex flex-col selection:bg-discord-blurple selection:text-white">
        {headCode && (
          <div
            id="injected-head-code"
            dangerouslySetInnerHTML={{ __html: headCode }}
          />
        )}
        <Providers>
          <AnalyticsTracker />
          <AnnouncementBanner />
          <Navbar />
          <HeaderAdBanner
            code={settingsMap.ad_header_code}
            enabled={settingsMap.ad_header_enabled}
          />
          <div className="flex-1">{children}</div>
          <FooterAdBanner
            code={settingsMap.ad_footer_code}
            enabled={settingsMap.ad_footer_enabled}
          />
          <Footer />
          {bodyEndCode && (
            <div
              style={{ display: "none" }}
              dangerouslySetInnerHTML={{ __html: bodyEndCode }}
            />
          )}
        </Providers>
      </body>
    </html>
  );
}
