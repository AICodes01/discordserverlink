import BlogPage from "../blog/page";
import { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Latest Discord Servers, Emojis, & Bots 2026 - DiscordServerLink",
  description:
    "Latest Discord Servers, Emojis, & Bots 2026. DiscordServerLink.com is the best platform for finding thousands of servers to join.",
  alternates: {
    canonical: `${SITE_URL}/discord-servers`,
  },
};

export const revalidate = 60;

export default BlogPage;
