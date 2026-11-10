import Link from "next/link";
import { Metadata } from "next";
import { ShieldCheck, FileText, AlertCircle, Mail, HelpCircle, ExternalLink } from "lucide-react";
import { SITE_URL, SITE_NAME, generateBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "DMCA Policy - DiscordServerLink | Copyright Infringement & Takedown Notices",
  description:
    "Read the DiscordServerLink DMCA & Copyright Policy. Instructions for copyright owners to submit a Digital Millennium Copyright Act takedown notice or counter-notification.",
  alternates: {
    canonical: `${SITE_URL}/dmca`,
  },
  openGraph: {
    title: "DMCA Policy - DiscordServerLink | Copyright Infringement & Takedown Notices",
    description:
      "Learn how DiscordServerLink handles copyright notices and intellectual property rights under the Digital Millennium Copyright Act.",
    url: `${SITE_URL}/dmca`,
  },
};

export default function DmcaPage() {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "DMCA Policy", url: "/dmca" },
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
        <span className="text-zinc-200 font-medium">DMCA Policy</span>
      </nav>

      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-zinc-900 via-indigo-950/40 to-zinc-900 border border-zinc-800 p-8 sm:p-10 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-discord-blurple/10 border border-discord-blurple/20 text-discord-blurple text-xs font-bold tracking-wide">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Intellectual Property Protection</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            DMCA &amp; Copyright Policy
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400">
            <strong>Applicable Framework:</strong> Digital Millennium Copyright Act (17 U.S.C. § 512) &bull; <strong>Website:</strong> discordserverlink.com
          </p>
        </div>
      </div>

      {/* DMCA Content */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-10 space-y-8 text-sm sm:text-base text-zinc-300 leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">1. Respect for Intellectual Property</h2>
          <p>
            DiscordServerLink.com respects the intellectual property rights of creators, artists, brands, and developers. It is our policy to respond expeditiously to legitimate notices of alleged copyright infringement in full compliance with the <strong>Digital Millennium Copyright Act (&ldquo;DMCA&rdquo;)</strong> and international copyright laws.
          </p>
          <p>
            Upon receipt of a valid and complete DMCA notice, we will remove or disable access to the allegedly infringing material (such as server listings, custom emojis, banners, or bot entries) hosted directly on DiscordServerLink.com.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3 border-t border-zinc-800 pt-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-discord-blurple" />
            <span>2. Designated DMCA Agent Contact Information</span>
          </h2>
          <p>
            All formal notices of claimed infringement regarding content hosted on DiscordServerLink.com must be sent to our Designated Copyright Agent:
          </p>
          <div className="p-5 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-1.5 text-xs sm:text-sm font-mono text-zinc-300">
            <p className="font-bold text-white text-sm font-sans">DMCA Compliance Officer</p>
            <p><strong>Website:</strong> DiscordServerLink.com</p>
            <p><strong>Email:</strong> <a href="mailto:dmca@discordserverlink.com" className="text-discord-blurple underline">dmca@discordserverlink.com</a></p>
            <p><strong>Support Ticket:</strong> <Link href="/contact-us" className="text-discord-blurple underline font-sans">Submit via Contact Form</Link></p>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-4 border-t border-zinc-800 pt-6">
          <h2 className="text-xl font-bold text-white">3. How to File a Valid DMCA Notice</h2>
          <p>
            To ensure swift processing under 17 U.S.C. § 512(c)(3), your written notice must include all of the following elements:
          </p>
          <div className="space-y-3">
            {[
              {
                num: "1",
                title: "Identification of Copyrighted Work",
                desc: "A description of the copyrighted work you claim has been infringed, or a representative list if multiple works are involved.",
              },
              {
                num: "2",
                title: "Specific URL of Infringing Material",
                desc: "The exact URL(s) on DiscordServerLink.com where the allegedly infringing listing, banner, or emoji pack is located.",
              },
              {
                num: "3",
                title: "Your Contact Information",
                desc: "Your legal full name, address, telephone number, and active email address.",
              },
              {
                num: "4",
                title: "Good Faith Statement",
                desc: "The following statement: “I have a good faith belief that the use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.”",
              },
              {
                num: "5",
                title: "Accuracy Statement Under Penalty of Perjury",
                desc: "The following statement: “The information in this notification is accurate, and under penalty of perjury, I am the owner, or an agent authorized to act on behalf of the owner, of an exclusive right that is allegedly infringed.”",
              },
              {
                num: "6",
                title: "Physical or Electronic Signature",
                desc: "A physical or electronic signature of the copyright owner or authorized representative (typing your full legal name is legally sufficient).",
              },
            ].map((item) => (
              <div
                key={item.num}
                className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-xs sm:text-sm space-y-1"
              >
                <span className="font-bold text-discord-blurple">Step {item.num}: {item.title}</span>
                <p className="text-zinc-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-3 border-t border-zinc-800 pt-6">
          <h2 className="text-xl font-bold text-white">4. Counter-Notification Procedure</h2>
          <p>
            If your server listing or submitted emoji pack was removed due to a DMCA notice and you believe this was due to a mistake or misidentification (e.g. you possess a valid license or fair use applies), you may submit a Counter-Notification pursuant to 17 U.S.C. § 512(g)(3).
          </p>
          <p className="text-xs sm:text-sm text-zinc-400">
            A counter-notification must include your name, address, phone number, the removed URL, a statement under penalty of perjury that you have a good faith belief the material was removed by mistake, your consent to federal court jurisdiction, and your signature. Upon receipt, we forward the counter-notice to the original complainant. If they do not file a court action within 10-14 business days, the material may be restored.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3 border-t border-zinc-800 pt-6">
          <h2 className="text-xl font-bold text-white">5. Repeat Infringer Policy</h2>
          <p>
            In accordance with the DMCA and other applicable intellectual property laws, DiscordServerLink maintains a strict repeat infringer policy. We reserve the right to terminate accounts, permanently blacklist server invite codes, and refuse future submissions from users who repeatedly infringe upon intellectual property rights.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3 border-t border-zinc-800 pt-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            <span>6. Important: Content Inside Private Discord Channels</span>
          </h2>
          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-xs sm:text-sm space-y-2 text-zinc-300">
            <p>
              Please note that <strong>DiscordServerLink.com only indexes public invite links and community preview cards</strong>. We do not host, store, or have administrative access to files, messages, streams, or voice recordings shared inside private Discord servers.
            </p>
            <p>
              If your copyrighted work is being pirated or distributed inside a Discord server itself, you should submit a DMCA takedown directly to Discord Inc.&apos;s official Trust &amp; Safety team at{" "}
              <a
                href="https://discord.com/safety"
                target="_blank"
                rel="noopener noreferrer"
                className="text-discord-blurple underline font-semibold"
              >
                discord.com/safety
              </a>{" "}
              or email <code className="text-zinc-200">copyright@discord.com</code>.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
