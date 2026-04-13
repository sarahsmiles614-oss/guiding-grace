"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import { supabase } from "@/lib/supabase";
import PageBackground from "@/components/PageBackground";

const promises = [
  { id: 1, reference: "Jeremiah 29:11", text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future." },
  { id: 2, reference: "Romans 8:28", text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose." },
  { id: 3, reference: "Philippians 4:13", text: "I can do all this through him who gives me strength." },
  { id: 4, reference: "Isaiah 41:10", text: "So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you." },
  { id: 5, reference: "Psalm 46:1", text: "God is our refuge and strength, an ever-present help in trouble." },
  { id: 6, reference: "Matthew 11:28", text: "Come to me, all you who are weary and burdened, and I will give you rest." },
  { id: 7, reference: "John 16:33", text: "I have told you these things, so that in me you may have peace. In this world you will have trouble. But take heart! I have overcome the world." },
  { id: 8, reference: "2 Corinthians 12:9", text: "My grace is sufficient for you, for my power is made perfect in weakness." },
];

export default function PromisesPage() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setUserId(user.id);
      supabase.from("favorite_promises").select("promise_id").eq("user_id", user.id).then(({ data }) => {
        if (data) setFavorites(data.map((r: any) => r.promise_id));
      });
    });
  }, []);

  async function toggleFavorite(id: number) {
    if (!userId) return;
    if (favorites.includes(id)) {
      await supabase.from("favorite_promises").delete().eq("user_id", userId).eq("promise_id", id);
      setFavorites(f => f.filter(x => x !== id));
    } else {
      await supabase.from("favorite_promises").insert({ user_id: userId, promise_id: id });
      setFavorites(f => [...f, id]);
    }
  }

  return (
    <SubscriptionGuard>
      <PageBackground url="https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/gersweb-god-2012104.jpg">
        <main className="flex-1 p-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <Link href="/dashboard" className="text-white/70 text-sm">← Dashboard</Link>
              <h1 className="text-lg font-bold text-white" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>His Promises</h1>
              <div className="w-16" />
            </div>
            <div className="space-y-8">
              {promises.map((p) => (
                <div key={p.id} className="flex gap-4 items-start">
                  <div className="flex-1">
                    <p className="text-white/50 text-xs mb-1">{p.reference}</p>
                    <p className="text-white/90 leading-relaxed italic" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}>"{p.text}"</p>
                  </div>
                  <button onClick={() => toggleFavorite(p.id)} className="text-2xl flex-shrink-0 mt-1">
                    {favorites.includes(p.id) ? "💜" : "🤍"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </PageBackground>
    </SubscriptionGuard>
  );
}
