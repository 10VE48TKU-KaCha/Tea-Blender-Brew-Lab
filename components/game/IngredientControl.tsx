"use client";

import React from "react";
import { TeaIngredient } from "@/types/tea";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface IngredientControlProps {
  ingredient: TeaIngredient;
  value: number;
  onChange: (value: number) => void;
}

export function IngredientControl({ ingredient, value, onChange }: IngredientControlProps) {
  const handleIncrement = () => onChange(Math.min(100, value + 5));
  const handleDecrement = () => onChange(Math.max(0, value - 5));

  return (
    <div className="rounded-2xl border border-amber/20 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="h-4 w-4 rounded-full border border-black/10"
            style={{ backgroundColor: ingredient.baseColor }}
          />
          <span className="font-semibold text-wood-dark">{ingredient.name}</span>
        </div>
        <Badge variant={ingredient.category as any}>{ingredient.category}</Badge>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleDecrement}
          className="md:hidden flex h-8 w-8 items-center justify-center rounded-full bg-wood/10 text-wood-dark active:scale-95"
        >
          <Minus className="h-4 w-4" />
        </button>

        <div className="flex-1">
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full accent-wood"
          />
        </div>

        <button
          onClick={handleIncrement}
          className="md:hidden flex h-8 w-8 items-center justify-center rounded-full bg-wood/10 text-wood-dark active:scale-95"
        >
          <Plus className="h-4 w-4" />
        </button>

        <div className="w-12 text-right font-medium text-wood-dark relative h-6 overflow-hidden">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={value}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="absolute right-0"
            >
              {value}%
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default IngredientControl;
