"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExtractionResult, BlendInput } from "@/types/tea";
import { ServingStyle } from "./CozyCupScene";
import FlavorRadarChart from "@/components/charts/FlavorRadarChart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Copy, Check, Share2, Sparkles, Download } from "lucide-react";

interface TeaPostcardModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  extraction: ExtractionResult;
  blendInputs: BlendInput[];
  waterTempC: number;
  steepingTimeSec: number;
  waterAmountMl: number;
  servingStyle: ServingStyle;
  garnishes: string[];
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
  servingStyle,
  garnishes,
}: TeaPostcardModalProps) {
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const activeBlends = blendInputs.filter((b) => b.ratioPercent > 0);
  const blendCode = extraction.blendCode || "#KISSA-8888";
  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const radarData = [
    { dimension: "Sweetness", score: extraction.sweetnessScore, fullMark: 10 },
    { dimension: "Aroma", score: extraction.aromaScore, fullMark: 10 },
    { dimension: "Body", score: extraction.bodyScore, fullMark: 10 },
    { dimension: "Bitterness", score: extraction.bitternessScore, fullMark: 10 },
    { dimension: "Clarity", score: extraction.clarityScore, fullMark: 10 },
  ];

  const handleCopyShare = () => {
    const ingredientsText = activeBlends
      .map((b) => `${b.ingredient.name} (${b.ratioPercent}%)`)
      .join(", ");

    const shareText = `🍵 [Kissa Lab] Crafted Recipe: "${title || extraction.cozyTitle}"\n` +
      `Code: ${blendCode}\n` +
      `Blend: ${ingredientsText}\n` +
      `Parameters: ${waterTempC}°C | ${steepingTimeSec}s | ${waterAmountMl}ml (${servingStyle})\n` +
      `Notes: "${extraction.tastingNotes}"\n` +
      `Craft your cozy cup at: ${window.location.origin}/lab`;

    navigator.clipboard.writeText(shareText);
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
              <span>Vintage Tea Ticket</span>
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
                Certified by Kissa Laboratory • {dateStr}
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

            {/* Tea Liquor & Glaze Preview */}
            <div className="flex items-center gap-3 my-4 p-3 bg-[#FAF6EE] rounded-xl border border-wood/10">
              <div
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm shrink-0"
                style={{ backgroundColor: extraction.renderedHex }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-dark-wood">Tea Liquor</span>
                  <span className="font-mono text-[11px] text-wood">{extraction.renderedHex}</span>
                </div>
                <div className="text-[10px] text-wood/70 mt-0.5">
                  Glaze: <span className="capitalize font-medium text-dark-wood">{extraction.cupGlaze || "Ceramic"}</span> •{" "}
                  Style: <span className="capitalize font-medium text-dark-wood">{servingStyle}</span>
                </div>
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
                Artisan Formula
              </div>
              {activeBlends.map((item) => (
                <div key={item.ingredient.id} className="flex justify-between text-xs">
                  <span className="text-dark-wood font-medium truncate max-w-[200px]">
                    {item.ingredient.name}
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
                  <span>Recipe & Code Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Recipe & Show Friends</span>
                </>
              )}
            </Button>

            <p className="text-[10px] text-center text-wood/60">
              Share your custom code {blendCode} with tea lovers worldwide 🍵
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default TeaPostcardModal;
