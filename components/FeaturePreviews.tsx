import Link from "next/link";

const signupHref = "/subscribe";

export default function FeaturePreviews() {
  return (
    <div className="w-full space-y-4">

      {/* Dive Deeper */}
      <Link href={signupHref}>
        <div className="relative rounded-2xl overflow-hidden cursor-pointer hover:opacity-90 transition" style={{ backgroundImage: "url('https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/Images%204/zoltan-tasi-KHD_FA43aMw-unsplash.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
          <div className="bg-black/60 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">📔</span>
                <p className="text-white/70 text-xs uppercase tracking-widest font-semibold">Dive Deeper — Daily Journal</p>
              </div>
              <span className="text-white/40 text-xs">Open →</span>
            </div>
            <p className="text-white font-semibold text-sm mb-2" style={{ fontFamily: "'Lora', Georgia, serif", textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>What stood out to me</p>
            <div className="bg-white/10 border border-white/15 rounded-xl px-4 py-2 mb-3">
              <p className="text-white/35 text-xs italic">Write freely...</p>
            </div>
            <p className="text-white font-semibold text-sm mb-2" style={{ fontFamily: "'Lora', Georgia, serif", textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>My Prayer</p>
            <div className="bg-white/10 border border-white/15 rounded-xl px-4 py-2">
              <p className="text-white/35 text-xs italic">Dear Lord...</p>
            </div>
          </div>
        </div>
      </Link>

      {/* Prayer Wall */}
      <Link href={signupHref}>
        <div className="relative rounded-2xl overflow-hidden cursor-pointer hover:opacity-90 transition" style={{ backgroundImage: "url('https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/imagenesiacristianas-ai-generated-8762262.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
          <div className="bg-black/65 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🙏</span>
                <p className="text-white/70 text-xs uppercase tracking-widest font-semibold">P.U.S.H. Prayer Wall</p>
              </div>
              <span className="text-white/40 text-xs">Pray →</span>
            </div>
            <div className="space-y-2">
              {[
                { text: "Praying for my daughter's healing", count: 23 },
                { text: "Strength to forgive someone who hurt me", count: 17 },
                { text: "Guidance as I start a new chapter", count: 31 },
              ].map((p, i) => (
                <div key={i} className="bg-white/10 border border-white/15 rounded-xl px-4 py-2.5">
                  <p className="text-white/80 text-xs" style={{ fontFamily: "'Lora', Georgia, serif" }}>{p.text}</p>
                  <p className="text-white/35 text-xs mt-1">🕊️ {p.count} praying</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Link>

      {/* Scripture Match */}
      <Link href={signupHref}>
        <div className="relative rounded-2xl overflow-hidden cursor-pointer hover:opacity-90 transition" style={{ backgroundImage: "url('https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/Images%204/todd-trapani-91T-rq-pY28-unsplash.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
          <div className="bg-black/65 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎮</span>
                <p className="text-white/70 text-xs uppercase tracking-widest font-semibold">Scripture Match</p>
              </div>
              <span className="text-white/40 text-xs">Play →</span>
            </div>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {["📖", "🕊️", "⚔️", "🌿", "✝️", "🙏", "💛", "🌙"].map((icon, i) => (
                <div key={i} className="bg-white/15 border border-white/25 rounded-xl h-11 flex items-center justify-center text-lg">
                  {icon}
                </div>
              ))}
            </div>
            <p className="text-white/60 text-xs" style={{ fontFamily: "'Lora', Georgia, serif" }}>Match today's verses and Bible characters — beat your best time.</p>
          </div>
        </div>
      </Link>

      {/* His Promises */}
      <Link href={signupHref}>
        <div className="relative rounded-2xl overflow-hidden cursor-pointer hover:opacity-90 transition" style={{ backgroundImage: "url('https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/gersweb-god-2012104.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
          <div className="bg-black/60 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🕊️</span>
                <p className="text-white/70 text-xs uppercase tracking-widest font-semibold">His Promises</p>
              </div>
              <span className="text-white/40 text-xs">Browse →</span>
            </div>
            <div className="space-y-3">
              {[
                { ref: "Jeremiah 29:11", text: "For I know the plans I have for you, plans to prosper you and not to harm you, plans to give you hope and a future.", category: "Hope" },
                { ref: "Isaiah 41:10", text: "So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you.", category: "Strength" },
                { ref: "Philippians 4:7", text: "And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.", category: "Peace" },
              ].map((p) => (
                <div key={p.ref} className="bg-white/10 border border-white/20 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/50 text-xs border border-white/20 rounded-lg px-2 py-0.5">{p.category}</span>
                    <span className="text-white/40 text-xs">{p.ref}</span>
                  </div>
                  <p className="text-white/85 text-sm leading-relaxed italic" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 1px 4px rgba(0,0,0,0.7)" }}>"{p.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Link>

      {/* Remaining 6 features grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: "🎧", label: "Bible in 365 Days", desc: "Read through the whole Bible in a year", bg: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/saud-edum-cgapZpzd7v0-unsplash%20(1).jpg" },
          { icon: "💜", label: "Heaven's Hearts", desc: "Honor loved ones you've lost", bg: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/geralt-heaven-3335585_1920.jpg" },
          { icon: "⚔️", label: "Heroes & Villains", desc: "Bold heroes and villains of the Bible", bg: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/glagolyvechnoyzhizni-goliath-8748113_1920.png" },
          { icon: "🌙", label: "Nightly Reflections", desc: "End your day with gratitude", bg: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/rezaaskarii-sweden-6834164.jpg" },
          { icon: "🗑️", label: "Shame Recycle", desc: "Write it down. Let it burn. Walk free.", bg: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/Images%204/cullan-smith-xZO6k-bBFas-unsplash.jpg" },
          { icon: "✝️", label: "Study Groups", desc: "Study the Word together", bg: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/Images%204/davide-ragusa-YjW8Qn85V6Y-unsplash.jpg" },
        ].map(f => (
          <Link key={f.label} href={signupHref}>
            <div className="relative rounded-2xl overflow-hidden cursor-pointer hover:opacity-90 transition" style={{ backgroundImage: `url('${f.bg}')`, backgroundSize: "cover", backgroundPosition: "center" }}>
              <div className="bg-black/60 p-4">
                <span className="text-2xl block mb-2">{f.icon}</span>
                <p className="text-white font-semibold text-xs mb-1" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>{f.label}</p>
                <p className="text-white/60 text-xs leading-relaxed">{f.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
