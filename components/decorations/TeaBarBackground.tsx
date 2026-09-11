"use client";

import React from "react";
import Image from "next/image";

export function TeaBarBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
      {/* 1. Underlying Atmospheric Kissaten Artwork */}
      <div className="absolute inset-0 opacity-25 sm:opacity-30 scale-105 transition-transform duration-1000">
        <Image
          src="/images/cozy_teahouse_bg.jpg"
          alt="Cozy Japanese Kissaten Background"
          fill
          priority
          className="object-cover object-center filter blur-[1px]"
        />
      </div>

      {/* 2. Warm Frosted Glass & Cream Radial Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FAF6F0]/85 via-[#FAF6F0]/75 to-[#F0E8DC]/90 backdrop-blur-[1.5px]" />

      {/* 3. Subtle Warm Vignette on Edges */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, transparent 40%, rgba(115, 74, 52, 0.12) 100%)",
        }}
      />

      {/* 4. Fine Linen Texture Dot Pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, #8C5E45 0.5px, transparent 0.5px)",
          backgroundSize: "28px 28px",
          opacity: 0.05,
        }}
      />

      {/* 5. Glowing Top Border Gradient Accent */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#734A34] via-[#D4A574] via-[#7BA05B] to-[#734A34] opacity-90 shadow-xs" />
    </div>
  );
}

export default TeaBarBackground;
