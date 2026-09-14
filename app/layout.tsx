import type { Metadata } from "next";
import { Inter, Playfair_Display, Prompt, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navigation/Navbar";
import TeaBarBackground from "@/components/decorations/TeaBarBackground";
import { LanguageProvider } from "@/context/LanguageContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

const prompt = Prompt({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "thai"],
  variable: "--font-thai",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-modern",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kissa Lab — Cozy Tea Brew & Extraction Profiler",
  description:
    "Blend specialty teas, tune extraction parameters, and discover your perfect cozy cup.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} ${prompt.variable} ${outfit.variable} antialiased bg-[#FBF8F3] min-h-screen text-[#1E1915] selection:bg-amber-200 selection:text-amber-900`}
      >
        <LanguageProvider>
          <TeaBarBackground />
          <Navbar />
          <main className="relative z-10 pt-4">
            {children}
          </main>
        </LanguageProvider>
      </body>
    </html>
  );
}
