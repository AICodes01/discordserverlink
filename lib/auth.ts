import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    ...(process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET
      ? [
          DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
            authorization: {
              params: {
                scope: "identify email guilds",
              },
            },
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

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });

        if (!user || !user.password) {
          throw new Error("No user found with this email");
        }

        if (user.banned) {
          throw new Error("This account is suspended");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

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
        const avatar = discordProfile.avatar
          ? `https://cdn.discordapp.com/avatars/${discordId}/${discordProfile.avatar}.png`
          : null;

        // Find or upsert user
        const existing = await prisma.user.findFirst({
          where: {
            OR: [{ discordId }, { email }],
          },
        });

        if (!existing) {
          await prisma.user.create({
            data: {
              discordId,
              email,
              name: discordProfile.global_name || discordProfile.username,
              username: discordProfile.username,
              discriminator: discordProfile.discriminator || "0",
              image: avatar,
              role: "USER",
            },
          });
        } else {
          await prisma.user.update({
            where: { id: existing.id },
            data: {
              discordId,
              image: avatar || existing.image,
              name: discordProfile.global_name || discordProfile.username || existing.name,
            },
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "USER";
      } else if (token.email) {
        // Refresh role and id from db if needed
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { id: true, role: true, banned: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.banned = dbUser.banned;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
        (session.user as any).banned = token.banned as boolean;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-discordserverlink",
};
