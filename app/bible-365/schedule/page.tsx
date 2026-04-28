"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import PageBackground from "@/components/PageBackground";
import { supabase } from "@/lib/supabase";
import { getBiblePlan } from "@/lib/bible-plan";

export default function BibleSchedulePage() {
  return (
    <Suspense fallback={null}>
      <BibleScheduleInner />
    </Suspense>
  );
}

function BibleScheduleInner() {
  const router = useRouter();
  const plan = getBiblePlan();
  const [currentDay, setCurrentDay] = useState(1);
  const [loading, setLoading] = useState(true);
  const activeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setLoading(false); return; }
      const { data: prog } = await supabase
        .from("bible365_progress")
        .select("day")
        .eq("user_id", user.id)
        .single();
      if (prog?.day) setCurrentDay(Math.min(Math.max(1, prog.day), 365));
      setLoading(false);
    });
  }, []);

  // Scroll to current day once loaded
  useEffect(() => {
    if (!loading && activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [loading]);

  function handleSelect(day: number) {
    router.push(`/bible-365?day=${day}`);
  }

  // Group days by month (roughly 30-31 days each)
  const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  function getMonth(day: number) {
    return Math.floor((day - 1) / 30.4167);
  }

  return (
    <SubscriptionGuard>
      <PageBackground url="https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/saud-edum-cgapZpzd7v0-unsplash%20(1).jpg">
        <main className="flex-1 p-6 pb-24 flex flex-col items-center">
          <div className="max-w-2xl w-full">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <Link href="/bible-365" className="text-white/70 text-sm hover:text-white transition">← Reader</Link>
              <h1
                className="text-lg font-bold text-white"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}
              >
                Reading Schedule
              </h1>
              <div className="w-16" />
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mb-6 text-xs text-white/50">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                Old Testament
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
                New Testament
              </span>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <p className="text-white/40 text-sm">Loading schedule…</p>
              </div>
            ) : (
              <div className="space-y-8">
                {MONTH_NAMES.map((monthName, monthIdx) => {
                  const monthDays = plan.filter(d => getMonth(d.day) === monthIdx);
                  if (!monthDays.length) return null;
                  return (
                    <div key={monthName}>
                      <p className="text-white/30 text-xs uppercase tracking-widest mb-3 pb-2 border-b border-white/10">
                        {monthName}
                      </p>
                      <div className="space-y-1">
                        {monthDays.map(reading => {
                          const isActive = reading.day === currentDay;
                          const isDone = reading.day < currentDay;
                          return (
                            <button
                              key={reading.day}
                              ref={isActive ? activeRef : null}
                              onClick={() => handleSelect(reading.day)}
                              className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-start gap-3 ${
                                isActive
                                  ? "bg-white/20 border border-white/40"
                                  : isDone
                                  ? "hover:bg-white/10 opacity-60"
                                  : "hover:bg-white/10"
                              }`}
                            >
                              {/* Day number */}
                              <span
                                className={`flex-shrink-0 text-xs font-bold w-8 pt-0.5 ${
                                  isActive ? "text-white" : isDone ? "text-white/40" : "text-white/40"
                                }`}
                              >
                                {reading.day}
                              </span>

                              {/* Reading labels */}
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm leading-snug ${isActive ? "text-white font-semibold" : isDone ? "text-white/50" : "text-white/80"}`}>
                                  <span className="text-amber-300/90">{reading.otLabel}</span>
                                  {reading.ntLabel && (
                                    <>
                                      <span className="text-white/30 mx-1">·</span>
                                      <span className="text-blue-300/90">{reading.ntLabel}</span>
                                    </>
                                  )}
                                </p>
                              </div>

                              {/* Status */}
                              <span className="flex-shrink-0 text-xs pt-0.5">
                                {isActive ? (
                                  <span className="text-white/80 font-semibold">← today</span>
                                ) : isDone ? (
                                  <span className="text-green-400/70">✓</span>
                                ) : null}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </PageBackground>
    </SubscriptionGuard>
  );
}
