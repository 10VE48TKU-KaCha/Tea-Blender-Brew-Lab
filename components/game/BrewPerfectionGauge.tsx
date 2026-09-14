"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { ExtractionResult } from "@/types/tea";
import { useLanguage } from "@/context/LanguageContext";

interface BrewPerfectionGaugeProps {
  extraction: ExtractionResult | null;
  steepingTimeSec: number;
  waterTempC: number;
  className?: string;
}

export function BrewPerfectionGauge({
  extraction,
  steepingTimeSec,
  waterTempC,
  className = "",
}: BrewPerfectionGaugeProps) {
  const { lang } = useLanguage();

  // Calculate harmony score (0-100) based on balanced sensory distribution
  const harmony = useMemo(() => {
    if (!extraction) return { score: 0, status: "Crafting...", statusTh: "กำลังผสม...", level: "neutral", color: "#F59E0B" };

    const { sweetnessScore, aromaScore, bodyScore, bitternessScore, clarityScore } = extraction;

    // Ideal harmonious blend has balanced sweetness, aroma, body and controlled bitterness
    const averageAromaSweetBody = (sweetnessScore + aromaScore + bodyScore) / 3;
    const bitternessPenalty = Math.max(0, bitternessScore - 6) * 4;
    const balanceVariance =
      Math.abs(sweetnessScore - bodyScore) * 1.5 +
      Math.abs(aromaScore - sweetnessScore) * 1.2;

    let rawScore = Math.round(averageAromaSweetBody * 10 - bitternessPenalty - balanceVariance * 1.5 + clarityScore * 1.2);
    const score = Math.max(45, Math.min(98, rawScore));

    if (score >= 88) {
      return {
        score,
        status: "Master Harmony",
        statusTh: "ความกลมกล่อมระดับมาสเตอร์ ✨",
        level: "perfect",
        color: "#10B981",
      };
    } else if (score >= 75) {
      return {
        score,
        status: "Silky & Balanced",
        statusTh: "สมดุลละมุนลิ้น 🍵",
        level: "great",
        color: "#F59E0B",
      };
    } else if (score >= 60) {
      return {
        score,
        status: "Rich & Robust",
        statusTh: "เข้มข้นลุ่มลึก 🌿",
        level: "good",
        color: "#D97706",
      };
    } else {
      return {
        score,
        status: "Experimental Blend",
        statusTh: "สูตรทดลองแปลกใหม่ 🧪",
        level: "experimental",
        color: "#BA4A1E",
      };
    }
  }, [extraction]);

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * harmony.score) / 100;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className={`vibrant-glass-card rounded-2xl p-4 flex flex-col items-center relative overflow-hidden ${className}`}>
      {/* Soft Ambient Corner Glow */}
      <div
        className="absolute -top-10 -right-10 w-28 h-28 rounded-full filter blur-2xl opacity-20 pointer-events-none"
        style={{ backgroundColor: harmony.color || "#10B981" }}
      />

      <div className="w-full flex items-center justify-between mb-2">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>{lang === "th" ? "คะแนนความกลมกล่อม" : "Brew Perfection"}</span>
        </h4>
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full border"
          style={{
            borderColor: `${harmony.color || "#F59E0B"}40`,
            backgroundColor: `${harmony.color || "#F59E0B"}15`,
            color: harmony.color || "#B45309",
          }}
        >
          {lang === "th" ? harmony.statusTh : harmony.status}
        </span>
      </div>

      {/* SVG Circular Progress Ring */}
      <div className="relative w-36 h-36 flex items-center justify-center my-1">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 130 130">
          <defs>
            <linearGradient id="brewGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="60%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EA580C" />
            </linearGradient>
            <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Track */}
          <circle
            cx="65"
            cy="65"
            r={radius}
            fill="none"
            stroke="rgba(0,0,0,0.06)"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Animated Gradient Progress Stroke */}
          <motion.circle
            cx="65"
            cy="65"
            r={radius}
            fill="none"
            stroke="url(#brewGradient)"
            strokeWidth="10"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            strokeLinecap="round"
            filter="url(#gaugeGlow)"
          />
        </svg>

        {/* Center Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="font-mono text-3xl font-extrabold text-[#1E1915] tracking-tight leading-none">
            {harmony.score}%
          </div>
          <span className="text-[10px] text-stone-500 font-medium uppercase tracking-wider mt-1">
            {lang === "th" ? "ความสมบูรณ์" : "Harmony"}
          </span>
        </div>
      </div>

      {/* Telemetry Footer */}
      <div className="w-full grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-black/[0.05] text-[11px] text-stone-600">
        <div className="bg-white/60 rounded-xl p-2 text-center border border-stone-100 shadow-2xs">
          <div className="text-[10px] text-stone-400 font-medium">
            {lang === "th" ? "เวลาชง" : "Steep Time"}
          </div>
          <div className="font-bold font-mono text-stone-800 text-xs">
            {formatTime(steepingTimeSec)}
          </div>
        </div>

        <div className="bg-white/60 rounded-xl p-2 text-center border border-stone-100 shadow-2xs">
          <div className="text-[10px] text-stone-400 font-medium">
            {lang === "th" ? "อุณหภูมิ" : "Water Temp"}
          </div>
          <div className="font-bold font-mono text-stone-800 text-xs">
            {waterTempC}°C
          </div>
        </div>
      </div>
    </div>
  );
}

export default BrewPerfectionGauge;
