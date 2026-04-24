"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import PageBackground from "@/components/PageBackground";
import { supabase } from "@/lib/supabase";

interface Bookmark {
  id: string;
  day: number;
  verse_reference: string;
  verse_text: string;
  created_at: string;
}

export default function BibleBookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      setUserId(user.id);

      const { data } = await supabase
        .from("bible365_bookmarks")
        .select("id, day, verse_reference, verse_text, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data) setBookmarks(data);
      setLoading(false);
    });
  }, []);

  async function removeBookmark(id: string) {
    if (!userId) return;
    await supabase.from("bible365_bookmarks").delete().eq("id", id).eq("user_id", userId);
    setBookmarks(prev => prev.filter(b => b.id !== id));
  }

  return (
    <SubscriptionGuard>
      <PageBackground url="https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/julius_silver-lago-di-limides-3025780_1920.jpg">
        <main className="flex-1 p-6 pb-20">
          <div className="max-w-2xl mx-auto">

            <div className="flex justify-between items-center mb-8">
              <Link href="/bible-365" className="text-white/70 text-sm">← Reading</Link>
              <h1
                className="text-lg font-bold text-white"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}
              >
                Saved Verses 🔖
              </h1>
              <div className="w-16" />
            </div>

            {loading && (
              <div className="text-center py-20">
                <p className="text-white/40 text-sm">Loading…</p>
              </div>
            )}

            {!loading && bookmarks.length === 0 && (
              <div className="text-center py-16">
                <p className="text-4xl mb-3">🔖</p>
                <p className="text-white/60 text-sm mb-2">No verses saved yet.</p>
                <Link href="/bible-365" className="text-white/50 hover:text-white text-sm underline transition">
                  Start reading →
                </Link>
              </div>
            )}

            {!loading && bookmarks.length > 0 && (
              <div className="space-y-0">
                {bookmarks.map(bk => (
                  <div key={bk.id} className="group py-4 border-b border-white/10 flex gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-white/50 text-xs">{bk.verse_reference}</p>
                        <span className="text-white/20 text-xs">· Day {bk.day}</span>
                      </div>
                      <p
                        className="text-white/85 text-sm leading-relaxed"
                        style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}
                      >
                        {bk.verse_text}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <button
                        onClick={() => removeBookmark(bk.id)}
                        className="text-white/20 hover:text-white/60 text-xs transition opacity-0 group-hover:opacity-100"
                        title="Remove bookmark"
                      >
                        ✕
                      </button>
                      <Link
                        href={`/bible-365?day=${bk.day}`}
                        className="text-white/30 hover:text-white/70 text-xs transition opacity-0 group-hover:opacity-100"
                        title="Go to this day"
                      >
                        Go →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </main>
      </PageBackground>
    </SubscriptionGuard>
  );
}
