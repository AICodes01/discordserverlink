export interface CategoryServerType {
  title: string;
  description: string;
  tags: string[];
  icon: string;
  badgeColor: string;
}

export interface CategoryJoinStep {
  step: number;
  title: string;
  description: string;
}

export interface CategoryBenefit {
  title: string;
  description: string;
  icon: string;
}

export interface CategoryRule {
  title: string;
  description: string;
  icon: string;
}

export interface CategoryFAQ {
  question: string;
  answer: string;
}

export interface CategoryDetails {
  headline: string;
  subheadline: string;
  serverTypesTitle: string;
  serverTypesDescription: string;
  serverTypes: CategoryServerType[];
  howToJoinTitle: string;
  howToJoinSteps: CategoryJoinStep[];
  benefitsTitle: string;
  benefits: CategoryBenefit[];
  rulesTitle: string;
  rulesDescription: string;
  rules: CategoryRule[];
  faqs: CategoryFAQ[];
}

export const CATEGORY_DATA: Record<string, CategoryDetails> = {
  gaming: {
    headline: "Top Gaming Discord Servers 2026",
    subheadline: "Whether you need competitive ranked teammates, custom Minecraft SMPs, or chill late-night party game voice lobbies, find verified gaming communities below.",
    serverTypesTitle: "Types of Gaming Discord Servers Explained",
    serverTypesDescription: "Gaming servers vary dramatically by intensity and game genre. Here are the 4 primary types:",
    serverTypes: [
      {
        title: "1. Competitive, Ranked & Scrims Hubs",
        description: "Built for high-stakes players in Valorant, Counter-Strike 2, Apex Legends, Overwatch 2, and League of Legends. Features rank-verified roles (Radiant, Faceit 10, Predator), daily custom scrimmages, tournament ladders, and strict comms channels.",
        tags: ["#valorant", "#scrims", "#esports", "#ranked"],
        icon: "Swords",
        badgeColor: "text-red-400 bg-red-500/10 border-red-500/20",
      },
      {
        title: "2. Dedicated Multiplayer Networks & RP",
        description: "Communities tied directly to dedicated game servers like Minecraft (Survival SMP, Skyblock, Factions), GTA V (FiveM Roleplay), Rust, ARK, and Terraria. Features in-game player economies, land claims, whitelist applications, and store perks.",
        tags: ["#minecraft-smp", "#fivem", "#roleplay", "#rust"],
        icon: "Trophy",
        badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      },
      {
        title: "3. LFG (Looking For Group) & Casual Party Hangouts",
        description: "Designed for hassle-free matchmaking in co-op favorites like Lethal Company, Among Us, Helldivers 2, Phasmophobia, and Party Animals. Hop into an open voice channel, ping the LFG role, and get a full squad in under 60 seconds.",
        tags: ["#lfg", "#coop", "#chill", "#party-games"],
        icon: "Users2",
        badgeColor: "text-discord-blurple bg-discord-blurple/10 border-discord-blurple/20",
      },
      {
        title: "4. Roblox VIP, Item Trading & Game Dev Hubs",
        description: "Hubs dedicated to Roblox Studio developers, Blox Fruits, Pet Simulator, Anime Defenders, and custom modding. Members share free VIP private server links, safe middleman trading bots, and game script assistance.",
        tags: ["#roblox", "#vip-servers", "#trading", "#gamedev"],
        icon: "Wrench",
        badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      },
    ],
    howToJoinTitle: "How to Join a Gaming Discord Server in 2026",
    howToJoinSteps: [
      {
        step: 1,
        title: "Filter by Your Specific Game Title",
        description: "Browse the gaming leaderboard above and pick a server dedicated to your game (e.g. Valorant, Minecraft, CS2).",
      },
      {
        step: 2,
        title: "Click 'Join Discord' to Connect",
        description: "You will be safely routed to the official Discord invite. Accept the invitation in your browser or Discord client.",
      },
      {
        step: 3,
        title: "Pass Rule Screening & Verification",
        description: "Click the verification checkmark or complete the CAPTCHA bot to prove you are human and unlock server channels.",
      },
      {
        step: 4,
        title: "Claim Your Game & Rank Roles in #roles",
        description: "Click reaction emojis for your in-game rank, region, and platform (PC/Console) so teammates can ping you for games.",
      },
    ],
    benefitsTitle: "Core Benefits of Joining Gaming Discord Communities",
    benefits: [
      {
        title: "🎮 Zero Solo-Queue Frustration",
        description: "Playing with random teammates who throw, grief, or mute their microphones ruins competitive games. Discord LFG groups guarantee verified players with mics.",
        icon: "Gamepad2",
      },
      {
        title: "🎁 Community Tournaments & Nitro Giveaways",
        description: "Community gaming servers regularly host free-to-enter tournaments with Discord Nitro, steam gift cards, in-game skins, and cash prize pools.",
        icon: "Trophy",
      },
      {
        title: "⚡ High-Fidelity 384kbps Voice Channels",
        description: "Level 3 boosted servers provide crystal-clear voice communication and 1080p 60fps screen sharing for coaching and squad streams.",
        icon: "Headphones",
      },
    ],
    rulesTitle: "Universal Gaming Discord Rules & Voice Chat Etiquette",
    rulesDescription: "Follow these basic etiquette guidelines to avoid mutes or bans across gaming communities:",
    rules: [
      {
        title: "1. Good Mic Hygiene",
        description: "Use Push-to-Talk or Krisp Noise Suppression. Never leave your microphone open if you have loud fans, mechanical keyboard clicks, or TV echo.",
        icon: "Headphones",
      },
      {
        title: "2. Zero Tolerance for Toxicity",
        description: "Constructive in-game callouts only. Toxic flaming, slurs, rage-quitting mid-match, or harassment results in an immediate ban.",
        icon: "ShieldCheck",
      },
      {
        title: "3. Respect Spoilers",
        description: "Never discuss newly released story campaigns, easter eggs, or DLC raid endings outside designated #spoilers channels.",
        icon: "AlertTriangle",
      },
      {
        title: "4. No Cheating, Hacks or Exploits",
        description: "Strictly zero tolerance for aimbots, wallhacks, DMA hardware, or DDoS threats. Keep gameplay fair for everyone.",
        icon: "Zap",
      },
    ],
    faqs: [
      {
        question: "What are the most popular types of gaming Discord servers in 2026?",
        answer: "The most active gaming servers fall into 4 main categories: Competitive Esports & LFG (Valorant, CS2, Apex), Dedicated Multiplayer Networks (Minecraft Survival SMP, GTA V FiveM RP), Casual Co-op Hangouts (Lethal Company, Among Us), and Roblox VIP / Trading Hubs.",
      },
      {
        question: "How do I find non-toxic teammates for competitive ranked games?",
        answer: "Look for Discord servers with role verification and active staff moderation. Quality servers require members to link their game IDs and enforce strict anti-toxicity rules in LFG voice channels.",
      },
      {
        question: "Are Discord gaming server invites free and safe to click?",
        answer: "Yes, 100%! All links on DiscordServerLink route directly to official Discord invite URLs. Discord's built-in client safety protocols protect your account information, and you never have to pay to join public servers.",
      },
      {
        question: "How can I get my own gaming Discord server listed and rank #1?",
        answer: "Simply visit our + Add Server page, paste your Discord invite link, and publish! To reach #1 on the gaming leaderboard, have your community members bump your server every 2 hours on DiscordServerLink.",
      },
    ],
  },

  anime: {
    headline: "Top Anime & Manga Discord Servers 2026",
    subheadline: "Connect with passionate anime fans, manga readers, Japanese pop culture lovers, cosplayers, and digital fan artists in active Discord hubs.",
    serverTypesTitle: "Types of Anime Discord Servers Explained",
    serverTypesDescription: "From weekly episode watch parties to bot card trading, anime servers feature rich micro-communities:",
    serverTypes: [
      {
        title: "1. Seasonal Anime Stream & Watch Party Hubs",
        description: "Servers hosting scheduled screen-share watch parties every Friday and Saturday. Stream the newest seasonal anime episodes, discuss live reactions, and vote in community seasonal tier lists.",
        tags: ["#anime", "#watch-party", "#streaming", "#seasonal"],
        icon: "Flame",
        badgeColor: "text-rose-400 bg-rose-500/10 border-rose-500/20",
      },
      {
        title: "2. Manga, Manhwa & Light Novel Discussion Circles",
        description: "Dedicated reading clubs for Jujutsu Kaisen, One Piece, Chainsaw Man, Solo Leveling, and webtoons. Features spoiler-quarantined channels, raw release translation breakdowns, and theory debates.",
        tags: ["#manga", "#manhwa", "#theories", "#webtoons"],
        icon: "BookOpen",
        badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      },
      {
        title: "3. Anime Gacha Bot Communities (Mudae & Karuta)",
        description: "High-activity communities centered around Discord anime mini-games like Mudae waifu claiming, Karuta card collecting, Pokétwo trading, and custom leveling roles with unique color badges.",
        tags: ["#mudae", "#karuta", "#gacha", "#waifu"],
        icon: "Sparkles",
        badgeColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
      },
      {
        title: "4. Fan Art, Cosplay & Japanese Culture Showcases",
        description: "Welcoming spaces for digital illustrators, cosplayers, and Japanese language learners. Share cosplay progress, get illustration anatomy feedback, and download hundreds of aesthetic emojis.",
        tags: ["#cosplay", "#fanart", "#emotes", "#japan"],
        icon: "Palette",
        badgeColor: "text-sky-400 bg-sky-500/10 border-sky-500/20",
      },
    ],
    howToJoinTitle: "How to Join and Engage in Anime Discord Communities",
    howToJoinSteps: [
      {
        step: 1,
        title: "Select Your Favorite Anime Genre or Title",
        description: "Browse our Anime servers list above for servers matching your favorite shows (Shonen, Romance, Isekai, Seinen).",
      },
      {
        step: 2,
        title: "Join with Instant One-Click Invite",
        description: "Click 'Join Discord' to launch your Discord app and accept the server invite.",
      },
      {
        step: 3,
        title: "Configure Manga/Anime Spoiler Roles",
        description: "Head to #roles to select whether you are an 'Anime-Only' or 'Manga Reader' to prevent accidental story spoilers.",
      },
      {
        step: 4,
        title: "Introduce Yourself & Jump Into Stream Nights",
        description: "Share your top 5 anime list in #introductions or join weekend community watch parties in voice chat.",
      },
    ],
    benefitsTitle: "Why You Should Join an Anime Discord Server",
    benefits: [
      {
        title: "🌸 Synchronized Watch Parties & Movie Nights",
        description: "Never watch emotional finales alone. Experience season finales, movie premieres, and classic series alongside hundreds of live chatters.",
        icon: "Sparkles",
      },
      {
        title: "🎨 500+ Aesthetic Custom Emotes & Stickers",
        description: "Level 3 anime servers offer hundreds of cute, animated Discord Nitro emotes and stickers to use across all your Discord chats.",
        icon: "Palette",
      },
      {
        title: "📖 Instant Chapter Release Alerts",
        description: "Get notified the minute new manga chapters, official anime trailers, or studio key visuals drop online.",
        icon: "BookOpen",
      },
    ],
    rulesTitle: "Anime Discord Etiquette & Community Guidelines",
    rulesDescription: "Keep anime communities welcoming and spoiler-free by adhering to these golden rules:",
    rules: [
      {
        title: "1. Strict Manga Spoiler Protection",
        description: "Never discuss manga leaks or raw scan spoilers in general chat. Always use ||spoiler tags|| or keep discussions in dedicated #manga channels.",
        icon: "AlertTriangle",
      },
      {
        title: "2. Respect Everyone's Ship & Taste",
        description: "Anime is subjective. Respect fellow fans' favorite characters, ships, and genres without toxic gatekeeping.",
        icon: "ShieldCheck",
      },
      {
        title: "3. Credit Original Fan Artists",
        description: "Always link the original artist source (Pixiv, Twitter/X) when sharing fan art in media channels.",
        icon: "CheckCircle",
      },
      {
        title: "4. No NSFW in SFW Server Channels",
        description: "Keep general chat PG-13. Ecchi or mature artwork must remain exclusively in age-restricted 18+ channels.",
        icon: "Zap",
      },
    ],
    faqs: [
      {
        question: "How do Anime Discord watch parties work?",
        answer: "Server moderators stream anime episodes through Discord screen sharing in voice channels. Members watch synchronously while chatting in real-time in the accompanying text channel.",
      },
      {
        question: "What is Mudae on anime Discord servers?",
        answer: "Mudae is a popular Discord bot that lets members roll for and claim thousands of anime characters, building personal waifu and husbando collections with server-wide trading.",
      },
      {
        question: "Can I find cosplay advice and tutorials in these servers?",
        answer: "Yes! Many anime servers feature dedicated cosplay channels where makers share wig styling tips, EVA foam armor drafting, and convention meetup plans.",
      },
      {
        question: "How do I prevent manga spoilers when joining anime servers?",
        answer: "Pick the 'Anime-Only' role in the server's #roles channel. This hides all manga discussion channels so your feed remains completely spoiler-free.",
      },
    ],
  },

  technology: {
    headline: "Top Technology, Coding & AI Discord Servers 2026",
    subheadline: "Collaborate with senior software engineers, web developers, AI researchers, cybersecurity specialists, and DevOps architects across worldwide tech hubs.",
    serverTypesTitle: "Types of Tech & Programming Discord Servers",
    serverTypesDescription: "Whether you need code review assistance or want to talk LLMs, here are the core technical communities:",
    serverTypes: [
      {
        title: "1. Fullstack & Web Development Hubs",
        description: "Focused on React, Next.js, TypeScript, Vue, Node.js, Tailwind CSS, and Python. Senior engineers offer fast debugging help, architecture reviews, and resume optimization.",
        tags: ["#javascript", "#typescript", "#react", "#nextjs"],
        icon: "Code2",
        badgeColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
      },
      {
        title: "2. Artificial Intelligence, LLMs & Machine Learning",
        description: "Communities discussing open-source LLMs, PyTorch, LangChain, prompt engineering, RAG pipelines, and local AI deployment (Ollama, vLLM, DeepSeek).",
        tags: ["#ai", "#machine-learning", "#python", "#llm"],
        icon: "Sparkles",
        badgeColor: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
      },
      {
        title: "3. Systems, Cloud & DevOps Labs",
        description: "Deep technical circles for Rust, Go, C++, Linux kernel, Docker, Kubernetes, AWS, Terraform, and high-concurrency backend architecture.",
        tags: ["#rust", "#golang", "#devops", "#cloud"],
        icon: "Wrench",
        badgeColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
      },
      {
        title: "4. Cybersecurity, CTF & Ethical Hacking",
        description: "White-hat security researchers sharing penetration testing techniques, Bug Bounty writeups, reverse engineering tips, and hosting weekly CTF competitions.",
        tags: ["#cybersecurity", "#infosec", "#ctf", "#hacking"],
        icon: "ShieldCheck",
        badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      },
    ],
    howToJoinTitle: "How to Join and Network in Tech Discord Communities",
    howToJoinSteps: [
      {
        step: 1,
        title: "Identify Your Tech Stack or Goal",
        description: "Choose a server matching your current languages (e.g. Python, Fullstack Web Dev, AI/LLMs, Rust).",
      },
      {
        step: 2,
        title: "Click 'Join Discord' to Connect",
        description: "Accept the server invite and link your GitHub or developer portfolio if prompted.",
      },
      {
        step: 3,
        title: "Assign Your Programming Languages in #roles",
        description: "Select roles like 'Frontend', 'Backend', 'Python', or 'AI' to unlock stack-specific channels.",
      },
      {
        step: 4,
        title: "Ask Smart Questions in #code-help",
        description: "Format your code snippets inside triple backticks (```) and provide error logs for fast, helpful solutions.",
      },
    ],
    benefitsTitle: "Core Benefits of Developer Discord Communities",
    benefits: [
      {
        title: "💻 10x Faster Debugging Assistance",
        description: "Stuck on a tricky bug? Senior developers in active help channels often resolve roadblock errors in minutes, saving you hours of StackOverflow searching.",
        icon: "Code2",
      },
      {
        title: "🚀 Job Referrals & Remote Tech Hiring",
        description: "Verified tech servers have exclusive #jobs channels where startup founders and engineering managers recruit developers directly without recruiter gatekeepers.",
        icon: "Briefcase",
      },
      {
        title: "🤝 Open Source Hackathons & Co-Founders",
        description: "Team up with designers and developers to build side projects, participate in hackathons, or launch your next SaaS.",
        icon: "Users2",
      },
    ],
    rulesTitle: "Developer Discord Etiquette & Best Practices",
    rulesDescription: "Maintain a high-signal environment by respecting developer community rules:",
    rules: [
      {
        title: "1. Format Code Snippets in Markdown",
        description: "Never post raw code screenshots. Always use code blocks with syntax highlighting (e.g. ```tsx ... ```) so members can read and copy your code easily.",
        icon: "Code2",
      },
      {
        title: "2. Don't Ask to Ask, Just Ask",
        description: "Avoid messages like 'Can someone help with Python?'. Instead, describe your problem, paste the error trace, and explain what you've already tried.",
        icon: "HelpCircle",
      },
      {
        title: "3. No Unsolicited DMs for Homework",
        description: "Never direct-message moderators or active helpers begging them to do your homework or code for free.",
        icon: "AlertTriangle",
      },
      {
        title: "4. No Malicious Payloads or Cracks",
        description: "Sharing malware, pirated software keys, or malicious exploits results in an immediate permanent ban and Discord report.",
        icon: "ShieldCheck",
      },
    ],
    faqs: [
      {
        question: "Can beginners get coding help in these Discord servers?",
        answer: "Absolutely! Many tech communities feature dedicated #beginner-help channels with patient mentors who guide newcomers through syntax fundamentals and tooling setup.",
      },
      {
        question: "How do I format code inside Discord chat?",
        answer: "Type three backticks followed by the language name (e.g. ```python), hit Enter, paste your code, and close with three backticks (```). This adds syntax highlighting and line formatting.",
      },
      {
        question: "Are tech Discord servers useful for finding remote jobs?",
        answer: "Yes. Many servers have curated #jobs boards where tech leads post junior, mid, and senior remote developer openings and offer direct resume reviews.",
      },
      {
        question: "How can I showcase my open-source project or startup?",
        answer: "Look for channels named #showcase, #project-feedback, or #built-with. Members provide constructive feedback on your UI, code structure, and business model.",
      },
    ],
  },

  community: {
    headline: "Top Hangout, Chill & Social Discord Servers 2026",
    subheadline: "Welcoming virtual lounges to meet new friends worldwide, unwind in cozy voice channels, share daily memes, and chat about everyday life.",
    serverTypesTitle: "Types of Community & Social Discord Servers",
    serverTypesDescription: "From quiet late-night coffee lounges to active international hangouts, explore the varieties:",
    serverTypes: [
      {
        title: "1. Late-Night Voice Chat & Chill Lounges",
        description: "Comfortable, low-pressure spaces where members hang out on voice chat after work or study sessions. Talk about movies, listen to lo-fi music, or just vibe in quiet study rooms.",
        tags: ["#chill", "#voice-chat", "#night-owl", "#lofi"],
        icon: "Headphones",
        badgeColor: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
      },
      {
        title: "2. Global Friend-Making & International Hubs",
        description: "Diverse, multi-cultural servers designed specifically for finding new friends. Features daily question-of-the-day prompts, icebreaker mini-games, and friendly timezone meetups.",
        tags: ["#make-friends", "#social", "#international", "#hangout"],
        icon: "Users2",
        badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      },
      {
        title: "3. Memes, Media & Pop Culture Rooms",
        description: "Fast-moving channels filled with the internet's freshest memes, TikTok trends, pet photography, cooking recipes, and movie discussion threads.",
        tags: ["#memes", "#media", "#pets", "#food"],
        icon: "Sparkles",
        badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      },
      {
        title: "4. Wholesome, LGBTQ+ & Mental Wellness Circles",
        description: "Safe, inclusive sanctuaries with strict anti-hate speech moderation, venting channels with supportive listeners, and positivity check-ins.",
        tags: ["#wholesome", "#safe-space", "#wellness", "#inclusive"],
        icon: "Heart",
        badgeColor: "text-pink-400 bg-pink-500/10 border-pink-500/20",
      },
    ],
    howToJoinTitle: "How to Make Friends in Social Discord Servers",
    howToJoinSteps: [
      {
        step: 1,
        title: "Pick a Community Matching Your Vibe",
        description: "Choose between quiet, cozy study/chill servers or energetic global chatting hubs from our verified list above.",
      },
      {
        step: 2,
        title: "Complete the Rules & Introductions",
        description: "Read the community rules, then introduce yourself in #introductions with your hobbies and favorite games.",
      },
      {
        step: 3,
        title: "Select Your Interest Roles",
        description: "Pick notification roles for movie nights, podcast streams, or gaming pings in the #roles channel.",
      },
      {
        step: 4,
        title: "Jump Into Daily Chat & Events",
        description: "Reply to general conversation or hop into an open voice channel. Consistency is the secret to making genuine online friends!",
      },
    ],
    benefitsTitle: "Benefits of Joining Social Discord Servers",
    benefits: [
      {
        title: "🌍 24/7 Global Company & Connection",
        description: "No matter what timezone you live in or what time you wake up, active social servers always have friendly people chatting in voice or text.",
        icon: "Users2",
      },
      {
        title: "🛡️ Strictly Moderated Safe Spaces",
        description: "Verified communities employ 24/7 moderator teams and anti-raid bots to eliminate trolls, creepiness, and harassment immediately.",
        icon: "ShieldCheck",
      },
      {
        title: "🎉 Weekly Community Game & Movie Nights",
        description: "Take part in Jackbox party games, Gartic Phone drawing rounds, movie streams, and Nitro giveaways every weekend.",
        icon: "Sparkles",
      },
    ],
    rulesTitle: "Social Discord Etiquette & Conduct",
    rulesDescription: "Keep general social communities positive and comfortable for all members:",
    rules: [
      {
        title: "1. No Unsolicited Direct Messaging (DMs)",
        description: "Never slide into members' private DMs without explicit consent in public chat. Creepy or harassing DMs lead to immediate bans.",
        icon: "ShieldCheck",
      },
      {
        title: "2. Zero Hate Speech or Bullying",
        description: "Treat everyone with kindness regardless of nationality, gender, sexual orientation, or personal beliefs.",
        icon: "AlertTriangle",
      },
      {
        title: "3. Keep Drama Out of Public Chat",
        description: "Personal conflicts should be resolved privately or reported to server staff via modmail rather than argued in #general.",
        icon: "CheckCircle",
      },
      {
        title: "4. Use Designated Venting Channels",
        description: "If you need emotional support, post inside designated #vent or #advice channels where members opt in to offer support.",
        icon: "Heart",
      },
    ],
    faqs: [
      {
        question: "Is it awkward to join a voice channel if I don't know anyone?",
        answer: "Not at all! Most social servers feature 'No-Mic' or 'Chill Chat' channels where you can listen in and type in text until you feel comfortable speaking.",
      },
      {
        question: "How do I make real friends on Discord?",
        answer: "Consistency is key. Spend 15 minutes a day chatting in #general, react to others' messages, share funny memes, and attend weekend community events.",
      },
      {
        question: "Are social servers safe for teenagers?",
        answer: "Always look for servers with clear age tags (e.g. 13-17 or 18+) and verified moderation teams with active AutoMod filters.",
      },
      {
        question: "What is Modmail and how do I contact server staff?",
        answer: "Modmail is a bot that lets you send private messages to the entire server moderation team to report rule-breakers or ask questions safely.",
      },
    ],
  },

  music: {
    headline: "Top Music Production & Audio Discord Servers 2026",
    subheadline: "Connect with beatmakers, audio engineers, vocalists, songwriters, and passionate music fans across collaborative audio communities.",
    serverTypesTitle: "Types of Music Discord Servers Explained",
    serverTypesDescription: "Explore communities tailored to every stage of music creation and appreciation:",
    serverTypes: [
      {
        title: "1. Beatmakers & Music Producer Labs",
        description: "Dedicated to FL Studio, Ableton Live, Logic Pro, and Reaper users. Share sample packs, exchange preset banks, and participate in weekly beat battles with studio prizes.",
        tags: ["#producers", "#flstudio", "#ableton", "#beats"],
        icon: "Headphones",
        badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      },
      {
        title: "2. Mixing, Mastering & Audio Engineering",
        description: "Senior audio engineers offering feedback on EQ, compression curves, vocal tuning, loudness LUFS metering, and acoustic treatment advice.",
        tags: ["#mixing", "#mastering", "#audio", "#engineering"],
        icon: "Wrench",
        badgeColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
      },
      {
        title: "3. Vocalists, Songwriters & Collab Hubs",
        description: "Connect with singers, rappers, guitarists, and session musicians looking for beats or offering vocal hooks for joint EP releases.",
        tags: ["#vocalists", "#singers", "#collabs", "#songwriting"],
        icon: "Mic",
        badgeColor: "text-rose-400 bg-rose-500/10 border-rose-500/20",
      },
      {
        title: "4. 24/7 Listening Rooms & Music Discussion",
        description: "Music lovers discussing albums, hip-hop culture, EDM releases, indie rock, and vinyl collecting with continuous listening bots.",
        tags: ["#music-lovers", "#listening-party", "#lofi", "#vinyl"],
        icon: "Sparkles",
        badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      },
    ],
    howToJoinTitle: "How to Share Your Music and Collaborate on Discord",
    howToJoinSteps: [
      {
        step: 1,
        title: "Select a Server Matching Your DAW or Genre",
        description: "Choose a server focused on your digital audio workstation (Ableton, FL Studio) or genre (Hip-hop, EDM, Metal).",
      },
      {
        step: 2,
        title: "Pick Your Musical Roles in #roles",
        description: "Select roles like 'Producer', 'Vocalist', 'Engineer', or 'Listener' to unlock collaboration channels.",
      },
      {
        step: 3,
        title: "Post Inside Daily Feedback Rounds",
        description: "Follow the 'Give feedback before asking for feedback' rule in #track-feedback channels to get constructive critiques.",
      },
      {
        step: 4,
        title: "Enter Monthly Sample Flips & Beat Battles",
        description: "Download the monthly sample pack and submit your flip to win studio plugins and Nitro prizes.",
      },
    ],
    benefitsTitle: "Core Benefits of Music Discord Communities",
    benefits: [
      {
        title: "🎧 Honest, Unbiased Track Feedback",
        description: "Friends and family will always say your music sounds great. Discord feedback channels provide real critique on your mixdown and song arrangement.",
        icon: "Headphones",
      },
      {
        title: "📦 Free Royalty-Free Samples & Presets",
        description: "Members frequently share self-recorded drum kits, 808s, Serum synth presets, and melody loops 100% royalty-free.",
        icon: "Sparkles",
      },
      {
        title: "🎙️ Direct Vocal & Instrument Collaborations",
        description: "Find talented vocalists and instrumentalists ready to hop on your instrumentals without expensive Fiverr session fees.",
        icon: "Mic",
      },
    ],
    rulesTitle: "Music Server Etiquette & Guidelines",
    rulesDescription: "Maintain a respectful collaboration space by adhering to audio server rules:",
    rules: [
      {
        title: "1. Give Feedback Before You Ask",
        description: "Critique at least 1 or 2 other members' tracks thoughtfully before dropping your own SoundCloud or Spotify link.",
        icon: "CheckCircle",
      },
      {
        title: "2. No Shameless Self-Promo in #general",
        description: "Never spam your music links in general chat. Always use designated #my-music or #feedback channels.",
        icon: "AlertTriangle",
      },
      {
        title: "3. Respect Copyright & Stems",
        description: "Never pass off someone else's beats or uncredited vocal samples as your own original work.",
        icon: "ShieldCheck",
      },
      {
        title: "4. No Ear-Rape Audio in Voice Rooms",
        description: "Never blast uncompressed, distorted audio through voice channels without warning fellow listeners.",
        icon: "Headphones",
      },
    ],
    faqs: [
      {
        question: "How do track feedback rounds work on Discord?",
        answer: "Members upload MP3s or private SoundCloud links in #track-feedback. To keep it fair, most servers require you to leave meaningful feedback on someone else's song first.",
      },
      {
        question: "Can I share my Spotify or Apple Music releases?",
        answer: "Yes! Most servers feature a #releases channel where you can announce newly launched singles, music videos, and album drops.",
      },
      {
        question: "What are sample flip challenges?",
        answer: "A host provides an obscure audio sample (e.g. vintage jazz vinyl), and producers have 48 hours to chop, flip, and produce an original beat from it.",
      },
      {
        question: "How do I find vocalists for my instrumentals?",
        answer: "Post a short audio preview in #collab-requests mentioning the key, BPM, and genre. Interested singers and rappers can reply or DM you directly.",
      },
    ],
  },

  education: {
    headline: "Top Education, Study & Science Discord Servers 2026",
    subheadline: "Join 24/7 virtual study rooms, get academic homework assistance, practice languages with native speakers, and collaborate on STEM research.",
    serverTypesTitle: "Types of Education Discord Servers Explained",
    serverTypesDescription: "From quiet silent study rooms to collaborative academic hubs:",
    serverTypes: [
      {
        title: "1. 24/7 Virtual Study Rooms & Pomodoro Hubs",
        description: "Quiet, accountability-driven study servers with automated Pomodoro timers (25/5 and 50/10 intervals), camera-on focus rooms, and daily study streak leaderboards.",
        tags: ["#study", "#pomodoro", "#focus", "#productivity"],
        icon: "GraduationCap",
        badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      },
      {
        title: "2. STEM & Academic Homework Help",
        description: "Subject-specific channels for Calculus, Physics, Chemistry, Biology, Computer Science, and Statistics. University tutors explain concepts step-by-step.",
        tags: ["#math", "#physics", "#chemistry", "#homework"],
        icon: "BookOpen",
        badgeColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
      },
      {
        title: "3. Language Exchange & Polyglot Circles",
        description: "Native speakers practicing English, Spanish, Japanese, French, German, and Mandarin. Features tandem voice rooms, grammar tips, and cultural exchanges.",
        tags: ["#language", "#english", "#japanese", "#spanish"],
        icon: "Globe",
        badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      },
      {
        title: "4. College Prep, MCAT, LSAT & Career Guidance",
        description: "Students studying for SAT, ACT, MCAT, USMLE, and bar exams. Share flashcards, Anki decks, study schedules, and university admissions advice.",
        tags: ["#mcat", "#college", "#medschool", "#lawschool"],
        icon: "Trophy",
        badgeColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
      },
    ],
    howToJoinTitle: "How to Boost Your Academic Productivity on Discord",
    howToJoinSteps: [
      {
        step: 1,
        title: "Pick Your Study Goal or Exam",
        description: "Select a server dedicated to your academic focus (e.g. 24/7 Focus Study, MCAT Prep, Language Exchange).",
      },
      {
        step: 2,
        title: "Assign Your Subject & Grade Level Roles",
        description: "Select roles like 'High School', 'Undergrad', 'STEM', or target languages in #roles.",
      },
      {
        step: 3,
        title: "Join a Silent Camera/Screen-Share Voice Room",
        description: "Turn on your webcam or screen-share your notes to hold yourself accountable during deep work sessions.",
      },
      {
        step: 4,
        title: "Log Your Study Hours with the Productivity Bot",
        description: "Type <code>!study start</code> to track your daily study hours and climb the server's academic leaderboard.",
      },
    ],
    benefitsTitle: "Why Students Love Discord Study Communities",
    benefits: [
      {
        title: "📚 Eradicate Procrastination With Body Doubling",
        description: "Studying alone in a quiet room leads to phone distractions. Seeing 50 other students quietly studying alongside you in voice channels keeps you locked in.",
        icon: "GraduationCap",
      },
      {
        title: "🧠 Free Concept Explanations & Tutoring",
        description: "Instead of staring at a confusing math formula for two hours, post the question in #math-help and get a clear, step-by-step breakdown.",
        icon: "BookOpen",
      },
      {
        title: "📊 Shared Anki Decks & Summary Notes",
        description: "Access community-curated Google Drive folders and Anki flashcard decks for medical, law, and engineering coursework.",
        icon: "Sparkles",
      },
    ],
    rulesTitle: "Education Server Academic Integrity Rules",
    rulesDescription: "Keep study environments honest and supportive:",
    rules: [
      {
        title: "1. No Cheating on Live Proctored Exams",
        description: "Never post live quiz or exam questions asking for instant answers. Servers strictly uphold academic honor codes.",
        icon: "ShieldCheck",
      },
      {
        title: "2. Show What You've Tried First",
        description: "When asking homework questions, show your initial steps or notes rather than asking members to do the entire worksheet.",
        icon: "CheckCircle",
      },
      {
        title: "3. Strict Mute in Silent Study Channels",
        description: "Never unmute your microphone in designated 'Silent Study' voice channels. Keep all chatter in accompanying text channels.",
        icon: "Headphones",
      },
      {
        title: "4. Respect Different Learning Paces",
        description: "Never mock someone for asking basic questions. Everyone starts somewhere in their academic journey.",
        icon: "Heart",
      },
    ],
    faqs: [
      {
        question: "How do Pomodoro bots work in Discord study servers?",
        answer: "Bots automatically manage 25-minute focus intervals followed by 5-minute break alerts with gentle chimes, helping you maintain energy without burning out.",
      },
      {
        question: "Do I have to turn on my camera in study rooms?",
        answer: "No, webcams are optional. Most servers have separate channels for 'Cam-On Study', 'Screen-Share Study', and 'Silent No-Cam Study'.",
      },
      {
        question: "Can I find native speakers to practice conversational English?",
        answer: "Yes! Language exchange servers have voice channels where native English and foreign language learners practice 50/50 conversations.",
      },
      {
        question: "Is homework assistance on Discord legal?",
        answer: "Yes, concept tutoring and homework guidance are encouraged. However, asking people to complete online tests or write essays for you violates server rules.",
      },
    ],
  },

  finance: {
    headline: "Top Crypto, Stocks & Finance Discord Servers 2026",
    subheadline: "Explore active market communities for daily stock watchlists, cryptocurrency technical analysis, options strategies, and personal finance discussions.",
    serverTypesTitle: "Types of Financial & Trading Discord Servers",
    serverTypesDescription: "Understand the focus of different financial communities before trading:",
    serverTypes: [
      {
        title: "1. Stock Market & Options Trading Hubs",
        description: "Pre-market morning briefings, S&P 500 futures analysis, earnings calendars, options flow alerts, and technical charting breakdowns.",
        tags: ["#stocks", "#options", "#daytrading", "#sp500"],
        icon: "TrendingUp",
        badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      },
      {
        title: "2. Cryptocurrency & Web3 Alpha Circles",
        description: "Discussions on Bitcoin halving cycles, Ethereum L2 ecosystems, Solana DeFi protocols, on-chain whale transaction tracking, and token airdrop guides.",
        tags: ["#crypto", "#bitcoin", "#ethereum", "#defi"],
        icon: "Coins",
        badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      },
      {
        title: "3. Personal Finance, FIRE & Real Estate",
        description: "Long-term wealth building, index fund investing (Bogleheads), high-yield savings accounts, tax optimization, and rental property real estate.",
        tags: ["#investing", "#personal-finance", "#fire", "#real-estate"],
        icon: "Briefcase",
        badgeColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
      },
      {
        title: "4. Forex, Commodities & Macro Economics",
        description: "Foreign currency pair analysis (EUR/USD, GBP/JPY), Gold & Oil commodity trends, Federal Reserve rate decisions, and CPI inflation breakdowns.",
        tags: ["#forex", "#macro", "#gold", "#commodities"],
        icon: "Globe",
        badgeColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
      },
    ],
    howToJoinTitle: "How to Learn and Navigate Financial Discord Servers",
    howToJoinSteps: [
      {
        step: 1,
        title: "Define Your Financial Interest",
        description: "Choose whether you are focusing on long-term stock investing, day trading options, crypto DeFi, or personal budgeting.",
      },
      {
        step: 2,
        title: "Join with Official Invite Link",
        description: "Click 'Join Discord' to launch your Discord app and accept the server invite.",
      },
      {
        step: 3,
        title: "Disable Direct Messages (DMs) for Safety",
        description: "Immediately turn off DMs in server privacy settings to prevent crypto scammers and fake support bots from messaging you.",
      },
      {
        step: 4,
        title: "Read Morning Market Briefings in #news",
        description: "Follow pre-market commentary and read educational technical analysis charts shared by senior analysts.",
      },
    ],
    benefitsTitle: "Core Benefits of Financial Communities",
    benefits: [
      {
        title: "📊 Real-Time Pre-Market Morning Watchlists",
        description: "Get daily economic calendars, earnings announcements, and key support/resistance levels before the stock market opens at 9:30 AM EST.",
        icon: "TrendingUp",
      },
      {
        title: "💡 Educational Technical & Fundamental Analysis",
        description: "Learn how to read candlestick patterns, VWAP, moving averages, and 10-K company financial statements from experienced investors.",
        icon: "BookOpen",
      },
      {
        title: "🐋 Whale Alert & On-Chain Tracking",
        description: "Automated bots track large institutional stock option block trades and multi-million dollar cryptocurrency transfers in real time.",
        icon: "Sparkles",
      },
    ],
    rulesTitle: "Financial Discord Server Rules & Risk Disclaimers",
    rulesDescription: "Protect your capital and adhere to community guidelines:",
    rules: [
      {
        title: "1. Not Financial Advice (DYOR)",
        description: "All commentary is for educational and entertainment purposes only. Always Do Your Own Research (DYOR) before risking capital.",
        icon: "AlertTriangle",
      },
      {
        title: "2. Strictly No Pump-and-Dump Schemes",
        description: "Promoting micro-cap penny stocks, suspicious meme coins, or coordinated pump schemes results in an instant ban and reporting.",
        icon: "ShieldCheck",
      },
      {
        title: "3. Never Share Private Wallet Keys or Seed Phrases",
        description: "No real moderator will ever ask for your private crypto keys or seed phrases. Never click untrusted download links.",
        icon: "Zap",
      },
      {
        title: "4. No Paid Signals or MLM Promotion",
        description: "Unsolicited promotion of paid signal groups, affiliate courses, or forex pyramids is strictly prohibited.",
        icon: "CheckCircle",
      },
    ],
    faqs: [
      {
        question: "Are trading signals on Discord guaranteed to make money?",
        answer: "No. Never rely blindly on anyone's trading signals. Markets carry inherent risk. Use Discord servers for education, watchlists, and macro analysis rather than blind copy-trading.",
      },
      {
        question: "How do I avoid crypto scammers on Discord?",
        answer: "Right-click the server name, select 'Privacy Settings', and toggle 'Direct Messages' OFF. Legitimate staff members will never DM you first offering 'exclusive airdrops' or 'wallet syncing'.",
      },
      {
        question: "Can beginners learn how to invest in stocks on Discord?",
        answer: "Yes! Many servers have beginner channels explaining compound interest, index funds (VOO, SPY), and dollar-cost averaging.",
      },
      {
        question: "What tools do financial Discord servers use?",
        answer: "Most servers integrate automated bots for TradingView charts, Unusual Whales options flow, SEC filings, and CoinMarketCap price feeds.",
      },
    ],
  },

  art: {
    headline: "Top Art, Design & Creative Discord Servers 2026",
    subheadline: "Showcase digital illustrations, 3D modeling, UI/UX portfolios, animation reels, and receive constructive critiques from fellow artists worldwide.",
    serverTypesTitle: "Types of Art & Creative Discord Servers",
    serverTypesDescription: "Find the creative hub that matches your medium and artistic aspirations:",
    serverTypes: [
      {
        title: "1. Digital Illustration & Concept Art Studios",
        description: "Communities focused on Photoshop, Clip Studio Paint, and Procreate. Features weekly drawing challenges, anatomy workshops, and brush pack sharing.",
        tags: ["#digital-art", "#illustration", "#concept-art", "#drawing"],
        icon: "Palette",
        badgeColor: "text-pink-400 bg-pink-500/10 border-pink-500/20",
      },
      {
        title: "2. 3D Modeling, Blender & Animation Hubs",
        description: "Circles for Blender artists, Maya animators, ZBrush sculptors, and game asset creators. Members exchange material nodes, topology advice, and render setups.",
        tags: ["#blender", "#3d-art", "#animation", "#modeling"],
        icon: "Box",
        badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      },
      {
        title: "3. UI/UX, Web & Graphic Design Labs",
        description: "Designers collaborating on Figma templates, brand identity systems, typography pairings, design systems, and portfolio case study reviews.",
        tags: ["#ui-ux", "#figma", "#graphic-design", "#branding"],
        icon: "Layout",
        badgeColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
      },
      {
        title: "4. Art Commissions & Freelance Marketplaces",
        description: "Dedicated channels where verified artists can post their commission portfolios, pricing sheets, and connect with clients seeking custom artwork.",
        tags: ["#commissions", "#freelance", "#portfolio", "#client-work"],
        icon: "Sparkles",
        badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      },
    ],
    howToJoinTitle: "How to Grow as an Artist on Discord",
    howToJoinSteps: [
      {
        step: 1,
        title: "Select Your Creative Medium",
        description: "Choose a server matching your creative field (e.g. 2D Illustration, Blender 3D, UI/UX Design, Anime Art).",
      },
      {
        step: 2,
        title: "Join with Instant One-Click Invite",
        description: "Click 'Join Discord' to launch your Discord app and accept the server invite.",
      },
      {
        step: 3,
        title: "Post Inside #constructive-critique",
        description: "Share works-in-progress (WIPs) and specify what you need feedback on (lighting, anatomy, color palette).",
      },
      {
        step: 4,
        title: "Participate in Weekly Prompt Challenges",
        description: "Draw according to community prompt themes to push your creative comfort zone and gain profile visibility.",
      },
    ],
    benefitsTitle: "Core Benefits of Joining Art Discord Communities",
    benefits: [
      {
        title: "🎨 Actionable, Constructive Artwork Feedback",
        description: "Family and social media followers often only say 'nice drawing'. Fellow artists provide specific redlines on anatomy, perspective, and color theory.",
        icon: "Palette",
      },
      {
        title: "🖌️ Free High-Quality Brush Packs & Textures",
        description: "Access curated Google Drive folders filled with custom Procreate brushes, Photoshop action scripts, and 3D PBR texture maps.",
        icon: "Sparkles",
      },
      {
        title: "💼 Commission Clients & Freelance Leads",
        description: "Showcase your finished portfolio in #hire-an-artist channels to land character commissions, book covers, and logo contracts.",
        icon: "Briefcase",
      },
    ],
    rulesTitle: "Art Community Guidelines & Intellectual Property Rules",
    rulesDescription: "Protect creative integrity and respect artists' rights:",
    rules: [
      {
        title: "1. No Art Theft or Tracing Without Credit",
        description: "Never claim someone else's artwork as your own. Tracing without explicit reference attribution results in an immediate ban.",
        icon: "ShieldCheck",
      },
      {
        title: "2. Transparent AI-Art Disclosure",
        description: "If an artwork is generated using AI tools (Midjourney, Stable Diffusion), it must be clearly labeled and posted in designated #ai-art channels.",
        icon: "AlertTriangle",
      },
      {
        title: "3. Constructive Feedback Only",
        description: "Be helpful, not hurtful. Avoid rude remarks like 'this looks bad'—always explain how an artist can improve their lighting or composition.",
        icon: "CheckCircle",
      },
      {
        title: "4. Clear Commission Pricing & Terms",
        description: "When offering commissions, provide transparent pricing sheets, payment terms (e.g. 50% upfront via PayPal/Stripe), and delivery timelines.",
        icon: "Zap",
      },
    ],
    faqs: [
      {
        question: "How do art critique channels work on Discord?",
        answer: "You post your work-in-progress image and mention what area you want help with. Other artists will reply with paint-overs, redlines, or color suggestions.",
      },
      {
        question: "Are beginners allowed in art Discord servers?",
        answer: "Yes! Art servers are very welcoming to beginners. Many feature study channels where self-taught artists share perspective tutorials and gesture drawing tips.",
      },
      {
        question: "How can I safely accept art commissions on Discord?",
        answer: "Always use secure payment invoices (PayPal Goods & Services or Stripe), take a 50% deposit before starting, and send watermarked low-res drafts before full payment.",
      },
      {
        question: "What software do artists use in these communities?",
        answer: "Popular tools include Clip Studio Paint, Procreate, Adobe Photoshop, Blender, ZBrush, and Figma.",
      },
    ],
  },
};
