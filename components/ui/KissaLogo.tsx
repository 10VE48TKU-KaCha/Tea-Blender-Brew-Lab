"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface KissaLogoProps {
  variant?: "full" | "crest" | "badge" | "stamp";
  size?: "sm" | "md" | "lg" | "xl";
  showSubtitle?: boolean;
  subtitle?: string;
  className?: string;
  animated?: boolean;
}

export function KissaMonCrest({
  size = "md",
  className,
  animated = true,
}: {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  animated?: boolean;
}) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  return (
    <div
      className={cn(
        "relative flex items-center justify-center shrink-0 select-none",
        sizeClasses[size],
        className
      )}
    >
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full drop-shadow-xs"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Dark Wood Lacquer Gradient */}
          <linearGradient id="monWoodBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2F2119" />
            <stop offset="50%" stopColor="#1C120C" />
            <stop offset="100%" stopColor="#100805" />
          </linearGradient>

          {/* Golden Amber Gradient */}
          <linearGradient id="monGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="45%" stopColor="#D98824" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          {/* Matcha Green Gradient */}
          <linearGradient id="monMatcha" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ADE80" />
            <stop offset="45%" stopColor="#2D7A47" />
            <stop offset="100%" stopColor="#14532D" />
          </linearGradient>

          {/* Subtle Glow Filter */}
          <filter id="monGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Wood Lacquer Disk */}
        <circle
          cx="60"
          cy="60"
          r="56"
          fill="url(#monWoodBg)"
          stroke="url(#monGold)"
          strokeWidth="2.5"
          className="transition-all duration-300 group-hover:stroke-amber-400"
        />

        {/* Inner Kamon Rings */}
        <circle
          cx="60"
          cy="60"
          r="50"
          stroke="#D98824"
          strokeWidth="1"
          strokeDasharray="3 3"
          opacity="0.6"
        />
        <circle
          cx="60"
          cy="60"
          r="46"
          stroke="#D98824"
          strokeWidth="0.75"
          opacity="0.35"
        />

        {/* 4 Traditional Cardinal Accents */}
        <circle cx="60" cy="14" r="1.5" fill="#FDE047" opacity="0.9" />
        <circle cx="106" cy="60" r="1.5" fill="#FDE047" opacity="0.9" />
        <circle cx="60" cy="106" r="1.5" fill="#FDE047" opacity="0.9" />
        <circle cx="14" cy="60" r="1.5" fill="#FDE047" opacity="0.9" />

        {/* Water Ripples (Mizu-mon) */}
        <g className="transition-transform duration-500 group-hover:scale-105 origin-bottom">
          <path
            d="M 28 86 Q 60 94 92 86"
            stroke="url(#monGold)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d="M 35 78 Q 60 84 85 78"
            stroke="url(#monGold)"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M 42 71 Q 60 76 78 71"
            stroke="url(#monGold)"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.45"
          />
        </g>

        {/* Golden Essence Drop */}
        <circle
          cx="60"
          cy="67"
          r="2.2"
          fill="#FDE047"
          filter="url(#monGlow)"
          className="transition-all duration-300 group-hover:r-[2.8]"
        />

        {/* Left Leaf: Fresh Matcha Green */}
        <path
          d="M 58 68 C 42 64 30 50 36 34 C 44 42 53 53 58 68 Z"
          fill="url(#monMatcha)"
          stroke="#14532D"
          strokeWidth="0.8"
          className="transition-transform duration-500 origin-[58px_68px] group-hover:-rotate-3"
        />
        <path
          d="M 56 65 Q 46 48 37 36"
          stroke="#BBF7D0"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* Right Leaf: Warm Tea Amber */}
        <path
          d="M 62 68 C 78 64 90 50 84 34 C 76 42 67 53 62 68 Z"
          fill="url(#monGold)"
          stroke="#9A520E"
          strokeWidth="0.8"
          className="transition-transform duration-500 origin-[62px_68px] group-hover:rotate-3"
        />
        <path
          d="M 64 65 Q 74 48 83 36"
          stroke="#FEF08A"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* Young Leaf Shoot Center */}
        <path
          d="M 60 55 C 57 44 58 35 60 27 C 62 35 63 44 60 55 Z"
          fill="url(#monGold)"
          stroke="#FDE047"
          strokeWidth="0.6"
        />

        {/* Steam Wisps */}
        <g className={animated ? "animate-pulse opacity-85" : "opacity-75"}>
          <path
            d="M 53 23 Q 50 18 53 14"
            stroke="#FDE047"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.75"
          />
          <path
            d="M 60 21 Q 63 16 60 11"
            stroke="#FDE047"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.9"
          />
          <path
            d="M 67 23 Q 70 18 67 14"
            stroke="#FDE047"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.75"
          />
        </g>
      </svg>
    </div>
  );
}

export function KissaLogo({
  variant = "full",
  size = "md",
  showSubtitle = true,
  subtitle = "Tea Blender & Brew Lab",
  className,
  animated = true,
}: KissaLogoProps) {
  if (variant === "crest") {
    return <KissaMonCrest size={size} className={className} animated={animated} />;
  }

  const titleSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  };

  const subSizes = {
    sm: "text-[9px]",
    md: "text-[10px]",
    lg: "text-xs",
    xl: "text-sm",
  };

  return (
    <div className={cn("flex items-center gap-3 group", className)}>
      <KissaMonCrest size={size} animated={animated} />
      <div className="flex flex-col justify-center">
        <span
          className={cn(
            "font-[family-name:var(--font-display)] font-bold text-wood-dark leading-none tracking-tight drop-shadow-[0_1px_1px_rgba(0,0,0,0.08)] group-hover:text-amber-900 transition-colors",
            titleSizes[size]
          )}
        >
          Kissa Lab
        </span>
        {showSubtitle && (
          <span
            className={cn(
              "uppercase tracking-wider text-wood/75 font-semibold mt-1",
              subSizes[size]
            )}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}

export default KissaLogo;
