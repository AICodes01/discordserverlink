import Link from "next/link";
import { Metadata } from "next";
import { AlertTriangle, ShieldAlert, CheckCircle2, Globe, ExternalLink, HelpCircle } from "lucide-react";
import { SITE_URL, SITE_NAME, generateBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Disclaimer - DiscordServerLink | Non-Affiliation & User Content Notice",
  description:
    "Official Disclaimer for DiscordServerLink.com. Important notices regarding our non-affiliation with Discord Inc., third-party user-generated content, external invite links, and liability limitations.",
  alternates: {
    canonical: `${SITE_URL}/disclaimer`,
  },
  openGraph: {
    title: "Disclaimer - DiscordServerLink | Non-Affiliation & User Content Notice",
    description:
      "Important disclaimers for DiscordServerLink. Non-affiliation with Discord Inc., user-generated content notices, and terms of use.",
    url: `${SITE_URL}/disclaimer`,
  },
};

export default function DisclaimerPage() {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Disclaimer", url: "/disclaimer" },
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
        <span className="text-zinc-200 font-medium">Disclaimer</span>
      </nav>

      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-zinc-900 via-amber-950/40 to-zinc-900 border border-zinc-800 p-8 sm:p-10 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold tracking-wide">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Important Legal Notice</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Website &amp; Content Disclaimer
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400">
            <strong>Last Updated:</strong> November 2026 &bull; <strong>Website:</strong> discordserverlink.com
          </p>
        </div>
      </div>

      {/* Disclaimer Content */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-10 space-y-8 text-sm sm:text-base text-zinc-300 leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>1. Non-Affiliation with Discord, Inc.</span>
          </h2>
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs sm:text-sm space-y-2">
            <p className="font-bold">
              IMPORTANT NOTICE: DiscordServerLink.com is an independent community directory and search service. We are NOT affiliated with, associated with, authorized by, endorsed by, or in any way officially connected with Discord, Inc., or any of its subsidiaries or its affiliates.
            </p>
            <p className="text-zinc-300">
              The official Discord website can be found at <a href="https://discord.com/" target="_blank" rel="noopener noreferrer" className="underline font-semibold text-white">https://discord.com</a>. The name &ldquo;Discord&rdquo; as well as related names, marks, emblems, and images are registered trademarks of their respective owners.
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section className="space-y-3 border-t border-zinc-800 pt-6">
          <h2 className="text-xl font-bold text-white">2. User-Generated Content (UGC)</h2>
          <p>
            The majority of the content displayed on DiscordServerLink — including server names, server descriptions, tags, icons, banners, member reviews, and bot profiles — is submitted by third-party server owners and users.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-zinc-400">
            <li>We do not actively endorse, monitor, or manage the internal conversations, audio calls, voice lounges, or conduct within any individual Discord server listed on our directory.</li>
            <li>The views, opinions, and rules expressed inside individual communities belong solely to their respective server creators and moderators.</li>
            <li>While we make reasonable efforts to remove servers that violate our policies or Discord&apos;s Community Guidelines, we cannot guarantee that every listed server is free from offensive or objectionable content.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3 border-t border-zinc-800 pt-6">
          <h2 className="text-xl font-bold text-white">3. External Links &amp; Invitations</h2>
          <p>
            Our website contains links that redirect users to third-party domains, primarily <code className="text-zinc-200">discord.gg</code> and <code className="text-zinc-200">discord.com/invite</code>. When you click &ldquo;Join Discord Server&rdquo; or external bot authorization links, you leave DiscordServerLink.com and enter an external service governed by separate terms and privacy policies.
          </p>
          <p className="text-xs sm:text-sm text-zinc-400">
            We have no control over the privacy practices, uptime, or content of external sites and assume no liability for interactions, downloads, transactions, or communications conducted once you leave our website.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3 border-t border-zinc-800 pt-6">
          <h2 className="text-xl font-bold text-white">4. User Safety &amp; Age-Restricted Content</h2>
          <p>
            Every user is individually responsible for ensuring their personal safety when interacting on Discord:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-zinc-400">
            <li>Never share private personal information, real addresses, passwords, or financial credentials with unfamiliar server members.</li>
            <li>Servers containing mature or adult themes must be properly marked with the NSFW tag on DiscordServerLink and Discord. Users under the age of 18 are prohibited from entering adult-classified channels.</li>
            <li>We strongly advise parents and guardians to monitor minor accounts and review Discord&apos;s Parental Guidance resources.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-3 border-t border-zinc-800 pt-6">
          <h2 className="text-xl font-bold text-white">5. &ldquo;As-Is&rdquo; &amp; &ldquo;As-Available&rdquo; Warranty Disclaimer</h2>
          <p>
            The services, tools, search engines, and directories on DiscordServerLink.com are provided strictly on an <strong>&ldquo;AS IS&rdquo;</strong> and <strong>&ldquo;AS AVAILABLE&rdquo;</strong> basis without warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement.
          </p>
          <p className="text-xs sm:text-sm text-zinc-400">
            We do not warrant that our service will be uninterrupted, error-free, secure, or free of viruses. Member counts and server rankings fluctuate in real time and are provided for informational and discovery purposes only.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3 border-t border-zinc-800 pt-6">
          <h2 className="text-xl font-bold text-white">6. Reporting Content &amp; Inquiries</h2>
          <p>
            If you encounter a server listing on our site that promotes scams, illegal activities, or violates Discord Community Guidelines, please inform us immediately. We take community safety seriously and will review the listing promptly:
          </p>
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-1 text-xs sm:text-sm">
            <p><strong>Report Abuse:</strong> <Link href="/contact-us" className="text-discord-blurple underline font-semibold">Contact Support Form</Link></p>
            <p><strong>Direct Email:</strong> <a href="mailto:support@discordserverlink.com" className="text-discord-blurple underline font-mono">support@discordserverlink.com</a></p>
            <p><strong>DMCA Notices:</strong> <Link href="/dmca" className="text-discord-blurple underline font-semibold">DMCA Copyright Policy</Link></p>
          </div>
        </section>
      </div>
    </div>
  );
}
