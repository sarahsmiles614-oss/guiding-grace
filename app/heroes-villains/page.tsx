"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import PageBackground from "@/components/PageBackground";
import { characters, Character } from "@/lib/heroes-villains";

type Filter = "all" | "hero" | "villain" | "both";

export default function HeroesVillainsPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("all");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selected, setSelected] = useState<Character | null>(null);
  const alphaRef = useRef<HTMLDivElement>(null);

  const allLetters = [...new Set(characters.map((c) => c.name[0].toUpperCase()))].sort();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (alphaRef.current && !alphaRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = characters.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filter === "all" || c.type === filter;
    const matchesLetter = selectedLetter === "all" || c.name[0].toUpperCase() === selectedLetter;
    return matchesSearch && matchesType && matchesLetter;
  });

  function handleSurpriseMe() {
    const random = characters[Math.floor(Math.random() * characters.length)];
    setSelected(random);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSelect(c: Character) {
    setSelected(c);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleBack() {
    setSelected(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function typeIcon(type: string) {
    if (type === "hero") return "🛡️";
    if (type === "villain") return "⚔️";
    return "⚖️";
  }

  return (
    <SubscriptionGuard>
      <PageBackground url="https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/glagolyvechnoyzhizni-goliath-8748113_1920.png" bgSize="contain" bgPosition="center top" bgColor="#0a0a1a">
        <main className="flex-1 p-6 flex flex-col items-center">
          <div className="max-w-6xl w-full">
            <div className="flex justify-between items-center mb-6">
              <Link href="/dashboard" className="text-white text-sm hover:text-amber-200">← Dashboard</Link>
              <h1
                className="text-3xl font-bold text-white"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 10px rgba(0,0,0,0.7)" }}
              >
                Heroes &amp; Villains
              </h1>
              <div className="w-24" />
            </div>

            {selected ? (
              /* Detail View */
              <div className="p-2">
                <button
                  onClick={handleBack}
                  className="text-white hover:text-amber-200 text-sm mb-6 flex items-center gap-1"
                >
                  ← Back to All Characters
                </button>

                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2
                        className="text-4xl font-bold text-white"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 8px rgba(0,0,0,0.7)" }}
                      >
                        {selected.name}
                      </h2>
                      {selected.era && (
                        <span className="px-3 py-1 bg-amber-500/30 border border-amber-400/40 rounded-full text-amber-200 text-xs font-semibold">
                          {selected.era}
                        </span>
                      )}
                    </div>
                    <p className="text-amber-200 text-lg font-semibold" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
                      {selected.title}
                    </p>
                  </div>
                  <span className="text-4xl">{typeIcon(selected.type)}</span>
                </div>

                {/* Story */}
                <div className="mb-8 space-y-4">
                  {selected.story.split("\n\n").map((para, i) => (
                    <p key={i} className="text-white text-base leading-relaxed" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>
                      {para}
                    </p>
                  ))}
                </div>

                {/* Did You Know */}
                {selected.didYouKnow && (
                  <div className="mb-6">
                    <h3 className="text-cyan-200 text-xs font-bold mb-2 uppercase tracking-wide" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}>✨ Did You Know?</h3>
                    <p className="text-white text-sm leading-relaxed italic" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
                      {selected.didYouKnow}
                    </p>
                  </div>
                )}

                {/* Key Verse */}
                <div className="mb-6">
                  <p
                    className="text-xl text-white italic mb-2 leading-relaxed"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}
                  >
                    &ldquo;{selected.keyVerse}&rdquo;
                  </p>
                  <p className="text-amber-200 font-semibold text-right text-sm" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
                    — {selected.keyVerseReference}
                  </p>
                </div>

                {/* Legacy */}
                <div className="mb-6">
                  <h3 className="text-white font-bold mb-2 uppercase tracking-wide text-sm" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
                    Legacy
                  </h3>
                  <p className="text-white text-base leading-relaxed" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
                    {selected.legacy}
                  </p>
                </div>

                {/* Reflection Question */}
                {selected.reflectionQuestion && (
                  <div className="mb-6">
                    <h3 className="text-rose-200 font-bold mb-2 text-sm" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}>💭 Reflection</h3>
                    <p className="text-white/90 text-base leading-relaxed italic" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
                      {selected.reflectionQuestion}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* Grid View */
              <>
                {/* Search */}
                <div className="mb-5">
                  <div className="relative max-w-xl mx-auto">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">🔍</span>
                    <input
                      type="text"
                      placeholder="Search characters by name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    />
                  </div>
                </div>

                {/* Surprise Me */}
                <div className="mb-5 text-center">
                  <button
                    onClick={handleSurpriseMe}
                    className="px-8 py-3 bg-gradient-to-r from-purple-500/40 to-pink-500/40 hover:from-purple-500/50 hover:to-pink-500/50 text-white backdrop-blur-sm text-base rounded-full transition"
                  >
                    ✨ Surprise Me
                  </button>
                </div>

                {/* Type Filter */}
                <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
                  {(["all", "hero", "villain", "both"] as Filter[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => { setFilter(f); setSelectedLetter("all"); }}
                      className={`px-5 py-2 rounded-full text-sm font-medium transition backdrop-blur-sm capitalize ${
                        filter === f ? "bg-white/30 text-white" : "bg-white/10 text-white/70 hover:bg-white/20"
                      }`}
                    >
                      {f === "all" ? "All Stories" : f === "both" ? "Complex" : f === "hero" ? "🛡️ Heroes" : "⚔️ Villains"}
                    </button>
                  ))}
                </div>

                {/* A-Z Index */}
                <div className="mb-6" ref={alphaRef}>
                  <p className="text-white/50 text-xs uppercase tracking-widest text-center mb-3">Browse by Name</p>
                  <div className="flex flex-wrap items-center justify-center gap-1.5">
                    <button
                      onClick={() => { setSelectedLetter("all"); setOpenDropdown(null); }}
                      className={`w-9 h-9 rounded-lg text-xs font-bold transition ${selectedLetter === "all" ? "bg-amber-500/50 text-white" : "bg-white/10 text-white/70 hover:bg-white/20"}`}
                    >
                      All
                    </button>
                    {allLetters.map((letter) => {
                      const letterChars = filtered.filter((c) => c.name[0].toUpperCase() === letter);
                      if (letterChars.length === 0 && filter !== "all" && selectedLetter !== letter) return null;
                      return (
                        <div key={letter} className="relative">
                          <button
                            onClick={() => setOpenDropdown(openDropdown === letter ? null : letter)}
                            className={`w-9 h-9 rounded-lg text-xs font-bold transition ${
                              openDropdown === letter ? "bg-amber-500/50 text-white scale-110" : "bg-white/10 text-white/70 hover:bg-white/20"
                            }`}
                          >
                            {letter}
                          </button>
                          {openDropdown === letter && letterChars.length > 0 && (
                            <div className="absolute top-11 left-1/2 -translate-x-1/2 z-50 bg-white/95 backdrop-blur-md rounded-lg shadow-2xl min-w-[200px] overflow-hidden">
                              {letterChars.map((c) => (
                                <button
                                  key={c.id}
                                  onClick={() => { handleSelect(c); setSelectedLetter(letter); setOpenDropdown(null); }}
                                  className="w-full px-4 py-3 text-left hover:bg-amber-500/20 transition flex items-center justify-between"
                                >
                                  <span className="font-semibold text-gray-800 text-sm">{c.name}</span>
                                  <span>{typeIcon(c.type)}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Character Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filtered.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleSelect(c)}
                      className="p-5 hover:opacity-80 transition text-left group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3
                            className="text-xl font-bold text-white group-hover:text-amber-200 transition mb-1"
                            style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 2px 6px rgba(0,0,0,0.7)" }}
                          >
                            {c.name}
                          </h3>
                          {c.era && (
                            <span className="inline-block px-2 py-0.5 bg-amber-500/30 border border-amber-400/40 rounded-full text-amber-200 text-xs font-semibold mb-1">
                              {c.era}
                            </span>
                          )}
                        </div>
                        <span className="text-2xl">{typeIcon(c.type)}</span>
                      </div>
                      <p className="text-amber-200 text-sm font-semibold mb-2" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
                        {c.title}
                      </p>
                      {c.summary && (
                        <p className="text-white text-xs leading-relaxed line-clamp-3" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>
                          {c.summary}
                        </p>
                      )}
                    </button>
                  ))}
                </div>

                {filtered.length === 0 && (
                  <p className="text-white/50 text-center mt-10">No characters found.</p>
                )}
              </>
            )}
          </div>
        </main>
      </PageBackground>
    </SubscriptionGuard>
  );
}
