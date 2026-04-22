import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import InstallPrompt from "@/components/InstallPrompt";

const inter = Inter({ subsets: ["latin"] });

const LOGO = "/icon.jpg";

export const viewport: Viewport = {
  themeColor: "#1e0a3c",
};

export const metadata: Metadata = {
  title: "Guiding Grace — A Daily Faith Companion",
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
    title: "Guiding Grace — A Daily Faith Companion",
    description: "Daily devotions, scripture promises, grace challenges, and sacred spaces to strengthen your faith.",
    url: "https://guidinggrace.app",
    siteName: "Guiding Grace",
    images: [{ url: "/icon.jpg", width: 605, height: 589, alt: "Guiding Grace" }],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Guiding Grace — A Daily Faith Companion",
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
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Guiding Grace" />
      </head>
      <body className={inter.className}>
        <ServiceWorkerRegistration />
        <InstallPrompt />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
