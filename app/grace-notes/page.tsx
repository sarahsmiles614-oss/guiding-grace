"use client";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import PageBackground from "@/components/PageBackground";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import { Suspense } from "react";

const BG = "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/hoai-thu-pt-nv4FFbP8IuE-unsplash.jpg";

const NOTE_TYPES = [
  { value: "prayer", label: "🙏 Prayer", placeholder: "I'm lifting you up in prayer today..." },
  { value: "scripture", label: "📖 Scripture", placeholder: "This verse made me think of you..." },
  { value: "encouragement", label: "💛 Encouragement", placeholder: "I just wanted to encourage you..." },
];

function GraceNotesContent() {
  const searchParams = useSearchParams();
  const toId = searchParams.get("to");

  const [userId, setUserId] = useState<string | null>(null);
  const [tab, setTab] = useState<"inbox" | "sent">("inbox");
  const [inbox, setInbox] = useState<any[]>([]);
  const [sent, setSent] = useState<any[]>([]);
  const [connections, setConnections] = useState<any[]>([]);
  const [composeTo, setComposeTo] = useState(toId || "");
  const [noteType, setNoteType] = useState("encouragement");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [showCompose, setShowCompose] = useState(!!toId);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (uid: string) => {
    const [{ data: inboxData }, { data: sentData }, { data: connData }] = await Promise.all([
      supabase.from("grace_notes").select("*").eq("receiver_id", uid).order("created_at", { ascending: false }),
      supabase.from("grace_notes").select("*").eq("sender_id", uid).order("created_at", { ascending: false }),
      supabase.from("user_connections").select("*").or(`requester_id.eq.${uid},recipient_id.eq.${uid}`).eq("status", "accepted"),
    ]);
    setInbox(inboxData || []);
    setSent(sentData || []);
    setConnections(connData || []);

    // Mark inbox as read
    if (inboxData && inboxData.length > 0) {
      const unread = inboxData.filter(n => !n.read).map(n => n.id);
      if (unread.length > 0) {
        await supabase.from("grace_notes").update({ read: true }).in("id", unread);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) { setUserId(user.id); load(user.id); }
    });
  }, [load]);

  async function sendNote() {
    if (!message.trim() || !composeTo || !userId) return;
    setSending(true);
    await supabase.from("grace_notes").insert({
      sender_id: userId,
      receiver_id: composeTo,
      note_type: noteType,
      message: message.trim(),
    });
    setMessage("");
    setShowCompose(false);
    load(userId);
    setSending(false);
  }

  async function react(noteId: string, reaction: "heart" | "amen") {
    await supabase.from("grace_notes").update({ reaction }).eq("id", noteId);
    if (userId) load(userId);
  }

  const typeIcon = (t: string) => t === "prayer" ? "🙏" : t === "scripture" ? "📖" : "💛";
  const selectedType = NOTE_TYPES.find(t => t.value === noteType);

  function getOtherUserId(conn: any) {
    return userId === conn.requester_id ? conn.recipient_id : conn.requester_id;
  }
  function getOtherName(conn: any) {
    return userId === conn.requester_id ? conn.recipient_name : conn.requester_name;
  }

  return (
    <SubscriptionGuard>
      <PageBackground url={BG} overlayOpacity={0.5}>
        <main className="flex-1 p-6 pb-24 flex flex-col items-center">
          <div className="w-full max-w-lg">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <Link href="/connections" className="text-white/80 hover:text-white text-sm transition">← Connections</Link>
              <h1 className="text-xl font-bold text-white" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>Grace Notes</h1>
              <button onClick={() => setShowCompose(v => !v)} className="text-white/80 hover:text-white text-sm transition">
                {showCompose ? "Cancel" : "+ Send"}
              </button>
            </div>

            {/* Compose */}
            {showCompose && (
              <div className="bg-white/10 border border-white/20 rounded-2xl p-5 mb-6">
                <p className="text-white font-semibold text-sm mb-4" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>Send a Grace Note</p>

                {/* To */}
                <p className="text-white/50 text-xs uppercase tracking-widest mb-1">To</p>
                <select
                  value={composeTo}
                  onChange={e => setComposeTo(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-sm mb-4 focus:outline-none"
                >
                  <option value="">Select a connection...</option>
                  {connections.map(c => (
                    <option key={c.id} value={getOtherUserId(c)}>
                      {getOtherName(c) || "Fellow believer"}
                    </option>
                  ))}
                </select>

                {/* Type */}
                <p className="text-white/50 text-xs uppercase tracking-widest mb-2">Type</p>
                <div className="flex gap-2 mb-4">
                  {NOTE_TYPES.map(t => (
                    <button
                      key={t.value}
                      onClick={() => setNoteType(t.value)}
                      className={`flex-1 text-xs py-2 rounded-xl border transition font-semibold ${noteType === t.value ? "bg-white/25 border-white/40 text-white" : "bg-white/5 border-white/15 text-white/50"}`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Message */}
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder={selectedType?.placeholder}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 text-sm resize-none focus:outline-none focus:border-white/40 mb-4"
                  rows={4}
                />

                <button
                  onClick={sendNote}
                  disabled={!message.trim() || !composeTo || sending}
                  className="w-full bg-white/20 hover:bg-white/30 border border-white/20 text-white font-semibold text-sm py-3 rounded-xl transition disabled:opacity-40"
                >
                  {sending ? "Sending..." : "Send Grace Note 💛"}
                </button>
              </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 mb-5">
              {(["inbox", "sent"] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold transition border ${tab === t ? "bg-white/20 border-white/30 text-white" : "bg-white/5 border-white/10 text-white/50"}`}
                >
                  {t === "inbox" ? `Inbox ${inbox.filter(n => !n.read).length > 0 ? `(${inbox.filter(n => !n.read).length})` : ""}` : "Sent"}
                </button>
              ))}
            </div>

            {/* Notes list */}
            {loading ? (
              <p className="text-white/50 text-center py-10 text-sm">Loading...</p>
            ) : (
              <div className="space-y-3">
                {(tab === "inbox" ? inbox : sent).map(note => (
                  <div key={note.id} className={`bg-white/10 border rounded-2xl p-4 ${!note.read && tab === "inbox" ? "border-yellow-300/40" : "border-white/15"}`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-lg">{typeIcon(note.note_type)}</span>
                      <span className="text-white/30 text-[10px]">{new Date(note.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                    </div>
                    <p className="text-white text-sm leading-relaxed mb-3" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>{note.message}</p>

                    {/* Reaction — only for inbox */}
                    {tab === "inbox" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => react(note.id, "heart")}
                          className={`text-sm px-3 py-1.5 rounded-lg border transition ${note.reaction === "heart" ? "bg-yellow-400/20 border-yellow-300/40 text-yellow-200" : "bg-white/5 border-white/15 text-white/50 hover:text-white"}`}
                        >
                          💛 Amen
                        </button>
                        <button
                          onClick={() => react(note.id, "amen")}
                          className={`text-sm px-3 py-1.5 rounded-lg border transition ${note.reaction === "amen" ? "bg-white/20 border-white/30 text-white" : "bg-white/5 border-white/15 text-white/50 hover:text-white"}`}
                        >
                          🙏 Praying
                        </button>
                      </div>
                    )}
                    {tab === "sent" && note.reaction && (
                      <p className="text-white/40 text-xs mt-1">{note.reaction === "heart" ? "💛 They said amen" : "🙏 They're praying"}</p>
                    )}
                  </div>
                ))}
                {(tab === "inbox" ? inbox : sent).length === 0 && (
                  <p className="text-white/40 text-sm text-center py-10">
                    {tab === "inbox" ? "No notes yet. Your connections can send you a prayer, scripture, or encouragement." : "You haven't sent any notes yet."}
                  </p>
                )}
              </div>
            )}

          </div>
        </main>
      </PageBackground>
    </SubscriptionGuard>
  );
}

export default function GraceNotesPage() {
  return (
    <Suspense>
      <GraceNotesContent />
    </Suspense>
  );
}
