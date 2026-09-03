"use client";

import React, { useState } from "react";
import { ServingStyle, CupVesselType, CupGlaze, CoasterStyle, LatteArtType } from "./CozyCupScene";
import { cn } from "@/lib/utils";
import { Sparkles, Heart, Coffee, Layers, Palette, Disc, Droplets } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export interface ServingStyleSelectorProps {
  servingStyle?: ServingStyle;
  onStyleChange?: (style: ServingStyle) => void;
  vesselType?: CupVesselType;
  onVesselChange?: (vessel: CupVesselType) => void;
  cupGlaze?: CupGlaze;
  onGlazeChange?: (glaze: CupGlaze) => void;
  coasterStyle?: CoasterStyle;
  onCoasterChange?: (coaster: CoasterStyle) => void;
  latteArt?: LatteArtType;
  onLatteArtChange?: (art: LatteArtType) => void;
  garnishes: string[];
  onGarnishToggle: (garnishId: string) => void;
}

type StudioTab = "vessel" | "material" | "art" | "botanicals";

export function ServingStyleSelector({
  servingStyle = "hot",
  onStyleChange,
  vesselType = "mug",
  onVesselChange,
  cupGlaze = "earthenware",
  onGlazeChange,
  coasterStyle = "ceramic",
  onCoasterChange,
  latteArt = "bear",
  onLatteArtChange,
  garnishes = [],
  onGarnishToggle,
}: ServingStyleSelectorProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<StudioTab>("vessel");

  // 8 Artisan Vessels
  const vessels: { id: CupVesselType; label: string; icon: string; desc: string; tempType: "hot" | "iced" | "latte" }[] = [
    { id: "mug", label: t.vesselMug, icon: "☕", desc: t.vesselMugDesc, tempType: "hot" },
    { id: "tumbler", label: t.vesselTumbler, icon: "🧊", desc: t.vesselTumblerDesc, tempType: "iced" },
    { id: "latte", label: t.vesselLatte, icon: "🥛", desc: t.vesselLatteDesc, tempType: "latte" },
    { id: "chawan", label: t.vesselChawan, icon: "🍵", desc: t.vesselChawanDesc, tempType: "hot" },
    { id: "gaiwan", label: t.vesselGaiwan, icon: "🫖", desc: t.vesselGaiwanDesc, tempType: "hot" },
    { id: "goblet", label: t.vesselGoblet, icon: "🥂", desc: t.vesselGobletDesc, tempType: "iced" },
    { id: "kuksa", label: t.vesselKuksa, icon: "🪵", desc: t.vesselKuksaDesc, tempType: "hot" },
    { id: "zisha", label: t.vesselZisha, icon: "🏺", desc: t.vesselZishaDesc, tempType: "hot" },
  ];

  // 9 Luxury Materials & Glazes
  const glazes: { id: CupGlaze; label: string; swatch: string; border: string; desc: string }[] = [
    { id: "celadon", label: t.glazeCeladon, swatch: "from-[#D8EADF] to-[#8EB89A]", border: "#72997E", desc: t.glazeCeladonDesc },
    { id: "tenmoku", label: t.glazeTenmoku, swatch: "from-[#4A3730] to-[#160D0B]", border: "#C48F58", desc: t.glazeTenmokuDesc },
    { id: "hakuji", label: t.glazeHakuji, swatch: "from-[#FFFFFF] to-[#E5DDD1]", border: "#CFBEAC", desc: t.glazeHakujiDesc },
    { id: "earthenware", label: t.glazeEarthenware, swatch: "from-[#F9EDE0] to-[#CFB49A]", border: "#B89B7F", desc: t.glazeEarthenwareDesc },
    { id: "sakura", label: t.glazeSakura, swatch: "from-[#FFF0F4] to-[#EEB2C2]", border: "#E8B86D", desc: t.glazeSakuraDesc },
    { id: "kintsugi", label: t.glazeKintsugi, swatch: "from-[#FBF9F4] to-[#DBD2C3]", border: "#E5B036", desc: t.glazeKintsugiDesc },
    { id: "obsidian", label: t.glazeObsidian, swatch: "from-[#252836] to-[#0C0E17]", border: "#7E90B8", desc: t.glazeObsidianDesc },
    { id: "wood", label: t.glazeWood, swatch: "from-[#DEAC7F] to-[#945F33]", border: "#6E401B", desc: t.glazeWoodDesc },
    { id: "crystal", label: t.glazeCrystal, swatch: "from-[#EAF6FD] to-[#A7D7F3]", border: "#8AC4E8", desc: t.glazeCrystalDesc },
  ];

  // 6 Coaster Styles
  const coasters: { id: CoasterStyle; label: string; icon: string }[] = [
    { id: "ceramic", label: t.coasterCeramic, icon: "🍽️" },
    { id: "wood", label: t.coasterWood, icon: "🪵" },
    { id: "rattan", label: t.coasterRattan, icon: "🌾" },
    { id: "marble", label: t.coasterMarble, icon: "🏛️" },
    { id: "stone", label: t.coasterStone, icon: "🪨" },
    { id: "none", label: t.coasterNone, icon: "✨" },
  ];

  // 5 Foam Arts
  const latteArts: { id: LatteArtType; label: string; icon: string }[] = [
    { id: "bear", label: t.artBear, icon: "🐻" },
    { id: "heart", label: t.artHeart, icon: "💖" },
    { id: "leaf", label: t.artLeaf, icon: "🍃" },
    { id: "cat", label: t.artCat, icon: "🐾" },
    { id: "sakura", label: t.artSakura, icon: "🌸" },
  ];

  // 7 Botanicals & Add-ins
  const botanicals: { id: string; label: string; icon: string }[] = [
    { id: "osmanthus", label: t.garnishOsmanthus, icon: "🌼" },
    { id: "rose", label: t.garnishRose, icon: "🌹" },
    { id: "cinnamon", label: t.garnishCinnamon, icon: "🪵" },
    { id: "honey", label: t.garnishHoney, icon: "🍯" },
    { id: "mint", label: t.garnishMint, icon: "🌿" },
    { id: "lemon", label: t.garnishLemon, icon: "🍋" },
    { id: "boba", label: t.garnishBoba, icon: "🧋" },
  ];

  const handleSelectVessel = (v: typeof vessels[0]) => {
    if (onVesselChange) {
      onVesselChange(v.id);
    }
    if (onStyleChange) {
      onStyleChange(v.tempType);
    }
  };

  const isFoamArtApplicable = vesselType === "latte" || vesselType === "chawan" || vesselType === "mug";

  return (
    <div className="w-full space-y-3.5 bg-white/75 backdrop-blur-md rounded-2xl p-4 border border-wood/15 shadow-sm">
      {/* Studio Header & Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-wood/10">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber/20 flex items-center justify-center text-xs">
            🍵
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-dark-wood">
              {t.cupStudioTitle}
            </h3>
          </div>
        </div>

        {/* Studio Sub-Tabs */}
        <div className="flex items-center gap-1 bg-amber-light/20 p-1 rounded-xl border border-wood/10 self-start sm:self-auto overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setActiveTab("vessel")}
            className={cn(
              "px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap",
              activeTab === "vessel"
                ? "bg-white text-dark-wood shadow-sm font-bold ring-1 ring-amber/40"
                : "text-wood/70 hover:text-dark-wood"
            )}
          >
            <span>🏺</span>
            <span>{t.tabVessel}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("material")}
            className={cn(
              "px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap",
              activeTab === "material"
                ? "bg-white text-dark-wood shadow-sm font-bold ring-1 ring-amber/40"
                : "text-wood/70 hover:text-dark-wood"
            )}
          >
            <Palette className="w-3 h-3 text-amber" />
            <span>{t.tabGlaze}</span>
          </button>

          {isFoamArtApplicable && (
            <button
              type="button"
              onClick={() => setActiveTab("art")}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap animate-in fade-in duration-200",
                activeTab === "art"
                  ? "bg-white text-dark-wood shadow-sm font-bold ring-1 ring-amber/40"
                  : "text-wood/70 hover:text-dark-wood"
              )}
            >
              <span>🎨</span>
              <span>{t.tabLatteArt}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab("botanicals")}
            className={cn(
              "px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap",
              activeTab === "botanicals"
                ? "bg-white text-dark-wood shadow-sm font-bold ring-1 ring-amber/40"
                : "text-wood/70 hover:text-dark-wood"
            )}
          >
            <Sparkles className="w-3 h-3 text-amber" />
            <span>{t.tabBotanicals}</span>
            {garnishes.length > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-700 text-white font-bold">
                {garnishes.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: 8 ARTISAN VESSEL SHAPES                            */}
      {/* ========================================================= */}
      {activeTab === "vessel" && (
        <div className="animate-in fade-in duration-200">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {vessels.map((v) => {
              const isSelected = vesselType === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => handleSelectVessel(v)}
                  className={cn(
                    "flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all duration-200 text-center cursor-pointer active:scale-95 group relative",
                    isSelected
                      ? "bg-amber-light/35 border-wood text-dark-wood font-bold shadow-sm ring-2 ring-amber/60 scale-[1.02]"
                      : "bg-white/50 border-wood/10 text-wood/80 hover:bg-cream hover:border-wood/30 hover:shadow-xs"
                  )}
                >
                  <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">
                    {v.icon}
                  </span>
                  <span className="text-xs font-semibold leading-tight">{v.label}</span>
                  <span className="text-[10px] text-wood/60 line-clamp-1 mt-0.5 font-normal">
                    {v.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: 9 GLAZES / MATERIALS & 6 COASTERS                  */}
      {/* ========================================================= */}
      {activeTab === "material" && (
        <div className="space-y-3.5 animate-in fade-in duration-200">
          {/* Glazes Grid */}
          <div>
            <div className="text-[11px] font-semibold text-wood/70 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>🎨 {t.tabGlaze}</span>
              <span className="text-amber-800 text-[11px] font-medium">
                {glazes.find((g) => g.id === cupGlaze)?.label}
              </span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
              {glazes.map((glaze) => {
                const isSelected = cupGlaze === glaze.id;
                return (
                  <button
                    key={glaze.id}
                    type="button"
                    onClick={() => onGlazeChange && onGlazeChange(glaze.id)}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-xl border transition-all duration-200 text-left cursor-pointer active:scale-95",
                      isSelected
                        ? "bg-amber-light/30 border-wood text-dark-wood font-bold shadow-xs ring-1.5 ring-amber/60"
                        : "bg-white/50 border-wood/10 text-wood/80 hover:bg-white hover:border-wood/30"
                    )}
                  >
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full shrink-0 shadow-xs border bg-gradient-to-br",
                        glaze.swatch
                      )}
                      style={{ borderColor: glaze.border }}
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold truncate leading-tight">{glaze.label}</div>
                      <div className="text-[9px] text-wood/60 truncate">{glaze.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Coasters Grid */}
          <div className="pt-2 border-t border-wood/10">
            <div className="text-[11px] font-semibold text-wood/70 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>🪵 {t.tabCoaster}</span>
              <span className="text-amber-800 text-[11px] font-medium">
                {coasters.find((c) => c.id === coasterStyle)?.label}
              </span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              {coasters.map((c) => {
                const isSelected = coasterStyle === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => onCoasterChange && onCoasterChange(c.id)}
                    className={cn(
                      "flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer active:scale-95",
                      isSelected
                        ? "bg-amber/25 border-wood text-dark-wood font-bold shadow-xs ring-1 ring-amber/50"
                        : "bg-white/40 border-wood/15 text-wood/70 hover:bg-white/80"
                    )}
                  >
                    <span className="text-base mb-0.5">{c.icon}</span>
                    <span className="text-[10px] font-medium leading-tight truncate w-full">
                      {c.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: 5 BARISTA LATTE FOAM ARTS                          */}
      {/* ========================================================= */}
      {activeTab === "art" && isFoamArtApplicable && onLatteArtChange && (
        <div className="animate-in fade-in duration-200">
          <div className="text-[11px] font-semibold text-wood/70 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>🎨 {t.latteFoamArt}</span>
            <span className="text-amber-800 text-[11px] font-medium">
              {latteArts.find((a) => a.id === latteArt)?.icon} {latteArts.find((a) => a.id === latteArt)?.label}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {latteArts.map((art) => {
              const isSelected = latteArt === art.id;
              return (
                <button
                  key={art.id}
                  type="button"
                  onClick={() => onLatteArtChange(art.id)}
                  className={cn(
                    "flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all cursor-pointer active:scale-95 text-center",
                    isSelected
                      ? "bg-amber/25 border-wood text-dark-wood font-bold shadow-xs ring-1.5 ring-amber/50 scale-[1.02]"
                      : "bg-white/40 border-wood/15 text-wood/70 hover:bg-white/80"
                  )}
                >
                  <span className="text-2xl mb-1">{art.icon}</span>
                  <span className="text-xs font-semibold">{art.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: 7 BOTANICALS & ADD-INS                             */}
      {/* ========================================================= */}
      {activeTab === "botanicals" && (
        <div className="animate-in fade-in duration-200">
          <div className="text-[11px] font-semibold text-wood/70 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber" />
              {t.botanicalAddins}
            </span>
            {garnishes.length > 0 && (
              <span className="text-[11px] text-amber-700 font-medium">
                {garnishes.length} {t.selectedCount}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {botanicals.map((botanical) => {
              const isChecked = garnishes.includes(botanical.id);
              return (
                <button
                  key={botanical.id}
                  type="button"
                  onClick={() => onGarnishToggle(botanical.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer active:scale-95",
                    isChecked
                      ? "bg-amber/25 border-wood text-dark-wood font-bold shadow-sm ring-1 ring-amber/50"
                      : "bg-white/50 border-wood/15 text-wood/75 hover:bg-white hover:text-dark-wood"
                  )}
                >
                  <span>{botanical.icon}</span>
                  <span>{botanical.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default ServingStyleSelector;
