import type { Metadata, Viewport } from "next";
import { Lora, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import InstallPrompt from "@/components/InstallPrompt";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const LOGO = "/icon.jpg";

export const viewport: Viewport = {
  themeColor: "#1e0a3c",
};

export const metadata: Metadata = {
  alternates: {
    canonical: "https://guidinggrace.app",
  },
  title: "Guiding Grace — Daily Devotions & Faith Companion",
  description: "Daily devotions, scripture promises, grace challenges, and sacred spaces to strengthen your faith. Start your free 3-day trial today.",
  manifest: "/manifest.json",
  metadataBase: new URL("https://guidinggrace.app"),
  keywords: ["daily devotions", "Christian app", "faith companion", "scripture", "grace challenge", "prayer", "Bible"],
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Guiding Grace",
  },
  openGraph: {
    title: "Guiding Grace — Daily Devotions & Faith Companion",
    description: "Daily devotions, scripture promises, grace challenges, and sacred spaces to strengthen your faith.",
    url: "https://guidinggrace.app",
    siteName: "Guiding Grace",
    images: [{ url: "/icon.jpg", width: 605, height: 589, alt: "Guiding Grace" }],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Guiding Grace — Daily Devotions & Faith Companion",
    description: "Daily devotions, scripture promises, and grace challenges to strengthen your faith.",
    images: ["/icon.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href={LOGO} />
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600&family=Cinzel:wght@400;600&family=Cormorant+Garamond:ital,wght@0,400;1,400;1,600&family=Josefin+Sans:wght@300;400&display=swap" rel="stylesheet" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Guiding Grace" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "url": "https://guidinggrace.app",
          "name": "Guiding Grace — Daily Devotions & Faith Companion",
          "inLanguage": "en",
          "description": "Daily devotions, scripture promises, grace challenges, and sacred spaces to strengthen your faith. Start your free 3-day trial today.",
          "isPartOf": {
            "@type": "WebSite",
            "url": "https://guidinggrace.app",
            "name": "Guiding Grace"
          }
        },
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          "url": "https://guidinggrace.app",
          "name": "Guiding Grace",
          "description": "Guiding Grace offers daily devotions, scripture promises, grace challenges, and sacred spaces to nurture your faith journey."
        },
        {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Daily Faith Companion",
          "description": "A daily faith companion featuring daily devotions, scripture promises, grace challenges, and sacred spaces to nurture your faith journey.",
          "areaServed": "Worldwide",
          "provider": {
            "@type": "Organization",
            "url": "https://guidinggrace.app",
            "name": "Guiding Grace"
          },
          "offers": {
            "@type": "Offer",
            "url": "https://guidinggrace.app",
            "price": "0",
            "priceCurrency": "USD",
            "description": "Start Free 3-Day Trial",
            "availability": "https://schema.org/InStock"
          }
        }
      ]) }} />
      </head>
      <body className={`${lora.variable} ${playfair.variable} font-body`}>
        <ServiceWorkerRegistration />
        <InstallPrompt />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
