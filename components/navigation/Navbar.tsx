"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Beaker, BookOpen, Sparkles, Languages, Menu, X, CloudRain, Flame, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { KissaLogo } from "@/components/ui/KissaLogo";
import { startAmbientRain, stopAmbientRain, startFireplace, stopFireplace } from "@/lib/audio";

export function Navbar() {
  const pathname = usePathname();
  const { lang, toggleLang, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [ambientMode, setAmbientMode] = useState<"off" | "rain" | "fireplace">("off");

  const navLinks = [
    { href: "/lab", label: t.navLab, icon: Beaker },
    { href: "/cafe", label: t.navCafe, icon: Sparkles },
    { href: "/recipes", label: t.navRecipes, icon: BookOpen },
  ];

  const handleToggleAmbient = () => {
    if (ambientMode === "off") {
      setAmbientMode("rain");
      startAmbientRain(0.12);
    } else if (ambientMode === "rain") {
      stopAmbientRain();
      setAmbientMode("fireplace");
      startFireplace(0.1);
    } else {
      stopFireplace();
      setAmbientMode("off");
    }
  };

  useEffect(() => {
    return () => {
      stopAmbientRain();
      stopFireplace();
    };
  }, []);

  return (
    <header className="sticky top-3 z-40 w-full px-3 sm:px-6 max-w-7xl mx-auto">
      <nav className="vibrant-glass-panel rounded-2xl px-4 sm:px-5 py-2.5 transition-all duration-300">
        <div className="flex justify-between items-center h-12">
          {/* Logo & Brand */}
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center group transition-transform active:scale-95"
            aria-label="Kissa Lab Home"
          >
            <KissaLogo
              variant="full"
              size="md"
              subtitle={t.navSubtitle}
              showSubtitle={true}
            />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1.5">
            <div className="flex bg-black/[0.03] p-1 rounded-xl border border-black/[0.04]">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer relative",
                      isActive
                        ? "bg-white text-[#1E1915] shadow-xs ring-1 ring-amber-500/25 font-bold"
                        : "text-stone-600 hover:text-stone-900 hover:bg-white/60"
                    )}
                  >
                    <Icon className={cn("h-3.5 w-3.5", isActive ? "text-amber-600" : "text-stone-400")} />
                    <span>{link.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeNavDot"
                        className="w-1.5 h-1.5 bg-amber-600 rounded-full ml-0.5"
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Live Ambient Soundscape Controller */}
            <button
              type="button"
              onClick={handleToggleAmbient}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 ml-2",
                ambientMode === "rain"
                  ? "bg-sky-50 text-sky-800 border-sky-300/80 shadow-sky-500/10"
                  : ambientMode === "fireplace"
                  ? "bg-amber-50 text-amber-900 border-amber-300/80 shadow-amber-500/10"
                  : "bg-white/80 text-stone-600 border-stone-200/80 hover:bg-white hover:text-stone-900"
              )}
              title="Cozy Ambient Soundscape"
            >
              {ambientMode === "rain" ? (
                <>
                  <CloudRain className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
                  <span>{lang === "th" ? "ฝนพรำ" : "Rain"}</span>
                  <div className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 bg-sky-500 rounded-full animate-wave-1" />
                    <span className="w-0.5 bg-sky-500 rounded-full animate-wave-2" />
                    <span className="w-0.5 bg-sky-500 rounded-full animate-wave-3" />
                  </div>
                </>
              ) : ambientMode === "fireplace" ? (
                <>
                  <Flame className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                  <span>{lang === "th" ? "เตาฟืน" : "Hearth"}</span>
                  <div className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 bg-amber-500 rounded-full animate-wave-1" />
                    <span className="w-0.5 bg-amber-500 rounded-full animate-wave-2" />
                    <span className="w-0.5 bg-amber-500 rounded-full animate-wave-3" />
                  </div>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-stone-400" />
                  <span>{lang === "th" ? "เสียงบรรยากาศ" : "ASMR"}</span>
                </>
              )}
            </button>

            {/* Language Toggle Button */}
            <button
              type="button"
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white text-stone-800 text-xs font-semibold border border-stone-200/80 transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
              title={lang === "en" ? "เปลี่ยนเป็นภาษาไทย" : "Switch to English"}
            >
              <Languages className="w-3.5 h-3.5 text-amber-600" />
              <span>{lang === "en" ? "🇹🇭 TH" : "🇬🇧 EN"}</span>
            </button>
          </div>

          {/* Mobile Right Controls: Sound, Language & Hamburger */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              type="button"
              onClick={handleToggleAmbient}
              className={cn(
                "p-2 rounded-xl border text-xs font-semibold transition-all shadow-2xs active:scale-95",
                ambientMode === "rain"
                  ? "bg-sky-50 text-sky-700 border-sky-200"
                  : ambientMode === "fireplace"
                  ? "bg-amber-50 text-amber-800 border-amber-200"
                  : "bg-white/80 text-stone-500 border-stone-200"
              )}
              aria-label="Ambient sound toggle"
            >
              {ambientMode === "rain" ? (
                <CloudRain className="w-4 h-4 text-sky-600" />
              ) : ambientMode === "fireplace" ? (
                <Flame className="w-4 h-4 text-amber-600" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            <button
              type="button"
              onClick={toggleLang}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/80 text-stone-800 text-xs font-semibold border border-stone-200 shadow-2xs active:scale-95"
            >
              <Languages className="w-3.5 h-3.5 text-amber-600" />
              <span>{lang === "en" ? "TH" : "EN"}</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white/80 border border-stone-200 text-stone-700 shadow-2xs active:scale-95 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="md:hidden mt-2 vibrant-glass-panel rounded-2xl p-3 space-y-1.5 shadow-xl"
          >
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all",
                    isActive
                      ? "bg-amber-100/80 text-amber-950 border border-amber-300/50 shadow-2xs"
                      : "text-stone-700 hover:bg-black/[0.03] active:bg-black/[0.05]"
                  )}
                >
                  <div className={cn("p-1.5 rounded-lg", isActive ? "bg-amber-200/80" : "bg-black/[0.04]")}>
                    <Icon className="h-4 w-4 text-amber-800" />
                  </div>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;

