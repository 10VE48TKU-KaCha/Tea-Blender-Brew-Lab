"use client";

import React from "react";
import { ServingStyle } from "./CozyCupScene";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TeaPreset {
  id: string;
  name: string;
  badge: string;
  icon: string;
  desc: string;
  ingredientRatios: Record<string, number>;
  waterTempC: number;
  steepingTimeSec: number;
  waterAmountMl: number;
  servingStyle: ServingStyle;
  garnishes: string[];
}

export const SIGNATURE_PRESETS: TeaPreset[] = [
  {
    id: "kyoto-spring",
    name: "Kyoto Spring Mist",
    badge: "Light & Floral",
    icon: "🌸",
    desc: "Japanese Shizuoka Sencha softened with Bavarian chamomile blossoms",
    ingredientRatios: {
      "Shizuoka Sencha 🇯🇵": 75,
      "Bavarian Chamomile 🇩🇪": 25,
    },
    waterTempC: 75,
    steepingTimeSec: 90,
    waterAmountMl: 180,
    servingStyle: "hot",
    garnishes: ["osmanthus"],
  },
  {
    id: "royal-velvet",
    name: "Royal Afternoon Velvet",
    badge: "Malty & Bold",
    icon: "👑",
    desc: "Malty Indian Assam tips harmonized with creamy Alishan oolong",
    ingredientRatios: {
      "Assam Golden Tips 🇮🇳": 70,
      "Alishan High Mountain Oolong 🇹🇼": 30,
    },
    waterTempC: 92,
    steepingTimeSec: 180,
    waterAmountMl: 220,
    servingStyle: "latte",
    garnishes: ["cinnamon", "honey"],
  },
  {
    id: "tokyo-zen",
    name: "Tokyo Emerald Zen",
    badge: "Rich Umami",
    icon: "🍵",
    desc: "Kyoto ceremonial Uji matcha and toasty roasted Hojicha",
    ingredientRatios: {
      "Kyoto Uji Ceremonial Matcha 🇯🇵": 65,
      "Kyoto Roasted Hojicha 🇯🇵": 35,
    },
    waterTempC: 80,
    steepingTimeSec: 60,
    waterAmountMl: 160,
    servingStyle: "latte",
    garnishes: [],
  },
  {
    id: "mountain-fog",
    name: "Alishan High Mountain Fog",
    badge: "Orchid Floral",
    icon: "🏔️",
    desc: "High altitude Taiwanese oolong with crystalline Chinese Silver Needle",
    ingredientRatios: {
      "Alishan High Mountain Oolong 🇹🇼": 80,
      "Fujian Silver Needle (Baihao) 🇨🇳": 20,
    },
    waterTempC: 85,
    steepingTimeSec: 140,
    waterAmountMl: 160,
    servingStyle: "hot",
    garnishes: [],
  },
  {
    id: "midnight-lullaby",
    name: "Provence Midnight Serenade",
    badge: "Caffeine-Free",
    icon: "🌙",
    desc: "Soothing French lavender and chamomile with honey swirl",
    ingredientRatios: {
      "Bavarian Chamomile 🇩🇪": 70,
      "Provence French Lavender 🇫🇷": 30,
    },
    waterTempC: 95,
    steepingTimeSec: 240,
    waterAmountMl: 250,
    servingStyle: "hot",
    garnishes: ["honey", "rose"],
  },
  {
    id: "nile-glacier",
    name: "Nile Ruby Cold Brew",
    badge: "Tangy Iced",
    icon: "🧊",
    desc: "Tart Egyptian hibiscus with sweet South African rooibos on ice",
    ingredientRatios: {
      "Nile Valley Hibiscus 🇪🇬": 60,
      "Cederberg Red Rooibos 🇿🇦": 40,
    },
    waterTempC: 70,
    steepingTimeSec: 120,
    waterAmountMl: 240,
    servingStyle: "iced",
    garnishes: ["rose"],
  },
];

interface PresetBarProps {
  onSelectPreset: (preset: TeaPreset) => void;
  activePresetId?: string | null;
}

export function PresetBar({ onSelectPreset, activePresetId }: PresetBarProps) {
  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2 text-sm font-semibold text-dark-wood">
          <BookOpen className="w-4 h-4 text-amber" />
          <span>Signature World Blend Presets</span>
        </div>
        <span className="text-xs text-wood/60">1-click master blends from around the globe</span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x">
        {SIGNATURE_PRESETS.map((preset) => {
          const isActive = activePresetId === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset)}
              className={cn(
                "flex-shrink-0 snap-start w-56 sm:w-64 p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer group",
                isActive
                  ? "bg-amber-light/30 border-wood shadow-sm ring-1 ring-amber"
                  : "bg-white/70 backdrop-blur-sm border-wood/15 hover:bg-white hover:border-wood/30 hover:shadow-sm"
              )}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-2xl group-hover:scale-110 transition-transform">
                  {preset.icon}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-wood/10 text-dark-wood">
                  {preset.badge}
                </span>
              </div>
              <h4 className="font-display font-bold text-dark-wood text-sm line-clamp-1">
                {preset.name}
              </h4>
              <p className="text-[11px] text-wood/70 line-clamp-2 mt-0.5 leading-snug">
                {preset.desc}
              </p>
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-wood/10 text-[10px] text-wood/80 font-medium">
                <span>🌡️ {preset.waterTempC}°C</span>
                <span>⏳ {preset.steepingTimeSec}s</span>
                <span className="capitalize">🫖 {preset.servingStyle}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default PresetBar;
