"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Beaker, BookOpen, Coffee, Languages, Sparkles, Menu, X, CloudRain, Flame, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

import { KissaLogo } from "@/components/ui/KissaLogo";

export function Navbar() {
  const pathname = usePathname();
  const { lang, toggleLang, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/lab", label: t.navLab, icon: Beaker },
    { href: "/cafe", label: t.navCafe, icon: Sparkles },
    { href: "/recipes", label: t.navRecipes, icon: BookOpen },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-amber-900/10 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
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
          <div className="hidden md:flex items-center gap-2">
            <div className="flex bg-wood/5 p-1 rounded-2xl border border-wood/10">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer relative",
                      isActive
                        ? "bg-white text-wood-dark shadow-xs ring-1 ring-amber-500/20"
                        : "text-wood/80 hover:text-wood-dark hover:bg-white/60"
                    )}
                  >
                    <Icon className={cn("h-4 w-4", isActive ? "text-amber-700" : "text-wood/60")} />
                    <span>{link.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-3 right-3 h-0.5 bg-amber-600 rounded-full"
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Language Toggle Button */}
            <button
              type="button"
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/80 hover:bg-white text-dark-wood text-xs font-semibold border border-wood/15 transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 ml-1"
              title={lang === "en" ? "Change to Thai" : "Change to English"}
            >
              <Languages className="w-3.5 h-3.5 text-amber-700" />
              <span>{lang === "en" ? "🇹🇭 TH" : "🇬🇧 EN"}</span>
            </button>
          </div>

          {/* Mobile Right Controls: Language & Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={toggleLang}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/80 text-dark-wood text-xs font-semibold border border-wood/15 shadow-2xs active:scale-95"
            >
              <Languages className="w-3.5 h-3.5 text-amber-700" />
              <span>{lang === "en" ? "TH" : "EN"}</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white/80 border border-wood/15 text-wood-dark shadow-2xs active:scale-95 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-wood/10 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-5 space-y-2 shadow-lg"
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
                    "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all",
                    isActive
                      ? "bg-amber-100/70 text-wood-dark border border-amber-300 shadow-2xs"
                      : "text-wood hover:bg-cream active:bg-cream"
                  )}
                >
                  <div className={cn("p-2 rounded-xl", isActive ? "bg-amber-200/80" : "bg-wood/5")}>
                    <Icon className="h-4 w-4 text-amber-800" />
                  </div>
                  <span className="text-base">{link.label}</span>
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
