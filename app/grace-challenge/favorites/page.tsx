"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import { supabase } from "@/lib/supabase";
import PageBackground from "@/components/PageBackground";

export default function FavoritesPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [givenHearts, setGivenHearts] = useState<string[]>([]);
  const [heartBudget, setHeartBudget] = useState(5);
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) { setUserId(user.id); loadFavorites(user.id); }
    });
    const now = new Date();
    setRevealed(now.getHours() >= 6 && now.getMinutes() >= 55);
  }, []);

  async function loadFavorites(uid: string) {
    const today = new Date().toISOString().split("T")[0];
    const { data: c } = await supabase.from("grace_challenges").select("id").eq("challenge_date", today).single();
    if (!c) return;
    setChallengeId(c.id);
    const { data: favs } = await supabase.from("grace_challenge_favorites").select("post_id").eq("user_id", uid).eq("challenge_id", c.id);
    if (!favs || favs.length === 0) return;
    const { data: p } = await supabase.from("grace_challenge_posts").select("*").in("id", favs.map((f: any) => f.post_id));
    if (p) setPosts(p);
    const { data: hearts } = await supabase.from("grace_challenge_hearts").select("post_id").eq("giver_user_id", uid).eq("challenge_id", c.id);
    if (hearts) setGivenHearts(hearts.map((h: any) => h.post_id));
    const { data: allPosts } = await supabase.from("grace_challenge_posts").select("id").eq("challenge_id", c.id).neq("user_id", uid);
    setHeartBudget(Math.min(5, allPosts?.length || 0));
  }

  async function toggleHeart(postId: string) {
    if (!userId || !challengeId) return;
    if (givenHearts.includes(postId)) {
      await supabase.from("grace_challenge_hearts").delete().eq("giver_user_id", userId).eq("post_id", postId);
      setGivenHearts(h => h.filter(x => x !== postId));
    } else {
      if (givenHearts.length >= heartBudget) return;
      await supabase.from("grace_challenge_hearts").insert({ giver_user_id: userId, post_id: postId, challenge_id: challengeId });
      setGivenHearts(h => [...h, postId]);
    }
  }

  async function removeFavorite(postId: string) {
    if (!userId) return;
    await supabase.from("grace_challenge_favorites").delete().eq("user_id", userId).eq("post_id", postId);
    setPosts(p => p.filter(x => x.id !== postId));
  }

  const heartsRemaining = heartBudget - givenHearts.length;

  return (
    <SubscriptionGuard>
      <PageBackground url="https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/nickype-ai-generated-9013427_1920.jpg">
        <main className="flex-1 p-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <Link href="/grace-challenge" className="text-white/70 text-sm">← Challenge</Link>
              <h1 className="text-lg font-bold text-white" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>My Favorites</h1>
              <div className="w-16" />
            </div>

            {!revealed && heartBudget > 0 && (
              <div className="mb-8">
                <p className="text-white/60 text-sm mb-2">💛 {heartsRemaining} heart{heartsRemaining !== 1 ? "s" : ""} remaining · Hearts lock at 6:55am</p>
                <div className="flex gap-1">
                  {Array.from({ length: heartBudget }).map((_, i) => (
                    <span key={i} className="text-xl">{i < givenHearts.length ? "💛" : "🤍"}</span>
                  ))}
                </div>
              </div>
            )}

            {posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-4xl mb-3">🔖</p>
                <p className="text-white/60">No favorites saved yet.</p>
                <Link href="/grace-challenge" className="text-yellow-300 text-sm underline mt-2 block">Browse today's responses →</Link>
              </div>
            ) : (
              <div className="space-y-6">
                {posts.map(post => (
                  <div key={post.id}>
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-white/40 text-xs">{post.user_name} · {post.completed ? "✅ Completed" : "🌱 Still growing"}</p>
                      <div className="flex items-center gap-2">
                        {!revealed && (
                          <button onClick={() => toggleHeart(post.id)} disabled={!givenHearts.includes(post.id) && heartsRemaining === 0} className={`text-xl transition ${!givenHearts.includes(post.id) && heartsRemaining === 0 ? "opacity-30 cursor-default" : "hover:scale-110"}`}>
                            {givenHearts.includes(post.id) ? "💛" : "🤍"}
                          </button>
                        )}
                        <button onClick={() => removeFavorite(post.id)} className="text-lg hover:scale-110 transition">🔖</button>
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
