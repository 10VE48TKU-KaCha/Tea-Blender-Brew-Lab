"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CustomerProfile } from "@/types/cafe";
import { ExtractionResult, TeaIngredient } from "@/types/tea";
import { EvaluationResult } from "@/lib/cafe-engine";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Coins, Sparkles, Share2, Check, RefreshCw, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

interface TastingResultModalProps {
  customer: CustomerProfile;
  extraction: ExtractionResult | null;
  evaluation: EvaluationResult;
  blendRatios: Record<string, number>;
  ingredients: TeaIngredient[];
  waterTempC: number;
  steepingTimeSec: number;
  onNextCustomer: () => void;
  onBrewAgain: () => void;
}

export default function TastingResultModal({
  customer,
  extraction,
  evaluation,
  blendRatios,
  ingredients,
  waterTempC,
  steepingTimeSec,
  onNextCustomer,
  onBrewAgain,
}: TastingResultModalProps) {
  const { lang } = useLanguage();
  const [isSavingToLab, setIsSavingToLab] = useState<boolean>(false);
  const [savedRecipeId, setSavedRecipeId] = useState<string | null>(null);

  const handleSaveToLab = async () => {
    if (savedRecipeId || !extraction) return;
    setIsSavingToLab(true);

    try {
      const activeItems = Object.entries(blendRatios)
        .filter(([_, ratio]) => ratio > 0)
        .map(([ingredientId, ratioPercent]) => ({
          ingredientId,
          ratioPercent,
        }));

      const payload = {
        title: `${customer.name}'s Special: ${extraction.cozyTitle}`,
        description: `Artisan Cafe blend crafted for ${customer.name}. Rated ${evaluation.stars} Stars!`,
        waterTempC,
        waterAmountMl: 200,
        steepingTimeSec,
        renderedHex: extraction.renderedHex,
        servingStyle: customer.requiredStyle,
        blendItems: activeItems,
      };

      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        setSavedRecipeId(data.id);
      }
    } catch (err) {
      console.error("Failed to save cafe recipe to archive", err);
    } finally {
      setIsSavingToLab(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <Card className="w-full max-w-lg bg-white/95 backdrop-blur-md border-wood/30 shadow-2xl rounded-3xl overflow-hidden">
        <CardContent className="p-6 sm:p-8 text-center space-y-5">
          {/* Customer Avatar & Reaction */}
          <div className="relative inline-block mx-auto">
            <div className="w-20 h-20 rounded-full bg-amber-100 border-2 border-amber-400 flex items-center justify-center text-5xl shadow-md">
              {customer.avatarEmoji}
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute -top-2 -right-2 bg-amber-500 text-white rounded-full p-1.5 shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>
          </div>

          <div>
            <h3 className="text-2xl font-display font-bold text-dark-wood">
              {lang === "th" ? customer.nameTh : customer.name}
            </h3>
            <p className="text-xs text-wood italic mt-1">
              "{lang === "th" ? evaluation.feedbackTextTh : evaluation.feedbackText}"
            </p>
          </div>

          {/* Star Rating Presentation */}
          <div className="flex justify-center items-center gap-2 py-1">
            {[1, 2, 3].map((starIdx) => (
              <motion.div
                key={starIdx}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 + starIdx * 0.15 }}
              >
                <Star
                  className={`w-9 h-9 ${
                    starIdx <= evaluation.stars
                      ? "text-amber-500 fill-amber-400 drop-shadow-sm"
                      : "text-wood/20"
                  }`}
                />
              </motion.div>
            ))}
          </div>

          {/* Score & Coins Badge */}
          <div className="flex items-center justify-center gap-4 bg-cream/70 py-2.5 px-4 rounded-2xl border border-amber/20">
            <div className="text-xs text-dark-wood font-medium">
              {lang === "th" ? "คะแนนความแม่นยำ:" : "Precision Match:"}{" "}
              <span className="font-bold text-amber-800">{evaluation.totalScorePercent}%</span>
            </div>
            <div className="h-4 w-px bg-wood/20" />
            <div className="flex items-center gap-1 text-xs font-bold text-amber-900">
              <Coins className="w-4 h-4 text-amber-600" />
              <span>+{evaluation.coinsEarned} {lang === "th" ? "เหรียญใบชา" : "Tea Coins"}</span>
            </div>
          </div>

          {/* Extracted Tea Info */}
          {extraction && (
            <div className="bg-white/80 rounded-2xl p-3 border border-wood/15 text-xs text-wood space-y-1">
              <div className="font-bold text-dark-wood">✨ {extraction.cozyTitle} ✨</div>
              <div className="italic text-[11px]">"{extraction.tastingNotes}"</div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            {/* Sync to Lab button */}
            <div className="flex justify-center">
              {!savedRecipeId ? (
                <Button
                  onClick={handleSaveToLab}
                  disabled={isSavingToLab}
                  variant="outline"
                  className="w-full border-amber-600/40 text-amber-900 bg-amber-50/70 hover:bg-amber-100 rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
                >
                  <Share2 className="w-3.5 h-3.5 mr-1.5" />
                  {isSavingToLab
                    ? (lang === "th" ? "กำลังบันทึก..." : "Saving...")
                    : (lang === "th" ? "บันทึกสูตรนี้ลงคลัง Lab (Sync to Lab)" : "Save Recipe to Lab Archive")}
                </Button>
              ) : (
                <div className="flex items-center justify-center gap-2 w-full py-1.5 px-3 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-300 text-xs font-medium">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{lang === "th" ? "บันทึกเข้าสูตรชุมชนแล้ว!" : "Saved to Recipe Archive!"}</span>
                  <Link href={`/recipes/${savedRecipeId}`} className="underline font-bold ml-1 text-emerald-800">
                    {lang === "th" ? "เปิดดู ↗" : "View ↗"}
                  </Link>
                </div>
              )}
            </div>

            {/* Navigation buttons */}
            <div className="flex gap-2">
              <Button
                onClick={onBrewAgain}
                variant="outline"
                className="flex-1 border-2 border-wood/25 text-wood-dark font-semibold rounded-xl cursor-pointer text-xs hover:bg-cream"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                {lang === "th" ? "ชงใหม่ให้สมบูรณ์" : "Brew Again"}
              </Button>
              <Button
                onClick={onNextCustomer}
                className="flex-1 bg-gradient-to-r from-[#BA4A1E] via-[#C85826] to-[#D96830] hover:from-[#A43E16] hover:to-[#BA4A1E] text-white rounded-xl font-bold shadow-md shadow-orange-950/20 cursor-pointer text-xs py-2.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>{lang === "th" ? "รับลูกค้าคนถัดไป" : "Next Customer"}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
