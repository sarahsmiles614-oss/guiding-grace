import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

const inter = Inter({ subsets: ["latin"] });

const LOGO = "https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/Screenshot_20260407_144445_Chrome.jpg";

export const metadata: Metadata = {
  title: "Guiding Grace",
  description: "A daily faith companion for your spiritual journey",
  manifest: "/manifest.json",
  themeColor: "#1e0a3c",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Guiding Grace",
  },
  openGraph: {
    title: "Guiding Grace",
    description: "A daily faith companion for your spiritual journey",
    images: [LOGO],
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
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
