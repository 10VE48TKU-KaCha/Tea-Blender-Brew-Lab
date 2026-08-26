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
    sm: "h-[180px]",
    md: "h-[280px]",
    lg: "h-[350px]",
  };

  const fontSizeMap = {
    sm: 9,
    md: 11,
    lg: 12,
  };

  return (
    <div className={cn("w-full", sizeMap[size], className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#D4A574" strokeOpacity={0.3} />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fill: "#734A34", fontSize: fontSizeMap[size] }}
          />
          <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
          <Radar
            name="Flavor"
            dataKey="score"
            stroke="#734A34"
            fill="#8C5E45"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default FlavorRadarChart;
