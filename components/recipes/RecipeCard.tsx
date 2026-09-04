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
      <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
        <Card className="h-full flex flex-col cursor-pointer overflow-hidden">
          <CardHeader className="flex-row items-center gap-3 pb-2">
            <div
              className="h-9 w-9 rounded-full border border-black/10 shadow-xs shrink-0 flex items-center justify-center text-sm"
              style={{ backgroundColor: recipe.renderedHex }}
            >
              <span className="drop-shadow-xs">{vesselEmoji}</span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <CardTitle className="text-base truncate">{recipe.title}</CardTitle>
              <div className="flex items-center gap-1.5 text-xs text-wood/70 flex-wrap">
                <span>{formattedDate}</span>
                {recipe.vesselType && (
                  <>
                    <span>•</span>
                    <span className="capitalize">{recipe.vesselType} ({recipe.cupGlaze || "earthenware"})</span>
                  </>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 pb-2">
            {recipe.description && (
              <p className="text-sm text-wood/80 line-clamp-2 mb-4">{recipe.description}</p>
            )}
            <div className="flex justify-center -my-4">
              <FlavorRadarChart data={radarData} size="sm" />
            </div>
            
            <div className="flex flex-wrap gap-1.5 mt-2">
              {recipe.blendItems.map((blend) => (
                <Badge key={blend.id} variant="outline" className="text-[10px] px-1.5 py-0">
                  {translateIngredient(blend.ingredient.name)} {blend.ratioPercent}%
                </Badge>
              ))}
            </div>
          </CardContent>

          <CardFooter className="bg-amber-light/10 border-t border-amber/10 py-3 gap-1.5 flex-wrap">
            <Badge variant="secondary" className="text-xs">
              {recipe.waterTempC}°C
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {Math.floor(recipe.steepingTimeSec / 60)}m {recipe.steepingTimeSec % 60}s
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {recipe.waterAmountMl}ml
            </Badge>
            {recipe.servingStyle && (
              <Badge variant="outline" className="text-xs capitalize bg-white/60">
                {recipe.servingStyle}
              </Badge>
            )}
            {garnishesCount > 0 && (
              <Badge variant="outline" className="text-xs bg-amber-50 text-amber-900 border-amber-200">
                🌸 +{garnishesCount}
              </Badge>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </Link>
  );
}

export default RecipeCard;
