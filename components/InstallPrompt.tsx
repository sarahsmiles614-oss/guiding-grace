"use client";
import { useEffect, useState } from "react";

export default function InstallPrompt() {
  const [prompt, setPrompt] = useState<any>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if (dismissed) return;

    const handler = (e: any) => {
      e.preventDefault();
      setPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, [dismissed]);

  async function install() {
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") setPrompt(null);
  }

  if (!prompt || dismissed) return null;

  return (
    <div className="fixed bottom-6 left-4 right-4 z-50 flex items-center gap-3 bg-white/15 backdrop-blur-md border border-white/30 rounded-2xl px-4 py-3 shadow-2xl">
      <img src="/icon.jpg" alt="" className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-semibold leading-tight">Add to Home Screen</p>
        <p className="text-white/50 text-xs">Access Guiding Grace like an app</p>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <button onClick={() => setDismissed(true)} className="text-white/40 hover:text-white/70 text-xs px-2 py-1">
          Not now
        </button>
        <button onClick={install}
          className="bg-white/25 hover:bg-white/35 border border-white/30 text-white text-xs font-semibold px-4 py-2 rounded-xl transition">
          Install
        </button>
      </div>
    </div>
  );
}
