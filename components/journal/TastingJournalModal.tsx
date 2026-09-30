"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  JournalEntry,
  getJournalEntries,
  saveJournalEntry,
  deleteJournalEntry,
} from "@/lib/journal-engine";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  BookHeart,
  X,
  Star,
  Search,
  Trash2,
  Play,
  Calendar,
  Sparkles,
  Tag,
  Plus,
  HeartPulse,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BlendInput, CupVesselType, CupGlaze, LatteArtType, ExtractionResult } from "@/types/tea";
import { ServingStyle } from "@/components/game/CozyCupScene";
import { WellnessAnalysis } from "@/lib/wellness-engine";

interface TastingJournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Current lab state for quick logging
  currentExtraction?: ExtractionResult | null;
  currentBlendInputs?: BlendInput[];
  waterTempC?: number;
  waterAmountMl?: number;
  steepingTimeSec?: number;
  servingStyle?: ServingStyle;
  vesselType?: CupVesselType;
  cupGlaze?: CupGlaze;
  garnishes?: string[];
  latteArt?: LatteArtType;
  recipeName?: string;
  wellnessAnalysis?: WellnessAnalysis | null;
  onLoadRecipeToLab?: (entry: JournalEntry) => void;
}

export default function TastingJournalModal({
  isOpen,
  onClose,
  currentExtraction,
  currentBlendInputs = [],
  waterTempC = 85,
  waterAmountMl = 200,
  steepingTimeSec = 120,
  servingStyle = "hot",
  vesselType = "mug",
  cupGlaze = "earthenware",
  garnishes = [],
  latteArt = "bear",
  recipeName = "",
  wellnessAnalysis,
  onLoadRecipeToLab,
}: TastingJournalModalProps) {
  const { lang } = useLanguage();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTag, setFilterTag] = useState<string>("ALL");
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New entry form state
  const [newRating, setNewRating] = useState<number>(5);
  const [newTitle, setNewTitle] = useState<string>("");
  const [newNotes, setNewNotes] = useState<string>("");
  const [newTagsInput, setNewTagsInput] = useState<string>("Favorite, Relax");

  useEffect(() => {
    if (isOpen) {
      setEntries(getJournalEntries());
      if (recipeName || currentExtraction?.cozyTitle) {
        setNewTitle(recipeName || currentExtraction?.cozyTitle || "");
      }
    }
  }, [isOpen, recipeName, currentExtraction]);

  const activeBlendItems = currentBlendInputs.filter((b) => b.ratioPercent > 0);

  const handleCreateEntry = () => {
    if (!newTitle.trim()) return;

    const tags = newTagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const saved = saveJournalEntry({
      title: newTitle.trim(),
      rating: newRating,
      notes: newNotes.trim(),
      tags,
      waterTempC,
      waterAmountMl,
      steepingTimeSec,
      servingStyle,
      vesselType,
      cupGlaze,
      garnishes,
      latteArt,
      renderedHex: currentExtraction?.renderedHex || "#BA4A1E",
      cozyTitle: currentExtraction?.cozyTitle || newTitle,
      tastingNotes: currentExtraction?.tastingNotes || "",
      blendItems: activeBlendItems.map((b) => ({
        ingredientId: b.ingredient.id,
        ingredientName: b.ingredient.name,
        ratioPercent: b.ratioPercent,
        category: b.ingredient.category,
      })),
      scores: {
        sweetness: currentExtraction?.sweetnessScore || 5,
        aroma: currentExtraction?.aromaScore || 5,
        body: currentExtraction?.bodyScore || 5,
        bitterness: currentExtraction?.bitternessScore || 3,
        clarity: currentExtraction?.clarityScore || 7,
      },
      wellness: wellnessAnalysis
        ? {
            overallScore: wellnessAnalysis.overallScore,
            benefitEn: wellnessAnalysis.primaryBenefitEn,
            benefitTh: wellnessAnalysis.primaryBenefitTh,
            caffeineLevel: wellnessAnalysis.caffeineLevel,
          }
        : undefined,
    });

    setEntries(getJournalEntries());
    setIsAddingNew(false);
    setNewNotes("");
  };

  const handleDelete = (id: string) => {
    const updated = deleteJournalEntry(id);
    setEntries(updated);
  };

  const handleBrewAgain = (entry: JournalEntry) => {
    if (onLoadRecipeToLab) {
      onLoadRecipeToLab(entry);
    }
    onClose();
  };

  // Collect all unique tags
  const allTags = Array.from(
    new Set(entries.flatMap((e) => e.tags).filter(Boolean))
  );

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.blendItems.some((b) =>
        b.ingredientName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesTag = filterTag === "ALL" || entry.tags.includes(filterTag);
    return matchesSearch && matchesTag;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-3xl max-h-[90vh] flex flex-col bg-[#FDFBF7] border border-amber-900/20 rounded-3xl shadow-2xl overflow-hidden text-stone-900"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-950/10 bg-amber-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-700/10 text-amber-800 flex items-center justify-center border border-amber-700/20 shadow-xs">
              <BookHeart className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-amber-950 flex items-center gap-2">
                <span>{lang === "th" ? "สมุดบันทึกชิมชาส่วนตัว" : "My Tasting Journal"}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-mono font-bold">
                  {entries.length} {lang === "th" ? "บันทึก" : "Brews"}
                </span>
              </h3>
              <p className="text-xs text-stone-600">
                {lang === "th"
                  ? "จดบันทึกรสชาติ โน้ตส่วนตัว และความรู้สึกจากการจิบชาแต่ละแก้ว"
                  : "Personal notes, star ratings, and memory impressions of your artisan brews"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-black/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Add from Current Blend Button */}
          {activeBlendItems.length > 0 && !isAddingNew && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-100/60 to-orange-100/40 border border-amber-300/50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-left">
                <div
                  className="w-8 h-8 rounded-full border border-white shadow-xs shrink-0"
                  style={{ backgroundColor: currentExtraction?.renderedHex || "#BA4A1E" }}
                />
                <div>
                  <span className="text-xs font-bold text-amber-900 block">
                    {lang === "th" ? "สูตรที่กำลังปรุงอยู่ในแล็บ:" : "Active Blend in Lab:"} {recipeName || currentExtraction?.cozyTitle}
                  </span>
                  <span className="text-[11px] text-stone-600">
                    {activeBlendItems.map((b) => `${b.ingredient.name} (${b.ratioPercent}%)`).join(", ")}
                  </span>
                </div>
              </div>

              <Button
                onClick={() => setIsAddingNew(true)}
                size="sm"
                className="bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold shadow-xs shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                {lang === "th" ? "จดบันทึกแก้วนี้ลงสมุด" : "Log This Brew"}
              </Button>
            </div>
          )}

          {/* New Entry Form */}
          <AnimatePresence>
            {isAddingNew && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-5 rounded-2xl bg-white border border-amber-300/80 shadow-md space-y-4"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>{lang === "th" ? "บันทึกรสชาติแก้วใหม่" : "New Tasting Note"}</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsAddingNew(false)}
                    className="text-xs text-stone-400 hover:text-stone-700"
                  >
                    ✕ {lang === "th" ? "ยกเลิก" : "Cancel"}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      {lang === "th" ? "ชื่อสูตร / บันทึก" : "Blend Title"}
                    </label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder={lang === "th" ? "เช่น ชาอู่หลงยามบ่าย" : "e.g. Afternoon Floral Oolong"}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      {lang === "th" ? "คะแนนความประทับใจ" : "Personal Rating"}
                    </label>
                    <div className="flex items-center gap-1 pt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={cn(
                              "w-5 h-5",
                              star <= newRating
                                ? "text-amber-500 fill-amber-400"
                                : "text-stone-300"
                            )}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    {lang === "th" ? "บันทึกความรู้สึก & เคล็ดลับการดื่ม" : "Personal Tasting Notes & Pairing Impressions"}
                  </label>
                  <textarea
                    rows={3}
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder={
                      lang === "th"
                        ? "เช่น กลิ่นดอกมะลิเด่นชัด ดื่มตอนอ่านหนังสือนั่งทำงานแล้วมีสมาธิมาก หรือชงกับนมอัลมอนด์แล้วนัวสุดๆ..."
                        : "e.g. Silky finish with bright floral top notes. Pairs wonderfully with lemon shortbread..."
                    }
                    className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    {lang === "th" ? "แท็ก (คั่นด้วยจุลภาค)" : "Tags (comma separated)"}
                  </label>
                  <input
                    type="text"
                    value={newTagsInput}
                    onChange={(e) => setNewTagsInput(e.target.value)}
                    placeholder="Morning, Focus, Rainy Day, Milk Tea"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAddingNew(false)}
                    className="rounded-xl text-xs"
                  >
                    {lang === "th" ? "ยกเลิก" : "Cancel"}
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleCreateEntry}
                    disabled={!newTitle.trim()}
                    className="bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold"
                  >
                    {lang === "th" ? "บันทึกลงสมุด" : "Save to Journal"}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search & Tag Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={lang === "th" ? "ค้นหาในบันทึก..." : "Search notes, leaves, titles..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              />
            </div>

            {allTags.length > 0 && (
              <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                <button
                  type="button"
                  onClick={() => setFilterTag("ALL")}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-colors border",
                    filterTag === "ALL"
                      ? "bg-amber-800 text-white border-transparent"
                      : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                  )}
                >
                  {lang === "th" ? "ทั้งหมด" : "All"}
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setFilterTag(tag)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-colors border",
                      filterTag === tag
                        ? "bg-amber-800 text-white border-transparent"
                        : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                    )}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Journal Entries List */}
          {filteredEntries.length === 0 ? (
            <div className="text-center py-12 space-y-3 bg-white/60 rounded-3xl border border-dashed border-stone-300 p-8">
              <div className="text-4xl">🍵</div>
              <h4 className="font-bold text-stone-700 text-sm">
                {lang === "th" ? "ยังไม่มีบันทึกการชิม" : "No journal entries found"}
              </h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                {lang === "th"
                  ? "ปรุงชาในห้องแล็บแล้วกดปุ่ม 'จดบันทึกแก้วนี้' เพื่อเก็บความทรงจำและคะแนนส่วนตัวของคุณ"
                  : "Craft a recipe in the Lab and click 'Log This Brew' to start cataloging your personal sensory journey."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:shadow-md transition-shadow space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-7 h-7 rounded-full border border-white shadow-xs shrink-0"
                        style={{ backgroundColor: entry.renderedHex }}
                      />
                      <div>
                        <h4 className="font-bold text-sm text-stone-900">{entry.title}</h4>
                        <div className="flex items-center gap-2 text-[11px] text-stone-500">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(entry.date).toLocaleDateString()}</span>
                          <span>•</span>
                          <span className="capitalize">{entry.servingStyle}</span>
                          <span>•</span>
                          <span>{entry.waterTempC}°C</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 self-start sm:self-auto">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={cn(
                            "w-3.5 h-3.5",
                            s <= entry.rating
                              ? "text-amber-500 fill-amber-400"
                              : "text-stone-200"
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Personal Notes */}
                  {entry.notes && (
                    <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/50 text-xs text-stone-700 italic leading-relaxed">
                      "{entry.notes}"
                    </div>
                  )}

                  {/* Leaf blend chips & Wellness note */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    {entry.blendItems.map((b, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-lg bg-stone-100 text-stone-700 font-medium"
                      >
                        {b.ingredientName} {b.ratioPercent}%
                      </span>
                    ))}
                    {entry.wellness && (
                      <span className="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 font-medium flex items-center gap-1">
                        <HeartPulse className="w-3 h-3" />
                        <span>{lang === "th" ? entry.wellness.benefitTh : entry.wellness.benefitEn}</span>
                      </span>
                    )}
                  </div>

                  {/* Tags & Action Buttons */}
                  <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                    <div className="flex flex-wrap gap-1">
                      {entry.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleBrewAgain(entry)}
                        className="rounded-xl text-xs bg-amber-700 hover:bg-amber-800 text-white font-semibold shadow-xs cursor-pointer"
                      >
                        <Play className="w-3 h-3 mr-1 fill-white" />
                        {lang === "th" ? "ชงสูตรนี้ในแล็บ" : "Brew Again"}
                      </Button>
                      <button
                        type="button"
                        onClick={() => handleDelete(entry.id)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title={lang === "th" ? "ลบบันทึก" : "Delete note"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
