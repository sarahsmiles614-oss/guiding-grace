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
        {/* Google Play */}
        <a
          href="https://play.google.com/store/apps/details?id=app.guidinggrace.twa"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-white/15 hover:bg-white/25 border border-white/25 text-white font-semibold py-3 px-4 rounded-xl transition"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M3.18 23.76c.3.17.64.24.98.2L15.7 12 12 8.29 3.18 23.76zm17.15-11.4L17.6 10.8 13.41 15l4.19 4.2 2.73-1.54a2.02 2.02 0 000-3.5zM2.1.54a2 2 0 00-.1.66v21.6c0 .23.04.45.1.66L13.41 12 2.1.54zm11.31 10.05L3.18.24C2.84.2 2.5.27 2.19.44L13.41 12l-.0-.41z"/></svg>
          Get it on Google Play
        </a>

        {/* PWA Install / Add to Home Screen */}
        <button
          onClick={handleInstall}
          className="flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold py-3 px-4 rounded-xl transition text-left"
        >
          <span className="text-xl">⊕</span>
          {isIos ? "Add to Home Screen (iPhone/iPad)" : "Install as App (Chrome / Edge)"}
        </button>

        {showIosInstructions && (
          <div className="bg-white/10 rounded-xl px-4 py-3 text-white/70 text-sm leading-relaxed">
            {isIos
              ? <>Tap <strong>⎙ Share</strong> at the bottom of Safari, then tap <strong>"Add to Home Screen"</strong></>
              : <>Tap your browser menu (⋮) and choose <strong>"Install App"</strong> or <strong>"Add to Home Screen"</strong></>
            }
          </div>
        )}
      </div>
    </div>
  );
}
