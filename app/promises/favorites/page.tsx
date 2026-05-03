"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import { supabase } from "@/lib/supabase";
import PageBackground from "@/components/PageBackground";
import ShareStudio from "@/components/ShareStudio";

const BG = "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/alex-lehner-YHGZEAHiCKk-unsplash.jpg";

type Scripture = {
  id: string;
  category: string;
  scripture: string;
  reference: string;
  reflection: string;
};

export default function FavoritePromisesPage() {
  const [favorites, setFavorites] = useState<Scripture[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Scripture | null>(null);
  const [showStudio, setShowStudio] = useState(false);

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
          if (data) setFavorites(data.map((r: any) => ({
            id: r.reference,
            category: r.category,
            scripture: r.scripture,
            reference: r.reference,
            reflection: r.reflection,
          })));
        });
    });
  }, []);

  async function removeFavorite(reference: string) {
    if (!userId) return;
    await supabase.from("ai_favorite_promises").delete().eq("user_id", userId).eq("reference", reference);
    setFavorites(f => f.filter(x => x.reference !== reference));
    if (selected?.reference === reference) setSelected(null);
  }

  return (
    <>
      {showStudio && selected && (
        <ShareStudio
          scripture={selected.scripture}
          reference={selected.reference}
          onClose={() => setShowStudio(false)}
        />
      )}
      <SubscriptionGuard>
        <PageBackground url={BG}>
          <main className="flex-1 p-6 flex flex-col items-center">
            <div className="w-full max-w-2xl">
              <div className="flex justify-between items-center mb-8">
                <Link href="/promises" className="text-white/70 text-sm hover:text-white">← His Promises</Link>
                <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>
                  💜 My Favorites
                </h1>
                <div className="w-24" />
              </div>

              {/* Selected / featured */}
              {selected && (
                <div className="mb-10 text-center">
                  <span className="px-4 py-1.5 text-white text-xs font-bold backdrop-blur-sm bg-white/20 rounded-full mb-4 inline-block">
                    {selected.category}
                  </span>
                  <p className="text-2xl md:text-3xl text-white font-serif italic leading-relaxed mb-3 max-w-2xl mx-auto"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
                    &ldquo;{selected.scripture}&rdquo;
                  </p>
                  <p className="text-lg text-amber-200 font-semibold mb-4" style={{ textShadow: "0 2px 6px rgba(0,0,0,0.6)" }}>
                    — {selected.reference}
                  </p>
                  {selected.reflection && (
                    <p className="text-white text-sm leading-relaxed max-w-xl mx-auto mb-5" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.7)" }}>
                      {selected.reflection}
                    </p>
                  )}
                  <button onClick={() => setShowStudio(true)} className="flex items-center justify-center gap-2 mx-auto w-fit hover:opacity-80 transition">
                    <span className="text-lg leading-none">🎨</span>
                    <span className="text-white font-semibold text-sm" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}>Customize &amp; Share</span>
                  </button>
                </div>
              )}

              {favorites.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-white/50 text-sm">No favorites yet. Tap 🤍 on any promise to save it here.</p>
                  <Link href="/promises" className="mt-4 inline-block text-white/70 underline text-sm">Browse His Promises</Link>
                </div>
              ) : (
                <div className="space-y-5">
                  {favorites.map(p => (
                    <div key={p.reference}
                      className={`cursor-pointer p-4 rounded-2xl border transition ${selected?.reference === p.reference ? "bg-white/20 border-white/40" : "bg-white/5 border-white/15 hover:bg-white/10"}`}
                      onClick={() => setSelected(p)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-bold text-white/50 uppercase tracking-wide block mb-1">{p.category}</span>
                          <p className="text-white font-serif italic leading-relaxed text-sm line-clamp-2"
                            style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
                            &ldquo;{p.scripture}&rdquo;
                          </p>
                          <p className="text-amber-200 text-xs font-medium mt-1">{p.reference}</p>
                        </div>
                        <button
                          onClick={e => { e.stopPropagation(); removeFavorite(p.reference); }}
                          className="text-xl flex-shrink-0 hover:scale-110 transition-transform"
                        >
                          💜
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        </PageBackground>
      </SubscriptionGuard>
    </>
  );
}
