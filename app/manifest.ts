import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DiscordServerLink - Discover & Join Discord Servers",
    short_name: "DiscordServerLink",
    description:
      "Explore 31,000+ active Discord servers, bots, tools, and emojis in 2026. Join top communities instantly or promote your own for free.",
    start_url: "/",
    display: "standalone",
    background_color: "#090a0f",
    theme_color: "#5865F2",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
