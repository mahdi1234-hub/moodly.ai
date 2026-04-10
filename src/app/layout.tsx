import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Watermark } from "@/components/Watermark";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Together — AI Presentation Maker for Professional Slides & Decks",
  description: "Together is the modern AI presentation software for creating professional, interactive decks your audience will remember.",
  openGraph: {
    title: "Together — AI Presentation Maker",
    description: "Create high quality, AI presentations with Together.",
    url: "https://moodlyai.vercel.app",
    siteName: "Together by Moodly",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans">
        {children}
        <Watermark />
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
