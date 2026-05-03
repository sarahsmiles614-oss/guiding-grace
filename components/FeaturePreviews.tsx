import Link from "next/link";

const signupHref = "/subscribe";

export default function FeaturePreviews() {
  return (
    <div className="w-full space-y-4">

      <Link href={signupHref}>
        <div className="relative rounded-2xl overflow-hidden cursor-pointer hover:opacity-90 transition h-44" style={{ backgroundImage: "url('https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/Images%204/zoltan-tasi-KHD_FA43aMw-unsplash.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
          <div className="absolute inset-0 bg-black/45 p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">📔</span>
                <p className="text-white text-xs uppercase tracking-widest font-semibold" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>Daily Study Guide</p>
              </div>
              <span className="text-white/60 text-xs">Open →</span>
            </div>
            <div>
              <p className="text-white font-semibold text-sm mb-2" style={{ fontFamily: "'Lora', Georgia, serif", textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>Background · Reflection Questions · Application</p>
              <div className="flex gap-2">
                <div className="bg-black/30 border border-white/20 rounded-lg px-3 py-1.5 flex-1">
                  <p className="text-white/50 text-xs italic">What stood out to me...</p>
                </div>
                <div className="bg-black/30 border border-white/20 rounded-lg px-3 py-1.5 flex-1">
                  <p className="text-white/50 text-xs italic">My prayer today...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>

      <Link href={signupHref}>
        <div className="relative rounded-2xl overflow-hidden cursor-pointer hover:opacity-90 transition h-44" style={{ backgroundImage: "url('https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/imagenesiacristianas-ai-generated-8762262.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
          <div className="absolute inset-0 bg-black/45 p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🙏</span>
                <p className="text-white text-xs uppercase tracking-widest font-semibold" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>P.U.S.H. Prayer Wall</p>
              </div>
              <span className="text-white/60 text-xs">Pray →</span>
            </div>
            <div className="space-y-1.5">
              {[
                { text: "Praying for my daughter's healing", count: 23 },
                { text: "Strength to forgive someone who hurt me", count: 17 },
                { text: "Guidance as I start a new chapter", count: 31 },
              ].map((p, i) => (
                <div key={i} className="flex items-center justify-between bg-black/30 border border-white/15 rounded-lg px-3 py-1.5">
                  <p className="text-white text-xs" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>{p.text}</p>
                  <p className="text-white/50 text-xs ml-2 flex-shrink-0">🕊️ {p.count}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Link>

      <Link href={signupHref}>
        <div className="relative rounded-2xl overflow-hidden cursor-pointer hover:opacity-90 transition h-44" style={{ backgroundImage: "url('https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/Images%204/todd-trapani-91T-rq-pY28-unsplash.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
          <div className="absolute inset-0 bg-black/45 p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎮</span>
                <p className="text-white text-xs uppercase tracking-widest font-semibold" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>Scripture Match Game</p>
              </div>
              <span className="text-white/60 text-xs">Play →</span>
            </div>
            <div>
              <div className="grid grid-cols-6 gap-1.5 mb-2">
                {["📖", "🕊️", "⚔️", "🌿", "✝️", "🙏"].map((icon, i) => (
                  <div key={i} className="bg-white/20 border border-white/30 rounded-lg h-9 flex items-center justify-center text-base">
                    {icon}
                  </div>
                ))}
              </div>
              <p className="text-white/70 text-xs" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>Match verses and characters — beat your best time daily</p>
            </div>
          </div>
        </div>
      </Link>

      <Link href={signupHref}>
        <div className="relative rounded-2xl overflow-hidden cursor-pointer hover:opacity-90 transition h-52" style={{ backgroundImage: "url('https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/gersweb-god-2012104.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
          <div className="absolute inset-0 bg-black/45 p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🕊️</span>
                <p className="text-white text-xs uppercase tracking-widest font-semibold" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>His Promises</p>
              </div>
              <span className="text-white/60 text-xs">Browse →</span>
            </div>
            <div className="space-y-2">
              {[
                { ref: "Jeremiah 29:11", text: "For I know the plans I have for you...", category: "Hope" },
                { ref: "Isaiah 41:10", text: "So do not fear, for I am with you...", category: "Strength" },
                { ref: "Philippians 4:7", text: "The peace of God will guard your hearts...", category: "Peace" },
              ].map((p) => (
                <div key={p.ref} className="flex items-center justify-between bg-black/30 border border-white/15 rounded-lg px-3 py-1.5">
                  <p className="text-white text-xs italic" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>{p.text}</p>
                  <span className="text-white/50 text-xs ml-2 flex-shrink-0">{p.ref}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Link>

      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: "🎧", label: "Bible in 365 Days", desc: "Read the whole Bible in a year", bg: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/saud-edum-cgapZpzd7v0-unsplash%20(1).jpg" },
          { icon: "💜", label: "Heaven's Hearts", desc: "Honor loved ones you have lost", bg: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/geralt-heaven-3335585_1920.jpg" },
          { icon: "⚔️", label: "Heroes & Villains", desc: "Bold Bible figures and their stories", bg: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/glagolyvechnoyzhizni-goliath-8748113_1920.png" },
          { icon: "🌙", label: "Nightly Reflections", desc: "End your day with gratitude", bg: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/rezaaskarii-sweden-6834164.jpg" },
          { icon: "🗑️", label: "Shame Recycle Bin", desc: "Write it down. Let it burn. Walk free.", bg: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/Images%204/cullan-smith-xZO6k-bBFas-unsplash.jpg" },
          { icon: "✨", label: "Truth Testimonies", desc: "Share what God has done in your life", bg: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/edenmoon-rainbow-5145675_1920.jpg" },
        ].map(f => (
          <Link key={f.label} href={signupHref}>
            <div className="relative rounded-2xl overflow-hidden cursor-pointer hover:opacity-90 transition h-32" style={{ backgroundImage: `url('${f.bg}')`, backgroundSize: "cover", backgroundPosition: "center" }}>
              <div className="absolute inset-0 bg-black/40 p-4 flex flex-col justify-between">
                <span className="text-2xl">{f.icon}</span>
                <div>
                  <p className="text-white font-semibold text-xs mb-0.5" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>{f.label}</p>
                  <p className="text-white/70 text-xs leading-tight" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>{f.desc}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
