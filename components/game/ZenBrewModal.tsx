"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CozyCupScene, ServingStyle, CupVesselType, CupGlaze, CoasterStyle, LatteArtType } from "./CozyCupScene";
import { playChime, playWaterPour, playSoftTick, playSipSound } from "@/lib/audio";
import { Button } from "@/components/ui/button";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  X,
  Sparkles,
  Check,
  Droplets,
  Leaf,
  Flame,
  Coffee,
  Heart,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

interface ZenBrewModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalSeconds: number;
  targetHex: string;
  title: string;
  waterTempC: number;
  servingStyle?: ServingStyle;
  vesselType?: CupVesselType;
  cupGlaze?: CupGlaze;
  coasterStyle?: CoasterStyle;
  latteArt?: LatteArtType;
  garnishes: string[];
}

type CeremonyStep = "water" | "leaves" | "steeping" | "sipping";

export function ZenBrewModal({
  isOpen,
  onClose,
  totalSeconds,
  targetHex,
  title,
  waterTempC,
  servingStyle = "hot",
  vesselType,
  cupGlaze,
  coasterStyle,
  latteArt,
  garnishes,
}: ZenBrewModalProps) {
  const { t, lang } = useLanguage();
  const [currentStep, setCurrentStep] = useState<CeremonyStep>("water");

  // Steeping Timer State
  const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  // Sipping State (ดื่มด่ำกับชา: น้ำชาค่อยๆ ลดลงเหมือนโดนจิบเรื่อยๆ จนหมด)
  const [sipLevel, setSipLevel] = useState(1.0); // 1.0 -> 0.0
  const [isSipping, setIsSipping] = useState(false);
  const [isCupEmpty, setIsCupEmpty] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const sipIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const quotes = t.zenQuotes;

  // Initialize/reset when modal opens or totalSeconds change
  useEffect(() => {
    if (isOpen) {
      setCurrentStep("water");
      setRemainingSeconds(totalSeconds);
      setIsRunning(false);
      setIsCompleted(false);
      setSipLevel(1.0);
      setIsSipping(false);
      setIsCupEmpty(false);
      setCurrentQuoteIndex(Math.floor(Math.random() * quotes.length));
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (sipIntervalRef.current) clearInterval(sipIntervalRef.current);
    }
  }, [isOpen, totalSeconds, quotes.length]);

  // Main countdown timer loop for steeping phase
  useEffect(() => {
    if (isRunning && remainingSeconds > 0) {
      timerRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            setIsCompleted(true);
            setCurrentStep("sipping");
            if (soundEnabled) {
              playChime();
            }
            return 0;
          }
          if (soundEnabled && prev % 2 === 0) {
            playSoftTick();
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, remainingSeconds, soundEnabled]);

  // Rotate quotes periodically
  useEffect(() => {
    if (!isRunning && !isSipping) return;
    const quoteInterval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 12000);
    return () => clearInterval(quoteInterval);
  }, [isRunning, isSipping, quotes.length]);

  // Handle Sipping animation (Tea gradually drains as user sips)
  useEffect(() => {
    if (isSipping && sipLevel > 0) {
      sipIntervalRef.current = setInterval(() => {
        setSipLevel((prev) => {
          const next = Math.max(0, prev - 0.08); // 8% per step (~12-14 pleasant sips)
          if (soundEnabled && next > 0) {
            playSipSound();
          }
          if (next <= 0) {
            clearInterval(sipIntervalRef.current!);
            setIsSipping(false);
            setIsCupEmpty(true);
            if (soundEnabled) {
              playChime();
            }
            return 0;
          }
          return next;
        });
      }, 900);
    } else {
      if (sipIntervalRef.current) clearInterval(sipIntervalRef.current);
    }

    return () => {
      if (sipIntervalRef.current) clearInterval(sipIntervalRef.current);
    };
  }, [isSipping, sipLevel, soundEnabled]);

  if (!isOpen) return null;

  // Steeping progress calculation (0% to 100%)
  const progressPercent = Math.min(
    100,
    Math.max(0, ((totalSeconds - remainingSeconds) / totalSeconds) * 100)
  );

  // Dynamic Liquid Level & Presentation depending on the Ceremony Step:
  // Step 1: Water - Clear water fill (level = 0.9)
  // Step 2: Leaves added - Leaves and water start mixing (level = 1.0, light color)
  // Step 3: Steeping - Full cup (level = 1.0), color intensifies as timer runs
  // Step 4: Sipping - Tea drains from 1.0 down to 0.0 as user drinks
  let effectiveLiquidLevel = 1.0;
  let effectiveColor = targetHex;
  let effectiveOpacity = 0.85;
  let effectiveGarnishes = garnishes;

  if (currentStep === "water") {
    effectiveLiquidLevel = 0.85;
    effectiveColor = "#D4EAF7"; // Clear water tone
    effectiveOpacity = 0.35;
    effectiveGarnishes = [];
  } else if (currentStep === "leaves") {
    effectiveLiquidLevel = 0.95;
    effectiveColor = targetHex;
    effectiveOpacity = 0.45;
    effectiveGarnishes = garnishes;
  } else if (currentStep === "steeping") {
    effectiveLiquidLevel = 1.0;
    effectiveOpacity = 0.3 + (progressPercent / 100) * 0.7;
    effectiveColor = targetHex;
    effectiveGarnishes = garnishes;
  } else if (currentStep === "sipping") {
    effectiveLiquidLevel = sipLevel;
    effectiveOpacity = 0.85;
    effectiveColor = targetHex;
    effectiveGarnishes = garnishes;
  }

  const handleStartSteep = () => {
    if (soundEnabled && remainingSeconds === totalSeconds) {
      playWaterPour(2200);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsSipping(false);
    setRemainingSeconds(totalSeconds);
    setIsCompleted(false);
    setSipLevel(1.0);
    setIsCupEmpty(false);
    setCurrentStep("water");
  };

  const handleStartSip = () => {
    if (soundEnabled) {
      playSipSound();
    }
    setIsSipping(true);
  };

  const handlePauseSip = () => {
    setIsSipping(false);
  };

  const formatClock = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Steeping Phase Indicator
  const getSteepingPhase = () => {
    if (isCupEmpty) return t.cupEmptied;
    if (currentStep === "sipping") {
      return isSipping ? t.sippingInProgress : t.enjoyTea;
    }
    if (currentStep === "water") return t.stepWarmWater;
    if (currentStep === "leaves") return t.stepAddLeaves;
    if (isCompleted) return t.phasePerfected;
    if (progressPercent < 20) return t.phaseAwakening;
    if (progressPercent < 50) return t.phaseUnfurling;
    if (progressPercent < 80) return t.phaseAromas;
    return t.phaseHarmony;
  };

  const servingStyleLabel =
    servingStyle === "hot"
      ? t.styleHot
      : servingStyle === "iced"
      ? t.styleIced
      : t.styleLatte;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-900/75 backdrop-blur-md"
        />

        {/* Modal Window: responsive max-height, flex layout with fixed header/footer and scrollable body */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-sm sm:max-w-md md:max-w-lg bg-[#FAF6EE] rounded-3xl p-3.5 sm:p-5 md:p-6 shadow-2xl border-2 border-[#8C5E45]/30 text-center overflow-hidden my-auto max-h-[92vh] flex flex-col justify-between"
        >
          {/* Header Controls (Fixed) */}
          <div className="flex items-center justify-between mb-2 shrink-0">
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 sm:p-2 rounded-full bg-[#8C5E45]/10 text-dark-wood hover:bg-[#8C5E45]/20 transition-colors cursor-pointer"
              title={soundEnabled ? t.muteSounds : t.unmuteSounds}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-[#8C5E45]" /> : <VolumeX className="w-4 h-4 text-wood/50" />}
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 sm:py-1 rounded-full bg-gradient-to-r from-amber-100 to-amber-200/80 border border-amber-300 text-amber-900 text-[11px] sm:text-xs font-bold tracking-wide shadow-xs">
              <span>🫖</span>
              <span>{t.zenSteepingProcess}</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-full bg-[#8C5E45]/10 text-dark-wood hover:bg-[#8C5E45]/20 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Stepping Indicator Ribbon (Fixed) */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-white/70 rounded-2xl border border-[#8C5E45]/15 mb-2 text-[10px] sm:text-[11px] font-semibold shrink-0">
            {/* Step 1: Water */}
            <button
              type="button"
              onClick={() => {
                if (!isRunning && !isSipping) setCurrentStep("water");
              }}
              className={cn(
                "py-1 px-1 rounded-xl transition-all flex flex-col items-center gap-0.5 cursor-pointer",
                currentStep === "water"
                  ? "bg-amber-600 text-white shadow-sm font-bold"
                  : "text-wood/70 hover:text-dark-wood hover:bg-amber-50/50"
              )}
            >
              <Droplets className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="truncate max-w-[65px]">{lang === "th" ? "รินน้ำร้อน" : "1. Water"}</span>
            </button>

            {/* Step 2: Leaves */}
            <button
              type="button"
              onClick={() => {
                if (!isRunning && !isSipping) setCurrentStep("leaves");
              }}
              className={cn(
                "py-1 px-1 rounded-xl transition-all flex flex-col items-center gap-0.5 cursor-pointer",
                currentStep === "leaves"
                  ? "bg-amber-600 text-white shadow-sm font-bold"
                  : "text-wood/70 hover:text-dark-wood hover:bg-amber-50/50"
              )}
            >
              <Leaf className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="truncate max-w-[65px]">{lang === "th" ? "ใส่ใบชา" : "2. Leaves"}</span>
            </button>

            {/* Step 3: Steeping */}
            <button
              type="button"
              onClick={() => {
                if (!isSipping) setCurrentStep("steeping");
              }}
              className={cn(
                "py-1 px-1 rounded-xl transition-all flex flex-col items-center gap-0.5 cursor-pointer",
                currentStep === "steeping"
                  ? "bg-amber-600 text-white shadow-sm font-bold"
                  : "text-wood/70 hover:text-dark-wood hover:bg-amber-50/50"
              )}
            >
              <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="truncate max-w-[65px]">{lang === "th" ? "สกัดชา" : "3. Steep"}</span>
            </button>

            {/* Step 4: Savor & Drink */}
            <button
              type="button"
              onClick={() => {
                if (isCompleted || currentStep === "sipping") {
                  setCurrentStep("sipping");
                }
              }}
              className={cn(
                "py-1 px-1 rounded-xl transition-all flex flex-col items-center gap-0.5 cursor-pointer",
                currentStep === "sipping"
                  ? "bg-amber-700 text-white shadow-sm font-bold ring-2 ring-amber-400"
                  : "text-wood/70 hover:text-dark-wood hover:bg-amber-50/50"
              )}
            >
              <Coffee className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="truncate max-w-[65px]">{lang === "th" ? "จิบดื่มด่ำ" : "4. Savor"}</span>
            </button>
          </div>

          {/* Scrollable Center Body Area */}
          <div className="flex-1 overflow-y-auto px-1 py-1 space-y-1.5 scrollbar-thin">
            {/* Title & Subtitle */}
            <div className="space-y-0.5">
              <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-dark-wood tracking-tight">
                {title || (lang === "th" ? "การชงชาช่างศิลป์" : "Artisan's Steep")}
              </h2>
              <div className="flex items-center justify-center gap-1.5 text-[11px] sm:text-xs text-wood font-medium flex-wrap">
                <span className="px-1.5 py-0.5 rounded bg-amber-100/60 font-semibold text-amber-900">{waterTempC}°C</span>
                <span>•</span>
                <span>{servingStyleLabel}</span>
                <span>•</span>
                <span className="text-amber-800 font-bold">{getSteepingPhase()}</span>
              </div>
            </div>

            {/* Teacup Live Diffusion & Level Draining Scene */}
            <div className="relative py-0 sm:py-1 flex justify-center items-center">
              {/* Ambient Aura Glow reflecting tea color */}
              <motion.div
                animate={{
                  scale: isRunning || isSipping ? [1, 1.07, 1] : 1,
                  opacity: effectiveOpacity * 0.4 * Math.max(0.1, effectiveLiquidLevel),
                }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-full blur-2xl -z-0 pointer-events-none"
                style={{ backgroundColor: effectiveColor }}
              />

              {/* Redesigned Cozy Cup with dynamic liquidLevel and responsive scaling */}
              <div className="w-44 sm:w-52 md:w-56 relative z-10 mx-auto">
                <CozyCupScene
                  liquidColor={effectiveColor}
                  opacity={effectiveOpacity}
                  liquidLevel={effectiveLiquidLevel}
                  steamIntensity={
                    isRunning
                      ? Math.max(0.45, (waterTempC - 50) / 45)
                      : currentStep === "sipping" && sipLevel > 0.1
                      ? 0.35 * sipLevel
                      : currentStep === "water"
                      ? 0.4
                      : 0.2
                  }
                  servingStyle={servingStyle}
                  vesselType={vesselType}
                  cupGlaze={cupGlaze}
                  coasterStyle={coasterStyle}
                  latteArt={latteArt}
                  garnishes={effectiveGarnishes}
                />
              </div>
            </div>

            {/* Central Status / Progress Display depending on Step */}
            {currentStep === "steeping" && (
              <div className="space-y-1.5">
                <div className="text-4xl sm:text-5xl font-mono font-bold text-dark-wood tracking-tight drop-shadow-sm">
                  {formatClock(remainingSeconds)}
                </div>

                {/* Steeping Progress Bar */}
                <div className="w-full max-w-xs mx-auto h-2 bg-amber-900/15 rounded-full overflow-hidden p-0.5 border border-amber-900/20">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: targetHex || "#D4A574" }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ ease: "linear", duration: 0.5 }}
                  />
                </div>
              </div>
            )}

            {currentStep === "sipping" && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl sm:text-3xl font-mono font-bold text-amber-900">
                    {Math.round(sipLevel * 100)}%
                  </span>
                  <span className="text-xs text-wood font-medium">
                    {isCupEmpty ? (lang === "th" ? "จิบหมดแล้ว" : "Empty") : (lang === "th" ? "น้ำชาที่เหลือ" : "Remaining")}
                  </span>
                </div>

                {/* Liquid Level Savor Bar */}
                <div className="w-full max-w-xs mx-auto h-2.5 bg-amber-950/15 rounded-full overflow-hidden p-0.5 border border-amber-900/30">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-700"
                    animate={{ width: `${Math.round(sipLevel * 100)}%` }}
                    transition={{ ease: "easeInOut", duration: 0.4 }}
                  />
                </div>
              </div>
            )}

            {currentStep === "water" && (
              <div className="p-2 sm:p-2.5 bg-blue-50/70 border border-blue-200 rounded-xl text-[11px] sm:text-xs text-blue-900 leading-relaxed font-medium">
                💧 {lang === "th" ? `รินน้ำร้อนอุณหภูมิ ${waterTempC}°C ลงสู่ภาชนะเพื่ออุ่นถ้วยและเตรียมพร้อม` : `Pouring hot water at ${waterTempC}°C to warm the cup.`}
              </div>
            )}

            {currentStep === "leaves" && (
              <div className="p-2 sm:p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-[11px] sm:text-xs text-emerald-900 leading-relaxed font-medium">
                🍃 {lang === "th" ? "ใส่ใบชาชั้นดีและส่วนผสมกลิ่นดอกไม้ลงในน้ำร้อน พร้อมเริ่มต้นการสกัด" : "Adding artisan tea leaves and botanicals into the cup."}
              </div>
            )}

            {/* Zen Quotes or Completion State */}
            <div className="min-h-[38px] flex items-center justify-center px-2">
              <AnimatePresence mode="wait">
                {isCupEmpty ? (
                  <motion.div
                    key="cup-empty"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-2 sm:p-2.5 bg-amber-100/90 border border-amber-300 text-amber-950 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Heart className="w-4 h-4 text-amber-700 fill-amber-600 shrink-0" />
                    <span>{t.cupEmptied}</span>
                  </motion.div>
                ) : isCompleted && currentStep === "sipping" ? (
                  <motion.div
                    key="completed"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-2 sm:p-2.5 bg-emerald-100/95 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{t.steepingComplete}</span>
                  </motion.div>
                ) : (
                  <motion.p
                    key={`${currentQuoteIndex}-${lang}`}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="text-[11px] sm:text-xs text-wood/80 italic max-w-sm mx-auto leading-relaxed"
                  >
                    {quotes[currentQuoteIndex % quotes.length]}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom Action Controls (Fixed at bottom, never clipped) */}
          <div className="flex items-center justify-center gap-2 pt-2 sm:pt-3 border-t border-[#8C5E45]/15 shrink-0 flex-wrap">
            {/* Step 1 button: Advance to leaves */}
            {currentStep === "water" && (
              <Button
                onClick={() => {
                  if (soundEnabled) playWaterPour(1500);
                  setCurrentStep("leaves");
                }}
                className="px-5 py-2 sm:py-2.5 bg-gradient-to-r from-[#8C5E45] to-[#6A432D] hover:from-[#6A432D] hover:to-[#533423] text-[#FAF6EE] rounded-full font-medium flex items-center gap-1.5 shadow-md cursor-pointer transition-all hover:scale-105 active:scale-95 text-xs sm:text-sm"
              >
                <Leaf className="w-4 h-4" />
                <span>{lang === "th" ? "ถัดไป: ใส่ใบชาและส่วนผสม" : "Next: Add Tea Leaves"}</span>
              </Button>
            )}

            {/* Step 2 button: Advance to steeping */}
            {currentStep === "leaves" && (
              <Button
                onClick={() => {
                  setCurrentStep("steeping");
                  handleStartSteep();
                }}
                className="px-5 py-2 sm:py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-full font-medium flex items-center gap-1.5 shadow-md cursor-pointer transition-all hover:scale-105 active:scale-95 text-xs sm:text-sm"
              >
                <Flame className="w-4 h-4" />
                <span>{lang === "th" ? "ถัดไป: เริ่มจับเวลาการสกัดชา" : "Next: Start Live Steeping"}</span>
              </Button>
            )}

            {/* Step 3 buttons: Steeping controls */}
            {currentStep === "steeping" && (
              <>
                {!isRunning ? (
                  <Button
                    onClick={handleStartSteep}
                    className="px-5 py-2 sm:py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-full font-medium flex items-center gap-1.5 shadow-md cursor-pointer transition-all hover:scale-105 active:scale-95 text-xs sm:text-sm"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>{remainingSeconds === totalSeconds ? t.startSteep : t.resumeSteep}</span>
                  </Button>
                ) : (
                  <Button
                    onClick={handlePause}
                    variant="outline"
                    className="px-5 py-2 sm:py-2.5 border-amber-800/40 text-amber-950 bg-white/80 hover:bg-amber-100/50 rounded-full font-medium flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-xs text-xs sm:text-sm"
                  >
                    <Pause className="w-4 h-4" />
                    <span>{t.pauseSteep}</span>
                  </Button>
                )}

                {/* Direct shortcut to Savor & Drink if user wants to fast-forward */}
                <Button
                  onClick={() => {
                    setIsRunning(false);
                    setIsCompleted(true);
                    setCurrentStep("sipping");
                  }}
                  className="px-3.5 py-2 bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white rounded-full font-medium text-xs flex items-center gap-1 shadow-md cursor-pointer transition-all hover:scale-105 active:scale-95"
                >
                  <Coffee className="w-3.5 h-3.5" />
                  <span>{t.enjoyTea}</span>
                </Button>
              </>
            )}

            {/* Step 4 buttons: "ดื่มด่ำกับชา" (Sipping / Drinking) with gradual liquid reduction */}
            {currentStep === "sipping" && (
              <>
                {!isCupEmpty ? (
                  !isSipping ? (
                    <Button
                      onClick={handleStartSip}
                      className="px-6 py-2.5 bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 hover:from-amber-800 hover:to-amber-950 text-white rounded-full font-bold flex items-center gap-2 shadow-lg ring-2 ring-amber-400/50 cursor-pointer transition-all hover:scale-105 active:scale-95 text-xs sm:text-sm"
                    >
                      <Coffee className="w-4 h-4" />
                      <span>{t.startSipping}</span>
                    </Button>
                  ) : (
                    <Button
                      onClick={handlePauseSip}
                      className="px-5 py-2 bg-amber-900/80 hover:bg-amber-950 text-white rounded-full font-medium flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95 text-xs sm:text-sm"
                    >
                      <Pause className="w-4 h-4" />
                      <span>{lang === "th" ? "หยุดพักการจิบ" : "Pause Sip"}</span>
                    </Button>
                  )
                ) : (
                  <Button
                    onClick={handleReset}
                    className="px-5 py-2 bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white rounded-full font-semibold flex items-center gap-1.5 shadow-md cursor-pointer transition-all hover:scale-105 active:scale-95 text-xs sm:text-sm"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{t.brewAgain}</span>
                  </Button>
                )}

                <Button
                  onClick={onClose}
                  variant="outline"
                  className="px-3.5 py-2 border-[#8C5E45]/40 text-[#533423] bg-white/70 hover:bg-amber-50 rounded-full font-medium text-xs flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{lang === "th" ? "ปิดหน้าต่าง" : "Done"}</span>
                </Button>
              </>
            )}

            {/* Reset Button */}
            <Button
              onClick={handleReset}
              variant="ghost"
              className="p-2 text-wood hover:text-dark-wood hover:bg-[#8C5E45]/10 rounded-full cursor-pointer transition-transform active:scale-95"
              title={t.resetTimer}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default ZenBrewModal;
