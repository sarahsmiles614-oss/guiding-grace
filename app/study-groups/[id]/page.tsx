"use client";
import { useEffect, useState, useRef, use } from "react";
import Link from "next/link";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import PageBackground from "@/components/PageBackground";
import { supabase } from "@/lib/supabase";

const BG = "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/Images%204/clicker-babu-aKBtbbVP970-unsplash.jpg";

interface GameQuestion { question: string; options: string[]; answer: string; }

export default function GroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: groupId } = use(params);

  const [tab, setTab] = useState<"discussion" | "game">("discussion");
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [group, setGroup] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<any[]>([]);
  const [myAnswers, setMyAnswers] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState<number | null>(null);
  const [expandedQ, setExpandedQ] = useState<number | null>(0);
  const [copied, setCopied] = useState(false);

  // Game state
  const [game, setGame] = useState<any>(null);
  const [gameQuestions, setGameQuestions] = useState<GameQuestion[]>([]);
  const [myGameAnswers, setMyGameAnswers] = useState<Record<number, string>>({});
  const [gameLoading, setGameLoading] = useState(false);
  const [allGameAnswers, setAllGameAnswers] = useState<any[]>([]);
  const [scores, setScores] = useState<Record<string, { name: string; score: number }>>({});
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    init();
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [groupId]);

  async function init() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUserId(user.id);
    setUserName(user.user_metadata?.full_name || "Friend");
    await Promise.all([loadGroup(), loadMembers(), loadDiscussion(), loadGame()]);
    pollRef.current = setInterval(() => { loadDiscussion(); loadGame(); }, 5000);
  }

  async function loadGroup() {
    const { data } = await supabase.from("study_groups").select("*").eq("id", groupId).single();
    if (data) setGroup(data);
  }

  async function loadMembers() {
    const { data } = await supabase.from("study_group_members").select("user_id, user_name").eq("group_id", groupId);
    if (data) setMembers(data);
  }

  async function loadDiscussion() {
    const today = new Date().toISOString().split("T")[0];
    const { data: guide } = await supabase
      .from("study_guides")
      .select("questions")
      .eq("guide_date", today)
      .single();
    if (guide?.questions) setQuestions(guide.questions);

    const { data: ans } = await supabase
      .from("study_group_answers")
      .select("*")
      .eq("group_id", groupId)
      .order("created_at", { ascending: true });
    if (ans) setAnswers(ans);
  }

  async function loadGame() {
    const { data } = await supabase
      .from("study_group_game")
      .select("*")
      .eq("group_id", groupId)
      .single();
    if (data) {
      setGame(data);
      if (data.questions) setGameQuestions(data.questions);
      // Load all game answers
      const { data: ga } = await supabase
        .from("study_group_game_answers")
        .select("*")
        .eq("group_id", groupId);
      if (ga) {
        setAllGameAnswers(ga);
        computeScores(ga, data.questions ?? []);
      }
    } else {
      setGame(null);
    }
  }

  function computeScores(gameAnswers: any[], qs: GameQuestion[]) {
    const s: Record<string, { name: string; score: number }> = {};
    for (const a of gameAnswers) {
      if (!s[a.user_id]) s[a.user_id] = { name: a.user_name, score: 0 };
      if (a.is_correct) s[a.user_id].score += 1;
    }
    setScores(s);
  }

  async function submitAnswer(qIndex: number) {
    const text = myAnswers[qIndex];
    if (!text?.trim() || !userId) return;
    setSubmitting(qIndex);
    await supabase.from("study_group_answers").insert({
      group_id: groupId,
      question_index: qIndex,
      question_text: questions[qIndex],
      user_id: userId,
      user_name: userName,
      answer_text: text.trim(),
    });
    setMyAnswers(prev => ({ ...prev, [qIndex]: "" }));
    await loadDiscussion();
    setSubmitting(null);
  }

  async function likeAnswer(id: string, current: number) {
    await supabase.from("study_group_answers").update({ likes: current + 1 }).eq("id", id);
    setAnswers(prev => prev.map(a => a.id === id ? { ...a, likes: current + 1 } : a));
  }

  async function startGame() {
    setGameLoading(true);
    const res = await fetch("/api/study-group-game", { method: "POST" });
    const json = await res.json();
    if (json.error || !json.questions) { alert("Could not generate questions. Try again."); setGameLoading(false); return; }

    // Delete old game answers for this group
    await supabase.from("study_group_game_answers").delete().eq("group_id", groupId);
    // Upsert game record
    await supabase.from("study_group_game").upsert(
      { group_id: groupId, status: "playing", questions: json.questions, started_by: userId, started_at: new Date().toISOString() },
      { onConflict: "group_id" }
    );
    setMyGameAnswers({});
    setAllGameAnswers([]);
    setScores({});
    await loadGame();
    setGameLoading(false);
  }

  async function submitGameAnswer(qIndex: number, choice: string, correctAnswer: string) {
    if (myGameAnswers[qIndex] || !userId) return;
    const is_correct = choice === correctAnswer;
    setMyGameAnswers(prev => ({ ...prev, [qIndex]: choice }));
    await supabase.from("study_group_game_answers").upsert(
      { group_id: groupId, question_index: qIndex, user_id: userId, user_name: userName, answer: choice, is_correct },
      { onConflict: "group_id,question_index,user_id" }
    );
    await loadGame();
  }

  async function endGame() {
    await supabase.from("study_group_game").update({ status: "finished" }).eq("group_id", groupId);
    await loadGame();
  }

  function copyCode() {
    if (!group) return;
    navigator.clipboard.writeText(group.invite_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const myScore = scores[userId]?.score ?? 0;
  const sortedScores = Object.entries(scores).sort((a, b) => b[1].score - a[1].score);
  const gameFinished = game?.status === "finished";
  const gamePlaying = game?.status === "playing";

  return (
    <SubscriptionGuard>
      <PageBackground url={BG} overlayOpacity={0.72}>
        <main className="flex-1 p-6 pb-24 flex flex-col items-center">
          <div className="max-w-2xl w-full">

            {/* Header */}
            <div className="flex justify-between items-center mb-2">
              <Link href="/study-groups" className="text-white hover:text-white text-sm transition">← Groups</Link>
              <h1 className="text-lg font-bold text-white text-center" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
                {group?.name ?? "Loading..."}
              </h1>
              <div className="w-16" />
            </div>

            {/* Invite code */}
            {group && (
              <div className="flex justify-center mb-5">
                <button onClick={copyCode} className="flex items-center gap-2 text-white/85 hover:text-white text-xs border border-white/30 hover:border-white/50 px-3 py-1.5 rounded-lg transition font-mono">
                  {copied ? "✓ Copied!" : `Invite: ${group.invite_code}`}
                </button>
              </div>
            )}

            {/* Members */}
            {members.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {members.map(m => (
                  <span key={m.user_id} className="text-white text-xs bg-white/10 border border-white/25 rounded-full px-3 py-1">
                    {m.user_name}
                  </span>
                ))}
              </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              {(["discussion", "game"] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold capitalize transition ${tab === t ? "bg-white/25 border-white/50 text-white" : "bg-white/10 border-white/25 text-white hover:text-white"}`}
                >
                  {t === "discussion" ? "📖 Discussion" : "🎮 Bible Trivia"}
                </button>
              ))}
            </div>

            {/* ── DISCUSSION TAB ── */}
            {tab === "discussion" && (
              <div className="space-y-6">
                {questions.length === 0 && (
                  <p className="text-white/85 text-sm text-center py-10" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>Today's study guide hasn't been generated yet. Check back after midnight.</p>
                )}
                {questions.map((q, i) => {
                  const qAnswers = answers.filter(a => a.question_index === i);
                  const myAnswer = answers.find(a => a.question_index === i && a.user_id === userId);
                  return (
                    <div key={i} className="bg-white/10 border border-white/15 rounded-2xl overflow-hidden">
                      <button
                        onClick={() => setExpandedQ(expandedQ === i ? null : i)}
                        className="w-full text-left px-5 py-4 flex items-start justify-between gap-3"
                      >
                        <div className="flex-1">
                          <p className="text-white text-xs mb-1">Question {i + 1}</p>
                          <p className="text-white text-sm font-medium leading-relaxed" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>{q}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
                          {qAnswers.length > 0 && <span className="text-white text-xs">{qAnswers.length} response{qAnswers.length !== 1 ? "s" : ""}</span>}
                          <span className="text-white text-xs">{expandedQ === i ? "▲" : "▼"}</span>
                        </div>
                      </button>

                      {expandedQ === i && (
                        <div className="px-5 pb-5">
                          {/* Others' answers */}
                          {qAnswers.length > 0 && (
                            <div className="space-y-3 mb-4">
                              {qAnswers.map(a => (
                                <div key={a.id} className={`rounded-xl p-3 ${a.user_id === userId ? "bg-white/15 border border-white/20" : "bg-white/5 border border-white/10"}`}>
                                  <p className="text-white text-xs mb-1 font-semibold">{a.user_name}</p>
                                  <p className="text-white text-sm leading-relaxed">{a.answer_text}</p>
                                  {a.user_id !== userId && (
                                    <button onClick={() => likeAnswer(a.id, a.likes || 0)} className="mt-2 text-xs text-white hover:text-white transition">
                                      🙏 {a.likes > 0 ? a.likes : ""} Amen
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Submit answer */}
                          {!myAnswer && (
                            <div>
                              <textarea
                                value={myAnswers[i] ?? ""}
                                onChange={e => setMyAnswers(prev => ({ ...prev, [i]: e.target.value }))}
                                placeholder="Share your reflection..."
                                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 text-sm resize-none focus:outline-none focus:border-white/40 mb-2"
                                rows={3}
                              />
                              <button
                                onClick={() => submitAnswer(i)}
                                disabled={!myAnswers[i]?.trim() || submitting === i}
                                className="bg-white/20 hover:bg-white/30 border border-white/30 text-white text-sm font-semibold px-5 py-2 rounded-xl transition disabled:opacity-40"
                              >
                                {submitting === i ? "Posting..." : "Post Answer"}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── GAME TAB ── */}
            {tab === "game" && (
              <div>
                {/* No game yet */}
                {!game && (
                  <div className="text-center py-10">
                    <p className="text-5xl mb-4">🎮</p>
                    <p className="text-white font-bold text-lg mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Bible Trivia</p>
                    <p className="text-white text-sm mb-6 leading-relaxed" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>Test your knowledge of today's scripture with your group. Anyone can start a round!</p>
                    <button
                      onClick={startGame}
                      disabled={gameLoading}
                      className="bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold px-8 py-3 rounded-2xl transition text-sm disabled:opacity-40"
                    >
                      {gameLoading ? "Generating questions..." : "Start a Round ✨"}
                    </button>
                  </div>
                )}

                {/* Game in progress */}
                {gamePlaying && gameQuestions.length > 0 && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-white text-xs uppercase tracking-widest">Round in Progress</p>
                      <div className="flex gap-2">
                        <button onClick={startGame} disabled={gameLoading} className="text-white/85 hover:text-white text-xs border border-white/30 px-3 py-1 rounded-lg transition">↺ New Round</button>
                        <button onClick={endGame} className="text-white/85 hover:text-white text-xs border border-white/30 px-3 py-1 rounded-lg transition">End →</button>
                      </div>
                    </div>

                    {gameQuestions.map((q, i) => {
                      const myChoice = myGameAnswers[i];
                      const revealed = !!myChoice;
                      return (
                        <div key={i} className="bg-white/10 border border-white/15 rounded-2xl p-5">
                          <p className="text-white/85 text-xs mb-2">Question {i + 1} of {gameQuestions.length}</p>
                          <p className="text-white font-semibold text-sm mb-4 leading-relaxed" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>{q.question}</p>
                          <div className="grid grid-cols-2 gap-2">
                            {q.options.map((opt, oi) => {
                              const letter = ["A", "B", "C", "D"][oi];
                              const isMyChoice = myChoice === letter;
                              const isCorrect = letter === q.answer;
                              let style = "bg-white/10 border-white/20 text-white";
                              if (revealed && isMyChoice && isCorrect) style = "bg-green-500/30 border-green-400/60 text-green-200";
                              else if (revealed && isMyChoice && !isCorrect) style = "bg-red-500/30 border-red-400/60 text-red-200";
                              else if (revealed && isCorrect) style = "bg-green-500/20 border-green-400/40 text-green-300";
                              return (
                                <button
                                  key={oi}
                                  onClick={() => submitGameAnswer(i, letter, q.answer)}
                                  disabled={!!myChoice}
                                  className={`border rounded-xl px-3 py-3 text-xs text-left transition font-medium ${style} ${!myChoice ? "hover:bg-white/20 hover:border-white/40 cursor-pointer" : "cursor-default"}`}
                                >
                                  <span className="font-bold mr-1">{letter}.</span> {opt}
                                </button>
                              );
                            })}
                          </div>
                          {revealed && (
                            <p className={`text-xs mt-3 font-semibold ${myChoice === q.answer ? "text-green-300" : "text-red-300"}`}>
                              {myChoice === q.answer ? "✓ Correct!" : `✗ The answer was ${q.answer}`}
                            </p>
                          )}
                        </div>
                      );
                    })}

                    {/* Live scores */}
                    {Object.keys(scores).length > 0 && (
                      <div className="bg-white/10 border border-white/15 rounded-2xl p-5 mt-4">
                        <p className="text-white text-xs uppercase tracking-widest mb-3">Scores</p>
                        {sortedScores.map(([uid, s], rank) => (
                          <div key={uid} className="flex items-center justify-between py-1.5 border-b border-white/10 last:border-0">
                            <div className="flex items-center gap-2">
                              <span className="text-white text-xs w-4">{rank + 1}.</span>
                              <span className={`text-sm ${uid === userId ? "text-white font-semibold" : "text-white"}`}>{s.name}</span>
                            </div>
                            <span className="text-amber-200 text-sm font-bold">{s.score} / {gameQuestions.length}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Game finished — final leaderboard */}
                {gameFinished && (
                  <div>
                    <div className="text-center mb-6">
                      <p className="text-4xl mb-3">🏆</p>
                      <h2 className="text-white text-xl font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Round Complete!</h2>
                      {sortedScores[0] && (
                        <p className="text-amber-200 text-sm mt-1">🥇 {sortedScores[0][1].name} wins with {sortedScores[0][1].score} correct!</p>
                      )}
                    </div>
                    <div className="bg-white/10 border border-white/15 rounded-2xl p-5 mb-6">
                      <p className="text-white text-xs uppercase tracking-widest mb-3">Final Scores</p>
                      {sortedScores.map(([uid, s], rank) => (
                        <div key={uid} className="flex items-center justify-between py-2 border-b border-white/10 last:border-0">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{rank === 0 ? "🥇" : rank === 1 ? "🥈" : rank === 2 ? "🥉" : "  "}</span>
                            <span className={`text-sm ${uid === userId ? "text-white font-bold" : "text-white"}`}>{s.name}</span>
                          </div>
                          <span className="text-amber-200 font-bold">{s.score} / {gameQuestions.length}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={startGame}
                      disabled={gameLoading}
                      className="w-full bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold py-3 rounded-2xl transition text-sm disabled:opacity-40"
                    >
                      {gameLoading ? "Generating..." : "Play Another Round ✨"}
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        </main>
      </PageBackground>
    </SubscriptionGuard>
  );
}
