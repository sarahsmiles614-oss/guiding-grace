import { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import FeaturePreviews from "@/components/FeaturePreviews";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function getToday() {
  const ny = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());
  const [m, d, y] = ny.split("/");
  const today = `${y}-${m}-${d}`;
  const { data: devotion } = await supabase
    .from("daily_devotions")
    .select("title, verse_reference, verse_text, reflection")
    .eq("devotion_date", today)
    .single();
  const { data: challenge } = await supabase
    .from("grace_challenges")
    .select("challenge_text")
    .eq("challenge_date", today)
    .single();
  return { devotion, challenge };
}

export async function generateMetadata(): Promise<Metadata> {
  const { devotion } = await getToday();
  const today = new Date().toLocaleDateString("en-US", { timeZone: "America/New_York", month: "long", day: "numeric", year: "numeric" });
  return {
    title: devotion
      ? `${devotion.title} — Daily Christian Devotion for ${today} | Guiding Grace`
      : `Daily Christian Devotion for ${today} | Guiding Grace`,
    description: devotion
      ? `${devotion.verse_reference}: ${devotion.verse_text.slice(0, 120)}... Today's devotion from Guiding Grace.`
      : "A fresh daily Bible devotion, scripture promise, and grace challenge — every morning from Guiding Grace.",
    alternates: { canonical: "https://guidinggrace.app/daily" },
    openGraph: {
      title: devotion ? `${devotion.title} | Guiding Grace` : "Daily Devotion | Guiding Grace",
      description: devotion ? `${devotion.verse_reference} — ${devotion.verse_text.slice(0, 100)}...` : "Daily devotions from Guiding Grace.",
      url: "https://guidinggrace.app/daily",
      siteName: "Guiding Grace",
      type: "article",
    },
  };
}

export default async function DailyPage() {
  const { devotion, challenge } = await getToday();
  const today = new Date().toLocaleDateString("en-US", { timeZone: "America/New_York", weekday: "long", month: "long", day: "numeric", year: "numeric" });

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/hoai-thu-pt-nv4FFbP8IuE-unsplash.jpg')" }}
    >
      <div className="min-h-screen bg-black/55 flex flex-col">
        <nav className="flex justify-between items-center px-6 pt-6 pb-4">
          <Link href="/" className="text-white/60 text-sm hover:text-white transition">Guiding Grace</Link>
          <Link href="/" className="text-white/60 text-xs hover:text-white transition border border-white/20 px-3 py-1.5 rounded-xl">Sign In</Link>
        </nav>

        <main className="flex-1 flex flex-col items-center px-6 py-10 max-w-2xl mx-auto w-full">

          <p className="text-white/40 text-xs uppercase tracking-widest mb-2">{today}</p>
          <p className="text-white/50 text-xs uppercase tracking-widest mb-8">Daily Devotion</p>

          {devotion ? (
            <>
              <h1
                className="text-3xl sm:text-4xl font-bold text-white text-center mb-6 leading-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 4px 20px rgba(0,0,0,0.8)" }}
              >
                {devotion.title}
              </h1>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-6 w-full">
                <p className="text-amber-200 text-xs font-semibold uppercase tracking-widest mb-3">{devotion.verse_reference}</p>
                <p className="text-white text-base leading-relaxed italic mb-4" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.8)", fontFamily: "'Lora', Georgia, serif" }}>
                  "{devotion.verse_text}"
                </p>
              </div>

              <div className="w-full mb-8">
                <p className="text-white/90 text-base leading-relaxed" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)", fontFamily: "'Lora', Georgia, serif" }}>
                  {devotion.reflection}
                </p>
              </div>

              <div className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-10 text-center">
                <p className="text-white font-bold text-lg mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
                  Go deeper with every devotion
                </p>
                <p className="text-white/70 text-sm mb-5 leading-relaxed">
                  Journal your reflections, take the daily Grace Challenge, pray with your community, track your streak, and read through the entire Bible — all in one place.
                </p>
                <Link href="/subscribe">
                  <button className="bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold py-3 px-8 rounded-2xl transition text-sm mb-3 w-full">
                    ✨ Start Free Trial — No Card Required
                  </button>
                </Link>
                <Link href="/">
                  <button className="text-white/50 hover:text-white text-xs py-2 transition w-full">
                    Already have an account? Sign in
                  </button>
                </Link>
              </div>

              {challenge && (
                <div className="w-full bg-white/10 backdrop-blur-sm border border-yellow-300/20 rounded-2xl p-5 mb-10">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                    <p className="text-yellow-300 text-xs uppercase tracking-widest font-semibold">Today's Grace Challenge</p>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed">{challenge.challenge_text}</p>
                  <p className="text-white/40 text-xs mt-3">Sign in to respond and see how the community is living it out.</p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-white/60 text-sm">Today's devotion is being prepared. Check back shortly after midnight.</p>
            </div>
          )}

          <div className="w-full border-t border-white/10 pt-10">
            <p className="text-white/50 text-xs uppercase tracking-widest text-center mb-2">Everything inside Guiding Grace</p>
            <p className="text-white/30 text-xs text-center mb-8">Start your free trial to unlock all features</p>
            <FeaturePreviews />

            <div className="mt-8 text-center">
              <Link href="/subscribe">
                <button className="bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold py-3 px-10 rounded-2xl transition text-sm">
                  ✨ Start Free Trial — No Card Required
                </button>
              </Link>
            </div>
          </div>

        </main>

        <footer className="text-center py-6 px-6">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} Guiding Grace ·
            <Link href="/privacy" className="hover:text-white/50 ml-1">Privacy</Link> ·
            <Link href="/terms" className="hover:text-white/50 ml-1">Terms</Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
