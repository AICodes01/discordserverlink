# DiscordServerLink (discordserverlink.com) 🚀

> An ultra-fast, SEO-optimized Discord server directory and community sharing platform inspired by [discordservers.com](https://discordservers.com/) and Disboard.

Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Prisma ORM**, and **NextAuth.js**.

---

## 🌟 Key Features

### ⚡ Super Fast & SEO Engine
- **Server-Side Rendering (SSR) & Incremental Static Regeneration (ISR)** for near-instant page loads.
- **Dynamic XML Sitemap (`/sitemap.xml`)**: Automatically indexes all Discord servers, category landing pages, tag filters, and static routes.
- **Robots.txt (`/robots.txt`)**: Search-engine-friendly configuration allowing Googlebot and Bing to crawl server directories while blocking admin endpoints.
- **Schema.org Structured Data (JSON-LD)**: Rich Snippet schemas (`OnlineBusiness`, `DiscussionForumPosting`, `BreadcrumbList`, `AggregateRating`) embedded on every server page for maximum search visibility and CTR.
- **Dynamic OpenGraph & Twitter Cards**: High-res preview banners generated on the fly for social shares.

### 🎮 Discord Integration & Auto-Fetch
- **Instant Server Auto-Import**: Paste any Discord invite link (`https://discord.gg/code` or `code`) — the system queries the Discord API (`/api/v10/invites/{code}?with_counts=true`) to automatically populate the server name, live member count, online presence, high-res icon, and banner.
- **Discord OAuth2 Login**: Users log in directly with their Discord account to manage their listings.
- **Server Bumping Engine**: Server owners and fans bump their community every 2 hours to propel it to `#1` on the homepage and category feeds.

### 🛡️ Full-Access Admin Control Panel (`/admin`)
- **Metric Dashboard**: Live view of total servers, member counts, daily bumps, pending moderation queues, and user registrations.
- **Server Management**:
  - One-click toggles: **Featured Spotlight**, **Verified Badge**, **Partner Badge**, **NSFW Flag**.
  - Moderate statuses: `APPROVED`, `PENDING`, `REJECTED`, `BANNED`.
  - Edit descriptions, tags, and categories or delete spam servers.
- **Category & Tag Management**: Create custom categories with custom SEO titles and meta descriptions.
- **User & Staff Permissions**: Promote members to `ADMIN` or `MODERATOR`, or suspend abusive accounts.
- **Site Configuration**: Edit site tagline, announcement bar message & link, bump cooldown period, and Google meta descriptions directly from the UI.
- **Audit Logs**: Tamper-proof history tracking every moderator and admin action.

---

## 🔑 Default Admin Credentials

Access the admin panel at **`/login`** or **`/admin`**:
- **Email:** `admin@discordserverlink.com`
- **Password:** `admin123456`

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Discord dark blurple theme)
- **Icons:** Lucide React
- **Database & ORM:** Prisma ORM (SQLite for local zero-config, PostgreSQL ready for production)
- **Authentication:** NextAuth.js (Discord OAuth + Credentials for Admin)

---

## 🚀 Quick Start Guide

### 1. Clone & Install Dependencies
```bash
cd discordserverlink
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="discordserverlink-super-secure-production-secret-2026"

# Discord OAuth2 (optional for local admin test, recommended for Discord login):
DISCORD_CLIENT_ID=""
DISCORD_CLIENT_SECRET=""

NEXT_PUBLIC_SITE_URL="https://discordserverlink.com"
NEXT_PUBLIC_SITE_NAME="DiscordServerLink"
NEXT_PUBLIC_DOMAIN="discordserverlink.com"
```

### 3. Initialize Database & Seed
```bash
npx prisma db push
npx tsx prisma/seed.ts
```

### 4. Import / Sync Servers from discordservers.com
You can run the built-in automated server collector anytime to harvest 100+ active Discord servers across gaming, anime, tech, music, and community:
```bash
npm run import:servers
```

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Connecting Discord OAuth (Developer Portal)

To enable 1-click Discord login:
1. Visit the [Discord Developer Portal](https://discord.com/developers/applications).
2. Create a new Application called **DiscordServerLink**.
3. Under **OAuth2 > General**, add your Redirect URI:
   - Local: `http://localhost:3000/api/auth/callback/discord`
   - Production: `https://discordserverlink.com/api/auth/callback/discord`
4. Copy the **Client ID** and **Client Secret** into your `.env` file (`DISCORD_CLIENT_ID` and `DISCORD_CLIENT_SECRET`).

---

## 📦 Production Deployment

### Option A: Vercel / Railway / Render
1. Push this repository to GitHub or GitLab.
2. In your cloud dashboard (Vercel, Railway, Neon, Supabase):
   - Set environment variable `DATABASE_URL` to your PostgreSQL database URL (or use SQLite on persistent volume).
   - Set `NEXTAUTH_URL="https://discordserverlink.com"`.
   - Set `NEXTAUTH_SECRET="your-generated-random-string"`.
3. Build command: `npm run build`
4. Output directory: `.next`

### Option B: VPS / Docker
```bash
npm run build
npm start
```
Run behind an Nginx or Caddy reverse proxy with SSL for `discordserverlink.com`.

---

## 📄 License
MIT License. Built for **discordserverlink.com**.
