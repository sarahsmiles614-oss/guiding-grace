"use client";
import { useState } from "react";

const BASE = "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/Screenshots/Screenshots/";

const screenshots = [
  { label: "Daily Devotions",       url: BASE + "Devotion.jpg" },
  { label: "Grace Challenge",       url: BASE + "Challenge.jpg" },
  { label: "His Promises",          url: BASE + "His%20promises.jpg" },
  { label: "Dive Deeper",           url: BASE + "Dive%20deeper.jpg" },
  { label: "Bible 365",             url: BASE + "Bible.jpg" },
  { label: "P.U.S.H. Prayer Wall",  url: BASE + "P.U.S.H%20prayer%20wall.jpg" },
  { label: "Heaven's Hearts",       url: BASE + "Heavens%20hearts.jpg" },
  { label: "Nightly Reflections",   url: BASE + "Nightly%20reflections.jpg" },
  { label: "Heroes & Villains",     url: BASE + "Heroes%20and%20villains.jpg" },
  { label: "Shame Recycle Bin",     url: BASE + "Shame%20bin.jpg" },
  { label: "Scripture Match",       url: BASE + "Scripture%20Game.jpg" },
  { label: "Study Groups",          url: BASE + "Study%20Group.jpg" },
];

export default function ScreenshotGallery() {
  const [open, setOpen] = useState<number | null>(null);

  function prev() {
    setOpen(i => i === null ? null : (i - 1 + screenshots.length) % screenshots.length);
  }
  function next() {
    setOpen(i => i === null ? null : (i + 1) % screenshots.length);
  }

  return (
    <>
      {/* Horizontal scroll row */}
      <div className="w-full overflow-x-auto pb-3" style={{ scrollbarWidth: "none" }}>
        <div className="flex gap-3 px-1" style={{ width: "max-content" }}>
          {screenshots.map((s, i) => (
            <button
              key={s.label}
              onClick={() => setOpen(i)}
              className="flex-shrink-0 rounded-2xl overflow-hidden border border-white/20 hover:border-white/50 transition-all hover:scale-[1.03] active:scale-[0.97] shadow-lg"
              style={{ width: 90, aspectRatio: "9/16", position: "relative" }}
            >
              <img src={s.url} alt={s.label} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute bottom-0 left-0 right-0 pb-2 px-1 text-center">
                <p className="text-white text-[8px] font-bold leading-tight" style={{ textShadow: "0 1px 4px rgba(0,0,0,1)" }}>
                  {s.label}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {open !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85"
          onClick={() => setOpen(null)}
        >
          <div
            className="relative rounded-3xl overflow-hidden shadow-2xl"
            style={{ width: "min(85vw, 340px)", aspectRatio: "9/16" }}
            onClick={e => e.stopPropagation()}
          >
            <img
              src={screenshots[open].url}
              alt={screenshots[open].label}
              className="w-full h-full object-cover"
            />

            {/* Prev / Next */}
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white text-xl flex items-center justify-center hover:bg-black/70 transition"
            >
              ‹
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white text-xl flex items-center justify-center hover:bg-black/70 transition"
            >
              ›
            </button>
          </div>

          {/* Close */}
          <button
            onClick={() => setOpen(null)}
            className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/15 text-white text-xl flex items-center justify-center hover:bg-white/30 transition"
          >
            ×
          </button>

          {/* Label + dots */}
          <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-2">
            <p className="text-white text-sm font-semibold" style={{ textShadow: "0 1px 6px rgba(0,0,0,1)" }}>
              {screenshots[open].label}
            </p>
            <div className="flex gap-1.5">
              {screenshots.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setOpen(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === open ? "bg-white scale-125" : "bg-white/40"}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
