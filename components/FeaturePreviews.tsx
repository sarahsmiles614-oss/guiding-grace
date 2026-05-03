import Link from "next/link";

const signupHref = "/subscribe";

const pages = [
  {
    label: "Daily Devotion",
    icon: "📖",
    bg: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/edenmoon-rainbow-5145675_1920.jpg",
    header: "Daily Devotions",
    content: (
      <>
        <p className="text-amber-200 text-[10px] font-semibold uppercase tracking-widest mb-1">Romans 8:28</p>
        <p className="text-white text-[11px] leading-relaxed italic mb-2" style={{ fontFamily: "'Lora', Georgia, serif" }}>"And we know that in all things God works for the good of those who love him..."</p>
        <p className="text-white/70 text-[10px] leading-relaxed">Today's reflection draws us into the promise that nothing in our lives is wasted...</p>
      </>
    ),
  },
  {
    label: "Prayer Wall",
    icon: "🙏",
    bg: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/imagenesiacristianas-ai-generated-8762262.jpg",
    header: "P.U.S.H. Prayer Wall",
    content: (
      <div className="space-y-1.5">
        {["Healing for my daughter 🙏", "Strength to forgive", "Guidance in a new season"].map((t, i) => (
          <div key={i} className="bg-white/15 rounded-lg px-2 py-1.5">
            <p className="text-white text-[10px]">{t}</p>
            <p className="text-white/40 text-[9px] mt-0.5">🕊️ {[23,17,31][i]} praying</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    label: "His Promises",
    icon: "🕊️",
    bg: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/gersweb-god-2012104.jpg",
    header: "His Promises",
    content: (
      <div className="space-y-1.5">
        {[
          { ref: "Jer 29:11", text: "I know the plans I have for you...", tag: "Hope" },
          { ref: "Isa 41:10", text: "Do not fear, for I am with you...", tag: "Strength" },
          { ref: "Phil 4:7", text: "The peace of God guards your heart...", tag: "Peace" },
        ].map((p, i) => (
          <div key={i} className="bg-white/15 rounded-lg px-2 py-1.5">
            <div className="flex justify-between mb-0.5">
              <span className="text-white/50 text-[9px] border border-white/20 rounded px-1">{p.tag}</span>
              <span className="text-white/40 text-[9px]">{p.ref}</span>
            </div>
            <p className="text-white text-[10px] italic" style={{ fontFamily: "'Playfair Display', serif" }}>{p.text}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    label: "Dive Deeper",
    icon: "📔",
    bg: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/Images%204/zoltan-tasi-KHD_FA43aMw-unsplash.jpg",
    header: "Dive Deeper",
    content: (
      <div className="space-y-2">
        <div>
          <p className="text-white text-[10px] font-semibold mb-1" style={{ fontFamily: "'Lora', serif" }}>What stood out to me</p>
          <div className="bg-white/10 border border-white/20 rounded-lg px-2 py-1.5 h-8" />
        </div>
        <div>
          <p className="text-white text-[10px] font-semibold mb-1" style={{ fontFamily: "'Lora', serif" }}>My Prayer</p>
          <div className="bg-white/10 border border-white/20 rounded-lg px-2 py-1.5 h-8" />
        </div>
      </div>
    ),
  },
  {
    label: "Scripture Match",
    icon: "🎮",
    bg: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/Images%204/todd-trapani-91T-rq-pY28-unsplash.jpg",
    header: "Scripture Match",
    content: (
      <div>
        <div className="grid grid-cols-3 gap-1.5 mb-2">
          {["📖", "🕊️", "⚔️", "🌿", "✝️", "🙏"].map((icon, i) => (
            <div key={i} className="bg-white/20 border border-white/30 rounded-lg h-8 flex items-center justify-center text-sm">
              {icon}
            </div>
          ))}
        </div>
        <p className="text-white/60 text-[10px]">Match verses and characters — beat your best time</p>
      </div>
    ),
  },
  {
    label: "Grace Challenge",
    icon: "💛",
    bg: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/hoai-thu-pt-nv4FFbP8IuE-unsplash.jpg",
    header: "Grace Challenge",
    content: (
      <div className="bg-white/10 border border-yellow-300/30 rounded-lg p-2">
        <div className="flex items-center gap-1 mb-1">
          <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
          <p className="text-yellow-300 text-[9px] uppercase tracking-widest font-semibold">Live Now</p>
        </div>
        <p className="text-white text-[10px] leading-relaxed">Text someone today who you have been avoiding. Show grace first.</p>
      </div>
    ),
  },
  {
    label: "Heaven's Hearts",
    icon: "💜",
    bg: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/geralt-heaven-3335585_1920.jpg",
    header: "Heaven's Hearts",
    content: (
      <div className="grid grid-cols-2 gap-1.5">
        {["💜 Grandma Rose", "🌿 Uncle James", "🕊️ Baby Grace", "✝️ Pastor John"].map((name, i) => (
          <div key={i} className="bg-white/15 rounded-lg px-2 py-2 text-center">
            <p className="text-white text-[10px]">{name}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    label: "Nightly Reflection",
    icon: "🌙",
    bg: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/rezaaskarii-sweden-6834164.jpg",
    header: "Nightly Reflection",
    content: (
      <div className="space-y-2">
        <div className="bg-white/10 border border-purple-300/20 rounded-lg px-2 py-1.5">
          <p className="text-purple-200 text-[9px] uppercase tracking-widest mb-1">I am grateful for</p>
          <div className="bg-white/10 rounded h-6" />
        </div>
        <div className="bg-white/10 border border-purple-300/20 rounded-lg px-2 py-1.5">
          <p className="text-purple-200 text-[9px] uppercase tracking-widest mb-1">I surrender to God</p>
          <div className="bg-white/10 rounded h-6" />
        </div>
      </div>
    ),
  },
];

export default function FeaturePreviews() {
  return (
    <div className="w-full grid grid-cols-2 gap-4">
      {pages.map((page) => (
        <Link key={page.label} href={signupHref}>
          <div className="relative rounded-3xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform border border-white/15" style={{ aspectRatio: "9/16" }}>
            {/* Page background */}
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${page.bg}')` }} />
            <div className="absolute inset-0 bg-black/50" />

            {/* Simulated page UI */}
            <div className="relative h-full flex flex-col p-3">
              {/* Nav bar */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/40 text-[9px]">← Back</span>
                <p className="text-white text-[10px] font-bold text-center" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>{page.header}</p>
                <span className="w-8" />
              </div>

              {/* Page content */}
              <div className="flex-1 overflow-hidden">
                {page.content}
              </div>

              {/* Bottom label */}
              <div className="mt-2 flex items-center gap-1">
                <span className="text-base">{page.icon}</span>
                <span className="text-white/60 text-[9px]">{page.label}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
