import Link from "next/link";
import {
  Compass,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  PlusCircle,
  LogOut,
  Trash2,
  Link as LinkIcon,
  Sparkles,
  Layers,
  ArrowRight,
  Info,
  BookOpen,
} from "lucide-react";
import { generateFAQSchema } from "@/lib/seo";

export default function HomeSEOContent() {
  const faqs = [
    {
      question: "How can I find Discord servers?",
      answer:
        "You can find Discord servers using the Server Discovery feature directly from Discord. However, you can visit an external Discord Server Directory website like DiscordServerLink.com. You can search servers here by tags, keywords, and categories to find active communities for your hobbies and interests.",
    },
    {
      question: "Where can I find Discord server links?",
      answer:
        "You can find the largest collection of Discord servers and communities for every interest on DiscordServerLink.com, updated with fresh, verified invite links.",
    },
    {
      question: "How do I join a Discord server?",
      answer:
        "To join a Discord server, you need the invite link of that particular server. On DiscordServerLink.com, simply tap on the 'Join Server' link on any server profile to join instantly through your Discord app or web browser.",
    },
    {
      question: "How to join a Discord server without a link?",
      answer:
        "You can join a Discord server without a link from the Server Discovery feature within the Discord app or desktop client, or search public server lists on DiscordServerLink.com to get instant access.",
    },
  ];

  const faqSchema = generateFAQSchema(faqs);

  const popularTags = [
    "Friends",
    "Dating",
    "Gaming",
    "Study",
    "Tech",
    "Art",
    "Crypto",
    "Fun",
    "Social",
    "Hangout",
    "Minecraft",
    "Giveaways",
  ];

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
      {/* FAQ Schema for Google Search Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="rounded-3xl bg-zinc-900/40 border border-zinc-800/80 p-6 sm:p-10 space-y-12 backdrop-blur-sm">
        {/* Main SEO Intro Header */}
        <div className="space-y-4 border-b border-zinc-800/80 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-discord-blurple/10 border border-discord-blurple/20 text-xs font-semibold text-discord-blurple">
            <Compass className="w-3.5 h-3.5" />
            <span>Ultimate Discord Directory Guide</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
            Discord Servers List, Discord Servers to Join, Discord Servers with Tags
          </h2>

          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
            Welcome to the No.1 Discord Server Join Link directory website{" "}
            <Link
              href="/"
              className="text-discord-blurple hover:underline font-semibold"
            >
              DiscordServerLink.com
            </Link>
            . Find public Discord servers to join and chat, or{" "}
            <Link
              href="/servers/new"
              className="text-discord-blurple hover:underline font-semibold"
            >
              list your server here for free
            </Link>
            .
          </p>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            Find and join some awesome servers listed here tagged with{" "}
            {popularTags.map((tag, idx) => (
              <span key={tag}>
                <Link
                  href={`/tag/${tag.toLowerCase()}`}
                  className="text-zinc-200 hover:text-discord-blurple font-medium hover:underline"
                >
                  #{tag}
                </Link>
                {idx < popularTags.length - 1 ? ", " : ""}
              </span>
            ))}
            , and more. Browse millions of Discord server Join Links and join the perfect
            community for you, from casual chats to niche communities.
          </p>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            DiscordServerLink.com is the largest community of Discord Server Links, offering you the
            opportunity to find and join various servers from anywhere in the world. Explore the
            servers list below and join now.
          </p>
        </div>

        {/* Section: Discord Servers Link List 2026 */}
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-discord-blurple" />
            <span>Discord Servers Link List 2026</span>
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Discord is an online communication platform or virtual space that connects users
            through text, voice, and video calls through servers. There are millions of servers
            available on Discord covering different topics and interests. Here you can browse
            Discord servers by{" "}
            <Link href="/servers" className="text-discord-blurple hover:underline font-semibold">
              Tags
            </Link>{" "}
            and{" "}
            <Link href="/categories" className="text-discord-blurple hover:underline font-semibold">
              Category
            </Link>{" "}
            to quickly find the relevant servers of your interest, language, and preference. Find the
            right server here for you and join.
          </p>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Servers are created to bring people together from worldwide and build a strong
            community to share interest in particular topics, such as online gaming, specific
            hobbies, study groups, friendship, dating, making money online, and more. Users can join
            public or invite-only servers through a direct join link on this website. You can easily
            join your desired server within a few clicks using invite links. Find the right server
            link below and join instantly.
          </p>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Here we have listed fresh and quality server links organized by category and tag. To
            improve the user’s experience, invite links are revalidated on a schedule to remove dead
            links to save your valuable time finding and joining the right server to talk, play, &
            hangout.
          </p>
          <p className="text-sm text-zinc-400 leading-relaxed">
            DiscordServerLink.com is the best place to find the latest and active Discord server
            links on various categories, including{" "}
            <Link href="/category/education" className="text-zinc-200 hover:text-white underline">
              Education & Learning
            </Link>
            ,{" "}
            <Link href="/category/community" className="text-zinc-200 hover:text-white underline">
              Sports & Fitness
            </Link>
            ,{" "}
            <Link href="/category/gaming" className="text-zinc-200 hover:text-white underline">
              Fun & Entertainment
            </Link>
            ,{" "}
            <Link href="/category/finance" className="text-zinc-200 hover:text-white underline">
              Business & Networking
            </Link>
            ,{" "}
            <Link href="/category/technology" className="text-zinc-200 hover:text-white underline">
              Tech & Gadgets
            </Link>
            , and more. We provide direct “Join Server” links — click that link to join any server.
          </p>
        </div>

        {/* Section: What is a Discord Server Link? & How to Join Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* What is a Discord Server Link? */}
          <div className="p-6 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-discord-blurple" />
              <span>What is a Discord Server Link?</span>
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              A Discord server link is a unique URL that allows you to join a specific Discord server
              and participate in its chat rooms, voice channels, and communities. The owner of any
              server is authorized to generate an invite link to share with others, and interested
              people can join the server using the particular invite link to communicate,
              collaborate, and connect with friends or other community members. The server is made
              up of text channels and voice channels.
            </p>
          </div>

          {/* How to Join a Discord Server? */}
          <div className="p-6 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-discord-green" />
              <span>How to Join a Discord Server?</span>
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-3">
              To join a Discord server, you need an invite link of the particular server, and
              DiscordServerLink provides the largest Discord servers and communities for every
              interest. Follow these simple steps:
            </p>
            <ol className="space-y-2 text-xs sm:text-sm text-zinc-300 list-decimal list-inside leading-relaxed">
              <li>
                Visit Discord server sharing platform{" "}
                <Link href="/" className="text-discord-blurple hover:underline font-medium">
                  DiscordServerLink.com
                </Link>
              </li>
              <li>
                Find the right server for you by{" "}
                <Link href="/servers" className="text-zinc-200 underline">
                  Tags
                </Link>{" "}
                or{" "}
                <Link href="/categories" className="text-zinc-200 underline">
                  Category
                </Link>
                .
              </li>
              <li>Click on the “Join Server” link and open with Discord app or web application.</li>
              <li>Click on “Join Server” to become a member of that particular server on Discord.</li>
              <li>
                Now you can communicate with other members through text channels and voice
                channels.
              </li>
            </ol>
          </div>
        </div>

        {/* Section: Discord Server Rules */}
        <div className="p-6 sm:p-8 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg sm:text-xl font-bold text-white">Discord Server Rules</h3>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Discord server rules are guidelines created by server administrators to maintain order,
            encourage respectful interaction, and protect members from harmful behavior. These rules
            set clear expectations for how community members should act, helping to create a safe
            and welcoming environment for everyone.
          </p>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            The rules are usually posted in a dedicated channel in the server, often the #welcome or
            #rules channel, for all members to see and follow. Below we have mentioned a few common
            server rules to keep the community friendly and respectful. However, always check the
            server rules on the dedicated server.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80">
              <span className="text-white font-semibold text-xs sm:text-sm block mb-1">
                1. Respect Everyone
              </span>
              <p className="text-xs text-zinc-400">
                Be kind and polite to all members. No harassment, bullying, or hate speech.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80">
              <span className="text-white font-semibold text-xs sm:text-sm block mb-1">
                2. No Spamming
              </span>
              <p className="text-xs text-zinc-400">
                Avoid sending repeated messages, links, or emojis that disrupt conversations.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80">
              <span className="text-white font-semibold text-xs sm:text-sm block mb-1">
                3. Keep Content Appropriate
              </span>
              <p className="text-xs text-zinc-400">
                Share only safe and relevant content according to the server theme.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80">
              <span className="text-white font-semibold text-xs sm:text-sm block mb-1">
                4. Use Channels Correctly
              </span>
              <p className="text-xs text-zinc-400">
                Post messages in the correct channels to keep discussions organized.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80">
              <span className="text-white font-semibold text-xs sm:text-sm block mb-1">
                5. No Self-Promotion Without Permission
              </span>
              <p className="text-xs text-zinc-400">
                Advertising your own links, servers, or content without admin approval is not
                allowed.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80">
              <span className="text-white font-semibold text-xs sm:text-sm block mb-1">
                6. Protect Privacy
              </span>
              <p className="text-xs text-zinc-400">
                Do not share personal information of yourself or others.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80 sm:col-span-2">
              <span className="text-white font-semibold text-xs sm:text-sm block mb-1">
                7. Follow Discord’s Terms of Service
              </span>
              <p className="text-xs text-zinc-400">
                All members must respect Discord’s official community guidelines and terms of service.
              </p>
            </div>
          </div>
        </div>

        {/* Section: How to Guides (Leave, Make, Invite Link, Delete) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* How to Leave a Discord Server? */}
          <div className="p-6 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>How to Leave a Discord Server?</span>
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              If you no longer want to be part of a Discord server, you can easily leave it in just
              a few steps. Leaving a server removes it from your server list, and you won’t receive
              any messages, notifications, or updates from that server anymore. Don’t worry, other
              members won’t get notified when you leave the server.
            </p>
            <ol className="space-y-1.5 text-xs text-zinc-300 list-decimal list-inside leading-relaxed">
              <li>Open the Discord app or Discord web.</li>
              <li>Login to your Discord Account (if not logged in).</li>
              <li>Go to the Server you want to leave.</li>
              <li>Click the server’s name at the top of the screen.</li>
              <li>Select “Leave Server” from the dropdown list.</li>
              <li>A confirmation prompt will appear; click the red “Leave Server” button again.</li>
              <li>
                The server will disappear from your server list. (Note: If you are the owner, you
                cannot leave until you transfer ownership).
              </li>
            </ol>
          </div>

          {/* How to Make a Discord Server? */}
          <div className="p-6 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>How to Make a Discord Server?</span>
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              A server allows you to build a community where people can chat, share files, play
              games, and collaborate on projects together. Follow these steps to create your server
              for free:
            </p>
            <div className="space-y-1.5 text-xs text-zinc-300 leading-relaxed">
              <p>
                <strong className="text-white">Step #1:</strong> Download Discord App on your phone
                or visit the Discord website.
              </p>
              <p>
                <strong className="text-white">Step #2:</strong> Create your Discord account or login
                to your account.
              </p>
              <p>
                <strong className="text-white">Step #3:</strong> Now click on the “+” icon from the
                left sidebar.
              </p>
              <p>
                <strong className="text-white">Step #4:</strong> Select “Create My Own” (or choose a
                template for faster setup).
              </p>
              <p>
                <strong className="text-white">Step #5:</strong> Select “For me and my friends” or
                “For a club or community”.
              </p>
              <p>
                <strong className="text-white">Step #6:</strong> Enter your Server name and upload an
                icon.
              </p>
              <p>
                <strong className="text-white">Step #7:</strong> Finally click on the “Create”
                button to finalize.
              </p>
              <p className="text-emerald-400 font-semibold pt-1">
                ✅ Your server is ready! You can now invite friends and start creating channels.
              </p>
            </div>
          </div>

          {/* How to create a Discord Server Invite link? */}
          <div className="p-6 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-sky-400" />
              <span>How to Create a Discord Server Invite Link?</span>
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              A Discord server invite link allows you to invite friends, community members, or
              teammates to join your server. Follow the steps below to generate an invite link of any
              server:
            </p>
            <ol className="space-y-1.5 text-xs text-zinc-300 list-decimal list-inside leading-relaxed">
              <li>Go to the Discord App or Web.</li>
              <li>Select the Server and click on the Server Name from the top-left.</li>
              <li>Click on “Invite People”.</li>
              <li>The invite link will appear on the screen to copy and share.</li>
            </ol>
            <p className="text-xs text-amber-300/90 font-medium bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl">
              💡 Please note: Make sure to tick the checkbox “Set this link to never expire” so your
              invite never breaks.
            </p>
          </div>

          {/* How to Delete a Discord Server? */}
          <div className="p-6 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-rose-500" />
              <span>How to Delete a Discord Server?</span>
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              If you’re the owner of any Discord server but no longer want to manage your server, you
              can permanently delete it. Once deleted, all channels, messages, and members will be
              removed.
            </p>
            <ol className="space-y-1.5 text-xs text-zinc-300 list-decimal list-inside leading-relaxed">
              <li>Open the Discord app or Web.</li>
              <li>Click your Server Name at the top-left corner and select Server Settings.</li>
              <li>Scroll down and click Delete Server in the left menu.</li>
              <li>Enter your server name for confirmation.</li>
              <li>Click Delete Server again to delete server permanently.</li>
            </ol>
            <p className="text-xs text-rose-300/90 font-medium bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl">
              ⚠️ Please Note: Once you remove the server, this action cannot be undone. Be careful
              before deleting your server.
            </p>
          </div>
        </div>

        {/* Section: Frequently Asked Questions */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-4">
            <HelpCircle className="w-5 h-5 text-discord-blurple" />
            <h3 className="text-xl sm:text-2xl font-black text-white">Frequently Asked Questions</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-2 hover:border-discord-blurple/40 transition"
              >
                <h4 className="text-sm font-bold text-white flex items-start gap-2">
                  <span className="text-discord-blurple font-black">Q:</span>
                  <span>{faq.question}</span>
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed pl-5">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section: Final Words */}
        <div className="rounded-2xl bg-gradient-to-r from-zinc-950 via-indigo-950/30 to-zinc-950 border border-zinc-800 p-6 sm:p-8 space-y-3">
          <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-discord-blurple" />
            <span>Final Words</span>
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            <Link href="/" className="text-white font-semibold hover:underline">
              DiscordServerLink.com
            </Link>{" "}
            is a public Discord server listing website that provides a way for you to find over
            12,000+ public Discord servers and communities covering a wide range of topics,
            including sports, gaming, dating, tech, studying, coding, artificial intelligence, and
            much more. You can also{" "}
            <Link
              href="/servers/new"
              className="text-discord-blurple hover:underline font-semibold"
            >
              submit your server for free
            </Link>{" "}
            to gain members and rank on our trending list today!
          </p>
        </div>
      </div>
    </section>
  );
}
