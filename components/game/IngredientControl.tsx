"use client";

import React from "react";
import { TeaIngredient } from "@/types/tea";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, RotateCcw } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

interface IngredientControlProps {
  ingredient: TeaIngredient;
  value: number;
  onChange: (value: number) => void;
}

export function IngredientControl({ ingredient, value, onChange }: IngredientControlProps) {
  const { translateIngredient, lang, t } = useLanguage();

  const handleIncrement = (amount: number = 5) => onChange(Math.min(100, value + amount));
  const handleDecrement = (amount: number = 5) => onChange(Math.max(0, value - amount));
  const handleReset = () => onChange(0);

  const categoryLabel =
    lang === "th"
      ? ingredient.category === "BLACK"
        ? t.catBlack
        : ingredient.category === "GREEN"
        ? t.catGreen
        : ingredient.category === "OOLONG"
        ? t.catOolong
        : ingredient.category === "WHITE"
        ? t.catWhite
        : t.catHerbal
      : ingredient.category;

  const isActive = value > 0;

  return (
    <div
      className={cn(
        "rounded-2xl p-4 transition-all duration-300 relative overflow-hidden",
        isActive
          ? "vibrant-glass-card ring-1.5"
          : "vibrant-glass-card hover:border-amber-400/40"
      )}
      style={{
        borderColor: isActive ? `${ingredient.baseColor}70` : undefined,
        boxShadow: isActive
          ? `0 12px 32px -8px ${ingredient.baseColor}28, 0 0 0 1px ${ingredient.baseColor}60`
          : undefined,
      }}
    >
      {/* Dynamic Colored Accent Glow Bar */}
      {isActive && (
        <div
          className="absolute top-0 left-0 right-0 h-1 transition-all duration-300"
          style={{
            background: `linear-gradient(90deg, transparent, ${ingredient.baseColor}, transparent)`,
          }}
        />
      )}

      {/* Header Row: Color Pill + Tea Name + Category */}
      <div className="flex items-center justify-between mb-3 gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Vibrant Color Pill */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold text-white shadow-xs shrink-0"
            style={{ backgroundColor: ingredient.baseColor }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white/90 animate-pulse" />
            <span>{ingredient.baseColor.toUpperCase()}</span>
          </div>

          <span className="font-bold text-sm text-[#1E1915] truncate">
            {translateIngredient(ingredient.name)}
          </span>
        </div>

        <Badge
          variant={ingredient.category as any}
          className="shrink-0 text-[10px] font-semibold tracking-wider uppercase"
        >
          {categoryLabel}
        </Badge>
      </div>

      {/* Slider & Controls Row */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleDecrement(5)}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/90 text-stone-700 border border-stone-200/90 hover:bg-amber-50 active:scale-95 shadow-2xs cursor-pointer shrink-0 transition-all"
            aria-label="Decrease percentage"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>

          <div className="flex-1 relative py-1">
            <input
              type="range"
              min="0"
              max="100"
              value={value}
              onChange={(e) => onChange(Number(e.target.value))}
              className="w-full"
              style={{
                accentColor: ingredient.baseColor,
              }}
            />
          </div>

          <button
            type="button"
            onClick={() => handleIncrement(5)}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-white active:scale-95 shadow-xs cursor-pointer shrink-0 transition-all"
            style={{
              backgroundColor: ingredient.baseColor,
              boxShadow: `0 3px 10px -1px ${ingredient.baseColor}60`,
            }}
            aria-label="Increase percentage"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>

          {/* Animated Value Pill */}
          <div
            className={cn(
              "w-14 px-2 py-1 rounded-xl text-right font-mono font-bold text-sm transition-all shrink-0 flex items-center justify-end relative h-7 overflow-hidden border",
              isActive
                ? "bg-white shadow-2xs border-stone-200 text-stone-900"
                : "bg-black/[0.03] border-transparent text-stone-400"
            )}
          >
            <AnimatePresence mode="popLayout">
              <motion.span
                key={value}
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -15, opacity: 0 }}
                className="font-bold"
              >
                {value}%
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        {/* Quick Dosage Chips */}
        <div className="flex items-center justify-between pt-1 border-t border-black/[0.04] text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="text-stone-400 font-medium text-[10px]">
              {lang === "th" ? "ปรับเร็ว:" : "Quick:"}
            </span>
            <button
              type="button"
              onClick={() => handleIncrement(10)}
              className="px-2 py-0.5 rounded-lg bg-white/70 hover:bg-white text-stone-600 hover:text-stone-900 border border-stone-200/70 shadow-2xs font-semibold cursor-pointer transition-all active:scale-95"
            >
              +10%
            </button>
            <button
              type="button"
              onClick={() => handleIncrement(25)}
              className="px-2 py-0.5 rounded-lg bg-white/70 hover:bg-white text-stone-600 hover:text-stone-900 border border-stone-200/70 shadow-2xs font-semibold cursor-pointer transition-all active:scale-95"
            >
              +25%
            </button>
          </div>

          {isActive && (
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-stone-400 hover:text-rose-600 text-[10px] cursor-pointer transition-all hover:bg-rose-50"
              title="Reset to 0%"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span>{lang === "th" ? "รีเซ็ต" : "Clear"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default IngredientControl;

