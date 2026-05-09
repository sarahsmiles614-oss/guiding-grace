"use client";
import { useEffect, useState } from "react";

export default function AddToHomeButton() {
  const [androidPrompt, setAndroidPrompt] = useState<any>(null);
  const [isIos, setIsIos] = useState(false);
  const [showIosInstructions, setShowIosInstructions] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsStandalone(true);
      return;
    }

    const handler = (e: any) => { e.preventDefault(); setAndroidPrompt(e); };
    window.addEventListener("beforeinstallprompt", handler);

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (ios && safari) setIsIos(true);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstall() {
    if (androidPrompt) {
      androidPrompt.prompt();
      await androidPrompt.userChoice;
      setAndroidPrompt(null);
    } else if (isIos) {
      setShowIosInstructions(v => !v);
    }
  }

  if (isStandalone) return null;

  return (
    <div className="w-full text-center mt-4">
      <button
        onClick={handleInstall}
        className="inline-flex items-center gap-2 text-white/70 hover:text-white text-xs border border-white/20 hover:border-white/40 rounded-full px-4 py-2 transition"
      >
        <span>📲</span> Add to Home Screen
      </button>

      {showIosInstructions && (
        <div className="mt-3 bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white/80 text-xs leading-relaxed">
          Tap <span className="font-bold">⎙ Share</span> at the bottom of your browser, then tap <span className="font-bold">"Add to Home Screen"</span>
        </div>
      )}
    </div>
  );
}
