"use client";

import React from "react";
import { ServingStyle } from "./CozyCupScene";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface ServingStyleSelectorProps {
  servingStyle: ServingStyle;
  onStyleChange: (style: ServingStyle) => void;
  garnishes: string[];
  onGarnishToggle: (garnishId: string) => void;
}

const STYLES: { id: ServingStyle; label: string; icon: string; desc: string }[] = [
  { id: "hot", label: "Hot Brew", icon: "♨️", desc: "Classic ceramic" },
  { id: "iced", label: "Iced Glass", icon: "🧊", desc: "Chilled on ice" },
  { id: "latte", label: "Tea Latte", icon: "🥛", desc: "Layered & foam" },
];

const BOTANICALS: { id: string; label: string; icon: string }[] = [
  { id: "osmanthus", label: "Osmanthus", icon: "🌼" },
  { id: "rose", label: "Rose Petals", icon: "🌹" },
  { id: "cinnamon", label: "Cinnamon", icon: "🪵" },
  { id: "honey", label: "Honey Swirl", icon: "🍯" },
];

export function ServingStyleSelector({
  servingStyle,
  onStyleChange,
  garnishes,
  onGarnishToggle,
}: ServingStyleSelectorProps) {
  return (
    <div className="w-full space-y-3 bg-white/70 backdrop-blur-md rounded-2xl p-4 border border-wood/15 shadow-sm">
      {/* Serving Style Switcher */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-wood/70 mb-2 flex items-center gap-1.5">
          <span>☕</span> Serving Style
        </div>
        <div className="grid grid-cols-3 gap-2">
          {STYLES.map((style) => {
            const isSelected = servingStyle === style.id;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => onStyleChange(style.id)}
                className={cn(
                  "flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all duration-200 text-center cursor-pointer",
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

      {/* Botanicals & Add-ins */}
      <div className="pt-2 border-t border-wood/10">
        <div className="text-xs font-semibold uppercase tracking-wider text-wood/70 mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber" />
            Botanical Add-ins
          </span>
          {garnishes.length > 0 && (
            <span className="text-[11px] text-amber-600 font-normal">
              {garnishes.length} selected
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {BOTANICALS.map((botanical) => {
            const isChecked = garnishes.includes(botanical.id);
            return (
              <button
                key={botanical.id}
                type="button"
                onClick={() => onGarnishToggle(botanical.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer",
                  isChecked
                    ? "bg-amber/20 border-amber text-dark-wood shadow-sm"
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
