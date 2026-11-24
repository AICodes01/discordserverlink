/**
 * LayoutSettingsLoader — async server component
 * Loads site settings (ad codes, head/body injection) in a Suspense boundary
 * so it NEVER blocks page navigation or the loading.tsx skeleton from showing.
 */
import prisma from "@/lib/prisma";
import HeaderAdBanner from "@/components/ads/HeaderAdBanner";
import FooterAdBanner from "@/components/ads/FooterAdBanner";
import AdSenseScriptLoader from "@/components/ads/AdSenseScriptLoader";

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

  const rawHeadCode = settingsMap.head_code || "";
  const bodyEndCode = settingsMap.body_end_code || "";

  // Check if headCode has an AdSense script
  const hasAdSenseInHeadCode = rawHeadCode.includes("pagead2.googlesyndication.com");
  // Clean raw AdSense script out of headCode so bots/scrapers fetching raw HTML don't trigger AdSense page views
  const cleanedHeadCode = rawHeadCode.replace(
    /<script[^>]*pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js[^>]*><\/script>/gi,
    ""
  ).trim();

  // Resolve client ID (from settings or headCode or default)
  const clientMatch = rawHeadCode.match(/client=(ca-pub-[0-9]+)/i);
  const adsenseClientId =
    settingsMap.adsense_client_id ||
    clientMatch?.[1] ||
    (hasAdSenseInHeadCode ? "ca-pub-7551201031226261" : "");

  const autoAdsEnabled = settingsMap.adsense_auto_ads_enabled !== "false";

  return (
    <>
      {/* Smart AdSense loader: loads only on real human interactions (scroll/touch/mouse) to prevent bots from inflating page views */}
      {adsenseClientId && autoAdsEnabled && (
        <AdSenseScriptLoader
          clientId={adsenseClientId}
          autoAdsEnabled={autoAdsEnabled}
        />
      )}

      {cleanedHeadCode && (
        <div
          id="injected-head-code"
          dangerouslySetInnerHTML={{ __html: cleanedHeadCode }}
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
