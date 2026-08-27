"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type ServingStyle = "hot" | "iced" | "latte";
export type CupGlaze = "celadon" | "tenmoku" | "hakuji" | "earthenware";
export type Turbidity = "clear" | "cloudy" | "velvet";

export interface CozyCupSceneProps {
  liquidColor: string;
  opacity: number;
  steamIntensity?: number;
  servingStyle?: ServingStyle;
  cupGlaze?: CupGlaze;
  turbidity?: Turbidity;
  garnishes?: string[];
  className?: string;
}

const GLAZE_THEMES: Record<
  CupGlaze,
  {
    body: string;
    stroke: string;
    rim: string;
    saucer1: string;
    saucer2: string;
    handle: string;
    handleShadow: string;
  }
> = {
  celadon: {
    body: "#C2D7C7",
    stroke: "#9CB8A2",
    rim: "#E2ECE4",
    saucer1: "#6B7F62",
    saucer2: "#57694F",
    handle: "#C2D7C7",
    handleShadow: "#9CB8A2",
  },
  tenmoku: {
    body: "#3A2F2C",
    stroke: "#261E1C",
    rim: "#594843",
    saucer1: "#382319",
    saucer2: "#291811",
    handle: "#3A2F2C",
    handleShadow: "#261E1C",
  },
  hakuji: {
    body: "#FBF9F6",
    stroke: "#E3DDD5",
    rim: "#FFFFFF",
    saucer1: "#9C6D53",
    saucer2: "#855840",
    handle: "#FBF9F6",
    handleShadow: "#E3DDD5",
  },
  earthenware: {
    body: "#F5E6D3",
    stroke: "#D4C4B0",
    rim: "#FAF1E6",
    saucer1: "#A47556",
    saucer2: "#8C5E45",
    handle: "#F5E6D3",
    handleShadow: "#D4C4B0",
  },
};

export function CozyCupScene({
  liquidColor,
  opacity,
  steamIntensity = 0.5,
  servingStyle = "hot",
  cupGlaze = "earthenware",
  turbidity = "velvet",
  garnishes = [],
  className,
}: CozyCupSceneProps) {
  // Suppress steam if cold brew
  const effectiveSteam = servingStyle === "iced" ? 0 : steamIntensity;
  const glaze = GLAZE_THEMES[cupGlaze] || GLAZE_THEMES.earthenware;
  const isCloudy = turbidity === "cloudy";
  const isClear = turbidity === "clear";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={cn("relative w-full max-w-sm mx-auto select-none", className)}
    >
      <style>{`
        @keyframes bubble-rise {
          0% { transform: translateY(0); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: translateY(-10px); opacity: 0; }
        }
        @keyframes steam-rise {
          0% { transform: translateY(0) translateX(0) scale(0.9); opacity: 0; }
          50% { opacity: 0.7; }
          100% { transform: translateY(-40px) translateX(10px) scale(1.1); opacity: 0; }
        }
        @keyframes ice-bob {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-3px) rotate(2deg); }
        }
        @keyframes petal-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-2px) rotate(4deg); }
        }
        .bubble { animation: bubble-rise 2s infinite ease-in; }
        .bubble-delay-1 { animation-delay: 0.4s; }
        .bubble-delay-2 { animation-delay: 0.8s; }
        .bubble-delay-3 { animation-delay: 1.2s; }
        .steam-path { animation: steam-rise 3s infinite ease-in-out; }
        .steam-path-delay-1 { animation-delay: 1s; }
        .steam-path-delay-2 { animation-delay: 2s; }
        .ice-floating { animation: ice-bob 3.2s infinite ease-in-out; }
        .ice-floating-alt { animation: ice-bob 3.8s infinite ease-in-out 1.2s; }
        .petal-floating { animation: petal-float 4s infinite ease-in-out; }
      `}</style>

      <svg viewBox="0 0 300 380" className="w-full h-auto drop-shadow-xl">
        <defs>
          {/* Gradients */}
          <linearGradient id="glassReflect" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
            <stop offset="25%" stopColor="#FFFFFF" stopOpacity="0.08" />
            <stop offset="75%" stopColor="#FFFFFF" stopOpacity="0.02" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.3" />
          </linearGradient>

          <linearGradient id="latteGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#FBF7F0" stopOpacity="0.95" />
            <stop offset="35%" stopColor="#EAD8C0" stopOpacity="0.9" />
            <stop offset="70%" stopColor={liquidColor} stopOpacity={opacity} />
            <stop offset="100%" stopColor={liquidColor} stopOpacity={Math.min(1, opacity + 0.15)} />
          </linearGradient>

          <radialGradient id="honeySheen" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.7" />
            <stop offset="70%" stopColor="#E6A100" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#C47D00" stopOpacity="0" />
          </radialGradient>

          {/* Clip Paths */}
          <clipPath id="cup-interior-hot">
            <ellipse cx="150" cy="140" rx="70" ry="15" />
            <path d="M80,140 L220,140 L200,310 Q150,330 100,310 Z" />
          </clipPath>

          <clipPath id="glass-interior-iced">
            <ellipse cx="150" cy="110" rx="60" ry="14" />
            <path d="M90,110 L210,110 L195,320 Q150,335 105,320 Z" />
          </clipPath>

          <clipPath id="latte-interior">
            <ellipse cx="150" cy="130" rx="65" ry="15" />
            <path d="M85,130 L215,130 L198,315 Q150,330 102,315 Z" />
          </clipPath>
        </defs>

        {/* STEAM */}
        {effectiveSteam > 0 && (
          <g stroke="#E8C9A0" strokeWidth="3" fill="none" opacity={effectiveSteam}>
            <path d="M130,110 Q120,80 140,50 T130,10" className="steam-path" />
            <path d="M150,120 Q160,90 140,60 T150,20" className="steam-path steam-path-delay-1" />
            <path d="M170,110 Q180,70 160,40 T170,10" className="steam-path steam-path-delay-2" />
          </g>
        )}

        {/* ======================================================== */}
        {/* STYLE 1: HOT CERAMIC CUP (Dynamic Glaze & Turbidity)     */}
        {/* ======================================================== */}
        {servingStyle === "hot" && (
          <g>
            {/* Saucer */}
            <ellipse cx="150" cy="330" rx="100" ry="25" fill={glaze.saucer1} />
            <ellipse cx="150" cy="325" rx="80" ry="18" fill={glaze.saucer2} />

            {/* Handle */}
            <path
              d="M220,180 C260,180 270,240 220,260"
              fill="none"
              stroke={glaze.handle}
              strokeWidth="15"
              strokeLinecap="round"
            />
            <path
              d="M220,180 C260,180 270,240 220,260"
              fill="none"
              stroke={glaze.handleShadow}
              strokeWidth="15"
              strokeLinecap="round"
              opacity="0.4"
              transform="translate(0, 2)"
            />

            {/* Cup Body with Authentic Glaze */}
            <path
              d="M80,140 L220,140 L200,310 Q150,330 100,310 Z"
              fill={glaze.body}
              stroke={glaze.stroke}
              strokeWidth="2"
            />

            {/* Liquid */}
            <g clipPath="url(#cup-interior-hot)">
              <rect
                x="70"
                y="150"
                width="160"
                height="180"
                fill={liquidColor}
                opacity={isCloudy ? Math.min(1, opacity + 0.15) : opacity}
              />
              <ellipse
                cx="150"
                cy="150"
                rx="68"
                ry="13"
                fill={liquidColor}
                opacity={Math.min(1, opacity + (isClear ? 0.3 : 0.2))}
              />

              {/* Cloudy Matcha / Froth texture */}
              {isCloudy && (
                <g fill="#FFFFFF" opacity="0.3">
                  <circle cx="130" cy="150" r="3" />
                  <circle cx="138" cy="153" r="2.5" />
                  <circle cx="162" cy="148" r="3.5" />
                  <circle cx="170" cy="151" r="2" />
                  <circle cx="150" cy="154" r="2" />
                </g>
              )}

              {/* Crystal Shimmer reflection if clear */}
              {isClear && (
                <ellipse cx="140" cy="148" rx="25" ry="4" fill="#FFFFFF" opacity="0.35" />
              )}

              {/* Bubbles */}
              <circle cx="120" cy="150" r="2" fill="#fff" opacity="0.5" className="bubble" />
              <circle cx="140" cy="155" r="1.5" fill="#fff" opacity="0.4" className="bubble bubble-delay-1" />
              <circle cx="160" cy="148" r="2.5" fill="#fff" opacity="0.6" className="bubble bubble-delay-2" />
              <circle cx="175" cy="152" r="1.5" fill="#fff" opacity="0.5" className="bubble bubble-delay-3" />

              {/* Garnishes inside cup */}
              {renderGarnishes(garnishes, 150, 150)}
            </g>

            {/* Cup Rim inner shadow */}
            <ellipse cx="150" cy="140" rx="70" ry="15" fill="none" stroke={glaze.stroke} strokeWidth="4" opacity="0.4" />
            {/* Cup Rim */}
            <ellipse cx="150" cy="140" rx="70" ry="15" fill="none" stroke={glaze.rim} strokeWidth="6" />
          </g>
        )}

        {/* ======================================================== */}
        {/* STYLE 2: ICED COLD GLASS (Cold Brew)                     */}
        {/* ======================================================== */}
        {servingStyle === "iced" && (
          <g>
            <ellipse cx="150" cy="335" rx="85" ry="18" fill="#8C5E45" opacity="0.8" />
            <ellipse cx="150" cy="332" rx="75" ry="15" fill="#A47556" />

            <g clipPath="url(#glass-interior-iced)">
              <rect x="85" y="125" width="130" height="210" fill={liquidColor} opacity={Math.min(0.92, opacity + 0.1)} />
              <ellipse cx="150" cy="125" rx="58" ry="12" fill={liquidColor} opacity={Math.min(1, opacity + 0.25)} />

              {/* Floating Ice Cubes */}
              <g className="ice-floating">
                <rect x="115" y="130" width="34" height="34" rx="6" fill="#FFFFFF" opacity="0.45" stroke="#E2F1F8" strokeWidth="1.5" />
                <path d="M120,135 L144,135" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
              </g>

              <g className="ice-floating-alt">
                <rect x="148" y="145" width="30" height="30" rx="5" fill="#FFFFFF" opacity="0.4" stroke="#E2F1F8" strokeWidth="1.5" />
                <path d="M152,150 L172,150" stroke="#FFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
              </g>

              <g className="ice-floating">
                <rect x="130" y="185" width="28" height="28" rx="5" fill="#FFFFFF" opacity="0.3" stroke="#FFF" strokeWidth="1" />
              </g>

              <circle cx="112" cy="170" r="1.5" fill="#FFFFFF" opacity="0.5" />
              <circle cx="178" cy="195" r="2" fill="#FFFFFF" opacity="0.6" />
              <circle cx="125" cy="225" r="1.5" fill="#FFFFFF" opacity="0.4" />
              <circle cx="165" cy="250" r="2" fill="#FFFFFF" opacity="0.5" />

              {renderGarnishes(garnishes, 150, 130)}
            </g>

            <path
              d="M90,110 L210,110 L195,320 Q150,335 105,320 Z"
              fill="url(#glassReflect)"
              stroke="#DCEAF2"
              strokeWidth="2.5"
              opacity="0.85"
            />
            <path d="M107,310 L193,310 L195,320 Q150,335 105,320 Z" fill="#DCEAF2" opacity="0.4" />
            <ellipse cx="150" cy="110" rx="60" ry="14" fill="none" stroke="#DCEAF2" strokeWidth="3" />
            <ellipse cx="150" cy="110" rx="57" ry="13" fill="none" stroke="#FFF" strokeWidth="1" opacity="0.7" />

            <circle cx="100" cy="190" r="1.8" fill="#FFF" opacity="0.7" />
            <circle cx="101" cy="196" r="1.2" fill="#FFF" opacity="0.5" />
            <circle cx="198" cy="230" r="2" fill="#FFF" opacity="0.6" />
            <circle cx="197" cy="238" r="1.4" fill="#FFF" opacity="0.7" />
          </g>
        )}

        {/* ======================================================== */}
        {/* STYLE 3: LAYERED TEA LATTE                               */}
        {/* ======================================================== */}
        {servingStyle === "latte" && (
          <g>
            <ellipse cx="150" cy="330" rx="95" ry="22" fill="#8C5E45" opacity="0.9" />
            <ellipse cx="150" cy="326" rx="80" ry="16" fill="#A47556" />

            <path d="M85,130 L215,130 L198,315 Q150,330 102,315 Z" fill="#F8F3EC" stroke="#E3D7C7" strokeWidth="2" />

            <g clipPath="url(#latte-interior)">
              <rect x="80" y="130" width="140" height="200" fill="url(#latteGradient)" />
              <ellipse cx="150" cy="138" rx="63" ry="13" fill="#FFFFFF" opacity="0.95" />

              <path
                d="M150,135 C145,130 137,131 137,136 C137,141 150,146 150,146 C150,146 163,141 163,136 C163,131 155,130 150,135 Z"
                fill={liquidColor}
                opacity={0.65}
              />
              <circle cx="150" cy="132" r="1.8" fill={liquidColor} opacity="0.5" />
              <circle cx="150" cy="129" r="1.2" fill={liquidColor} opacity="0.4" />

              {renderGarnishes(garnishes, 150, 138)}
            </g>

            <ellipse cx="150" cy="130" rx="65" ry="15" fill="none" stroke="#FFFFFF" strokeWidth="4" />
            <ellipse cx="150" cy="130" rx="65" ry="15" fill="none" stroke="#E3D7C7" strokeWidth="1.5" />
          </g>
        )}
      </svg>
    </motion.div>
  );
}

function renderGarnishes(garnishes: string[], cx: number, cy: number) {
  return (
    <g className="petal-floating">
      {garnishes.includes("honey") && (
        <circle cx={cx} cy={cy} r="28" fill="url(#honeySheen)" />
      )}

      {garnishes.includes("cinnamon") && (
        <g transform={`translate(${cx - 10}, ${cy - 25}) rotate(-25)`}>
          <rect x="0" y="0" width="8" height="60" rx="3" fill="#783F27" stroke="#5C2E1B" strokeWidth="1" />
          <line x1="2" y1="5" x2="2" y2="55" stroke="#9C583B" strokeWidth="1" />
          <ellipse cx="4" cy="4" rx="3.5" ry="2" fill="#5C2E1B" />
        </g>
      )}

      {garnishes.includes("osmanthus") && (
        <g fill="#FFAA00" opacity="0.9">
          <circle cx={cx - 20} cy={cy - 2} r="2" />
          <circle cx={cx - 17} cy={cy - 2} r="2" />
          <circle cx={cx - 18.5} cy={cy - 4} r="2" />
          <circle cx={cx - 18.5} cy={cy} r="2" />
          <circle cx={cx - 18.5} cy={cy - 2} r="1.5" fill="#FFF275" />

          <circle cx={cx + 15} cy={cy + 3} r="1.8" />
          <circle cx={cx + 18} cy={cy + 3} r="1.8" />
          <circle cx={cx + 16.5} cy={cy + 1.2} r="1.8" />
          <circle cx={cx + 16.5} cy={cy + 4.8} r="1.8" />
          <circle cx={cx + 16.5} cy={cy + 3} r="1.2" fill="#FFF275" />

          <ellipse cx={cx + 2} cy={cy - 5} rx="2" ry="1.2" fill="#FFB703" transform={`rotate(15 ${cx + 2} ${cy - 5})`} />
          <ellipse cx={cx - 8} cy={cy + 5} rx="1.8" ry="1" fill="#FFB703" transform={`rotate(-20 ${cx - 8} ${cy + 5})`} />
        </g>
      )}

      {garnishes.includes("rose") && (
        <g fill="#B82E48" opacity="0.85">
          <path
            d={`M${cx - 12},${cy - 6} C${cx - 18},${cy - 12} ${cx - 6},${cy - 14} ${cx - 8},${cy - 4} Z`}
            fill="#B82E48"
            stroke="#8A1C32"
            strokeWidth="0.5"
          />
          <path
            d={`M${cx + 10},${cy - 2} C${cx + 6},${cy - 8} ${cx + 16},${cy - 10} ${cx + 14},${cy} Z`}
            fill="#C93B57"
            stroke="#8A1C32"
            strokeWidth="0.5"
          />
          <path
            d={`M${cx - 2},${cy + 4} C${cx - 8},${cy + 1} ${cx - 2},${cy - 2} ${cx + 2},${cy + 3} Z`}
            fill="#9E223B"
          />
        </g>
      )}
    </g>
  );
}

export default CozyCupScene;
