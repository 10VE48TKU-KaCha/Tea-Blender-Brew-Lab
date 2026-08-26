import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navigation/Navbar";
import TeaBarBackground from "@/components/decorations/TeaBarBackground";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Kissa Lab — Cozy Tea Brew & Extraction Profiler",
  description:
    "Blend specialty teas, tune extraction parameters, and discover your perfect cozy cup.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} antialiased bg-cream min-h-screen`}>
        <TeaBarBackground />
        <Navbar />
        <main className="relative z-10 pt-4">
          {children}
        </main>
      </body>
    </html>
  );
}
