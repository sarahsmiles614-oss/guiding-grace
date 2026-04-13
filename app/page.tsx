import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundImage: "url('https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/terrianneallen-sunset-3916244.jpg')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }}>
      <div className="min-h-screen flex flex-col bg-black/40">

        <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
          <p className="text-purple-200 text-sm uppercase tracking-widest mb-4">A Daily Faith Companion</p>
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 4px 20px rgba(0,0,0,0.8)" }}>
            Start Each Day<br />With His Grace
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10">Daily devotions, scripture promises, and sacred spaces to nurture your faith journey.</p>
          <Link href="/subscribe">
            <button className="bg-white/20 hover:bg-white/30 backdrop-blur border border-white/40 text-white text-xl px-10 py-4 rounded-xl font-semibold mb-4 transition">Start 3-Day Free Trial</button>
          </Link>
          <p className="text-white/60 text-sm">$2.99/month · No credit card required · Cancel anytime</p>
        </main>

        <section className="text-center px-6 pb-12 max-w-2xl mx-auto w-full">
          <p className="text-white/50 text-xs uppercase tracking-widest mb-3">New Feature</p>
          <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}>Daily Grace Challenge</h2>
          <p className="text-white/75 mb-8 leading-relaxed max-w-xl mx-auto">Each morning a new challenge drops — a real-world act of grace for you to take into your day. Share how it went, give hearts to responses that move you, and see who the community recognizes as most full of grace.</p>
          <div className="grid grid-cols-3 gap-6 mb-10 text-center">
            {[
              { icon: "☀️", label: "Morning Challenge", desc: "A new grace prompt every day at 7am" },
              { icon: "💛", label: "Blind Heart Voting", desc: "Give hearts without seeing the count" },
              { icon: "🏆", label: "Most Loved", desc: "Morning reveal honors the most graceful response" },
            ].map(f => (
              <div key={f.label}>
                <div className="text-3xl mb-2">{f.icon}</div>
                <p className="text-white text-sm font-semibold mb-1">{f.label}</p>
                <p className="text-white/60 text-xs">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 pb-12 max-w-2xl mx-auto w-full">
          <p className="text-center text-white/50 text-xs uppercase tracking-widest mb-6">Everything Inside</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
              <div key={f.label} className="flex items-center gap-3">
                <span className="text-2xl">{f.icon}</span>
                <span className="text-white/80 text-sm">{f.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="text-center pb-16 px-6">
          <h3 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}>Ready to walk in grace?</h3>
          <p className="text-white/60 mb-6 text-sm">3-day free trial. No credit card required.</p>
          <Link href="/subscribe">
            <button className="bg-white/20 hover:bg-white/30 backdrop-blur border border-white/40 text-white font-semibold px-10 py-4 rounded-xl transition">Start Free Trial</button>
          </Link>
        </section>

        <footer className="text-center pb-8 text-white/30 text-xs space-x-4">
          <Link href="/terms" className="hover:text-white/60">Terms</Link>
          <Link href="/privacy" className="hover:text-white/60">Privacy</Link>
        </footer>

      </div>
    </div>
  );
}
