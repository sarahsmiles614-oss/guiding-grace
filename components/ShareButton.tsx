"use client";
import { useState } from "react";

interface Props {
  title?: string;
  text?: string;
  url?: string;
  label?: string;
  className?: string;
}

export default function ShareButton({
  title = "Guiding Grace",
  text = "Walk in grace every day — daily devotions, scripture, and faith challenges.",
  url = "https://guidinggrace.app",
  label = "Share",
  className = "",
}: Props) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch {
        // User cancelled or share failed — fall through to clipboard
      }
    }
    // Desktop (or share failed): copy to clipboard
    if (!navigator.share) {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch {
        // Clipboard blocked — use legacy execCommand fallback
        const el = document.createElement("textarea");
        el.value = url;
        el.style.position = "fixed";
        el.style.opacity = "0";
        document.body.appendChild(el);
        el.focus();
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    }
  }

  return (
    <button
      onClick={handleShare}
      className={className}
    >
      {copied ? "✓ Copied!" : label}
    </button>
  );
}
