"use client";
import { useState, useEffect } from "react";

export default function InstallBanner() {
  const [androidPrompt, setAndroidPrompt] = useState<any>(null);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIosInstructions, setShowIosInstructions] = useState(false);

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

  if (isStandalone) return null;

  async function handleInstall() {
    if (androidPrompt) {
      androidPrompt.prompt();
      await androidPrompt.userChoice;
      setAndroidPrompt(null);
    } else {
      setShowIosInstructions(v => !v);
    }
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 mb-8">
      <p className="text-white font-bold text-base mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
        📲 Get the App
      </p>
      <p className="text-white/60 text-sm mb-4">Install Guiding Grace on your device for the full experience — works on Android, iPhone, and desktop.</p>

      <div className="flex flex-col gap-3">
        <button
          onClick={handleInstall}
          className="flex items-center gap-3 bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold py-3 px-4 rounded-xl transition text-left"
        >
          <span className="text-xl">📲</span>
          {isIos ? "Add to Home Screen (iPhone/iPad)" : "Install App on Your Device"}
        </button>

        {showIosInstructions && (
          <div className="bg-white/10 rounded-xl px-4 py-3 text-white/70 text-sm leading-relaxed">
            {isIos
              ? <>Tap <strong>⎙ Share</strong> at the bottom of Safari, then tap <strong>"Add to Home Screen"</strong></>
              : <>Tap the <strong>three dots menu (⋮)</strong> in Chrome, then tap <strong>"Add to Home Screen"</strong> or <strong>"Install App"</strong></>
            }
          </div>
        )}

        {!showIosInstructions && (
          <p className="text-white/40 text-xs">
            {isIos
              ? "Opens in Safari — tap Share then Add to Home Screen"
              : "Works on Android and desktop Chrome or Edge"}
          </p>
        )}
      </div>
    </div>
  );
}
