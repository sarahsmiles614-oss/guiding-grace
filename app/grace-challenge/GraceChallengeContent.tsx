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
  const allHeartsUsed = givenHearts.length === heartBudget;
  const sortedPosts = revealed ? [...posts].sort((a, b) => (totalHearts[b.id] || 0) - (totalHearts[a.id] || 0)) : posts;
  const mostLoved = revealed && sortedPosts.length > 0 ? sortedPosts[0] : null;

  return (
    <SubscriptionGuard>
      <PageBackground url="https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/renegossner-alps-8728621_1920.jpg">
        <main className="flex-1 p-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <Link href="/dashboard" className="text-white/80 text-sm">← Dashboard</Link>
              <h1 className="text-lg font-bold text-white" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>Daily Grace Challenge</h1>
              <Link href="/grace-challenge/leaderboard" className="text-yellow-300 text-sm font-medium">🏆 Board</Link>
            </div>

            {!challenge ? (
              <div className="bg-white/20 backdrop-blur rounded-2xl p-8 text-center text-white">No challenge posted yet today. Check back soon. 🌅</div>
            ) : (
              <>
                <div className="bg-gradient-to-br from-yellow-400/90 to-orange-300/90 backdrop-blur rounded-3xl p-8 mb-6 text-white shadow-lg">
                  <p className="text-xs uppercase tracking-widest mb-2 opacity-80">Today's Challenge</p>
                  <p className="text-xl font-bold leading-relaxed">{challenge.challenge_text}</p>
                </div>

                {mostLoved && (
                  <div className="bg-purple-700/90 backdrop-blur text-white rounded-2xl p-5 mb-6 text-center">
                    <p className="text-xs uppercase tracking-widest mb-1 opacity-70">Most Loved Today</p>
                    <p className="font-semibold">{mostLoved.user_name}</p>
                    <p className="text-sm opacity-80 mt-1 italic">"{mostLoved.post_text?.slice(0, 100)}{mostLoved.post_text?.length > 100 ? "..." : ""}"</p>
                    <p className="text-xs mt-2 opacity-60">Your heart has been recognized today as being full of grace. 💛</p>
                  </div>
                )}

                {!userPost ? (
                  <div className="bg-white/90 backdrop-blur rounded-2xl p-6 mb-6">
                    <p className="text-sm font-medium text-gray-700 mb-3">Did you take on today's challenge?</p>
                    <div className="flex gap-3 mb-4">
                      <button onClick={() => setCompleted(true)} className={`flex-1 py-2 rounded-xl text-sm font-medium border transition ${completed === true ? "bg-green-600 text-white border-green-600" : "border-gray-200 text-gray-600"}`}>✅ I did it</button>
                      <button onClick={() => setCompleted(false)} className={`flex-1 py-2 rounded-xl text-sm font-medium border transition ${completed === false ? "bg-orange-500 text-white border-orange-500" : "border-gray-200 text-gray-600"}`}>🌱 Not yet</button>
                    </div>
                    <textarea value={response} onChange={e => setResponse(e.target.value)} placeholder="Share how it went, or why it was hard..." className="w-full border border-yellow-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-yellow-300 mb-3" rows={4} />
                    <button onClick={handleSubmit} disabled={!response.trim() || completed === null || submitting} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-40">
                      {submitting ? "Sharing..." : "Share My Response 💛"}
                    </button>
                  </div>
                ) : (
                  <div className="bg-green-50/90 backdrop-blur border border-green-200 rounded-2xl p-5 mb-6 text-center">
                    <p className="text-green-700 font-medium text-sm">You shared your response today 💛</p>
                  </div>
                )}

                {userPost && !revealed && heartBudget > 0 && (
                  <div className={`rounded-2xl p-4 mb-6 text-center backdrop-blur ${allHeartsUsed ? "bg-green-50/90 border border-green-200" : "bg-yellow-50/90 border border-yellow-200"}`}>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      {allHeartsUsed ? "💛 All hearts given — your tally counts!" : `💛 ${heartsRemaining} heart${heartsRemaining !== 1 ? "s" : ""} remaining`}
                    </p>
                    <p className="text-xs text-gray-400">{allHeartsUsed ? "You can still change your hearts until 6:55am" : `Give all ${heartBudget} hearts or your received hearts won't count`}</p>
                    <div className="flex justify-center gap-1 mt-2">
                      {Array.from({ length: heartBudget }).map((_, i) => (
                        <span key={i} className="text-xl">{i < givenHearts.length ? "💛" : "🤍"}</span>
                      ))}
                    </div>
                  </div>
                )}

                {userPost && favorites.length > 0 && (
                  <div className="text-center mb-4">
                    <Link href="/grace-challenge/favorites" className="text-yellow-200 text-sm underline">View your {favorites.length} saved favorite{favorites.length !== 1 ? "s" : ""} →</Link>
                  </div>
                )}

                <div className="space-y-4">
                  <p className="text-xs text-white/60 uppercase tracking-widest">
                    {revealed ? "Results — Hearts Revealed" : "Community Responses — Hearts anonymous until 6:55am"}
                  </p>
                  {sortedPosts.map(post => (
                    <div key={post.id} className={`bg-white/90 backdrop-blur rounded-2xl p-5 ${mostLoved?.id === post.id && revealed ? "border-2 border-yellow-400" : ""}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-xs text-purple-400">{post.user_name}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${post.completed ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                            {post.completed ? "✅ Completed" : "🌱 Still growing"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {post.user_id !== userId && (
                            <button onClick={() => toggleFavorite(post.id)} className="text-lg hover:scale-110 transition">
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
                              <span className="text-xl">💛</span>
                              <span className="text-sm font-semibold text-gray-600">{totalHearts[post.id] || 0}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{post.post_text}</p>
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
