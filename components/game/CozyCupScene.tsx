"use client";

import React, { useId } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type ServingStyle = "hot" | "iced" | "latte";
export type CupGlaze = "celadon" | "tenmoku" | "hakuji" | "earthenware";
export type Turbidity = "clear" | "cloudy" | "velvet";

export interface CozyCupSceneProps {
  liquidColor: string;
  opacity: number;
  liquidLevel?: number; // 0.0 (empty) to 1.0 (full)
  steamIntensity?: number;
  servingStyle?: ServingStyle;
  cupGlaze?: CupGlaze;
  turbidity?: Turbidity;
  garnishes?: string[];
  latteArt?: "bear" | "heart" | "leaf";
  className?: string;
}

const GLAZE_THEMES: Record<
  CupGlaze,
  {
    name: string;
    bodyTop: string;
    bodyBottom: string;
    stroke: string;
    rim: string;
    highlight: string;
    saucerTop: string;
    saucerBottom: string;
    saucerStroke: string;
    handleTop: string;
    handleBottom: string;
  }
> = {
  celadon: {
    name: "Celadon Jade",
    bodyTop: "#D6E8DC",
    bodyBottom: "#A8C7B0",
    stroke: "#8EAE96",
    rim: "#EAF4EE",
    highlight: "#FFFFFF",
    saucerTop: "#88A58F",
    saucerBottom: "#6E8A74",
    saucerStroke: "#5C7561",
    handleTop: "#D6E8DC",
    handleBottom: "#A8C7B0",
  },
  tenmoku: {
    name: "Tenmoku Bronze",
    bodyTop: "#4A3B36",
    bodyBottom: "#2A201E",
    stroke: "#1E1614",
    rim: "#8A6D58",
    highlight: "#9E816A",
    saucerTop: "#3D2B22",
    saucerBottom: "#221712",
    saucerStroke: "#1A100C",
    handleTop: "#4A3B36",
    handleBottom: "#2A201E",
  },
  hakuji: {
    name: "Hakuji Porcelain",
    bodyTop: "#FFFFFF",
    bodyBottom: "#EDE8E1",
    stroke: "#DED7CD",
    rim: "#FFFFFF",
    highlight: "#FFFFFF",
    saucerTop: "#B88E72",
    saucerBottom: "#997157",
    saucerStroke: "#825D45",
    handleTop: "#FFFFFF",
    handleBottom: "#EDE8E1",
  },
  earthenware: {
    name: "Warm Stoneware",
    bodyTop: "#F9EDE0",
    bodyBottom: "#E3CEBA",
    stroke: "#CBB39C",
    rim: "#FFF7EE",
    highlight: "#FFFFFF",
    saucerTop: "#C48866",
    saucerBottom: "#A76E4D",
    saucerStroke: "#8F5A3B",
    handleTop: "#F9EDE0",
    handleBottom: "#E3CEBA",
  },
};

export function CozyCupScene({
  liquidColor,
  opacity,
  liquidLevel = 1,
  steamIntensity = 0.5,
  servingStyle = "hot",
  cupGlaze = "earthenware",
  turbidity = "velvet",
  garnishes = [],
  latteArt = "bear",
  className,
}: CozyCupSceneProps) {
  const uid = useId().replace(/:/g, "_");
  // Steam scales with liquidLevel (if empty, steam dies down)
  const effectiveSteam = servingStyle === "iced" ? 0 : steamIntensity * Math.max(0.15, liquidLevel);
  const clampedLevel = Math.max(0, Math.min(1, liquidLevel));
  const glaze = GLAZE_THEMES[cupGlaze] || GLAZE_THEMES.earthenware;
  const isCloudy = turbidity === "cloudy";
  const isClear = turbidity === "clear";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={cn("relative w-full max-w-[280px] sm:max-w-[320px] mx-auto select-none", className)}
    >
      <style>{`
        @keyframes cozy-bob {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-3px) rotate(1.5deg); }
        }
        @keyframes cozy-bob-alt {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-4px) rotate(-2deg); }
        }
        @keyframes steam-drift-1 {
          0% { transform: translateY(0) translateX(0) scale(0.85); opacity: 0; }
          30% { opacity: 0.75; }
          70% { opacity: 0.45; transform: translateY(-30px) translateX(6px) scale(1.1); }
          100% { transform: translateY(-55px) translateX(14px) scale(1.25); opacity: 0; }
        }
        @keyframes steam-drift-2 {
          0% { transform: translateY(0) translateX(0) scale(0.8); opacity: 0; }
          35% { opacity: 0.65; }
          75% { opacity: 0.35; transform: translateY(-35px) translateX(-8px) scale(1.15); }
          100% { transform: translateY(-60px) translateX(-16px) scale(1.3); opacity: 0; }
        }
        @keyframes gentle-ripple {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.04); opacity: 0.75; }
        }
        @keyframes leaf-sway {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-2.5px) rotate(3deg); }
        }
        @keyframes sparkle-pulse {
          0%, 100% { transform: scale(0.8); opacity: 0.3; }
          50% { transform: scale(1.2); opacity: 0.9; }
        }
        .cozy-steam-1 { animation: steam-drift-1 3.4s infinite cubic-bezier(0.4, 0, 0.2, 1); }
        .cozy-steam-2 { animation: steam-drift-2 3.8s infinite 1.2s cubic-bezier(0.4, 0, 0.2, 1); }
        .cozy-steam-3 { animation: steam-drift-1 4.2s infinite 2.1s cubic-bezier(0.4, 0, 0.2, 1); }
        .ice-float-1 { animation: cozy-bob 3.2s infinite ease-in-out; }
        .ice-float-2 { animation: cozy-bob-alt 3.6s infinite 0.8s ease-in-out; }
        .ice-float-3 { animation: cozy-bob 4.0s infinite 1.6s ease-in-out; }
        .leaf-float { animation: leaf-sway 3.5s infinite ease-in-out; }
        .ripple-anim { animation: gentle-ripple 4s infinite ease-in-out; }
        .sparkle-anim { animation: sparkle-pulse 2.5s infinite ease-in-out; }
      `}</style>

      <svg
        viewBox="0 0 320 380"
        className="w-full h-auto drop-shadow-2xl overflow-visible"
        aria-label="Artisan Cozy Tea Cup"
      >
        <defs>
          {/* Ceramic Cup Gradients */}
          <linearGradient id={`${uid}-glazeGrad`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={glaze.bodyTop} />
            <stop offset="60%" stopColor={glaze.bodyTop} />
            <stop offset="100%" stopColor={glaze.bodyBottom} />
          </linearGradient>

          <linearGradient id={`${uid}-saucerGrad`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={glaze.saucerTop} />
            <stop offset="100%" stopColor={glaze.saucerBottom} />
          </linearGradient>

          <linearGradient id={`${uid}-handleGrad`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={glaze.handleTop} />
            <stop offset="100%" stopColor={glaze.handleBottom} />
          </linearGradient>

          {/* Liquid Shading Gradients */}
          <radialGradient id={`${uid}-liquidSurface`} cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.28" />
            <stop offset="40%" stopColor={liquidColor} stopOpacity={Math.min(1, opacity + 0.1)} />
            <stop offset="100%" stopColor={liquidColor} stopOpacity={Math.min(1, opacity + 0.3)} />
          </radialGradient>

          <linearGradient id={`${uid}-liquidDeep`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={liquidColor} stopOpacity={Math.max(0.3, opacity)} />
            <stop offset="100%" stopColor={liquidColor} stopOpacity={Math.min(1, opacity + 0.25)} />
          </linearGradient>

          {/* Glass Refraction Gradients */}
          <linearGradient id={`${uid}-glassBody`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.38" />
            <stop offset="15%" stopColor="#FFFFFF" stopOpacity="0.12" />
            <stop offset="85%" stopColor="#FFFFFF" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.32" />
          </linearGradient>

          <linearGradient id={`${uid}-glassBase`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E6F2F7" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#C4E0EC" stopOpacity="0.8" />
          </linearGradient>

          {/* Latte Froth Gradients */}
          <linearGradient id={`${uid}-latteLayer`} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={liquidColor} stopOpacity={Math.min(1, opacity + 0.25)} />
            <stop offset="30%" stopColor={liquidColor} stopOpacity={opacity} />
            <stop offset="65%" stopColor="#EFE3D3" stopOpacity="0.95" />
            <stop offset="90%" stopColor="#FAF5EE" stopOpacity="0.98" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
          </linearGradient>

          <radialGradient id={`${uid}-foamTop`} cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="70%" stopColor="#FBF7F0" stopOpacity="0.98" />
            <stop offset="100%" stopColor="#EFE5D5" stopOpacity="0.9" />
          </radialGradient>

          {/* Honey & Sparkle Sheen */}
          <radialGradient id={`${uid}-honeySheen`} cx="45%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#FFE066" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#F5A623" stopOpacity="0.65" />
            <stop offset="90%" stopColor="#D47A08" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#B35E00" stopOpacity="0" />
          </radialGradient>

          {/* Clip Paths */}
          {/* Chubby Hot Ceramic Interior */}
          <clipPath id={`${uid}-hot-interior`}>
            <ellipse cx="160" cy="148" rx="68" ry="16" />
            <path d="M92,148 Q82,230 110,298 Q160,318 210,298 Q238,230 228,148 Z" />
          </clipPath>

          {/* Elegant Iced Glass Interior */}
          <clipPath id={`${uid}-iced-interior`}>
            <ellipse cx="160" cy="116" rx="58" ry="13" />
            <path d="M102,116 L218,116 L205,315 Q160,326 115,315 Z" />
          </clipPath>

          {/* Layered Latte Mug Interior */}
          <clipPath id={`${uid}-latte-interior`}>
            <ellipse cx="160" cy="140" rx="72" ry="17" />
            <path d="M88,140 Q80,225 108,298 Q160,318 212,298 Q240,225 232,140 Z" />
          </clipPath>
        </defs>

        {/* Ambient Ground Shadow */}
        <ellipse cx="160" cy="350" rx="105" ry="16" fill="#4A3427" opacity="0.12" />
        <ellipse cx="160" cy="348" rx="75" ry="10" fill="#2E1F18" opacity="0.15" />

        {/* ======================================================== */}
        {/* STEAM (Volumetric Warm Swirls)                           */}
        {/* ======================================================== */}
        {effectiveSteam > 0 && (
          <g fill="none" strokeLinecap="round">
            {/* Steam Wisp 1 */}
            <path
              d="M142,120 Q128,85 148,55 Q160,35 145,15"
              stroke="#F4E2CD"
              strokeWidth="4.5"
              opacity={effectiveSteam * 0.75}
              className="cozy-steam-1"
            />
            {/* Steam Wisp 2 (Cute Whimsical Curl) */}
            <path
              d="M164,124 Q182,90 162,60 Q146,38 166,12"
              stroke="#FFF1DF"
              strokeWidth="5"
              opacity={effectiveSteam * 0.85}
              className="cozy-steam-2"
            />
            {/* Steam Wisp 3 */}
            <path
              d="M184,122 Q196,88 178,58 Q168,40 180,18"
              stroke="#F4E2CD"
              strokeWidth="4"
              opacity={effectiveSteam * 0.65}
              className="cozy-steam-3"
            />
            {/* Cute Little Steam Heart Accent */}
            <g
              transform="translate(155, 30) scale(0.7)"
              opacity={effectiveSteam * 0.6}
              className="cozy-steam-2"
            >
              <path
                d="M12,4 C8,0 0,2 0,9 C0,15 12,22 12,22 C12,22 24,15 24,9 C24,2 16,0 12,4 Z"
                fill="#FFF5EB"
              />
            </g>
          </g>
        )}

        {/* ======================================================== */}
        {/* STYLE 1: HOT CERAMIC CUP (Cute Chubby Aesthetic)        */}
        {/* ======================================================== */}
        {servingStyle === "hot" && (
          <g>
            {/* Saucer */}
            <ellipse cx="160" cy="336" rx="108" ry="24" fill={glaze.saucerStroke} opacity="0.4" />
            <ellipse cx="160" cy="333" rx="105" ry="22" fill={`url(#${uid}-saucerGrad)`} stroke={glaze.saucerStroke} strokeWidth="2.5" />
            <ellipse cx="160" cy="330" rx="88" ry="16" fill={glaze.saucerTop} opacity="0.75" />
            {/* Saucer Inner Ring Well */}
            <ellipse cx="160" cy="328" rx="66" ry="11" fill="none" stroke={glaze.saucerStroke} strokeWidth="1.5" opacity="0.5" />

            {/* Chubby Handle (Outer + Inner Cutout) */}
            <path
              d="M222,175 C268,175 278,255 218,272"
              fill="none"
              stroke={glaze.stroke}
              strokeWidth="20"
              strokeLinecap="round"
            />
            <path
              d="M222,175 C268,175 278,255 218,272"
              fill="none"
              stroke={`url(#${uid}-handleGrad)`}
              strokeWidth="16"
              strokeLinecap="round"
            />
            <path
              d="M222,175 C268,175 278,255 218,272"
              fill="none"
              stroke={glaze.highlight}
              strokeWidth="3.5"
              strokeLinecap="round"
              opacity="0.65"
              transform="translate(-1.5, -2)"
            />

            {/* Cup Outer Body (Chubby Cozy Mug Shape) */}
            <path
              d="M92,148 Q82,230 110,298 Q160,318 210,298 Q238,230 228,148 Z"
              fill={`url(#${uid}-glazeGrad)`}
              stroke={glaze.stroke}
              strokeWidth="3"
            />

            {/* Subtle Specular Glaze Highlight along left shoulder */}
            <path
              d="M102,160 Q94,225 116,285"
              fill="none"
              stroke={glaze.highlight}
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0.45"
            />

            {/* Liquid Masked Section */}
            <g clipPath={`url(#${uid}-hot-interior)`}>
              {/* Ceramic Inner Shadow / Empty Basin Base */}
              <ellipse cx="160" cy="295" rx="46" ry="10" fill="#2E1C14" opacity="0.22" />

              {clampedLevel > 0.01 && (
                <g style={{ transition: "all 0.8s cubic-bezier(0.2, 0.8, 0.4, 1)" }}>
                  {/* Dynamic Deep liquid volume */}
                  {/* Y moves down from 152 to 295, height shrinks from 170 to 0 */}
                  <rect
                    x="80"
                    y={152 + (1 - clampedLevel) * 142}
                    width="160"
                    height={Math.max(0, 170 - (1 - clampedLevel) * 142)}
                    fill={`url(#${uid}-liquidDeep)`}
                    style={{ transition: "y 0.8s linear, height 0.8s linear" }}
                  />

                  {/* Liquid Surface Meniscus */}
                  {/* cy descends from 154 (full) to 294 (bottom); radius rx shrinks from 68 to 44 */}
                  <ellipse
                    cx="160"
                    cy={154 + (1 - clampedLevel) * 140}
                    rx={Math.max(15, 68 - (1 - clampedLevel) * 24)}
                    ry={Math.max(4, 16 - (1 - clampedLevel) * 6)}
                    fill={`url(#${uid}-liquidSurface)`}
                    style={{ transition: "cy 0.8s linear, rx 0.8s linear, ry 0.8s linear" }}
                  />

                  {/* Gentle Surface Ripple */}
                  <ellipse
                    cx="160"
                    cy={154 + (1 - clampedLevel) * 140}
                    rx={Math.max(10, 52 - (1 - clampedLevel) * 20)}
                    ry={Math.max(3, 11 - (1 - clampedLevel) * 4)}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="1.2"
                    className="ripple-anim"
                    style={{ transition: "cy 0.8s linear, rx 0.8s linear, ry 0.8s linear" }}
                  />

                  {/* Cloudy Texture / Micro-froth */}
                  {isCloudy && clampedLevel > 0.15 && (
                    <g
                      fill="#FFFFFF"
                      opacity={0.32 * clampedLevel}
                      transform={`translate(0, ${(1 - clampedLevel) * 138})`}
                      style={{ transition: "transform 0.8s linear, opacity 0.8s linear" }}
                    >
                      <circle cx="132" cy="154" r="3.2" />
                      <circle cx="142" cy="157" r="2.8" />
                      <circle cx="158" cy="152" r="3.6" />
                      <circle cx="172" cy="155" r="2.4" />
                      <circle cx="184" cy="153" r="2.8" />
                      <circle cx="148" cy="159" r="2.2" />
                    </g>
                  )}

                  {/* Crystal Shimmer Reflection if Clear */}
                  {isClear && clampedLevel > 0.15 && (
                    <ellipse
                      cx="142"
                      cy={152 + (1 - clampedLevel) * 138}
                      rx={Math.max(10, 30 - (1 - clampedLevel) * 12)}
                      ry="4.5"
                      fill="#FFFFFF"
                      opacity={0.45 * clampedLevel}
                      style={{ transition: "cy 0.8s linear, opacity 0.8s linear" }}
                    />
                  )}

                  {/* Cute Floating Tea Leaf Bud descending with liquid */}
                  {clampedLevel > 0.08 && (
                    <g
                      className="leaf-float"
                      transform={`translate(138, ${150 + (1 - clampedLevel) * 138})`}
                      style={{ transition: "transform 0.8s linear" }}
                    >
                      <path
                        d="M0,0 Q8,-7 18,-2 Q12,5 0,0 Z"
                        fill="#5A7D36"
                        stroke="#3E5723"
                        strokeWidth="0.8"
                      />
                      <path d="M2,-1 L14,-3" stroke="#85A85C" strokeWidth="0.6" fill="none" />
                      <circle cx="18" cy="-2" r="1" fill="#7BA05B" />
                    </g>
                  )}

                  {/* Garnishes descending with surface */}
                  <g
                    transform={`translate(0, ${(1 - clampedLevel) * 138})`}
                    style={{ transition: "transform 0.8s linear" }}
                  >
                    {renderCuteGarnishes(garnishes, 160, 154, uid)}
                  </g>
                </g>
              )}

              {/* Water Ring / Residue mark when empty */}
              {clampedLevel <= 0.05 && (
                <g>
                  <ellipse cx="160" cy="292" rx="38" ry="8" fill="none" stroke={liquidColor} strokeWidth="1.2" opacity="0.35" />
                  <ellipse cx="160" cy="292" rx="20" ry="4" fill={liquidColor} opacity="0.15" />
                </g>
              )}
            </g>

            {/* Cup Rim Lip (3D Depth Bevel) */}
            <ellipse
              cx="160"
              cy="148"
              rx="70"
              ry="17"
              fill="none"
              stroke={glaze.stroke}
              strokeWidth="4"
              opacity="0.35"
            />
            <ellipse
              cx="160"
              cy="147"
              rx="70"
              ry="17"
              fill="none"
              stroke={glaze.rim}
              strokeWidth="5"
            />
            <ellipse
              cx="160"
              cy="146.5"
              rx="68"
              ry="16"
              fill="none"
              stroke={glaze.highlight}
              strokeWidth="1.8"
              opacity="0.65"
            />
          </g>
        )}

        {/* ======================================================== */}
        {/* STYLE 2: ICED COLD GLASS (Crystal Tumbler with Ice)      */}
        {/* ======================================================== */}
        {servingStyle === "iced" && (
          <g>
            {/* Wooden Coaster with Cute Bevel */}
            <ellipse cx="160" cy="336" rx="92" ry="18" fill="#7A4E37" opacity="0.3" />
            <ellipse cx="160" cy="332" rx="88" ry="16" fill="#A77253" stroke="#6E442F" strokeWidth="2" />
            <ellipse cx="160" cy="329" rx="76" ry="12" fill="#BA8564" />

            {/* Glass Interior Content */}
            <g clipPath={`url(#${uid}-iced-interior)`}>
              {/* Glass Inner Shading */}
              <ellipse cx="160" cy="312" rx="44" ry="9" fill="#B3D5E4" opacity="0.3" />

              {clampedLevel > 0.01 && (
                <g style={{ transition: "all 0.8s cubic-bezier(0.2, 0.8, 0.4, 1)" }}>
                  {/* Tea Liquid Volume: Y moves from 126 to 310, height shrinks */}
                  <rect
                    x="95"
                    y={126 + (1 - clampedLevel) * 184}
                    width="130"
                    height={Math.max(0, 200 - (1 - clampedLevel) * 184)}
                    fill={`url(#${uid}-liquidDeep)`}
                    style={{ transition: "y 0.8s linear, height 0.8s linear" }}
                  />

                  {/* Top Surface Meniscus: cy descends from 126 to 310, rx shrinks from 58 to 44 */}
                  <ellipse
                    cx="160"
                    cy={126 + (1 - clampedLevel) * 184}
                    rx={Math.max(20, 58 - (1 - clampedLevel) * 14)}
                    ry={Math.max(4, 13 - (1 - clampedLevel) * 4)}
                    fill={`url(#${uid}-liquidSurface)`}
                    style={{ transition: "cy 0.8s linear, rx 0.8s linear, ry 0.8s linear" }}
                  />

                  {/* Floating Garnishes */}
                  <g
                    transform={`translate(0, ${(1 - clampedLevel) * 175})`}
                    style={{ transition: "transform 0.8s linear" }}
                  >
                    {renderCuteGarnishes(garnishes, 160, 130, uid)}
                  </g>
                </g>
              )}

              {/* Cute Floating Ice Cubes - they sink gracefully with liquid level */}
              {/* Ice Cube 1 */}
              <g
                className="ice-float-1"
                transform={`translate(122, ${Math.min(270, 134 + (1 - clampedLevel) * 145)})`}
                style={{ transition: "transform 0.8s linear" }}
              >
                <rect
                  x="0"
                  y="0"
                  width="38"
                  height="36"
                  rx="9"
                  fill="#FFFFFF"
                  fillOpacity="0.48"
                  stroke="#E8F4FA"
                  strokeWidth="2"
                />
                <path d="M6,8 L28,8" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
                <path d="M8,14 L18,14" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                <circle cx="28" cy="26" r="2.5" fill="#FFFFFF" opacity="0.7" />
              </g>

              {/* Ice Cube 2 */}
              <g
                className="ice-float-2"
                transform={`translate(158, ${Math.min(276, 150 + (1 - clampedLevel) * 135)})`}
                style={{ transition: "transform 0.8s linear" }}
              >
                <rect
                  x="0"
                  y="0"
                  width="34"
                  height="32"
                  rx="8"
                  fill="#FFFFFF"
                  fillOpacity="0.42"
                  stroke="#E8F4FA"
                  strokeWidth="1.8"
                />
                <path d="M6,7 L24,7" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" opacity="0.8" />
                <circle cx="22" cy="22" r="2" fill="#FFFFFF" opacity="0.6" />
              </g>

              {/* Ice Cube 3 */}
              <g
                className="ice-float-3"
                transform={`translate(136, ${Math.min(280, 196 + (1 - clampedLevel) * 90)})`}
                style={{ transition: "transform 0.8s linear" }}
              >
                <rect
                  x="0"
                  y="0"
                  width="32"
                  height="30"
                  rx="7"
                  fill="#FFFFFF"
                  fillOpacity="0.32"
                  stroke="#E8F4FA"
                  strokeWidth="1.5"
                />
              </g>
            </g>

            {/* Heavy Glass Base */}
            <path
              d="M112,305 L208,305 L205,320 Q160,332 115,320 Z"
              fill={`url(#${uid}-glassBase)`}
              stroke="#D6EAF2"
              strokeWidth="2"
            />

            {/* Glass Wall Outer Specular Reflection */}
            <path
              d="M102,116 L218,116 L205,315 Q160,326 115,315 Z"
              fill={`url(#${uid}-glassBody)`}
              stroke="#DCEAF2"
              strokeWidth="3"
            />

            {/* Left Glass Specular Pillar */}
            <path
              d="M110,130 L118,300"
              stroke="#FFFFFF"
              strokeWidth="3.5"
              strokeLinecap="round"
              opacity="0.55"
            />

            {/* Glass Rim Ellipses */}
            <ellipse cx="160" cy="116" rx="58" ry="13" fill="none" stroke="#E6F2F7" strokeWidth="3.5" />
            <ellipse cx="160" cy="115.5" rx="56" ry="12" fill="none" stroke="#FFFFFF" strokeWidth="1.8" opacity="0.8" />

            {/* Cute Condensation Droplets */}
            <g fill="#FFFFFF" opacity="0.65">
              <circle cx="112" cy="180" r="2.5" />
              <circle cx="113" cy="192" r="1.8" />
              <circle cx="206" cy="210" r="2.8" />
              <circle cx="205" cy="224" r="2.0" />
              <circle cx="132" cy="250" r="2.2" />
              <circle cx="188" cy="265" r="2.4" />
            </g>

            {/* Cute Glass Straw */}
            <g transform="translate(195, 80) rotate(14)">
              <rect x="0" y="0" width="8" height="180" rx="4" fill="#FFFFFF" opacity="0.7" stroke="#C8E2ED" strokeWidth="1" />
              <line x1="2" y1="0" x2="2" y2="180" stroke="#FF85A2" strokeWidth="2" strokeDasharray="10 8" opacity="0.6" />
            </g>
          </g>
        )}

        {/* ======================================================== */}
        {/* STYLE 3: LAYERED TEA LATTE (Velvety Foam & Cute Art)     */}
        {/* ======================================================== */}
        {servingStyle === "latte" && (
          <g>
            {/* Saucer */}
            <ellipse cx="160" cy="336" rx="108" ry="24" fill="#8C5E45" opacity="0.4" />
            <ellipse cx="160" cy="333" rx="105" ry="22" fill="#B48160" stroke="#7A4E37" strokeWidth="2.5" />
            <ellipse cx="160" cy="330" rx="86" ry="16" fill="#C99471" opacity="0.8" />

            {/* Cute Handle */}
            <path
              d="M226,170 C272,170 282,250 222,268"
              fill="none"
              stroke="#D6C4B2"
              strokeWidth="19"
              strokeLinecap="round"
            />
            <path
              d="M226,170 C272,170 282,250 222,268"
              fill="none"
              stroke="#FAF5EF"
              strokeWidth="15"
              strokeLinecap="round"
            />
            <path
              d="M226,170 C272,170 282,250 222,268"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.8"
              transform="translate(-1, -2)"
            />

            {/* Latte Mug Body */}
            <path
              d="M88,140 Q80,225 108,298 Q160,318 212,298 Q240,225 232,140 Z"
              fill="#FAF5EE"
              stroke="#D8C8B6"
              strokeWidth="3"
            />

            {/* Specular Glaze Sheen */}
            <path
              d="M98,155 Q90,220 114,285"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="5.5"
              strokeLinecap="round"
              opacity="0.6"
            />

            {/* Layered Tea & Milk Interior */}
            <g clipPath={`url(#${uid}-latte-interior)`}>
              {/* Mug Basin Shading */}
              <ellipse cx="160" cy="295" rx="46" ry="10" fill="#2E1C14" opacity="0.18" />

              {clampedLevel > 0.01 && (
                <g style={{ transition: "all 0.8s cubic-bezier(0.2, 0.8, 0.4, 1)" }}>
                  {/* Three-Tier Ombre Gradient */}
                  <rect
                    x="80"
                    y={140 + (1 - clampedLevel) * 150}
                    width="160"
                    height={Math.max(0, 180 - (1 - clampedLevel) * 150)}
                    fill={`url(#${uid}-latteLayer)`}
                    style={{ transition: "y 0.8s linear, height 0.8s linear" }}
                  />

                  {/* Thick Froth Top Surface */}
                  <ellipse
                    cx="160"
                    cy={146 + (1 - clampedLevel) * 148}
                    rx={Math.max(16, 68 - (1 - clampedLevel) * 22)}
                    ry={Math.max(4, 16 - (1 - clampedLevel) * 6)}
                    fill={`url(#${uid}-foamTop)`}
                    style={{ transition: "cy 0.8s linear, rx 0.8s linear, ry 0.8s linear" }}
                  />

                  {/* =================================================== */}
                  {/* ADORABLE LATTE ART (Cute Bear / Heart Rosetta)      */}
                  {/* =================================================== */}
                  <g
                    transform={`translate(0, ${(1 - clampedLevel) * 148}) scale(${Math.max(0.4, clampedLevel)})`}
                    style={{
                      transformOrigin: "160px 146px",
                      transition: "transform 0.8s linear",
                    }}
                  >
                    {latteArt === "bear" ? (
                      /* Cute 3D Foam Bear Face */
                      <g transform="translate(160, 146)">
                        {/* Bear Left Ear */}
                        <circle cx="-16" cy="-10" r="7" fill={liquidColor} opacity="0.75" />
                        <circle cx="-16" cy="-10" r="4" fill="#FFFFFF" opacity="0.9" />

                        {/* Bear Right Ear */}
                        <circle cx="16" cy="-10" r="7" fill={liquidColor} opacity="0.75" />
                        <circle cx="16" cy="-10" r="4" fill="#FFFFFF" opacity="0.9" />

                        {/* Bear Head */}
                        <ellipse cx="0" cy="0" rx="18" ry="11" fill={liquidColor} opacity="0.7" />
                        <ellipse cx="0" cy="0" rx="17" ry="10" fill="#FFFFFF" opacity="0.95" />

                        {/* Cute Cheeks */}
                        <ellipse cx="-10" cy="2" rx="3.5" ry="2" fill="#FFAEC9" opacity="0.75" />
                        <ellipse cx="10" cy="2" rx="3.5" ry="2" fill="#FFAEC9" opacity="0.75" />

                        {/* Snout */}
                        <ellipse cx="0" cy="2" rx="6" ry="4" fill={liquidColor} opacity="0.25" />
                        <ellipse cx="0" cy="2" rx="5" ry="3.5" fill="#FFFFFF" />

                        {/* Eyes & Nose in Tea Tone */}
                        <circle cx="-6" cy="-1.5" r="1.5" fill={liquidColor} />
                        <circle cx="6" cy="-1.5" r="1.5" fill={liquidColor} />
                        <ellipse cx="0" cy="1" rx="1.8" ry="1.2" fill={liquidColor} />
                        <path d="M-1.5,2.5 Q0,4 1.5,2.5" stroke={liquidColor} strokeWidth="0.8" fill="none" />
                      </g>
                    ) : (
                      /* Elegant Multi-Layer Rosetta Heart */
                      <g transform="translate(160, 145)">
                        <path
                          d="M0,8 C-12,2 -18,-6 -10,-10 C-3,-13 0,-4 0,-4 C0,-4 3,-13 10,-10 C18,-6 12,2 0,8 Z"
                          fill={liquidColor}
                          opacity="0.75"
                        />
                        <path
                          d="M0,5 C-8,1 -12,-4 -7,-7 C-2,-9 0,-3 0,-3 C0,-3 2,-9 7,-7 C12,-4 8,1 0,5 Z"
                          fill="#FFFFFF"
                          opacity="0.85"
                        />
                        <circle cx="0" cy="-7" r="2" fill={liquidColor} opacity="0.6" />
                        <circle cx="0" cy="-10" r="1.4" fill={liquidColor} opacity="0.4" />
                      </g>
                    )}
                  </g>

                  {/* Micro-foam Texture Bubbles */}
                  {clampedLevel > 0.25 && (
                    <g
                      fill="#FFFFFF"
                      opacity={0.7 * clampedLevel}
                      transform={`translate(0, ${(1 - clampedLevel) * 148})`}
                      style={{ transition: "transform 0.8s linear, opacity 0.8s linear" }}
                    >
                      <circle cx="108" cy="144" r="1.8" />
                      <circle cx="114" cy="147" r="1.4" />
                      <circle cx="206" cy="143" r="2.0" />
                      <circle cx="212" cy="146" r="1.5" />
                      <circle cx="160" cy="158" r="1.6" />
                    </g>
                  )}

                  {/* Garnishes */}
                  <g
                    transform={`translate(0, ${(1 - clampedLevel) * 148})`}
                    style={{ transition: "transform 0.8s linear" }}
                  >
                    {renderCuteGarnishes(garnishes, 160, 146, uid)}
                  </g>
                </g>
              )}

              {/* Froth ring when nearly empty */}
              {clampedLevel <= 0.05 && (
                <ellipse cx="160" cy="294" rx="36" ry="7" fill="none" stroke="#FAF5EF" strokeWidth="1.5" opacity="0.5" />
              )}
            </g>

            {/* Creamy Rim Lips */}
            <ellipse cx="160" cy="140" rx="72" ry="17" fill="none" stroke="#D8C8B6" strokeWidth="4" opacity="0.5" />
            <ellipse cx="160" cy="139" rx="72" ry="17" fill="none" stroke="#FFFFFF" strokeWidth="5.5" />
            <ellipse cx="160" cy="138.5" rx="70" ry="16" fill="none" stroke="#FAF5EF" strokeWidth="2" opacity="0.85" />
          </g>
        )}
      </svg>
    </motion.div>
  );
}

function renderCuteGarnishes(
  garnishes: string[],
  cx: number,
  cy: number,
  uid: string
) {
  return (
    <g className="leaf-float">
      {/* Honey Swirl */}
      {garnishes.includes("honey") && (
        <g>
          <circle cx={cx} cy={cy} r="30" fill={`url(#${uid}-honeySheen)`} />
          {/* Swirl Spiral Line */}
          <path
            d={`M${cx - 15},${cy - 2} Q${cx - 5},${cy - 12} ${cx + 10},${cy - 4} Q${cx + 18},${cy + 8} ${cx + 2},${cy + 10} Q${cx - 12},${cy + 6} ${cx - 2},${cy}`}
            fill="none"
            stroke="#FFE484"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.85"
          />
          {/* Little Honey Sparkle */}
          <g className="sparkle-anim" transform={`translate(${cx + 12}, ${cy - 8})`}>
            <polygon points="0,-4 1,-1 4,0 1,1 0,4 -1,1 -4,0 -1,-1" fill="#FFFFFF" />
          </g>
        </g>
      )}

      {/* Cinnamon Stick with Spiral Wood Grain */}
      {garnishes.includes("cinnamon") && (
        <g transform={`translate(${cx - 14}, ${cy - 28}) rotate(-28)`}>
          <rect
            x="0"
            y="0"
            width="10"
            height="68"
            rx="4"
            fill="#804229"
            stroke="#5C2B17"
            strokeWidth="1.2"
          />
          <line x1="2.5" y1="6" x2="2.5" y2="62" stroke="#A65C3D" strokeWidth="1.2" />
          <ellipse cx="5" cy="5" rx="4" ry="2.5" fill="#5C2B17" />
          <ellipse cx="5" cy="5" rx="2.5" ry="1.5" fill="#9E5434" />
          <ellipse cx="5" cy="5" rx="1.2" ry="0.8" fill="#3D1A0D" />
        </g>
      )}

      {/* Osmanthus Golden Blossoms */}
      {garnishes.includes("osmanthus") && (
        <g fill="#FFB703" opacity="0.95">
          {/* Cluster 1 */}
          <g transform={`translate(${cx - 24}, ${cy - 3})`}>
            <circle cx="-3" cy="0" r="2.2" />
            <circle cx="3" cy="0" r="2.2" />
            <circle cx="0" cy="-3" r="2.2" />
            <circle cx="0" cy="3" r="2.2" />
            <circle cx="0" cy="0" r="1.6" fill="#FFF3B0" />
          </g>
          {/* Cluster 2 */}
          <g transform={`translate(${cx + 20}, ${cy + 4})`}>
            <circle cx="-2.5" cy="0" r="2" />
            <circle cx="2.5" cy="0" r="2" />
            <circle cx="0" cy="-2.5" r="2" />
            <circle cx="0" cy="2.5" r="2" />
            <circle cx="0" cy="0" r="1.4" fill="#FFF3B0" />
          </g>
          {/* Floating Petal Dots */}
          <circle cx={cx - 6} cy={cy + 8} r="1.8" fill="#FFC300" />
          <circle cx={cx + 6} cy={cy - 8} r="2.0" fill="#FFC300" />
        </g>
      )}

      {/* Sakura / Rose Petals */}
      {garnishes.includes("rose") && (
        <g>
          {/* Petal 1 */}
          <path
            d={`M${cx - 16},${cy - 5} C${cx - 24},${cy - 14} ${cx - 8},${cy - 16} ${cx - 10},${cy - 4} Z`}
            fill="#E63946"
            stroke="#B5172A"
            strokeWidth="0.8"
            opacity="0.9"
          />
          {/* Petal 2 */}
          <path
            d={`M${cx + 14},${cy - 3} C${cx + 8},${cy - 12} ${cx + 22},${cy - 14} ${cx + 18},${cy + 2} Z`}
            fill="#F26A8D"
            stroke="#B5172A"
            strokeWidth="0.8"
            opacity="0.88"
          />
          {/* Petal 3 */}
          <path
            d={`M${cx - 2},${cy + 6} C${cx - 8},${cy + 2} ${cx - 2},${cy - 2} ${cx + 4},${cy + 4} Z`}
            fill="#C9184A"
            opacity="0.85"
          />
        </g>
      )}
    </g>
  );
}

export default CozyCupScene;
