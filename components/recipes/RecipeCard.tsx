"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { RecipeWithBlends } from "@/types/tea";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FlavorRadarChart from "@/components/charts/FlavorRadarChart";
import { useLanguage } from "@/context/LanguageContext";

interface RecipeCardProps {
  recipe: RecipeWithBlends;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const { t, lang, translateIngredient } = useLanguage();

  const radarData = [
    { dimension: t.sweetness, score: recipe.sweetnessScore, fullMark: 10 },
    { dimension: t.aroma, score: recipe.aromaScore, fullMark: 10 },
    { dimension: t.body, score: recipe.bodyScore, fullMark: 10 },
    { dimension: t.bitterness, score: recipe.bitternessScore, fullMark: 10 },
    { dimension: t.clarity, score: Math.max(1, 10 - recipe.bodyScore * 0.4), fullMark: 10 },
  ];

  const createdDate = new Date(recipe.createdAt);
  const formattedDate = createdDate.toLocaleDateString(lang === "th" ? "th-TH" : "en-US", {
    month: "short",
    day: "numeric",
  });

  let garnishesCount = 0;
  try {
    if (recipe.garnishes) {
      const parsed = JSON.parse(recipe.garnishes);
      if (Array.isArray(parsed)) garnishesCount = parsed.length;
    }
  } catch (e) {}

  const vesselEmoji =
    recipe.vesselType === "chawan" ? "🍵" :
    recipe.vesselType === "gaiwan" ? "🫖" :
    recipe.vesselType === "tumbler" ? "🧊" :
    recipe.vesselType === "goblet" ? "🥂" :
    recipe.vesselType === "latte" ? "🥛" :
    recipe.vesselType === "kuksa" ? "🪵" :
    recipe.vesselType === "zisha" ? "🏺" : "☕";

  return (
    <Link href={`/recipes/${recipe.id}`}>
      <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
        <div className="vibrant-glass-card rounded-3xl h-full flex flex-col cursor-pointer overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3 p-5 pb-3">
            <div
              className="h-10 w-10 rounded-2xl border border-white shadow-xs shrink-0 flex items-center justify-center text-base"
              style={{
                backgroundColor: recipe.renderedHex,
                boxShadow: `0 4px 14px -2px ${recipe.renderedHex}60`,
              }}
            >
              <span className="drop-shadow-xs">{vesselEmoji}</span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <h3 className="text-base font-bold text-[#1E1915] truncate">{recipe.title}</h3>
              <div className="flex items-center gap-1.5 text-xs text-stone-500 flex-wrap mt-0.5">
                <span>{formattedDate}</span>
                {recipe.vesselType && (
                  <>
                    <span>•</span>
                    <span className="capitalize">{recipe.vesselType} ({recipe.cupGlaze || "earthenware"})</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="px-5 flex-1 pb-3">
            {recipe.description && (
              <p className="text-xs text-stone-600 line-clamp-2 mb-3 leading-relaxed">{recipe.description}</p>
            )}
            <div className="flex justify-center -my-2">
              <FlavorRadarChart data={radarData} size="sm" />
            </div>
            
            <div className="flex flex-wrap gap-1.5 mt-3">
              {recipe.blendItems.map((blend) => (
                <span
                  key={blend.id}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/80 border border-stone-200 text-stone-700 shadow-2xs"
                >
                  {translateIngredient(blend.ingredient.name)} <strong>{blend.ratioPercent}%</strong>
                </span>
              ))}
            </div>
          </div>

          <div className="bg-black/[0.02] border-t border-black/[0.04] p-3.5 px-5 gap-1.5 flex items-center flex-wrap mt-auto">
            <span className="text-xs font-mono font-bold bg-white px-2 py-0.5 rounded-lg border border-stone-200 text-stone-800 shadow-2xs">
              🌡️ {recipe.waterTempC}°C
            </span>
            <span className="text-xs font-mono font-bold bg-white px-2 py-0.5 rounded-lg border border-stone-200 text-stone-800 shadow-2xs">
              ⏳ {Math.floor(recipe.steepingTimeSec / 60)}m {recipe.steepingTimeSec % 60}s
            </span>
            <span className="text-xs font-mono font-bold bg-white px-2 py-0.5 rounded-lg border border-stone-200 text-stone-800 shadow-2xs">
              💧 {recipe.waterAmountMl}ml
            </span>
            {recipe.servingStyle && (
              <span className="text-xs capitalize bg-amber-50 text-amber-800 border border-amber-200/80 px-2 py-0.5 rounded-lg font-semibold shadow-2xs">
                {recipe.servingStyle}
              </span>
            )}
            {garnishesCount > 0 && (
              <span className="text-xs bg-rose-50 text-rose-800 border border-rose-200/80 px-2 py-0.5 rounded-lg font-semibold shadow-2xs">
                🌸 +{garnishesCount}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export default RecipeCard;
