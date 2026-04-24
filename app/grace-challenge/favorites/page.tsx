"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import { supabase } from "@/lib/supabase";
import PageBackground from "@/components/PageBackground";

const HEARTS_PER_DAY = 3;

function isAfterDeadline() {
  const now = new Date();
  const nyHour = parseInt(new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York", hour: "numeric", hour12: false,
  }).format(now));
  return nyHour >= 7;
}

function getToday() {
  const d = new Date();
  const ny = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(d);
  const [m, day, y] = ny.split("/");
  return `${y}-${m}-${day}`;
}

export default function FavoritesPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [givenHearts, setGivenHearts] = useState<string[]>([]);
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [revealed] = useState(isAfterDeadline());
  const [allTimeHearts, setAllTimeHearts] = useState<Record<string, number>>({});

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) { setUserId(user.id); loadFavorites(user.id); }
    });
  }, []);

  async function loadFavorites(uid: string) {
    const today = getToday();
    const { data: c } = await supabase.from("grace_challenges").select("id").eq("challenge_date", today).single();
    if (!c) return;
    setChallengeId(c.id);
    const { data: favs } = await supabase.from("grace_challenge_favorites").select("post_id").eq("user_id", uid).eq("challenge_id", c.id);
    if (!favs || favs.length === 0) return;
    const { data: p } = await supabase.from("grace_challenge_posts").select("*").in("id", favs.map((f: any) => f.post_id));
    if (p) {
      setPosts(p);
      const userIds = [...new Set(p.map((x: any) => x.user_id))];
      const { data: totals } = await supabase.from("user_heart_totals").select("user_id, lifetime_hearts").in("user_id", userIds);
      if (totals) {
        const map: Record<string, number> = {};
        totals.forEach((t: any) => { map[t.user_id] = t.lifetime_hearts; });
        setAllTimeHearts(map);
      }
    }
    const { data: hearts } = await supabase.from("grace_challenge_hearts").select("post_id").eq("giver_user_id", uid).eq("challenge_id", c.id);
    if (hearts) setGivenHearts(hearts.map((h: any) => h.post_id));
  }

  async function toggleHeart(postId: string) {
    if (!userId || !challengeId || revealed) return;
    if (givenHearts.includes(postId)) {
      await supabase.from("grace_challenge_hearts").delete().eq("giver_user_id", userId).eq("post_id", postId);
      setGivenHearts(h => h.filter(x => x !== postId));
    } else {
      if (givenHearts.length >= HEARTS_PER_DAY) return;
      await supabase.from("grace_challenge_hearts").insert({ giver_user_id: userId, post_id: postId, challenge_id: challengeId });
      setGivenHearts(h => [...h, postId]);
    }
  }

  async function removeFavorite(postId: string) {
    if (!userId) return;
    await supabase.from("grace_challenge_favorites").delete().eq("user_id", userId).eq("post_id", postId);
    setPosts(p => p.filter(x => x.id !== postId));
  }

  const heartsLeft = HEARTS_PER_DAY - givenHearts.length;
  const usedAll = givenHearts.length >= HEARTS_PER_DAY;
  const displayName = (post: any) => {
    const total = allTimeHearts[post.user_id];
    return total ? `${post.user_name} (${total})` : post.user_name;
  };

  return (
    <SubscriptionGuard>
      <PageBackground url="https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/nickype-ai-generated-9013427_1920.jpg">
        <main className="flex-1 p-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <Link href="/grace-challenge" className="text-white/70 text-sm">← Challenge</Link>
              <h1 className="text-lg font-bold text-white" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>My Favorites 🔖</h1>
              <div className="w-16" />
            </div>
            {!revealed && (
              <div className="mb-6">
                <div className="flex gap-2 mb-2">
                  {Array.from({ length: HEARTS_PER_DAY }).map((_, i) => (
                    <span key={i} className="text-2xl">{i < givenHearts.length ? "💛" : "🤍"}</span>
                  ))}
                </div>
                {usedAll
                  ? <p className="text-green-300 text-xs">✓ All 3 hearts given — your received votes will count!</p>
                  : <p className="text-white/50 text-xs">{heartsLeft} heart{heartsLeft !== 1 ? "s" : ""} left · You can change votes until 7am EST</p>
                }
              </div>
            )}
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-4xl mb-3">🔖</p>
                <p className="text-white/60">No favorites saved yet.</p>
                <Link href="/grace-challenge" className="text-yellow-300 text-sm underline mt-2 block">Browse today's responses →</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map(post => (
                  <div key={post.id} className="py-4 border-b border-white/10">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-white/50 text-xs">{displayName(post)} · {post.completed ? "✅ Did it" : "🌱 Chose not to"}</p>
                      <div className="flex items-center gap-2">
                        {!revealed && (
                          <button onClick={() => toggleHeart(post.id)} disabled={!givenHearts.includes(post.id) && heartsLeft === 0}
                            className={`text-xl transition ${!givenHearts.includes(post.id) && heartsLeft === 0 ? "opacity-30 cursor-default" : "hover:scale-110"}`}>
                            {givenHearts.includes(post.id) ? "💛" : "🤍"}
                          </button>
                        )}
                        <button onClick={() => removeFavorite(post.id)} className="text-lg hover:scale-110 transition" title="Remove">🔖</button>
                      </div>
                    </div>
                    <p className="text-white/80 text-sm leading-relaxed" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>{post.post_text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </PageBackground>
    </SubscriptionGuard>
  );
}
