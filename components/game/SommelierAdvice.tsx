"use client";

import React from "react";
import { SommelierAdvice, FoodPairing } from "@/lib/sommelier-engine";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Lightbulb, Utensils } from "lucide-react";
import { cn } from "@/lib/utils";

interface SommelierAdviceProps {
  advices: SommelierAdvice[];
  pairings: FoodPairing[];
}

export function SommelierAdviceSection({ advices, pairings }: SommelierAdviceProps) {
  return (
    <div className="w-full space-y-4">
      {/* 1. Extraction Intelligence & Guidance */}
      <Card className="bg-white/70 backdrop-blur-sm border-wood/20 shadow-sm overflow-hidden">
        <CardHeader className="py-3 px-4 bg-amber-light/10 border-b border-wood/10">
          <CardTitle className="text-sm font-semibold text-dark-wood flex items-center gap-2">
            <span>🍵</span> Tea Master's Extraction Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3.5 space-y-2.5">
          {advices.map((advice, idx) => {
            const isWarning = advice.level === "warning";
            const isGood = advice.level === "good";
            return (
              <div
                key={idx}
                className={cn(
                  "p-3 rounded-xl border text-xs leading-relaxed transition-all",
                  isWarning
                    ? "bg-amber-50/80 border-amber-300 text-amber-900"
                    : isGood
                    ? "bg-emerald-50/70 border-emerald-200 text-emerald-900"
                    : "bg-stone-50/80 border-stone-200 text-dark-wood"
                )}
              >
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  {isWarning ? (
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  ) : isGood ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <Lightbulb className="w-3.5 h-3.5 text-amber shrink-0" />
                  )}
                  <span>{advice.title}</span>
                </div>
                <p className="text-dark-wood/80">{advice.message}</p>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* 2. Pastry & Food Pairing Recommendations */}
      <Card className="bg-white/70 backdrop-blur-sm border-wood/20 shadow-sm overflow-hidden">
        <CardHeader className="py-3 px-4 bg-amber-light/10 border-b border-wood/10">
          <CardTitle className="text-sm font-semibold text-dark-wood flex items-center gap-2">
            <Utensils className="w-3.5 h-3.5 text-wood" />
            <span>Harmonious Pastry Pairings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3.5 space-y-2">
          {pairings.map((pairing, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-2.5 rounded-xl bg-white/60 border border-wood/10 hover:border-wood/30 transition-colors"
            >
              <span className="text-2xl p-1 rounded-lg bg-cream border border-wood/10 shrink-0">
                {pairing.emoji}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h5 className="font-semibold text-dark-wood text-xs truncate">
                    {pairing.name}
                  </h5>
                  <span className="text-[10px] uppercase tracking-wider text-wood/60 px-1.5 py-0.5 rounded bg-cream">
                    {pairing.category}
                  </span>
                </div>
                <p className="text-[11px] text-wood/80 mt-0.5 leading-snug">
                  {pairing.reason}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default SommelierAdviceSection;
