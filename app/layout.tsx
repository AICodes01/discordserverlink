import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import { generateWebSiteSchema, SITE_URL, SITE_NAME } from "@/lib/seo";
import { Suspense } from "react";
import LayoutSettingsLoader from "@/components/LayoutSettingsLoader";

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
  verification: {
    google:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
      "ZZfaxde1lj2LnwLGqrtboOrVIWbaL5m5fCJ1hc5vJVY",
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION || "",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const websiteSchema = generateWebSiteSchema();

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
        <Providers>
          <AnalyticsTracker />
          {/* AnnouncementBanner in Suspense so it never blocks navigation */}
          <Suspense fallback={null}>
            <AnnouncementBanner />
          </Suspense>
          <Navbar />
          {/* Settings-dependent banners load async without blocking the page */}
          <Suspense fallback={null}>
            <LayoutSettingsLoader />
          </Suspense>
          <div className="flex-1">{children}</div>
          <Footer />
          <CookieConsentBanner />
        </Providers>
      </body>
    </html>
  );
}
