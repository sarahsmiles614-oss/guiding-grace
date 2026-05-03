import type { Metadata, Viewport } from "next";
import { Lora, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import InstallPrompt from "@/components/InstallPrompt";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";

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
  title: "Guiding Grace — Christian Devotional App | Daily Bible Devotions, Study Guide & Prayer",
  description: "A Christian devotional app with daily Bible devotions, Bible in a year reading plan, study guide, scripture match game, grace challenges, prayer wall, and nightly reflections. Your daily faith companion. Free 3-day trial.",
  manifest: "/manifest.json",
  metadataBase: new URL("https://guidinggrace.app"),
  keywords: [
    "Christian devotional app", "daily Bible devotions", "faith companion app",
    "daily devotions", "scripture promises", "prayer wall app", "Christian meditation app",
    "Bible verse of the day", "faith app", "Christian app", "grace challenge",
    "daily prayer", "Bible study app", "Christian women app", "devotional app",
    "nightly reflections", "prayer journal", "Christian lifestyle app",
    "Bible in a year", "Bible reading plan", "Bible study guide", "scripture matching game",
    "daily Bible reading plan", "Christian Bible app", "faith community app",
    "shame healing", "memorial wall", "heroes of the Bible", "Bible trivia",
    "Christian daily routine", "scripture memory", "Bible 365",
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Guiding Grace",
  },
  openGraph: {
    title: "Guiding Grace — Christian Devotional App | Daily Bible Devotions & Prayer",
    description: "A Christian devotional app with daily Bible devotions, scripture promises, a prayer wall, nightly reflections, and grace challenges. Free 3-day trial.",
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
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-S7Z1146JP3" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-S7Z1146JP3');
        `}} />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href={LOGO} />
        <link href="https://fonts.googleapis.com/css2?family=Agbalumo&family=Dancing+Script:wght@600&family=Cinzel:wght@400;600&family=Cormorant+Garamond:ital,wght@0,400;1,400;1,600&family=Josefin+Sans:wght@300;400&family=Pinyon+Script&family=EB+Garamond:ital,wght@0,400;1,400;1,600&family=Italiana&display=swap" rel="stylesheet" />
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
        <SpeedInsights />
      </body>
    </html>
  );
}
