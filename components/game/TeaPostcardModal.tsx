"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExtractionResult, BlendInput, CupVesselType, CupGlaze, CoasterStyle, LatteArtType } from "@/types/tea";
import CozyCupScene, { ServingStyle } from "./CozyCupScene";
import FlavorRadarChart from "@/components/charts/FlavorRadarChart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Copy, Check, Share2, Sparkles, Download } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface TeaPostcardModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  extraction: ExtractionResult;
  blendInputs: BlendInput[];
  waterTempC: number;
  steepingTimeSec: number;
  waterAmountMl: number;
  servingStyle?: ServingStyle;
  vesselType?: CupVesselType;
  cupGlaze?: CupGlaze;
  coasterStyle?: CoasterStyle;
  latteArt?: LatteArtType;
  garnishes: string[];
  recipeId?: string;
}

export function TeaPostcardModal({
  isOpen,
  onClose,
  title,
  extraction,
  blendInputs,
  waterTempC,
  steepingTimeSec,
  waterAmountMl,
  servingStyle = "hot",
  vesselType = "mug",
  cupGlaze,
  coasterStyle,
  latteArt,
  garnishes,
  recipeId,
}: TeaPostcardModalProps) {
  const { t, lang, translateIngredient } = useLanguage();
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const activeBlends = blendInputs.filter((b) => b.ratioPercent > 0);
  const blendCode = extraction.blendCode || "#KISSA-8888";
  const dateStr = new Date().toLocaleDateString(lang === "th" ? "th-TH" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const radarData = [
    { dimension: t.sweetness, score: extraction.sweetnessScore, fullMark: 10 },
    { dimension: t.aroma, score: extraction.aromaScore, fullMark: 10 },
    { dimension: t.body, score: extraction.bodyScore, fullMark: 10 },
    { dimension: t.bitterness, score: extraction.bitternessScore, fullMark: 10 },
    { dimension: t.clarity, score: extraction.clarityScore, fullMark: 10 },
  ];

  const servingStyleLabel =
    servingStyle === "hot"
      ? t.styleHot
      : servingStyle === "iced"
      ? t.styleIced
      : t.styleLatte;

  const handleCopyShare = async () => {
    const ingredientsText = activeBlends
      .map((b) => `${translateIngredient(b.ingredient.name)} (${b.ratioPercent}%)`)
      .join(", ");

    const presentationLines = [
      `🎨 ${lang === "th" ? "สีน้ำชา" : "Color"}: ${extraction.renderedHex}`,
      `☕ ${lang === "th" ? "ภาชนะ" : "Vessel"}: ${vesselType} (${cupGlaze || extraction.cupGlaze || "earthenware"})`,
      `✨ ${lang === "th" ? "สไตล์" : "Style"}: ${servingStyleLabel}`,
      garnishes && garnishes.length > 0 ? `🌸 ${lang === "th" ? "เครื่องเคียง" : "Garnishes"}: ${garnishes.join(", ")}` : null,
      servingStyle === "latte" && latteArt ? `🥛 ${lang === "th" ? "ลาเต้อาร์ต" : "Latte Art"}: ${latteArt}` : null,
    ].filter(Boolean).join("\n");

    const linkUrl = recipeId ? `${window.location.origin}/recipes/${recipeId}` : `${window.location.origin}/lab`;

    const shareText = `🍵 [Kissa Lab] ${title || extraction.cozyTitle}\n` +
      `Code: ${blendCode}\n` +
      `${presentationLines}\n` +
      `${t.postcardBlendRatio}: ${ingredientsText}\n` +
      `${t.brewParamsTitle}: ${waterTempC}°C | ${steepingTimeSec}s | ${waterAmountMl}ml\n` +
      `"${extraction.tastingNotes}"\n` +
      `${linkUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `🍵 Kissa Lab - ${title || extraction.cozyTitle}`,
          text: shareText,
          url: linkUrl,
        });
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
        return;
      } catch (err) {
        // user cancelled or fallback
      }
    }

    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md max-h-[92vh] overflow-y-auto bg-[#FAF6EE] rounded-3xl p-6 shadow-2xl border-2 border-[#8C5E45]/30 scrollbar-none"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-wood/15">
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-wood/80 font-bold">
              <Sparkles className="w-4 h-4 text-amber" />
              <span>{t.postcardTitle}</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-wood/10 text-dark-wood hover:bg-wood/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Printable / Shareable Card Container */}
          <div
            ref={cardRef}
            className="relative bg-[#FFFDF9] rounded-2xl p-5 border border-[#8C5E45]/30 shadow-inner overflow-hidden"
          >
            {/* Japanese Red Stamp Mark (Hanko) */}
            <div className="absolute top-4 right-4 w-12 h-12 rounded-lg border-2 border-red-700/80 flex flex-col items-center justify-center text-red-700/80 font-serif text-[9px] font-bold leading-tight select-none rotate-6 pointer-events-none">
              <span>喫茶</span>
              <span>鑑定</span>
            </div>

            {/* Ticket Header */}
            <div className="pr-14">
              <span className="font-mono text-xs font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full border border-amber-300">
                {blendCode}
              </span>
              <h3 className="font-display text-2xl font-bold text-dark-wood mt-2 leading-tight">
                {title || extraction.cozyTitle}
              </h3>
              <p className="text-[11px] text-wood/60 mt-0.5">
                {lang === "th" ? "รับรองโดยห้องทดลองคิสสะ" : "Certified by Kissa Laboratory"} • {dateStr}
              </p>
            </div>

            {/* Origins Badge */}
            {extraction.originCountries && extraction.originCountries.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {extraction.originCountries.map((origin) => (
                  <span
                    key={origin}
                    className="text-[10px] bg-cream px-2 py-0.5 rounded-md border border-wood/15 text-dark-wood font-medium"
                  >
                    {origin}
                  </span>
                ))}
              </div>
            )}

            {/* Brewed Cup & Color Scene */}
            <div className="my-3 py-2 px-3 bg-gradient-to-b from-[#FAF6EE] to-[#F5EFE3] rounded-2xl border border-wood/15 shadow-inner flex flex-col items-center overflow-hidden">
              <div className="h-44 w-full flex items-center justify-center scale-90 -my-2">
                <CozyCupScene
                  liquidColor={extraction.renderedHex}
                  opacity={0.9}
                  steamIntensity={Math.max(0, (waterTempC - 60) / 40)}
                  servingStyle={servingStyle}
                  vesselType={vesselType}
                  cupGlaze={cupGlaze || extraction.cupGlaze || "earthenware"}
                  coasterStyle={coasterStyle || "ceramic"}
                  turbidity={extraction.turbidity || "velvet"}
                  garnishes={garnishes}
                  latteArt={latteArt}
                />
              </div>

              {/* Presentation specs badge strip */}
              <div className="w-full flex items-center justify-between text-[11px] pt-2 border-t border-wood/10 mt-1 flex-wrap gap-1.5">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-wood/20 shadow-xs shrink-0"
                    style={{ backgroundColor: extraction.renderedHex }}
                  />
                  <span className="font-mono font-semibold text-dark-wood">{extraction.renderedHex}</span>
                </div>
                <div className="text-wood/80 capitalize font-medium">
                  <span>{vesselType}</span> • <span>{cupGlaze || extraction.cupGlaze || "Earthenware"}</span>
                </div>
                {servingStyle !== "hot" && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold uppercase">
                    {servingStyle}
                  </span>
                )}
              </div>
            </div>

            {/* Flavor Radar & Tasting Notes */}
            <div className="flex justify-center -my-2">
              <FlavorRadarChart data={radarData} size="sm" />
            </div>

            <p className="text-center italic text-xs text-wood leading-relaxed my-3 px-2">
              "{extraction.tastingNotes}"
            </p>

            {/* Recipe Formula List */}
            <div className="pt-3 border-t border-dashed border-wood/20 space-y-1.5">
              <div className="text-[10px] uppercase font-bold tracking-wider text-wood/60 mb-1">
                {t.postcardBlendRatio}
              </div>
              {activeBlends.map((item) => (
                <div key={item.ingredient.id} className="flex justify-between text-xs">
                  <span className="text-dark-wood font-medium truncate max-w-[200px]">
                    {translateIngredient(item.ingredient.name)}
                  </span>
                  <span className="font-mono text-wood font-bold">{item.ratioPercent}%</span>
                </div>
              ))}

              <div className="flex items-center justify-between pt-2 text-[10px] text-wood/70 border-t border-wood/10">
                <span>🌡️ {waterTempC}°C</span>
                <span>⏳ {steepingTimeSec}s</span>
                <span>💧 {waterAmountMl}ml</span>
                {garnishes.length > 0 && <span>🌸 {garnishes.join(", ")}</span>}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-5 space-y-2">
            <Button
              onClick={handleCopyShare}
              className="w-full bg-dark-wood hover:bg-wood text-cream rounded-xl py-2.5 font-medium flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{t.linkCopied}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>{t.copyCardLink}</span>
                </>
              )}
            </Button>

            <p className="text-[10px] text-center text-wood/60">
              {lang === "th"
                ? `แบ่งปันรหัสสูตร ${blendCode} กับคนรักชาทั่วโลก 🍵`
                : `Share your custom code ${blendCode} with tea lovers worldwide 🍵`}
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default TeaPostcardModal;
