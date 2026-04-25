"use client";
import { useState } from "react";

const BASE = "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/";

const BG_OPTIONS = [
  { label: "Cross",    url: BASE + "jeffjacobs1990-cross-3643027_1920.jpg" },
  { label: "Mountain", url: BASE + "julius_silver-lago-di-limides-3025780_1920.jpg" },
  { label: "Desert",   url: BASE + "saud-edum-cgapZpzd7v0-unsplash%20(1).jpg" },
  { label: "Sunset",   url: BASE + "mateus-campos-felipe-88D7C4c6en8-unsplash.jpg" },
  { label: "Heaven",   url: BASE + "geralt-heaven-3335585_1920.jpg" },
  { label: "Shore",    url: BASE + "lou-lou-b-photo-eD0TsB_E-pM-unsplash.jpg" },
  { label: "Light",    url: BASE + "gersweb-god-2012104.jpg" },
  { label: "Clouds",   url: BASE + "marcelkessler-heaven-4850411_1920.jpg" },
  { label: "Garden",   url: BASE + "daniel-gimbel-F194iNxMrDk-unsplash.jpg" },
];

const FONT_OPTIONS = [
  { label: "Classic", value: "classic", family: "'Playfair Display', Georgia, serif",     italic: true  },
  { label: "Modern",  value: "modern",  family: "system-ui, -apple-system, sans-serif",   italic: false },
  { label: "Grace",   value: "grace",   family: "'Dancing Script', cursive",               italic: false },
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
    // Fetch as blob to avoid canvas CORS taint
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

    // Cover-crop background
    const scale = Math.max(W / img.width, H / img.height);
    const sw = W / scale, sh = H / scale;
    const sx = (img.width - sw) / 2, sy = (img.height - sh) / 2;
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, W, H);

    // Dark gradient overlay
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0,   "rgba(0,0,0,0.25)");
    grad.addColorStop(0.4, "rgba(0,0,0,0.55)");
    grad.addColorStop(1,   "rgba(0,0,0,0.65)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Load font
    const fontFamily = selectedFont.family;
    try { await document.fonts.load(`${selectedFont.italic ? "italic " : ""}80px ${fontFamily}`); } catch {}

    // Scripture text
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

    // Reference
    ctx.shadowBlur = 16;
    ctx.font = `600 50px system-ui, -apple-system, sans-serif`;
    ctx.fillStyle = "#FDE68A";
    ctx.fillText(`\u2014 ${reference}`, W / 2, startY + textH + 90);

    // Watermark
    ctx.shadowBlur = 0;
    ctx.font = `400 34px system-ui, -apple-system, sans-serif`;
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.fillText("Guiding Grace", W / 2, H - 90);

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
    } catch (e: any) {
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
        // Fallback to download
        const link = document.createElement("a");
        link.download = "gods-promise.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      }
    } catch (e: any) {
      if (e?.name !== "AbortError") setError("Share failed. Image saved instead.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden">
      {/* Blurred background matching selected scene */}
      <div className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${selectedBg.url}')` }} />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

      <div className="relative z-10 flex flex-col h-full">

        {/* Header */}
        <div className="flex justify-between items-center px-6 pt-10 pb-4 flex-shrink-0">
          <p className="text-white font-semibold text-base tracking-wide"
            style={{ textShadow: "0 1px 8px rgba(0,0,0,0.8)" }}>
            Share Studio
          </p>
          <button onClick={onClose}
            className="text-white/60 hover:text-white text-xl w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition">
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 pb-4">

          {/* Card Preview */}
          <div className="mx-auto mb-7 rounded-3xl overflow-hidden shadow-2xl flex-shrink-0"
            style={{
              width: "min(260px, 72vw)",
              aspectRatio: "9/16",
              backgroundImage: `url('${selectedBg.url}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
            }}>
            <div className="absolute inset-0"
              style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.52) 40%, rgba(0,0,0,0.65) 100%)" }} />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
              <p className="text-white leading-relaxed mb-3"
                style={{
                  fontFamily: selectedFont.family,
                  fontStyle: selectedFont.italic ? "italic" : "normal",
                  fontSize: "clamp(12px, 3.8vw, 17px)",
                  textShadow: "0 2px 12px rgba(0,0,0,0.95)",
                }}>
                &ldquo;{scripture}&rdquo;
              </p>
              <p className="text-amber-200 font-semibold"
                style={{
                  fontSize: "clamp(10px, 2.8vw, 13px)",
                  textShadow: "0 1px 8px rgba(0,0,0,0.9)",
                }}>
                &mdash; {reference}
              </p>
            </div>
            <p className="absolute bottom-3 w-full text-center text-white/35"
              style={{ fontSize: "clamp(8px, 2vw, 10px)" }}>
              Guiding Grace
            </p>
          </div>

          {/* Background swatches */}
          <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Background</p>
          <div className="flex gap-3 overflow-x-auto pb-3 mb-6" style={{ scrollbarWidth: "none" }}>
            {BG_OPTIONS.map((bg) => (
              <button key={bg.label} onClick={() => setSelectedBg(bg)}
                className="flex-shrink-0 flex flex-col items-center gap-1.5">
                <div className={`w-14 h-14 rounded-2xl bg-cover bg-center transition duration-150 ${selectedBg.label === bg.label ? "ring-2 ring-white scale-110" : "opacity-60 hover:opacity-90"}`}
                  style={{ backgroundImage: `url('${bg.url}')` }} />
                <span className="text-white/50 text-xs">{bg.label}</span>
              </button>
            ))}
          </div>

          {/* Font swatches */}
          <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Font</p>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {FONT_OPTIONS.map((font) => (
              <button key={font.value} onClick={() => setSelectedFont(font)}
                className={`py-4 px-3 rounded-2xl border text-center transition ${selectedFont.value === font.value ? "border-white bg-white/20" : "border-white/15 bg-white/5 hover:bg-white/10"}`}>
                <p className="text-white text-lg mb-1 leading-none"
                  style={{ fontFamily: font.family, fontStyle: font.italic ? "italic" : "normal" }}>
                  Aa
                </p>
                <p className="text-white/55 text-xs">{font.label}</p>
              </button>
            ))}
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
