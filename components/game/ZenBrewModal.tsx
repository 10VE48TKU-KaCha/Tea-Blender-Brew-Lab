"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CozyCupScene, ServingStyle } from "./CozyCupScene";
import { playChime, playWaterPour, playSoftTick } from "@/lib/audio";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Play, Pause, RotateCcw, X, Sparkles, Check } from "lucide-react";

interface ZenBrewModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalSeconds: number;
  targetHex: string;
  title: string;
  waterTempC: number;
  servingStyle: ServingStyle;
  garnishes: string[];
}

const ZEN_QUOTES = [
  "“Water is the mother of tea, a teapot its father, and fire the teacher.”",
  "“Drink your tea slowly and reverently, as if it is the axis on which the world revolves.”",
  "“There is poetry in a cup of tea, steeped gently with patience and care.”",
  "“Listen to the water singing softly in the kettle; every second deepens the flavor.”",
  "“Quiet your mind, let the leaves unfurl their quiet fragrant secrets.”",
];

export function ZenBrewModal({
  isOpen,
  onClose,
  totalSeconds,
  targetHex,
  title,
  waterTempC,
  servingStyle,
  garnishes,
}: ZenBrewModalProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize/reset when modal opens or totalSeconds change
  useEffect(() => {
    if (isOpen) {
      setRemainingSeconds(totalSeconds);
      setIsRunning(false);
      setIsCompleted(false);
      setCurrentQuoteIndex(Math.floor(Math.random() * ZEN_QUOTES.length));
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [isOpen, totalSeconds]);

  // Main countdown timer loop
  useEffect(() => {
    if (isRunning && remainingSeconds > 0) {
      timerRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            setIsCompleted(true);
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
    if (!isRunning) return;
    const quoteInterval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % ZEN_QUOTES.length);
    }, 12000);
    return () => clearInterval(quoteInterval);
  }, [isRunning]);

  if (!isOpen) return null;

  const progressPercent = Math.min(
    100,
    Math.max(0, ((totalSeconds - remainingSeconds) / totalSeconds) * 100)
  );

  const handleStart = () => {
    if (soundEnabled && remainingSeconds === totalSeconds) {
      playWaterPour(2500);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setRemainingSeconds(totalSeconds);
    setIsCompleted(false);
  };

  const formatClock = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Color diffusion: opacity grows as progress increases
  const currentOpacity = 0.22 + (progressPercent / 100) * 0.78;

  // Steeping Phase Indicator
  const getSteepingPhase = () => {
    if (isCompleted) return "🍵 Infusion Perfected";
    if (progressPercent < 20) return "💧 Awakening the leaves";
    if (progressPercent < 50) return "🍃 Gentle leaf unfurling";
    if (progressPercent < 80) return "✨ Rich aromas blooming";
    return "🫖 Flavor harmony peaking";
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-900/65 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md sm:max-w-lg bg-[#FAF6F0] rounded-3xl p-5 sm:p-7 shadow-2xl border border-wood/25 text-center overflow-hidden my-auto max-h-[92vh] flex flex-col justify-between"
        >
          {/* Header Controls */}
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-full bg-wood/10 text-dark-wood hover:bg-wood/20 transition-colors cursor-pointer"
              title={soundEnabled ? "Mute sounds" : "Unmute sounds"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-wood/50" />}
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber/15 text-dark-wood text-xs font-semibold tracking-wide">
              <span>🫖</span>
              <span>Zen Steeping Process</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-wood/10 text-dark-wood hover:bg-wood/20 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-0.5 mb-1">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-dark-wood tracking-tight">
              {title || "Artisan's Steep"}
            </h2>
            <div className="flex items-center justify-center gap-2 text-xs text-wood font-medium">
              <span>{waterTempC}°C</span>
              <span>•</span>
              <span className="capitalize">{servingStyle} Style</span>
              <span>•</span>
              <span className="text-amber-700 font-semibold">{getSteepingPhase()}</span>
            </div>
          </div>

          {/* Teacup Live Diffusion Scene with Ambient Aura */}
          <div className="relative py-2 flex justify-center items-center">
            {/* Ambient Aura Glow reflecting tea color */}
            <motion.div
              animate={{
                scale: isRunning ? [1, 1.06, 1] : 1,
                opacity: currentOpacity * 0.35,
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-44 h-44 sm:w-52 sm:h-52 rounded-full blur-2xl -z-0 pointer-events-none"
              style={{ backgroundColor: targetHex }}
            />

            {/* Redesigned Cozy Cup */}
            <div className="w-56 sm:w-64 relative z-10">
              <CozyCupScene
                liquidColor={targetHex}
                opacity={currentOpacity}
                steamIntensity={isRunning ? Math.max(0.45, (waterTempC - 50) / 45) : 0.25}
                servingStyle={servingStyle}
                garnishes={garnishes}
              />
            </div>
          </div>

          {/* Digital Timer Clock & Steeping Progress */}
          <div className="my-2 space-y-2">
            <div className="text-5xl sm:text-6xl font-mono font-bold text-dark-wood tracking-tight drop-shadow-sm">
              {formatClock(remainingSeconds)}
            </div>

            {/* Steeping Progress Bar */}
            <div className="w-full max-w-xs mx-auto h-2.5 bg-wood/15 rounded-full overflow-hidden p-0.5 border border-wood/20">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: targetHex || "#D4A574" }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ ease: "linear", duration: 0.5 }}
              />
            </div>
          </div>

          {/* Zen Quotes or Completion State */}
          <div className="min-h-[46px] flex items-center justify-center px-4 my-2">
            <AnimatePresence mode="wait">
              {isCompleted ? (
                <motion.div
                  key="completed"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 bg-emerald-100/95 border border-emerald-300 text-emerald-900 rounded-2xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Steeping Complete! Take your warm, soothing sip. 🍵</span>
                </motion.div>
              ) : (
                <motion.p
                  key={currentQuoteIndex}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="text-xs text-wood/80 italic max-w-sm mx-auto leading-relaxed"
                >
                  {ZEN_QUOTES[currentQuoteIndex]}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Action Controls */}
          <div className="flex items-center justify-center gap-3 pt-2">
            {!isRunning ? (
              <Button
                onClick={handleStart}
                className="px-6 py-2.5 bg-dark-wood hover:bg-wood text-cream rounded-full font-medium flex items-center gap-2 shadow-md cursor-pointer transition-transform active:scale-95"
              >
                <Play className="w-4 h-4 fill-cream" />
                <span>{remainingSeconds === totalSeconds ? "Start Steep" : "Resume"}</span>
              </Button>
            ) : (
              <Button
                onClick={handlePause}
                variant="outline"
                className="px-6 py-2.5 border-wood/30 text-dark-wood hover:bg-wood/10 rounded-full font-medium flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
              >
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </Button>
            )}

            <Button
              onClick={handleReset}
              variant="ghost"
              className="p-2.5 text-wood hover:text-dark-wood hover:bg-wood/10 rounded-full cursor-pointer transition-transform active:scale-95"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>

            {isCompleted && (
              <Button
                onClick={onClose}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full font-medium flex items-center gap-1.5 shadow-md cursor-pointer transition-transform active:scale-95 text-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Enjoy Tea</span>
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default ZenBrewModal;
