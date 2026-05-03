"use client";
import { useState } from "react";

const BASE = "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/";

const BG_OPTIONS = [
  { label: "Cross",     url: BASE + "jeffjacobs1990-cross-3643027_1920.jpg" },
  { label: "Mountain",  url: BASE + "julius_silver-lago-di-limides-3025780_1920.jpg" },
  { label: "Desert",    url: BASE + "saud-edum-cgapZpzd7v0-unsplash%20(1).jpg" },
  { label: "Sunset",    url: BASE + "mateus-campos-felipe-88D7C4c6en8-unsplash.jpg" },
  { label: "Heaven",    url: BASE + "geralt-heaven-3335585_1920.jpg" },
  { label: "Shore",     url: BASE + "lou-lou-b-photo-eD0TsB_E-pM-unsplash.jpg" },
  { label: "Light",     url: BASE + "gersweb-god-2012104.jpg" },
  { label: "Clouds",    url: BASE + "marcelkessler-heaven-4850411_1920.jpg" },
  { label: "Garden",    url: BASE + "daniel-gimbel-F194iNxMrDk-unsplash.jpg" },
  { label: "Forest",    url: BASE + "hoai-thu-pt-nv4FFbP8IuE-unsplash.jpg" },
  { label: "Radiance",  url: BASE + "manuel-chinchilla-CMAM-ehX210-unsplash.jpg" },
  { label: "Dawn",      url: BASE + "11703009-web-4063635_1920.jpg" },
  { label: "Starlight", url: BASE + "rezaaskarii-sweden-6834164.jpg" },
  { label: "Rainbow",   url: BASE + "edenmoon-rainbow-5145675_1920.jpg" },
  { label: "Beach",     url: BASE + "faserra-beach-1578966_1920.jpg" },
  { label: "Alps",      url: BASE + "renegossner-alps-8728621_1920.jpg" },
  { label: "Lily",      url: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/sign/Images%20also/neal-kharawala-7Ya57A74BTA-unsplash.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85MzA0YmFjMS1lYTk0LTQzODItYjE3YS1hNDU4OTgwZDllYTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJJbWFnZXMgYWxzby9uZWFsLWtoYXJhd2FsYS03WWE1N0E3NEJUQS11bnNwbGFzaC5qcGciLCJpYXQiOjE3NzcwODUzMzAsImV4cCI6MTg1NDg0NTMzMH0.t_ShILODG-vUchzhmftNeHElXU3P4UF7sEU6WPElpXQ" },
  { label: "Wheat",     url: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/sign/Images%20also/thibault-mokuenko-pY-bhzf_ZDk-unsplash.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85MzA0YmFjMS1lYTk0LTQzODItYjE3YS1hNDU4OTgwZDllYTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJJbWFnZXMgYWxzby90aGliYXVsdC1tb2t1ZW5rby1wWS1iaHpmX1pEay11bnNwbGFzaC5qcGciLCJpYXQiOjE3NzcwODU0MjMsImV4cCI6MTg1NDg0NTQyM30.pyRROLomZi4S8_Gu7aVOheZJexH5vsyWF2CTG4ryhHw" },
  { label: "Meadow",    url: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/sign/Images%20also/trent-bradley-xSv6JausA8A-unsplash.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85MzA0YmFjMS1lYTk0LTQzODItYjE3YS1hNDU4OTgwZDllYTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJJbWFnZXMgYWxzby90cmVudC1icmFkbGV5LXhTdjZKYXVzQThBLXVuc3BsYXNoLmpwZyIsImlhdCI6MTc3NzA4NTU1MiwiZXhwIjoxODU0ODQ1NTUyfQ.qmAusrHLhbV4NtU-wv8BWHw68wkbTgguXVStgTTCIIQ" },
  { label: "Bloom",     url: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/sign/Images%20also/josie-weiss-9VhNkv7Y5l0-unsplash.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85MzA0YmFjMS1lYTk0LTQzODItYjE3YS1hNDU4OTgwZDllYTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJJbWFnZXMgYWxzby9qb3NpZS13ZWlzcy05VmhOa3Y3WTVsMC11bnNwbGFzaC5qcGciLCJpYXQiOjE3NzcwODU2NjYsImV4cCI6MTg1NDg0NTY2Nn0.eepYKgoj9zbQULW2ZdJQr80JsFr9ek8bToBKtXNpKEw" },
  { label: "Spirit",    url: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/alex-lehner-YHGZEAHiCKk-unsplash.jpg" },
  { label: "Dove",      url: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/sign/Images%20also/hugh-whyte-Zv6F1LALn2I-unsplash.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85MzA0YmFjMS1lYTk0LTQzODItYjE3YS1hNDU4OTgwZDllYTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJJbWFnZXMgYWxzby9odWdoLXdoeXRlLVp2NkYxTEFMbjJJLXVuc3BsYXNoLmpwZyIsImlhdCI6MTc3NzM2MDI0NCwiZXhwIjoxODYzNzYwMjQ0fQ.wc94K-1pwwZD8MFc9oar7LZITmIJ34Iau6dPL9dLggU" },
  { label: "Praise",    url: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/sign/Images%20also/karthik-sreenivas-MqDlQ_WdawI-unsplash.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85MzA0YmFjMS1lYTk0LTQzODItYjE3YS1hNDU4OTgwZDllYTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJJbWFnZXMgYWxzby9rYXJ0aGlrLXNyZWVuaXZhcy1NcURsUV9XZGF3SS11bnNwbGFzaC5qcGciLCJpYXQiOjE3NzczNjAzNDMsImV4cCI6MTg2Mzc2MDM0M30.kJDySxrhxAeJnOMYRLGVCwqoEmcyzGDHJGDnpcUmPTo" },
  { label: "Glory",     url: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/sign/Images%20also/luis-dominguez-HJGtZUWm8tY-unsplash.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85MzA0YmFjMS1lYTk0LTQzODItYjE3YS1hNDU4OTgwZDllYTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJJbWFnZXMgYWxzby9sdWlzLWRvbWluZ3Vlei1ISkd0WlVXbTh0WS11bnNwbGFzaC5qcGciLCJpYXQiOjE3NzczNjA0MDksImV4cCI6MTg2Mzc2MDQwOX0.dcfV92es6G8Ni1aV3rr2r36hIL4edoIsAMoLeo31x6M" },
  { label: "Grace",     url: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/sign/Images%20also/othmane-ferrah-TD8E27ud_gk-unsplash.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85MzA0YmFjMS1lYTk0LTQzODItYjE3YS1hNDU4OTgwZDllYTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJJbWFnZXMgYWxzby9vdGhtYW5lLWZlcnJhaC1URDhFMjd1ZF9nay11bnNwbGFzaC5qcGciLCJpYXQiOjE3NzczNjA1MDAsImV4cCI6MTg2Mzc2MDUwMH0.-awDDhL4HAWoJtVasNEM_EBjv0rRZ0itTPMl_c5bP3w" },
  { label: "Gather",    url: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/Images%204/davide-ragusa-YjW8Qn85V6Y-unsplash.jpg" },
  { label: "Journey",   url: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/Images%204/clicker-babu-aKBtbbVP970-unsplash.jpg" },
  { label: "Peaks",     url: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/Images5/giani-mountains-100367_1920.jpg" },
  { label: "Dawn",      url: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/Images%204/v2osk-JE01L3hB0GQ-unsplash.jpg" },
  { label: "Path",      url: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/Images%204/clicker-babu-aKBtbbVP970-unsplash.jpg" },
  { label: "Horizon",   url: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/Images5/12019-sunset-2080072_1920.jpg" },
  { label: "Falls",     url: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/Images5/20twenty-waterfalls-5607946_1920.jpg" },
  { label: "Winter",    url: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/Images5/alainaudet-winter-landscape-2995987_1920.jpg" },
  { label: "Jungle",    url: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/Images5/alan_frijns-jungle-7459821_1920.jpg" },
  { label: "Sparkle",   url: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/Images5/bessi-new-year-background-736885_1920.jpg" },
  { label: "Dusk",      url: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/Images5/cleverpix-sunset-1373171_1920.jpg" },
  { label: "Tree",      url: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/Images5/geralt-tree-94198_1920.jpg" },
  { label: "Sloth",     url: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/Images5/jkdvmim-brown-throated-sloth-6859493_1920.jpg" },
  { label: "Sea",       url: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/Images5/jodydelldavis-sea-205717_1920.jpg" },
  { label: "Ember",     url: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/Images5/ralph_rybak-sunset-290434_1920.jpg" },
  { label: "Blaze",     url: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/Images5/sorbyphoto-sunset-850873_1920.jpg" },
  { label: "Frost",     url: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/Images5/sorbyphoto-winter-5892335_1920.jpg" },
  { label: "Lake",      url: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/Images5/tommarc-lake-696098_1920.jpg" },
];

const FONT_OPTIONS = [
  { label: "Classic",  value: "classic",  family: "'Playfair Display', Georgia, serif",     italic: true  },
  { label: "Modern",   value: "modern",   family: "'Josefin Sans', system-ui, sans-serif",  italic: false },
  { label: "Grace",    value: "grace",    family: "'Dancing Script', cursive",               italic: false },
  { label: "Regal",    value: "regal",    family: "'Cinzel', Georgia, serif",                italic: false },
  { label: "Elegant",  value: "elegant",  family: "'Cormorant Garamond', Georgia, serif",    italic: true  },
  { label: "Lora",     value: "lora",     family: "'Lora', Georgia, serif",                  italic: true  },
  { label: "Pinyon",   value: "pinyon",   family: "'Pinyon Script', cursive",                 italic: false },
  { label: "Garamond", value: "garamond", family: "'EB Garamond', Georgia, serif",             italic: true  },
  { label: "Italiana", value: "italiana", family: "'Italiana', Georgia, serif",                italic: false },
];

interface Props {
  scripture: string;
  reference: string;
  onClose: () => void;
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export default function ShareStudio({ scripture, reference, onClose }: Props) {
  const [selectedBg, setSelectedBg] = useState(BG_OPTIONS[0]);
  const [selectedFont, setSelectedFont] = useState(FONT_OPTIONS[0]);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  async function generateCanvas(): Promise<HTMLCanvasElement> {
    const resp = await fetch(selectedBg.url);
    const blob = await resp.blob();
    const objectUrl = URL.createObjectURL(blob);

    const img = new Image();
    img.src = objectUrl;
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Image load failed"));
    });
    URL.revokeObjectURL(objectUrl);

    const W = 1080, H = 1920;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;

    const scale = Math.max(W / img.width, H / img.height);
    const sw = W / scale, sh = H / scale;
    const sx = (img.width - sw) / 2, sy = (img.height - sh) / 2;
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, W, H);

    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0,   "rgba(0,0,0,0.25)");
    grad.addColorStop(0.4, "rgba(0,0,0,0.55)");
    grad.addColorStop(1,   "rgba(0,0,0,0.65)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    const fontFamily = selectedFont.family;
    try { await document.fonts.load(`${selectedFont.italic ? "italic " : ""}80px ${fontFamily}`); } catch {}

    const verseSize = 76;
    ctx.font = `${selectedFont.italic ? "italic " : ""}${verseSize}px ${fontFamily}`;
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.shadowColor = "rgba(0,0,0,0.85)";
    ctx.shadowBlur = 24;

    const maxW = W * 0.8;
    const lines = wrapText(ctx, `\u201C${scripture}\u201D`, maxW);
    const lineH = verseSize * 1.55;
    const textH = lines.length * lineH;
    const startY = (H - textH) / 2 - 40;
    lines.forEach((line, i) => ctx.fillText(line, W / 2, startY + i * lineH));

    ctx.shadowBlur = 16;
    ctx.font = `600 50px system-ui, -apple-system, sans-serif`;
    ctx.fillStyle = "#FDE68A";
    ctx.fillText(`\u2014 ${reference}`, W / 2, startY + textH + 90);

    ctx.shadowBlur = 0;
    ctx.font = `600 36px system-ui, -apple-system, sans-serif`;
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.fillText("Guiding Grace", W / 2, H - 110);
    ctx.font = `400 28px system-ui, -apple-system, sans-serif`;
    ctx.fillStyle = "rgba(255,255,255,0.30)";
    ctx.fillText("guidinggrace.app · find your promise", W / 2, H - 58);

    return canvas;
  }

  async function handleSave() {
    setGenerating(true);
    setError("");
    try {
      const canvas = await generateCanvas();
      const link = document.createElement("a");
      link.download = "gods-promise.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      setError("Couldn't generate image. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  async function handleShare() {
    setGenerating(true);
    setError("");
    try {
      const canvas = await generateCanvas();
      const blob = await new Promise<Blob>((res) => canvas.toBlob(b => res(b!), "image/png"));
      const file = new File([blob], "gods-promise.png", { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "God's Promise", text: `"${scripture}" — ${reference}` });
      } else {
        const link = document.createElement("a");
        link.download = "gods-promise.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      }
    } catch (e: any) {
      if (e?.name !== "AbortError") setError("Share failed. Try Save Image instead.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center transition-all duration-500"
        style={{ backgroundImage: `url('${selectedBg.url}')` }} />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

      <div className="relative z-10 flex flex-col h-full">

        {/* Header */}
        <div className="flex justify-between items-center px-6 pt-10 pb-2 flex-shrink-0">
          <div>
            <p className="text-white font-semibold text-base" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.8)" }}>
              Share Studio
            </p>
            <p className="text-white/45 text-xs mt-0.5">Customize your verse card</p>
          </div>
          <button onClick={onClose}
            className="text-white/60 hover:text-white text-lg w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition">
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 pb-4">

          {/* Card Preview */}
          <div className="mx-auto my-5 rounded-3xl overflow-hidden shadow-2xl"
            style={{
              width: "min(240px, 65vw)",
              aspectRatio: "9/16",
              backgroundImage: `url('${selectedBg.url}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
              transition: "background-image 0.3s ease",
            }}>
            <div className="absolute inset-0"
              style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.52) 40%, rgba(0,0,0,0.65) 100%)" }} />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
              <p className="text-white leading-relaxed mb-3"
                style={{
                  fontFamily: selectedFont.family,
                  fontStyle: selectedFont.italic ? "italic" : "normal",
                  fontSize: "clamp(11px, 3.5vw, 16px)",
                  textShadow: "0 2px 12px rgba(0,0,0,0.95)",
                }}>
                &ldquo;{scripture}&rdquo;
              </p>
              <p className="text-amber-200 font-semibold"
                style={{ fontSize: "clamp(10px, 2.6vw, 13px)", textShadow: "0 1px 8px rgba(0,0,0,0.9)" }}>
                &mdash; {reference}
              </p>
            </div>
            <div className="absolute bottom-3 w-full text-center">
              <p className="text-white/55 font-semibold" style={{ fontSize: "clamp(8px, 1.8vw, 10px)" }}>Guiding Grace</p>
              <p className="text-white/30" style={{ fontSize: "clamp(6px, 1.4vw, 8px)" }}>guidinggrace.app · find your promise</p>
            </div>
          </div>

          {/* Background section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-white text-sm font-semibold" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
                🌄 Choose Your Scene
              </p>
              <p className="text-white/40 text-xs">Tap any image</p>
            </div>
            <div className="grid grid-cols-4 gap-2.5">
              {BG_OPTIONS.map((bg) => (
                <button key={bg.label} onClick={() => setSelectedBg(bg)}
                  className="flex flex-col items-center gap-1.5 group">
                  <div
                    className={`w-full rounded-2xl bg-cover bg-center transition duration-150 ${selectedBg.label === bg.label ? "ring-2 ring-white ring-offset-1 ring-offset-transparent scale-105" : "opacity-55 hover:opacity-90 group-hover:scale-102"}`}
                    style={{ backgroundImage: `url('${bg.url}')`, aspectRatio: "1/1" }}
                  />
                  <span className={`text-xs transition ${selectedBg.label === bg.label ? "text-white font-semibold" : "text-white/45"}`}>
                    {bg.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Font section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-white text-sm font-semibold" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
                ✍️ Font Style
              </p>
              <p className="text-white/40 text-xs">Tap to change</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {FONT_OPTIONS.map((font) => (
                <button key={font.value} onClick={() => setSelectedFont(font)}
                  className={`py-4 px-3 rounded-2xl border text-center transition ${selectedFont.value === font.value ? "border-white bg-white/20" : "border-white/15 bg-white/5 hover:bg-white/10"}`}>
                  <p className="text-white text-xl mb-1 leading-none"
                    style={{ fontFamily: font.family, fontStyle: font.italic ? "italic" : "normal" }}>
                    Aa
                  </p>
                  <p className={`text-xs transition ${selectedFont.value === font.value ? "text-white font-semibold" : "text-white/50"}`}>
                    {font.label}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-red-300 text-xs text-center mb-3">{error}</p>
          )}

        </div>

        {/* Action buttons */}
        <div className="px-6 pb-12 pt-3 flex gap-3 flex-shrink-0">
          <button onClick={handleSave} disabled={generating}
            className="flex-1 py-4 bg-white/12 hover:bg-white/20 border border-white/25 text-white font-semibold rounded-2xl transition disabled:opacity-40 text-sm">
            {generating ? "Generating…" : "⬇ Save Image"}
          </button>
          <button onClick={handleShare} disabled={generating}
            className="flex-1 py-4 bg-white text-gray-900 font-bold rounded-2xl transition hover:bg-white/90 disabled:opacity-40 text-sm">
            {generating ? "…" : "↗ Share"}
          </button>
        </div>

      </div>
    </div>
  );
}
