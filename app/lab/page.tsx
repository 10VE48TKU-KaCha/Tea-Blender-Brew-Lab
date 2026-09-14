"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { TeaIngredient, BlendInput, TeaCategory, CupVesselType, CupGlaze, CoasterStyle, LatteArtType } from "@/types/tea";
import { calculateExtraction } from "@/lib/extraction-engine";
import { getSommelierAdvices, getFoodPairings } from "@/lib/sommelier-engine";
import IngredientControl from "@/components/game/IngredientControl";
import CozyCupScene, { ServingStyle } from "@/components/game/CozyCupScene";
import FlavorRadarChart from "@/components/charts/FlavorRadarChart";
import BrewPerfectionGauge from "@/components/game/BrewPerfectionGauge";
import MobileActionDrawer from "@/components/game/MobileActionDrawer";
import PresetBar, { TeaPreset } from "@/components/game/PresetBar";
import ServingStyleSelector from "@/components/game/ServingStyleSelector";
import SommelierAdviceSection from "@/components/game/SommelierAdvice";
import ZenBrewModal from "@/components/game/ZenBrewModal";
import TeaPostcardModal from "@/components/game/TeaPostcardModal";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Sparkles, Share2, Search, Filter, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

export default function LabPage() {
  const { t, lang } = useLanguage();
  const [ingredients, setIngredients] = useState<TeaIngredient[]>([]);
  const [blendRatios, setBlendRatios] = useState<Record<string, number>>({});
  const [waterTempC, setWaterTempC] = useState<number>(85);
  const [waterAmountMl, setWaterAmountMl] = useState<number>(200);
  const [steepingTimeSec, setSteepingTimeSec] = useState<number>(120);
  const [recipeName, setRecipeName] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState<boolean>(false);
  const [savedRecipeInfo, setSavedRecipeInfo] = useState<{ id: string; title: string } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filter & Search states
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showOnlyActive, setShowOnlyActive] = useState<boolean>(false);

  // Vessel, Glaze, Coaster & Presentation States
  const [servingStyle, setServingStyle] = useState<ServingStyle>("hot");
  const [vesselType, setVesselType] = useState<CupVesselType>("mug");
  const [cupGlaze, setCupGlaze] = useState<CupGlaze>("earthenware");
  const [coasterStyle, setCoasterStyle] = useState<CoasterStyle>("ceramic");
  const [latteArt, setLatteArt] = useState<LatteArtType>("bear");
  const [garnishes, setGarnishes] = useState<string[]>([]);
  const [hasUserCustomizedVessel, setHasUserCustomizedVessel] = useState<boolean>(false);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [isBrewModalOpen, setIsBrewModalOpen] = useState<boolean>(false);
  const [isPostcardOpen, setIsPostcardOpen] = useState<boolean>(false);

  const categoryTabs = useMemo(() => [
    { id: "ALL", label: t.catAll, icon: "🌍" },
    { id: "BLACK", label: t.catBlack, icon: "🫖" },
    { id: "GREEN", label: t.catGreen, icon: "🍵" },
    { id: "OOLONG", label: t.catOolong, icon: "🌿" },
    { id: "WHITE", label: t.catWhite, icon: "🤍" },
    { id: "HERBAL", label: t.catHerbal, icon: "🌼" },
  ], [t]);

  useEffect(() => {
    async function fetchIngredients() {
      try {
        const res = await fetch("/api/ingredients");
        if (res.ok) {
          const data = await res.json();
          setIngredients(data);
          const initialRatios: Record<string, number> = {};
          data.forEach((ing: TeaIngredient) => {
            initialRatios[ing.id] = 0;
          });
          setBlendRatios(initialRatios);
        }
      } catch (err) {
        console.error("Failed to fetch ingredients", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchIngredients();
  }, []);

  const extraction = useMemo(() => {
    if (!ingredients.length) return null;
    const blendInputs: BlendInput[] = ingredients.map((ing) => ({
      ingredient: ing,
      ratioPercent: blendRatios[ing.id] || 0,
    }));

    const totalRatio = blendInputs.reduce((sum, item) => sum + item.ratioPercent, 0);
    if (totalRatio === 0) return null;

    return calculateExtraction(blendInputs, {
      waterTempC,
      waterAmountMl,
      steepingTimeSec,
    });
  }, [ingredients, blendRatios, waterTempC, waterAmountMl, steepingTimeSec]);

  // Sommelier advice & food pairings
  const sommelierData = useMemo(() => {
    if (!extraction || !ingredients.length) {
      return { advices: [], pairings: [] };
    }
    const blendInputs: BlendInput[] = ingredients.map((ing) => ({
      ingredient: ing,
      ratioPercent: blendRatios[ing.id] || 0,
    }));
    const advices = getSommelierAdvices(
      blendInputs,
      { waterTempC, waterAmountMl, steepingTimeSec },
      extraction
    );
    const pairings = getFoodPairings(extraction);
    return { advices, pairings };
  }, [extraction, ingredients, blendRatios, waterTempC, waterAmountMl, steepingTimeSec]);

  // Filtered ingredients list based on category, search, and active toggle
  const filteredIngredients = useMemo(() => {
    return ingredients.filter((ing) => {
      // Category filter
      if (selectedCategory !== "ALL" && ing.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = ing.name.toLowerCase().includes(q);
        const matchesCategory = ing.category.toLowerCase().includes(q);
        if (!matchesName && !matchesCategory) return false;
      }
      // Show only active blend items
      if (showOnlyActive && (blendRatios[ing.id] || 0) === 0) {
        return false;
      }
      return true;
    });
  }, [ingredients, selectedCategory, searchQuery, showOnlyActive, blendRatios]);

  const activeCount = useMemo(() => {
    return Object.values(blendRatios).filter((r) => r > 0).length;
  }, [blendRatios]);

  const handleRatioChange = (id: string, value: number) => {
    setActivePresetId(null);
    setBlendRatios((prev) => ({ ...prev, [id]: value }));
  };

  // Auto-sync vessel style with recipe extraction recommendation if not manually customized
  useEffect(() => {
    if (extraction && !hasUserCustomizedVessel && extraction.recommendedVessel) {
      setVesselType(extraction.recommendedVessel);
      if (extraction.cupGlaze) {
        setCupGlaze(extraction.cupGlaze);
      }
    }
  }, [extraction, hasUserCustomizedVessel]);

  const handleSelectPreset = (preset: TeaPreset) => {
    setActivePresetId(preset.id);
    setRecipeName(preset.name);
    setWaterTempC(preset.waterTempC);
    setSteepingTimeSec(preset.steepingTimeSec);
    setWaterAmountMl(preset.waterAmountMl);
    setServingStyle(preset.servingStyle);
    if (preset.vesselType) setVesselType(preset.vesselType);
    if (preset.cupGlaze) setCupGlaze(preset.cupGlaze);
    if (preset.coasterStyle) setCoasterStyle(preset.coasterStyle);
    if (preset.latteArt) setLatteArt(preset.latteArt);
    setGarnishes(preset.garnishes);
    setHasUserCustomizedVessel(true);

    const nextRatios: Record<string, number> = {};
    ingredients.forEach((ing) => {
      nextRatios[ing.id] = preset.ingredientRatios[ing.name] || 0;
    });
    setBlendRatios(nextRatios);
  };

  const handleGarnishToggle = (garnishId: string) => {
    setGarnishes((prev) =>
      prev.includes(garnishId) ? prev.filter((id) => id !== garnishId) : [...prev, garnishId]
    );
  };

  const hasBlend = useMemo(() => {
    return Object.values(blendRatios).some((ratio) => ratio > 0);
  }, [blendRatios]);

  const handleSave = async () => {
    if (!hasBlend || !recipeName.trim()) return;
    setIsSaving(true);

    try {
      const payload = {
        title: recipeName,
        description: `Crafted ${servingStyle} blend with ${extraction?.blendCode || "#KISSA"}.`,
        waterTempC,
        waterAmountMl,
        steepingTimeSec,
        renderedHex: extraction?.renderedHex || "#d1d5db",
        vesselType,
        cupGlaze,
        coasterStyle,
        servingStyle,
        turbidity: extraction?.turbidity || "velvet",
        latteArt: servingStyle === "latte" ? latteArt : null,
        garnishes,
        blendItems: Object.entries(blendRatios)
          .filter(([_, ratio]) => ratio > 0)
          .map(([ingredientId, ratioPercent]) => ({ ingredientId, ratioPercent })),
      };

      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const savedData = await res.json();
        setSavedRecipeInfo({ id: savedData.id, title: savedData.title });
        setShowSaveSuccess(true);
        setTimeout(() => setShowSaveSuccess(false), 8000);
      }
    } catch (err) {
      console.error("Failed to save recipe", err);
    } finally {
      setIsSaving(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const radarData = useMemo(() => {
    if (!extraction) return [];
    return [
      { dimension: t.sweetness, score: extraction.sweetnessScore, fullMark: 10 },
      { dimension: t.aroma, score: extraction.aromaScore, fullMark: 10 },
      { dimension: t.body, score: extraction.bodyScore, fullMark: 10 },
      { dimension: t.bitterness, score: extraction.bitternessScore, fullMark: 10 },
      { dimension: t.clarity, score: extraction.clarityScore, fullMark: 10 },
    ];
  }, [extraction, t]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Illustrated Hero Banner with Ambient Shadow & Frosted Scrim */}
      <div className="relative rounded-3xl overflow-hidden mb-8 border border-wood/25 shadow-lg group">
        <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden">
          <Image
            src="/images/kissa_hero_artisan.jpg"
            alt="Kissa Artisan Tea Counter"
            fill
            priority
            className="object-cover object-center group-hover:scale-102 transition-transform duration-700"
          />
          {/* Frosted vignette gradient with softer ambient backing */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent" />

          {/* Text Container with More Translucent Frosted Glass Scrim & Ambient Shadow */}
          <div className="absolute inset-0 flex flex-col items-center justify-end text-center p-4 sm:p-6 md:p-8">
            <div className="w-full max-w-2xl mx-auto flex flex-col items-center p-4 sm:p-6 rounded-3xl bg-black/25 backdrop-blur-md border border-white/15 shadow-[0_8px_30px_rgba(0,0,0,0.45)] space-y-2.5">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-black/35 backdrop-blur-md border border-amber-300/35 text-xs font-semibold text-amber-200 shadow-sm">
                <Globe className="w-3.5 h-3.5 text-amber-300" />
                <span>{t.heroBadge}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-display font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] [text-shadow:_0_2px_14px_rgba(0,0,0,0.9),_0_4px_28px_rgba(0,0,0,0.8)] tracking-tight">
                {t.heroTitle}
              </h1>
              <p className="text-stone-100 text-xs sm:text-sm md:text-base max-w-xl mx-auto drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)] font-medium leading-relaxed">
                {t.heroSubtitle}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Signature Preset Book */}
      <PresetBar
        onSelectPreset={handleSelectPreset}
        activePresetId={activePresetId}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Controls & Pantry (6 cols on lg) */}
        <div className="lg:col-span-6 space-y-8 order-2 lg:order-1">
          {/* Ingredients Section */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="text-2xl font-display text-dark-wood flex items-center gap-2">
                <span>🍃</span> {t.pantryTitle} ({ingredients.length})
              </h2>

              {/* Active blend counter badge */}
              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={() => setShowOnlyActive(!showOnlyActive)}
                  className={cn(
                    "text-xs px-2.5 py-1 rounded-full border transition-all cursor-pointer font-medium flex items-center gap-1.5 w-fit",
                    showOnlyActive
                      ? "bg-gradient-to-r from-[#BA4A1E] to-[#D96830] text-white border-transparent shadow-xs"
                      : "bg-white/90 border-wood/25 text-wood-dark font-semibold hover:bg-amber-50"
                  )}
                >
                  <Filter className="w-3 h-3" />
                  <span>
                    {activeCount} {lang === "th" ? "ชนิดที่เลือก" : "Selected Teas"} {showOnlyActive ? (lang === "th" ? "(แสดงที่เลือก)" : "(Showing Selected)") : (lang === "th" ? "(ดูที่เลือก)" : "(View Selected)")}
                  </span>
                </button>
              )}
            </div>

            {/* Category Filter Tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categoryTabs.map((tab) => {
                const isSelected = selectedCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(tab.id);
                      setShowOnlyActive(false);
                    }}
                    className={cn(
                      "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer shrink-0 border",
                      isSelected
                        ? "bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white border-transparent shadow-xs shadow-amber-900/10 font-bold"
                        : "vibrant-glass-pill text-stone-600 hover:text-stone-900 hover:bg-white border-stone-200/80"
                    )}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs vibrant-glass-pill rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/40 placeholder:text-stone-400 border-stone-200/80 text-stone-900"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Ingredients Controls List */}
            {isLoading ? (
              <p className="text-stone-500 py-6 text-center text-xs">{lang === "th" ? "กำลังเปิดกล่องใบชา..." : "Opening tea canisters..."}</p>
            ) : filteredIngredients.length === 0 ? (
              <div className="text-center py-8 vibrant-glass-card rounded-2xl text-xs text-stone-500">
                {t.noTeasFound}
              </div>
            ) : (
              <motion.div layout className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {filteredIngredients.map((ing) => (
                  <IngredientControl
                    key={ing.id}
                    ingredient={ing}
                    value={blendRatios[ing.id] || 0}
                    onChange={(val) => handleRatioChange(ing.id, val)}
                  />
                ))}
              </motion.div>
            )}
          </section>

          {/* Brew Parameters Section */}
          <section>
            <h2 className="text-xl font-bold text-[#1E1915] mb-3 flex items-center gap-2">
              <span>🌡️</span> {t.brewParamsTitle}
            </h2>
            <div className="space-y-3">
              <div className="vibrant-glass-card rounded-2xl p-4 space-y-1.5">
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-xs sm:text-sm text-stone-800 flex items-center gap-1.5">
                    <span>🌡️</span> {t.waterTemp}
                  </label>
                  <span className="text-amber-700 font-extrabold font-mono text-sm bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                    {waterTempC}°C
                  </span>
                </div>
                <input
                  type="range"
                  min={60}
                  max={100}
                  value={waterTempC}
                  onChange={(e) => {
                    setActivePresetId(null);
                    setWaterTempC(Number(e.target.value));
                  }}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-stone-400 font-medium pt-1">
                  <span>60°C ({lang === "th" ? "ชาขาว/ชาอ่อน" : "Cold/Delicate"})</span>
                  <span>80°C ({lang === "th" ? "ชาเขียว/อู่หลง" : "Green/Oolong"})</span>
                  <span>100°C ({lang === "th" ? "ชาดำเดือด" : "Boiling Black"})</span>
                </div>
              </div>

              <div className="vibrant-glass-card rounded-2xl p-4 space-y-1.5">
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-xs sm:text-sm text-stone-800 flex items-center gap-1.5">
                    <span>⏳</span> {t.steepingTime}
                  </label>
                  <span className="text-amber-700 font-extrabold font-mono text-sm bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                    {formatTime(steepingTimeSec)}
                  </span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={300}
                  step={5}
                  value={steepingTimeSec}
                  onChange={(e) => {
                    setActivePresetId(null);
                    setSteepingTimeSec(Number(e.target.value));
                  }}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-stone-400 font-medium pt-1">
                  <span>30s ({lang === "th" ? "ชงเร็วทันใจ" : "Flash Steep"})</span>
                  <span>120s ({lang === "th" ? "สมดุลกลมกล่อม" : "Balanced"})</span>
                  <span>300s ({lang === "th" ? "สกัดเข้มลึก" : "Deep Extraction"})</span>
                </div>
              </div>

              <div className="vibrant-glass-card rounded-2xl p-4 space-y-1.5">
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-xs sm:text-sm text-stone-800 flex items-center gap-1.5">
                    <span>💧</span> {t.waterAmount}
                  </label>
                  <span className="text-amber-700 font-extrabold font-mono text-sm bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                    {waterAmountMl}ml
                  </span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={500}
                  step={10}
                  value={waterAmountMl}
                  onChange={(e) => {
                    setActivePresetId(null);
                    setWaterAmountMl(Number(e.target.value));
                  }}
                  className="w-full"
                />
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Visual Scene & Profiler (6 cols on lg, sticky on desktop) */}
        <div className="lg:col-span-6 space-y-6 flex flex-col items-center order-1 lg:order-2 lg:sticky lg:top-20 lg:self-start">
          {/* Animated Cup Scene with Dynamic Ambient Halo & Vibrant Glass Panel */}
          <div className="w-full vibrant-glass-panel rounded-3xl p-6 shadow-md flex flex-col items-center relative overflow-hidden">
            {/* Dynamic Ambient Halo behind cup using real-time renderedHex */}
            <div
              className="cup-ambient-halo"
              style={{
                backgroundColor: extraction?.renderedHex || "#d97706",
                opacity: hasBlend ? 0.5 : 0.15,
              }}
            />

            <div className="relative z-10 w-full flex flex-col items-center">
              <CozyCupScene
                liquidColor={extraction?.renderedHex || "#d1d5db"}
                opacity={hasBlend ? 0.85 : 0.2}
                steamIntensity={Math.max(0, (waterTempC - 60) / 40)}
                servingStyle={servingStyle}
                vesselType={vesselType}
                cupGlaze={cupGlaze}
                coasterStyle={coasterStyle}
                turbidity={extraction?.turbidity || "velvet"}
                garnishes={garnishes}
                latteArt={latteArt}
              />

              {/* Quick Live Steeping Action & Postcard Buttons */}
              {hasBlend && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 flex flex-wrap items-center justify-center gap-3"
                >
                  <Button
                    onClick={() => setIsBrewModalOpen(true)}
                    className="px-6 py-2.5 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 text-white font-bold rounded-full shadow-lg shadow-amber-900/20 ring-1 ring-amber-300/40 flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>{t.startLiveBrew} ({formatTime(steepingTimeSec)})</span>
                  </Button>

                  <Button
                    onClick={() => setIsPostcardOpen(true)}
                    variant="outline"
                    className="px-5 py-2.5 border-stone-200/80 bg-white/90 hover:bg-stone-50 text-stone-800 font-semibold rounded-full shadow-xs flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105 active:scale-95"
                  >
                    <Share2 className="w-3.5 h-3.5 text-amber-600" />
                    <span>🎴 {t.createPostcard}</span>
                  </Button>
                </motion.div>
              )}
            </div>
          </div>

          {/* Artisan Cup & Vessel Studio */}
          <ServingStyleSelector
            servingStyle={servingStyle}
            onStyleChange={setServingStyle}
            vesselType={vesselType}
            onVesselChange={(v) => {
              setVesselType(v);
              setHasUserCustomizedVessel(true);
            }}
            cupGlaze={cupGlaze}
            onGlazeChange={(g) => {
              setCupGlaze(g);
              setHasUserCustomizedVessel(true);
            }}
            coasterStyle={coasterStyle}
            onCoasterChange={(c) => {
              setCoasterStyle(c);
              setHasUserCustomizedVessel(true);
            }}
            latteArt={latteArt}
            onLatteArtChange={(a) => {
              setLatteArt(a);
              setHasUserCustomizedVessel(true);
            }}
            garnishes={garnishes}
            onGarnishToggle={handleGarnishToggle}
          />

          {/* Extraction Analytics & Flavor Radar */}
          <AnimatePresence mode="wait">
            {extraction && hasBlend ? (
              <motion.div
                key="extraction-results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full space-y-6"
              >
                {/* Sommelier Title & Blend Discovery Code */}
                <div className="text-center">
                  <div className="inline-flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100/90 px-2.5 py-0.5 rounded-full border border-amber-300">
                      {extraction.blendCode}
                    </span>
                    {extraction.originCountries && extraction.originCountries.length > 0 && (
                      <span className="text-xs text-stone-600 font-medium">
                        {extraction.originCountries.join(" • ")}
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#1E1915] flex items-center justify-center gap-2 mt-1.5">
                    ✨ {extraction.cozyTitle} ✨
                  </h3>
                </div>

                <div className="vibrant-glass-card rounded-2xl p-4 text-center italic text-stone-700 text-sm sm:text-base leading-relaxed">
                  "{extraction.tastingNotes}"
                </div>

                {/* 2-Column Telemetry: Flavor Radar & Brew Perfection Ring */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="vibrant-glass-card rounded-2xl p-4 flex flex-col items-center">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1 w-full text-left">
                      {t.profilerTitle}
                    </h4>
                    <FlavorRadarChart data={radarData} size="sm" />
                  </div>

                  <BrewPerfectionGauge
                    extraction={extraction}
                    steepingTimeSec={steepingTimeSec}
                    waterTempC={waterTempC}
                  />
                </div>

                {/* Color Hex & Glaze Badge */}
                <div className="flex items-center justify-center gap-3 vibrant-glass-pill py-2.5 px-5 rounded-2xl border border-stone-200/80 flex-wrap">
                  <span className="text-stone-700 font-semibold text-xs">
                    {lang === "th" ? "สีน้ำชา:" : "Extracted Liquor:"}
                  </span>
                  <div
                    className="w-6 h-6 rounded-full shadow-xs border border-white"
                    style={{
                      backgroundColor: extraction.renderedHex,
                      boxShadow: `0 0 12px ${extraction.renderedHex}80`,
                    }}
                  />
                  <Badge variant="outline" className="text-stone-700 border-stone-300 font-mono text-xs bg-white/80">
                    {extraction.renderedHex}
                  </Badge>
                  <span className="text-xs text-stone-600 capitalize">
                    {lang === "th" ? "เนื้อถ้วย" : "Ceramic"}: <strong>{extraction.cupGlaze}</strong>
                  </span>
                </div>

                {/* Sommelier Advice & Food Pairing */}
                <SommelierAdviceSection
                  advices={sommelierData.advices}
                  pairings={sommelierData.pairings}
                />

                {/* Save Blend Card */}
                <div className="vibrant-glass-card rounded-3xl p-5 shadow-md border border-stone-200/80 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2 pb-1">
                    <span className="flex items-center gap-2 font-bold text-sm text-[#1E1915]">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      {lang === "th" ? "บันทึกสูตรชาของคุณลงคลังชุมชน" : "Save Your Blend to Community Archive"}
                    </span>
                    <Button
                      onClick={() => setIsPostcardOpen(true)}
                      variant="ghost"
                      className="text-xs text-stone-500 hover:text-stone-800 p-0 h-auto cursor-pointer"
                    >
                      🎴 {lang === "th" ? "ดูตัวอย่างโปสการ์ด" : "Preview Ticket"}
                    </Button>
                  </div>
                  <input
                    type="text"
                    placeholder={t.recipeNamePlaceholder}
                    className="w-full px-3.5 py-2.5 border border-stone-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-xs bg-white/90 text-stone-900"
                    value={recipeName}
                    onChange={(e) => setRecipeName(e.target.value)}
                  />
                  <div className="relative">
                    <Button
                      className="w-full bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 text-white shadow-md shadow-amber-950/20 cursor-pointer rounded-xl font-bold py-2.5 transition-all hover:scale-[1.01] active:scale-[0.98]"
                      disabled={isSaving || !recipeName.trim()}
                      onClick={handleSave}
                    >
                      {isSaving ? t.saving : t.saveRecipe}
                    </Button>
                      <AnimatePresence>
                        {showSaveSuccess && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mt-3 p-3 bg-emerald-50 text-emerald-900 rounded-xl text-center text-sm font-medium border border-emerald-200 shadow-sm space-y-2"
                          >
                            <div className="flex items-center justify-center gap-1.5 font-bold text-emerald-800">
                              <span>✓</span>
                              <span>{t.savedSuccess}</span>
                            </div>
                            {savedRecipeInfo && (
                              <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
                                <Link
                                  href={`/recipes/${savedRecipeInfo.id}`}
                                  className="text-xs px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-medium hover:bg-emerald-800 transition-colors shadow-xs"
                                >
                                  {lang === "th" ? "ดูสูตรในคลัง ↗" : "View in Archive ↗"}
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => setIsPostcardOpen(true)}
                                  className="text-xs px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-800 font-medium hover:bg-emerald-100 transition-colors shadow-xs"
                                >
                                  🎴 {lang === "th" ? "แชร์โปสการ์ด" : "Share Postcard"}
                                </button>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-wood/60 italic py-12"
              >
                {t.craftYourFirstBlend}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Sticky Drawer */}
      <div className="lg:hidden">
        <MobileActionDrawer
          onSave={handleSave}
          isSaving={isSaving}
          hasBlend={hasBlend}
          cozyTitle={extraction?.cozyTitle}
          renderedHex={extraction?.renderedHex}
        />
      </div>

      {/* Zen Live Steeping Modal */}
      <ZenBrewModal
        isOpen={isBrewModalOpen}
        onClose={() => setIsBrewModalOpen(false)}
        totalSeconds={steepingTimeSec}
        targetHex={extraction?.renderedHex || "#D4A574"}
        title={recipeName || extraction?.cozyTitle || "Artisan's Steep"}
        waterTempC={waterTempC}
        servingStyle={servingStyle}
        vesselType={vesselType}
        cupGlaze={cupGlaze}
        coasterStyle={coasterStyle}
        latteArt={latteArt}
        garnishes={garnishes}
      />

      {/* Shareable Vintage Tea Postcard Modal */}
      {extraction && (
        <TeaPostcardModal
          isOpen={isPostcardOpen}
          onClose={() => setIsPostcardOpen(false)}
          title={recipeName || savedRecipeInfo?.title || extraction.cozyTitle}
          extraction={extraction}
          blendInputs={ingredients.map((ing) => ({
            ingredient: ing,
            ratioPercent: blendRatios[ing.id] || 0,
          }))}
          waterTempC={waterTempC}
          steepingTimeSec={steepingTimeSec}
          waterAmountMl={waterAmountMl}
          servingStyle={servingStyle}
          vesselType={vesselType}
          cupGlaze={cupGlaze}
          coasterStyle={coasterStyle}
          latteArt={latteArt}
          garnishes={garnishes}
          recipeId={savedRecipeInfo?.id}
        />
      )}
    </div>
  );
}
