"use client";
import { useEffect, useState } from "react";

export default function InstallPrompt() {
  const [androidPrompt, setAndroidPrompt] = useState<any>(null);
  const [showIos, setShowIos] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Already installed as standalone
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if (localStorage.getItem("install_dismissed")) return;

    // Android / Chrome — native prompt
    const handler = (e: any) => {
      e.preventDefault();
      setAndroidPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // iOS Safari detection
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isIos && isSafari) {
      // Delay slightly so it doesn't pop up immediately
      setTimeout(() => setShowIos(true), 3000);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function dismiss() {
    setDismissed(true);
    setAndroidPrompt(null);
    setShowIos(false);
    localStorage.setItem("install_dismissed", "1");
  }

  async function installAndroid() {
    if (!androidPrompt) return;
    androidPrompt.prompt();
    const { outcome } = await androidPrompt.userChoice;
    if (outcome === "accepted") setAndroidPrompt(null);
  }

  if (dismissed) return null;

  // Android install banner
  if (androidPrompt) {
    return (
      <div className="fixed bottom-6 left-4 right-4 z-50 flex items-center gap-3 bg-white/15 backdrop-blur-md border border-white/30 rounded-2xl px-4 py-3 shadow-2xl">
        <img src="/icon.jpg" alt="" className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold leading-tight">Add to Home Screen</p>
          <p className="text-white/60 text-xs">Access Guiding Grace like an app</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button onClick={dismiss} className="text-white/40 hover:text-white/70 text-xs px-2 py-1">Not now</button>
          <button onClick={installAndroid} className="bg-white/25 hover:bg-white/35 border border-white/30 text-white text-xs font-semibold px-4 py-2 rounded-xl transition">
            Install
          </button>
        </div>
      </div>
    );
  }

  // iOS instructions banner
  if (showIos) {
    return (
      <div className="fixed bottom-6 left-4 right-4 z-50 bg-white/15 backdrop-blur-md border border-white/30 rounded-2xl px-4 py-4 shadow-2xl">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <img src="/icon.jpg" alt="" className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
            <div>
              <p className="text-white text-sm font-semibold leading-tight">Add to Home Screen</p>
              <p className="text-white/60 text-xs">Get quick access to Guiding Grace</p>
            </div>
          </div>
          <button onClick={dismiss} className="text-white/40 hover:text-white/70 text-xs px-2 py-1 flex-shrink-0">✕</button>
        </div>
        <div className="flex items-center gap-2 text-white text-xs bg-white/10 rounded-xl px-3 py-2.5">
          <span>Tap</span>
          <span className="text-lg leading-none">⎙</span>
          <span className="font-semibold">Share</span>
          <span>→ then</span>
          <span className="font-semibold">"Add to Home Screen"</span>
        </div>
      </div>
    );
  }

  return null;
}
