"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import PageBackground from "@/components/PageBackground";
import { supabase } from "@/lib/supabase";

const BG = "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/Images%204/davide-ragusa-YjW8Qn85V6Y-unsplash.jpg";

export default function StudyGroupsPage() {
  const [groups, setGroups] = useState<any[]>([]);
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [inviteInput, setInviteInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);

  useEffect(() => { init(); }, []);

  async function init() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUserId(user.id);
    setUserName(user.user_metadata?.full_name || "Friend");
    await loadGroups(user.id);
    setLoading(false);
  }

  async function loadGroups(uid: string) {
    const { data } = await supabase
      .from("study_group_members")
      .select("study_groups(id, name, invite_code, created_by)")
      .eq("user_id", uid);
    if (data) setGroups(data.map((r: any) => r.study_groups).filter(Boolean));
  }

  async function handleCreate() {
    if (!groupName.trim() || !userId) return;
    setWorking(true);
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const { data: group } = await supabase
      .from("study_groups")
      .insert({ name: groupName.trim(), created_by: userId, invite_code: code })
      .select()
      .single();
    if (group) {
      await supabase.from("study_group_members").insert({
        group_id: group.id, user_id: userId, user_name: userName,
      });
      setGroupName(""); setCreating(false);
      await loadGroups(userId);
    }
    setWorking(false);
  }

  async function handleJoin() {
    if (!inviteInput.trim() || !userId) return;
    setWorking(true);
    const { data: group } = await supabase
      .from("study_groups")
      .select("id, name")
      .eq("invite_code", inviteInput.trim().toUpperCase())
      .single();
    if (!group) { alert("Group not found — check the invite code."); setWorking(false); return; }
    await supabase.from("study_group_members").upsert(
      { group_id: group.id, user_id: userId, user_name: userName },
      { onConflict: "group_id,user_id" }
    );
    setInviteInput(""); setJoining(false);
    await loadGroups(userId);
    setWorking(false);
  }

  return (
    <SubscriptionGuard>
      <PageBackground url={BG} overlayOpacity={0.72}>
        <main className="flex-1 p-6 pb-24 flex flex-col items-center">
          <div className="max-w-2xl w-full">

            <div className="flex justify-between items-center mb-8">
              <Link href="/dashboard" className="text-white/90 hover:text-white text-sm transition">← Back</Link>
              <h1 className="text-xl font-bold text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}>
                Study Groups
              </h1>
              <div className="w-16" />
            </div>

            <p className="text-white text-sm text-center mb-8 leading-relaxed" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>
              Study the Word together. Create a group for your church, small group, or friends — share answers and play Bible trivia together.
            </p>

            {/* Create / Join */}
            {!creating && !joining && (
              <div className="grid grid-cols-2 gap-3 mb-10">
                <button
                  onClick={() => setCreating(true)}
                  className="bg-white/20 hover:bg-white/30 border border-white/40 text-white font-semibold py-4 rounded-2xl transition text-sm"
                >
                  ✝️ Start a Group
                </button>
                <button
                  onClick={() => setJoining(true)}
                  className="bg-white/20 hover:bg-white/30 border border-white/40 text-white font-semibold py-4 rounded-2xl transition text-sm"
                >
                  🔑 Join a Group
                </button>
              </div>
            )}

            {/* Create form */}
            {creating && (
              <div className="bg-black/50 border border-white/30 rounded-2xl p-5 mb-8">
                <p className="text-white font-semibold mb-3" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>Name your group</p>
                <input
                  value={groupName}
                  onChange={e => setGroupName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleCreate()}
                  placeholder="e.g. Sunday Morning Women's Group"
                  className="w-full bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/60 text-sm focus:outline-none focus:border-white/60 mb-3"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleCreate}
                    disabled={!groupName.trim() || working}
                    className="flex-1 bg-white/25 hover:bg-white/35 border border-white/40 text-white font-semibold py-2.5 rounded-xl transition text-sm disabled:opacity-40"
                  >
                    {working ? "Creating..." : "Create Group"}
                  </button>
                  <button onClick={() => setCreating(false)} className="text-white/80 hover:text-white text-sm px-4 transition">Cancel</button>
                </div>
              </div>
            )}

            {/* Join form */}
            {joining && (
              <div className="bg-black/50 border border-white/30 rounded-2xl p-5 mb-8">
                <p className="text-white font-semibold mb-3" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>Enter invite code</p>
                <input
                  value={inviteInput}
                  onChange={e => setInviteInput(e.target.value.toUpperCase())}
                  onKeyDown={e => e.key === "Enter" && handleJoin()}
                  placeholder="e.g. ABC123"
                  className="w-full bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/60 text-sm focus:outline-none focus:border-white/60 mb-3 tracking-widest font-mono uppercase"
                  maxLength={8}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleJoin}
                    disabled={!inviteInput.trim() || working}
                    className="flex-1 bg-white/25 hover:bg-white/35 border border-white/40 text-white font-semibold py-2.5 rounded-xl transition text-sm disabled:opacity-40"
                  >
                    {working ? "Joining..." : "Join Group"}
                  </button>
                  <button onClick={() => setJoining(false)} className="text-white/80 hover:text-white text-sm px-4 transition">Cancel</button>
                </div>
              </div>
            )}

            {/* Groups list */}
            {loading ? (
              <p className="text-white text-sm text-center py-10" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>Loading your groups...</p>
            ) : groups.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-white text-sm" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>You haven't joined any groups yet.</p>
                <p className="text-white/80 text-xs mt-1" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>Create one or ask your group leader for an invite code.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-white/80 text-xs uppercase tracking-widest mb-4">Your Groups</p>
                {groups.map(g => (
                  <Link key={g.id} href={`/study-groups/${g.id}`}>
                    <div className="bg-black/40 hover:bg-black/50 border border-white/30 rounded-2xl px-5 py-4 flex items-center justify-between transition cursor-pointer">
                      <div>
                        <p className="text-white font-semibold text-sm" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>{g.name}</p>
                        <p className="text-white/70 text-xs mt-0.5 font-mono">{g.invite_code}</p>
                      </div>
                      <span className="text-white text-lg">›</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}

          </div>
        </main>
      </PageBackground>
    </SubscriptionGuard>
  );
}
