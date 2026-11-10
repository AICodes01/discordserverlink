import Link from "next/link";
import { Metadata } from "next";
import { ShieldCheck, FileCheck, AlertTriangle, Users, Flame, Hammer, ExternalLink, HelpCircle } from "lucide-react";
import { SITE_URL, SITE_NAME, generateBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms & Conditions - DiscordServerLink | User Agreement & Guidelines",
  description:
    "Read the Terms & Conditions and User Agreement for DiscordServerLink. Understand community guidelines, listing rules, bump policies, and platform terms of service.",
  alternates: {
    canonical: `${SITE_URL}/terms`,
  },
  openGraph: {
    title: "Terms & Conditions - DiscordServerLink | User Agreement & Guidelines",
    description:
      "Review the DiscordServerLink user agreement, server listing rules, bumping guidelines, and platform terms.",
    url: `${SITE_URL}/terms`,
  },
};

export default function TermsPage() {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Terms & Conditions", url: "/terms" },
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
        <span className="text-zinc-200 font-medium">Terms &amp; Conditions</span>
      </nav>

      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-zinc-900 via-indigo-950/40 to-zinc-900 border border-zinc-800 p-8 sm:p-10 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-discord-blurple/10 border border-discord-blurple/20 text-discord-blurple text-xs font-bold tracking-wide">
            <FileCheck className="w-3.5 h-3.5" />
            <span>Platform Agreement &amp; User Terms</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Terms &amp; Conditions
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400">
            <strong>Effective Date:</strong> November 10, 2026 &bull; <strong>Website:</strong> discordserverlink.com
          </p>
        </div>
      </div>

      {/* Terms Content */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-10 space-y-8 text-sm sm:text-base text-zinc-300 leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>1. Acceptance of Terms</span>
          </h2>
          <p>
            Welcome to <strong>DiscordServerLink.com</strong> (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). By accessing, browsing, or utilizing any portion of DiscordServerLink—including listing Discord servers, discovering communities, browsing Discord bots or emojis, using our free Discord tools, or authenticating via Discord OAuth2—you agree to be legally bound by these Terms &amp; Conditions (&ldquo;Terms&rdquo;) and our{" "}
            <Link href="/privacy-policy" className="text-discord-blurple hover:underline font-medium">
              Privacy Policy
            </Link>.
          </p>
          <p>
            If you do not agree with any provision of these Terms, you must discontinue using DiscordServerLink immediately.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3 border-t border-zinc-800 pt-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>2. Age Eligibility &amp; Discord Affiliation</span>
          </h2>
          <p>
            To use DiscordServerLink, you must be at least <strong>13 years of age</strong> (or the minimum legal age required in your jurisdiction to use Discord services, e.g., 16 in certain European Union countries). By using our services, you warrant that you meet this requirement.
          </p>
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs sm:text-sm flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-400" />
            <div>
              <strong>Independent Platform Notice:</strong> DiscordServerLink is an independent discovery platform and community directory. We are <strong>not affiliated with, endorsed by, sponsored by, or associated with Discord, Inc.</strong> &ldquo;Discord&rdquo; and related logos are trademarks of Discord, Inc.
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-3 border-t border-zinc-800 pt-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>3. Discord Authentication &amp; User Accounts</span>
          </h2>
          <p>
            Certain features—such as adding a server, managing listings, posting reviews, or bumping servers—require logging in via Discord OAuth2. When authenticating:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-zinc-400">
            <li>You only authorize DiscordServerLink to read your public profile information (username, avatar, Discord user ID, and server administrator permissions). We never request access to your password or private Discord messages.</li>
            <li>You are solely responsible for all activities and submissions carried out under your authenticated Discord account.</li>
            <li>You must notify us immediately at <a href="mailto:support@discordserverlink.com" className="text-discord-blurple hover:underline">support@discordserverlink.com</a> if you suspect unauthorized use or compromise of your credentials.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-3 border-t border-zinc-800 pt-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-discord-blurple" />
            <span>4. Server Listing Submission Rules</span>
          </h2>
          <p>
            Community owners and administrators submitting servers to our directory must abide by the following standards at all times:
          </p>
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-zinc-800/50 border border-zinc-700/60">
              <h3 className="font-semibold text-white mb-1.5">Compliance with Discord Terms of Service</h3>
              <p className="text-zinc-400 text-xs sm:text-sm">
                Every listed server must strictly follow the{" "}
                <a
                  href="https://discord.com/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-discord-blurple hover:underline inline-flex items-center gap-1"
                >
                  Discord Terms of Service <ExternalLink className="w-3 h-3" />
                </a>{" "}
                and{" "}
                <a
                  href="https://discord.com/guidelines"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-discord-blurple hover:underline inline-flex items-center gap-1"
                >
                  Community Guidelines <ExternalLink className="w-3 h-3" />
                </a>. Servers promoting raids, harassment, token logging, doxxing, or malicious activity will be immediately banned.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-800/50 border border-zinc-700/60">
              <h3 className="font-semibold text-white mb-1.5">Prohibited Content &amp; Zero Tolerance</h3>
              <p className="text-zinc-400 text-xs sm:text-sm">
                Listings containing or linking to any of the following are strictly prohibited: Child Sexual Abuse Material (CSAM), hate speech, malware, pirated software/keys, self-harm, drug distribution, financial scams, phishing schemes, or illegal services.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-800/50 border border-zinc-700/60">
              <h3 className="font-semibold text-white mb-1.5">Accurate Categorization &amp; NSFW Flagging</h3>
              <p className="text-zinc-400 text-xs sm:text-sm">
                You must select truthful categories, tags, and descriptions. Any community that allows adult, 18+, or mature discussions/content <strong>must be explicitly flagged as NSFW</strong> in the listing settings.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-800/50 border border-zinc-700/60">
              <h3 className="font-semibold text-white mb-1.5">Valid Invite Links</h3>
              <p className="text-zinc-400 text-xs sm:text-sm">
                Invite links must be valid, non-expiring, and point directly to the claimed Discord guild. Listings with broken or deceptive redirect links may be automatically delisted.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section className="space-y-3 border-t border-zinc-800 pt-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <span>5. Server Bumping &amp; Anti-Spam Policy</span>
          </h2>
          <p>
            DiscordServerLink provides a fair &ldquo;Bump&rdquo; system allowing communities to boost their visibility on the front page and category indexes:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-zinc-400">
            <li><strong>Cooldown Interval:</strong> Bumping is governed by an enforced timer (typically once every 2 hours per server).</li>
            <li><strong>Automated Bumping Strictly Prohibited:</strong> You agree not to use automated bots, headless scripts, scraping tools, or macros to trigger bumps.</li>
            <li><strong>Penalties:</strong> Accounts or servers detected using automation to circumvent cooldown timers will face bump suspension or permanent listing deletion.</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="space-y-3 border-t border-zinc-800 pt-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Hammer className="w-5 h-5 text-red-400" />
            <span>6. Content Moderation &amp; Delisting Authority</span>
          </h2>
          <p>
            We take pride in maintaining a safe, high-quality community directory. DiscordServerLink reserves the absolute right, in its sole discretion and without prior notice, to:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-zinc-400">
            <li>Review, edit, reject, suspend, or permanently remove any server listing, bot listing, or emoji submission.</li>
            <li>De-rank or revoke &ldquo;Featured&rdquo; or &ldquo;Partner&rdquo; badges from servers that fail to maintain quality standards.</li>
            <li>Block, restrict, or ban any user account, IP address, or Discord guild found violating these Terms.</li>
            <li>Cooperate with law enforcement agencies and Discord Trust &amp; Safety when required by applicable law.</li>
          </ul>
        </section>

        {/* Section 7 */}
        <section className="space-y-3 border-t border-zinc-800 pt-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>7. Discord Tools &amp; Web Utilities Usage</span>
          </h2>
          <p>
            DiscordServerLink offers free client-side tools (such as Discord PFP Viewer, Invite Checker, Permissions Calculator, Snowflake Timestamp Converter, Markdown Color Text, and Webhook Sender). These utilities are provided for developer, moderator, and community convenience:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-zinc-400">
            <li>You agree not to use our tools (such as the Webhook Sender) for spamming, harassment, denial-of-service, or illicit activities.</li>
            <li>You agree not to execute automated scraping scripts against our API endpoints or reverse-engineer private backend routes.</li>
            <li>We provide tools on an &ldquo;as is&rdquo; basis with no guarantee of 100% continuous uptime or compatibility with Discord API changes.</li>
          </ul>
        </section>

        {/* Section 8 */}
        <section className="space-y-3 border-t border-zinc-800 pt-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>8. Intellectual Property &amp; User License</span>
          </h2>
          <p>
            <strong>Your Content:</strong> You retain all intellectual property rights in the text, server icons, banners, and descriptions you submit. By posting content to DiscordServerLink, you grant us a worldwide, non-exclusive, royalty-free license to host, display, index, format, and share your listing for the purposes of operating and promoting the directory.
          </p>
          <p>
            <strong>Our Platform:</strong> All design assets, codebases, logos, UI designs, and original written copy on DiscordServerLink are the exclusive intellectual property of DiscordServerLink.com. You may not copy, scrape, or republish our platform content without prior written permission.
          </p>
          <p>
            To report copyright infringements, please consult our{" "}
            <Link href="/dmca" className="text-discord-blurple hover:underline font-semibold">
              DMCA &amp; Copyright Policy
            </Link>.
          </p>
        </section>

        {/* Section 9 */}
        <section className="space-y-3 border-t border-zinc-800 pt-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>9. Disclaimer of Warranties &amp; Limitation of Liability</span>
          </h2>
          <p>
            DiscordServerLink is provided on an <strong>&ldquo;AS IS&rdquo;</strong> and <strong>&ldquo;AS AVAILABLE&rdquo;</strong> basis without warranties of any kind, either express or implied.
          </p>
          <p>
            In no event shall DiscordServerLink, its creators, directors, employees, or affiliates be liable for any indirect, incidental, punitive, or consequential damages resulting from:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-zinc-400">
            <li>Actions, statements, or behavior of third-party Discord server owners, moderators, or members.</li>
            <li>Temporary downtime, data corruption, or service interruption caused by hosting providers or Discord API outages.</li>
            <li>Unauthorized access to or alteration of your submissions.</li>
          </ul>
        </section>

        {/* Section 10 */}
        <section className="space-y-3 border-t border-zinc-800 pt-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>10. Changes to These Terms</span>
          </h2>
          <p>
            We may revise these Terms &amp; Conditions from time to time to reflect platform updates, regulatory changes, or new features. When updates occur, we will update the &ldquo;Effective Date&rdquo; at the top of this document. Continued use of DiscordServerLink following published revisions constitutes your acceptance of the updated Terms.
          </p>
        </section>

        {/* Section 11 */}
        <section className="space-y-3 border-t border-zinc-800 pt-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>11. Contact Information</span>
          </h2>
          <p>
            For any legal inquiries, terms clarification, or general questions regarding these Terms &amp; Conditions, please reach out to us:
          </p>
          <div className="p-4 rounded-2xl bg-zinc-800/40 border border-zinc-700/60 space-y-1 text-sm">
            <p><strong>Website:</strong> DiscordServerLink.com</p>
            <p><strong>Legal &amp; Support Email:</strong> <a href="mailto:support@discordserverlink.com" className="text-discord-blurple hover:underline">support@discordserverlink.com</a></p>
            <p><strong>Contact Form:</strong> <Link href="/contact-us" className="text-discord-blurple hover:underline">discordserverlink.com/contact-us</Link></p>
          </div>
        </section>
      </div>

      {/* Helpful Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <Link
          href="/privacy-policy"
          className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-discord-blurple transition block group"
        >
          <h3 className="font-bold text-white group-hover:text-discord-blurple transition text-sm">
            Privacy Policy &rarr;
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Learn how we protect your personal information and cookie preferences.
          </p>
        </Link>

        <Link
          href="/disclaimer"
          className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-discord-blurple transition block group"
        >
          <h3 className="font-bold text-white group-hover:text-discord-blurple transition text-sm">
            Disclaimer &rarr;
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Read our Discord non-affiliation and user-generated content disclaimer.
          </p>
        </Link>

        <Link
          href="/dmca"
          className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-discord-blurple transition block group"
        >
          <h3 className="font-bold text-white group-hover:text-discord-blurple transition text-sm">
            DMCA Policy &rarr;
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Guidelines on copyright notices and intellectual property protection.
          </p>
        </Link>
      </div>
    </div>
  );
}
