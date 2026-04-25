"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import { supabase } from "@/lib/supabase";
import { promises, categories } from "@/lib/promises";
import PageBackground from "@/components/PageBackground";
import ShareStudio from "@/components/ShareStudio";

export default function PromisesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [currentPromise, setCurrentPromise] = useState(
    () => promises[Math.floor(Math.random() * promises.length)]
  );
  const [showStudio, setShowStudio] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setUserId(user.id);
      supabase
        .from("favorite_promises")
        .select("promise_id")
        .eq("user_id", user.id)
        .then(({ data }) => {
          if (data) setFavorites(data.map((r: { promise_id: number }) => r.promise_id));
        });
    });
  }, []);

  const filteredPromises =
    selectedCategory === "All"
      ? promises
      : promises.filter((p) => p.category === selectedCategory);

  async function toggleFavorite(id: number) {
    if (!userId) return;
    if (favorites.includes(id)) {
      await supabase.from("favorite_promises").delete().eq("user_id", userId).eq("promise_id", id);
      setFavorites((f) => f.filter((x) => x !== id));
    } else {
      await supabase.from("favorite_promises").insert({ user_id: userId, promise_id: id });
      setFavorites((f) => [...f, id]);
    }
  }

  function generateNewPromise() {
    const available = filteredPromises.filter((p) => p.id !== currentPromise.id);
    if (available.length > 0) {
      setCurrentPromise(available[Math.floor(Math.random() * available.length)]);
    }
  }

  function handleCategoryChange(cat: string) {
    setSelectedCategory(cat);
    const pool = cat === "All" ? promises : promises.filter((p) => p.category === cat);
    setCurrentPromise(pool[Math.floor(Math.random() * pool.length)]);
  }

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
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
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
                <span className="px-4 py-1.5 text-white text-xs font-bold backdrop-blur-sm bg-white/20 rounded-full">
                  {currentPromise.category}
                </span>
                <button
                  onClick={() => toggleFavorite(currentPromise.id)}
                  className="transition-transform hover:scale-110 text-2xl"
                >
                  {favorites.includes(currentPromise.id) ? "💜" : "🤍"}
                </button>
              </div>

              <blockquote
                className="text-2xl md:text-3xl text-white font-serif italic leading-relaxed mb-3 max-w-3xl mx-auto"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 8px rgba(0,0,0,0.7)" }}
              >
                &ldquo;{currentPromise.scripture}&rdquo;
              </blockquote>

              <p className="text-lg text-amber-200 font-semibold mb-5" style={{ textShadow: "0 2px 6px rgba(0,0,0,0.6)" }}>
                — {currentPromise.reference}
              </p>

              {currentPromise.reflection && (
                <p className="text-white/90 text-base leading-relaxed max-w-2xl mx-auto mb-5" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
                  {currentPromise.reflection}
                </p>
              )}

              <button
                onClick={generateNewPromise}
                className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold text-sm rounded-full transition"
              >
                ✨ New Promise
              </button>

              <button
                onClick={() => setShowStudio(true)}
                className="flex items-center justify-center gap-2 mt-5 mx-auto hover:opacity-80 transition"
              >
                <span className="text-xl leading-none">🎨</span>
                <span className="text-white font-semibold text-sm" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}>Customize &amp; Share</span>
              </button>
            </div>

            {/* Favorites Section */}
            {favorites.length > 0 && (
              <div className="mt-8 pt-6 border-t border-white/20">
                <h2
                  className="text-2xl font-bold text-white mb-5 text-center"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 8px rgba(0,0,0,0.7)" }}
                >
                  💜 My Favorite Promises ({favorites.length})
                </h2>
                <div className="space-y-4">
                  {promises
                    .filter((p) => favorites.includes(p.id))
                    .map((p) => (
                      <div
                        key={p.id}
                        className="cursor-pointer hover:opacity-80 p-2 transition"
                        onClick={() => { setCurrentPromise(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <span className="text-xs font-bold text-white/60 uppercase tracking-wide block mb-1">{p.category}</span>
                            <p className="text-white font-serif italic leading-relaxed mb-1 line-clamp-2" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
                              &ldquo;{p.scripture}&rdquo;
                            </p>
                            <p className="text-amber-200 text-sm font-medium" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
                              {p.reference}
                            </p>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleFavorite(p.id); }}
                            className="text-xl flex-shrink-0"
                          >
                            💜
                          </button>
                        </div>
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
