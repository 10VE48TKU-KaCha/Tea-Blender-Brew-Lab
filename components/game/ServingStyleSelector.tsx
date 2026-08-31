"use client";

import React from "react";
import { ServingStyle } from "./CozyCupScene";
import { cn } from "@/lib/utils";
import { Sparkles, Heart } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface ServingStyleSelectorProps {
  servingStyle: ServingStyle;
  onStyleChange: (style: ServingStyle) => void;
  garnishes: string[];
  onGarnishToggle: (garnishId: string) => void;
  latteArt?: "bear" | "heart";
  onLatteArtChange?: (art: "bear" | "heart") => void;
}

export function ServingStyleSelector({
  servingStyle,
  onStyleChange,
  garnishes,
  onGarnishToggle,
  latteArt = "bear",
  onLatteArtChange,
}: ServingStyleSelectorProps) {
  const { t } = useLanguage();

  const styles: { id: ServingStyle; label: string; icon: string; desc: string }[] = [
    { id: "hot", label: t.styleHot, icon: "♨️", desc: t.styleHotDesc },
    { id: "iced", label: t.styleIced, icon: "🧊", desc: t.styleIcedDesc },
    { id: "latte", label: t.styleLatte, icon: "🥛", desc: t.styleLatteDesc },
  ];

  const botanicals: { id: string; label: string; icon: string }[] = [
    { id: "osmanthus", label: t.garnishOsmanthus, icon: "🌼" },
    { id: "rose", label: t.garnishRose, icon: "🌹" },
    { id: "cinnamon", label: t.garnishCinnamon, icon: "🪵" },
    { id: "honey", label: t.garnishHoney, icon: "🍯" },
  ];

  return (
    <div className="w-full space-y-3.5 bg-white/70 backdrop-blur-md rounded-2xl p-4 border border-wood/15 shadow-sm">
      {/* Serving Style Switcher */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-wood/70 mb-2 flex items-center gap-1.5">
          <span>☕</span> {t.servingStyleMode}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {styles.map((style) => {
            const isSelected = servingStyle === style.id;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => onStyleChange(style.id)}
                className={cn(
                  "flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all duration-200 text-center cursor-pointer active:scale-95",
                  isSelected
                    ? "bg-amber-light/30 border-wood text-dark-wood font-medium shadow-sm ring-1 ring-amber"
                    : "bg-white/50 border-wood/10 text-wood/80 hover:bg-cream hover:border-wood/30"
                )}
              >
                <span className="text-xl mb-0.5">{style.icon}</span>
                <span className="text-xs font-semibold">{style.label}</span>
                <span className="text-[10px] text-wood/60 hidden sm:inline">{style.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Latte Art Selector (Only visible in latte mode) */}
      {servingStyle === "latte" && onLatteArtChange && (
        <div className="pt-2 border-t border-wood/10 animate-in fade-in duration-200">
          <div className="text-xs font-semibold uppercase tracking-wider text-wood/70 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span>🎨</span> {t.latteFoamArt}
            </span>
            <span className="text-[11px] text-amber-700 font-normal">
              {latteArt === "bear" ? `🐻 ${t.artBear}` : `💖 ${t.artHeart}`}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onLatteArtChange("bear")}
              className={cn(
                "flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-medium transition-all cursor-pointer active:scale-95",
                latteArt === "bear"
                  ? "bg-amber/25 border-wood text-dark-wood font-bold shadow-sm"
                  : "bg-white/40 border-wood/15 text-wood/70 hover:bg-white/80"
              )}
            >
              <span>🐻</span>
              <span>{t.artBear}</span>
            </button>
            <button
              type="button"
              onClick={() => onLatteArtChange("heart")}
              className={cn(
                "flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-medium transition-all cursor-pointer active:scale-95",
                latteArt === "heart"
                  ? "bg-amber/25 border-wood text-dark-wood font-bold shadow-sm"
                  : "bg-white/40 border-wood/15 text-wood/70 hover:bg-white/80"
              )}
            >
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>{t.artHeart}</span>
            </button>
          </div>
        </div>
      )}

      {/* Botanicals & Add-ins */}
      <div className="pt-2 border-t border-wood/10">
        <div className="text-xs font-semibold uppercase tracking-wider text-wood/70 mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber" />
            {t.botanicalAddins}
          </span>
          {garnishes.length > 0 && (
            <span className="text-[11px] text-amber-700 font-normal">
              {garnishes.length} {t.selectedCount}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {botanicals.map((botanical) => {
            const isChecked = garnishes.includes(botanical.id);
            return (
              <button
                key={botanical.id}
                type="button"
                onClick={() => onGarnishToggle(botanical.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer active:scale-95",
                  isChecked
                    ? "bg-amber/25 border-wood text-dark-wood font-semibold shadow-sm ring-1 ring-amber/50"
                    : "bg-white/40 border-wood/15 text-wood/70 hover:bg-white/80"
                )}
              >
                <span>{botanical.icon}</span>
                <span>{botanical.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ServingStyleSelector;
