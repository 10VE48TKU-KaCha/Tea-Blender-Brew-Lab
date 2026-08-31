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

  return (
    <Link href={`/recipes/${recipe.id}`}>
      <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
        <Card className="h-full flex flex-col cursor-pointer overflow-hidden">
          <CardHeader className="flex-row items-center gap-3 pb-2">
            <div
              className="h-8 w-8 rounded-full border border-black/10 shrink-0"
              style={{ backgroundColor: recipe.renderedHex }}
            />
            <div className="flex flex-col">
              <CardTitle className="text-base truncate">{recipe.title}</CardTitle>
              <CardDescription className="text-xs">{formattedDate}</CardDescription>
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

          <CardFooter className="bg-amber-light/10 border-t border-amber/10 py-3 gap-2 flex-wrap">
            <Badge variant="secondary" className="text-xs">
              {recipe.waterTempC}°C
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {Math.floor(recipe.steepingTimeSec / 60)}m {recipe.steepingTimeSec % 60}s
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {recipe.waterAmountMl}ml
            </Badge>
          </CardFooter>
        </Card>
      </motion.div>
    </Link>
  );
}

export default RecipeCard;
