import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-purple-900 to-indigo-950 flex flex-col">

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <p className="text-purple-300 text-sm uppercase tracking-widest mb-4">A Daily Faith Companion</p>
        <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 4px 20px rgba(0,0,0,0.8)" }}>
          Start Each Day<br />With His Grace
        </h1>
        <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10">Daily devotions, scripture promises, and sacred spaces to nurture your faith journey.</p>
        <Link href="/subscribe">
          <button className="bg-white/90 hover:bg-white text-gray-900 text-xl px-10 py-4 rounded-xl font-semibold mb-4 transition">Start 3-Day Free Trial</button>
        </Link>
        <p className="text-white/60 text-sm">$2.99/month · No credit card required · Cancel anytime</p>
      </main>

      {/* Grace Challenge Feature */}
      <section className="bg-gradient-to-br from-yellow-400 to-orange-400 mx-4 sm:mx-auto sm:max-w-2xl rounded-3xl p-8 mb-8 text-white shadow-2xl">
        <p className="text-xs uppercase tracking-widest mb-2 opacity-80">New Feature</p>
        <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Daily Grace Challenge</h2>
        <p className="text-white/90 mb-6 leading-relaxed">Each morning a new challenge drops — a real-world act of grace for you to take into your day. Share how it went, give hearts to responses that move you, and see who the community recognizes as most full of grace.</p>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { icon: "☀️", label: "Morning Challenge", desc: "A new grace prompt every day at 7am" },
            { icon: "💛", label: "Blind Heart Voting", desc: "Give hearts without seeing the count" },
            { icon: "🏆", label: "Most Loved", desc: "Morning reveal honors the most graceful response" },
          ].map(f => (
            <div key={f.label} className="bg-white/20 rounded-2xl p-4 text-center">
              <div className="text-2xl mb-1">{f.icon}</div>
              <p className="text-xs font-semibold mb-1">{f.label}</p>
              <p className="text-xs opacity-80">{f.desc}</p>
            </div>
          ))}
        </div>
        <Link href="/subscribe">
          <button className="w-full bg-white text-orange-600 font-bold py-3 rounded-xl hover:bg-orange-50 transition">Join the Challenge →</button>
        </Link>
      </section>

      {/* Features Grid */}
      <section className="px-4 sm:px-0 sm:max-w-2xl sm:mx-auto mb-12">
        <p className="text-center text-purple-300 text-xs uppercase tracking-widest mb-6">Everything Inside</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
            <div key={f.label} className="bg-white/10 rounded-2xl p-4 flex items-center gap-3">
              <span className="text-2xl">{f.icon}</span>
              <span className="text-white text-sm font-medium">{f.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="text-center pb-16 px-6">
        <h3 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Ready to walk in grace?</h3>
        <p className="text-white/60 mb-6 text-sm">3-day free trial. No credit card required.</p>
        <Link href="/subscribe">
          <button className="bg-purple-500 hover:bg-purple-400 text-white font-semibold px-10 py-4 rounded-xl transition">Start Free Trial</button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="text-center pb-8 text-white/30 text-xs space-x-4">
        <Link href="/terms" className="hover:text-white/60">Terms</Link>
        <Link href="/privacy" className="hover:text-white/60">Privacy</Link>
      </footer>

    </div>
  );
}
