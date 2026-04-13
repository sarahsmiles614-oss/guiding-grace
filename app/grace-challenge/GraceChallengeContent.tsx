"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import { supabase } from "@/lib/supabase";

export default function GraceChallengeContent() {
  const [challenge, setChallenge] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [userPost, setUserPost] = useState<any>(null);
  const [response, setResponse] = useState("");
  const [status, setStatus] = useState<"completed" | "not_completed" | "">("");
  const [submitting, setSubmitting] = useState(false);
  const [userHearts, setUserHearts] = useState<string[]>([]);
  const [totalHearts, setTotalHearts] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
        setUserName(user.user_metadata?.full_name || "Friend");
      }
    });
    loadChallenge();
  }, []);

  async function loadChallenge() {
    const today = new Date().toISOString().split("T")[0];
    const { data: c } = await supabase
      .from("grace_challenges")
      .select("*")
      .eq("challenge_date", today)
      .single();
    if (c) {
      setChallenge(c);
      await loadPosts(c.id);
    }
  }

  async function loadPosts(challengeId: string) {
    const { data: p } = await supabase
      .from("grace_challenge_posts")
      .select("*")
      .eq("challenge_id", challengeId)
      .order("created_at", { ascending: false });
    if (p) {
      setPosts(p);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const mine = p.find((x: any) => x.user_id === user.id);
        if (mine) setUserPost(mine);
        const { data: hearts } = await supabase
          .from("grace_challenge_hearts")
          .select("post_id")
          .eq("user_id", user.id);
        if (hearts) setUserHearts(hearts.map((h: any) => h.post_id));
      }
      const counts: Record<string, number> = {};
      for (const post of p) {
        const { count } = await supabase
          .from("grace_challenge_hearts")
          .select("*", { count: "exact", head: true })
          .eq("post_id", post.id);
        counts[post.id] = count || 0;
      }
      setTotalHearts(counts);
      const now = new Date();
      const revealHour = 7;
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(revealHour, 0, 0, 0);
      setRevealed(now.getHours() >= revealHour && now.getDate() !== new Date(tomorrow.toISOString()).getDate());
    }
  }

  async function handleSubmit() {
    if (!response.trim() || !status || !userId || !challenge) return;
    setSubmitting(true);
    await supabase.from("grace_challenge_posts").insert({
      challenge_id: challenge.id,
      user_id: userId,
      display_name: userName,
      response,
      status,
    });
    await loadPosts(challenge.id);
    setSubmitting(false);
  }

  async function handleHeart(postId: string) {
    if (!userId || postId === userPost?.id) return;
    if (userHearts.includes(postId)) {
      await supabase.from("grace_challenge_hearts").delete().eq("user_id", userId).eq("post_id", postId);
      setUserHearts(h => h.filter(x => x !== postId));
      setTotalHearts(t => ({ ...t, [postId]: (t[postId] || 1) - 1 }));
    } else {
      await supabase.from("grace_challenge_hearts").insert({ user_id: userId, post_id: postId, challenge_id: challenge.id });
      setUserHearts(h => [...h, postId]);
      setTotalHearts(t => ({ ...t, [postId]: (t[postId] || 0) + 1 }));
    }
  }

  const sortedPosts = revealed
    ? [...posts].sort((a, b) => (totalHearts[b.id] || 0) - (totalHearts[a.id] || 0))
    : posts;

  const mostLoved = revealed && sortedPosts.length > 0 ? sortedPosts[0] : null;

  return (
    <SubscriptionGuard>
      <main className="min-h-screen bg-gradient-to-b from-yellow-50 to-white p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <Link href="/dashboard" className="text-purple-700 text-sm">← Dashboard</Link>
            <h1 className="text-lg font-bold text-purple-900">Daily Grace Challenge</h1>
            <div className="w-16" />
          </div>

          {!challenge ? (
            <div className="bg-white rounded-2xl p-8 text-center text-gray-400">No challenge posted for today yet. Check back soon. 🌅</div>
          ) : (
            <>
              <div className="bg-gradient-to-br from-yellow-400 to-orange-300 rounded-3xl p-8 mb-6 text-white shadow-lg">
                <p className="text-xs uppercase tracking-widest mb-2 opacity-80">Today's Challenge</p>
                <p className="text-xl font-bold leading-relaxed">{challenge.challenge_text}</p>
              </div>

              {mostLoved && (
                <div className="bg-purple-700 text-white rounded-2xl p-5 mb-6 text-center">
                  <p className="text-xs uppercase tracking-widest mb-1 opacity-70">Most Loved Today</p>
                  <p className="font-semibold">{mostLoved.display_name}</p>
                  <p className="text-sm opacity-80 mt-1 italic">"{mostLoved.response.slice(0, 100)}{mostLoved.response.length > 100 ? "..." : ""}"</p>
                  <p className="text-xs mt-2 opacity-60">Your heart has been recognized today as being full of grace. 💛</p>
                </div>
              )}

              {!userPost ? (
                <div className="bg-white rounded-2xl shadow-sm border border-yellow-100 p-6 mb-6">
                  <p className="text-sm font-medium text-gray-700 mb-3">Did you take on today's challenge?</p>
                  <div className="flex gap-3 mb-4">
                    <button onClick={() => setStatus("completed")} className={`flex-1 py-2 rounded-xl text-sm font-medium border transition ${status === "completed" ? "bg-green-600 text-white border-green-600" : "border-gray-200 text-gray-600"}`}>✅ I did it</button>
                    <button onClick={() => setStatus("not_completed")} className={`flex-1 py-2 rounded-xl text-sm font-medium border transition ${status === "not_completed" ? "bg-orange-500 text-white border-orange-500" : "border-gray-200 text-gray-600"}`}>🌱 Not yet</button>
                  </div>
                  <textarea value={response} onChange={e => setResponse(e.target.value)} placeholder="Share how it went, or why it was hard..." className="w-full border border-yellow-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-yellow-300 mb-3" rows={4} />
                  <button onClick={handleSubmit} disabled={!response.trim() || !status || submitting} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-40">
                    {submitting ? "Sharing..." : "Share My Response 💛"}
                  </button>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6 text-center">
                  <p className="text-green-700 font-medium text-sm">You shared your response today 💛</p>
                </div>
              )}

              <div className="space-y-4">
                <p className="text-xs text-gray-400 uppercase tracking-widest">
                  {revealed ? "Community Responses — Hearts Revealed" : "Community Responses — Hearts hidden until tomorrow morning"}
                </p>
                {sortedPosts.map(post => (
                  <div key={post.id} className={`bg-white rounded-2xl shadow-sm border p-5 ${mostLoved?.id === post.id && revealed ? "border-yellow-300" : "border-purple-100"}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-xs text-purple-400">{post.display_name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${post.status === "completed" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                          {post.status === "completed" ? "✅ Completed" : "🌱 Still growing"}
                        </span>
                      </div>
                      <button
                        onClick={() => handleHeart(post.id)}
                        disabled={post.user_id === userId}
                        className={`flex items-center gap-1 text-sm transition ${post.user_id === userId ? "opacity-40 cursor-default" : "hover:scale-110"}`}
                      >
                        <span>{userHearts.includes(post.id) ? "💛" : "🤍"}</span>
                        {revealed && <span className="text-xs text-gray-400">{totalHearts[post.id] || 0}</span>}
                      </button>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{post.response}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </SubscriptionGuard>
  );
}
