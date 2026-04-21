import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundImage: "url('https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/hoai-thu-pt-nv4FFbP8IuE-unsplash.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="min-h-screen flex flex-col bg-black/40">

        {/* Nav */}
        <nav className="flex justify-between items-center px-6 pt-6">
          <p className="text-white/60 text-sm font-medium">Guiding Grace</p>
          <Link href="/signin">
            <button className="text-white/80 hover:text-white text-sm border border-white/30 px-4 py-1.5 rounded-full transition">Sign In</button>
          </Link>
        </nav>

        <div className="flex-1 flex flex-col items-center w-full">

          {/* Hero */}
          <div className="flex flex-col items-center justify-center text-center px-6 py-20 w-full">
            <p className="text-purple-200 text-sm uppercase tracking-widest mb-4">A Daily Faith Companion</p>
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 4px 20px rgba(0,0,0,0.8)" }}>
              Start Each Day<br />With His Grace
            </h1>
            <p className="text-xl text-white/80 max-w-xl mx-auto mb-10">Daily devotions, scripture promises, and sacred spaces to nurture your faith journey.</p>
            <Link href="/subscribe">
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur border border-white/40 text-white text-xl px-10 py-4 rounded-xl font-semibold mb-4 transition">Start 3-Day Free Trial</button>
            </Link>
            <p className="text-white/60 text-sm">$2.99/month · No credit card required · Cancel anytime</p>
          </div>

          {/* Grace Challenge */}
          <div className="text-center px-6 pb-12 w-full" style={{ maxWidth: "640px" }}>
            <p className="text-white/50 text-xs uppercase tracking-widest mb-3">New Feature</p>
            <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}>Daily Grace Challenge</h2>
            <p className="text-white/75 mb-8 leading-relaxed">Each morning a new challenge drops — a real-world act of grace for you to take into your day. Share how it went, give hearts to responses that move you, and see who the community recognizes as most full of grace.</p>
            <div className="grid grid-cols-3 gap-6 mb-10">
              {[
                { icon: "☀️", label: "Morning Challenge", desc: "A new grace prompt every day at 7am" },
                { icon: "💛", label: "Blind Heart Voting", desc: "Give hearts without seeing the count" },
                { icon: "🏆", label: "Most Loved", desc: "Morning reveal honors the most graceful response" },
              ].map(f => (
                <div key={f.label} className="text-center">
                  <div className="text-3xl mb-2">{f.icon}</div>
                  <p className="text-white text-sm font-semibold mb-1">{f.label}</p>
                  <p className="text-white/60 text-xs">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="px-6 pb-12 w-full" style={{ maxWidth: "640px" }}>
            <p className="text-center text-white/50 text-xs uppercase tracking-widest mb-6">Everything Inside</p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: "📖", label: "Daily Devotions" },
                { icon: "🕊️", label: "His Promises" },
                { icon: "🗑️", label: "Shame Recycle Bin" },
                { icon: "💜", label: "Heaven's Hearts" },
                { icon: "🌙", label: "Nightly Reflections" },
                { icon: "⚔️", label: "Heroes & Villains" },
                { icon: "🙏", label: "P.U.S.H. Prayer Wall" },
                { icon: "✨", label: "Truth Testimonies" },
                { icon: "💛", label: "Grace Challenge" },
              ].map(f => (
                <div key={f.label} className="flex flex-col items-center text-center gap-1">
                  <span className="text-2xl">{f.icon}</span>
                  <span className="text-white/80 text-xs">{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer CTA */}
          <div className="text-center pb-16 px-6 w-full">
            <h3 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}>Ready to walk in grace?</h3>
            <p className="text-white/60 mb-6 text-sm">3-day free trial. No credit card required.</p>
            <Link href="/subscribe">
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur border border-white/40 text-white font-semibold px-10 py-4 rounded-xl transition">Start Free Trial</button>
            </Link>
          </div>

          <footer className="text-center pb-8 text-white/30 text-xs space-x-4 w-full">
            <Link href="/terms" className="hover:text-white/60">Terms</Link>
            <Link href="/privacy" className="hover:text-white/60">Privacy</Link>
          </footer>

        </div>
      </div>
    </div>
  );
}
