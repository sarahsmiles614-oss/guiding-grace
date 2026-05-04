"use client";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import PageBackground from "@/components/PageBackground";
import SubscriptionGuard from "@/components/SubscriptionGuard";

const BG = "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/rezaaskarii-sweden-6834164.jpg";

export default function ConnectionsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [connections, setConnections] = useState<any[]>([]);
  const [pending, setPending] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (uid: string) => {
    // Get or create invite code
    let { data: code } = await supabase.from("invite_codes").select("code").eq("user_id", uid).single();
    if (!code) {
      const { data: newCode } = await supabase.from("invite_codes").insert({ user_id: uid }).select("code").single();
      code = newCode;
    }
    if (code) setInviteCode(code.code);

    // Load accepted connections
    const { data: accepted } = await supabase
      .from("user_connections")
      .select("*")
      .or(`requester_id.eq.${uid},recipient_id.eq.${uid}`)
      .eq("status", "accepted");
    setConnections(accepted || []);

    // Load pending requests (received)
    const { data: pendingData } = await supabase
      .from("user_connections")
      .select("*")
      .eq("recipient_id", uid)
      .eq("status", "pending");
    setPending(pendingData || []);

    setLoading(false);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
        setUserName(user.user_metadata?.full_name || "Friend");
        load(user.id);
      }
    });
  }, [load]);

  async function acceptConnection(id: string) {
    await supabase.from("user_connections").update({ status: "accepted" }).eq("id", id);
    if (userId) load(userId);
  }

  async function declineConnection(id: string) {
    await supabase.from("user_connections").delete().eq("id", id);
    if (userId) load(userId);
  }

  async function removeConnection(id: string) {
    await supabase.from("user_connections").delete().eq("id", id);
    if (userId) load(userId);
  }

  const inviteUrl = `https://guidinggrace.app/join/${inviteCode}`;

  async function copyLink() {
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function shareOnFacebook() {
    const text = encodeURIComponent(`Join me on Guiding Grace — a daily faith companion with devotions, grace challenges, and a prayer community. Use my invite link:`);
    const url = encodeURIComponent(inviteUrl);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, "_blank");
  }

  function getOtherName(conn: any) {
    return userId === conn.requester_id ? conn.recipient_name : conn.requester_name;
  }

  return (
    <SubscriptionGuard>
      <PageBackground url={BG} overlayOpacity={0.45}>
        <main className="flex-1 p-6 pb-24 flex flex-col items-center">
          <div className="w-full max-w-lg">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <Link href="/dashboard" className="text-white/80 hover:text-white text-sm transition">← Home</Link>
              <h1 className="text-xl font-bold text-white" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>Grace Connections</h1>
              <Link href="/grace-notes" className="text-white/80 hover:text-white text-sm transition">Notes →</Link>
            </div>

            {/* Invite section */}
            <div className="bg-white/10 border border-white/20 rounded-2xl p-5 mb-6">
              <p className="text-white font-semibold text-sm mb-1" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>Invite a Friend</p>
              <p className="text-white/60 text-xs mb-4">Share your personal link — when they join through it, you're automatically connected.</p>

              <div className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white/70 text-xs mb-3 break-all">
                {inviteUrl}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={copyLink}
                  className="flex-1 bg-white/20 hover:bg-white/30 border border-white/20 text-white text-xs font-semibold py-2.5 rounded-xl transition"
                >
                  {copied ? "✓ Copied!" : "Copy Link"}
                </button>
                <button
                  onClick={shareOnFacebook}
                  className="flex-1 bg-blue-600/60 hover:bg-blue-600/80 border border-blue-400/30 text-white text-xs font-semibold py-2.5 rounded-xl transition"
                >
                  Share on Facebook
                </button>
              </div>
            </div>

            {/* Pending requests */}
            {pending.length > 0 && (
              <div className="mb-6">
                <p className="text-white/50 text-xs uppercase tracking-widest mb-3">Connection Requests</p>
                <div className="space-y-2">
                  {pending.map(p => (
                    <div key={p.id} className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3 flex items-center justify-between">
                      <p className="text-white text-sm">{p.requester_name || "A fellow believer"}</p>
                      <div className="flex gap-2">
                        <button onClick={() => acceptConnection(p.id)} className="bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition">Accept</button>
                        <button onClick={() => declineConnection(p.id)} className="text-white/40 hover:text-white/70 text-xs px-2 py-1.5 transition">Decline</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Connections list */}
            <div>
              <p className="text-white/50 text-xs uppercase tracking-widest mb-3">
                My Connections {connections.length > 0 && `· ${connections.length}`}
              </p>

              {loading ? (
                <p className="text-white/50 text-sm text-center py-8">Loading...</p>
              ) : connections.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-white/50 text-sm">No connections yet.</p>
                  <p className="text-white/30 text-xs mt-1">Share your invite link or connect with someone from the Grace Challenge.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {connections.map(conn => (
                    <div key={conn.id} className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3 flex items-center justify-between">
                      <p className="text-white text-sm">{getOtherName(conn) || "Fellow believer"}</p>
                      <div className="flex gap-3 items-center">
                        <Link href={`/grace-notes?to=${userId === conn.requester_id ? conn.recipient_id : conn.requester_id}`}
                          className="text-yellow-300 hover:text-yellow-200 text-xs font-semibold transition">
                          Send Note
                        </Link>
                        <button onClick={() => removeConnection(conn.id)} className="text-white/30 hover:text-red-300 text-xs transition">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </main>
      </PageBackground>
    </SubscriptionGuard>
  );
}
