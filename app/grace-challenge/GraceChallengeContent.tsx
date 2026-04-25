"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import { supabase } from "@/lib/supabase";
import { isSafe, MODERATION_ERROR } from "@/lib/moderation";
import PageBackground from "@/components/PageBackground";
import ShareButton from "@/components/ShareButton";

const HEARTS_PER_DAY = 1;

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
  const [completed, setCompleted] = useState<boolean | null>(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [givenHearts, setGivenHearts] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [allTimeHearts, setAllTimeHearts] = useState<Record<string, number>>({});
  const [winner, setWinner] = useState<any>(null);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [blockedIds, setBlockedIds] = useState<Set<string>>(new Set());
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const [editCompleted, setEditCompleted] = useState<boolean | null>(true);
  const [editSubmitting, setEditSubmitting] = useState(false);

  const loadChallenge = useCallback(async () => {
    const today = getToday();
    let { data: c } = await supabase.from("grace_challenges").select("*").eq("challenge_date", today).single();

    // If no challenge yet, try generating then re-fetch
    if (!c) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await fetch("/api/ensure-today", {
          method: "POST",
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        const result = await supabase.from("grace_challenges").select("*").eq("challenge_date", today).single();
        c = result.data;
      }
    }

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
        supabase.from("blocked_users").select("blocked_id").eq("blocker_id", user.id).then(({ data }) => {
          if (data) setBlockedIds(new Set(data.map((r: any) => r.blocked_id)));
        });
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
    if (!isSafe(response)) { setSubmitError(MODERATION_ERROR); return; }
    setSubmitting(true);
    setSubmitError("");
    const { error } = await supabase.from("grace_challenge_posts").insert({
      challenge_id: challenge.id,
      user_id: userId,
      user_name: userName,
      post_text: response,
      completed,
    });
    if (error) {
      setSubmitError(error.message);
      setSubmitting(false);
      return;
    }
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

  async function handleBlock(blockedUserId: string) {
    if (!userId || !confirm("Block this user? Their posts will no longer appear for you.")) return;
    await supabase.from("blocked_users").insert({ blocker_id: userId, blocked_id: blockedUserId });
    setBlockedIds(prev => new Set([...prev, blockedUserId]));
  }

  async function handleReport(contentId: string, contentText: string, reportedUserId: string) {
    if (!userId || !confirm("Report this content as inappropriate?")) return;
    await supabase.from("content_reports").insert({
      reporter_id: userId,
      reported_user_id: reportedUserId,
      content_type: "grace_challenge",
      content_id: contentId,
      content_text: contentText,
    });
    alert("Thank you — this has been reported for review.");
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
    if (!isSafe(editText)) { alert(MODERATION_ERROR); return; }
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
      <PageBackground url="https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/saud-edum-cgapZpzd7v0-unsplash%20(1).jpg">
        <main className="flex-1 p-6 flex flex-col items-center">
          <div className="w-full max-w-2xl">

            {/* Header */}
            <div className="flex justify-between items-center mb-5">
              <Link href="/dashboard" className="text-white/80 text-sm hover:text-white transition" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>← Dashboard</Link>
              <h1 className="text-xl font-bold text-white" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>Daily Grace Challenge</h1>
              <Link href="/grace-challenge/rules" className="text-white/80 text-sm hover:text-white transition" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>Rules</Link>
            </div>

            {/* Nav buttons */}
            <div className="flex gap-3 mb-8">
              <Link href="/grace-challenge/leaderboard" className="flex-1 flex items-center justify-center gap-2 bg-yellow-400/20 hover:bg-yellow-400/30 border border-yellow-300/40 text-yellow-200 font-semibold text-sm py-3 rounded-2xl transition" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
                🏆 Leaderboard
              </Link>
              <Link href="/grace-challenge/favorites" className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white/80 hover:text-white font-semibold text-sm py-3 rounded-2xl transition" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
                ⭐ Saved Responses
              </Link>
            </div>

            {loading ? (
              <p className="text-white text-center py-12">Loading...</p>
            ) : !challenge ? (
              <div className="text-center py-12">
                <p className="text-white mb-4">No challenge posted yet today. Check back soon. 🌅</p>
                {isAdmin && (
                  <button onClick={handleGenerate} disabled={generating}
                    className="bg-white/20 hover:bg-white/30 border border-white/30 text-white px-5 py-2 rounded-xl disabled:opacity-50">
                    {generating ? "Generating..." : "⚡ Generate Today's Challenge"}
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Challenge */}
                <p className="text-white/90 text-sm uppercase tracking-widest mb-3 text-center" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>Today's Challenge</p>
                <p className="text-3xl font-bold text-white mb-8 leading-relaxed text-center"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 16px rgba(0,0,0,0.9)" }}>
                  {challenge.challenge_text}
                </p>

                {/* Most Loved banner */}
                {revealed && winner && (
                  <div className="mb-8 text-center">
                    <p className="text-yellow-300 text-sm uppercase tracking-widest mb-2" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>🏆 Most Loved Today</p>
                    <p className="text-white font-bold text-xl mb-2" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}>{displayName(winner)}</p>
                    <p className="text-white/90 text-base italic mb-1" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>"{winner.post_text?.slice(0, 120)}{winner.post_text?.length > 120 ? "..." : ""}"</p>
                    <p className="text-yellow-200 text-sm" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>Your community has voted. 💛</p>
                  </div>
                )}

                {/* Hearts status */}
                <div className="mb-6">
                  <p className="text-white/90 text-sm mb-2 text-center" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>Your Hearts</p>
                  <div className="flex gap-2 mb-1 justify-center">
                    {Array.from({ length: HEARTS_PER_DAY }).map((_, i) => (
                      <span key={i} className="text-2xl">{i < givenHearts.length ? "💛" : "🤍"}</span>
                    ))}
                  </div>
                  {usedAllHearts ? (
                    <p className="text-green-300 text-sm text-center" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>✓ Heart given — your votes count!</p>
                  ) : (
                    <p className="text-white/80 text-sm text-center" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>Give your heart or your received votes won't count. Closes 7am EST.</p>
                  )}
                </div>

                {/* Submission form */}
                {!userPost ? (
                  <div className="mb-8">
                    <p className="text-white/90 text-sm uppercase tracking-widest mb-3 text-center" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>Your Response</p>
                    <textarea
                      value={response} onChange={e => setResponse(e.target.value)}
                      placeholder="Share how it went..."
                      className="w-full bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/60 text-base resize-none focus:outline-none focus:border-white/60 mb-3"
                      rows={4}
                    />
                    {submitError && (
                      <p className="text-red-300 text-sm mb-3" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>{submitError}</p>
                    )}
                    <button onClick={handleSubmit} disabled={!response.trim() || submitting}
                      className="w-full bg-white/25 hover:bg-white/35 text-white font-semibold py-3 rounded-xl transition disabled:opacity-40 text-base">
                      {submitting ? "Posting..." : "Share My Response 💛"}
                    </button>
                  </div>
                ) : userPost ? (
                  <div className="mb-8">
                    {isEditing ? (
                      <>
                        <p className="text-yellow-300 text-sm mb-3" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>⚠️ Editing forfeits votes received so far.</p>
                        <textarea
                          value={editText} onChange={e => setEditText(e.target.value)}
                          className="w-full bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white text-base resize-none focus:outline-none focus:border-white/60 mb-3"
                          rows={4}
                        />
                        <div className="flex gap-3">
                          <button onClick={() => setIsEditing(false)}
                            className="flex-1 text-white/80 font-semibold py-2 rounded-xl transition hover:text-white">
                            Cancel
                          </button>
                          <button onClick={handleEditSubmit} disabled={!editText.trim() || editCompleted === null || editSubmitting}
                            className="flex-1 bg-yellow-400/30 hover:bg-yellow-400/40 text-white font-semibold py-2 rounded-xl transition disabled:opacity-40">
                            {editSubmitting ? "Saving..." : "Save & Forfeit Votes"}
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-start justify-between mb-2">
                          <p className="text-white/80 text-sm">Your response</p>
                          {!isAfterDeadline() && (
                            <button onClick={startEditing} className="text-white/70 hover:text-white text-sm transition">Edit</button>
                          )}
                        </div>
                        <p className="text-white text-base leading-relaxed text-center" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>{userPost.post_text}</p>
                        <p className="text-white/70 text-sm mt-3 text-center" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>Your response is live 💛</p>
                      </>
                    )}
                  </div>
                ) : null}

                {/* Share challenge */}
                <div className="flex justify-center mb-6">
                  <ShareButton
                    title="Today's Grace Challenge — Guiding Grace"
                    text={`Today's Grace Challenge: "${challenge.challenge_text}"\n\nJoin the community on Guiding Grace:`}
                    url="https://guidinggrace.app"
                    label="🤍 Share This Challenge"
                    className="text-white/80 hover:text-white text-sm transition"
                  />
                </div>

                {/* Community responses */}
                <p className="text-white/80 text-sm uppercase tracking-widest mb-4 text-center" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>
                  Community Responses · Voting closes at 7am EST
                </p>

                <div className="space-y-6">
                  {posts.filter(post => !blockedIds.has(post.user_id)).map(post => (
                    <div key={post.id} className={`${winner?.id === post.id && revealed ? "border-l-2 border-yellow-400 pl-4" : ""}`}>
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-white/80 text-sm text-center flex-1" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>{displayName(post)}</p>
                        <div className="flex items-center gap-2">
                          {post.user_id !== userId && (
                            <button
                              onClick={() => toggleFavorite(post.id)}
                              className="text-base hover:scale-110 transition"
                              title="Save to favorites"
                            >
                              {favorites.includes(post.id) ? "⭐" : "☆"}
                            </button>
                          )}
                          {post.user_id !== userId && (
                            <button
                              onClick={() => handleBlock(post.user_id)}
                              className="text-xs text-white/30 hover:text-red-300 transition"
                              title="Block user"
                            >
                              Block
                            </button>
                          )}
                          {post.user_id !== userId && (
                            <button
                              onClick={() => handleReport(post.id, post.post_text, post.user_id)}
                              className="text-xs text-white/30 hover:text-red-300 transition"
                              title="Report content"
                            >
                              Report
                            </button>
                          )}
                          {post.user_id !== userId && (
                            <button
                              onClick={() => toggleHeart(post.id, post.user_id)}
                              disabled={!givenHearts.includes(post.id) && heartsLeft === 0}
                              className={`text-xl transition ${!givenHearts.includes(post.id) && heartsLeft === 0 ? "opacity-40 cursor-default" : "hover:scale-110"}`}
                              title={givenHearts.includes(post.id) ? "Remove vote" : "Give a heart"}
                            >
                              {givenHearts.includes(post.id) ? "💛" : "🤍"}
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-white text-base leading-relaxed text-center" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>
                        {post.post_text}
                      </p>
                    </div>
                  ))}
                  {posts.length === 0 && (
                    <p className="text-white/80 text-base text-center py-6">Be the first to share a response today.</p>
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
