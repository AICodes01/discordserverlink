import Link from "next/link";
import {
  CheckCircle2,
  ExternalLink,
  PlusCircle,
  Sparkles,
  Bot,
  ShieldCheck,
  HelpCircle,
  Share2,
} from "lucide-react";

export default function BotSEOContent() {
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Add Bots to Discord Server",
    description:
      "A complete 7-step guide to adding and authorizing bots on your Discord server in 2026.",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Explore the list of Bots",
        text: "Explore the list of Bots above and choose the right one for you.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Click on the Bot Link",
        text: "Click on the Bot Link on the right hand side and you’ll land at the official Discord Bot website.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Click the Invite Link",
        text: "On the official page, Click on the “Invite” Link and it’ll take you to Discord’s authorization page for the bot.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Login & Select Server",
        text: "Now Login to your Discord Account and Select “Server”.",
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "Review Permissions & Authorize",
        text: "Review the requested permissions the bot needs and Click “Authorize.”",
      },
      {
        "@type": "HowToStep",
        position: 6,
        name: "Bot Joins Server",
        text: "After authorization, the bot will join your server and usually send a welcome message or setup instructions.",
      },
      {
        "@type": "HowToStep",
        position: 7,
        name: "Configure Bot Settings",
        text: "Use the bot’s documentation, commands, or dashboard to set it up according to your needs.",
      },
    ],
  };

  const steps = [
    {
      num: "Step #1",
      title: "Explore the List of Bots",
      text: "Explore the list of Bots above and choose the right one for you.",
    },
    {
      num: "Step #2",
      title: "Visit the Official Bot Link",
      text: "Click on the Bot Link on the right hand side and you’ll land at the official Discord Bot website.",
    },
    {
      num: "Step #3",
      title: "Click on the Invite Link",
      text: "On the official page, Click on the “Invite” Link and it’ll take you to Discord’s authorization page for the bot.",
    },
    {
      num: "Step #4",
      title: "Login & Select Server",
      text: (
        <>
          Now Login to your{" "}
          <a
            href="https://discord.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-discord-blurple underline font-semibold hover:text-discord-hover"
          >
            Discord Account
          </a>{" "}
          and Select “Server”.
        </>
      ),
    },
    {
      num: "Step #5",
      title: "Review Permissions & Authorize",
      text: "Review the requested permissions the bot needs and Click “Authorize.”",
    },
    {
      num: "Step #6",
      title: "Receive Welcome Message",
      text: "After authorization, the bot will join your server and usually send a welcome message or setup instructions.",
    },
    {
      num: "Step #7",
      title: "Configure Commands & Dashboard",
      text: "Use the bot’s documentation, commands, or dashboard to set it up according to your needs.",
    },
  ];

  return (
    <section className="mt-16 pt-12 border-t border-zinc-800/80 space-y-12">
      {/* HowTo Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      {/* Section 1: Discord Bots 2026 Overview */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Complete Automation Guide</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Discord Bots 2026
            </h2>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              Discord Bots are one of the most powerful and essential tool for Servers to automate tasks that are ordinarily performed by humans, such as sending private chats, texts, better moderation, engagement tasks and more. Adding any bot to your server to automate tasks, you don’t need to write a single line of code. Anyone can add bots on discord servers with a few clicks. The right bot can make a big difference in your server and improve community involvement.
            </p>
          </div>

          <Link
            href="/bots/new"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-discord-blurple hover:bg-discord-hover text-white text-sm font-bold shadow-glow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>List Your Bot Free</span>
          </Link>
        </div>

        {/* Specification Table */}
        <div className="pt-4">
          <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-950/60">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-900/90 text-xs uppercase font-bold text-zinc-400 border-b border-zinc-800">
                <tr>
                  <th scope="col" className="px-6 py-3.5 text-white">
                    Discord Bots Specification
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-white">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
                <tr className="hover:bg-zinc-900/40 transition-colors">
                  <td className="px-6 py-3.5 font-semibold text-white flex items-center gap-2">
                    <Bot className="w-4 h-4 text-discord-blurple" />
                    <span>Discord Bots</span>
                  </td>
                  <td className="px-6 py-3.5 text-discord-blurple font-semibold">
                    Invite Links (Direct Official OAuth2)
                  </td>
                </tr>
                <tr className="hover:bg-zinc-900/40 transition-colors">
                  <td className="px-6 py-3.5 font-semibold text-white">Total Bots</td>
                  <td className="px-6 py-3.5 text-emerald-400 font-bold">600+</td>
                </tr>
                <tr className="hover:bg-zinc-900/40 transition-colors">
                  <td className="px-6 py-3.5 font-semibold text-white">Benefits</td>
                  <td className="px-6 py-3.5 font-medium">Automate Tasks</td>
                </tr>
                <tr className="hover:bg-zinc-900/40 transition-colors">
                  <td className="px-6 py-3.5 font-semibold text-white">Type</td>
                  <td className="px-6 py-3.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-xs border border-emerald-500/20">
                      Free
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-zinc-900/40 transition-colors">
                  <td className="px-6 py-3.5 font-semibold text-white">Update</td>
                  <td className="px-6 py-3.5 text-zinc-300">Regular (2026 Directory)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Section 2: How to Add Bots to Discord Server? */}
      <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 sm:p-10 space-y-8">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Step-by-Step Instructions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            How to Add Bots to Discord Server?
          </h2>
          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
            Adding the right bots on your server enriches your Discord experience with moderation, games, utilities, and more in just a few clicks. Following the steps below, you can add bot to your server and automate various types of tasks.
          </p>
        </div>

        {/* 7-Step Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {steps.map((s, index) => (
            <div
              key={index}
              className={`rounded-2xl p-5 border transition-all ${
                index === 6
                  ? "md:col-span-2 lg:col-span-3 bg-gradient-to-r from-zinc-900 via-indigo-950/30 to-zinc-900 border-indigo-500/30"
                  : "bg-zinc-950/60 border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <div className="flex items-center gap-2.5 mb-2.5">
                <span className="px-2.5 py-1 rounded-lg bg-discord-blurple/20 text-discord-blurple border border-discord-blurple/30 font-bold text-xs">
                  {s.num}
                </span>
                <h3 className="font-bold text-white text-sm">{s.title}</h3>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Conclusion */}
      <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-white">Conclusion</h2>
        <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
          These are the Top Discord Bots in 2026 that can help you manage, grow, and make your server more fun. Whether you want moderation, music, games, or just to keep your community engaged, these bots are the best picks for this year. Don’t overload your server with too many bots, choose the ones that really fit your community’s needs.
        </p>
      </div>

      {/* Section 4: Developer Promotion & CTA */}
      <div className="rounded-3xl bg-gradient-to-r from-discord-blurple/20 via-zinc-900 to-indigo-950/30 border border-discord-blurple/30 p-8 sm:p-10 relative overflow-hidden shadow-2xl">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-discord-blurple/30 border border-discord-blurple/50 text-indigo-300 text-xs font-bold">
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Developer Promotion</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            List Your Discord Bot for Free on DiscordServerLink.com
          </h2>
          <p className="text-zinc-200 text-sm sm:text-base leading-relaxed">
            Users can also list their own Discord Bots here on{" "}
            <Link
              href="/"
              className="text-white font-bold underline decoration-discord-blurple underline-offset-4 hover:text-discord-blurple"
            >
              DiscordServerLink.com
            </Link>{" "}
            for free promotion and reach targeted server owners. If you found this post helpful, don’t forget to share it with others and visit us again for more Discord Bots.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/bots/new"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-discord-blurple hover:bg-discord-hover text-white text-sm font-bold shadow-glow-sm hover:shadow-glow transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Add Your Bot Now</span>
            </Link>
            <Link
              href="/bots"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 text-sm font-semibold transition-all"
            >
              <Bot className="w-4 h-4" />
              <span>Browse All Bots</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
