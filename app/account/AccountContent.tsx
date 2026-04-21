"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { signOut } from "@/lib/auth";
import Link from "next/link";
import PageBackground from "@/components/PageBackground";

type Tab = "profile" | "notifications";

interface Prefs {
  daily_reminder: boolean;
  daily_reminder_time: string;
  challenge_reminder: boolean;
  challenge_reminder_time: string;
  community_updates: boolean;
}

const DEFAULT_PREFS: Prefs = {
  daily_reminder: false,
  daily_reminder_time: "08:00",
  challenge_reminder: false,
  challenge_reminder_time: "09:00",
  community_updates: false,
};

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={e => { e.stopPropagation(); onToggle(); }}
      className={`w-12 h-6 rounded-full transition-colors flex-shrink-0 ${on ? "bg-green-400/80" : "bg-white/20"}`}
    >
      <div className={`w-5 h-5 bg-white rounded-full shadow mt-0.5 transition-transform ${on ? "translate-x-6" : "translate-x-0.5"}`} />
    </button>
  );
}

function TimeSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const times = [];
  for (let h = 0; h < 24; h++) {
    for (const m of ["00", "30"]) {
      const hh = h.toString().padStart(2, "0");
      const val = `${hh}:${m}`;
      const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
      const ampm = h < 12 ? "AM" : "PM";
      const label = `${hour12}:${m} ${ampm}`;
      times.push({ val, label });
    }
  }
  return (
    <select
      value={value}
      onChange={e => { e.stopPropagation(); onChange(e.target.value); }}
      onClick={e => e.stopPropagation()}
      className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-white/40 [color-scheme:dark]"
    >
      {times.map(t => (
        <option key={t.val} value={t.val}>{t.label}</option>
      ))}
    </select>
  );
}

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

      const { data: p } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (p) {
        setPrefs({
          daily_reminder: p.daily_reminder ?? false,
          daily_reminder_time: p.daily_reminder_time ?? "08:00",
          challenge_reminder: p.challenge_reminder ?? false,
          challenge_reminder_time: p.challenge_reminder_time ?? "09:00",
          community_updates: p.community_updates ?? false,
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

  function set<K extends keyof Prefs>(key: K, val: Prefs[K]) {
    setPrefs(p => ({ ...p, [key]: val }));
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
              <p className="text-white/50 text-sm text-center mb-2">
                Choose what you'd like to be reminded about and when.
              </p>

              {/* Daily Reminder */}
              <div className="bg-white/10 border border-white/20 rounded-2xl p-5 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-2xl">📖</span>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">Daily Reminder</p>
                    <p className="text-white/50 text-xs">Morning devotion & scripture delivered to your email</p>
                  </div>
                  <Toggle on={prefs.daily_reminder} onToggle={() => set("daily_reminder", !prefs.daily_reminder)} />
                </div>
                {prefs.daily_reminder && (
                  <div className="mt-4 flex items-center gap-3 pl-1">
                    <p className="text-white/50 text-xs flex-1">Send at</p>
                    <TimeSelect
                      value={prefs.daily_reminder_time}
                      onChange={v => set("daily_reminder_time", v)}
                    />
                  </div>
                )}
              </div>

              {/* Daily Challenge Reminder */}
              <div className="bg-white/10 border border-white/20 rounded-2xl p-5 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-2xl">☀️</span>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">Daily Challenge Reminder</p>
                    <p className="text-white/50 text-xs">Get nudged to participate in today's Grace Challenge</p>
                  </div>
                  <Toggle on={prefs.challenge_reminder} onToggle={() => set("challenge_reminder", !prefs.challenge_reminder)} />
                </div>
                {prefs.challenge_reminder && (
                  <div className="mt-4 flex items-center gap-3 pl-1">
                    <p className="text-white/50 text-xs flex-1">Send at</p>
                    <TimeSelect
                      value={prefs.challenge_reminder_time}
                      onChange={v => set("challenge_reminder_time", v)}
                    />
                  </div>
                )}
              </div>

              {/* Community Updates */}
              <div className="bg-white/10 border border-white/20 rounded-2xl p-5 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💛</span>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">Community Updates</p>
                    <p className="text-white/50 text-xs">Results reveals, Most Loved winner, and community highlights</p>
                  </div>
                  <Toggle on={prefs.community_updates} onToggle={() => set("community_updates", !prefs.community_updates)} />
                </div>
              </div>

              <button
                onClick={savePrefs}
                disabled={savingPrefs}
                className="w-full bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold py-3 rounded-xl transition disabled:opacity-40"
              >
                {savingPrefs ? "Saving..." : prefsSaved ? "✓ Saved!" : "Save Preferences"}
              </button>

              <p className="text-white/30 text-xs text-center">
                Emails sent to {user?.email}. Times are in your local timezone.
              </p>
            </div>
          )}

        </div>
      </main>
    </PageBackground>
  );
}
