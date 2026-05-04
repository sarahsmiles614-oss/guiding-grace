"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const features = [
  { label: "Daily Devotions",      href: "/daily" },
  { label: "Grace Challenge",      href: "/grace-challenge" },
  { label: "His Promises",         href: "/promises" },
  { label: "Dive Deeper",          href: "/dive-deeper" },
  { label: "Bible 365",            href: "/bible-365" },
  { label: "P.U.S.H. Prayer Wall", href: "/prayer-wall" },
  { label: "Heaven's Hearts",      href: "/heavens-hearts" },
  { label: "Nightly Reflections",  href: "/nightly-reflection" },
  { label: "Heroes & Villains",    href: "/heroes-villains" },
  { label: "Shame Recycle Bin",    href: "/shame-recycle" },
  { label: "Scripture Match",      href: "/scripture-match" },
  { label: "Study Groups",         href: "/study-groups" },
];

export default function NavMenu() {
  const [open, setOpen] = useState(false);
  const [androidPrompt, setAndroidPrompt] = useState<any>(null);
  const [isIos, setIsIos] = useState(false);
  const [showIosInstructions, setShowIosInstructions] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setShowIosInstructions(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
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

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex flex-col gap-1 p-2 rounded-lg hover:bg-white/10 transition"
        aria-label="Menu"
      >
        <span className="block w-5 h-0.5 bg-white rounded-full" />
        <span className="block w-5 h-0.5 bg-white rounded-full" />
        <span className="block w-5 h-0.5 bg-white rounded-full" />
      </button>

      {open && (
        <div className="absolute left-0 top-10 w-56 bg-black/80 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-2xl z-50">
          <div className="px-3 pt-3 pb-1">
            <p className="text-white/40 text-[10px] uppercase tracking-widest px-2 mb-1">Features</p>
            {features.map(f => (
              <Link key={f.href} href={f.href} onClick={() => setOpen(false)}>
                <div className="text-white text-xs py-2 px-2 rounded-lg hover:bg-white/10 transition">
                  {f.label}
                </div>
              </Link>
            ))}
          </div>

          <div className="border-t border-white/10 px-3 pt-2 pb-3">
            <p className="text-white/40 text-[10px] uppercase tracking-widest px-2 mb-1">Support</p>
            <Link href="/faq" onClick={() => setOpen(false)}>
              <div className="text-white text-xs py-2 px-2 rounded-lg hover:bg-white/10 transition">FAQ</div>
            </Link>
            <Link href="/contact" onClick={() => setOpen(false)}>
              <div className="text-white text-xs py-2 px-2 rounded-lg hover:bg-white/10 transition">Help & Contact</div>
            </Link>
            <Link href="/privacy" onClick={() => setOpen(false)}>
              <div className="text-white text-xs py-2 px-2 rounded-lg hover:bg-white/10 transition">Privacy Policy</div>
            </Link>
            <Link href="/terms" onClick={() => setOpen(false)}>
              <div className="text-white text-xs py-2 px-2 rounded-lg hover:bg-white/10 transition">Terms & Conditions</div>
            </Link>

            {!isStandalone && (androidPrompt || isIos) && (
              <>
                <button
                  onClick={handleInstall}
                  className="w-full text-left text-white text-xs py-2 px-2 rounded-lg hover:bg-white/10 transition"
                >
                  📲 Add to Home Screen
                </button>
                {showIosInstructions && (
                  <div className="mx-2 mt-1 mb-2 bg-white/10 rounded-xl px-3 py-2 text-white/70 text-[10px] leading-relaxed">
                    Tap <span className="font-bold">⎙ Share</span> then <span className="font-bold">"Add to Home Screen"</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
