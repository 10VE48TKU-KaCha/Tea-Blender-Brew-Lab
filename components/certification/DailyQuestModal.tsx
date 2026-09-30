"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DailyMysteryQuest,
  getTodayDailyQuest,
  evaluateDailyQuest,
  isDailyQuestCompleted,
  markDailyQuestCompleted,
} from "@/lib/certification-engine";
import { getSavedCoins, saveCoins } from "@/lib/cafe-engine";
import { playChime } from "@/lib/audio";
import { useLanguage } from "@/context/LanguageContext";
import { BlendInput, ExtractionResult } from "@/types/tea";
import { Button } from "@/components/ui/button";
import {
  Target,
  X,
  Coins,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Flame,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DailyQuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentExtraction: ExtractionResult | null;
  currentBlendInputs: BlendInput[];
  waterTempC: number;
  steepingTimeSec: number;
}

export default function DailyQuestModal({
  isOpen,
  onClose,
  currentExtraction,
  currentBlendInputs,
  waterTempC,
  steepingTimeSec,
}: DailyQuestModalProps) {
  const { lang } = useLanguage();
  const [quest, setQuest] = useState<DailyMysteryQuest | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [justClaimed, setJustClaimed] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      const q = getTodayDailyQuest();
      setQuest(q);
      setIsCompleted(isDailyQuestCompleted(q.id));
    }
  }, [isOpen]);

  if (!isOpen || !quest) return null;

  const evaluation = evaluateDailyQuest(
    quest,
    currentExtraction,
    currentBlendInputs,
    waterTempC,
    steepingTimeSec
  );

  const handleClaimReward = () => {
    if (!evaluation.isPassed || isCompleted) return;

    // Add reward coins to cafe balance
    const currentCoins = getSavedCoins();
    saveCoins(currentCoins + quest.rewardCoins);
    markDailyQuestCompleted(quest.id);

    setIsCompleted(true);
    setJustClaimed(true);
    playChime();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-xl bg-[#FDFBF7] border border-amber-900/20 rounded-3xl shadow-2xl overflow-hidden text-stone-900"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-950/10 bg-amber-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-600/10 text-amber-700 flex items-center justify-center border border-amber-600/20 shadow-xs">
              <Target className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-display font-bold text-base text-stone-900">
                  {lang === "th" ? "เควสต์ปริศนาประจำวัน" : "Daily Mystery Order"}
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 font-mono font-bold">
                  {quest.dateKey}
                </span>
              </div>
              <p className="text-xs text-stone-600">
                {lang === "th"
                  ? "เบลนด์ชาตามความปรารถนาของลูกค้าปริศนาเพื่อรับเหรียญทอง"
                  : "Satisfy the sensory craving of today's visiting tea connoisseur"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-black/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Patron Banner Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-100/70 via-stone-50 to-orange-100/50 border border-amber-200/80 shadow-xs flex items-start gap-3.5">
            <div className="text-4xl p-2 rounded-2xl bg-white/90 border border-amber-200/60 shadow-xs shrink-0">
              {quest.patronAvatar}
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-bold text-sm text-stone-900">{quest.patronName}</h4>
                <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-800 font-bold font-mono text-xs border border-amber-500/20">
                  <Coins className="w-3.5 h-3.5 text-amber-600" />
                  <span>+{quest.rewardCoins}</span>
                </div>
              </div>
              <p className="text-[11px] font-medium text-amber-800">
                {lang === "th" ? quest.patronTitleTh : quest.patronTitleEn}
              </p>
              <p className="text-xs text-stone-700 italic leading-relaxed pt-1">
                {lang === "th" ? quest.storyTh : quest.storyEn}
              </p>
            </div>
          </div>

          {/* Flavor Clue */}
          <div className="p-3 rounded-xl bg-white border border-stone-200 text-xs flex items-center justify-between gap-2">
            <span className="font-bold text-stone-700">
              {lang === "th" ? "คำใบ้รสชาติเป้าหมาย:" : "Sensory Target Clue:"}
            </span>
            <span className="font-semibold text-amber-800">
              {lang === "th" ? quest.flavorHintTh : quest.flavorHintEn}
            </span>
          </div>

          {/* Live Criteria Verification List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-stone-700">
                {lang === "th" ? "การตรวจสอบรสชาติแบบเรียลไทม์:" : "Real-Time Blend Status:"}
              </span>
              <span
                className={cn(
                  "font-bold font-mono text-xs px-2 py-0.5 rounded-full",
                  evaluation.isPassed
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                )}
              >
                {evaluation.scorePercent}% {lang === "th" ? "ตรงตามเกณฑ์" : "Match"}
              </span>
            </div>

            <div className="space-y-1.5">
              {evaluation.checks.map((check, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex items-center justify-between p-2.5 rounded-xl border text-xs transition-colors",
                    check.passed
                      ? "bg-emerald-50/60 border-emerald-200 text-emerald-950"
                      : "bg-stone-50 border-stone-200 text-stone-700"
                  )}
                >
                  <div className="flex items-center gap-2">
                    {check.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-stone-400 shrink-0" />
                    )}
                    <span className="font-medium">
                      {lang === "th" ? check.labelTh : check.labelEn}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className={check.passed ? "text-emerald-700 font-bold" : "text-stone-500"}>
                      {check.currentValue}
                    </span>
                    <span className="text-stone-400">/</span>
                    <span className="text-stone-700 font-semibold">{check.targetValue}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Completion Celebration or Action Button */}
          {isCompleted ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-1.5">
              <div className="flex items-center justify-center gap-2 font-bold text-emerald-800 text-sm">
                <Award className="w-5 h-5 text-emerald-600" />
                <span>{lang === "th" ? "สำเร็จเควสต์ประจำวันนี้แล้ว!" : "Daily Quest Completed Today!"}</span>
              </div>
              <p className="text-xs text-emerald-700">
                {lang === "th"
                  ? "คุณได้รับเหรียญรางวัลเรียบร้อยแล้ว แวะกลับมาใหม่ในวันพรุ่งนี้สำหรับออร์เดอร์ถัดไป"
                  : "You've earned the coin bounty. Return tomorrow for a brand new mystery patron!"}
              </p>
            </div>
          ) : evaluation.isPassed ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-3"
            >
              <Button
                onClick={handleClaimReward}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-900/20 text-sm flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-101 active:scale-98"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {lang === "th"
                    ? `เสิร์ฟน้ำชา & รับรางวัล +${quest.rewardCoins} เหรียญทอง!`
                    : `Serve Tea & Claim +${quest.rewardCoins} Coins!`}
                </span>
              </Button>
            </motion.div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <p className="text-xs text-stone-500">
                {lang === "th"
                  ? "💡 ปรับสัดส่วนใบชา หรือเลื่อนแถบอุณหภูมิ/เวลาในแล็บเพื่อให้ตรงเป้าหมาย"
                  : "💡 Adjust tea ratios, temperature, or steeping time in Lab to hit criteria"}
              </p>
              <Button
                onClick={onClose}
                variant="outline"
                size="sm"
                className="rounded-xl text-xs font-semibold shrink-0 cursor-pointer"
              >
                <span>{lang === "th" ? "ปรับแต่งในแล็บต่อ" : "Tune in Lab"}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
