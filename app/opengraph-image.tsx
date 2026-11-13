import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "DiscordServerLink - Discover, Join & Promote Discord Servers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#090a0f",
          color: "white",
          fontFamily: "sans-serif",
          padding: "60px",
          position: "relative",
        }}
      >
        {/* Ambient Blur */}
        <div
          style={{
            position: "absolute",
            width: "600px",
            height: "300px",
            background: "rgba(88, 101, 242, 0.35)",
            filter: "blur(120px)",
            borderRadius: "50%",
            top: "100px",
          }}
        />

        {/* Brand Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "18px",
              background: "#5865F2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              fontWeight: 900,
              boxShadow: "0 10px 30px rgba(88, 101, 242, 0.5)",
            }}
          >
            D
          </div>
          <span
            style={{
              fontSize: "38px",
              fontWeight: 900,
              letterSpacing: "-0.5px",
            }}
          >
            Discord<span style={{ color: "#5865F2" }}>ServerLink</span>
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: "54px",
            fontWeight: 900,
            textAlign: "center",
            lineHeight: 1.15,
            marginBottom: "20px",
            maxWidth: "1050px",
          }}
        >
          Discover &amp; Join 31,000+ Discord Communities
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "22px",
            color: "#94a3b8",
            textAlign: "center",
            maxWidth: "850px",
            marginBottom: "40px",
          }}
        >
          Active Voice Channels &bull; Gaming Squads &bull; Anime Hubs &bull; Top Discord Bots &bull; Emojis &bull; Live Bumping 2026
        </div>

        {/* Stat Pills */}
        <div style={{ display: "flex", gap: "16px" }}>
          <div
            style={{
              padding: "12px 24px",
              borderRadius: "16px",
              background: "#181b29",
              border: "1px solid #2d3748",
              fontSize: "17px",
              fontWeight: 700,
              color: "#3ba55c",
            }}
          >
            &bull; 31,209 Listed Servers
          </div>
          <div
            style={{
              padding: "12px 24px",
              borderRadius: "16px",
              background: "#181b29",
              border: "1px solid #2d3748",
              fontSize: "17px",
              fontWeight: 700,
              color: "#faa81a",
            }}
          >
            &bull; Live Bump Leaderboard
          </div>
          <div
            style={{
              padding: "12px 24px",
              borderRadius: "16px",
              background: "#181b29",
              border: "1px solid #2d3748",
              fontSize: "17px",
              fontWeight: 700,
              color: "#5865f2",
            }}
          >
            &bull; discordserverlink.com
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
