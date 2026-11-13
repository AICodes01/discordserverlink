import type { Metadata } from "next";
import { getPageSeo } from "@/lib/seoSettings";
import { SITE_URL } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("emojis");
  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `${SITE_URL}/emojis`,
    },
  };
}

export default function EmojisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
