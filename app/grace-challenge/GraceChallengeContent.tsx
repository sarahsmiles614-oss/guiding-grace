"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import { supabase } from "@/lib/supabase";
import PageBackground from "@/components/PageBackground";

export default function GraceChallengeContent() {
  const [challenge, setChallenge] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [userPost, setUserPost] = useState<any>(null);
  const [response, setResponse] = useState("");
  const [completed, setCompleted] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [givenHearts, setGivenHearts] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [heartBudget, setHeartBudget] = useState(5);
  const [totalHearts, setTotalHearts] = useState<Record<string, number>>({});

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) { setUserId(user.id); setUserName(user.user_metadata?.full_name || "Friend"); }
    });
    loadChallenge();
  }, []);

  async function loadChallenge() {
    const now = new Date();
    setRevealed(now.getHours() >= 6 && now.getMinutes() >= 55);
    const today = now.toISOString().split("T")[0];
    const { data: c } = await supabase.from("grace_challenges").select("*").eq("challenge_date", today).single();
    if (c) { setChallenge(c); await loadPosts(c.id); }
  }

  async function loadPosts(challengeId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: p } = await supabase.from("grace_challenge_posts").select("*").eq("challenge_id", challengeId).order("created_at", { ascending: false });
    if (p) {
      setPosts(p);
      if (user) {
        const mine = p.find((x: any) => x.user_id === user.id);
        if (mine) setUserPost(mine);
        const { data: hearts } = await supabase.from("grace_challenge_hearts").select("post_id").eq("giver_user_id", user.id).eq("challenge_id", challengeId);
        if (hearts) setGivenHearts(hearts.map((h: any) => h.post_id));
        const { data: favs } = await supabase.from("grace_challenge_favorites").select("post_id").eq("user_id", user.id).eq("challenge_id", challengeId);
        if (favs) setFavorites(favs.map((f: any) => f.post_id));
        const otherPosts = p.filter((x: any) => x.user_id !== user.id);
        setHeartBudget(Math.min(5, otherPosts.length));
        if (revealed) {
          const counts: Record<string, number> = {};
          for (const post of p) {
            const { count } = await supabase.from("grace_challenge_hearts").select("*", { count: "exact", head: true }).eq("post_id", post.id);
            counts[post.id] = count || 0;
          }
          setTotalHearts(counts);
        }
      }
    }
  }

  async function handleSubmit() {
    if (!response.trim() || completed === null || !userId || !challenge) return;
    setSubmitting(true);
    await supabase.from("grace_challenge_posts").insert({ challenge_id: challenge.id, user_id: userId, user_name: userName, post_text: response, completed });
    await loadPosts(challenge.id);
    setSubmitting(false);
  }

  async function toggleHeart(postId: string, postUserId: string) {
    if (!userId || postUserId === userId || !challenge) return;
    if (givenHearts.includes(postId)) {
      await supabase.from("grace_challenge_hearts").delete().eq("giver_user_id", userId).eq("post_id", postId);
      setGivenHearts(h => h.filter(x => x !== postId));
    } else {
      if (givenHearts.length >= heartBudget) return;
      await supabase.from("grace_challenge_hearts").insert({ giver_user_id: userId, post_id: postId, challenge_id: challenge.id });
      setGivenHearts(h => [...h, postId]);
    }
  }

  async function toggleFavorite(postId: string) {
    if (!userId || !challenge) return;
    if (favorites.includes(postId)) {
      await supabase.from("grace_challenge_favorites").delete().eq("user_id", userId).eq("post_id", postId);
      setFavorites(f => f.filter(x => x !== postId));
    } else {
      await supabase.from("grace_challenge_favorites").insert({ user_id: userId, post_id: postId, challenge_id: challenge.id });
      setFavorites(f => [...f, postId]);
    }
  }

  const heartsRemaining = heartBudget - givenHearts.length;
  const allHeartsUsed = givenHearts.length === heartBudget && heartBudget > 0;
  const sortedPosts = revealed ? [...posts].sort((a, b) => (totalHearts[b.id] || 0) - (totalHearts[a.id] || 0)) : posts;
  const mostLoved = revealed && sortedPosts.length > 0 ? sortedPosts[0] : null;

  return (
    <SubscriptionGuard>
      <PageBackground url="https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/renegossner-alps-8728621_1920.jpg">
        <main className="flex-1 p-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <Link href="/dashboard" className="text-white/70 text-sm">← Dashboard</Link>
              <h1 className="text-lg font-bold text-white" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>Daily Grace Challenge</h1>
              <Link href="/grace-challenge/leaderboard" className="text-yellow-300 text-sm font-medium">🏆 Board</Link>
            </div>

            {!challenge ? (
              <p className="text-white/60 text-center py-12">No challenge posted yet today. Check back soon. 🌅</p>
            ) : (
              <>
                <p className="text-white/50 text-xs uppercase tracking-widest mb-2">Today's Challenge</p>
                <p className="text-2xl font-bold text-white mb-8 leading-relaxed" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}>{challenge.challenge_text}</p>

                {mostLoved && (
                  <div className="mb-8">
                    <p className="text-yellow-300 text-xs uppercase tracking-widest mb-1">Most Loved Today</p>
                    <p className="text-white font-semibold" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}>{mostLoved.user_name}</p>
                    <p className="text-white/70 text-sm italic mt-1">"{mostLoved.post_text?.slice(0, 100)}{mostLoved.post_text?.length > 100 ? "..." : ""}"</p>
                    <p className="text-white/50 text-xs mt-1">Your heart has been recognized today as being full of grace. 💛</p>
                  </div>
                )}

                {!userPost ? (
                  <div className="bg-white/10 backdrop-blur rounded-2xl p-5 mb-8 border border-white/20">
                    <p className="text-white/80 text-sm font-medium mb-3">Did you take on today's challenge?</p>
                    <div className="flex gap-3 mb-4">
                      <button onClick={() => setCompleted(true)} className={`flex-1 py-2 rounded-xl text-sm font-medium border transition ${completed === true ? "bg-white/30 text-white border-white/50" : "border-white/20 text-white/60"}`}>✅ I did it</button>
                      <button onClick={() => setCompleted(false)} className={`flex-1 py-2 rounded-xl text-sm font-medium border transition ${completed === false ? "bg-white/30 text-white border-white/50" : "border-white/20 text-white/60"}`}>🌱 Not yet</button>
                    </div>
                    <textarea value={response} onChange={e => setResponse(e.target.value)} placeholder="Share how it went, or why it was hard..." className="w-full bg-transparent border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/40 text-sm resize-none focus:outline-none focus:border-white/60 mb-3" rows={4} />
                    <button onClick={handleSubmit} disabled={!response.trim() || completed === null || submitting} className="w-full bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold py-3 rounded-xl transition disabled:opacity-40">
                      {submitting ? "Sharing..." : "Share My Response 💛"}
                    </button>
                  </div>
                ) : (
                  <p className="text-white/60 text-sm text-center mb-8">You shared your response today 💛</p>
                )}

                {userPost && !revealed && heartBudget > 0 && (
                  <div className="mb-8">
                    <p className="text-white/60 text-sm mb-2">
                      {allHeartsUsed ? "💛 All hearts given — your tally counts!" : `💛 ${heartsRemaining} heart${heartsRemaining !== 1 ? "s" : ""} remaining — give all ${heartBudget} or your received hearts won't count`}
                    </p>
                    <div className="flex gap-1">
                      {Array.from({ length: heartBudget }).map((_, i) => (
                        <span key={i} className="text-xl">{i < givenHearts.length ? "💛" : "🤍"}</span>
                      ))}
                    </div>
                  </div>
                )}

                {userPost && favorites.length > 0 && (
                  <div className="mb-6">
                    <Link href="/grace-challenge/favorites" className="text-yellow-300 text-sm underline">View your {favorites.length} saved favorite{favorites.length !== 1 ? "s" : ""} →</Link>
                  </div>
                )}

                <p className="text-white/40 text-xs uppercase tracking-widest mb-4">
                  {revealed ? "Results — Hearts Revealed" : "Community Responses — Hearts anonymous until 6:55am"}
                </p>
                <div className="space-y-6">
                  {sortedPosts.map(post => (
                    <div key={post.id} className={`${mostLoved?.id === post.id && revealed ? "border-l-2 border-yellow-400 pl-4" : ""}`}>
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-white/40 text-xs">{post.user_name} · {post.completed ? "✅ Completed" : "🌱 Still growing"}</p>
                        <div className="flex items-center gap-2">
                          {post.user_id !== userId && (
                            <button onClick={() => toggleFavorite(post.id)} className="text-base hover:scale-110 transition">
                              {favorites.includes(post.id) ? "🔖" : "📄"}
                            </button>
                          )}
                          {post.user_id !== userId && !revealed && (
                            <button onClick={() => toggleHeart(post.id, post.user_id)} disabled={!userPost || (!givenHearts.includes(post.id) && heartsRemaining === 0)} className={`text-xl transition ${!userPost || (!givenHearts.includes(post.id) && heartsRemaining === 0) ? "opacity-30 cursor-default" : "hover:scale-110"}`}>
                              {givenHearts.includes(post.id) ? "💛" : "🤍"}
                            </button>
                          )}
                          {revealed && (
                            <div className="flex items-center gap-1">
                              <span className="text-lg">💛</span>
                              <span className="text-sm font-semibold text-white/70">{totalHearts[post.id] || 0}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-white/80 text-sm leading-relaxed" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>{post.post_text}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </main>
      </PageBackground>
    </SubscriptionGuard>
  );
}
