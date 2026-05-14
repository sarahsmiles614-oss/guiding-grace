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
  return nyHour >= 23;
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
  const [connectedIds, setConnectedIds] = useState<Set<string>>(new Set());
  const [pendingConnects, setPendingConnects] = useState<Set<string>>(new Set());

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
        supabase.from("user_connections").select("requester_id, recipient_id, status").or(`requester_id.eq.${user.id},recipient_id.eq.${user.id}`).then(({ data }) => {
          if (data) {
            const connected = new Set<string>();
            const pending = new Set<string>();
            data.forEach((c: any) => {
              const otherId = c.requester_id === user.id ? c.recipient_id : c.requester_id;
              if (c.status === "accepted") connected.add(otherId);
              else pending.add(otherId);
            });
            setConnectedIds(connected);
            setPendingConnects(pending);
          }
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
    if (!response.trim() || !userId || !challenge) return;
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

  async function handleConnect(otherUserId: string) {
    if (!userId) return;
    await supabase.from("user_connections").insert({ requester_id: userId, recipient_id: otherUserId, requester_name: userName });
    setPendingConnects(prev => new Set([...prev, otherUserId]));
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
              <Link href="/dashboard" className="text-white text-sm hover:text-white transition" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>← Home</Link>
              <h1 className="text-xl font-bold text-white" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>Daily Grace Challenge</h1>
              <Link href="/grace-challenge/rules" className="text-white/60 text-xs hover:text-white transition border border-white/20 hover:border-white/40 px-2.5 py-1 rounded-lg" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>How it Works</Link>
            </div>

            {/* Nav buttons */}
            <div className="flex gap-3 mb-6">
              <Link href="/grace-challenge/leaderboard" className="flex-1 flex items-center justify-center gap-2 bg-yellow-400/20 hover:bg-yellow-400/30 border border-yellow-300/40 text-yellow-200 font-semibold text-sm py-2.5 rounded-2xl transition" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
                🏆 Leaderboard
              </Link>
              <Link href="/grace-challenge/favorites" className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm py-2.5 rounded-2xl transition" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
                ⭐ My Saved Responses
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
                {/* Challenge card */}
                <div className="bg-white/10 border border-white/20 rounded-3xl p-6 mb-6 text-center backdrop-blur-sm">
                  <p className="text-yellow-300 text-xs uppercase tracking-widest font-semibold mb-3" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>
                    Today's Community Challenge
                  </p>
                  <p className="text-white text-2xl font-bold leading-relaxed mb-4"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 16px rgba(0,0,0,0.9)" }}>
                    {challenge.challenge_text}
                  </p>
                  <ShareButton
                    title="Today's Grace Challenge — Guiding Grace"
                    text={`Today's Grace Challenge: "${challenge.challenge_text}"\n\nJoin the community on Guiding Grace:`}
                    url="https://guidinggrace.app"
                    label="🤍 Share This Challenge"
                    className="text-white/60 hover:text-white text-xs transition"
                  />
                </div>

                {/* 3-step flow guide */}
                {!userPost && (
                  <div className="bg-white/8 border border-white/15 rounded-2xl px-5 py-4 mb-6">
                    <p className="text-white/50 text-xs uppercase tracking-widest mb-3 text-center">How it works</p>
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center gap-1 flex-shrink-0">
                        <span className="text-lg">☀️</span>
                        <div className="w-px h-4 bg-white/15" />
                        <span className="text-lg">💛</span>
                        <div className="w-px h-4 bg-white/15" />
                        <span className="text-lg">🏆</span>
                      </div>
                      <div className="space-y-3 flex-1">
                        <div>
                          <p className="text-white text-sm font-semibold leading-tight" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>Go do the challenge today</p>
                          <p className="text-white/55 text-xs mt-0.5">Any act of grace counts — big or small.</p>
                        </div>
                        <div>
                          <p className="text-white text-sm font-semibold leading-tight" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>Come back and share your story</p>
                          <p className="text-white/55 text-xs mt-0.5">Then give your 1 heart to the response that moves you most. <span className="text-yellow-200">You must vote to receive votes.</span></p>
                        </div>
                        <div>
                          <p className="text-white text-sm font-semibold leading-tight" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>Winner is revealed at midnight EST</p>
                          <p className="text-white/55 text-xs mt-0.5">Most hearts wins Most Loved. Results on the leaderboard.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Most Loved banner (yesterday's winner) */}
                {revealed && winner && (
                  <div className="mb-6 bg-yellow-400/15 border border-yellow-300/30 rounded-2xl p-5 text-center">
                    <p className="text-yellow-300 text-xs uppercase tracking-widest mb-2 font-semibold" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>🏆 Most Loved Yesterday</p>
                    <p className="text-white font-bold text-lg mb-1" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}>{displayName(winner)}</p>
                    <p className="text-white/80 text-sm italic mb-2" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>"{winner.post_text?.slice(0, 120)}{winner.post_text?.length > 120 ? "..." : ""}"</p>
                    <Link href="/grace-challenge/leaderboard" className="text-yellow-200 text-xs underline hover:text-yellow-100 transition">
                      See full leaderboard →
                    </Link>
                  </div>
                )}

                {/* Hearts status */}
                <div className="bg-white/8 border border-white/15 rounded-2xl px-5 py-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm font-semibold" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>Your heart today</p>
                      {usedAllHearts ? (
                        <p className="text-green-300 text-xs mt-0.5">✓ Voted — your received hearts will count at midnight</p>
                      ) : (
                        <p className="text-white/55 text-xs mt-0.5">Give it to the story that moves you most — closes midnight EST</p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: HEARTS_PER_DAY }).map((_, i) => (
                        <span key={i} className="text-2xl">{i < givenHearts.length ? "💛" : "🤍"}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Submission form */}
                {!userPost ? (
                  <div className="mb-8">
                    <p className="text-white text-sm font-semibold mb-1" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>Share your story with the community</p>
                    <p className="text-white/55 text-xs mb-1">How did it go? What did you do, say, or feel? Honesty is grace too.</p>
                    <p className="text-white/45 text-xs mb-3">Can't do today's challenge? Share a past story that fits today's theme — what matters is the spirit of grace, not the timing.</p>
                    <div className="flex gap-2 mb-3">
                      <button
                        onClick={() => setCompleted(true)}
                        className={`flex-1 py-2 rounded-xl border text-sm font-semibold transition ${completed === true ? "bg-green-500/25 border-green-400/50 text-green-200" : "bg-white/8 border-white/20 text-white/55 hover:bg-white/12"}`}>
                        ✅ I did it
                      </button>
                      <button
                        onClick={() => setCompleted(false)}
                        className={`flex-1 py-2 rounded-xl border text-sm font-semibold transition ${completed === false ? "bg-white/20 border-white/40 text-white" : "bg-white/8 border-white/20 text-white/55 hover:bg-white/12"}`}>
                        🌱 Couldn't this time
                      </button>
                    </div>
                    <textarea
                      value={response} onChange={e => setResponse(e.target.value)}
                      placeholder="Write your story here..."
                      className="w-full bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/50 text-base resize-none focus:outline-none focus:border-white/60 mb-3"
                      rows={4}
                    />
                    {submitError && (
                      <p className="text-red-300 text-sm mb-3" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>{submitError}</p>
                    )}
                    <button onClick={handleSubmit} disabled={!response.trim() || completed === null || submitting}
                      className="w-full bg-yellow-400/25 hover:bg-yellow-400/35 border border-yellow-300/40 text-white font-semibold py-3 rounded-xl transition disabled:opacity-40 text-base">
                      {submitting ? "Posting..." : "Post to the Community 💛"}
                    </button>
                  </div>
                ) : (
                  <div className="bg-white/8 border border-white/15 rounded-2xl px-5 py-4 mb-8">
                    {isEditing ? (
                      <>
                        <p className="text-yellow-300 text-xs mb-3" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>⚠️ Editing forfeits votes received so far.</p>
                        <div className="flex gap-2 mb-3">
                          <button
                            onClick={() => setEditCompleted(true)}
                            className={`flex-1 py-2 rounded-xl border text-sm font-semibold transition ${editCompleted === true ? "bg-green-500/25 border-green-400/50 text-green-200" : "bg-white/8 border-white/20 text-white/55 hover:bg-white/12"}`}>
                            ✅ I did it
                          </button>
                          <button
                            onClick={() => setEditCompleted(false)}
                            className={`flex-1 py-2 rounded-xl border text-sm font-semibold transition ${editCompleted === false ? "bg-white/20 border-white/40 text-white" : "bg-white/8 border-white/20 text-white/55 hover:bg-white/12"}`}>
                            🌱 Couldn't this time
                          </button>
                        </div>
                        <textarea
                          value={editText} onChange={e => setEditText(e.target.value)}
                          className="w-full bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white text-base resize-none focus:outline-none focus:border-white/60 mb-3"
                          rows={4}
                        />
                        <div className="flex gap-3">
                          <button onClick={() => setIsEditing(false)} className="flex-1 text-white/70 font-semibold py-2 rounded-xl transition hover:text-white text-sm">
                            Cancel
                          </button>
                          <button onClick={handleEditSubmit} disabled={!editText.trim() || editCompleted === null || editSubmitting}
                            className="flex-1 bg-yellow-400/30 hover:bg-yellow-400/40 text-white font-semibold py-2 rounded-xl transition disabled:opacity-40 text-sm">
                            {editSubmitting ? "Saving..." : "Save & Forfeit Votes"}
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-green-300 text-xs font-semibold">✓ Your story is live</p>
                          {!isAfterDeadline() && (
                            <button onClick={startEditing} className="text-white/50 hover:text-white text-xs transition">Edit</button>
                          )}
                        </div>
                        <p className="text-white text-sm leading-relaxed" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>{userPost.post_text}</p>
                        <p className="text-white/45 text-xs mt-2">Inspiring the community — don't forget to give your heart 💛</p>
                      </>
                    )}
                  </div>
                )}

                {/* Community responses */}
                <div className="flex items-center justify-between mb-4">
                  <p className="text-white text-sm font-semibold" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>
                    Community Responses
                    {posts.filter(p => !blockedIds.has(p.user_id)).length > 0 && (
                      <span className="text-white/45 font-normal ml-2 text-xs">
                        {posts.filter(p => !blockedIds.has(p.user_id)).length} {posts.filter(p => !blockedIds.has(p.user_id)).length === 1 ? "person" : "people"} shared today
                      </span>
                    )}
                  </p>
                  <p className="text-white/40 text-xs">Voting closes midnight EST</p>
                </div>

                <div className="space-y-4">
                  {posts.filter(post => !blockedIds.has(post.user_id)).map(post => (
                    <div key={post.id} className={`bg-white/8 border rounded-2xl px-4 py-4 ${winner?.id === post.id && revealed ? "border-yellow-400/50 bg-yellow-400/8" : "border-white/15"}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-white text-sm font-semibold" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>{displayName(post)}</p>
                          <span className="text-xs text-white/45">{post.completed ? "✅ Did it" : "🌱 Chose not to"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {post.user_id !== userId && (
                            <button onClick={() => toggleFavorite(post.id)} className="text-base hover:scale-110 transition" title="Save to favorites">
                              {favorites.includes(post.id) ? "⭐" : "☆"}
                            </button>
                          )}
                          {post.user_id !== userId && !connectedIds.has(post.user_id) && (
                            <button onClick={() => handleConnect(post.user_id)} disabled={pendingConnects.has(post.user_id)}
                              className="text-xs text-white/45 hover:text-white transition disabled:opacity-40">
                              {pendingConnects.has(post.user_id) ? "Requested" : "+ Connect"}
                            </button>
                          )}
                          {post.user_id !== userId && (
                            <button onClick={() => handleReport(post.id, post.post_text, post.user_id)}
                              className="text-xs text-white/25 hover:text-red-300 transition">Report</button>
                          )}
                          {post.user_id !== userId && (
                            <button onClick={() => handleBlock(post.user_id)}
                              className="text-xs text-white/25 hover:text-red-300 transition">Block</button>
                          )}
                          {post.user_id !== userId && (
                            <button
                              onClick={() => toggleHeart(post.id, post.user_id)}
                              disabled={!givenHearts.includes(post.id) && heartsLeft === 0}
                              className={`text-xl transition ${!givenHearts.includes(post.id) && heartsLeft === 0 ? "opacity-35 cursor-default" : "hover:scale-110"}`}
                              title={givenHearts.includes(post.id) ? "Remove vote" : "Give your heart"}
                            >
                              {givenHearts.includes(post.id) ? "💛" : "🤍"}
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-white text-sm leading-relaxed" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>
                        {post.post_text}
                      </p>
                    </div>
                  ))}
                  {posts.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-white/60 text-sm mb-1">No stories yet today.</p>
                      <p className="text-white/40 text-xs">Be the first — go do the challenge and share how it went.</p>
                    </div>
                  )}
                </div>

                {/* Bottom leaderboard CTA */}
                {posts.length > 0 && (
                  <div className="mt-8 text-center">
                    <Link href="/grace-challenge/leaderboard"
                      className="inline-flex items-center gap-2 bg-yellow-400/15 hover:bg-yellow-400/25 border border-yellow-300/30 text-yellow-200 font-semibold text-sm px-6 py-3 rounded-2xl transition">
                      🏆 See the Leaderboard
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </PageBackground>
    </SubscriptionGuard>
  );
}
