"use client";
import Link from "next/link";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import PageBackground from "@/components/PageBackground";

const rules = [
  {
    icon: "☀️",
    title: "A New Challenge Every Day",
    body: "Each morning a fresh act-of-grace challenge drops — inspired by the daily scripture devotion. Challenges are about giving grace, doing grace, or accepting grace in real life.",
  },
  {
    icon: "✍️",
    title: "Share Your Response",
    body: "Write a short story about how you took on the challenge — or share why you chose not to. Both count. Honesty is grace too. All entries can be voted on.",
  },
  {
    icon: "💛",
    title: "3 Hearts to Give",
    body: "Every day you receive 3 hearts to award to other players' responses. You can't vote for yourself. You can change your votes as many times as you want until the 7am EST deadline.",
  },
  {
    icon: "🔖",
    title: "Save Favorites While You Decide",
    body: "Bookmark responses you're considering voting for. Revisit your Favorites page to make your final decisions before the deadline.",
  },
  {
    icon: "⚠️",
    title: "Use All 3 or Forfeit",
    body: "You must give all 3 of your hearts to receive any votes others gave you. If you don't use all 3, your received votes are forfeited. You can still vote even if you didn't submit a response.",
  },
  {
    icon: "✏️",
    title: "Editing Forfeits Your Votes",
    body: "You can edit your entry at any time before the 7am EST deadline — but doing so will erase all votes you've received so far. Your entry re-enters the running and any new votes will count fresh.",
  },
  {
    icon: "🔒",
    title: "Anonymous Until 7am EST",
    body: "Voting is completely anonymous. You can't see how many hearts your entry has received until the deadline. Results are revealed every morning at 7am Eastern time.",
  },
  {
    icon: "🏆",
    title: "Most Loved Award",
    body: "After 7am EST, the community votes are tallied. The entry with the most valid hearts is declared Most Loved. A banner celebrates the winner: \"Your community has voted — you have earned the Most Loved award for Guiding Grace.\"",
  },
  {
    icon: "📊",
    title: "Leaderboard",
    body: "The leaderboard tracks daily winners, weekly totals, and all-time hearts earned. Your lifetime heart count appears in parentheses next to your name for as long as your subscription is active — a permanent badge of grace.",
  },
  {
    icon: "∞",
    title: "All-Time Hearts",
    body: "Your total hearts accumulate forever but don't affect daily or weekly winners. They're simply a visible record of the grace your community has recognized in you.",
  },
];

export default function RulesPage() {
  return (
    <SubscriptionGuard>
      <PageBackground url="https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/renegossner-alps-8728621_1920.jpg">
        <main className="flex-1 p-6 pb-16">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <Link href="/grace-challenge" className="text-white/70 text-sm">← Challenge</Link>
              <h1 className="text-lg font-bold text-white" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>How It Works</h1>
              <div className="w-16" />
            </div>

            <p className="text-white/60 text-sm text-center mb-8 leading-relaxed">
              The Grace Challenge is a daily community practice of living out grace — in small, real, meaningful ways.
            </p>

            <div className="space-y-4">
              {rules.map((rule, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5">
                  <div className="flex items-start gap-4">
                    <span className="text-2xl mt-0.5 flex-shrink-0">{rule.icon}</span>
                    <div>
                      <p className="text-white font-semibold mb-1" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.7)" }}>{rule.title}</p>
                      <p className="text-white/65 text-sm leading-relaxed">{rule.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link href="/grace-challenge">
                <button className="bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold px-8 py-3 rounded-xl backdrop-blur-sm transition">
                  Back to Today's Challenge
                </button>
              </Link>
            </div>
          </div>
        </main>
      </PageBackground>
    </SubscriptionGuard>
  );
}
