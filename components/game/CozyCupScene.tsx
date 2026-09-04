"use client";

import React, { useId } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { CupVesselType, CupGlaze, CoasterStyle, LatteArtType } from "@/types/tea";

export type ServingStyle = "hot" | "iced" | "latte";
export type { CupVesselType, CupGlaze, CoasterStyle, LatteArtType };

export interface CozyCupSceneProps {
  liquidColor: string;
  opacity: number;
  liquidLevel?: number; // 0.0 (empty) to 1.0 (full)
  steamIntensity?: number;
  servingStyle?: ServingStyle;
  vesselType?: CupVesselType;
  cupGlaze?: CupGlaze;
  coasterStyle?: CoasterStyle;
  turbidity?: "clear" | "cloudy" | "velvet";
  garnishes?: string[];
  latteArt?: LatteArtType;
  className?: string;
}

interface GlazeTheme {
  name: string;
  bodyTop: string;
  bodyMid: string;
  bodyBottom: string;
  stroke: string;
  rim: string;
  rimInner: string;
  highlight: string;
  saucerTop: string;
  saucerMid: string;
  saucerBottom: string;
  saucerStroke: string;
  handleTop: string;
  handleBottom: string;
  crackleColor?: string;
  accentGold?: string;
}

const GLAZE_THEMES: Record<CupGlaze, GlazeTheme> = {
  celadon: {
    name: "Celadon Jade",
    bodyTop: "#D8EADF",
    bodyMid: "#B5D6BE",
    bodyBottom: "#8EB89A",
    stroke: "#72997E",
    rim: "#EAF6EE",
    rimInner: "#A3C8AF",
    highlight: "#FFFFFF",
    saucerTop: "#9EC4A9",
    saucerMid: "#7A9E85",
    saucerBottom: "#5E8068",
    saucerStroke: "#4F6E58",
    handleTop: "#D8EADF",
    handleBottom: "#8EB89A",
    crackleColor: "#6A8F76",
  },
  tenmoku: {
    name: "Tenmoku Rust Bronze",
    bodyTop: "#4A3730",
    bodyMid: "#2C1E1B",
    bodyBottom: "#160D0B",
    stroke: "#0F0705",
    rim: "#C48F58",
    rimInner: "#7A5338",
    highlight: "#E2B07E",
    saucerTop: "#3A261E",
    saucerMid: "#221510",
    saucerBottom: "#120906",
    saucerStroke: "#0A0403",
    handleTop: "#4A3730",
    handleBottom: "#160D0B",
    crackleColor: "#C79563",
  },
  hakuji: {
    name: "Hakuji Pure White",
    bodyTop: "#FFFFFF",
    bodyMid: "#F6F1EA",
    bodyBottom: "#E5DDD1",
    stroke: "#CFBEAC",
    rim: "#FFFFFF",
    rimInner: "#E2D7C8",
    highlight: "#FFFFFF",
    saucerTop: "#C29B7F",
    saucerMid: "#A0795E",
    saucerBottom: "#805B44",
    saucerStroke: "#6B4934",
    handleTop: "#FFFFFF",
    handleBottom: "#E5DDD1",
  },
  earthenware: {
    name: "Warm Stoneware",
    bodyTop: "#F9EDE0",
    bodyMid: "#EAD4BE",
    bodyBottom: "#CFB49A",
    stroke: "#B89B7F",
    rim: "#FFF8EF",
    rimInner: "#D8BC9F",
    highlight: "#FFFFFF",
    saucerTop: "#C98762",
    saucerMid: "#A86B47",
    saucerBottom: "#885131",
    saucerStroke: "#724024",
    handleTop: "#F9EDE0",
    handleBottom: "#CFB49A",
    crackleColor: "#A38165",
  },
  sakura: {
    name: "Sakura Blossom Pink",
    bodyTop: "#FFF0F4",
    bodyMid: "#FCD5DF",
    bodyBottom: "#EEB2C2",
    stroke: "#D995A7",
    rim: "#FFFAF0",
    rimInner: "#F7CAD6",
    highlight: "#FFFFFF",
    saucerTop: "#F5C2CE",
    saucerMid: "#DB9AAB",
    saucerBottom: "#BF7A8D",
    saucerStroke: "#A86376",
    handleTop: "#FFF0F4",
    handleBottom: "#EEB2C2",
    accentGold: "#E8B86D",
  },
  kintsugi: {
    name: "Kintsugi Gold Vein",
    bodyTop: "#FBF9F4",
    bodyMid: "#EEE7DC",
    bodyBottom: "#DBD2C3",
    stroke: "#B8A995",
    rim: "#F5D485",
    rimInner: "#E5C472",
    highlight: "#FFFFFF",
    saucerTop: "#C7AB88",
    saucerMid: "#A88D6A",
    saucerBottom: "#8A714F",
    saucerStroke: "#705A3D",
    handleTop: "#FBF9F4",
    handleBottom: "#DBD2C3",
    accentGold: "#E5B036",
  },
  obsidian: {
    name: "Midnight Obsidian",
    bodyTop: "#252836",
    bodyMid: "#181B26",
    bodyBottom: "#0C0E17",
    stroke: "#06080F",
    rim: "#7E90B8",
    rimInner: "#3F4E70",
    highlight: "#A5B8E6",
    saucerTop: "#1F2333",
    saucerMid: "#131624",
    saucerBottom: "#0A0B14",
    saucerStroke: "#05060A",
    handleTop: "#252836",
    handleBottom: "#0C0E17",
    crackleColor: "#4E6699",
  },
  wood: {
    name: "Hinoki & Teak Wood",
    bodyTop: "#DEAC7F",
    bodyMid: "#BA8252",
    bodyBottom: "#945F33",
    stroke: "#6E401B",
    rim: "#ECC39B",
    rimInner: "#C99567",
    highlight: "#F8DFCA",
    saucerTop: "#A87244",
    saucerMid: "#86542A",
    saucerBottom: "#643B17",
    saucerStroke: "#4A270B",
    handleTop: "#DEAC7F",
    handleBottom: "#945F33",
  },
  crystal: {
    name: "Diamond Crystal Glass",
    bodyTop: "#EAF6FD",
    bodyMid: "#CBE8F9",
    bodyBottom: "#A7D7F3",
    stroke: "#8AC4E8",
    rim: "#FFFFFF",
    rimInner: "#D8EEFB",
    highlight: "#FFFFFF",
    saucerTop: "#C2E2F7",
    saucerMid: "#9BCDF0",
    saucerBottom: "#75B4E4",
    saucerStroke: "#589BCF",
    handleTop: "#EAF6FD",
    handleBottom: "#A7D7F3",
  },
};

export function CozyCupScene({
  liquidColor,
  opacity,
  liquidLevel = 1,
  steamIntensity = 0.5,
  servingStyle = "hot",
  vesselType,
  cupGlaze = "earthenware",
  coasterStyle,
  turbidity = "velvet",
  garnishes = [],
  latteArt = "bear",
  className,
}: CozyCupSceneProps) {
  const uid = useId().replace(/:/g, "_");
  const clampedLevel = Math.max(0, Math.min(1, liquidLevel));

  // Determine active vessel type: explicit vesselType or mapped from servingStyle
  const activeVessel: CupVesselType =
    vesselType ||
    (servingStyle === "iced" ? "tumbler" : servingStyle === "latte" ? "latte" : "mug");

  // Determine default coaster based on vessel if not provided
  const activeCoaster: CoasterStyle =
    coasterStyle !== undefined
      ? coasterStyle
      : activeVessel === "tumbler" || activeVessel === "goblet"
      ? "wood"
      : activeVessel === "chawan" || activeVessel === "zisha"
      ? "stone"
      : activeVessel === "kuksa"
      ? "rattan"
      : "ceramic";

  const isColdVessel = activeVessel === "tumbler" || activeVessel === "goblet";
  const effectiveSteam =
    isColdVessel ? 0 : steamIntensity * Math.max(0.1, clampedLevel);

  const glaze = GLAZE_THEMES[cupGlaze] || GLAZE_THEMES.earthenware;
  const isCloudy = turbidity === "cloudy";
  const isClear = turbidity === "clear";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn("relative w-full max-w-[280px] sm:max-w-[320px] mx-auto select-none", className)}
    >
      <style>{`
        @keyframes cozy-bob-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-3.5px) rotate(2deg); }
        }
        @keyframes cozy-bob-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-4.5px) rotate(-2.5deg); }
        }
        @keyframes cozy-bob-3 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-2.5px) rotate(1.5deg); }
        }
        @keyframes steam-rise-1 {
          0% { transform: translateY(0px) scaleX(1); opacity: 0; }
          40% { opacity: 0.85; }
          100% { transform: translateY(-28px) scaleX(1.3); opacity: 0; }
        }
        @keyframes steam-rise-2 {
          0% { transform: translateY(0px) scaleX(0.9); opacity: 0; }
          50% { opacity: 0.95; }
          100% { transform: translateY(-36px) scaleX(1.4); opacity: 0; }
        }
        @keyframes steam-rise-3 {
          0% { transform: translateY(0px) scaleX(1.1); opacity: 0; }
          45% { opacity: 0.75; }
          100% { transform: translateY(-32px) scaleX(1.25); opacity: 0; }
        }
        @keyframes gentle-ripple {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.04); opacity: 0.9; }
        }
        @keyframes leaf-sway {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(4deg) translateY(-1.5px); }
        }
        @keyframes sparkle-pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes bubble-rise {
          0% { transform: translateY(0px); opacity: 0.2; }
          50% { opacity: 0.8; }
          100% { transform: translateY(-20px); opacity: 0; }
        }
        .cozy-steam-1 { animation: steam-rise-1 4.2s infinite ease-out; }
        .cozy-steam-2 { animation: steam-rise-2 3.6s infinite ease-out 0.8s; }
        .cozy-steam-3 { animation: steam-rise-3 4.8s infinite ease-out 1.6s; }
        .ice-float-1 { animation: cozy-bob-1 3.8s ease-in-out infinite; }
        .ice-float-2 { animation: cozy-bob-2 4.4s ease-in-out infinite 0.6s; }
        .ice-float-3 { animation: cozy-bob-3 3.2s ease-in-out infinite 1.2s; }
        .ripple-anim { animation: gentle-ripple 4s ease-in-out infinite; transform-origin: center; }
        .leaf-sway-anim { animation: leaf-sway 5s ease-in-out infinite; transform-origin: center; }
        .sparkle-anim { animation: sparkle-pulse 2.8s ease-in-out infinite; transform-origin: center; }
        .effervescence-anim { animation: bubble-rise 3s ease-in infinite; }
      `}</style>

      <svg
        viewBox="0 0 320 380"
        className="w-full h-auto overflow-visible filter drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* ======================================================== */}
          {/* 1. CERAMIC & GLAZE SHADERS                               */}
          {/* ======================================================== */}
          <linearGradient id={`${uid}-glazeBody`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={glaze.bodyBottom} />
            <stop offset="18%" stopColor={glaze.bodyMid} />
            <stop offset="48%" stopColor={glaze.bodyTop} />
            <stop offset="78%" stopColor={glaze.bodyMid} />
            <stop offset="100%" stopColor={glaze.bodyBottom} />
          </linearGradient>

          <linearGradient id={`${uid}-handleSheen`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={glaze.handleTop} />
            <stop offset="50%" stopColor={glaze.bodyMid} />
            <stop offset="100%" stopColor={glaze.handleBottom} />
          </linearGradient>

          <linearGradient id={`${uid}-saucerBody`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={glaze.saucerTop} />
            <stop offset="60%" stopColor={glaze.saucerMid} />
            <stop offset="100%" stopColor={glaze.saucerBottom} />
          </linearGradient>

          {/* ======================================================== */}
          {/* 2. LIQUID TRANSMISSION & MENISCUS SHADERS                */}
          {/* ======================================================== */}
          <linearGradient id={`${uid}-liquidDeepBody`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={liquidColor} stopOpacity={Math.min(1, opacity * 0.95)} />
            <stop offset="45%" stopColor={liquidColor} stopOpacity={Math.min(1, opacity * 1.05)} />
            <stop offset="100%" stopColor="#120A05" stopOpacity={Math.min(1, opacity * 1.35)} />
          </linearGradient>

          <radialGradient id={`${uid}-surfaceMeniscus`} cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
            <stop offset="35%" stopColor={liquidColor} stopOpacity={Math.min(1, opacity * 0.9)} />
            <stop offset="85%" stopColor={liquidColor} stopOpacity={Math.min(1, opacity * 1.15)} />
            <stop offset="100%" stopColor="#251208" stopOpacity={Math.min(1, opacity * 1.3)} />
          </radialGradient>

          <linearGradient id={`${uid}-liquidCaustic`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.32" />
            <stop offset="25%" stopColor="#FFFFFF" stopOpacity="0.12" />
            <stop offset="60%" stopColor="transparent" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
          </linearGradient>

          {/* ======================================================== */}
          {/* 3. CRYSTAL GLASS & REFLECTION SHADERS                    */}
          {/* ======================================================== */}
          <linearGradient id={`${uid}-glassWallSpecular`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.5" />
            <stop offset="12%" stopColor="#E6F4FA" stopOpacity="0.25" />
            <stop offset="32%" stopColor="#FFFFFF" stopOpacity="0.06" />
            <stop offset="70%" stopColor="#C9E6F7" stopOpacity="0.1" />
            <stop offset="88%" stopColor="#FFFFFF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.6" />
          </linearGradient>

          <linearGradient id={`${uid}-glassHeavyBase`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E2F2FA" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#C8E5F5" stopOpacity="0.75" />
            <stop offset="85%" stopColor="#9BCDEB" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#78B9DF" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id={`${uid}-iceTopFace`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#D8EEF8" stopOpacity="0.75" />
          </linearGradient>

          <linearGradient id={`${uid}-iceFrontFace`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E1F2FA" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#A2D6F0" stopOpacity="0.6" />
          </linearGradient>

          {/* ======================================================== */}
          {/* 4. LATTE ART & MICROFOAM SHADERS                         */}
          {/* ======================================================== */}
          <radialGradient id={`${uid}-microfoamDisk`} cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.98" />
            <stop offset="65%" stopColor="#FAF4EC" stopOpacity="0.95" />
            <stop offset="88%" stopColor="#E8D5C0" stopOpacity="0.85" />
            <stop offset="100%" stopColor={liquidColor} stopOpacity="0.65" />
          </radialGradient>

          <linearGradient id={`${uid}-latteOmbreLayer`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="28%" stopColor="#F4E8D8" stopOpacity="0.9" />
            <stop offset="55%" stopColor={liquidColor} stopOpacity={Math.min(1, opacity * 0.9)} />
            <stop offset="85%" stopColor={liquidColor} stopOpacity={Math.min(1, opacity * 1.1)} />
            <stop offset="100%" stopColor="#1E0D06" stopOpacity="0.95" />
          </linearGradient>

          {/* ======================================================== */}
          {/* 5. COASTER & PEDESTAL SHADERS                            */}
          {/* ======================================================== */}
          <linearGradient id={`${uid}-coasterBamboo`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8A5A38" />
            <stop offset="30%" stopColor="#C9946F" />
            <stop offset="50%" stopColor="#E2B795" />
            <stop offset="70%" stopColor="#C9946F" />
            <stop offset="100%" stopColor="#8A5A38" />
          </linearGradient>

          <linearGradient id={`${uid}-coasterMarble`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F9F9FB" />
            <stop offset="35%" stopColor="#EDEDF2" />
            <stop offset="65%" stopColor="#E0E0E8" />
            <stop offset="100%" stopColor="#C8C8D4" />
          </linearGradient>

          <linearGradient id={`${uid}-coasterZenStone`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4A4E54" />
            <stop offset="50%" stopColor="#32353A" />
            <stop offset="100%" stopColor="#1E2024" />
          </linearGradient>

          {/* ======================================================== */}
          {/* 6. BOTANICALS & TOPPING SHADERS                          */}
          {/* ======================================================== */}
          <radialGradient id={`${uid}-honeyGloss`} cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFF280" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#F7B801" stopOpacity="0.9" />
            <stop offset="85%" stopColor="#E07A00" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#8A3B00" stopOpacity="0.75" />
          </radialGradient>

          <radialGradient id={`${uid}-bobaPearl`} cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#5E3825" />
            <stop offset="45%" stopColor="#2A140A" />
            <stop offset="85%" stopColor="#120502" />
            <stop offset="100%" stopColor="#000000" />
          </radialGradient>

          <radialGradient id={`${uid}-lemonPulp`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF475" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#FFDE25" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#E5A800" stopOpacity="0.85" />
          </radialGradient>

          {/* ======================================================== */}
          {/* 7. VESSEL CAVITY CLIPPING MASKS (Curved Rim Arcs)        */}
          {/* ======================================================== */}
          {/* A. Classic Ceramic Mug Cavity */}
          <clipPath id={`${uid}-mug-cavity`}>
            <path d="M91,146 Q84,224 114,296 Q160,306 206,296 Q236,224 229,146 A 69 16.5 0 0 0 91 146 Z" />
          </clipPath>

          {/* B. Iced Tumbler Cavity */}
          <clipPath id={`${uid}-tumbler-cavity`}>
            <path d="M102,114 L114,308 Q160,318 206,308 L218,114 A 58 13 0 0 0 102 114 Z" />
          </clipPath>

          {/* C. Latte Bowl Cavity */}
          <clipPath id={`${uid}-latte-cavity`}>
            <path d="M86,138 Q78,222 112,296 Q160,306 208,296 Q242,222 234,138 A 74 17 0 0 0 86 138 Z" />
          </clipPath>

          {/* D. Matcha Chawan Cavity */}
          <clipPath id={`${uid}-chawan-cavity`}>
            <path d="M78,152 Q70,230 110,298 Q160,308 210,298 Q250,230 242,152 A 82 18 0 0 0 78 152 Z" />
          </clipPath>

          {/* E. Gongfu Gaiwan Cavity */}
          <clipPath id={`${uid}-gaiwan-cavity`}>
            <path d="M88,162 Q82,228 116,290 Q160,300 204,290 Q238,228 232,162 A 72 16 0 0 0 88 162 Z" />
          </clipPath>

          {/* F. Cold Brew Goblet Bowl Cavity */}
          <clipPath id={`${uid}-goblet-cavity`}>
            <path d="M104,106 Q94,185 132,232 Q160,240 188,232 Q226,185 216,106 A 56 12 0 0 0 104 106 Z" />
          </clipPath>

          {/* G. Wooden Kuksa Cavity */}
          <clipPath id={`${uid}-kuksa-cavity`}>
            <path d="M96,148 Q88,224 118,294 Q160,304 202,294 Q232,224 224,148 A 64 15 0 0 0 96 148 Z" />
          </clipPath>

          {/* H. Yixing Purple Clay Cup Cavity */}
          <clipPath id={`${uid}-zisha-cavity`}>
            <path d="M102,144 Q96,226 118,296 Q160,304 202,296 Q224,226 218,144 A 58 14 0 0 0 102 144 Z" />
          </clipPath>
        </defs>

        {/* ======================================================== */}
        {/* COASTER / STAND LAYER                                    */}
        {/* ======================================================== */}
        {renderCoaster(activeCoaster, uid, glaze)}

        {/* ======================================================== */}
        {/* VOLUMETRIC STEAM (Warm Rising Convection for Hot Cups)   */}
        {/* ======================================================== */}
        {effectiveSteam > 0 && (
          <g fill="none" strokeLinecap="round" opacity={effectiveSteam} transform={activeVessel === "mug" || activeVessel === "latte" || activeVessel === "gaiwan" ? "translate(0, 26)" : activeVessel === "kuksa" || activeVessel === "zisha" ? "translate(0, 28)" : activeVessel === "chawan" ? "translate(0, 12)" : undefined}>
            <path
              d="M140,116 Q122,78 144,48 Q158,26 142,8"
              stroke="#FFF2E2"
              strokeWidth="4.5"
              className="cozy-steam-1"
            />
            <path
              d="M162,120 Q184,84 160,52 Q142,30 164,6"
              stroke="#FFFFFF"
              strokeWidth="5"
              className="cozy-steam-2"
            />
            <path
              d="M184,118 Q198,80 178,50 Q166,30 180,10"
              stroke="#FFF2E2"
              strokeWidth="4"
              className="cozy-steam-3"
            />
          </g>
        )}

        {/* ======================================================== */}
        {/* VESSEL RENDERING (8 DISTINCT ARTISAN GEOMETRIES)         */}
        {/* ======================================================== */}
        {activeVessel === "mug" && (
          <g transform="translate(0, 26)">
            {renderMug(uid, glaze, clampedLevel, liquidColor, opacity, isCloudy, isClear, garnishes)}
          </g>
        )}
        {activeVessel === "tumbler" && renderTumbler(uid, glaze, clampedLevel, liquidColor, opacity, garnishes)}
        {activeVessel === "latte" && (
          <g transform="translate(0, 26)">
            {renderLatteBowl(uid, glaze, clampedLevel, liquidColor, opacity, latteArt, garnishes)}
          </g>
        )}
        {activeVessel === "chawan" && (
          <g transform="translate(0, 12)">
            {renderChawan(uid, glaze, clampedLevel, liquidColor, opacity, isCloudy, isClear, garnishes)}
          </g>
        )}
        {activeVessel === "gaiwan" && renderGaiwan(uid, glaze, clampedLevel, liquidColor, opacity, isCloudy, isClear, garnishes)}
        {activeVessel === "goblet" && renderGoblet(uid, glaze, clampedLevel, liquidColor, opacity, garnishes)}
        {activeVessel === "kuksa" && (
          <g transform="translate(0, 28)">
            {renderKuksa(uid, glaze, clampedLevel, liquidColor, opacity, isCloudy, isClear, garnishes)}
          </g>
        )}
        {activeVessel === "zisha" && (
          <g transform="translate(0, 28)">
            {renderZisha(uid, glaze, clampedLevel, liquidColor, opacity, isCloudy, isClear, garnishes)}
          </g>
        )}
      </svg>
    </motion.div>
  );
}

/* ================================================================= */
/* COASTER RENDERING                                                 */
/* ================================================================= */
function renderCoaster(style: CoasterStyle, uid: string, glaze: GlazeTheme) {
  if (style === "none") {
    return (
      <g opacity="0.85">
        <ellipse cx="160" cy="338" rx="80" ry="11" fill="#2E1C12" opacity="0.15" />
        <ellipse cx="160" cy="335" rx="55" ry="7" fill="#1C0F08" opacity="0.22" />
      </g>
    );
  }

  if (style === "wood") {
    return (
      <g>
        <ellipse cx="160" cy="344" rx="104" ry="22" fill="#381D10" opacity="0.25" />
        <ellipse cx="160" cy="339" rx="100" ry="20" fill={`url(#${uid}-coasterBamboo)`} stroke="#5E3825" strokeWidth="2.5" />
        <ellipse cx="160" cy="336" rx="88" ry="16" fill="#D4A17B" opacity="0.95" />
        <ellipse cx="160" cy="335" rx="72" ry="12" fill="none" stroke="#9E6847" strokeWidth="1.2" opacity="0.6" />
        <ellipse cx="160" cy="334" rx="52" ry="8" fill="none" stroke="#9E6847" strokeWidth="1" opacity="0.5" />
      </g>
    );
  }

  if (style === "rattan") {
    return (
      <g>
        <ellipse cx="160" cy="344" rx="106" ry="23" fill="#301A0E" opacity="0.25" />
        <ellipse cx="160" cy="340" rx="102" ry="21" fill="#C29668" stroke="#875830" strokeWidth="2.5" />
        <ellipse cx="160" cy="337" rx="90" ry="17" fill="#DFC099" stroke="#996C3E" strokeWidth="1.5" strokeDasharray="6 4" />
        <ellipse cx="160" cy="335" rx="74" ry="13" fill="#C99E72" stroke="#825227" strokeWidth="1.2" strokeDasharray="5 3" />
        <ellipse cx="160" cy="334" rx="54" ry="9" fill="#DFC099" stroke="#996C3E" strokeWidth="1" strokeDasharray="4 2" />
      </g>
    );
  }

  if (style === "marble") {
    return (
      <g>
        <ellipse cx="160" cy="344" rx="106" ry="23" fill="#1C1E26" opacity="0.2" />
        <ellipse cx="160" cy="340" rx="102" ry="20" fill={`url(#${uid}-coasterMarble)`} stroke="#B6B6C4" strokeWidth="2" />
        <ellipse cx="160" cy="337" rx="92" ry="16" fill="#FFFFFF" opacity="0.9" />
        <path d="M100,336 Q130,332 165,338 Q195,334 220,337" stroke="#C4C4D4" strokeWidth="1.2" fill="none" opacity="0.75" />
        <path d="M125,339 Q155,342 190,336" stroke="#D2D2DE" strokeWidth="0.9" fill="none" opacity="0.65" />
      </g>
    );
  }

  if (style === "stone") {
    return (
      <g>
        <ellipse cx="160" cy="346" rx="108" ry="24" fill="#121316" opacity="0.3" />
        <path
          d="M60,338 Q90,324 160,325 Q230,324 260,338 Q252,354 160,356 Q68,354 60,338 Z"
          fill={`url(#${uid}-coasterZenStone)`}
          stroke="#2A2C32"
          strokeWidth="2"
        />
        <ellipse cx="160" cy="335" rx="86" ry="14" fill="#585D66" opacity="0.6" />
        <ellipse cx="160" cy="334" rx="68" ry="10" fill="#3D4046" opacity="0.8" />
      </g>
    );
  }

  // Ceramic Saucer Default
  return (
    <g>
      <ellipse cx="160" cy="344" rx="114" ry="25" fill={glaze.saucerStroke} opacity="0.3" />
      <ellipse cx="160" cy="340" rx="110" ry="23" fill={`url(#${uid}-saucerBody)`} stroke={glaze.saucerStroke} strokeWidth="2.5" />
      <ellipse cx="160" cy="336" rx="92" ry="17" fill={glaze.saucerTop} opacity="0.85" />
      <ellipse cx="160" cy="334" rx="66" ry="11" fill={glaze.saucerBottom} opacity="0.4" stroke={glaze.saucerStroke} strokeWidth="1.2" />
      {glaze.accentGold && (
        <ellipse cx="160" cy="339" rx="108" ry="22" fill="none" stroke={glaze.accentGold} strokeWidth="1.5" opacity="0.9" />
      )}
    </g>
  );
}

/* ================================================================= */
/* 1. MUG: CLASSIC CERAMIC YUNOMI MUG                               */
/* ================================================================= */
function renderMug(
  uid: string,
  glaze: GlazeTheme,
  clampedLevel: number,
  liquidColor: string,
  opacity: number,
  isCloudy: boolean,
  isClear: boolean,
  garnishes: string[]
) {
  return (
    <g>
      {/* 3D Ergonomic Handle (Rear Backing) */}
      <g>
        <path d="M222,176 C270,176 280,256 218,272" fill="none" stroke={glaze.stroke} strokeWidth="20" strokeLinecap="round" />
        <path d="M222,176 C270,176 280,256 218,272" fill="none" stroke={`url(#${uid}-handleSheen)`} strokeWidth="16" strokeLinecap="round" />
        <path d="M222,175 C264,175 274,248 220,268" fill="none" stroke={glaze.highlight} strokeWidth="3.2" strokeLinecap="round" opacity="0.65" transform="translate(-1, -1.5)" />
      </g>

      {/* Inner Basin Back Wall & Back Rim Catchlights (Behind botanicals and fluid) */}
      <ellipse cx="160" cy="146" rx="69" ry="16.5" fill={glaze.rimInner} opacity="0.75" />
      <path d="M91,146 A 69 16.5 0 0 1 229,146" fill="none" stroke={glaze.stroke} strokeWidth="3" opacity="0.3" />
      <path d="M91,145 A 69 16.5 0 0 1 229,145" fill="none" stroke={glaze.rim} strokeWidth="4.5" />
      <path d="M93,144.5 A 67 15.5 0 0 1 227,144.5" fill="none" stroke={glaze.highlight} strokeWidth="1.8" opacity="0.8" />

      {/* Fluid Basin (Clipped to Curved Cavity) */}
      <g clipPath={`url(#${uid}-mug-cavity)`}>
        <ellipse cx="160" cy="294" rx="46" ry="10" fill="#20110A" opacity="0.28" />
        {clampedLevel > 0.01 && (
          <g style={{ transition: "all 0.8s cubic-bezier(0.2, 0.8, 0.4, 1)" }}>
            <rect
              x="75"
              y={146 + (1 - clampedLevel) * 150}
              width="170"
              height={Math.max(0, 160 - (1 - clampedLevel) * 150)}
              fill={`url(#${uid}-liquidDeepBody)`}
              style={{ transition: "y 0.8s linear, height 0.8s linear" }}
            />
            <rect
              x="75"
              y={146 + (1 - clampedLevel) * 150}
              width="170"
              height={Math.max(0, 160 - (1 - clampedLevel) * 150)}
              fill={`url(#${uid}-liquidCaustic)`}
              style={{ transition: "y 0.8s linear, height 0.8s linear" }}
            />
            <ellipse
              cx="160"
              cy={146 + (1 - clampedLevel) * 148}
              rx={Math.max(16, 68 - (1 - clampedLevel) * 24)}
              ry={Math.max(4.5, 16 - (1 - clampedLevel) * 7)}
              fill={`url(#${uid}-surfaceMeniscus)`}
              style={{ transition: "cy 0.8s linear, rx 0.8s linear, ry 0.8s linear" }}
            />
            {/* Wavelet Ripple */}
            <ellipse
              cx="160"
              cy={146 + (1 - clampedLevel) * 148}
              rx={Math.max(12, 52 - (1 - clampedLevel) * 20)}
              ry={Math.max(3.5, 11 - (1 - clampedLevel) * 5)}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1.2"
              className="ripple-anim"
            />
          </g>
        )}
      </g>

      {/* Floating Botanicals & Add-ins (Unclipped so items extending above rim are not cut off) */}
      {clampedLevel > 0.01 && (
        <g transform={`translate(0, ${(1 - clampedLevel) * 146})`} style={{ transition: "transform 0.8s linear" }}>
          {renderBotanicalsAndAddins(garnishes, 160, 146, uid)}
        </g>
      )}

      {/* Ceramic Outer Front Shell (Curved Rim Arc with NO Flat Lines) */}
      <path
        d="M91,146 Q84,224 114,296 Q160,306 206,296 Q236,224 229,146 A 69 16.5 0 0 1 91 146 Z"
        fill={`url(#${uid}-glazeBody)`}
        stroke={glaze.stroke}
        strokeWidth="2.5"
      />

      {/* Specular Highlight on Left Shoulder */}
      <path d="M102,158 Q92,222 118,284" fill="none" stroke={glaze.highlight} strokeWidth="5" strokeLinecap="round" opacity="0.4" />

      {/* Kintsugi Gold Veins */}
      {glaze.accentGold && (
        <path d="M120,165 Q135,210 130,245 Q125,275 140,298" stroke={glaze.accentGold} strokeWidth="2.2" strokeLinecap="round" fill="none" />
      )}

      {/* 3D Ceramic Front Rim Catchlights (Only the front lip, in front of the front shell) */}
      <path d="M91,146 A 69 16.5 0 0 0 229,146" fill="none" stroke={glaze.stroke} strokeWidth="3" opacity="0.3" />
      <path d="M91,145 A 69 16.5 0 0 0 229,145" fill="none" stroke={glaze.rim} strokeWidth="4.5" />
      <path d="M93,144.5 A 67 15.5 0 0 0 227,144.5" fill="none" stroke={glaze.highlight} strokeWidth="1.8" opacity="0.8" />
    </g>
  );
}

/* ================================================================= */
/* 2. TUMBLER: FLUTED CRYSTAL CAN GLASS (ICED)                       */
/* ================================================================= */
function renderTumbler(
  uid: string,
  glaze: GlazeTheme,
  clampedLevel: number,
  liquidColor: string,
  opacity: number,
  garnishes: string[]
) {
  return (
    <g>
      {/* Heavy Sham Glass Base */}
      <path d="M112,302 L208,302 L206,322 Q160,332 114,322 Z" fill={`url(#${uid}-glassHeavyBase)`} stroke="#C4E0EC" strokeWidth="2" />
      <ellipse cx="160" cy="310" rx="42" ry="7" fill="#E8F4FA" opacity="0.65" />

      {/* Inner Basin Back Wall & Back Rim Lip (Behind fluid and botanicals) */}
      <ellipse cx="160" cy="114" rx="58" ry="13" fill="#EAF4FA" opacity="0.45" />
      <path d="M102,114 A 58 13 0 0 1 218,114" fill="none" stroke="#E6F2F7" strokeWidth="3.5" />
      <path d="M103.5,113.5 A 56.5 12 0 0 1 216.5,113.5" fill="none" stroke="#FFFFFF" strokeWidth="1.8" opacity="0.85" />

      {/* Glass Cavity with Liquid & Ice */}
      <g clipPath={`url(#${uid}-tumbler-cavity)`}>
        {clampedLevel > 0.01 && (
          <g style={{ transition: "all 0.8s cubic-bezier(0.2, 0.8, 0.4, 1)" }}>
            <rect
              x="90"
              y={118 + (1 - clampedLevel) * 190}
              width="140"
              height={Math.max(0, 205 - (1 - clampedLevel) * 190)}
              fill={`url(#${uid}-liquidDeepBody)`}
              style={{ transition: "y 0.8s linear, height 0.8s linear" }}
            />
            <ellipse
              cx="160"
              cy={118 + (1 - clampedLevel) * 190}
              rx={Math.max(22, 57 - (1 - clampedLevel) * 11)}
              ry={Math.max(4.5, 13 - (1 - clampedLevel) * 3.5)}
              fill={`url(#${uid}-surfaceMeniscus)`}
              style={{ transition: "cy 0.8s linear, rx 0.8s linear, ry 0.8s linear" }}
            />

            {/* Boba Pearls Settled at the Base */}
            {garnishes.includes("boba") && renderBobaBottomClusters(uid)}

            {/* 3D Crystal Ice Cubes */}
            {renderIceCubes(uid, clampedLevel)}

          </g>
        )}
      </g>

      {/* Floating Botanicals & Add-ins (Unclipped so items extending above rim are not cut off) */}
      {clampedLevel > 0.01 && (
        <g transform={`translate(0, ${(1 - clampedLevel) * 185})`} style={{ transition: "transform 0.8s linear" }}>
          {renderBotanicalsAndAddins(garnishes, 160, 122, uid)}
        </g>
      )}

      {/* Glass Wall Outer Specular Shell */}
      <path
        d="M102,114 L114,308 Q160,318 206,308 L218,114 A 58 13 0 0 1 102 114 Z"
        fill={`url(#${uid}-glassWallSpecular)`}
        stroke="#DCEAF2"
        strokeWidth="2.5"
      />
      <path d="M112,126 L119,300" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" opacity="0.6" />
      <path d="M208,126 L201,300" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.4" />

      {/* Condensation Droplets */}
      <g fill="#FFFFFF" opacity="0.8">
        <circle cx="114" cy="172" r="2.6" />
        <circle cx="115" cy="186" r="1.8" />
        <circle cx="117" cy="225" r="2.2" />
        <circle cx="205" cy="195" r="2.8" />
        <circle cx="204" cy="210" r="2.0" />
        <circle cx="203" cy="248" r="2.4" />
        <circle cx="138" cy="265" r="2.2" />
        <circle cx="182" cy="275" r="2.5" />
        <path d="M115,188 Q115,198 116,204" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.75" />
      </g>

      {/* Front Rim Lip Catchlight */}
      <path d="M102,114 A 58 13 0 0 0 218,114" fill="none" stroke="#E6F2F7" strokeWidth="3.5" />
      <path d="M103.5,113.5 A 56.5 12 0 0 0 216.5,113.5" fill="none" stroke="#FFFFFF" strokeWidth="1.8" opacity="0.85" />

      {/* Reusable Eco Glass Straw */}
      <g transform="translate(196, 75) rotate(14)">
        <rect x="0" y="0" width="8.5" height="195" rx="4.2" fill="#FFFFFF" opacity="0.75" stroke="#C8E2ED" strokeWidth="1.2" />
        <line x1="2.2" y1="0" x2="2.2" y2="195" stroke="#FF758F" strokeWidth="2.2" strokeDasharray="10 8" opacity="0.65" />
      </g>
    </g>
  );
}

/* ================================================================= */
/* 3. LATTE BOWL: WIDE CAFE LATTE MUG                                */
/* ================================================================= */
function renderLatteBowl(
  uid: string,
  glaze: GlazeTheme,
  clampedLevel: number,
  liquidColor: string,
  opacity: number,
  latteArt: LatteArtType = "bear",
  garnishes: string[]
) {
  return (
    <g>
      {/* Creamy Handle */}
      <g>
        <path d="M228,172 C274,172 284,252 224,270" fill="none" stroke="#D6C4B2" strokeWidth="19" strokeLinecap="round" />
        <path d="M228,172 C274,172 284,252 224,270" fill="none" stroke={glaze.bodyTop} strokeWidth="15" strokeLinecap="round" />
        <path d="M228,172 C274,172 284,252 224,270" fill="none" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" opacity="0.8" transform="translate(-1, -1.5)" />
      </g>

      {/* Inner Basin Back Wall & Back Rim Catchlights (Behind botanicals and fluid) */}
      <ellipse cx="160" cy="138" rx="74" ry="17" fill={glaze.rimInner} opacity="0.75" />
      <path d="M86,138 A 74 17 0 0 1 234,138" fill="none" stroke={glaze.stroke} strokeWidth="3" opacity="0.4" />
      <path d="M86,137 A 74 17 0 0 1 234,137" fill="none" stroke="#FFFFFF" strokeWidth="5" />
      <path d="M88,136.5 A 72 16 0 0 1 232,136.5" fill="none" stroke={glaze.rim} strokeWidth="2" opacity="0.85" />

      {/* Cavity & Foam Cap */}
      <g clipPath={`url(#${uid}-latte-cavity)`}>
        <ellipse cx="160" cy="294" rx="46" ry="10" fill="#2E1C14" opacity="0.2" />
        {clampedLevel > 0.01 && (
          <g style={{ transition: "all 0.8s cubic-bezier(0.2, 0.8, 0.4, 1)" }}>
            <rect
              x="75"
              y={138 + (1 - clampedLevel) * 155}
              width="170"
              height={Math.max(0, 175 - (1 - clampedLevel) * 155)}
              fill={`url(#${uid}-latteOmbreLayer)`}
              style={{ transition: "y 0.8s linear, height 0.8s linear" }}
            />
            {garnishes.includes("boba") && renderBobaBottomClusters(uid)}

            {/* Microfoam Disc */}
            <ellipse
              cx="160"
              cy={142 + (1 - clampedLevel) * 152}
              rx={Math.max(18, 72 - (1 - clampedLevel) * 24)}
              ry={Math.max(4.5, 17 - (1 - clampedLevel) * 7)}
              fill={`url(#${uid}-microfoamDisk)`}
              style={{ transition: "cy 0.8s linear, rx 0.8s linear, ry 0.8s linear" }}
            />

            {/* Barista Latte Art */}
            <g transform={`translate(0, ${(1 - clampedLevel) * 152})`} style={{ transition: "transform 0.8s linear" }}>
              {renderLatteArt(latteArt, liquidColor)}
            </g>

          </g>
        )}
      </g>

      {/* Floating Botanicals & Add-ins (Unclipped so items extending above rim are not cut off) */}
      {clampedLevel > 0.01 && (
        <g transform={`translate(0, ${(1 - clampedLevel) * 152})`} style={{ transition: "transform 0.8s linear" }}>
          {renderBotanicalsAndAddins(garnishes, 160, 142, uid)}
        </g>
      )}

      {/* Wide Cafe Mug Outer Shell (Smooth Curved Rim with NO Flat Line) */}
      <path
        d="M86,138 Q78,222 112,296 Q160,306 208,296 Q242,222 234,138 A 74 17 0 0 1 86 138 Z"
        fill={`url(#${uid}-glazeBody)`}
        stroke={glaze.stroke}
        strokeWidth="2.8"
      />
      <path d="M96,152 Q88,218 114,284" fill="none" stroke="#FFFFFF" strokeWidth="5.5" strokeLinecap="round" opacity="0.65" />

      {/* 3D Ceramic Front Rim Catchlights */}
      <path d="M86,138 A 74 17 0 0 0 234,138" fill="none" stroke={glaze.stroke} strokeWidth="3" opacity="0.4" />
      <path d="M86,137 A 74 17 0 0 0 234,137" fill="none" stroke="#FFFFFF" strokeWidth="5" />
      <path d="M88,136.5 A 72 16 0 0 0 232,136.5" fill="none" stroke={glaze.rim} strokeWidth="2" opacity="0.85" />
    </g>
  );
}

/* ================================================================= */
/* 4. CHAWAN: JAPANESE CEREMONIAL MATCHA BOWL                        */
/* ================================================================= */
function renderChawan(
  uid: string,
  glaze: GlazeTheme,
  clampedLevel: number,
  liquidColor: string,
  opacity: number,
  isCloudy: boolean,
  isClear: boolean,
  garnishes: string[]
) {
  return (
    <g>
      {/* Heavy Clay Foot Ring (Kodai) */}
      <path d="M124,300 L196,300 L192,316 Q160,322 128,316 Z" fill={glaze.bodyBottom} stroke={glaze.stroke} strokeWidth="2.2" />
      <ellipse cx="160" cy="308" rx="34" ry="6" fill="#1C140E" opacity="0.3" />

      {/* Inner Basin Back Wall & Back Rim Lip */}
      <ellipse cx="160" cy="152" rx="82" ry="18" fill={glaze.rimInner} opacity="0.75" />
      <path d="M78,152 A 82 18 0 0 1 242,152" fill="none" stroke={glaze.rim} strokeWidth="4.5" />
      <path d="M80,151.5 A 80 17 0 0 1 240,151.5" fill="none" stroke={glaze.highlight} strokeWidth="1.8" opacity="0.8" />

      {/* Fluid Basin */}
      <g clipPath={`url(#${uid}-chawan-cavity)`}>
        <ellipse cx="160" cy="296" rx="48" ry="10" fill="#1B2610" opacity="0.3" />
        {clampedLevel > 0.01 && (
          <g style={{ transition: "all 0.8s cubic-bezier(0.2, 0.8, 0.4, 1)" }}>
            <rect
              x="70"
              y={154 + (1 - clampedLevel) * 144}
              width="180"
              height={Math.max(0, 155 - (1 - clampedLevel) * 144)}
              fill={`url(#${uid}-liquidDeepBody)`}
              style={{ transition: "y 0.8s linear, height 0.8s linear" }}
            />
            <ellipse
              cx="160"
              cy={154 + (1 - clampedLevel) * 142}
              rx={Math.max(20, 78 - (1 - clampedLevel) * 28)}
              ry={Math.max(5, 18 - (1 - clampedLevel) * 8)}
              fill={`url(#${uid}-surfaceMeniscus)`}
              style={{ transition: "cy 0.8s linear, rx 0.8s linear, ry 0.8s linear" }}
            />

            {/* Matcha Whisk Froth Foam Texture */}
            <g
              transform={`translate(0, ${(1 - clampedLevel) * 142})`}
              opacity={Math.min(1, clampedLevel * 1.2)}
              fill="#FFFFFF"
            >
              <circle cx="130" cy="154" r="3.5" opacity="0.55" />
              <circle cx="142" cy="158" r="2.8" opacity="0.6" />
              <circle cx="158" cy="152" r="4.0" opacity="0.5" />
              <circle cx="174" cy="156" r="2.6" opacity="0.65" />
              <circle cx="188" cy="153" r="3.2" opacity="0.55" />
              <circle cx="148" cy="162" r="2.2" opacity="0.7" />
              <circle cx="168" cy="160" r="2.5" opacity="0.65" />
            </g>

          </g>
        )}
      </g>

      {/* Floating Botanicals & Add-ins (Unclipped so items extending above rim are not cut off) */}
      {clampedLevel > 0.01 && (
        <g transform={`translate(0, ${(1 - clampedLevel) * 142})`} style={{ transition: "transform 0.8s linear" }}>
          {renderBotanicalsAndAddins(garnishes, 160, 154, uid)}
        </g>
      )}

      {/* Organic Wabi-Sabi Bowl Front Body */}
      <path
        d="M78,152 Q70,230 110,298 Q160,308 210,298 Q250,230 242,152 A 82 18 0 0 1 78 152 Z"
        fill={`url(#${uid}-glazeBody)`}
        stroke={glaze.stroke}
        strokeWidth="3"
      />

      {/* Tactile Glaze Drops & Highlights */}
      <path d="M90,165 Q80,224 114,288" fill="none" stroke={glaze.highlight} strokeWidth="4" opacity="0.45" strokeLinecap="round" />

      {/* Uneven Wabi-Sabi Front Rim Lip */}
      <path d="M78,152 A 82 18 0 0 0 242,152" fill="none" stroke={glaze.rim} strokeWidth="4.5" />
      <path d="M80,151.5 A 80 17 0 0 0 240,151.5" fill="none" stroke={glaze.highlight} strokeWidth="1.8" opacity="0.8" />
    </g>
  );
}

/* ================================================================= */
/* 5. GAIWAN: CHINESE GONGFU LIDDED BOWL                             */
/* ================================================================= */
function renderGaiwan(
  uid: string,
  glaze: GlazeTheme,
  clampedLevel: number,
  liquidColor: string,
  opacity: number,
  isCloudy: boolean,
  isClear: boolean,
  garnishes: string[]
) {
  return (
    <g>
      {/* Gaiwan Stepped Saucer Base */}
      <g>
        <ellipse cx="160" cy="336" rx="98" ry="19" fill={glaze.saucerStroke} opacity="0.35" />
        <ellipse cx="160" cy="332" rx="94" ry="17" fill={`url(#${uid}-saucerBody)`} stroke={glaze.saucerStroke} strokeWidth="2" />
        <ellipse cx="160" cy="328" rx="72" ry="12" fill={glaze.saucerTop} opacity="0.9" />
        <ellipse cx="160" cy="326" rx="46" ry="7" fill={glaze.saucerBottom} opacity="0.5" />
      </g>

      {/* Gaiwan Bowl, Liquid, and Lid (Resting in Saucer Well) */}
      <g transform="translate(0, 24)">
        {/* Inner Basin Back Wall & Back Rim Catchlight */}
        <ellipse cx="160" cy="162" rx="72" ry="16" fill={glaze.rimInner} opacity="0.75" />
        <path d="M88,162 A 72 16 0 0 1 232,162" fill="none" stroke={glaze.rim} strokeWidth="4" />
        <path d="M90,161 A 70 15 0 0 1 230,161" fill="none" stroke={glaze.highlight} strokeWidth="1.8" opacity="0.85" />

        {/* Fluid Basin */}
        <g clipPath={`url(#${uid}-gaiwan-cavity)`}>
          <ellipse cx="160" cy="288" rx="42" ry="9" fill="#1C120B" opacity="0.25" />
          {clampedLevel > 0.01 && (
            <g style={{ transition: "all 0.8s cubic-bezier(0.2, 0.8, 0.4, 1)" }}>
              <rect
                x="78"
                y={162 + (1 - clampedLevel) * 130}
                width="164"
                height={Math.max(0, 140 - (1 - clampedLevel) * 130)}
                fill={`url(#${uid}-liquidDeepBody)`}
                style={{ transition: "y 0.8s linear, height 0.8s linear" }}
              />
              <ellipse
                cx="160"
                cy={162 + (1 - clampedLevel) * 128}
                rx={Math.max(18, 68 - (1 - clampedLevel) * 26)}
                ry={Math.max(4.5, 15 - (1 - clampedLevel) * 6)}
                fill={`url(#${uid}-surfaceMeniscus)`}
                style={{ transition: "cy 0.8s linear, rx 0.8s linear, ry 0.8s linear" }}
              />
            </g>
          )}
        </g>

        {/* Floating Botanicals & Add-ins (Unclipped so items extending above rim are not cut off) */}
        {clampedLevel > 0.01 && (
          <g transform={`translate(0, ${(1 - clampedLevel) * 128})`} style={{ transition: "transform 0.8s linear" }}>
            {renderBotanicalsAndAddins(garnishes, 160, 162, uid)}
          </g>
        )}

        {/* Flared Gaiwan Porcelain Cup Body (Smooth Curved Arc) */}
        <path
          d="M88,162 Q82,228 116,290 Q160,300 204,290 Q238,228 232,162 A 72 16 0 0 1 88 162 Z"
          fill={`url(#${uid}-glazeBody)`}
          stroke={glaze.stroke}
          strokeWidth="2.5"
        />
        <path d="M98,172 Q92,222 120,280" fill="none" stroke={glaze.highlight} strokeWidth="4.5" opacity="0.5" strokeLinecap="round" />

        {/* Flared Front Rim Catchlight */}
        <path d="M88,162 A 72 16 0 0 0 232,162" fill="none" stroke={glaze.rim} strokeWidth="4" />
        <path d="M90,161 A 70 15 0 0 0 230,161" fill="none" stroke={glaze.highlight} strokeWidth="1.8" opacity="0.85" />

        {/* Tilted / Resting Gaiwan Lid with Finial Crown Knob */}
        <g transform="translate(4, -18) rotate(3 160 140)">
          {/* Domed Lid Body */}
          <path
            d="M106,146 Q160,118 214,146 Q160,154 106,146 Z"
            fill={`url(#${uid}-glazeBody)`}
            stroke={glaze.stroke}
            strokeWidth="2.2"
          />
          <ellipse cx="160" cy="146" rx="54" ry="9" fill="none" stroke={glaze.rim} strokeWidth="3" />
          <ellipse cx="160" cy="145" rx="52" ry="8" fill="none" stroke={glaze.highlight} strokeWidth="1.5" opacity="0.75" />

          {/* Crown Knob (Jewel finial) */}
          <ellipse cx="160" cy="120" rx="14" ry="6" fill={glaze.bodyTop} stroke={glaze.stroke} strokeWidth="1.8" />
          <ellipse cx="160" cy="119" rx="12" ry="4.5" fill={glaze.highlight} opacity="0.9" />
          {glaze.accentGold && <circle cx="160" cy="119" r="3.5" fill={glaze.accentGold} />}
        </g>
      </g>
    </g>
  );
}

/* ================================================================= */
/* 6. GOBLET: STEMMED COLD BREW WINE GLASS                           */
/* ================================================================= */
function renderGoblet(
  uid: string,
  glaze: GlazeTheme,
  clampedLevel: number,
  liquidColor: string,
  opacity: number,
  garnishes: string[]
) {
  return (
    <g>
      {/* Stemmed Base Foot */}
      <ellipse cx="160" cy="336" rx="52" ry="12" fill="#3D5060" opacity="0.25" />
      <ellipse cx="160" cy="332" rx="48" ry="10" fill={`url(#${uid}-glassHeavyBase)`} stroke="#C4E0EC" strokeWidth="2" />
      <ellipse cx="160" cy="330" rx="38" ry="7" fill="#FFFFFF" opacity="0.75" />

      {/* Slender Crystal Stem */}
      <rect x="156.5" y="235" width="7" height="96" rx="3.5" fill={`url(#${uid}-glassHeavyBase)`} stroke="#C4E0EC" strokeWidth="1.2" />
      <line x1="158.5" y1="238" x2="158.5" y2="328" stroke="#FFFFFF" strokeWidth="1.8" opacity="0.8" />

      {/* Inner Basin Back Wall & Back Rim Lip */}
      <ellipse cx="160" cy="106" rx="56" ry="12" fill="#EAF4FA" opacity="0.4" />
      <path d="M104,106 A 56 12 0 0 1 216,106" fill="none" stroke="#E6F2F7" strokeWidth="2.8" />
      <path d="M105.5,105.5 A 54.5 11 0 0 1 214.5,105.5" fill="none" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.9" />

      {/* Liquid in Bowl */}
      <g clipPath={`url(#${uid}-goblet-cavity)`}>
        {clampedLevel > 0.01 && (
          <g style={{ transition: "all 0.8s cubic-bezier(0.2, 0.8, 0.4, 1)" }}>
            <rect
              x="90"
              y={106 + (1 - clampedLevel) * 130}
              width="140"
              height={Math.max(0, 140 - (1 - clampedLevel) * 130)}
              fill={`url(#${uid}-liquidDeepBody)`}
              style={{ transition: "y 0.8s linear, height 0.8s linear" }}
            />
            <ellipse
              cx="160"
              cy={106 + (1 - clampedLevel) * 128}
              rx={Math.max(16, 56 - (1 - clampedLevel) * 20)}
              ry={Math.max(4, 13 - (1 - clampedLevel) * 4)}
              fill={`url(#${uid}-surfaceMeniscus)`}
              style={{ transition: "cy 0.8s linear, rx 0.8s linear, ry 0.8s linear" }}
            />

            {/* Rising Sparkling Effervescence Bubbles */}
            <g className="effervescence-anim" fill="#FFFFFF" opacity="0.8">
              <circle cx="145" cy="180" r="1.5" />
              <circle cx="155" cy="195" r="2.0" />
              <circle cx="168" cy="175" r="1.8" />
              <circle cx="178" cy="190" r="1.2" />
            </g>

          </g>
        )}
      </g>

      {/* Floating Botanicals & Add-ins (Unclipped so items extending above rim are not cut off) */}
      {clampedLevel > 0.01 && (
        <g transform={`translate(0, ${(1 - clampedLevel) * 128})`} style={{ transition: "transform 0.8s linear" }}>
          {renderBotanicalsAndAddins(garnishes, 160, 108, uid)}
        </g>
      )}

      {/* Crystal Tulip Bowl Outer Shell (Smooth Curved Rim) */}
      <path
        d="M104,106 Q94,185 132,232 Q160,240 188,232 Q226,185 216,106 A 56 12 0 0 1 104 106 Z"
        fill={`url(#${uid}-glassWallSpecular)`}
        stroke="#C8E2ED"
        strokeWidth="2.2"
      />

      {/* Specular Catchlights on Glass Curvature */}
      <path d="M109,118 Q101,175 130,224" stroke="#FFFFFF" strokeWidth="3" fill="none" opacity="0.65" strokeLinecap="round" />
      <path d="M211,118 Q219,175 190,224" stroke="#FFFFFF" strokeWidth="1.8" fill="none" opacity="0.4" strokeLinecap="round" />

      {/* Fine Crystal Front Rim Lip */}
      <path d="M104,106 A 56 12 0 0 0 216,106" fill="none" stroke="#E6F2F7" strokeWidth="2.8" />
      <path d="M105.5,105.5 A 54.5 11 0 0 0 214.5,105.5" fill="none" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.9" />
    </g>
  );
}

/* ================================================================= */
/* 7. KUKSA: SCANDINAVIAN CARVED WOODEN CUP                          */
/* ================================================================= */
function renderKuksa(
  uid: string,
  glaze: GlazeTheme,
  clampedLevel: number,
  liquidColor: string,
  opacity: number,
  isCloudy: boolean,
  isClear: boolean,
  garnishes: string[]
) {
  return (
    <g>
      {/* Carved Dual-Finger Wooden Handle */}
      <g>
        <path
          d="M214,175 C268,170 274,248 214,260 L212,242 C248,236 244,192 214,195 Z"
          fill="#BA8252"
          stroke="#6E401B"
          strokeWidth="2.5"
        />
        <circle cx="238" cy="202" r="7.5" fill="#3D200E" opacity="0.35" stroke="#6E401B" strokeWidth="1.5" />
        <circle cx="238" cy="226" r="7.5" fill="#3D200E" opacity="0.35" stroke="#6E401B" strokeWidth="1.5" />
        <path d="M252,246 Q268,272 262,304" stroke="#8C4A26" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="262" cy="304" r="5" fill="#DEAC7F" stroke="#6E401B" strokeWidth="1.2" />
      </g>

      {/* Inner Basin Back Wall & Back Rim Lip */}
      <ellipse cx="160" cy="148" rx="64" ry="15" fill={glaze.rimInner} opacity="0.75" />
      <path d="M96,148 A 64 15 0 0 1 224,148" fill="none" stroke="#6E401B" strokeWidth="3.5" />
      <path d="M96,147 A 64 15 0 0 1 224,147" fill="none" stroke="#ECC39B" strokeWidth="2.5" />
      <path d="M98,146.5 A 62 14 0 0 1 222,146.5" fill="none" stroke="#F8DFCA" strokeWidth="1.2" opacity="0.75" />

      {/* Fluid Basin */}
      <g clipPath={`url(#${uid}-kuksa-cavity)`}>
        <ellipse cx="160" cy="292" rx="42" ry="9" fill="#2E170A" opacity="0.3" />
        {clampedLevel > 0.01 && (
          <g style={{ transition: "all 0.8s cubic-bezier(0.2, 0.8, 0.4, 1)" }}>
            <rect
              x="80"
              y={148 + (1 - clampedLevel) * 148}
              width="160"
              height={Math.max(0, 155 - (1 - clampedLevel) * 148)}
              fill={`url(#${uid}-liquidDeepBody)`}
              style={{ transition: "y 0.8s linear, height 0.8s linear" }}
            />
            <ellipse
              cx="160"
              cy={148 + (1 - clampedLevel) * 146}
              rx={Math.max(16, 64 - (1 - clampedLevel) * 22)}
              ry={Math.max(4.5, 15 - (1 - clampedLevel) * 6)}
              fill={`url(#${uid}-surfaceMeniscus)`}
              style={{ transition: "cy 0.8s linear, rx 0.8s linear, ry 0.8s linear" }}
            />
          </g>
        )}
      </g>

      {/* Floating Botanicals & Add-ins (Unclipped so items extending above rim are not cut off) */}
      {clampedLevel > 0.01 && (
        <g transform={`translate(0, ${(1 - clampedLevel) * 146})`} style={{ transition: "transform 0.8s linear" }}>
          {renderBotanicalsAndAddins(garnishes, 160, 148, uid)}
        </g>
      )}

      {/* Solid Carved Wooden Body (Smooth Curved Rim) */}
      <path
        d="M96,148 Q88,224 118,294 Q160,304 202,294 Q232,224 224,148 A 64 15 0 0 1 96 148 Z"
        fill={`url(#${uid}-glazeBody)`}
        stroke="#6E401B"
        strokeWidth="3"
      />

      {/* Wood Growth Grain Streaks */}
      <path d="M106,175 Q112,226 128,276" stroke="#8A5126" strokeWidth="2" fill="none" opacity="0.55" />
      <path d="M120,165 Q128,218 148,284" stroke="#8A5126" strokeWidth="1.5" fill="none" opacity="0.45" />
      <path d="M210,175 Q204,226 188,276" stroke="#8A5126" strokeWidth="2" fill="none" opacity="0.55" />

      {/* Carved Wooden Front Rim Lip */}
      <path d="M96,148 A 64 15 0 0 0 224,148" fill="none" stroke="#6E401B" strokeWidth="3.5" />
      <path d="M96,147 A 64 15 0 0 0 224,147" fill="none" stroke="#ECC39B" strokeWidth="2.5" />
      <path d="M98,146.5 A 62 14 0 0 0 222,146.5" fill="none" stroke="#F8DFCA" strokeWidth="1.2" opacity="0.75" />
    </g>
  );
}

/* ================================================================= */
/* 8. ZISHA: YIXING PURPLE CLAY CUP                                  */
/* ================================================================= */
function renderZisha(
  uid: string,
  glaze: GlazeTheme,
  clampedLevel: number,
  liquidColor: string,
  opacity: number,
  isCloudy: boolean,
  isClear: boolean,
  garnishes: string[]
) {
  return (
    <g>
      {/* Inner Basin Back Wall & Back Rim Catchlights */}
      <ellipse cx="160" cy="144" rx="58" ry="14" fill={glaze.rimInner} opacity="0.75" />
      <path d="M102,144 A 58 14 0 0 1 218,144" fill="none" stroke="#2E1B15" strokeWidth="3.5" />
      <path d="M102,143 A 58 14 0 0 1 218,143" fill="none" stroke={glaze.rim} strokeWidth="2.5" />
      <path d="M103.5,142.5 A 56.5 13 0 0 1 216.5,142.5" fill="none" stroke={glaze.highlight} strokeWidth="1.2" opacity="0.7" />

      {/* Fluid Basin */}
      <g clipPath={`url(#${uid}-zisha-cavity)`}>
        <ellipse cx="160" cy="294" rx="42" ry="9" fill="#1C0E0A" opacity="0.3" />
        {clampedLevel > 0.01 && (
          <g style={{ transition: "all 0.8s cubic-bezier(0.2, 0.8, 0.4, 1)" }}>
            <rect
              x="85"
              y={144 + (1 - clampedLevel) * 152}
              width="150"
              height={Math.max(0, 160 - (1 - clampedLevel) * 152)}
              fill={`url(#${uid}-liquidDeepBody)`}
              style={{ transition: "y 0.8s linear, height 0.8s linear" }}
            />
            <ellipse
              cx="160"
              cy={144 + (1 - clampedLevel) * 150}
              rx={Math.max(16, 58 - (1 - clampedLevel) * 18)}
              ry={Math.max(4.5, 14 - (1 - clampedLevel) * 5)}
              fill={`url(#${uid}-surfaceMeniscus)`}
              style={{ transition: "cy 0.8s linear, rx 0.8s linear, ry 0.8s linear" }}
            />
          </g>
        )}
      </g>

      {/* Floating Botanicals & Add-ins (Unclipped so items extending above rim are not cut off) */}
      {clampedLevel > 0.01 && (
        <g transform={`translate(0, ${(1 - clampedLevel) * 150})`} style={{ transition: "transform 0.8s linear" }}>
          {renderBotanicalsAndAddins(garnishes, 160, 144, uid)}
        </g>
      )}

      {/* Straight Profile Yixing Purple Clay Front Body (Smooth Curved Rim) */}
      <path
        d="M102,144 Q96,226 118,296 Q160,304 202,296 Q224,226 218,144 A 58 14 0 0 1 102 144 Z"
        fill={`url(#${uid}-glazeBody)`}
        stroke="#2E1B15"
        strokeWidth="2.8"
      />

      {/* Mineral Clay Shimmer & Matte Texture Ring */}
      <path d="M108,155 Q102,220 122,284" fill="none" stroke={glaze.highlight} strokeWidth="3.5" opacity="0.35" strokeLinecap="round" />
      <line x1="102" y1="200" x2="218" y2="200" stroke="#2E1B15" strokeWidth="1.5" opacity="0.4" />
      <line x1="106" y1="250" x2="214" y2="250" stroke="#2E1B15" strokeWidth="1.2" opacity="0.3" />

      {/* Traditional Zisha Clay Front Rim Catchlights */}
      <path d="M102,144 A 58 14 0 0 0 218,144" fill="none" stroke="#2E1B15" strokeWidth="3.5" />
      <path d="M102,143 A 58 14 0 0 0 218,143" fill="none" stroke={glaze.rim} strokeWidth="2.5" />
      <path d="M103.5,142.5 A 56.5 13 0 0 0 216.5,142.5" fill="none" stroke={glaze.highlight} strokeWidth="1.2" opacity="0.7" />
    </g>
  );
}

/* ================================================================= */
/* ICE CUBE RENDERING                                                */
/* ================================================================= */
function renderIceCubes(uid: string, clampedLevel: number) {
  return (
    <g>
      {/* Cube 1 */}
      <g
        className="ice-float-1"
        transform={`translate(120, ${Math.min(265, 126 + (1 - clampedLevel) * 148)})`}
        style={{ transition: "transform 0.8s linear" }}
      >
        <path d="M0,10 L28,0 L40,12 L12,24 Z" fill={`url(#${uid}-iceTopFace)`} stroke="#EBF6FC" strokeWidth="1.2" />
        <path d="M0,10 L12,24 L12,48 L0,34 Z" fill={`url(#${uid}-iceFrontFace)`} stroke="#D1ECF9" strokeWidth="1.2" />
        <path d="M12,24 L40,12 L40,36 L12,48 Z" fill="#B8E2F6" fillOpacity="0.45" stroke="#D1ECF9" strokeWidth="1.2" />
        <circle cx="20" cy="24" r="2.2" fill="#FFFFFF" opacity="0.8" />
        <circle cx="25" cy="27" r="1.4" fill="#FFFFFF" opacity="0.6" />
      </g>
      {/* Cube 2 */}
      <g
        className="ice-float-2"
        transform={`translate(156, ${Math.min(272, 142 + (1 - clampedLevel) * 135)})`}
        style={{ transition: "transform 0.8s linear" }}
      >
        <path d="M0,8 L24,0 L36,10 L10,20 Z" fill={`url(#${uid}-iceTopFace)`} stroke="#EBF6FC" strokeWidth="1.2" />
        <path d="M0,8 L10,20 L10,40 L0,28 Z" fill={`url(#${uid}-iceFrontFace)`} stroke="#D1ECF9" strokeWidth="1.2" />
        <path d="M10,20 L36,10 L36,30 L10,40 Z" fill="#B8E2F6" fillOpacity="0.4" stroke="#D1ECF9" strokeWidth="1.2" />
        <circle cx="18" cy="20" r="1.8" fill="#FFFFFF" opacity="0.75" />
      </g>
      {/* Cube 3 */}
      <g
        className="ice-float-3"
        transform={`translate(132, ${Math.min(276, 185 + (1 - clampedLevel) * 95)})`}
        style={{ transition: "transform 0.8s linear" }}
      >
        <path d="M0,7 L22,0 L32,8 L9,17 Z" fill={`url(#${uid}-iceTopFace)`} stroke="#EBF6FC" strokeWidth="1" />
        <path d="M0,7 L9,17 L9,34 L0,24 Z" fill={`url(#${uid}-iceFrontFace)`} stroke="#D1ECF9" strokeWidth="1" />
        <path d="M9,17 L32,8 L32,25 L9,34 Z" fill="#B8E2F6" fillOpacity="0.35" stroke="#D1ECF9" strokeWidth="1" />
      </g>
    </g>
  );
}

/* ================================================================= */
/* 5 BARISTA LATTE FOAM ART DESIGNS                                  */
/* ================================================================= */
function renderLatteArt(art: LatteArtType, liquidColor: string) {
  if (art === "bear") {
    return (
      <g transform="translate(160, 142)">
        <circle cx="-17" cy="-11" r="7.5" fill={liquidColor} opacity="0.75" />
        <circle cx="-17" cy="-11" r="4.5" fill="#FFFFFF" opacity="0.95" />
        <circle cx="17" cy="-11" r="7.5" fill={liquidColor} opacity="0.75" />
        <circle cx="17" cy="-11" r="4.5" fill="#FFFFFF" opacity="0.95" />
        <ellipse cx="0" cy="-1" rx="20" ry="12.5" fill={liquidColor} opacity="0.65" />
        <ellipse cx="0" cy="-1" rx="19" ry="11.5" fill="#FFFFFF" opacity="0.96" />
        <ellipse cx="-11" cy="1" rx="4" ry="2.2" fill="#FF9BB2" opacity="0.7" />
        <ellipse cx="11" cy="1" rx="4" ry="2.2" fill="#FF9BB2" opacity="0.7" />
        <ellipse cx="0" cy="1.5" rx="7" ry="4.5" fill={liquidColor} opacity="0.25" />
        <ellipse cx="0" cy="1.5" rx="6" ry="4" fill="#FFFFFF" />
        <circle cx="-7" cy="-2.5" r="1.6" fill={liquidColor} />
        <circle cx="-6.4" cy="-2.9" r="0.6" fill="#FFFFFF" />
        <circle cx="7" cy="-2.5" r="1.6" fill={liquidColor} />
        <circle cx="7.6" cy="-2.9" r="0.6" fill="#FFFFFF" />
        <ellipse cx="0" cy="0.5" rx="2" ry="1.4" fill={liquidColor} />
        <path d="M-2,2 Q0,3.6 2,2" stroke={liquidColor} strokeWidth="0.9" fill="none" />
        <circle cx="-14" cy="9" r="3.2" fill="#FFFFFF" stroke={liquidColor} strokeWidth="0.6" opacity="0.9" />
        <circle cx="14" cy="9" r="3.2" fill="#FFFFFF" stroke={liquidColor} strokeWidth="0.6" opacity="0.9" />
      </g>
    );
  }

  if (art === "heart") {
    return (
      <g transform="translate(160, 141)">
        <path d="M0,9 C-14,3 -20,-7 -11,-11 C-3,-14 0,-4 0,-4 C0,-4 3,-14 11,-11 C20,-7 14,3 0,9 Z" fill={liquidColor} opacity="0.75" />
        <path d="M0,6 C-9,1 -14,-5 -8,-8 C-2,-10 0,-3 0,-3 C0,-3 2,-10 8,-8 C14,-5 9,1 0,6 Z" fill="#FFFFFF" opacity="0.9" />
        <path d="M0,3 C-5,0 -7,-3 -4,-5 C-1,-6 0,-2 0,-2 C0,-2 1,-6 4,-5 C7,-3 5,0 0,3 Z" fill={liquidColor} opacity="0.8" />
        <circle cx="0" cy="-8" r="2.2" fill={liquidColor} opacity="0.6" />
        <circle cx="0" cy="-11" r="1.5" fill={liquidColor} opacity="0.45" />
      </g>
    );
  }

  if (art === "leaf") {
    return (
      <g transform="translate(160, 140)">
        <path d="M0,9 L0,-12" stroke={liquidColor} strokeWidth="1.2" opacity="0.8" />
        <ellipse cx="-8" cy="5" rx="6" ry="3" fill={liquidColor} opacity="0.7" transform="rotate(-20 -8 5)" />
        <ellipse cx="8" cy="5" rx="6" ry="3" fill={liquidColor} opacity="0.7" transform="rotate(20 8 5)" />
        <ellipse cx="-8" cy="5" rx="4.5" ry="2" fill="#FFFFFF" opacity="0.9" transform="rotate(-20 -8 5)" />
        <ellipse cx="8" cy="5" rx="4.5" ry="2" fill="#FFFFFF" opacity="0.9" transform="rotate(20 8 5)" />
        <ellipse cx="-7" cy="-1" rx="5.5" ry="2.6" fill={liquidColor} opacity="0.75" transform="rotate(-25 -7 -1)" />
        <ellipse cx="7" cy="-1" rx="5.5" ry="2.6" fill={liquidColor} opacity="0.75" transform="rotate(25 7 -1)" />
        <ellipse cx="-7" cy="-1" rx="4" ry="1.8" fill="#FFFFFF" opacity="0.92" transform="rotate(-25 -7 -1)" />
        <ellipse cx="7" cy="-1" rx="4" ry="1.8" fill="#FFFFFF" opacity="0.92" transform="rotate(25 7 -1)" />
        <path d="M0,-8 C-5,-10 -7,-14 -3,-16 C0,-17 0,-13 0,-13 C0,-13 0,-17 3,-16 C7,-14 5,-10 0,-8 Z" fill={liquidColor} opacity="0.85" />
        <path d="M0,-9 C-3,-11 -5,-13 -2,-14.5 C0,-15 0,-13 0,-13 C0,-13 0,-15 2,-14.5 C5,-13 3,-11 0,-9 Z" fill="#FFFFFF" opacity="0.95" />
      </g>
    );
  }

  if (art === "cat") {
    return (
      <g transform="translate(160, 142)">
        <ellipse cx="0" cy="2" rx="14" ry="9" fill={liquidColor} opacity="0.6" />
        <ellipse cx="0" cy="2" rx="13" ry="8" fill="#FFFFFF" opacity="0.95" />
        <ellipse cx="0" cy="3" rx="8" ry="5" fill="#FFAEC0" opacity="0.85" />
        <ellipse cx="-12" cy="-6" rx="4.5" ry="5.5" fill={liquidColor} opacity="0.6" transform="rotate(-15 -12 -6)" />
        <ellipse cx="-12" cy="-6" rx="4" ry="5" fill="#FFAEC0" opacity="0.9" transform="rotate(-15 -12 -6)" />
        <ellipse cx="-4" cy="-11" rx="4.5" ry="6" fill={liquidColor} opacity="0.6" transform="rotate(-5 -4 -11)" />
        <ellipse cx="-4" cy="-11" rx="4" ry="5.5" fill="#FFAEC0" opacity="0.9" transform="rotate(-5 -4 -11)" />
        <ellipse cx="4" cy="-11" rx="4.5" ry="6" fill={liquidColor} opacity="0.6" transform="rotate(5 4 -11)" />
        <ellipse cx="4" cy="-11" rx="4" ry="5.5" fill="#FFAEC0" opacity="0.9" transform="rotate(5 4 -11)" />
        <ellipse cx="12" cy="-6" rx="4.5" ry="5.5" fill={liquidColor} opacity="0.6" transform="rotate(15 12 -6)" />
        <ellipse cx="12" cy="-6" rx="4" ry="5" fill="#FFAEC0" opacity="0.9" transform="rotate(15 12 -6)" />
      </g>
    );
  }

  if (art === "sakura") {
    return (
      <g transform="translate(160, 141)">
        {[0, 72, 144, 216, 288].map((angle, i) => (
          <g key={i} transform={`rotate(${angle})`}>
            <path d="M0,0 Q-8,-14 0,-20 Q8,-14 0,0 Z" fill={liquidColor} opacity="0.65" />
            <path d="M0,0 Q-6,-12 0,-18 Q6,-12 0,0 Z" fill="#FFFFFF" opacity="0.95" />
            <circle cx="0" cy="-12" r="2.5" fill="#FFB7C5" opacity="0.75" />
          </g>
        ))}
        <circle cx="0" cy="0" r="3.5" fill="#E8B86D" />
        <circle cx="0" cy="0" r="1.8" fill="#FFFFFF" />
      </g>
    );
  }

  return null;
}

/* ================================================================= */
/* BOTANICALS & FLOATING ADD-INS                                     */
/* ================================================================= */
function renderBotanicalsAndAddins(
  garnishes: string[],
  cx: number,
  cy: number,
  uid: string
) {
  return (
    <g className="leaf-sway-anim">
      {/* 1. Golden Honey Drizzle */}
      {garnishes.includes("honey") && (
        <g>
          <circle cx={cx} cy={cy} r="28" fill={`url(#${uid}-honeyGloss)`} />
          <path
            d={`M${cx - 16},${cy - 3} Q${cx - 6},${cy - 14} ${cx + 11},${cy - 5} Q${cx + 20},${cy + 8} ${cx + 3},${cy + 11} Q${cx - 12},${cy + 7} ${cx - 3},${cy + 1}`}
            fill="none"
            stroke="#FFE885"
            strokeWidth="2.4"
            strokeLinecap="round"
            opacity="0.9"
          />
          <g className="sparkle-anim" transform={`translate(${cx + 14}, ${cy - 8})`}>
            <polygon points="0,-4 1,-1 4,0 1,1 0,4 -1,1 -4,0 -1,-1" fill="#FFFFFF" />
          </g>
        </g>
      )}

      {/* 2. Cinnamon Stick Quill */}
      {garnishes.includes("cinnamon") && (
        <g transform={`translate(${cx - 16}, ${cy - 30}) rotate(-28)`}>
          <rect x="0" y="0" width="11" height="72" rx="4.5" fill="#7A3D24" stroke="#542412" strokeWidth="1.2" />
          <line x1="3" y1="8" x2="3" y2="65" stroke="#9C5233" strokeWidth="1.2" />
          <line x1="7.5" y1="12" x2="7.5" y2="58" stroke="#632E1A" strokeWidth="0.9" />
          <ellipse cx="5.5" cy="5.5" rx="4.5" ry="3" fill="#542412" />
          <ellipse cx="5.5" cy="5.5" rx="3" ry="2" fill="#9C5233" />
        </g>
      )}

      {/* 3. Golden Osmanthus */}
      {garnishes.includes("osmanthus") && (
        <g fill="#FFB703" opacity="0.96">
          <g transform={`translate(${cx - 24}, ${cy - 3})`}>
            <circle cx="-3.2" cy="0" r="2.4" />
            <circle cx="3.2" cy="0" r="2.4" />
            <circle cx="0" cy="-3.2" r="2.4" />
            <circle cx="0" cy="3.2" r="2.4" />
            <circle cx="0" cy="0" r="1.8" fill="#FFF3B0" />
            <circle cx="0" cy="0" r="0.8" fill="#E85D04" />
          </g>
          <g transform={`translate(${cx + 22}, ${cy + 3})`}>
            <circle cx="-2.8" cy="0" r="2.2" />
            <circle cx="2.8" cy="0" r="2.2" />
            <circle cx="0" cy="-2.8" r="2.2" />
            <circle cx="0" cy="2.8" r="2.2" />
            <circle cx="0" cy="0" r="1.6" fill="#FFF3B0" />
            <circle cx="0" cy="0" r="0.7" fill="#E85D04" />
          </g>
          <circle cx={cx - 6} cy={cy + 8} r="2.0" fill="#FFC300" />
          <circle cx={cx + 6} cy={cy - 9} r="2.2" fill="#FFC300" />
          <circle cx={cx - 15} cy={cy + 5} r="1.5" fill="#FFE169" />
          <circle cx={cx + 12} cy={cy + 7} r="1.6" fill="#FFE169" />
        </g>
      )}

      {/* 4. Velvet Crimson Rose Petals */}
      {garnishes.includes("rose") && (
        <g>
          <path
            d={`M${cx - 18},${cy - 6} C${cx - 28},${cy - 16} ${cx - 10},${cy - 18} ${cx - 12},${cy - 5} Z`}
            fill="#D90429"
            stroke="#9B0019"
            strokeWidth="0.8"
            opacity="0.92"
          />
          <path
            d={`M${cx + 16},${cy - 3} C${cx + 10},${cy - 14} ${cx + 26},${cy - 16} ${cx + 20},${cy + 3} Z`}
            fill="#EF233C"
            stroke="#9B0019"
            strokeWidth="0.8"
            opacity="0.9"
          />
          <path
            d={`M${cx - 2},${cy + 7} C${cx - 9},${cy + 3} ${cx - 2},${cy - 2} ${cx + 5},${cy + 5} Z`}
            fill="#C9184A"
            opacity="0.88"
          />
        </g>
      )}

      {/* 5. Fresh Emerald Mint Leaf */}
      {garnishes.includes("mint") && (
        <g transform={`translate(${cx + 14}, ${cy - 5}) rotate(25)`}>
          <path d="M0,0 Q12,-10 22,-3 Q14,8 0,0 Z" fill="#2D6A4F" stroke="#1B4332" strokeWidth="0.8" />
          <path d="M2,-1 L18,-3" stroke="#52B788" strokeWidth="0.8" fill="none" />
          <path d="M7,-2 L10,-5" stroke="#74C69D" strokeWidth="0.6" fill="none" />
          <path d="M-2,2 Q-10,-2 -14,-7 Q-7,-8 -2,2 Z" fill="#40916C" stroke="#1B4332" strokeWidth="0.6" />
        </g>
      )}

      {/* 6. Translucent Citrus Lemon Wheel */}
      {garnishes.includes("lemon") && (
        <g transform={`translate(${cx - 18}, ${cy + 2}) rotate(-18)`}>
          <circle cx="0" cy="0" r="16" fill="#F4BF16" stroke="#D48B00" strokeWidth="1" />
          <circle cx="0" cy="0" r="14.5" fill="#FFFCE6" />
          <circle cx="0" cy="0" r="13" fill={`url(#${uid}-lemonPulp)`} />
          <line x1="0" y1="-13" x2="0" y2="13" stroke="#FFFCE6" strokeWidth="1.2" />
          <line x1="-13" y1="0" x2="13" y2="0" stroke="#FFFCE6" strokeWidth="1.2" />
          <line x1="-9" y1="-9" x2="9" y2="9" stroke="#FFFCE6" strokeWidth="1.2" />
          <line x1="9" y1="-9" x2="-9" y2="9" stroke="#FFFCE6" strokeWidth="1.2" />
          <circle cx="0" cy="0" r="2.2" fill="#FFFCE6" />
        </g>
      )}
    </g>
  );
}

/* ================================================================= */
/* BOBA PEARLS                                                       */
/* ================================================================= */
function renderBobaBottomClusters(uid: string) {
  return (
    <g transform="translate(160, 292)">
      <circle cx="-28" cy="0" r="6" fill={`url(#${uid}-bobaPearl)`} />
      <circle cx="-16" cy="3" r="6.2" fill={`url(#${uid}-bobaPearl)`} />
      <circle cx="-4" cy="1" r="6.5" fill={`url(#${uid}-bobaPearl)`} />
      <circle cx="8" cy="2" r="6.2" fill={`url(#${uid}-bobaPearl)`} />
      <circle cx="20" cy="0" r="6" fill={`url(#${uid}-bobaPearl)`} />
      <circle cx="30" cy="-2" r="5.5" fill={`url(#${uid}-bobaPearl)`} />

      <circle cx="-22" cy="-5" r="5.8" fill={`url(#${uid}-bobaPearl)`} />
      <circle cx="-10" cy="-4" r="6.2" fill={`url(#${uid}-bobaPearl)`} />
      <circle cx="2" cy="-6" r="6.4" fill={`url(#${uid}-bobaPearl)`} />
      <circle cx="14" cy="-5" r="6" fill={`url(#${uid}-bobaPearl)`} />
      <circle cx="24" cy="-7" r="5.5" fill={`url(#${uid}-bobaPearl)`} />

      <circle cx="-24" cy="-7" r="1.4" fill="#FFFFFF" opacity="0.65" />
      <circle cx="-12" cy="-6" r="1.5" fill="#FFFFFF" opacity="0.75" />
      <circle cx="0" cy="-8" r="1.6" fill="#FFFFFF" opacity="0.8" />
      <circle cx="12" cy="-7" r="1.5" fill="#FFFFFF" opacity="0.7" />
      <circle cx="22" cy="-9" r="1.3" fill="#FFFFFF" opacity="0.6" />
    </g>
  );
}

export default CozyCupScene;
