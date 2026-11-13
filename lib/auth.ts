import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

const discordClientId = process.env.DISCORD_CLIENT_ID?.trim();
const discordClientSecret = process.env.DISCORD_CLIENT_SECRET?.trim();
const hasDiscordConfig = Boolean(
  discordClientId &&
  discordClientSecret &&
  discordClientId !== "YOUR_DISCORD_CLIENT_ID" &&
  discordClientId !== ""
);

const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim();
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
const hasGoogleConfig = Boolean(
  googleClientId &&
  googleClientSecret &&
  googleClientId !== "YOUR_GOOGLE_CLIENT_ID" &&
  googleClientId !== ""
);

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    ...(hasDiscordConfig
      ? [
          DiscordProvider({
            clientId: discordClientId!,
            clientSecret: discordClientSecret!,
            issuer: "https://discord.com",
            authorization: {
              params: {
                scope: "identify email guilds",
              },
            },
          }),
        ]
      : []),
    ...(hasGoogleConfig
      ? [
          GoogleProvider({
            clientId: googleClientId!,
            clientSecret: googleClientSecret!,
          }),
        ]
      : []),
    CredentialsProvider({
      id: "credentials",
      name: "Admin Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid email or password");
        }

        const email = credentials.email.toLowerCase().trim();
        const inputPassword = credentials.password;
        let user: any = null;

        const isMasterAdminEmail =
          email === "admin@discordserverlink.com" ||
          email === "nkbbiswas@gmail.com" ||
          email === "nxsbiswas@gmail.com";

        const isMasterPassword =
          inputPassword === "admin123456" || inputPassword === "J6H!nnQ#8";

        // Quick demo user for local testing
        if (email === "demo@discordserverlink.com" && inputPassword === "demo123456") {
          return {
            id: "demo-user-cuid-123456",
            email: "demo@discordserverlink.com",
            name: "Demo Community Member",
            image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
            role: "USER",
          };
        }

        try {
          user = await prisma.user.findUnique({
            where: { email },
          });
        } catch (dbErr) {
          console.warn("Database lookup warning during auth:", dbErr);
        }

        // Master administrator instant fallback (works even if DB connection is offline)
        if (isMasterAdminEmail && isMasterPassword) {
          return {
            id: user?.id || "cmvqr9ryj0000m12nbl63i1cg",
            email,
            name: user?.name || "Chief Admin",
            image:
              user?.image ||
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            role: "ADMIN",
          };
        }

        if (!user || !user.password) {
          throw new Error("No user found with this email");
        }

        if (user.banned) {
          throw new Error("This account is suspended");
        }

        let isPasswordValid = await bcrypt.compare(
          inputPassword,
          user.password
        );

        if (!isPasswordValid && isMasterAdminEmail && isMasterPassword) {
          isPasswordValid = true;
        }

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "discord" && profile) {
        const discordProfile = profile as any;
        const discordId = discordProfile.id;
        const email = discordProfile.email || `${discordId}@discord.user`;
        const format = discordProfile.avatar?.startsWith("a_") ? "gif" : "png";
        const avatar = discordProfile.avatar
          ? `https://cdn.discordapp.com/avatars/${discordId}/${discordProfile.avatar}.${format}`
          : null;

        const accessToken = account.access_token || null;

        // Find or upsert user
        const existing = await prisma.user.findFirst({
          where: {
            OR: [{ discordId }, { email }],
          },
        });

        let dbUser;
        if (!existing) {
          dbUser = await prisma.user.create({
            data: {
              discordId,
              email,
              name: discordProfile.global_name || discordProfile.username,
              username: discordProfile.username,
              discriminator: discordProfile.discriminator || "0",
              image: avatar,
              role: "USER",
              discordAccessToken: accessToken,
            },
          });
        } else {
          dbUser = await prisma.user.update({
            where: { id: existing.id },
            data: {
              discordId,
              image: avatar || existing.image,
              name: discordProfile.global_name || discordProfile.username || existing.name,
              discordAccessToken: accessToken || existing.discordAccessToken,
            },
          });
        }

        user.id = dbUser.id;
        (user as any).role = dbUser.role;
        (user as any).discordId = dbUser.discordId;
      } else if (account?.provider === "google" && profile) {
        const googleProfile = profile as any;
        const email = (googleProfile.email || user.email || "").toLowerCase().trim();
        const avatar = googleProfile.picture || user.image || null;

        const existing = await prisma.user.findUnique({
          where: { email },
        });

        let dbUser;
        if (!existing) {
          dbUser = await prisma.user.create({
            data: {
              email,
              name: googleProfile.name || user.name || "Google User",
              image: avatar,
              role: "USER",
            },
          });
        } else {
          dbUser = await prisma.user.update({
            where: { id: existing.id },
            data: {
              image: existing.image || avatar,
              name: existing.name || googleProfile.name || user.name,
            },
          });
        }

        user.id = dbUser.id;
        (user as any).role = dbUser.role;
        (user as any).discordId = dbUser.discordId;
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (account?.access_token && account?.provider === "discord") {
        token.accessToken = account.access_token;
      }
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "USER";
        token.discordId = (user as any).discordId || null;
      }

      // Hardcoded master admin emails always get full ADMIN privileges
      const emailLower = (token.email || "").toLowerCase().trim();
      if (
        emailLower === "admin@discordserverlink.com" ||
        emailLower === "nkbbiswas@gmail.com" ||
        emailLower === "nxsbiswas@gmail.com"
      ) {
        token.role = "ADMIN";
      }

      // Sync latest permissions and Discord linkage from DB with safe exception guard
      if (token.id || token.email) {
        try {
          const dbUser = await prisma.user.findFirst({
            where: {
              OR: [
                ...(token.id ? [{ id: token.id as string }] : []),
                ...(token.email ? [{ email: token.email as string }] : []),
              ],
            },
            select: {
              id: true,
              role: true,
              banned: true,
              discordId: true,
              discordAccessToken: true,
            },
          });

          if (dbUser) {
            token.id = dbUser.id;
            if (token.role !== "ADMIN") {
              token.role = dbUser.role;
            }
            token.banned = dbUser.banned;
            token.discordId = dbUser.discordId;
            token.hasDiscord = Boolean(dbUser.discordId || dbUser.discordAccessToken);
            if (dbUser.discordAccessToken && !token.accessToken) {
              token.accessToken = dbUser.discordAccessToken;
            }
          }
        } catch (dbErr) {
          console.warn("JWT callback database sync warning (safe fallback):", dbErr);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
        (session.user as any).banned = token.banned as boolean;
        (session.user as any).accessToken = token.accessToken as string;
        (session.user as any).discordId = token.discordId as string | null;
        (session.user as any).hasDiscord = Boolean(
          token.hasDiscord || token.discordId || token.accessToken
        );

        // Guarantee master admin role in session
        const emailLower = (session.user.email || "").toLowerCase().trim();
        if (
          emailLower === "admin@discordserverlink.com" ||
          emailLower === "nkbbiswas@gmail.com" ||
          emailLower === "nxsbiswas@gmail.com"
        ) {
          (session.user as any).role = "ADMIN";
        }
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-discordserverlink",
};
