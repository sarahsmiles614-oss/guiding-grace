"use client";
import { useState, useEffect, useCallback } from "react";
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

function todayEST() {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date()).split("/").reverse().join("-").replace(/(\d+)-(\d+)-(\d+)/, "$1-$3-$2")
    // reformat MM/DD/YYYY → YYYY-MM-DD
    .replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$1-$2");
}

function getToday() {
  const d = new Date();
  const ny = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(d);
  const [m, day, y] = ny.split("/");
  return `${y}-${m}-${day}`;
}

export default function GraceChallengeContent() {
  const [challenge, setChallenge] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [userPost, setUserPost] = useState<any>(null);
  const [response, setResponse] = useState("");
  const [completed, setCompleted] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [givenHearts, setGivenHearts] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [allTimeHearts, setAllTimeHearts] = useState<Record<string, number>>({});
  const [winner, setWinner] = useState<any>(null);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const [editCompleted, setEditCompleted] = useState<boolean | null>(null);
  const [editSubmitting, setEditSubmitting] = useState(false);

  const loadChallenge = useCallback(async () => {
    const today = getToday();
    const { data: c } = await supabase.from("grace_challenges").select("*").eq("challenge_date", today).single();
    if (c) {
      setChallenge(c);
      await loadPosts(c.id);
    }
    // Also load yesterday's winner to show as banner
    await loadYesterdayWinner();
    setLoading(false);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
        setUserName(user.user_metadata?.full_name || "Friend");
        if (user.email === "sarahsmiles614@gmail.com") setIsAdmin(true);
      }
    });
    loadChallenge();
  }, [loadChallenge]);

  async function loadPosts(challengeId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: p } = await supabase
      .from("grace_challenge_posts")
      .select("*")
      .eq("challenge_id", challengeId)
      .order("created_at", { ascending: false });

    if (!p) return;
    setPosts(p);

    // Load all-time hearts for displayed users
    const userIds = [...new Set(p.map((x: any) => x.user_id))];
    if (userIds.length > 0) {
      const { data: totals } = await supabase
        .from("user_heart_totals")
        .select("user_id, lifetime_hearts")
        .in("user_id", userIds);
      if (totals) {
        const map: Record<string, number> = {};
        totals.forEach((t: any) => { map[t.user_id] = t.lifetime_hearts; });
        setAllTimeHearts(map);
      }
    }

    if (user) {
      const mine = p.find((x: any) => x.user_id === user.id);
      if (mine) setUserPost(mine);

      const { data: hearts } = await supabase
        .from("grace_challenge_hearts")
        .select("post_id")
        .eq("giver_user_id", user.id)
        .eq("challenge_id", challengeId);
      if (hearts) setGivenHearts(hearts.map((h: any) => h.post_id));

      const { data: favs } = await supabase
        .from("grace_challenge_favorites")
        .select("post_id")
        .eq("user_id", user.id)
        .eq("challenge_id", challengeId);
      if (favs) setFavorites(favs.map((f: any) => f.post_id));
    }

  }

  async function loadYesterdayWinner() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const ny = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit",
    }).format(d);
    const [m, day, y] = ny.split("/");
    const yesterday = `${y}-${m}-${day}`;

    const { data: c } = await supabase.from("grace_challenges").select("id").eq("challenge_date", yesterday).single();
    if (!c) return;
    const { data: p } = await supabase.from("grace_challenge_posts").select("*").eq("challenge_id", c.id);
    if (!p || p.length === 0) return;
    await calculateWinner(c.id, p);
    setRevealed(true);
  }

  async function calculateWinner(challengeId: string, postList: any[]) {
    // Get all hearts for today
    const { data: allHearts } = await supabase
      .from("grace_challenge_hearts")
      .select("post_id, giver_user_id")
      .eq("challenge_id", challengeId);
    if (!allHearts) return;

    // Count hearts given per giver
    const heartsGivenByUser: Record<string, number> = {};
    allHearts.forEach((h: any) => {
      heartsGivenByUser[h.giver_user_id] = (heartsGivenByUser[h.giver_user_id] || 0) + 1;
    });

    // Number of posts each user could vote on (all posts except their own)
    // For forfeit: required = min(3, others' post count)
    const othersCountPerUser: Record<string, number> = {};
    postList.forEach((post: any) => {
      othersCountPerUser[post.user_id] = postList.filter((p: any) => p.user_id !== post.user_id).length;
    });

    // Count valid hearts per post (only from givers who used all required hearts)
    const validHeartsPerPost: Record<string, number> = {};
    allHearts.forEach((h: any) => {
      const required = Math.min(HEARTS_PER_DAY, othersCountPerUser[h.giver_user_id] ?? postList.length - 1);
      const given = heartsGivenByUser[h.giver_user_id] || 0;
      if (given >= required) {
        validHeartsPerPost[h.post_id] = (validHeartsPerPost[h.post_id] || 0) + 1;
      }
    });

    // Find winning post
    let topPost = null;
    let topCount = 0;
    postList.forEach((post: any) => {
      const count = validHeartsPerPost[post.id] || 0;
      if (count > topCount) { topCount = count; topPost = post; }
    });

    if (topPost && topCount > 0) setWinner(topPost);
  }

  async function handleSubmit() {
    if (!response.trim() || completed === null || !userId || !challenge) return;
    setSubmitting(true);
    await supabase.from("grace_challenge_posts").insert({
      challenge_id: challenge.id,
      user_id: userId,
      user_name: userName,
      post_text: response,
      completed,
    });
    await loadPosts(challenge.id);
    setSubmitting(false);
  }

  async function toggleHeart(postId: string, postUserId: string) {
    if (!userId || postUserId === userId || !challenge) return;
    if (givenHearts.includes(postId)) {
      // Remove heart (change vote)
      await supabase.from("grace_challenge_hearts")
        .delete()
        .eq("giver_user_id", userId)
        .eq("post_id", postId);
      setGivenHearts(h => h.filter(x => x !== postId));
    } else {
      if (givenHearts.length >= HEARTS_PER_DAY) return;
      await supabase.from("grace_challenge_hearts").insert({
        giver_user_id: userId, post_id: postId, challenge_id: challenge.id,
      });
      setGivenHearts(h => [...h, postId]);
    }
  }

  async function toggleFavorite(postId: string) {
    if (!userId || !challenge) return;
    if (favorites.includes(postId)) {
      await supabase.from("grace_challenge_favorites")
        .delete().eq("user_id", userId).eq("post_id", postId);
      setFavorites(f => f.filter(x => x !== postId));
    } else {
      await supabase.from("grace_challenge_favorites").insert({
        user_id: userId, post_id: postId, challenge_id: challenge.id,
      });
      setFavorites(f => [...f, postId]);
    }
  }

  async function handleGenerate() {
    setGenerating(true);
    await fetch("/api/admin/generate-today", { method: "POST" });
    await loadChallenge();
    setGenerating(false);
  }

  function startEditing() {
    if (!userPost) return;
    setEditText(userPost.post_text);
    setEditCompleted(userPost.completed);
    setIsEditing(true);
  }

  async function handleEditSubmit() {
    if (!editText.trim() || editCompleted === null || !userPost || !challenge) return;
    setEditSubmitting(true);
    // Update the post text/completed
    await supabase.from("grace_challenge_posts")
      .update({ post_text: editText, completed: editCompleted })
      .eq("id", userPost.id);
    // Delete all votes received on this post (forfeit existing votes)
    await supabase.from("grace_challenge_hearts")
      .delete()
      .eq("post_id", userPost.id);
    setIsEditing(false);
    await loadPosts(challenge.id);
    setEditSubmitting(false);
  }

  const heartsLeft = HEARTS_PER_DAY - givenHearts.length;
  const usedAllHearts = givenHearts.length >= HEARTS_PER_DAY;

  const displayName = (post: any) => {
    const total = allTimeHearts[post.user_id];
    return total ? `${post.user_name} (${total})` : post.user_name;
  };

  return (
    <SubscriptionGuard>
      <PageBackground url="https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/renegossner-alps-8728621_1920.jpg">
        <main className="flex-1 p-6">
          <div className="max-w-2xl mx-auto">

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <Link href="/dashboard" className="text-white/70 text-sm">← Dashboard</Link>
              <h1 className="text-lg font-bold text-white" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>Daily Grace Challenge</h1>
              <div className="flex items-center gap-3">
                <Link href="/grace-challenge/rules" className="text-white/60 text-sm">Rules</Link>
                <Link href="/grace-challenge/leaderboard" className="text-yellow-300 text-sm font-medium">🏆</Link>
              </div>
            </div>

            <div className="flex justify-center mb-6">
              <img src="https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/image.jpg" alt="Grace Challenge" className="w-24 h-24 object-cover rounded-full shadow-lg border-2 border-white/30" />
            </div>

            {loading ? (
              <p className="text-white/60 text-center py-12">Loading...</p>
            ) : !challenge ? (
              <div className="text-center py-12">
                <p className="text-white/60 mb-4">No challenge posted yet today. Check back soon. 🌅</p>
                {isAdmin && (
                  <button onClick={handleGenerate} disabled={generating}
                    className="bg-white/20 hover:bg-white/30 border border-white/30 text-white text-sm px-5 py-2 rounded-xl backdrop-blur-sm disabled:opacity-50">
                    {generating ? "Generating..." : "⚡ Generate Today's Challenge"}
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Challenge */}
                <p className="text-white/50 text-xs uppercase tracking-widest mb-2">Today's Challenge</p>
                <p className="text-2xl font-bold text-white mb-8 leading-relaxed"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}>
                  {challenge.challenge_text}
                </p>

                {/* Most Loved banner (after deadline) */}
                {revealed && winner && (
                  <div className="mb-8 bg-yellow-400/20 border border-yellow-400/40 rounded-2xl p-5 text-center backdrop-blur-sm">
                    <p className="text-yellow-300 text-xs uppercase tracking-widest mb-2">🏆 Most Loved Today</p>
                    <p className="text-white font-bold text-lg mb-1">{displayName(winner)}</p>
                    <p className="text-white/70 text-sm italic mb-3">"{winner.post_text?.slice(0, 120)}{winner.post_text?.length > 120 ? "..." : ""}"</p>
                    <p className="text-yellow-200/80 text-xs">Your community has voted — you have earned the Most Loved award for Guiding Grace today. 💛</p>
                  </div>
                )}

                {/* Hearts status — always visible for today's voting */}
                {(
                  <div className="mb-6 bg-white/10 rounded-xl p-4 border border-white/20 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-white/70 text-sm font-medium">Your Hearts</p>
                      <Link href="/grace-challenge/favorites" className="text-yellow-300 text-xs">🔖 Favorites</Link>
                    </div>
                    <div className="flex gap-2 mb-2">
                      {Array.from({ length: HEARTS_PER_DAY }).map((_, i) => (
                        <span key={i} className="text-2xl">{i < givenHearts.length ? "💛" : "🤍"}</span>
                      ))}
                    </div>
                    {usedAllHearts ? (
                      <p className="text-green-300 text-xs">✓ All 3 hearts given — your received votes will count!</p>
                    ) : (
                      <p className="text-white/50 text-xs">Give all 3 hearts or your received votes won't count. You can change your votes until 7am EST.</p>
                    )}
                  </div>
                )}

                {/* Submission form */}
                {!userPost ? (
                  <div className="bg-white/10 backdrop-blur rounded-2xl p-5 mb-8 border border-white/20">
                    <p className="text-white/80 text-sm font-medium mb-1">Share your response</p>
                    <p className="text-white/40 text-xs mb-4">Did the challenge or didn't — both entries can be voted on.</p>
                    <div className="flex gap-3 mb-4">
                      <button onClick={() => setCompleted(true)}
                        className={`flex-1 py-2 rounded-xl text-sm font-medium border transition ${completed === true ? "bg-white/30 text-white border-white/50" : "border-white/20 text-white/60"}`}>
                        ✅ I did it
                      </button>
                      <button onClick={() => setCompleted(false)}
                        className={`flex-1 py-2 rounded-xl text-sm font-medium border transition ${completed === false ? "bg-white/30 text-white border-white/50" : "border-white/20 text-white/60"}`}>
                        🌱 I chose not to
                      </button>
                    </div>
                    <textarea
                      value={response} onChange={e => setResponse(e.target.value)}
                      placeholder={completed === false ? "Share why you chose not to — honesty is grace too..." : "Share your story..."}
                      className="w-full bg-transparent border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/40 text-sm resize-none focus:outline-none focus:border-white/60 mb-3"
                      rows={4}
                    />
                    <button onClick={handleSubmit} disabled={!response.trim() || completed === null || submitting}
                      className="w-full bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold py-3 rounded-xl transition disabled:opacity-40">
                      {submitting ? "Sharing..." : "Share My Response 💛"}
                    </button>
                  </div>
                ) : userPost ? (
                  <div className="bg-white/10 backdrop-blur rounded-2xl p-5 mb-8 border border-white/20">
                    {isEditing ? (
                      <>
                        <p className="text-yellow-300 text-xs mb-3 font-medium">⚠️ Editing will forfeit all votes you've received so far.</p>
                        <div className="flex gap-3 mb-4">
                          <button onClick={() => setEditCompleted(true)}
                            className={`flex-1 py-2 rounded-xl text-sm font-medium border transition ${editCompleted === true ? "bg-white/30 text-white border-white/50" : "border-white/20 text-white/60"}`}>
                            ✅ I did it
                          </button>
                          <button onClick={() => setEditCompleted(false)}
                            className={`flex-1 py-2 rounded-xl text-sm font-medium border transition ${editCompleted === false ? "bg-white/30 text-white border-white/50" : "border-white/20 text-white/60"}`}>
                            🌱 I chose not to
                          </button>
                        </div>
                        <textarea
                          value={editText} onChange={e => setEditText(e.target.value)}
                          className="w-full bg-transparent border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/40 text-sm resize-none focus:outline-none focus:border-white/60 mb-3"
                          rows={4}
                        />
                        <div className="flex gap-3">
                          <button onClick={() => setIsEditing(false)}
                            className="flex-1 border border-white/20 text-white/60 font-semibold py-2 rounded-xl text-sm transition hover:bg-white/10">
                            Cancel
                          </button>
                          <button onClick={handleEditSubmit} disabled={!editText.trim() || editCompleted === null || editSubmitting}
                            className="flex-1 bg-yellow-400/30 hover:bg-yellow-400/40 border border-yellow-400/40 text-white font-semibold py-2 rounded-xl text-sm transition disabled:opacity-40">
                            {editSubmitting ? "Saving..." : "Save & Forfeit Votes"}
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-start justify-between mb-2">
                          <p className="text-white/50 text-xs">{userPost.completed ? "✅ You did it" : "🌱 You chose not to"}</p>
                          {!isAfterDeadline() && (
                            <button onClick={startEditing}
                              className="text-white/40 hover:text-white/70 text-xs border border-white/20 px-3 py-1 rounded-lg transition">
                              Edit
                            </button>
                          )}
                        </div>
                        <p className="text-white/80 text-sm leading-relaxed">{userPost.post_text}</p>
                        <p className="text-white/30 text-xs mt-3">Your response is live 💛</p>
                      </>
                    )}
                  </div>
                ) : null}

                {/* Community responses */}
                <p className="text-white/40 text-xs uppercase tracking-widest mb-4">
                  Community Responses · Voting closes at 7am EST
                </p>

                <div className="space-y-6">
                  {posts.map(post => (
                    <div key={post.id} className={`${winner?.id === post.id && revealed ? "border-l-2 border-yellow-400 pl-4" : ""}`}>
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-white/40 text-xs">{displayName(post)} · {post.completed ? "✅ Did it" : "🌱 Chose not to"}</p>
                        <div className="flex items-center gap-2">
                          {post.user_id !== userId && (
                            <button
                              onClick={() => toggleFavorite(post.id)}
                              className="text-base hover:scale-110 transition"
                              title="Save to favorites"
                            >
                              {favorites.includes(post.id) ? "🔖" : "📄"}
                            </button>
                          )}
                          {post.user_id !== userId && (
                            <button
                              onClick={() => toggleHeart(post.id, post.user_id)}
                              disabled={!givenHearts.includes(post.id) && heartsLeft === 0}
                              className={`text-xl transition ${!givenHearts.includes(post.id) && heartsLeft === 0 ? "opacity-30 cursor-default" : "hover:scale-110"}`}
                              title={givenHearts.includes(post.id) ? "Remove vote" : "Give a heart"}
                            >
                              {givenHearts.includes(post.id) ? "💛" : "🤍"}
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-white/80 text-sm leading-relaxed" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
                        {post.post_text}
                      </p>
                    </div>
                  ))}
                  {posts.length === 0 && (
                    <p className="text-white/40 text-sm text-center py-6">Be the first to share a response today.</p>
                  )}
                </div>
              </>
            )}
          </div>
        </main>
      </PageBackground>
    </SubscriptionGuard>
  );
}
