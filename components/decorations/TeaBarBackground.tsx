"use client";

import React from "react";
import Image from "next/image";

export function TeaBarBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
      {/* 1. Underlying Atmospheric Kissaten Artwork with soft contrast */}
      <div className="absolute inset-0 opacity-15 scale-105 transition-transform duration-1000">
        <Image
          src="/images/cozy_teahouse_bg.jpg"
          alt="Cozy Japanese Kissaten Background"
          fill
          priority
          className="object-cover object-center filter blur-[2px]"
        />
      </div>

      {/* 2. Luminous Ambient Mesh Gradients */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-amber-200/40 via-orange-100/30 to-transparent rounded-full filter blur-[90px] opacity-70" />
      <div className="absolute top-1/4 -right-40 w-[550px] h-[550px] bg-gradient-to-bl from-emerald-200/30 via-teal-100/20 to-transparent rounded-full filter blur-[100px] opacity-65" />
      <div className="absolute -bottom-40 left-1/3 w-[650px] h-[650px] bg-gradient-to-tr from-amber-100/40 via-yellow-50/25 to-transparent rounded-full filter blur-[110px] opacity-70" />

      {/* 3. Warm Frosted Glass & Cream Radial Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FBF8F3]/85 via-[#FBF8F3]/70 to-[#F5EFE6]/90 backdrop-blur-[1px]" />

      {/* 4. Fine Tactile Texture Pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, #8C5E45 0.5px, transparent 0.5px)",
          backgroundSize: "32px 32px",
          opacity: 0.035,
        }}
      />
    </div>
  );
}

export default TeaBarBackground;

