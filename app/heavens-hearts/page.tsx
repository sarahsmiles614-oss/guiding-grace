"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import { supabase } from "@/lib/supabase";
import { HexColorPicker } from "react-colorful";
import ShareButton from "@/components/ShareButton";

interface Memorial {
  id: string;
  name: string;
  color: string;
  font_style: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
}

const fontStyles = [
  { name: "Elegant Serif", value: "Playfair Display" },
  { name: "Classic Script", value: "Dancing Script" },
  { name: "Modern Sans", value: "Inter" },
  { name: "Gentle Rounded", value: "Quicksand" },
  { name: "Ancient Biblical", value: "Cinzel" },
  { name: "Flowing Script", value: "Great Vibes" },
  { name: "Refined Serif", value: "Cormorant Garamond" },
  { name: "Casual Script", value: "Satisfy" },
  { name: "Old Manuscript", value: "IM Fell English" },
  { name: "Ornate Calligraphy", value: "Pinyon Script" },
  { name: "Delicate Script", value: "Petit Formal Script" },
  { name: "Stately Italic", value: "Italiana" },
  { name: "Royal Display", value: "Yeseva One" },
];

function fontFamily(fontValue: string) {
  return `'${fontValue}', Georgia, serif`;
}

const backgrounds = [
  { label: "Heaven", url: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/geralt-heaven-3335585_1920.jpg" },
  { label: "Sunset", url: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/mateus-campos-felipe-88D7C4c6en8-unsplash.jpg" },
  { label: "Shore", url: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/lou-lou-b-photo-eD0TsB_E-pM-unsplash.jpg" },
  { label: "Light", url: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/manuel-chinchilla-CMAM-ehX210-unsplash.jpg" },
  { label: "Clouds", url: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/marcelkessler-heaven-4850411_1920.jpg" },
  { label: "Desert", url: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/saud-edum-cgapZpzd7v0-unsplash%20(1).jpg" },
  { label: "Chapel", url: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/sign/Images%20also/chen-liu-kZH8X0q4Nvo-unsplash.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85MzA0YmFjMS1lYTk0LTQzODItYjE3YS1hNDU4OTgwZDllYTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJJbWFnZXMgYWxzby9jaGVuLWxpdS1rWkg4WDBxNE52by11bnNwbGFzaC5qcGciLCJpYXQiOjE3NzcwODA0NzEsImV4cCI6MTgwODYxNjQ3MX0.LPSTdNaD_gTJ0JWcoPVTQMvoIYWkf2P7-AaBTqk1uPo" },
  { label: "Cosmos", url: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/sign/Images%20also/nasa-hubble-space-telescope--n7IwXWxr8k-unsplash.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85MzA0YmFjMS1lYTk0LTQzODItYjE3YS1hNDU4OTgwZDllYTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJJbWFnZXMgYWxzby9uYXNhLWh1YmJsZS1zcGFjZS10ZWxlc2NvcGUtLW43SXdYV3hyOGstdW5zcGxhc2guanBnIiwiaWF0IjoxNzc3MDgwNjEwLCJleHAiOjE4MDg2MTY2MTB9.xGIUJV5ZXUOvaGTtlSs9CX6HpqSH7Sa8gtwSXB2GgAQ" },
  { label: "Nebula", url: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/sign/Images%20also/nasa-hubble-space-telescope-7zIfnzpxO4Q-unsplash.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85MzA0YmFjMS1lYTk0LTQzODItYjE3YS1hNDU4OTgwZDllYTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJJbWFnZXMgYWxzby9uYXNhLWh1YmJsZS1zcGFjZS10ZWxlc2NvcGUtN3pJZm56cHhPNFEtdW5zcGxhc2guanBnIiwiaWF0IjoxNzc3MDgwNzE2LCJleHAiOjE4NDI3NDQ3MTZ9.BCiquYEoRM_WHGLrc_QzK5Vbve7pcHlBd0l7bpIEAy4" },
  { label: "Galaxy", url: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/sign/Images%20also/nasa-hubble-space-telescope-Dk_7-4NyTKM-unsplash.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85MzA0YmFjMS1lYTk0LTQzODItYjE3YS1hNDU4OTgwZDllYTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJJbWFnZXMgYWxzby9uYXNhLWh1YmJsZS1zcGFjZS10ZWxlc2NvcGUtRGtfNy00TnlUS00tdW5zcGxhc2guanBnIiwiaWF0IjoxNzc3MDgxMDEwLCJleHAiOjE4NTQ4NDEwMTB9.X6ixbSXR3fxdRw5tIDLRsQfjiCWVLtiPS1kwUAbEHNI" },
  { label: "Lantern", url: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/Images%204/frank-mckenna-OD9EOzfSOh0-unsplash.jpg" },
  { label: "Candle", url: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/Images%204/diego-ph-Fxq2FXE5KWM-unsplash.jpg" },
  { label: "Dawn", url: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/Images%204/v2osk-JE01L3hB0GQ-unsplash.jpg" },
  { label: "Glow", url: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/Images%204/diego-ph-uzpIk7_Fbdo-unsplash.jpg" },
  { label: "Mist", url: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/Images%204/dewang-gupta-ESEnXckWlLY-unsplash.jpg" },
  { label: "Path", url: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/Images%204/clicker-babu-aKBtbbVP970-unsplash.jpg" },
  { label: "Dusk", url: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/Images5/kranich17-sunset-7504891_1920.jpg" },
  { label: "Sky", url: "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/Images5/kundennote_com-clouds-335969_1920.jpg" },
];

export default function HeavensHeartsPage() {
  const [memorials, setMemorials] = useState<Memorial[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#ff6b9d");
  const [selectedFont, setSelectedFont] = useState(fontStyles[0]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingNameId, setEditingNameId] = useState<string | null>(null);
  const [editingNameText, setEditingNameText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<"wall" | "backgrounds" | "howto">("wall");
  const canvasRef = useRef<HTMLDivElement>(null);
  const latestRef = useRef<{ x: number; y: number; size: number; rotation: number } | null>(null);

  // Load Google Fonts
  useEffect(() => {
    const fonts = ["Cinzel", "Great+Vibes", "Cormorant+Garamond", "Satisfy", "IM+Fell+English", "Dancing+Script", "Quicksand", "Pinyon+Script", "Petit+Formal+Script", "Italiana", "Yeseva+One"];
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?${fonts.map((f) => `family=${f}`).join("&")}&display=swap`;
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setUserId(user.id);
      loadMemorials(user.id);
    });
  }, []);

  async function loadMemorials(uid: string) {
    const { data } = await supabase
      .from("memorials")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });
    if (!data) return;

    const toSave: { id: string; x: number; y: number }[] = [];

    const mapped = data.map((m: Record<string, unknown>, index: number) => {
      const hasPos = typeof m.x === "number" && typeof m.y === "number";
      const col = index % 3;
      const row = Math.floor(index / 3);
      const x = hasPos ? (m.x as number) : 15 + col * 30 + Math.random() * 8;
      const y = hasPos ? (m.y as number) : 15 + row * 28 + Math.random() * 8;
      if (!hasPos) toSave.push({ id: m.id as string, x, y });
      return {
        id: m.id as string,
        name: m.name as string,
        color: (m.color as string) || "#ff6b9d",
        font_style: (m.font_style as string) || "Playfair Display",
        x,
        y,
        size: typeof m.size === "number" ? m.size : 1.0,
        rotation: typeof m.rotation === "number" ? m.rotation : 0,
      };
    });

    setMemorials(mapped);

    for (const { id, x, y } of toSave) {
      await supabase.from("memorials").update({ x, y }).eq("id", id);
    }
  }

  async function handleSpreadOut() {
    if (!userId || memorials.length === 0) return;
    const cols = Math.ceil(Math.sqrt(memorials.length));
    const updated = memorials.map((m, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const totalCols = cols;
      const totalRows = Math.ceil(memorials.length / cols);
      const x = 10 + (col / Math.max(totalCols - 1, 1)) * 80 + (Math.random() * 8 - 4);
      const y = 10 + (row / Math.max(totalRows - 1, 1)) * 80 + (Math.random() * 8 - 4);
      return { ...m, x: Math.max(5, Math.min(92, x)), y: Math.max(5, Math.min(92, y)) };
    });
    setMemorials(updated);
    for (const m of updated) {
      const { error } = await supabase.from("memorials").update({ x: m.x, y: m.y }).eq("id", m.id);
      if (error) console.error("Spread out save failed:", error.message);
    }
  }

  async function handleAdd() {
    if (!newName.trim() || !userId) return;
    // Place new names in a grid so they spread out instead of clustering
    const idx = memorials.length;
    const cols = 3;
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const x = Math.min(85, 12 + col * 30 + (Math.random() * 6 - 3));
    const y = Math.min(85, 12 + row * 22 + (Math.random() * 6 - 3));
    const { data, error } = await supabase
      .from("memorials")
      .insert({
        user_id: userId,
        name: newName.trim(),
        color: selectedColor,
        font_style: selectedFont.value,
        x,
        y,
        size: 1.0,
        rotation: 0,
      })
      .select()
      .single();
    if (!error && data) {
      setMemorials((prev) => [
        ...prev,
        { id: data.id, name: data.name, color: selectedColor, font_style: selectedFont.value, x, y, size: 1.0, rotation: 0 },
      ]);
      setNewName("");
      setIsAdding(false);
    }
  }

  async function updateMemorial(id: string, updates: Partial<Memorial>) {
    setMemorials((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
    const { error } = await supabase.from("memorials").update(updates).eq("id", id);
    if (error) console.error("Memorial update failed:", error.message, updates);
  }

  async function handleRemove(id: string) {
    await supabase.from("memorials").delete().eq("id", id);
    setMemorials((prev) => prev.filter((m) => m.id !== id));
  }

  async function handleRenameSave(id: string) {
    const trimmed = editingNameText.trim();
    if (!trimmed) return;
    setMemorials((prev) => prev.map((m) => m.id === id ? { ...m, name: trimmed } : m));
    setEditingNameId(null);
    await supabase.from("memorials").update({ name: trimmed }).eq("id", id);
  }

  async function handleSaveImage() {
    if (saving || memorials.length === 0) return;
    setSaving(true);
    try {
      const W = 1080, H = 1080;
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d")!;

      // Draw background
      await new Promise<void>((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => { ctx.drawImage(img, 0, 0, W, H); resolve(); };
        img.onerror = () => {
          ctx.fillStyle = "#fff0f5";
          ctx.fillRect(0, 0, W, H);
          resolve();
        };
        img.src = backgrounds[bgIndex].url;
      });

      // Dim overlay
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.fillRect(0, 0, W, H);

      // Draw each name
      for (const m of memorials) {
        ctx.save();
        const cx = (m.x / 100) * W;
        const cy = (m.y / 100) * H;
        ctx.translate(cx, cy);
        ctx.rotate((m.rotation * Math.PI) / 180);
        ctx.scale(m.size, m.size);
        const fontSize = Math.round(52);
        ctx.font = `${fontSize}px '${m.font_style}', Georgia, serif`;
        ctx.fillStyle = m.color;
        ctx.shadowColor = "rgba(0,0,0,0.25)";
        ctx.shadowBlur = 8;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(m.name, 0, 0);
        ctx.restore();
      }

      // Watermark
      ctx.font = "500 28px system-ui";
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.textAlign = "center";
      ctx.shadowBlur = 0;
      ctx.fillText("Heaven's Hearts · Guiding Grace", W / 2, H - 40);

      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "heavens-hearts.png";
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error("Save image failed:", e);
      alert("Couldn't save the image. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function handleMouseDown(e: React.MouseEvent, id: string, action: "drag" | "resize" | "rotate") {
    e.stopPropagation();
    setSelectedId(id);
    if (action === "drag") setIsDragging(true);
    if (action === "resize") setIsResizing(true);
    if (action === "rotate") setIsRotating(true);

    const memorial = memorials.find((m) => m.id === id);
    if (!memorial || !canvasRef.current) return;

    const canvas = canvasRef.current.getBoundingClientRect();
    const startX = e.clientX;
    const startSize = memorial.size;
    latestRef.current = { x: memorial.x, y: memorial.y, size: memorial.size, rotation: memorial.rotation };

    function onMove(ev: MouseEvent) {
      if (action === "drag") {
        const x = Math.max(0, Math.min(95, ((ev.clientX - canvas.left) / canvas.width) * 100));
        const y = Math.max(0, Math.min(95, ((ev.clientY - canvas.top) / canvas.height) * 100));
        latestRef.current = { ...latestRef.current!, x, y };
        setMemorials((prev) => prev.map((m) => (m.id === id ? { ...m, x, y } : m)));
      } else if (action === "resize") {
        const newSize = Math.max(0.5, Math.min(3, startSize + (ev.clientX - startX) * 0.01));
        latestRef.current = { ...latestRef.current!, size: newSize };
        setMemorials((prev) => prev.map((m) => (m.id === id ? { ...m, size: newSize } : m)));
      } else if (action === "rotate") {
        const cx = canvas.left + (latestRef.current!.x / 100) * canvas.width;
        const cy = canvas.top + (latestRef.current!.y / 100) * canvas.height;
        const angle = Math.atan2(ev.clientY - cy, ev.clientX - cx) * (180 / Math.PI);
        latestRef.current = { ...latestRef.current!, rotation: angle };
        setMemorials((prev) => prev.map((m) => (m.id === id ? { ...m, rotation: angle } : m)));
      }
    }

    function onUp() {
      if (latestRef.current) {
        const updates: Partial<Memorial> =
          action === "drag" ? { x: latestRef.current.x, y: latestRef.current.y }
          : action === "resize" ? { size: latestRef.current.size }
          : { rotation: latestRef.current.rotation };
        updateMemorial(id, updates);
      }
      latestRef.current = null;
      setIsDragging(false); setIsResizing(false); setIsRotating(false);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    }

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }

  function handleTouchStart(e: React.TouchEvent, id: string, action: "drag" | "resize" | "rotate") {
    e.stopPropagation();
    setSelectedId(id);
    if (action === "drag") setIsDragging(true);
    if (action === "resize") setIsResizing(true);
    if (action === "rotate") setIsRotating(true);

    const memorial = memorials.find((m) => m.id === id);
    if (!memorial || !canvasRef.current) return;

    const canvas = canvasRef.current.getBoundingClientRect();
    const startX = e.touches[0].clientX;
    const startSize = memorial.size;
    latestRef.current = { x: memorial.x, y: memorial.y, size: memorial.size, rotation: memorial.rotation };

    function onMove(ev: TouchEvent) {
      const touch = ev.touches[0];
      if (!touch) return;
      if (action === "drag") {
        const x = Math.max(0, Math.min(95, ((touch.clientX - canvas.left) / canvas.width) * 100));
        const y = Math.max(0, Math.min(95, ((touch.clientY - canvas.top) / canvas.height) * 100));
        latestRef.current = { ...latestRef.current!, x, y };
        setMemorials((prev) => prev.map((m) => (m.id === id ? { ...m, x, y } : m)));
      } else if (action === "resize") {
        const newSize = Math.max(0.5, Math.min(3, startSize + (touch.clientX - startX) * 0.01));
        latestRef.current = { ...latestRef.current!, size: newSize };
        setMemorials((prev) => prev.map((m) => (m.id === id ? { ...m, size: newSize } : m)));
      } else if (action === "rotate") {
        const cx = canvas.left + (latestRef.current!.x / 100) * canvas.width;
        const cy = canvas.top + (latestRef.current!.y / 100) * canvas.height;
        const angle = Math.atan2(touch.clientY - cy, touch.clientX - cx) * (180 / Math.PI);
        latestRef.current = { ...latestRef.current!, rotation: angle };
        setMemorials((prev) => prev.map((m) => (m.id === id ? { ...m, rotation: angle } : m)));
      }
    }

    function onEnd() {
      if (latestRef.current) {
        const updates: Partial<Memorial> =
          action === "drag" ? { x: latestRef.current.x, y: latestRef.current.y }
          : action === "resize" ? { size: latestRef.current.size }
          : { rotation: latestRef.current.rotation };
        updateMemorial(id, updates);
      }
      latestRef.current = null;
      setIsDragging(false); setIsResizing(false); setIsRotating(false);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onEnd);
    }

    document.addEventListener("touchmove", onMove);
    document.addEventListener("touchend", onEnd);
  }

  return (
    <SubscriptionGuard>
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .hh-no-print { display: none !important; }
          .hh-print-list { display: none !important; }
          .hh-canvas { min-height: auto !important; }
          .hh-bg-img { display: block !important; }
        }
        .hh-print-list { display: none; }
        .hh-bg-img { display: none; }
      `}} />
      <div
        className="min-h-screen bg-cover bg-center bg-fixed relative"
        style={{ backgroundImage: `url('${backgrounds[bgIndex].url}')` }}
      >
        {/* Print-only background image — CSS backgrounds don't print, img tags do */}
        <img
          src={backgrounds[bgIndex].url}
          alt=""
          className="hh-bg-img fixed inset-0 w-full h-full object-cover -z-10"
          style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: -1 }}
        />
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-10">
          {/* Compact header */}
          <header className="hh-no-print py-3 px-4">
            <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
              <Link href="/dashboard" className="text-rose-800 text-sm hover:text-rose-600 shrink-0">← Home</Link>
              <h1
                className="text-xl font-bold text-rose-900 shrink-0"
                style={{ fontFamily: fontFamily("Playfair Display"), textShadow: "0 1px 4px rgba(255,255,255,0.8)" }}
              >
                Heaven&apos;s Hearts
              </h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveImage}
                  disabled={saving || memorials.length === 0}
                  title="Save as image"
                  className="text-rose-800 hover:text-rose-600 text-sm px-1.5 py-1 rounded hover:bg-white/40 transition disabled:opacity-40"
                >
                  {saving ? "..." : "💾"}
                </button>
                <ShareButton
                  title="Heaven's Hearts"
                  text="I created a memorial wall for my loved ones on Guiding Grace."
                  url="https://guidinggrace.app/heavens-hearts"
                  label="↑"
                  className="text-rose-800 hover:text-rose-600 text-sm px-1.5 py-1 rounded hover:bg-white/40 transition"
                />
                <button
                  onClick={() => window.print()}
                  title="Print"
                  className="text-rose-800 hover:text-rose-600 text-sm px-1.5 py-1 rounded hover:bg-white/40 transition"
                >
                  🖨️
                </button>
              </div>
            </div>
          </header>

          <div className="max-w-5xl mx-auto px-4 pb-12">

            {/* Tabs */}
            <div className="hh-no-print flex gap-2 mb-6">
              {([
                { id: "wall", label: "💜 My Wall" },
                { id: "backgrounds", label: "🌄 Backgrounds" },
                { id: "howto", label: "📖 How to Use" },
              ] as const).map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition ${tab === t.id ? "bg-white/80 border-rose-400 text-rose-900 shadow" : "bg-white/30 border-white/50 text-rose-800 hover:bg-white/50"}`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Backgrounds tab */}
            {tab === "backgrounds" && (
              <div className="hh-no-print bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-xl mb-6">
                <p className="text-rose-900 font-semibold mb-4" style={{ fontFamily: fontFamily("Playfair Display") }}>Choose Your Scene</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {backgrounds.map((bg, i) => (
                    <button
                      key={i}
                      onClick={() => { setBgIndex(i); setTab("wall"); }}
                      className="flex flex-col items-center gap-1.5 group"
                    >
                      <div
                        className={`w-full rounded-xl bg-cover bg-center transition duration-150 ${bgIndex === i ? "ring-2 ring-rose-500 ring-offset-1 scale-105 shadow-lg" : "opacity-90 hover:opacity-100"}`}
                        style={{ backgroundImage: `url('${bg.url}')`, aspectRatio: "1/1" }}
                      />
                      <span className={`text-xs font-medium transition ${bgIndex === i ? "text-rose-800 font-semibold" : "text-rose-700"}`}>
                        {bg.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* How to Use tab */}
            {tab === "howto" && (
              <div className="hh-no-print bg-white/85 backdrop-blur-sm rounded-2xl p-6 shadow-xl mb-6">
                <h2 className="text-xl font-bold text-rose-900 mb-5" style={{ fontFamily: fontFamily("Playfair Display") }}>How to Use Heaven&apos;s Hearts</h2>
                <div className="space-y-4 text-rose-900 text-sm leading-relaxed">
                  <div className="flex gap-3">
                    <span className="text-2xl shrink-0">➕</span>
                    <div>
                      <p className="font-semibold mb-1">Add a Loved One</p>
                      <p className="text-rose-700">Tap <strong>+ Add a Loved One</strong> on the Wall tab. Type their name, choose a color with the color picker, and select a font style. A live preview shows how their name will look. Tap <strong>Add to Wall</strong> to place them.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-2xl shrink-0">👆</span>
                    <div>
                      <p className="font-semibold mb-1">Select & Move</p>
                      <p className="text-rose-700">Tap any name on the wall to select it. Once selected, drag it freely to reposition. Use <strong>Spread Out</strong> to automatically arrange all names evenly.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-2xl shrink-0">↔</span>
                    <div>
                      <p className="font-semibold mb-1">Resize</p>
                      <p className="text-rose-700">When a name is selected, drag the blue <strong>↔ Size</strong> handle left or right to make it smaller or larger.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-2xl shrink-0">↻</span>
                    <div>
                      <p className="font-semibold mb-1">Rotate</p>
                      <p className="text-rose-700">Drag the purple <strong>↻ Rotate</strong> handle to spin the name at any angle.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-2xl shrink-0">✏️</span>
                    <div>
                      <p className="font-semibold mb-1">Rename or Remove</p>
                      <p className="text-rose-700">Select a name and tap <strong>Rename</strong> to edit it, or <strong>🗑 Remove</strong> to delete it from the wall.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-2xl shrink-0">🌄</span>
                    <div>
                      <p className="font-semibold mb-1">Change the Background</p>
                      <p className="text-rose-700">Go to the <strong>Backgrounds</strong> tab to choose from heaven, nature, space, and more scenes. Tapping a scene switches the background and returns you to your wall.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-2xl shrink-0">💾</span>
                    <div>
                      <p className="font-semibold mb-1">Save & Share</p>
                      <p className="text-rose-700">Tap <strong>💾</strong> in the top right to save your wall as an image. Tap <strong>↑</strong> to share it with family. Tap <strong>🖨️</strong> to print.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Wall tab content */}
            {tab === "wall" && (
            <>
            {/* Add Button */}
            {!isAdding && (
              <div className="hh-no-print text-center mb-6 flex items-center justify-center gap-3">
                <button
                  onClick={() => setIsAdding(true)}
                  className="px-8 py-3 text-base bg-white/90 hover:bg-white text-rose-900 shadow-xl backdrop-blur-sm font-semibold rounded-xl"
                >
                  + Add a Loved One
                </button>
                {memorials.length > 0 && (
                  <button
                    onClick={handleSpreadOut}
                    className="px-5 py-3 text-sm bg-white/80 hover:bg-white text-rose-700 shadow-xl backdrop-blur-sm font-medium rounded-xl"
                  >
                    Spread Out
                  </button>
                )}
              </div>
            )}

            {/* Add Form */}
            {isAdding && (
              <div className="hh-no-print p-7 mb-6 bg-white/90 backdrop-blur-sm border border-white/60 shadow-xl rounded-2xl">
                <h3 className="text-xl font-semibold text-rose-900 mb-5" style={{ fontFamily: fontFamily("Playfair Display") }}>
                  Add to Heaven&apos;s Hearts
                </h3>

                <div className="mb-5">
                  <label className="block text-rose-800 font-medium mb-2 text-sm">Their name</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g., Grandma Rose"
                    className="w-full px-4 py-3 rounded-lg border-2 border-rose-200 focus:border-rose-400 outline-none text-rose-900"
                  />
                </div>

                {/* Color Picker */}
                <div className="mb-5">
                  <label className="block text-rose-800 font-medium mb-2 text-sm">🎨 Choose a Color</label>
                  <div className="p-6 bg-gradient-to-br from-rose-100 to-pink-100 rounded-2xl border-2 border-rose-300">
                    <div className="flex flex-col items-center gap-4">
                      <div className="bg-white p-3 rounded-xl shadow">
                        <HexColorPicker color={selectedColor} onChange={setSelectedColor} style={{ width: 240, height: 240 }} />
                      </div>
                      <div className="flex items-center gap-3 bg-white/90 px-5 py-3 rounded-lg">
                        <div className="w-10 h-10 rounded-lg border-2 border-rose-300" style={{ backgroundColor: selectedColor }} />
                        <span className="text-rose-900 font-bold">{selectedColor}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Font Selection */}
                <div className="mb-6">
                  <label className="block text-rose-800 font-medium mb-2 text-sm">Choose a Font Style</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {fontStyles.map((font) => (
                      <button
                        key={font.name}
                        onClick={() => setSelectedFont(font)}
                        className={`p-3 rounded-lg border-2 transition ${selectedFont.name === font.name ? "border-rose-600 bg-rose-50" : "border-rose-200 bg-white hover:border-rose-300"}`}
                      >
                        <span className="text-base text-rose-900" style={{ fontFamily: fontFamily(font.value) }}>{font.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div className="mb-5 p-5 rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200">
                  <p className="text-xs text-rose-600 uppercase tracking-wide mb-2 font-semibold">Preview</p>
                  <div className="inline-block px-5 py-3 rounded-lg shadow" style={{ backgroundColor: selectedColor }}>
                    <p className="text-2xl text-white drop-shadow" style={{ fontFamily: fontFamily(selectedFont.value) }}>
                      {newName || "Your Loved One's Name"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAdd}
                    disabled={!newName.trim()}
                    className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl disabled:opacity-50"
                  >
                    Add to Wall
                  </button>
                  <button
                    onClick={() => { setIsAdding(false); setNewName(""); }}
                    className="px-6 py-3 border-2 border-rose-300 text-rose-700 hover:bg-rose-50 rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Canvas Wall */}
            {memorials.length > 0 ? (
              <div>
                {/* Print-only title */}
                <div className="hh-print-list">
                  <h2 style={{ fontFamily: fontFamily("Playfair Display"), fontSize: 28, color: "#881337", marginBottom: 8 }}>
                    Heaven&apos;s Hearts — In Loving Memory
                  </h2>
                  <p style={{ color: "#9f1239", marginBottom: 16, fontSize: 14 }}>{new Date().toLocaleDateString()}</p>
                  {memorials.map(m => (
                    <p key={m.id} style={{ fontFamily: fontFamily(m.font_style), color: m.color, fontSize: 24, marginBottom: 8 }}>
                      💜 {m.name}
                    </p>
                  ))}
                </div>

                <div
                  ref={canvasRef}
                  onClick={() => setSelectedId(null)}
                  className="hh-canvas relative"
                  style={{ minHeight: 600, touchAction: isDragging || isResizing || isRotating ? "none" : "auto" }}
                >
                  {memorials.map((m) => {
                    const sel = selectedId === m.id;
                    return (
                      <div
                        key={m.id}
                        onClick={(e) => { e.stopPropagation(); setSelectedId(m.id); }}
                        onMouseDown={(e) => handleMouseDown(e, m.id, "drag")}
                        onTouchStart={(e) => handleTouchStart(e, m.id, "drag")}
                        className="absolute cursor-move select-none"
                        style={{
                          left: `${m.x}%`,
                          top: `${m.y}%`,
                          transform: `translate(-50%, -50%) scale(${m.size}) rotate(${m.rotation}deg)`,
                          transformOrigin: "center",
                          transition: isDragging || isResizing || isRotating ? "none" : "transform 0.1s ease",
                          touchAction: "none",
                        }}
                      >
                        {editingNameId === m.id ? (
                          <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                            <input
                              autoFocus
                              value={editingNameText}
                              onChange={e => setEditingNameText(e.target.value)}
                              onKeyDown={e => { if (e.key === "Enter") handleRenameSave(m.id); if (e.key === "Escape") setEditingNameId(null); }}
                              className="bg-white/90 text-rose-900 font-semibold text-xl px-3 py-1 rounded-lg border-2 border-rose-400 outline-none"
                              style={{ fontFamily: fontFamily(m.font_style) }}
                            />
                            <button onClick={() => handleRenameSave(m.id)} className="bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">Save</button>
                            <button onClick={() => setEditingNameId(null)} className="bg-white/80 text-rose-700 text-xs font-bold px-3 py-1.5 rounded-full shadow">Cancel</button>
                          </div>
                        ) : (
                          <p
                            className="text-4xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] whitespace-nowrap"
                            style={{ fontFamily: fontFamily(m.font_style), color: m.color }}
                          >
                            {m.name}
                          </p>
                        )}

                        {sel && (
                          <>
                            {/* Dashed selection border */}
                            <div
                              className="absolute inset-0 border-2 border-dashed border-rose-400 rounded pointer-events-none"
                              style={{ transform: `rotate(-${m.rotation}deg)`, margin: "-10px" }}
                            />

                            {/* Edit name & Delete */}
                            <div className="absolute -top-10 left-1/2 flex gap-2 z-10 whitespace-nowrap"
                              style={{ transform: `translateX(-50%) rotate(-${m.rotation}deg)` }}>
                              <button
                                onClick={(e) => { e.stopPropagation(); setEditingNameId(m.id); setEditingNameText(m.name); }}
                                className="bg-white/95 hover:bg-white text-rose-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg"
                              >
                                Rename
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleRemove(m.id); }}
                                className="bg-white/95 hover:bg-white text-rose-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg"
                              >
                                🗑 Remove
                              </button>
                            </div>

                            {/* Resize — bottom right */}
                            <div
                              onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, m.id, "resize"); }}
                              onTouchStart={(e) => { e.stopPropagation(); handleTouchStart(e, m.id, "resize"); }}
                              className="absolute -bottom-10 -right-10 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg cursor-nwse-resize z-10 whitespace-nowrap select-none"
                              style={{ transform: `rotate(-${m.rotation}deg)`, touchAction: "none" }}
                            >
                              ↔ Size
                            </div>

                            {/* Rotate — bottom left */}
                            <div
                              onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, m.id, "rotate"); }}
                              onTouchStart={(e) => { e.stopPropagation(); handleTouchStart(e, m.id, "rotate"); }}
                              className="absolute -bottom-10 -left-10 bg-purple-500 hover:bg-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg cursor-grab active:cursor-grabbing z-10 whitespace-nowrap select-none"
                              style={{ transform: `rotate(-${m.rotation}deg)`, touchAction: "none" }}
                            >
                              ↻ Rotate
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
                <p className="hh-no-print text-center text-rose-800/70 text-xs mt-3" style={{ textShadow: "0 1px 2px rgba(255,255,255,0.6)" }}>
                  Tap a name to select · drag to move · drag ↔ Size left/right to resize · drag ↻ Rotate to spin
                </p>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">💜</div>
                <p className="text-rose-800" style={{ textShadow: "0 1px 2px rgba(255,255,255,0.6)" }}>
                  Your memorial wall is empty. Add a loved one to begin.
                </p>
              </div>
            )}
            </>
            )}
          </div>
        </div>
      </div>
    </SubscriptionGuard>
  );
}
