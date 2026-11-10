import Link from "next/link";
import { Metadata } from "next";
import {
  Mail,
  MessageSquare,
  ShieldAlert,
  Clock,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import ContactFormClient from "@/components/contact/ContactFormClient";
import { SITE_URL, SITE_NAME, generateBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact Us - DiscordServerLink Support & Community Help",
  description:
    "Get in touch with the DiscordServerLink team. Submit general inquiries, report server violations, request verification badges, or inquire about partnerships. Fast 24-48h response time.",
  alternates: {
    canonical: `${SITE_URL}/contact-us`,
  },
  openGraph: {
    title: "Contact Us - DiscordServerLink Support & Community Help",
    description:
      "Have questions or need support? Contact the DiscordServerLink team for server assistance, verification requests, or DMCA inquiries.",
    url: `${SITE_URL}/contact-us`,
  },
};

export default function ContactUsPage() {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Contact Us", url: "/contact-us" },
  ]);

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact DiscordServerLink Support",
    description: "Official contact and support portal for DiscordServerLink.com users and server owners.",
    url: `${SITE_URL}/contact-us`,
    mainEntity: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      email: "support@discordserverlink.com",
    },
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-zinc-400">
        <Link href="/" className="hover:text-white transition">
          Home
        </Link>
        <span>/</span>
        <span className="text-zinc-200 font-medium">Contact Us</span>
      </nav>

      {/* Hero Header */}
      <div className="rounded-3xl bg-gradient-to-r from-zinc-900 via-indigo-950/40 to-zinc-900 border border-zinc-800 p-8 sm:p-12 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-discord-blurple/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-discord-blurple/10 border border-discord-blurple/20 text-discord-blurple text-xs font-bold tracking-wide">
            <Mail className="w-3.5 h-3.5" />
            <span>Support &amp; Community Help</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            How Can We <span className="text-discord-blurple">Help You Today?</span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
            Have questions about listing your server, reporting content, requesting partner badges, or exploring advertising opportunities? Our support team is here to assist you.
          </p>
        </div>
      </div>

      {/* Contact Grid: Form & Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Form (2 cols) */}
        <div className="lg:col-span-2 bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white">Send Us a Direct Message</h2>
            <p className="text-xs text-zinc-400">
              Fill out the form below and our staff will respond to your email address within 24 to 48 hours.
            </p>
          </div>

          <ContactFormClient />
        </div>

        {/* Right Column: Channels & Guidelines (1 col) */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4 shadow-md">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-zinc-800 pb-3 flex items-center gap-2">
              <Mail className="w-4 h-4 text-discord-blurple" />
              <span>Direct Inquiries</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-zinc-500 block">General Support:</span>
                <a
                  href="mailto:support@discordserverlink.com"
                  className="font-mono text-zinc-200 hover:text-discord-blurple font-medium"
                >
                  support@discordserverlink.com
                </a>
              </div>

              <div>
                <span className="text-zinc-500 block">Copyright &amp; DMCA:</span>
                <a
                  href="mailto:dmca@discordserverlink.com"
                  className="font-mono text-zinc-200 hover:text-discord-blurple font-medium"
                >
                  dmca@discordserverlink.com
                </a>
              </div>

              <div>
                <span className="text-zinc-500 block">Privacy Concerns:</span>
                <a
                  href="mailto:privacy@discordserverlink.com"
                  className="font-mono text-zinc-200 hover:text-discord-blurple font-medium"
                >
                  privacy@discordserverlink.com
                </a>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-3 shadow-md">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Response Times</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Our moderation and support staff monitor inquiries Monday through Friday. Critical security issues and DMCA takedowns are prioritized immediately.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-3 shadow-md">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>Reporting a Server</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              If a server violates Discord Community Guidelines (e.g. scams, malware, harassment), select &ldquo;Report a Server&rdquo; in the dropdown and provide the listing URL and screenshot proof.
            </p>
          </div>
        </div>
      </div>

      {/* Contact FAQ */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-discord-blurple" />
          <span>Frequently Asked Questions</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-1.5">
            <h3 className="text-sm font-bold text-white">How do I verify or claim my server?</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Contact us using the form with your server URL and discord guild ID. An administrator will verify server ownership and assign the Verified badge.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-1.5">
            <h3 className="text-sm font-bold text-white">Can I remove my server listing?</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Yes. If you own the Discord server, message us with the invite code and we will promptly remove your server from the index.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-1.5">
            <h3 className="text-sm font-bold text-white">How do I submit custom emojis?</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Visit our{" "}
              <Link href="/emojis" className="text-discord-blurple underline font-semibold">
                Discord Emojis Page
              </Link>{" "}
              where you can use our free submission form to share your unique emoji packs.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-1.5">
            <h3 className="text-sm font-bold text-white">Do you offer sponsored advertising?</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Yes! We offer banner placement and featured server spots. Select &ldquo;Advertising&rdquo; in the subject dropdown for rate sheets and traffic stats.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
