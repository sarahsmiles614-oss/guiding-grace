"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import { supabase } from "@/lib/supabase";
import { promises as staticPromises, categories } from "@/lib/promises";
import PageBackground from "@/components/PageBackground";
import ShareStudio from "@/components/ShareStudio";

type DisplayPromise = {
  id: number | string;
  category: string;
  scripture: string;
  reference: string;
  reflection: string;
  isAI?: boolean;
};

export default function PromisesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [staticFavorites, setStaticFavorites] = useState<number[]>([]);
  const [aiFavorites, setAiFavorites] = useState<DisplayPromise[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [currentPromise, setCurrentPromise] = useState<DisplayPromise>(
    () => staticPromises[Math.floor(Math.random() * staticPromises.length)]
  );
  const [showStudio, setShowStudio] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [seenRefs, setSeenRefs] = useState<string[]>([]);
  const [genError, setGenError] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setUserId(user.id);
      supabase
        .from("favorite_promises")
        .select("promise_id")
        .eq("user_id", user.id)
        .then(({ data }) => {
          if (data) setStaticFavorites(data.map((r: { promise_id: number }) => r.promise_id));
        });
      supabase
        .from("ai_favorite_promises")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .then(({ data }) => {
          if (data) setAiFavorites(data.map((r: any) => ({ id: r.id, category: r.category, scripture: r.scripture, reference: r.reference, reflection: r.reflection, isAI: true })));
        });
    });
  }, []);

  async function generateAIPromise(category: string) {
    setGenerating(true);
    setGenError("");
    try {
      const res = await fetch("/api/generate-promise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ category, recentRefs: seenRefs, t: Date.now() }),
      });
      const data = await res.json();
      if (data.scripture) {
        setCurrentPromise({ ...data, id: `ai-${Date.now()}`, isAI: true });
        setSeenRefs(prev => [...prev.slice(-9), data.reference]);
      } else {
        setGenError("Couldn't load a new promise. Try again.");
      }
    } catch {
      setGenError("Couldn't load a new promise. Try again.");
    } finally {
      setGenerating(false);
    }
  }

  function generateStaticPromise(category: string) {
    const pool = category === "All" ? staticPromises : staticPromises.filter((p) => p.category === category);
    const available = pool.filter((p) => p.id !== currentPromise.id);
    const source = available.length > 0 ? available : pool;
    setCurrentPromise(source[Math.floor(Math.random() * source.length)]);
  }

  async function handleNewPromise() {
    await generateAIPromise(selectedCategory);
  }

  function handleCategoryChange(cat: string) {
    setSelectedCategory(cat);
    generateStaticPromise(cat);
  }

  async function toggleStaticFavorite(id: number) {
    if (!userId) return;
    if (staticFavorites.includes(id)) {
      await supabase.from("favorite_promises").delete().eq("user_id", userId).eq("promise_id", id);
      setStaticFavorites((f) => f.filter((x) => x !== id));
    } else {
      await supabase.from("favorite_promises").insert({ user_id: userId, promise_id: id });
      setStaticFavorites((f) => [...f, id]);
    }
  }

  async function toggleAIFavorite(p: DisplayPromise) {
    if (!userId) return;
    const existing = aiFavorites.find((f) => f.id === p.id);
    if (existing) {
      await supabase.from("ai_favorite_promises").delete().eq("id", p.id).eq("user_id", userId);
      setAiFavorites((f) => f.filter((x) => x.id !== p.id));
    } else {
      const { data } = await supabase
        .from("ai_favorite_promises")
        .insert({ user_id: userId, category: p.category, scripture: p.scripture, reference: p.reference, reflection: p.reflection })
        .select()
        .single();
      if (data) {
        const saved: DisplayPromise = { id: data.id, category: data.category, scripture: data.scripture, reference: data.reference, reflection: data.reflection, isAI: true };
        setAiFavorites((f) => [saved, ...f]);
        // Update current promise id so heart stays filled
        setCurrentPromise((prev) => prev.id === p.id ? saved : prev);
      }
    }
  }

  function isFavorited(p: DisplayPromise): boolean {
    if (p.isAI) return aiFavorites.some((f) => f.id === p.id);
    return staticFavorites.includes(p.id as number);
  }

  async function toggleFavorite(p: DisplayPromise) {
    if (p.isAI) await toggleAIFavorite(p);
    else await toggleStaticFavorite(p.id as number);
  }

  const allFavorites: DisplayPromise[] = [
    ...staticPromises.filter((p) => staticFavorites.includes(p.id)),
    ...aiFavorites,
  ];

  return (
    <>
      {showStudio && (
        <ShareStudio
          scripture={currentPromise.scripture}
          reference={currentPromise.reference}
          onClose={() => setShowStudio(false)}
        />
      )}
      <SubscriptionGuard>
        <PageBackground url="https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/gersweb-god-2012104.jpg">
          <main className="flex-1 p-6 flex flex-col items-center">
            <div className="w-full max-w-4xl">
              <div className="flex justify-between items-center mb-6">
                <Link href="/dashboard" className="text-white/70 text-sm hover:text-white">← Dashboard</Link>
                <h1
                  className="text-3xl font-bold text-white"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 10px rgba(0,0,0,0.7)" }}
                >
                  His Promises
                </h1>
                <div className="w-24" />
              </div>

              {/* Category Filter */}
              <div className="mb-5 text-center">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={() => handleCategoryChange("All")}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${selectedCategory === "All" ? "bg-white/30 text-white" : "text-white/60 hover:text-white hover:bg-white/10"}`}
                  >
                    All
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryChange(cat)}
                      className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${selectedCategory === cat ? "bg-white/30 text-white" : "text-white/60 hover:text-white hover:bg-white/10"}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Featured Promise */}
              <div className="mb-8 text-center">
                <div className="flex items-center justify-between mb-4 max-w-2xl mx-auto">
                  <div className="flex items-center gap-2">
                    <span className="px-4 py-1.5 text-white text-xs font-bold backdrop-blur-sm bg-white/20 rounded-full">
                      {currentPromise.category}
                    </span>
                    {currentPromise.isAI && (
                      <span className="px-3 py-1.5 text-amber-200 text-xs font-bold backdrop-blur-sm bg-amber-500/20 rounded-full">
                        ✨ AI
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => toggleFavorite(currentPromise)}
                    className="transition-transform hover:scale-110 text-2xl"
                  >
                    {isFavorited(currentPromise) ? "💜" : "🤍"}
                  </button>
                </div>

                {generating ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-8 h-8 border-2 border-white/40 border-t-white rounded-full animate-spin mb-4" />
                    <p className="text-white/60 text-sm">Receiving a word from God&apos;s promises...</p>
                  </div>
                ) : (
                  <>
                    <p
                      className="text-2xl md:text-3xl text-white font-serif italic leading-relaxed mb-3 max-w-3xl w-full mx-auto text-center"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 8px rgba(0,0,0,0.7)" }}
                    >
                      &ldquo;{currentPromise.scripture}&rdquo;
                    </p>

                    <p className="text-lg text-amber-200 font-semibold mb-5 text-center" style={{ textShadow: "0 2px 6px rgba(0,0,0,0.6)" }}>
                      — {currentPromise.reference}
                    </p>

                    {currentPromise.reflection && (
                      <p className="text-white/90 text-base leading-relaxed max-w-2xl mx-auto mb-5 text-center" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
                        {currentPromise.reflection}
                      </p>
                    )}
                  </>
                )}

                <div className="flex justify-center">
                  <button
                    onClick={handleNewPromise}
                    disabled={generating}
                    className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 text-white font-semibold text-sm rounded-full transition"
                  >
                    {generating ? "Generating..." : "✨ New Promise"}
                  </button>
                  {genError && <p className="text-red-300 text-xs mt-2">{genError}</p>}
                </div>

                <button
                  onClick={() => setShowStudio(true)}
                  className="flex items-center justify-center gap-2 mt-5 mx-auto w-fit hover:opacity-80 transition"
                >
                  <span className="text-xl leading-none">🎨</span>
                  <span className="text-white font-semibold text-sm" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}>Customize &amp; Share</span>
                </button>
              </div>

              {/* Favorites Section */}
              {allFavorites.length > 0 && (
                <div className="mt-8 pt-6 border-t border-white/20">
                  <h2
                    className="text-2xl font-bold text-white mb-5 text-center"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 8px rgba(0,0,0,0.7)" }}
                  >
                    💜 My Favorite Promises ({allFavorites.length})
                  </h2>
                  <div className="space-y-4">
                    {allFavorites.map((p) => (
                      <div
                        key={p.id}
                        className="cursor-pointer hover:opacity-80 p-2 transition text-center"
                        onClick={() => { setCurrentPromise(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      >
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <span className="text-xs font-bold text-white/60 uppercase tracking-wide">{p.category}</span>
                          {p.isAI && <span className="text-xs text-amber-300/70">✨ AI</span>}
                        </div>
                        <p className="text-white font-serif italic leading-relaxed mb-1 line-clamp-2" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
                          &ldquo;{p.scripture}&rdquo;
                        </p>
                        <p className="text-amber-200 text-sm font-medium mb-2" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
                          {p.reference}
                        </p>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleFavorite(p); }}
                          className="text-xl"
                        >
                          💜
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </main>
        </PageBackground>
      </SubscriptionGuard>
    </>
  );
}
