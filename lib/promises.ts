export interface Promise {
  id: number;
  category: string;
  scripture: string;
  reference: string;
  reflection: string;
  date: string;
}

export const categories = [
  "Peace",
  "Strength",
  "Hope",
  "Love",
  "Guidance",
  "Provision",
  "Healing",
  "Victory",
];

export const promises: Promise[] = [
  {
    id: 1,
    category: "Peace",
    scripture:
      "Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.",
    reference: "John 14:27",
    reflection:
      "In times of uncertainty, remember that God's peace surpasses all understanding. His peace isn't dependent on circumstances but flows from His unchanging nature. Today, receive His peace and let it guard your heart.",
    date: "2025-01-15",
  },
  {
    id: 2,
    category: "Strength",
    scripture:
      "I can do all this through him who gives me strength.",
    reference: "Philippians 4:13",
    reflection:
      "Your strength doesn't come from within yourself alone. God provides supernatural strength for every challenge you face. Whatever mountains stand before you today, you have divine power to overcome them.",
    date: "2025-01-14",
  },
  {
    id: 3,
    category: "Hope",
    scripture:
      "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.",
    reference: "Jeremiah 29:11",
    reflection:
      "Even when the path ahead seems unclear, God has already mapped out your journey. His plans for you are good, filled with hope and purpose. Trust in His perfect timing and unfailing love.",
    date: "2025-01-13",
  },
  {
    id: 4,
    category: "Love",
    scripture:
      "See what great love the Father has lavished on us, that we should be called children of God! And that is what we are!",
    reference: "1 John 3:1",
    reflection:
      "You are deeply loved by the Creator of the universe. Not because of what you do, but because of who you are—His beloved child. Let this truth sink deep into your heart today.",
    date: "2025-01-12",
  },
  {
    id: 5,
    category: "Guidance",
    scripture:
      "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
    reference: "Proverbs 3:5-6",
    reflection:
      "When decisions feel overwhelming, remember you don't walk alone. God promises to guide you when you trust Him. Surrender your plans to Him, and watch as He directs your steps.",
    date: "2025-01-11",
  },
  {
    id: 6,
    category: "Provision",
    scripture:
      "And my God will meet all your needs according to the riches of his glory in Christ Jesus.",
    reference: "Philippians 4:19",
    reflection:
      "God sees every need you have—physical, emotional, and spiritual. He is faithful to provide, often in ways beyond what you could imagine. Trust Him as your provider today.",
    date: "2025-01-10",
  },
  {
    id: 7,
    category: "Healing",
    scripture:
      "He heals the brokenhearted and binds up their wounds.",
    reference: "Psalm 147:3",
    reflection:
      "No wound is too deep for God's healing touch. He sees your pain, collects your tears, and tenderly restores what has been broken. Bring your hurts to Him today and receive His comfort.",
    date: "2025-01-09",
  },
  {
    id: 8,
    category: "Victory",
    scripture:
      "But thanks be to God! He gives us the victory through our Lord Jesus Christ.",
    reference: "1 Corinthians 15:57",
    reflection:
      "Every battle you face has already been won through Christ. You're not fighting for victory, but from victory. Walk in the confidence of His triumph today.",
    date: "2025-01-08",
  },
  {
    id: 9,
    category: "Peace",
    scripture:
      "You will keep in perfect peace those whose minds are steadfast, because they trust in you.",
    reference: "Isaiah 26:3",
    reflection:
      "Perfect peace comes from fixing your thoughts on God. When anxiety whispers, turn your focus to His faithfulness. He is your anchor in every storm.",
    date: "2025-01-07",
  },
  {
    id: 10,
    category: "Strength",
    scripture:
      "The Lord is my strength and my shield; my heart trusts in him, and he helps me.",
    reference: "Psalm 28:7",
    reflection:
      "God doesn't just give you strength—He is your strength. In your weakest moments, He becomes your greatest defense. Lean on Him completely today.",
    date: "2025-01-06",
  },
  {
    id: 11,
    category: "Hope",
    scripture:
      "May the God of hope fill you with all joy and peace as you trust in him, so that you may overflow with hope by the power of the Holy Spirit.",
    reference: "Romans 15:13",
    reflection:
      "Hope is not wishful thinking—it's confident expectation rooted in God's character. Let His hope fill you until it overflows into every area of your life.",
    date: "2025-01-05",
  },
  {
    id: 12,
    category: "Love",
    scripture:
      "This is love: not that we loved God, but that he loved us and sent his Son as an atoning sacrifice for our sins.",
    reference: "1 John 4:10",
    reflection:
      "God's love isn't a response to yours—it's the initiator. While you were still far from Him, He reached out. His love is unconditional and unchanging.",
    date: "2025-01-04",
  },
  {
    id: 13,
    category: "Guidance",
    scripture:
      "Whether you turn to the right or to the left, your ears will hear a voice behind you, saying, 'This is the way; walk in it.'",
    reference: "Isaiah 30:21",
    reflection:
      "God promises to guide you at every crossroad. Listen for His voice—He speaks through His Word, His Spirit, and the peace He places in your heart.",
    date: "2025-01-03",
  },
  {
    id: 14,
    category: "Provision",
    scripture:
      "Look at the birds of the air; they do not sow or reap or store away in barns, and yet your heavenly Father feeds them. Are you not much more valuable than they?",
    reference: "Matthew 6:26",
    reflection:
      "If God cares for the sparrows, how much more does He care for you? Trust His provision for your needs, knowing you are precious in His sight.",
    date: "2025-01-02",
  },
  {
    id: 15,
    category: "Healing",
    scripture:
      "He was pierced for our transgressions, he was crushed for our iniquities; the punishment that brought us peace was on him, and by his wounds we are healed.",
    reference: "Isaiah 53:5",
    reflection:
      "Jesus bore your pain so you could experience healing. Physical, emotional, spiritual—His sacrifice covers it all. Receive His healing today.",
    date: "2025-01-01",
  },
  {
    id: 16,
    category: "Victory",
    scripture:
      "No, in all these things we are more than conquerors through him who loved us.",
    reference: "Romans 8:37",
    reflection:
      "You're not just surviving—you're conquering. Through Christ, you have authority over every challenge. Walk as the victor you are in Him.",
    date: "2024-12-31",
  },
  {
    id: 17,
    category: "Peace",
    scripture:
      "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.",
    reference: "Philippians 4:6",
    reflection:
      "Anxiety loses its grip when you bring your concerns to God. Exchange your worries for His peace through prayer and trust.",
    date: "2024-12-30",
  },
  {
    id: 18,
    category: "Strength",
    scripture:
      "But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.",
    reference: "Isaiah 40:31",
    reflection:
      "When you feel exhausted, wait on the Lord. He renews, restores, and revitalizes. Your strength is coming from an eternal source.",
    date: "2024-12-29",
  },
  {
    id: 19,
    category: "Hope",
    scripture:
      "Why, my soul, are you downcast? Why so disturbed within me? Put your hope in God, for I will yet praise him, my Savior and my God.",
    reference: "Psalm 42:11",
    reflection:
      "When discouragement comes, remind your soul of God's faithfulness. Hope in Him is never misplaced—praise will come again.",
    date: "2024-12-28",
  },
  {
    id: 20,
    category: "Love",
    scripture:
      "And I pray that you, being rooted and established in love, may have power to grasp how wide and long and high and deep is the love of Christ.",
    reference: "Ephesians 3:17-18",
    reflection:
      "God's love is beyond measure—wider than your failures, longer than your journey, higher than your dreams, deeper than your pain. You are fully loved.",
    date: "2024-12-27",
  },
  {
    id: 21,
    category: "Guidance",
    scripture:
      "I will instruct you and teach you in the way you should go; I will counsel you with my loving eye on you.",
    reference: "Psalm 32:8",
    reflection:
      "God promises personal guidance for your life. He sees you, knows your path, and is committed to leading you with wisdom and love.",
    date: "2024-12-26",
  },
  {
    id: 22,
    category: "Provision",
    scripture:
      "The Lord is my shepherd, I lack nothing.",
    reference: "Psalm 23:1",
    reflection:
      "With God as your shepherd, you have everything you need. He leads you to rest, refreshment, and righteousness. Trust His provision today.",
    date: "2024-12-25",
  },
  {
    id: 23,
    category: "Healing",
    scripture:
      "I have seen their ways, but I will heal them; I will guide them and restore comfort to Israel's mourners.",
    reference: "Isaiah 57:18",
    reflection:
      "Even when you've wandered, God promises healing and restoration. He meets you where you are and brings comfort to your mourning.",
    date: "2024-12-24",
  },
  {
    id: 24,
    category: "Victory",
    scripture:
      "The Lord will fight for you; you need only to be still.",
    reference: "Exodus 14:14",
    reflection:
      "Sometimes victory requires stillness, not striving. God fights your battles. Rest in His power and watch Him work on your behalf.",
    date: "2024-12-23",
  },
  {
    id: 25,
    category: "Peace",
    scripture:
      "Let the peace of Christ rule in your hearts, since as members of one body you were called to peace.",
    reference: "Colossians 3:15",
    reflection:
      "Allow Christ's peace to be the umpire of your heart, making the final call in every decision. When peace reigns, clarity follows.",
    date: "2024-12-22",
  },
  {
    id: 26,
    category: "Strength",
    scripture:
      "God is our refuge and strength, an ever-present help in trouble.",
    reference: "Psalm 46:1",
    reflection:
      "In times of trouble, God is not distant—He is ever-present. Run to Him as your safe place and find strength for whatever you face.",
    date: "2024-12-21",
  },
  {
    id: 27,
    category: "Hope",
    scripture:
      "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
    reference: "Romans 8:28",
    reflection:
      "Even in the midst of difficulty, God is weaving everything together for your good. Trust His purpose, even when you can't see the full picture.",
    date: "2024-12-20",
  },
  {
    id: 28,
    category: "Love",
    scripture:
      "But God demonstrates his own love for us in this: While we were still sinners, Christ died for us.",
    reference: "Romans 5:8",
    reflection:
      "You don't have to earn God's love or clean yourself up first. He loved you at your worst and proved it through Christ's sacrifice.",
    date: "2024-12-19",
  },
  {
    id: 29,
    category: "Guidance",
    scripture:
      "The Lord makes firm the steps of the one who delights in him; though he may stumble, he will not fall, for the Lord upholds him with his hand.",
    reference: "Psalm 37:23-24",
    reflection:
      "Every step you take is secured by God's hand. Even when you stumble, He holds you up. Walk confidently in His guidance today.",
    date: "2024-12-18",
  },
  {
    id: 30,
    category: "Provision",
    scripture:
      "Therefore I tell you, do not worry about your life, what you will eat or drink; or about your body, what you will wear. Is not life more than food, and the body more than clothes?",
    reference: "Matthew 6:25",
    reflection:
      "Worry adds nothing to your life, but trust adds everything. God knows your needs and promises to provide. Release your concerns to Him.",
    date: "2024-12-17",
  },
  {
    id: 31,
    category: "Healing",
    scripture:
      "Come to me, all you who are weary and burdened, and I will give you rest.",
    reference: "Matthew 11:28",
    reflection:
      "Jesus invites you to bring your weariness to Him. His rest is restorative, healing body, mind, and spirit. Come to Him today.",
    date: "2024-12-16",
  },
  {
    id: 32,
    category: "Victory",
    scripture:
      "What, then, shall we say in response to these things? If God is for us, who can be against us?",
    reference: "Romans 8:31",
    reflection:
      "With God on your side, no opposition can ultimately succeed. Stand firm in the confidence that the Creator of the universe supports you.",
    date: "2024-12-15",
  },
];
