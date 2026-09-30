"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { TeaIngredient, TeaCategory } from "@/types/tea";
import { saveCustomIngredient } from "@/lib/journal-engine";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Leaf, X, Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomLeafModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeafCreated: (newLeaf: TeaIngredient) => void;
}

const PRESET_COLORS = [
  { hex: "#4ade80", label: "Fresh Jade" },
  { hex: "#16a34a", label: "Deep Matcha" },
  { hex: "#d97706", label: "Golden Amber" },
  { hex: "#b45309", label: "Charcoal Oolong" },
  { hex: "#854d0e", label: "Rich Assam Copper" },
  { hex: "#5b21b6", label: "Royal Lavender" },
  { hex: "#ea580c", label: "Sunset Rooibos" },
  { hex: "#fde047", label: "Chamomile Sunlight" },
  { hex: "#e0e7ff", label: "Silver Needle" },
];

export default function CustomLeafModal({
  isOpen,
  onClose,
  onLeafCreated,
}: CustomLeafModalProps) {
  const { lang } = useLanguage();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<TeaCategory>("HERBAL");
  const [baseColor, setBaseColor] = useState("#d97706");
  const [aromaScore, setAromaScore] = useState(7);
  const [bodyScore, setBodyScore] = useState(5);
  const [tanninScore, setTanninScore] = useState(3);

  if (!isOpen) return null;

  const handleCreate = () => {
    if (!name.trim()) return;

    const newLeaf: TeaIngredient = {
      id: `custom_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      category,
      baseColor,
      aromaScore,
      bodyScore,
      tanninScore,
    };

    saveCustomIngredient(newLeaf);
    onLeafCreated(newLeaf);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-[#FDFBF7] border border-stone-200 rounded-3xl shadow-2xl overflow-hidden text-stone-900"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200/80 bg-amber-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-600/10 text-emerald-700 flex items-center justify-center border border-emerald-600/20 shadow-xs">
              <Leaf className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-900">
                {lang === "th" ? "เพิ่มใบชา / พฤกษาส่วนตัว" : "Create Custom Botanical Leaf"}
              </h3>
              <p className="text-xs text-stone-500">
                {lang === "th"
                  ? "เพิ่มใบชาหรือสมุนไพรเฉพาะของคุณเพื่อใช้เบลนด์ในห้องแล็บ"
                  : "Formulate your custom tea leaf or garden herb for the blending counter"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-black/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              {lang === "th" ? "ชื่อใบชา / พฤกษา" : "Botanical Name"}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={lang === "th" ? "เช่น ชาอู่หลงดอยแม่สลอง หรือ ดอกเก๊กฮวยป่า" : "e.g. Doi Mae Salong Oolong or Spearmint"}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1.5">
              {lang === "th" ? "หมวดหมู่ใบชา" : "Category"}
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {(["BLACK", "GREEN", "OOLONG", "WHITE", "HERBAL"] as TeaCategory[]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={cn(
                    "py-1.5 text-xs rounded-xl font-semibold border transition-all text-center",
                    category === cat
                      ? "bg-emerald-700 text-white border-transparent shadow-xs"
                      : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Color Palette Picker */}
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1.5">
              {lang === "th" ? "สีสกัดน้ำชาธรรมชาติ" : "Natural Liquor Swatch"}
            </label>
            <div className="flex flex-wrap gap-2 items-center">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => setBaseColor(c.hex)}
                  title={c.label}
                  className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center relative shadow-xs"
                  style={{
                    backgroundColor: c.hex,
                    borderColor: baseColor === c.hex ? "#1E1915" : "white",
                  }}
                >
                  {baseColor === c.hex && <Check className="w-3.5 h-3.5 text-white drop-shadow-xs" />}
                </button>
              ))}
              <input
                type="color"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                className="w-7 h-7 rounded-full cursor-pointer border border-stone-300"
                title="Custom Hex Picker"
              />
            </div>
          </div>

          {/* Sensory Sliders */}
          <div className="space-y-3 pt-1">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-stone-700">
                  {lang === "th" ? "กลิ่นหอม (Aroma):" : "Aroma Intensity:"}
                </span>
                <span className="font-mono font-bold text-amber-800">{aromaScore}/10</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={aromaScore}
                onChange={(e) => setAromaScore(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-stone-700">
                  {lang === "th" ? "เนื้อสัมผัส (Body):" : "Body / Mouthfeel:"}
                </span>
                <span className="font-mono font-bold text-amber-800">{bodyScore}/10</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={bodyScore}
                onChange={(e) => setBodyScore(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-stone-700">
                  {lang === "th" ? "ความฝาด/แทนนิน (Tannin):" : "Tannin / Astringency:"}
                </span>
                <span className="font-mono font-bold text-amber-800">{tanninScore}/10</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={tanninScore}
                onChange={(e) => setTanninScore(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
            <Button variant="outline" size="sm" onClick={onClose} className="rounded-xl text-xs">
              {lang === "th" ? "ยกเลิก" : "Cancel"}
            </Button>
            <Button
              size="sm"
              onClick={handleCreate}
              disabled={!name.trim()}
              className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              {lang === "th" ? "บันทึกใบชาลงคลังแล็บ" : "Add to Lab Pantry"}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
