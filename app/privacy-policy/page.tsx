import Link from "next/link";
import { Metadata } from "next";
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2, Globe, Cookie, HelpCircle } from "lucide-react";
import { SITE_URL, SITE_NAME, generateBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy - DiscordServerLink | Data Protection & Compliance",
  description:
    "Read the DiscordServerLink Privacy Policy. Learn how we collect, use, and protect your information in compliance with GDPR, CCPA, and global privacy regulations.",
  alternates: {
    canonical: `${SITE_URL}/privacy-policy`,
  },
  openGraph: {
    title: "Privacy Policy - DiscordServerLink | Data Protection & Compliance",
    description:
      "Learn how DiscordServerLink handles data, cookies, and privacy in compliance with GDPR and CCPA regulations.",
    url: `${SITE_URL}/privacy-policy`,
  },
};

export default function PrivacyPolicyPage() {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Privacy Policy", url: "/privacy-policy" },
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs text-zinc-400">
        <Link href="/" className="hover:text-white transition">
          Home
        </Link>
        <span>/</span>
        <span className="text-zinc-200 font-medium">Privacy Policy</span>
      </nav>

      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-zinc-900 via-indigo-950/40 to-zinc-900 border border-zinc-800 p-8 sm:p-10 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-discord-blurple/10 border border-discord-blurple/20 text-discord-blurple text-xs font-bold tracking-wide">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Legal &amp; Privacy Compliance</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Privacy Policy
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400">
            <strong>Effective Date:</strong> November 10, 2026 &bull; <strong>Last Updated:</strong> November 2026
          </p>
        </div>
      </div>

      {/* Policy Content */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-10 space-y-8 text-sm sm:text-base text-zinc-300 leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>1. Introduction</span>
          </h2>
          <p>
            Welcome to <strong>DiscordServerLink.com</strong> (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). We are committed to protecting your personal information and respecting your privacy rights. This Privacy Policy explains what data we collect, how we process it, and your legal rights under international privacy frameworks including the General Data Protection Regulation (<strong>GDPR</strong>), California Consumer Privacy Act (<strong>CCPA/CPRA</strong>), and the Children&apos;s Online Privacy Protection Act (<strong>COPPA</strong>).
          </p>
          <p>
            By using our website, submitting a Discord server, using our web tools, or interacting with our directories, you consent to the practices described in this Privacy Policy.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3 border-t border-zinc-800 pt-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>2. Information We Collect</span>
          </h2>
          <p>We collect information in three ways: information you provide voluntarily, information collected automatically, and public data obtained via the official Discord API:</p>
          
          <div className="space-y-3 pl-2">
            <div>
              <h3 className="font-bold text-white text-sm">A. Public Discord Server &amp; User Data</h3>
              <p className="text-xs sm:text-sm text-zinc-400">
                When you submit a server or inspect an invite link, we retrieve public guild information directly from Discord&apos;s public API. This includes server names, guild IDs, server icons, banners, descriptions, member counts, and public channels. We do NOT have access to private messages, chat logs, or non-public member data.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-white text-sm">B. Account &amp; Authentication Information</h3>
              <p className="text-xs sm:text-sm text-zinc-400">
                If you authenticate via Discord OAuth2, we receive your Discord user ID, public username, and avatar hash. We do not store your Discord account password or sensitive financial data.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-white text-sm">C. Information Collected Automatically (Log Data)</h3>
              <p className="text-xs sm:text-sm text-zinc-400">
                When you browse DiscordServerLink, our servers automatically log standard technical information including your IP address (anonymized), browser type, operating system, referring URL, pages visited, and timestamps. This data is used solely to detect malicious botnet attacks and prevent fraudulent server bumping.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section id="cookies" className="space-y-3 border-t border-zinc-800 pt-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Cookie className="w-5 h-5 text-amber-400" />
            <span>3. Cookies &amp; Tracking Technologies</span>
          </h2>
          <p>
            DiscordServerLink uses cookies, local storage, and similar technologies to provide essential functionality and enhance your user experience:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-zinc-400">
            <li><strong>Essential Session Cookies:</strong> Required for user authentication, bump countdown timers, and maintaining CSRF security.</li>
            <li><strong>Preference Storage:</strong> Local storage used to save dark-theme settings, search filters, and your cookie consent choice.</li>
            <li><strong>Analytics Cookies:</strong> Anonymized metrics to understand site traffic trends, popular categories, and page latency.</li>
            <li><strong>Advertising Cookies:</strong> Third-party partners (such as Google AdSense) may place cookies to serve relevant contextual advertisements. You can opt out of personalized ads via <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-discord-blurple underline">aboutads.info</a> or Google Ad Settings.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-3 border-t border-zinc-800 pt-6">
          <h2 className="text-xl font-bold text-white">4. How We Use Your Information</h2>
          <p>We process collected data exclusively for legitimate operational purposes:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-zinc-400">
            <li>To operate, maintain, and optimize our public Discord server directory.</li>
            <li>To enforce the 2-hour server bumping interval and protect against automated spam.</li>
            <li>To generate search engine indexing (SEO) for community discovery.</li>
            <li>To process support requests, DMCA takedowns, and server verification badges.</li>
            <li>To safeguard against Distributed Denial of Service (DDoS) and exploit attacks.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-3 border-t border-zinc-800 pt-6">
          <h2 className="text-xl font-bold text-white">5. Third-Party Services &amp; Disclosures</h2>
          <p>
            We do not sell, rent, or trade your personal information to third parties. We only share anonymized information with trusted infrastructure providers necessary to deliver our website:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-zinc-400">
            <li><strong>Discord, Inc.:</strong> We communicate with the official Discord API to fetch public guild and invite metadata.</li>
            <li><strong>Cloudflare / Hosting Infrastructure:</strong> For global content delivery (CDN), caching, and DDoS mitigation.</li>
            <li><strong>Legal Compliance:</strong> We may disclose information if required by law, subpoena, or to protect the safety and rights of our users.</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="space-y-3 border-t border-zinc-800 pt-6">
          <h2 className="text-xl font-bold text-white">6. Your Rights Under GDPR &amp; CCPA</h2>
          <p>Depending on your geographic location, you possess comprehensive rights over your personal data:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-1">
              <span className="text-xs font-bold text-discord-blurple">Right to Access &amp; Portability</span>
              <p className="text-xs text-zinc-400">Request a copy of the personal data we store associated with your account.</p>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-1">
              <span className="text-xs font-bold text-discord-blurple">Right to Erasure (&ldquo;Be Forgotten&rdquo;)</span>
              <p className="text-xs text-zinc-400">Request complete deletion of your account and any server listings you own.</p>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-1">
              <span className="text-xs font-bold text-discord-blurple">Right to Rectification</span>
              <p className="text-xs text-zinc-400">Correct any inaccurate or outdated information in your profile or server listings.</p>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-1">
              <span className="text-xs font-bold text-discord-blurple">Do Not Sell My Info (CCPA)</span>
              <p className="text-xs text-zinc-400">We do not sell personal data. California residents may exercise opt-out rights anytime.</p>
            </div>
          </div>
          <p className="text-xs text-zinc-400 pt-1">
            To exercise any of these rights, email us at <a href="mailto:privacy@discordserverlink.com" className="text-discord-blurple underline font-mono">privacy@discordserverlink.com</a>.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-3 border-t border-zinc-800 pt-6">
          <h2 className="text-xl font-bold text-white">7. Children&apos;s Privacy (COPPA Compliance)</h2>
          <p>
            DiscordServerLink complies with COPPA and global age regulations. Our services are strictly intended for individuals who are at least <strong>13 years old</strong> (or 16 years old in certain European jurisdictions), consistent with Discord&apos;s Terms of Service. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us immediately and we will delete the data.
          </p>
        </section>

        {/* Section 8 */}
        <section className="space-y-3 border-t border-zinc-800 pt-6">
          <h2 className="text-xl font-bold text-white">8. Data Security &amp; Retention</h2>
          <p>
            We implement industry-standard technical measures, including HTTPS SSL encryption, firewalls, and restricted database access, to protect your data. Server listings remain in our index until deleted by the server owner or removed by moderation staff for policy non-compliance.
          </p>
        </section>

        {/* Section 9 */}
        <section className="space-y-3 border-t border-zinc-800 pt-6">
          <h2 className="text-xl font-bold text-white">9. Contact Our Data Protection Officer</h2>
          <p>
            If you have questions, feedback, or concerns regarding this Privacy Policy or our data handling practices, please contact us:
          </p>
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-1 text-xs sm:text-sm">
            <p><strong>Website:</strong> DiscordServerLink.com</p>
            <p><strong>Privacy Email:</strong> <a href="mailto:privacy@discordserverlink.com" className="text-discord-blurple underline font-mono">privacy@discordserverlink.com</a></p>
            <p><strong>Support Portal:</strong> <Link href="/contact-us" className="text-discord-blurple underline">discordserverlink.com/contact-us</Link></p>
          </div>
        </section>
      </div>
    </div>
  );
}
