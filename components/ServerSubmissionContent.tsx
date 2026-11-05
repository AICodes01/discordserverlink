import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Globe,
  Target,
  Rocket,
  CheckCircle2,
  Info,
  ExternalLink,
  Users,
  Sparkles,
} from "lucide-react";

export default function ServerSubmissionContent() {
  const rules = [
    {
      title: "Valid Invite Link",
      desc: "The invite link must be active and not expired.",
    },
    {
      title: "Correct Category",
      desc: "Submit your server under the right category (Gaming, Chat, Business, etc.).",
    },
    {
      title: "Clear Server Name & Description",
      desc: "Avoid misleading titles or spammy descriptions.",
    },
    {
      title: "Respect Community Guidelines",
      desc: "Servers promoting hate speech, harassment, scams, or spam will be rejected.",
    },
    {
      title: "One Submission Per Server",
      desc: "Don’t submit the same server multiple times.",
    },
    {
      title: "Proper Server Setup",
      desc: "Make sure your server has channels, rules, and is ready for new members.",
    },
    {
      title: "No Fake/Empty Servers",
      desc: "Servers with little to no content or members won’t be approved.",
    },
    {
      title: "Right to Review/Remove",
      desc: "Our team has the right to reject or remove any server that violates these rules.",
    },
  ];

  const benefits = [
    {
      icon: "🌍",
      title: "Free Exposure to Millions",
      desc: "Every day, thousands of users visit our directory to look for active and engaging Discord servers. Your server will appear in searches based on your niche or theme, giving you the chance to connect with people who are truly interested.",
    },
    {
      icon: "🎯",
      title: "Reach the Right Audience",
      desc: "Our categories and tags make sure your server is shown to the right people. Whether it’s gaming, education, art, tech, or any other niche, your server will be placed in the right section where users are most likely to join.",
    },
    {
      icon: "🚀",
      title: "Boost Server Growth",
      desc: "Listing your server in our directory helps you grow faster without spending on ads. It works alongside your other promotions to bring in real, active members who want to be part of your community.",
    },
    {
      icon: "✅",
      title: "Build Server Trust",
      desc: "Being listed in a well-maintained directory shows new members that your server is safe, active, and worth joining. It increases your credibility and helps attract quality members.",
    },
  ];

  return (
    <section className="space-y-10 pt-6">
      {/* Rules for Submission */}
      <div className="rounded-3xl bg-zinc-900/60 border border-zinc-800 p-6 sm:p-10 space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Community Guidelines</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Rules for Submission
          </h2>
          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
            To keep our directory safe, active, and valuable for everyone, please follow these rules when submitting your server:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
          {rules.map((rule, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1 hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-discord-blurple/20 text-discord-blurple text-xs font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <h3 className="font-bold text-white text-sm">{rule.title}</h3>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 pl-7 leading-relaxed">
                {rule.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits of Submitting your Server */}
      <div className="rounded-3xl bg-zinc-900/60 border border-zinc-800 p-6 sm:p-10 space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Rocket className="w-3.5 h-3.5" />
            <span>Organic Growth & Visibility</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Benefits of Submitting your Server
          </h2>
          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
            With millions of Discord users around the world, it’s not always easy to stand out and grow your server. That’s where our directory helps. We provide a trusted place where users can find servers that match their interests and needs. By adding your server here, you get:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {benefits.map((b, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 space-y-2 hover:border-emerald-500/30 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xl">{b.icon}</span>
                <h3 className="font-bold text-white text-base">{b.title}</h3>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {b.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Why DiscordServerLink.Com */}
      <div className="rounded-3xl bg-zinc-900/60 border border-zinc-800 p-6 sm:p-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Platform Standards</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white">
          Why DiscordServerLink.Com
        </h2>
        <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
          The DiscordServerLink.com focus on quality and user experience. Every submission is moderated, and inactive or spam servers are removed. Only active and engaging communities are promoted here. Our platform is also fully optimized for both desktop and mobile, so users can easily find and join your server anytime, from any device.
        </p>
      </div>

      {/* Conclusion */}
      <div className="rounded-3xl bg-gradient-to-r from-zinc-900 via-indigo-950/30 to-zinc-900 border border-indigo-500/30 p-6 sm:p-10 space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-white">
          Conclusion
        </h2>
        <div className="space-y-3 text-zinc-300 text-sm sm:text-base leading-relaxed">
          <p>
            Submitting your Discord server to our directory is the easiest way to grow your community for free. With thousands of daily visitors, your server can reach the right audience, attract genuine members, and build lasting engagement. Our platform is simple, safe, and designed to give your server maximum visibility.
          </p>
          <p className="font-semibold text-white">
            Submit your server today and start connecting with new friends, fans, and active members from around the world!
          </p>
          <p className="text-xs sm:text-sm text-zinc-400">
            We work hard to keep our directory updated with only the best and most active Discord servers. If you find this platform helpful, please share it with your friends and visit us again for new server listings.
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="rounded-2xl bg-zinc-950/60 border border-zinc-800/80 p-5 space-y-2">
        <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold uppercase tracking-wider">
          <Info className="w-4 h-4 text-zinc-500" />
          <span>Disclaimer</span>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Disclaimer: We are not affiliated with Discord. All servers listed here are submitted by users and reviewed before publishing. We do not control the content or activity inside these servers. Please join at your own discretion and follow each server’s rules.
        </p>
      </div>
    </section>
  );
}
