import { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import AuthForm from "@/components/AuthForm";
import ScreenshotGallery from "@/components/ScreenshotGallery";
import NavMenu from "@/components/NavMenu";

const BG = "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/Images%204/heejing-kim-TqaFGqxiCQo-unsplash.jpg";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function getToday() {
  const ny = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());
  const [m, d, y] = ny.split("/");
  return `${y}-${m}-${d}`;
}

export const metadata: Metadata = {
  title: "Guiding Grace — Bible in 365 Days, Daily Devotions & Christian Faith Community",
  description: "Read the Bible in 365 days with canonical, chronological & more reading plans — each with a connected journal. Plus daily devotions, grace challenges, prayer wall & faith community. Free trial.",
  alternates: { canonical: "https://guidinggrace.app" },
  keywords: [
    "Bible in 365 days", "read the Bible in a year", "canonical Bible reading plan",
    "chronological Bible reading plan", "Bible reading plan with journal",
    "daily Christian devotions", "grace challenge", "prayer wall app",
    "Christian faith community", "Bible study journal", "scripture promises",
    "nightly reflections", "Christian app", "daily devotional app",
    "Bible 365", "faith companion app", "Guiding Grace",
  ],
  openGraph: {
    title: "Guiding Grace — Bible in 365 Days, Daily Devotions & Faith Community",
    description: "Read the Bible in a year with canonical, chronological & more plans — each with a connected journal. Daily devotions, grace challenges, prayer wall & more. Free trial.",
    url: "https://guidinggrace.app",
    siteName: "Guiding Grace",
    type: "website",
  },
};

export default async function Home() {
  const today = getToday();
  const todayLabel = new Date().toLocaleDateString("en-US", { timeZone: "America/New_York", weekday: "long", month: "long", day: "numeric", year: "numeric" });

  const [{ data: devotion }, { data: challenge }] = await Promise.all([
    supabase.from("daily_devotions").select("title, verse_reference, verse_text, reflection").eq("devotion_date", today).single(),
    supabase.from("grace_challenges").select("challenge_text").eq("challenge_date", today).single(),
  ]);

  return (
    <div className="min-h-screen w-full bg-cover bg-center" style={{ backgroundImage: `url('${BG}')` }}>
      <div className="min-h-screen w-full bg-black/30 flex flex-col">

        {/* Nav */}
        <nav className="w-full flex justify-between items-center px-4 pt-6 pb-2">
          <NavMenu />
          <p className="text-white font-semibold text-sm" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>Guiding Grace</p>
          <div className="w-9" />
        </nav>

        {/* All content centered */}
        <div className="flex-1 w-full flex flex-col items-center px-4 py-8">
          <div className="w-full max-w-lg">

            {/* Hero */}
            <div className="text-center mb-6">
              <p className="text-white/50 text-xs uppercase tracking-widest mb-3">Your Daily Faith Companion</p>
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 4px 20px rgba(0,0,0,0.8)" }}>
                365 Days of Grace,<br />Community & Scripture
              </h1>
              <p className="text-white text-sm mb-6 leading-relaxed" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
                Read the Bible in 365 days — canonical, chronological, and more — each plan with a connected journal. Plus daily devotions, live grace challenges, a prayer wall, and sacred spaces you will not find anywhere else.
              </p>
            </div>

            {/* Sign in — top of page */}
            <div className="flex flex-col items-center mb-10">
              <div className="w-full max-w-xs">
                <AuthForm />
              </div>
            </div>

            {/* Today's Devotion — preview card */}
            {devotion && (
              <div className="mb-8 rounded-3xl overflow-hidden shadow-2xl" style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.6)" }}>
                {/* Card bg — same floral image used on the devotions page */}
                <div className="relative" style={{
                  backgroundImage: "url('https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/hoai-thu-pt-nv4FFbP8IuE-unsplash.jpg')",
                  backgroundSize: "cover", backgroundPosition: "center",
                }}>
                  <div className="absolute inset-0 bg-black/52" />
                  <div className="relative z-10 px-5 pt-5 pb-6">

                    {/* Header row */}
                    <div className="flex items-center justify-center mb-4">
                      <p className="text-white font-bold text-base tracking-wide" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>Daily Devotions</p>
                    </div>

                    <p className="text-white/55 text-xs uppercase tracking-widest text-center mb-1">{todayLabel}</p>
                    <h2 className="text-2xl font-bold text-white text-center mb-4 leading-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 4px 16px rgba(0,0,0,0.9)" }}>
                      {devotion.title}
                    </h2>

                    {/* Scripture block */}
                    <p className="text-white text-sm leading-relaxed italic text-center mb-1" style={{ fontFamily: "'Lora', Georgia, serif", textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>
                      &ldquo;{devotion.verse_text}&rdquo;
                    </p>
                    <p className="text-white/70 text-xs text-center mb-4" style={{ fontFamily: "'Lora', Georgia, serif" }}>— {devotion.verse_reference}</p>

                    {/* Reflection */}
                    <p className="text-white text-sm leading-relaxed mb-5" style={{ fontFamily: "'Lora', Georgia, serif", textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
                      {devotion.reflection}
                    </p>

                    {/* Action buttons (decorative preview) */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="bg-pink-500/70 backdrop-blur-sm text-white text-xs font-semibold px-5 py-2 rounded-full">
                        🤍 Share This Devotion
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* Grace Challenge */}
            {challenge && (
              <div className="bg-white/10 backdrop-blur-sm border border-yellow-300/30 rounded-2xl p-5 mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                  <p className="text-yellow-300 text-xs uppercase tracking-widest font-semibold">Today's Grace Challenge</p>
                  <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                </div>
                <p className="text-white text-xs leading-relaxed mb-2">{challenge.challenge_text}</p>
                <p className="text-white/40 text-xs">Sign in to respond and see who the community honors as Most Loved 💛</p>
              </div>
            )}

            {/* Screenshot Gallery */}
            <div className="mb-4">
              <p className="text-white/40 text-xs uppercase tracking-widest text-center mb-3">Explore the App</p>
              <ScreenshotGallery />
            </div>



          </div>
        </div>

        <footer className="w-full text-center py-6 px-6">
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
