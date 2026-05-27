import { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import AuthForm from "@/components/AuthForm";
import ScreenshotGallery from "@/components/ScreenshotGallery";
import NavMenu from "@/components/NavMenu";
import InstallBanner from "@/components/InstallBanner";
import ShareButton from "@/components/ShareButton";

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
          <p className="text-white font-semibold text-base" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>Guiding Grace</p>
          <div className="w-9" />
        </nav>

        {/* All content centered */}
        <div className="flex-1 w-full flex flex-col items-center px-4 py-8">
          <div className="w-full max-w-lg md:max-w-2xl">

            {/* Hero */}
            <div className="text-center mb-6">
              <p className="text-white/50 text-base uppercase tracking-widest mb-3">Your Daily Faith Companion</p>
              <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 4px 20px rgba(0,0,0,0.8)" }}>
                365 Days of Grace,<br />Community & Scripture
              </h1>
              <p className="text-white text-lg mb-6 leading-relaxed" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
                Read the Bible in 365 days — canonical, chronological, and more — each plan with a connected journal. Plus daily devotions, live grace challenges, a prayer wall, and sacred spaces you will not find anywhere else.
              </p>
            </div>

            {/* Sign in — top of page */}
            <div className="flex flex-col items-center mb-10">
              <div className="w-full max-w-xs md:max-w-sm">
                <AuthForm />
              </div>
            </div>

            {/* Today's Devotion — preview card */}
            {devotion && (
              <div className="mb-8 rounded-3xl overflow-hidden shadow-2xl" style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.6)" }}>
                <div className="relative" style={{
                  backgroundImage: "url('https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/hoai-thu-pt-nv4FFbP8IuE-unsplash.jpg')",
                  backgroundSize: "cover", backgroundPosition: "center",
                }}>
                  <div className="absolute inset-0 bg-black/52" />
                  <div className="relative z-10 px-5 pt-5 pb-6">

                    <div className="flex items-center justify-center mb-4">
                      <p className="text-white font-bold text-lg tracking-wide" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>Daily Devotions</p>
                    </div>

                    <p className="text-white/55 text-base uppercase tracking-widest text-center mb-1">{todayLabel}</p>
                    <h2 className="text-2xl font-bold text-white text-center mb-4 leading-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 4px 16px rgba(0,0,0,0.9)" }}>
                      {devotion.title}
                    </h2>

                    <p className="text-white text-lg leading-relaxed italic text-center mb-1" style={{ fontFamily: "'Lora', Georgia, serif", textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>
                      &ldquo;{devotion.verse_text}&rdquo;
                    </p>
                    <p className="text-white/70 text-base text-center mb-4" style={{ fontFamily: "'Lora', Georgia, serif" }}>— {devotion.verse_reference}</p>

                    <p className="text-white text-base leading-relaxed mb-5" style={{ fontFamily: "'Lora', Georgia, serif", textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
                      {devotion.reflection}
                    </p>

                    <div className="flex flex-col items-center gap-2">
                      <ShareButton
                        title={`${devotion.title} — Guiding Grace`}
                        text={`"${devotion.verse_text}" — ${devotion.verse_reference}\n\n${devotion.reflection}`}
                        url="https://guidinggrace.app"
                        label="🤍 Share This Devotion"
                        className="bg-pink-500/70 backdrop-blur-sm hover:bg-pink-500/90 text-white text-sm font-semibold px-5 py-2 rounded-full transition"
                      />
                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* Grace Challenge */}
            {challenge && (
              <div className="bg-white/10 backdrop-blur-sm border border-yellow-300/30 rounded-2xl overflow-hidden mb-8">
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                    <p className="text-yellow-300 text-base uppercase tracking-widest font-semibold">Today's Grace Challenge</p>
                    <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                  </div>
                  <p className="text-white text-lg leading-relaxed mb-4">{challenge.challenge_text}</p>
                  <p className="text-white/50 text-sm italic mb-5">You can do this challenge right now — no sign-in needed. Join to share your response with the community and see who is honored as Most Loved 💛</p>

                  {/* Locked response area */}
                  <div className="relative">
                    <textarea
                      disabled
                      placeholder="How did you show grace today? Share with the community..."
                      rows={3}
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white/30 placeholder-white/25 text-sm resize-none cursor-not-allowed"
                    />
                    <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/30 backdrop-blur-[1px]">
                      <div className="text-center px-4">
                        <p className="text-2xl mb-1">🔒</p>
                        <p className="text-white/80 text-sm font-semibold">Sign in to respond</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA strip */}
                <div className="border-t border-yellow-300/20 px-5 py-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
                  <p className="text-white/50 text-xs text-center sm:text-left">Free 3-day trial · No card required</p>
                  <div className="flex gap-2">
                    <Link href="/" className="px-4 py-2 bg-white/15 hover:bg-white/25 border border-white/25 text-white text-sm font-semibold rounded-xl transition">Sign In</Link>
                    <Link href="/subscribe" className="px-4 py-2 bg-yellow-400/80 hover:bg-yellow-400 text-black text-sm font-bold rounded-xl transition">✨ Free Trial</Link>
                  </div>
                </div>
              </div>
            )}

            {/* Install Banner */}
            <InstallBanner />

            {/* Screenshot Gallery */}
            <div className="mb-4">
              <p className="text-white/40 text-base uppercase tracking-widest text-center mb-3">Explore the App</p>
              <ScreenshotGallery />
            </div>

          </div>
        </div>

        <footer className="w-full text-center py-6 px-6">
          <p className="text-white/30 text-sm">
            © {new Date().getFullYear()} Guiding Grace ·
            <Link href="/privacy" className="hover:text-white/50 ml-1">Privacy</Link> ·
            <Link href="/terms" className="hover:text-white/50 ml-1">Terms</Link>
          </p>
        </footer>

      </div>
    </div>
  );
}
