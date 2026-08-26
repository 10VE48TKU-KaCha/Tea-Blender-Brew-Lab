"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CozyCupSceneProps {
  liquidColor: string;
  opacity: number;
  steamIntensity?: number;
  className?: string;
}

export function CozyCupScene({
  liquidColor,
  opacity,
  steamIntensity = 0.5,
  className,
}: CozyCupSceneProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={cn("relative w-full max-w-sm mx-auto", className)}
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
        .bubble { animation: bubble-rise 2s infinite ease-in; }
        .bubble-delay-1 { animation-delay: 0.4s; }
        .bubble-delay-2 { animation-delay: 0.8s; }
        .bubble-delay-3 { animation-delay: 1.2s; }
        .steam-path { animation: steam-rise 3s infinite ease-in-out; }
        .steam-path-delay-1 { animation-delay: 1s; }
        .steam-path-delay-2 { animation-delay: 2s; }
      `}</style>
      <svg viewBox="0 0 300 380" className="w-full h-auto drop-shadow-xl">
        {/* Steam */}
        <g stroke="#E8C9A0" strokeWidth="3" fill="none" opacity={steamIntensity}>
          <path d="M130,120 Q120,90 140,60 T130,10" className="steam-path" />
          <path d="M150,130 Q160,100 140,70 T150,20" className="steam-path steam-path-delay-1" />
          <path d="M170,120 Q180,80 160,50 T170,10" className="steam-path steam-path-delay-2" />
        </g>

        {/* Saucer */}
        <ellipse cx="150" cy="330" rx="100" ry="25" fill="#A47556" />
        <ellipse cx="150" cy="325" rx="80" ry="18" fill="#8C5E45" />

        {/* Handle */}
        <path d="M220,180 C260,180 270,240 220,260" fill="none" stroke="#F5E6D3" strokeWidth="15" strokeLinecap="round" />
        <path d="M220,180 C260,180 270,240 220,260" fill="none" stroke="#D4C4B0" strokeWidth="15" strokeLinecap="round" opacity="0.3" transform="translate(0, 2)" />

        {/* Cup Body */}
        <path d="M80,140 L220,140 L200,310 Q150,330 100,310 Z" fill="#F5E6D3" stroke="#D4C4B0" strokeWidth="2" />
        
        {/* Cup interior clip path */}
        <defs>
          <clipPath id="cup-interior">
            <ellipse cx="150" cy="140" rx="70" ry="15" />
            <path d="M80,140 L220,140 L200,310 Q150,330 100,310 Z" />
          </clipPath>
        </defs>

        {/* Liquid */}
        <g clipPath="url(#cup-interior)">
          <rect x="70" y="150" width="160" height="180" fill={liquidColor} opacity={opacity} />
          {/* Liquid surface */}
          <ellipse cx="150" cy="150" rx="68" ry="13" fill={liquidColor} opacity={Math.min(1, opacity + 0.2)} />
          
          {/* Bubbles */}
          <circle cx="120" cy="150" r="2" fill="#fff" opacity="0.5" className="bubble" />
          <circle cx="140" cy="155" r="1.5" fill="#fff" opacity="0.4" className="bubble bubble-delay-1" />
          <circle cx="160" cy="148" r="2.5" fill="#fff" opacity="0.6" className="bubble bubble-delay-2" />
          <circle cx="175" cy="152" r="1.5" fill="#fff" opacity="0.5" className="bubble bubble-delay-3" />
        </g>

        {/* Cup Rim inner shadow */}
        <ellipse cx="150" cy="140" rx="70" ry="15" fill="none" stroke="#D4C4B0" strokeWidth="4" opacity="0.5" />
        {/* Cup Rim */}
        <ellipse cx="150" cy="140" rx="70" ry="15" fill="none" stroke="#F5E6D3" strokeWidth="6" />
      </svg>
    </motion.div>
  );
}

export default CozyCupScene;
