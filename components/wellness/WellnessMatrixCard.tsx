"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WellnessAnalysis } from "@/lib/wellness-engine";
import { useLanguage } from "@/context/LanguageContext";
import { HeartPulse, ChevronDown, ChevronUp, Clock, Zap, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface WellnessMatrixCardProps {
  wellness: WellnessAnalysis;
}

export default function WellnessMatrixCard({ wellness }: WellnessMatrixCardProps) {
  const { lang } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  if (wellness.overallScore === 0) return null;

  return (
    <div className="vibrant-glass-card rounded-3xl p-5 shadow-md border border-emerald-500/20 bg-gradient-to-br from-emerald-50/40 via-white/80 to-teal-50/30 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-600/10 text-emerald-700 flex items-center justify-center border border-emerald-600/20 shadow-xs">
            <HeartPulse className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
              <span>{lang === "th" ? "เมทริกซ์สุขภาพ & สรรพคุณสมุนไพร" : "Functional Wellness Matrix"}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100/90 text-emerald-800 font-mono font-bold border border-emerald-300">
                {wellness.overallScore}/10
              </span>
            </h4>
            <p className="text-xs text-stone-600 font-medium">
              {lang === "th" ? wellness.primaryBenefitTh : wellness.primaryBenefitEn}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-stone-500 hover:text-stone-900 p-1.5 rounded-xl hover:bg-emerald-100/40 transition-colors"
          aria-label="Toggle wellness details"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Sommelier Wellness Quote */}
      <div className="p-3 rounded-2xl bg-white/70 border border-emerald-200/60 shadow-xs text-xs text-stone-700 italic leading-relaxed flex items-start gap-2">
        <span className="text-emerald-600 text-sm">❝</span>
        <span>{lang === "th" ? wellness.wellnessQuoteTh : wellness.wellnessQuoteEn}</span>
      </div>

      {/* Quick Pills: Caffeine & Best Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-2 p-2 rounded-xl bg-white/60 border border-stone-200/60">
          <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <div className="truncate">
            <span className="font-semibold text-stone-700 mr-1">
              {lang === "th" ? "ระดับคาเฟอีน:" : "Caffeine:"}
            </span>
            <span className="text-stone-600 text-[11px]">
              {lang === "th" ? wellness.caffeineDescTh : wellness.caffeineDescEn}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-xl bg-white/60 border border-stone-200/60">
          <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          <div className="truncate">
            <span className="font-semibold text-stone-700 mr-1">
              {lang === "th" ? "ช่วงเวลาดื่มที่เหมาะ:" : "Best Time:"}
            </span>
            <span className="text-stone-600 text-[11px]">
              {lang === "th" ? wellness.bestTimeToDrinkTh : wellness.bestTimeToDrinkEn}
            </span>
          </div>
        </div>
      </div>

      {/* Functional Badges */}
      {wellness.functionalTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {wellness.functionalTags.map((tag, idx) => (
            <span
              key={idx}
              className={cn("text-[11px] px-2.5 py-0.5 rounded-full font-medium border shadow-2xs", tag.color)}
            >
              {lang === "th" ? tag.labelTh : tag.labelEn}
            </span>
          ))}
        </div>
      )}

      {/* 5 Dimensional Progress Bars (Expandable) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 pt-2 border-t border-emerald-200/50"
          >
            {wellness.dimensions.map((dim) => (
              <div key={dim.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-stone-800">
                    <span>{dim.icon}</span>
                    <span>{lang === "th" ? dim.nameTh : dim.nameEn}</span>
                  </div>
                  <span className="font-mono font-bold text-stone-700">{dim.score.toFixed(1)}/10</span>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(dim.score / 10) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: dim.color }}
                  />
                </div>
                <p className="text-[10px] text-stone-500 italic pl-5">
                  {lang === "th" ? dim.summaryTh : dim.summaryEn}
                </p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
