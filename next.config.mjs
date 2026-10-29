/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "assets.discord.com",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      {
        protocol: "https",
        hostname: "discordserverlink.com",
      },
      {
        protocol: "https",
        hostname: "cdn3.emoji.gg",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/best-anime-discord-server-links",
        destination: "/blog/best-anime-discord-server-links",
        permanent: true,
      },
      {
        source: "/youtube-discord-server-links",
        destination: "/blog/youtube-discord-server-links",
        permanent: true,
      },
      {
        source: "/basketball-zero-discord-server-link",
        destination: "/blog/basketball-zero-discord-server-link",
        permanent: true,
      },
      {
        source: "/fortnite-discord-server-link",
        destination: "/blog/fortnite-discord-server-link",
        permanent: true,
      },
      {
        source: "/nepal-discord-server-link",
        destination: "/blog/nepal-discord-server-link",
        permanent: true,
      },
      {
        source: "/best-discord-bots-list",
        destination: "/blog/best-discord-bots-list",
        permanent: true,
      },
      {
        source: "/ai-discord-server-links",
        destination: "/blog/ai-discord-server-links",
        permanent: true,
      },
      {
        source: "/ask2dm-discord-servers",
        destination: "/blog/ask2dm-discord-servers",
        permanent: true,
      },
      {
        source: "/jujutsu-infinite-discord-server-link",
        destination: "/blog/jujutsu-infinite-discord-server-link",
        permanent: true,
      },
      {
        source: "/discord-invite-checker-downloader",
        destination: "/blog/discord-invite-checker-downloader",
        permanent: true,
      },
      {
        source: "/discord-pfp-viewer-grabber-profile-picture",
        destination: "/blog/discord-pfp-viewer-grabber-profile-picture",
        permanent: true,
      },
      {
        source: "/best-advertising-discord-servers",
        destination: "/blog/best-advertising-discord-servers",
        permanent: true,
      },
      {
        source: "/call-of-duty-discord-server",
        destination: "/blog/call-of-duty-discord-server",
        permanent: true,
      },
      {
        source: "/among-us-discord-server",
        destination: "/blog/among-us-discord-server",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
