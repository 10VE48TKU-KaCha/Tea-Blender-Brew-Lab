"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Beaker, BookOpen, Coffee, Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

export function Navbar() {
  const pathname = usePathname();
  const { lang, toggleLang, t } = useLanguage();

  const navLinks = [
    { href: "/lab", label: t.navLab, icon: Beaker },
    { href: "/recipes", label: t.navRecipes, icon: BookOpen },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-md border-b border-amber/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="p-2 bg-wood text-cream rounded-xl shadow-xs">
              <Coffee className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-[family-name:var(--font-display)] text-xl font-bold text-wood-dark leading-none">
                Kissa Lab
              </span>
              <span className="text-[10px] uppercase tracking-wider text-wood/60 font-medium hidden sm:block">
                {t.navSubtitle}
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex gap-1 sm:gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer",
                      isActive
                        ? "bg-amber-light text-wood-dark font-semibold shadow-xs"
                        : "text-wood hover:bg-wood/5 hover:text-wood-dark"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Language Toggle Button */}
            <button
              type="button"
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-amber/15 hover:bg-amber/25 text-dark-wood text-xs sm:text-sm font-semibold border border-wood/20 transition-all cursor-pointer shadow-xs active:scale-95"
              title={lang === "en" ? "เปลี่ยนเป็นภาษาไทย" : "Switch to English"}
            >
              <Languages className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-700" />
              <span>{lang === "en" ? "🇹🇭 TH" : "🇬🇧 EN"}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
