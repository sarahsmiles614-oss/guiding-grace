"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import { supabase } from "@/lib/supabase";
import { promises as staticPromises, categories } from "@/lib/promises";
import PageBackground from "@/components/PageBackground";
import ShareStudio from "@/components/ShareStudio";

type Scripture = {
  id: string;
  category: string;
  scripture: string;
  reference: string;
  reflection: string;
};

export default function PromisesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [pool, setPool] = useState<Scripture[]>([]);
  const [current, setCurrent] = useState<Scripture | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [showStudio, setShowStudio] = useState(false);
  const seenRefs = useRef<string[]>([]);

  // Load all scriptures from Supabase, fall back to static list if it fails
  useEffect(() => {
    supabase.from("promise_scriptures").select("*").then(({ data }) => {
      const source: Scripture[] = (data && data.length > 0)
        ? data
        : staticPromises.map(p => ({ id: String(p.id), category: p.category, scripture: p.scripture, reference: p.reference, reflection: p.reflection }));
      setPool(source);
      const pick = source[Math.floor(Math.random() * source.length)];
      setCurrent(pick);
      seenRefs.current = [pick.reference];
    });
  }, []);

  // Load user + favorites
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setUserId(user.id);
      supabase
        .from("ai_favorite_promises")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .then(({ data }) => {
          if (data) {
            setFavorites(data.map((r: any) => r.reference));
          }
        });
    });
  }, []);

  function pickNew(category: string) {
    if (pool.length === 0) return;
    const filtered = category === "All" ? pool : pool.filter(p => p.category === category);
    const unseen = filtered.filter(p => !seenRefs.current.includes(p.reference));
    const source = unseen.length > 0 ? unseen : filtered;
    const pick = source[Math.floor(Math.random() * source.length)];
    setCurrent(pick);
    seenRefs.current = [...seenRefs.current.slice(-19), pick.reference];
  }

  function handleCategoryChange(cat: string) {
    setSelectedCategory(cat);
    pickNew(cat);
  }

  async function toggleFavorite(p?: Scripture) {
    const target = p ?? current;
    if (!userId || !target) return;
    if (favorites.includes(target.reference)) {
      await supabase.from("ai_favorite_promises").delete().eq("user_id", userId).eq("reference", target.reference);
      setFavorites(f => f.filter(x => x !== target.reference));
    } else {
      setFavorites(f => [...f, target.reference]);
      const { error } = await supabase.from("ai_favorite_promises").insert({
        user_id: userId,
        category: target.category,
        scripture: target.scripture,
        reference: target.reference,
        reflection: target.reflection,
      });
      if (error) setFavorites(f => f.filter(x => x !== target.reference));
    }
  }

  if (!current) {
    return (
      <SubscriptionGuard>
        <PageBackground url="https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/gersweb-god-2012104.jpg">
          <main className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          </main>
        </PageBackground>
      </SubscriptionGuard>
    );
  }

  return (
    <>
      {showStudio && (
        <ShareStudio
          scripture={current.scripture}
          reference={current.reference}
          onClose={() => setShowStudio(false)}
        />
      )}
      <SubscriptionGuard>
        <PageBackground url="https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/gersweb-god-2012104.jpg">
          <main className="flex-1 p-6 flex flex-col items-center">
            <div className="w-full max-w-4xl">
              <div className="flex justify-between items-center mb-6">
                <Link href="/dashboard" className="text-white/70 text-sm hover:text-white">← Home</Link>
                <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 10px rgba(0,0,0,0.7)" }}>
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
                  {categories.map(cat => (
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
                    {current.category}
                  </span>
                  <button onClick={() => toggleFavorite()} className="transition-transform hover:scale-110 text-2xl">
                    {favorites.includes(current.reference) ? "💜" : "🤍"}
                  </button>
                </div>

                <p className="text-2xl md:text-3xl text-white font-serif italic leading-relaxed mb-3 max-w-3xl w-full mx-auto text-center"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 8px rgba(0,0,0,0.7)" }}>
                  &ldquo;{current.scripture}&rdquo;
                </p>

                <p className="text-lg text-amber-200 font-semibold mb-5 text-center" style={{ textShadow: "0 2px 6px rgba(0,0,0,0.6)" }}>
                  — {current.reference}
                </p>

                {current.reflection && (
                  <p className="text-white text-base leading-relaxed max-w-2xl mx-auto mb-5 text-center" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
                    {current.reflection}
                  </p>
                )}

                <div className="flex justify-center">
                  <button
                    onClick={() => pickNew(selectedCategory)}
                    className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold text-sm rounded-full transition"
                  >
                    ✨ New Promise
                  </button>
                </div>

                <button onClick={() => setShowStudio(true)} className="flex items-center justify-center gap-2 mt-5 mx-auto w-fit hover:opacity-80 transition">
                  <span className="text-xl leading-none">🎨</span>
                  <span className="text-white font-semibold text-sm" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}>Customize &amp; Share</span>
                </button>
              </div>

              {/* Link to favorites page */}
              {favorites.length > 0 && (
                <div className="mt-8 pt-6 border-t border-white/20 text-center">
                  <Link href="/promises/favorites" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm transition">
                    <span>💜</span>
                    <span>View My Favorites ({favorites.length})</span>
                    <span>→</span>
                  </Link>
                </div>
              )}
            </div>
          </main>
        </PageBackground>
      </SubscriptionGuard>
    </>
  );
}
