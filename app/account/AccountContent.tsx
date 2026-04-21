"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { signOut } from "@/lib/auth";
import Link from "next/link";
import PageBackground from "@/components/PageBackground";

type Tab = "profile" | "notifications";

interface Prefs {
  email_daily_devotion: boolean;
  email_challenge_drop: boolean;
  email_results_reveal: boolean;
  email_winner: boolean;
}

const DEFAULT_PREFS: Prefs = {
  email_daily_devotion: false,
  email_challenge_drop: false,
  email_results_reveal: false,
  email_winner: false,
};

export default function AccountContent() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [sub, setSub] = useState<any>(null);
  const [tab, setTab] = useState<Tab>("profile");
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [prefsSaved, setPrefsSaved] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [savingName, setSavingName] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/"); return; }
      setUser(user);
      setDisplayName(user.user_metadata?.full_name || "");

      const { data: subData } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .single();
      setSub(subData);

      const { data: prefsData } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (prefsData) {
        setPrefs({
          email_daily_devotion: prefsData.email_daily_devotion ?? false,
          email_challenge_drop: prefsData.email_challenge_drop ?? false,
          email_results_reveal: prefsData.email_results_reveal ?? false,
          email_winner: prefsData.email_winner ?? false,
        });
      }
    }
    load();
  }, [router]);

  async function savePrefs() {
    if (!user) return;
    setSavingPrefs(true);
    await supabase.from("user_preferences").upsert({
      user_id: user.id,
      email: user.email,
      ...prefs,
    }, { onConflict: "user_id" });
    setSavingPrefs(false);
    setPrefsSaved(true);
    setTimeout(() => setPrefsSaved(false), 3000);
  }

  async function saveName() {
    if (!displayName.trim()) return;
    setSavingName(true);
    await supabase.auth.updateUser({ data: { full_name: displayName } });
    setSavingName(false);
  }

  function toggle(key: keyof Prefs) {
    setPrefs(p => ({ ...p, [key]: !p[key] }));
    setPrefsSaved(false);
  }

  const subLabel = sub?.status === "trialing"
    ? `Free trial · ends ${new Date(sub.trial_end_date).toLocaleDateString()}`
    : sub?.status === "active"
    ? `Active · renews ${new Date(sub.current_period_end).toLocaleDateString()}`
    : sub?.status
    ? sub.status
    : "No subscription";

  return (
    <PageBackground url="https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/gersweb-god-2012104.jpg">
      <main className="flex-1 p-6 pb-16">
        <div className="max-w-md mx-auto">

          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <Link href="/dashboard" className="text-white/70 text-sm">← Dashboard</Link>
            <h1 className="text-lg font-bold text-white" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>Profile & Settings</h1>
            <button
              onClick={() => signOut().then(() => router.push("/"))}
              className="text-sm text-white/50 hover:text-white/80 transition"
            >
              Sign out
            </button>
          </div>

          {/* Avatar + name summary */}
          {user && (
            <div className="flex flex-col items-center mb-8">
              <div className="w-20 h-20 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-3xl mb-3">
                {(user.user_metadata?.full_name || user.email || "?")[0].toUpperCase()}
              </div>
              <p className="text-white font-semibold text-lg" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}>
                {user.user_metadata?.full_name || "Friend"}
              </p>
              <p className="text-white/50 text-sm">{user.email}</p>
              {sub && <p className="text-white/40 text-xs mt-1">{subLabel}</p>}
            </div>
          )}

          {/* Tabs */}
          <div className="flex bg-white/10 rounded-xl p-1 mb-6 border border-white/20">
            <button
              onClick={() => setTab("profile")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${tab === "profile" ? "bg-white/20 text-white" : "text-white/50 hover:text-white/80"}`}
            >
              Profile
            </button>
            <button
              onClick={() => setTab("notifications")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${tab === "notifications" ? "bg-white/20 text-white" : "text-white/50 hover:text-white/80"}`}
            >
              Notifications
            </button>
          </div>

          {/* Profile tab */}
          {tab === "profile" && user && (
            <div className="space-y-4">
              <div className="bg-white/10 border border-white/20 rounded-2xl p-5 backdrop-blur-sm">
                <p className="text-white/50 text-xs uppercase tracking-widest mb-3">Display Name</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    className="flex-1 bg-transparent border border-white/30 rounded-xl px-4 py-2 text-white text-sm placeholder-white/40 focus:outline-none focus:border-white/60"
                    placeholder="Your name"
                  />
                  <button
                    onClick={saveName}
                    disabled={savingName || !displayName.trim()}
                    className="bg-white/20 hover:bg-white/30 border border-white/30 text-white text-sm px-4 py-2 rounded-xl transition disabled:opacity-40"
                  >
                    {savingName ? "..." : "Save"}
                  </button>
                </div>
              </div>

              <div className="bg-white/10 border border-white/20 rounded-2xl p-5 backdrop-blur-sm">
                <p className="text-white/50 text-xs uppercase tracking-widest mb-2">Email</p>
                <p className="text-white text-sm">{user.email}</p>
              </div>

              <div className="bg-white/10 border border-white/20 rounded-2xl p-5 backdrop-blur-sm">
                <p className="text-white/50 text-xs uppercase tracking-widest mb-2">Subscription</p>
                <p className="text-white text-sm capitalize">{subLabel}</p>
                {sub?.status !== "active" && sub?.status !== "trialing" && (
                  <Link href="/subscribe">
                    <button className="mt-3 bg-white/20 hover:bg-white/30 border border-white/30 text-white text-sm px-5 py-2 rounded-xl transition">
                      Subscribe
                    </button>
                  </Link>
                )}
              </div>

              <div className="bg-white/10 border border-white/20 rounded-2xl p-5 backdrop-blur-sm">
                <p className="text-white/50 text-xs uppercase tracking-widest mb-3">Account</p>
                <button
                  onClick={() => signOut().then(() => router.push("/"))}
                  className="w-full border border-white/20 text-white/60 hover:text-white hover:border-white/40 font-medium py-3 rounded-xl text-sm transition"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}

          {/* Notifications tab */}
          {tab === "notifications" && (
            <div className="space-y-4">
              <p className="text-white/50 text-sm text-center mb-2">Choose which emails you'd like to receive.</p>

              {([
                {
                  key: "email_daily_devotion" as keyof Prefs,
                  icon: "📖",
                  title: "Daily Devotion",
                  desc: "Morning email with today's scripture and reflection",
                },
                {
                  key: "email_challenge_drop" as keyof Prefs,
                  icon: "☀️",
                  title: "Challenge Drop",
                  desc: "Get notified when today's Grace Challenge is posted",
                },
                {
                  key: "email_results_reveal" as keyof Prefs,
                  icon: "💛",
                  title: "Results Reveal",
                  desc: "7am EST reminder that votes are now revealed",
                },
                {
                  key: "email_winner" as keyof Prefs,
                  icon: "🏆",
                  title: "Most Loved Winner",
                  desc: "Find out who the community honored today",
                },
              ] as const).map(item => (
                <div
                  key={item.key}
                  onClick={() => toggle(item.key)}
                  className="flex items-center gap-4 bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-sm cursor-pointer hover:bg-white/15 transition"
                >
                  <span className="text-2xl flex-shrink-0">{item.icon}</span>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{item.title}</p>
                    <p className="text-white/50 text-xs">{item.desc}</p>
                  </div>
                  <div className={`w-12 h-6 rounded-full transition-colors flex-shrink-0 ${prefs[item.key] ? "bg-green-400/70" : "bg-white/20"}`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow mt-0.5 transition-transform ${prefs[item.key] ? "translate-x-6" : "translate-x-0.5"}`} />
                  </div>
                </div>
              ))}

              <button
                onClick={savePrefs}
                disabled={savingPrefs}
                className="w-full bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold py-3 rounded-xl transition disabled:opacity-40 mt-2"
              >
                {savingPrefs ? "Saving..." : prefsSaved ? "✓ Saved!" : "Save Preferences"}
              </button>

              <p className="text-white/30 text-xs text-center">
                Emails are sent to {user?.email}. You can unsubscribe anytime.
              </p>
            </div>
          )}

        </div>
      </main>
    </PageBackground>
  );
}
