"use client";

import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

interface RadarData {
  dimension: string;
  score: number;
  fullMark: number;
}

interface FlavorRadarChartProps {
  data: RadarData[];
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function FlavorRadarChart({ data, size = "md", className }: FlavorRadarChartProps) {
  const sizeMap = {
    sm: "h-[190px]",
    md: "h-[270px]",
    lg: "h-[340px]",
  };

  const fontSizeMap = {
    sm: 10,
    md: 11,
    lg: 12,
  };

  return (
    <div className={cn("w-full relative flex items-center justify-center", sizeMap[size], className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="68%" data={data}>
          <defs>
            <radialGradient id="radarVibrantFill" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10B981" stopOpacity={0.65} />
              <stop offset="60%" stopColor="#F59E0B" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#EA580C" stopOpacity={0.25} />
            </radialGradient>
            <filter id="radarStrokeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <PolarGrid stroke="rgba(180, 140, 100, 0.2)" strokeDasharray="3 3" />

          <PolarAngleAxis
            dataKey="dimension"
            tick={{
              fill: "#483428",
              fontSize: fontSizeMap[size],
              fontWeight: 600,
            }}
          />

          <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />

          <Radar
            name="Flavor"
            dataKey="score"
            stroke="#10B981"
            strokeWidth={2}
            fill="url(#radarVibrantFill)"
            dot={{
              r: 3.5,
              fill: "#F59E0B",
              stroke: "#FFFFFF",
              strokeWidth: 2,
            }}
            filter="url(#radarStrokeGlow)"
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default FlavorRadarChart;

