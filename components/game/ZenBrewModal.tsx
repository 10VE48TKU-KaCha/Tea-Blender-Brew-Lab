"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CozyCupScene, ServingStyle } from "./CozyCupScene";
import { playChime, playWaterPour, playSoftTick } from "@/lib/audio";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Play, Pause, RotateCcw, X, Sparkles } from "lucide-react";

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
  const currentOpacity = 0.2 + (progressPercent / 100) * 0.75;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-stone-900/60 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-[#FAF6F0] rounded-3xl p-6 sm:p-8 shadow-2xl border border-wood/30 text-center overflow-hidden"
        >
          {/* Header Controls */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-full bg-wood/10 text-dark-wood hover:bg-wood/20 transition-colors"
              title={soundEnabled ? "Mute sounds" : "Unmute sounds"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-wood/50" />}
            </button>

            <div className="text-xs uppercase tracking-widest text-wood/70 font-semibold flex items-center gap-1.5">
              <span>🫖</span> Zen Steeping Timer
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-wood/10 text-dark-wood hover:bg-wood/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Title & Subtitle */}
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-dark-wood mb-1">
            {title || "Artisan's Steep"}
          </h2>
          <p className="text-xs text-wood mb-4">
            Infusing at {waterTempC}°C • {servingStyle.toUpperCase()} Style
          </p>

          {/* Teacup Diffusion Scene */}
          <div className="py-2 flex justify-center">
            <div className="w-56 sm:w-64">
              <CozyCupScene
                liquidColor={targetHex}
                opacity={currentOpacity}
                steamIntensity={isRunning ? Math.max(0.4, (waterTempC - 60) / 40) : 0.2}
                servingStyle={servingStyle}
                garnishes={garnishes}
              />
            </div>
          </div>

          {/* Digital Timer Clock */}
          <div className="my-4">
            <div className="text-5xl sm:text-6xl font-mono font-bold text-dark-wood tracking-tight">
              {formatClock(remainingSeconds)}
            </div>

            {/* Steeping Progress Bar */}
            <div className="w-full max-w-xs mx-auto h-2 bg-wood/10 rounded-full mt-3 overflow-hidden">
              <motion.div
                className="h-full bg-amber"
                animate={{ width: `${progressPercent}%` }}
                transition={{ ease: "linear", duration: 0.5 }}
              />
            </div>
          </div>

          {/* Zen Quotes or Completion State */}
          <div className="min-h-[50px] flex items-center justify-center px-4 my-3">
            <AnimatePresence mode="wait">
              {isCompleted ? (
                <motion.div
                  key="completed"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 bg-emerald-100/90 text-emerald-900 rounded-2xl text-sm font-semibold flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Steeping Complete! Take your warm, soothing sip. 🍵</span>
                </motion.div>
              ) : (
                <motion.p
                  key={currentQuoteIndex}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-xs text-wood/80 italic max-w-sm mx-auto leading-relaxed"
                >
                  {ZEN_QUOTES[currentQuoteIndex]}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Action Controls */}
          <div className="flex items-center justify-center gap-3 mt-4">
            {!isRunning ? (
              <Button
                onClick={handleStart}
                className="px-6 py-2.5 bg-dark-wood hover:bg-wood text-cream rounded-full font-medium flex items-center gap-2 shadow-md cursor-pointer"
              >
                <Play className="w-4 h-4 fill-cream" />
                <span>{remainingSeconds === totalSeconds ? "Start Steep" : "Resume"}</span>
              </Button>
            ) : (
              <Button
                onClick={handlePause}
                variant="outline"
                className="px-6 py-2.5 border-wood/30 text-dark-wood hover:bg-wood/10 rounded-full font-medium flex items-center gap-2 cursor-pointer"
              >
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </Button>
            )}

            <Button
              onClick={handleReset}
              variant="ghost"
              className="p-2.5 text-wood hover:text-dark-wood hover:bg-wood/10 rounded-full cursor-pointer"
              title="Reset Timer"
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
