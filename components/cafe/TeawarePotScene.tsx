"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TeapotType } from "@/types/cafe";

interface TeawarePotSceneProps {
  teapotType: TeapotType;
  teaColor: string;
  waterLevel: number;        // 0 to 100
  steamIntensity: number;    // 0 to 1
  kettleTemp: number;        // 60 to 100
  isKettleActive?: boolean;
  hasLeavesInPot?: boolean;
  hasStrainerOnPitcher?: boolean;
  pitcherLiquidLevel?: number; // 0 to 100
  isRinsingPot?: boolean;
  showFairnessPitcher?: boolean;
}

export default function TeawarePotScene({
  teapotType,
  teaColor,
  waterLevel,
  steamIntensity,
  kettleTemp,
  isKettleActive = false,
  hasLeavesInPot = false,
  hasStrainerOnPitcher = false,
  pitcherLiquidLevel = 0,
  isRinsingPot = false,
  showFairnessPitcher = true,
}: TeawarePotSceneProps) {
  // Teapot specific styling and materials
  const potStyleMap: Record<TeapotType, { bodyGrad: string; lidGrad: string; handleStroke: string }> = {
    glass: {
      bodyGrad: "url(#glassPotGrad)",
      lidGrad: "url(#woodLidGrad)",
      handleStroke: "#94a3b8",
    },
    kyusu: {
      bodyGrad: "url(#kyusuClayGrad)",
      lidGrad: "url(#kyusuClayGrad)",
      handleStroke: "#78350f",
    },
    zisha: {
      bodyGrad: "url(#zishaClayGrad)",
      lidGrad: "url(#zishaClayGrad)",
      handleStroke: "#5c2b09",
    },
    porcelain: {
      bodyGrad: "url(#porcelainGrad)",
      lidGrad: "url(#porcelainGrad)",
      handleStroke: "#cbd5e1",
    },
  };

  const currentPot = potStyleMap[teapotType] || potStyleMap.glass;

  return (
    <div className="w-full flex flex-col items-center justify-center relative select-none">
      <svg
        viewBox="0 0 540 280"
        className="w-full max-w-xl h-auto drop-shadow-md overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Bamboo Chapan Tray Gradient */}
          <linearGradient id="chapanWoodGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#854d0e" />
            <stop offset="50%" stopColor="#713f12" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>

          {/* Grate Slats Gradient */}
          <linearGradient id="slatGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a16207" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          {/* Glass Pot Gradient */}
          <linearGradient id="glassPotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.45)" />
            <stop offset="50%" stopColor="rgba(241, 245, 249, 0.2)" />
            <stop offset="100%" stopColor="rgba(203, 213, 225, 0.35)" />
          </linearGradient>

          {/* Wood Lid Gradient */}
          <linearGradient id="woodLidGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#92400e" />
            <stop offset="50%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          {/* Kyusu Clay Gradient */}
          <linearGradient id="kyusuClayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a16207" />
            <stop offset="50%" stopColor="#854d0e" />
            <stop offset="100%" stopColor="#5c2b09" />
          </linearGradient>

          {/* Zisha Dark Clay Gradient */}
          <linearGradient id="zishaClayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="50%" stopColor="#5c2b09" />
            <stop offset="100%" stopColor="#3b1d06" />
          </linearGradient>

          {/* White Porcelain Gradient */}
          <linearGradient id="porcelainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>

          {/* Gooseneck Kettle Steel Gradient */}
          <linearGradient id="kettleSteelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="40%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>

          {/* Gong Dao Bei Glass Pitcher Gradient */}
          <linearGradient id="pitcherGlassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.5)" />
            <stop offset="50%" stopColor="rgba(226, 232, 240, 0.2)" />
            <stop offset="100%" stopColor="rgba(203, 213, 225, 0.4)" />
          </linearGradient>

          {/* Brass Strainer Gradient */}
          <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#a16207" />
          </linearGradient>

          {/* Soft Shadow Filter */}
          <filter id="cozyShadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.25" floodColor="#291508" />
          </filter>
        </defs>

        {/* 1. BAMBOO CHAPAN TRAY BASE (ถาดรองชาไม้ไผ่) */}
        <g id="chapan-tray">
          {/* Main Tray rim */}
          <rect
            x="20"
            y="210"
            width="500"
            height="46"
            rx="12"
            fill="url(#chapanWoodGrad)"
            filter="url(#cozyShadow)"
          />
          {/* Water drainage grating recessed area */}
          <rect
            x="32"
            y="214"
            width="476"
            height="18"
            rx="5"
            fill="#2d1204"
            opacity="0.85"
          />
          {/* Slat bars of the bamboo grating */}
          {Array.from({ length: 26 }).map((_, i) => (
            <rect
              key={i}
              x={42 + i * 18}
              y="216"
              width="8"
              height="14"
              rx="2"
              fill="url(#slatGrad)"
            />
          ))}
          {/* Tray metallic decorative corner brackets */}
          <rect x="22" y="212" width="10" height="8" rx="2" fill="#d97706" opacity="0.6" />
          <rect x="508" y="212" width="10" height="8" rx="2" fill="#d97706" opacity="0.6" />
        </g>

        {/* 2. GOOSENECK KETTLE (ด้านซ้าย: กาต้มน้ำไฟฟ้าปรับอุณหภูมิ) */}
        <g id="gooseneck-kettle" transform="translate(45, 60)">
          {/* Heating Base Stand */}
          <ellipse cx="55" cy="154" rx="42" ry="7" fill="#0f172a" />
          <rect x="20" y="146" width="70" height="8" rx="3" fill="#1e293b" />
          {/* Digital Temp Display on Base */}
          <rect x="42" y="147" width="26" height="6" rx="2" fill="#020617" />
          <text
            x="55"
            y="152"
            textAnchor="middle"
            fill={kettleTemp >= 90 ? "#ef4444" : kettleTemp >= 80 ? "#f59e0b" : "#38bdf8"}
            fontSize="5"
            fontFamily="monospace"
            fontWeight="bold"
          >
            {kettleTemp}°C
          </text>

          {/* Kettle Body */}
          <path
            d="M 32 146 C 26 100, 36 60, 48 50 L 62 50 C 74 60, 84 100, 78 146 Z"
            fill="url(#kettleSteelGrad)"
            filter="url(#cozyShadow)"
          />
          {/* Lid & Knob */}
          <rect x="46" y="44" width="18" height="6" rx="3" fill="#0f172a" />
          <circle cx="55" cy="40" r="4" fill="#d97706" />

          {/* Gooseneck Spout */}
          <path
            d="M 34 125 C 10 115, 6 65, 20 40 C 24 33, 30 35, 26 42 C 16 60, 18 105, 34 115 Z"
            fill="#334155"
          />

          {/* Kettle Handle */}
          <path
            d="M 76 65 C 95 65, 100 115, 76 135"
            fill="none"
            stroke="#1e293b"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Heating indicator LED glow */}
          {isKettleActive && (
            <circle cx="55" cy="144" r="2" fill="#ef4444">
              <animate attributeName="opacity" values="0.4;1;0.4" dur="1.2s" repeatCount="indefinite" />
            </circle>
          )}
        </g>

        {/* 3. ACTIVE TEAPOT (ตรงกลาง: กาชงชาที่ผู้เล่นเลือก) */}
        <g id="active-teapot" transform="translate(200, 75)">
          {/* Rising Steam from Teapot Spout/Lid */}
          {steamIntensity > 0 && (
            <g opacity={Math.min(1, steamIntensity * 0.9)}>
              <path
                d="M 60 10 Q 55 -5, 60 -18 Q 65 -30, 58 -45"
                fill="none"
                stroke="rgba(255, 255, 255, 0.6)"
                strokeWidth="3.5"
                strokeLinecap="round"
              >
                <animate
                  attributeName="d"
                  values="M 60 10 Q 55 -5, 60 -18 Q 65 -30, 58 -45; M 60 10 Q 65 -5, 58 -18 Q 55 -30, 62 -45; M 60 10 Q 55 -5, 60 -18 Q 65 -30, 58 -45"
                  dur="3s"
                  repeatCount="indefinite"
                />
                <animate attributeName="opacity" values="0.2;0.8;0.2" dur="3s" repeatCount="indefinite" />
              </path>
              <path
                d="M 72 15 Q 76 0, 70 -12 Q 66 -25, 72 -38"
                fill="none"
                stroke="rgba(255, 255, 255, 0.45)"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <animate
                  attributeName="d"
                  values="M 72 15 Q 76 0, 70 -12 Q 66 -25, 72 -38; M 72 15 Q 68 0, 74 -12 Q 78 -25, 70 -38; M 72 15 Q 76 0, 70 -12 Q 66 -25, 72 -38"
                  dur="2.4s"
                  repeatCount="indefinite"
                />
              </path>
            </g>
          )}

          {/* Teapot Shadow on Grating */}
          <ellipse cx="65" cy="138" rx="48" ry="7" fill="#1c0d02" opacity="0.6" />

          {/* Back Handle (if Kyusu or Classic) */}
          {teapotType === "kyusu" ? (
            /* Kyusu Side Handle extending towards right/front */
            <path
              d="M 100 80 L 135 68 C 140 66, 142 72, 137 75 L 102 88 Z"
              fill={currentPot.handleStroke}
              filter="url(#cozyShadow)"
            />
          ) : (
            /* Classic Loop Handle */
            <path
              d="M 22 45 C -6 45, -6 105, 22 105"
              fill="none"
              stroke={currentPot.handleStroke}
              strokeWidth="7"
              strokeLinecap="round"
            />
          )}

          {/* Front Spout */}
          <path
            d="M 108 55 C 125 50, 132 40, 136 32 C 137 30, 135 28, 132 30 C 122 38, 114 62, 102 75 Z"
            fill={currentPot.handleStroke}
            filter="url(#cozyShadow)"
          />

          {/* Teapot Body Clip Path for Liquid rendering */}
          <clipPath id="potBodyClip">
            <ellipse cx="65" cy="80" rx="46" ry="42" />
          </clipPath>

          {/* Teapot Body Outline & Fill */}
          <ellipse
            cx="65"
            cy="80"
            rx="46"
            ry="42"
            fill={currentPot.bodyGrad}
            stroke={teapotType === "glass" ? "rgba(255, 255, 255, 0.7)" : "#5c2b09"}
            strokeWidth={teapotType === "glass" ? "1.5" : "2"}
            filter="url(#cozyShadow)"
          />

          {/* Tea Liquid inside Teapot (Visible in Glass or when open) */}
          {waterLevel > 0 && (
            <g clipPath="url(#potBodyClip)">
              {/* Liquid Rect scaling with water level */}
              <rect
                x="15"
                y={125 - (waterLevel / 100) * 80}
                width="100"
                height="85"
                fill={teaColor}
                opacity={teapotType === "glass" ? 0.88 : 0.4}
              />
              {/* Liquid Surface curve with gentle slosh animation */}
              <path
                d={`M 15 ${125 - (waterLevel / 100) * 80} Q 65 ${
                  121 - (waterLevel / 100) * 80
                }, 115 ${125 - (waterLevel / 100) * 80} L 115 130 L 15 130 Z`}
                fill={teaColor}
                opacity="0.95"
              />

              {/* Tea Leaves swirling in pot */}
              {hasLeavesInPot && (
                <g opacity="0.85">
                  <ellipse cx="50" cy={110 - (waterLevel / 100) * 40} rx="4" ry="2" fill="#365314" transform="rotate(15, 50, 110)" />
                  <ellipse cx="72" cy={118 - (waterLevel / 100) * 45} rx="5" ry="2" fill="#14532d" transform="rotate(-25, 72, 118)" />
                  <ellipse cx="60" cy={122 - (waterLevel / 100) * 35} rx="4.5" ry="2.2" fill="#4d7c0f" transform="rotate(40, 60, 122)" />
                  <ellipse cx="80" cy={112 - (waterLevel / 100) * 30} rx="3.5" ry="1.8" fill="#166534" transform="rotate(-10, 80, 112)" />
                </g>
              )}
            </g>
          )}

          {/* Glass Specular Reflection Highlight */}
          {teapotType === "glass" && (
            <path
              d="M 32 60 A 38 34 0 0 1 70 42"
              fill="none"
              stroke="rgba(255, 255, 255, 0.7)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          )}

          {/* Teapot Rim & Lid */}
          <ellipse cx="65" cy="38" rx="26" ry="6" fill="#451a03" opacity="0.3" />
          <ellipse cx="65" cy="36" rx="24" ry="7" fill={currentPot.lidGrad} stroke="#78350f" strokeWidth="1" />
          {/* Lid Knob (Wooden or Clay finial) */}
          <circle cx="65" cy="27" r="4.5" fill="#d97706" />
          <ellipse cx="65" cy="25" rx="2.5" ry="1" fill="#fef08a" opacity="0.6" />
        </g>

        {/* 4. GONG DAO BEI (ขวา: เหยือกพักชาแห่งความเท่าเทียม) */}
        {showFairnessPitcher && (
          <g id="gong-dao-bei" transform="translate(375, 95)">
            {/* Pitcher Shadow */}
            <ellipse cx="45" cy="118" rx="36" ry="6" fill="#1c0d02" opacity="0.5" />

            {/* Pitcher Handle */}
            <path
              d="M 76 40 C 98 40, 98 90, 76 95"
              fill="none"
              stroke="rgba(203, 213, 225, 0.8)"
              strokeWidth="4.5"
              strokeLinecap="round"
            />

            {/* Pouring V-Spout on Left */}
            <path d="M 12 36 L 4 33 L 14 46 Z" fill="rgba(226, 232, 240, 0.7)" />

            {/* Pitcher Body Clip Path */}
            <clipPath id="pitcherBodyClip">
              <path d="M 15 36 L 12 105 C 12 115, 78 115, 78 105 L 75 36 Z" />
            </clipPath>

            {/* Glass Pitcher Body */}
            <path
              d="M 15 36 L 12 105 C 12 115, 78 115, 78 105 L 75 36 Z"
              fill="url(#pitcherGlassGrad)"
              stroke="rgba(255, 255, 255, 0.75)"
              strokeWidth="1.5"
              filter="url(#cozyShadow)"
            />

            {/* Pitcher Liquid Level */}
            {pitcherLiquidLevel > 0 && (
              <g clipPath="url(#pitcherBodyClip)">
                <rect
                  x="5"
                  y={115 - (pitcherLiquidLevel / 100) * 75}
                  width="80"
                  height="80"
                  fill={teaColor}
                  opacity="0.9"
                />
              </g>
            )}

            {/* Brass Strainer resting on top of Pitcher */}
            {hasStrainerOnPitcher && (
              <g id="brass-strainer" transform="translate(2, 26)">
                {/* Strainer Rim & Ears */}
                <ellipse cx="43" cy="10" rx="36" ry="6" fill="url(#brassGrad)" stroke="#854d0e" strokeWidth="1" />
                {/* Long wooden/brass handle */}
                <rect x="74" y="8" width="28" height="4" rx="2" fill="#92400e" stroke="#78350f" strokeWidth="0.5" />
                {/* Fine Mesh Bowl dipping into rim */}
                <path d="M 22 11 Q 43 25, 64 11 Z" fill="#ca8a04" opacity="0.75" />
                {/* Mesh Texture cross hatches */}
                <line x1="32" y1="12" x2="54" y2="20" stroke="#713f12" strokeWidth="0.5" opacity="0.6" />
                <line x1="54" y1="12" x2="32" y2="20" stroke="#713f12" strokeWidth="0.5" opacity="0.6" />
              </g>
            )}

            {/* Pitcher Specular Highlight */}
            <path
              d="M 22 45 L 20 100"
              stroke="rgba(255, 255, 255, 0.65)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* 5. POT WATER RINSE OVERFLOW / WASTEWATER (อนิเมชั่นตอนลวกกาเทน้ำทิ้งลงถาด) */}
        {isRinsingPot && (
          <g id="rinse-water-stream">
            <path
              d="M 335 110 Q 345 150, 340 214"
              fill="none"
              stroke="rgba(224, 242, 254, 0.75)"
              strokeWidth="4"
              strokeLinecap="round"
            >
              <animate attributeName="strokeWidth" values="3;5;3" dur="0.6s" repeatCount="indefinite" />
            </path>
            {/* Splash droplets on tray grate */}
            <circle cx="340" cy="216" r="3" fill="#bae6fd" opacity="0.8">
              <animate attributeName="r" values="2;4;1" dur="0.4s" repeatCount="indefinite" />
            </circle>
          </g>
        )}
      </svg>
    </div>
  );
}
