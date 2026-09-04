"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, Copy, Check, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import TeaPostcardModal from "@/components/game/TeaPostcardModal";
import { CupVesselType, CupGlaze, CoasterStyle, LatteArtType, ServingStyle } from "@/types/tea";

interface RecipeShareBarProps {
  recipeId: string;
  title: string;
  description?: string | null;
  renderedHex: string;
  waterTempC: number;
  waterAmountMl: number;
  steepingTimeSec: number;
  sweetnessScore: number;
  aromaScore: number;
  bodyScore: number;
  bitternessScore: number;
  vesselType?: CupVesselType;
  cupGlaze?: CupGlaze;
  coasterStyle?: CoasterStyle;
  servingStyle?: ServingStyle;
  turbidity?: "clear" | "cloudy" | "velvet";
  latteArt?: LatteArtType;
  garnishes: string[];
  blendItems: Array<{
    ingredient: {
      id: string;
      name: string;
      category: any;
      baseColor: string;
      bodyScore: number;
      tanninScore: number;
      aromaScore: number;
    };
    ratioPercent: number;
  }>;
}

export function RecipeShareBar({
  recipeId,
  title,
  description,
  renderedHex,
  waterTempC,
  waterAmountMl,
  steepingTimeSec,
  sweetnessScore,
  aromaScore,
  bodyScore,
  bitternessScore,
  vesselType = "mug",
  cupGlaze = "earthenware",
  coasterStyle = "ceramic",
  servingStyle = "hot",
  turbidity = "velvet",
  latteArt,
  garnishes,
  blendItems,
}: RecipeShareBarProps) {
  const { t, lang, translateIngredient } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [isPostcardOpen, setIsPostcardOpen] = useState(false);

  const handleShare = async () => {
    const ingredientsText = blendItems
      .filter((b) => b.ratioPercent > 0)
      .map((b) => `${translateIngredient(b.ingredient.name)} (${b.ratioPercent}%)`)
      .join(", ");

    const presentationLines = [
      `🎨 ${lang === "th" ? "สีน้ำชา" : "Color"}: ${renderedHex}`,
      `☕ ${lang === "th" ? "ภาชนะ" : "Vessel"}: ${vesselType} (${cupGlaze})`,
      `✨ ${lang === "th" ? "สไตล์" : "Style"}: ${servingStyle === "hot" ? t.styleHot : servingStyle === "iced" ? t.styleIced : t.styleLatte}`,
      garnishes && garnishes.length > 0 ? `🌸 ${lang === "th" ? "เครื่องเคียง" : "Garnishes"}: ${garnishes.join(", ")}` : null,
      servingStyle === "latte" && latteArt ? `🥛 ${lang === "th" ? "ลาเต้อาร์ต" : "Latte Art"}: ${latteArt}` : null,
    ].filter(Boolean).join("\n");

    const linkUrl = `${window.location.origin}/recipes/${recipeId}`;
    const shareText = `🍵 [Kissa Lab] ${title}\n` +
      `${presentationLines}\n` +
      `${t.postcardBlendRatio}: ${ingredientsText}\n` +
      `${t.brewParamsTitle}: ${waterTempC}°C | ${steepingTimeSec}s | ${waterAmountMl}ml\n` +
      (description ? `"${description}"\n` : "") +
      `${linkUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `🍵 Kissa Lab - ${title}`,
          text: shareText,
          url: linkUrl,
        });
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
        return;
      } catch (e) {
        // User cancelled or fallback
      }
    }

    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Construct synthetic ExtractionResult for TeaPostcardModal
  const extractionResult = {
    renderedHex,
    opacity: 0.9,
    sweetnessScore,
    aromaScore,
    bodyScore,
    bitternessScore,
    clarityScore: Math.max(1, 10 - bodyScore * 0.4),
    cozyTitle: title,
    tastingNotes: description || "Artisan blend certified by Kissa Lab",
    blendCode: `#KISSA-${recipeId.slice(-4).toUpperCase()}`,
    recommendedVessel: vesselType,
    cupGlaze,
    turbidity,
    originCountries: [],
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Presentation Badge Bar */}
      <div className="flex items-center justify-center gap-2.5 flex-wrap">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-wood/20 shadow-xs text-xs font-medium">
          <span
            className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
            style={{ backgroundColor: renderedHex }}
          />
          <span className="font-mono text-dark-wood">{renderedHex}</span>
        </div>

        <Badge variant="outline" className="text-xs capitalize border-wood/25 bg-white/70 text-dark-wood">
          {vesselType === "chawan" ? "🍵" : vesselType === "gaiwan" ? "🫖" : vesselType === "tumbler" ? "🧊" : vesselType === "goblet" ? "🥂" : vesselType === "latte" ? "🥛" : vesselType === "kuksa" ? "🪵" : vesselType === "zisha" ? "🏺" : "☕"} {vesselType} ({cupGlaze})
        </Badge>

        <Badge variant="outline" className="text-xs capitalize border-wood/25 bg-white/70 text-dark-wood">
          {servingStyle === "hot" ? "🔥 Hot" : servingStyle === "iced" ? "❄️ Iced" : "🥛 Latte"}
        </Badge>

        {coasterStyle && coasterStyle !== "none" && (
          <Badge variant="outline" className="text-xs capitalize border-wood/25 bg-white/70 text-dark-wood">
            🪵 {coasterStyle} saucer
          </Badge>
        )}

        {garnishes && garnishes.length > 0 && (
          <Badge variant="outline" className="text-xs border-amber-300 bg-amber-50 text-amber-900 font-medium">
            🌸 {garnishes.join(", ")}
          </Badge>
        )}

        {servingStyle === "latte" && latteArt && (
          <Badge variant="outline" className="text-xs border-amber-300 bg-amber-50 text-amber-900 font-medium">
            🎨 {latteArt} art
          </Badge>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 flex-wrap justify-center">
        <Button
          onClick={handleShare}
          className="bg-dark-wood hover:bg-wood text-cream rounded-full px-5 py-2 text-sm font-medium flex items-center gap-2 cursor-pointer shadow-sm transition-all hover:scale-105 active:scale-95"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{t.linkCopied}</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              <span>{lang === "th" ? "แชร์สูตรชานี้" : "Share Blend"}</span>
            </>
          )}
        </Button>

        <Button
          onClick={() => setIsPostcardOpen(true)}
          variant="outline"
          className="border-[#8C5E45]/40 bg-white/90 hover:bg-amber-50 text-dark-wood rounded-full px-5 py-2 text-sm font-medium flex items-center gap-2 cursor-pointer shadow-sm transition-all hover:scale-105 active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-amber" />
          <span>🎴 {t.createPostcard}</span>
        </Button>
      </div>

      {/* Postcard Modal for this recipe */}
      <TeaPostcardModal
        isOpen={isPostcardOpen}
        onClose={() => setIsPostcardOpen(false)}
        title={title}
        extraction={extractionResult}
        blendInputs={blendItems}
        waterTempC={waterTempC}
        steepingTimeSec={steepingTimeSec}
        waterAmountMl={waterAmountMl}
        servingStyle={servingStyle}
        vesselType={vesselType}
        cupGlaze={cupGlaze}
        coasterStyle={coasterStyle}
        latteArt={latteArt}
        garnishes={garnishes}
        recipeId={recipeId}
      />
    </div>
  );
}

export default RecipeShareBar;
