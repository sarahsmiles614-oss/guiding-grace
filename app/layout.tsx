import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";

const inter = Inter({ subsets: ["latin"] });

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
    images: ["https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/Screenshot_20260407_160007_Chrome.jpg"],
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
        <link rel="apple-touch-icon" href="https://pkfaahfiqcedqblrcoqd.supabase.co/storage/v1/object/public/images/Screenshot_20260407_160007_Chrome.jpg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Guiding Grace" />
      </head>
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
