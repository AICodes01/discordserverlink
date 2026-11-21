/**
 * LayoutSettingsLoader — async server component
 * Loads site settings (ad codes, head/body injection) in a Suspense boundary
 * so it NEVER blocks page navigation or the loading.tsx skeleton from showing.
 */
import prisma from "@/lib/prisma";
import HeaderAdBanner from "@/components/ads/HeaderAdBanner";
import FooterAdBanner from "@/components/ads/FooterAdBanner";

async function getSettings(): Promise<Record<string, string>> {
  try {
    const settings = await prisma.siteSetting.findMany();
    return settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);
  } catch {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const seed = require("@/prisma/seed-data.json");
      if (Array.isArray(seed?.siteSettings)) {
        return seed.siteSettings.reduce((acc: Record<string, string>, curr: any) => {
          acc[curr.key] = curr.value;
          return acc;
        }, {});
      }
    } catch {}
    return {};
  }
}

export default async function LayoutSettingsLoader() {
  const settingsMap = await getSettings();

  const headCode = settingsMap.head_code || "";
  const bodyEndCode = settingsMap.body_end_code || "";

  return (
    <>
      {headCode && (
        <div
          id="injected-head-code"
          dangerouslySetInnerHTML={{ __html: headCode }}
        />
      )}
      <HeaderAdBanner
        code={settingsMap.ad_header_code}
        enabled={settingsMap.ad_header_enabled}
      />
      {bodyEndCode && (
        <div
          style={{ display: "none" }}
          dangerouslySetInnerHTML={{ __html: bodyEndCode }}
        />
      )}
    </>
  );
}
