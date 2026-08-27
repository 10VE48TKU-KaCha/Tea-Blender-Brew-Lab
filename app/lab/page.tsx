"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TeaIngredient, BlendInput, TeaCategory } from "@/types/tea";
import { calculateExtraction } from "@/lib/extraction-engine";
import { getSommelierAdvices, getFoodPairings } from "@/lib/sommelier-engine";
import IngredientControl from "@/components/game/IngredientControl";
import CozyCupScene, { ServingStyle } from "@/components/game/CozyCupScene";
import FlavorRadarChart from "@/components/charts/FlavorRadarChart";
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

const CATEGORY_TABS: { id: string; label: string; icon: string }[] = [
  { id: "ALL", label: "All Teas", icon: "🌍" },
  { id: "BLACK", label: "Black", icon: "🫖" },
  { id: "GREEN", label: "Green", icon: "🍵" },
  { id: "OOLONG", label: "Oolong", icon: "🌿" },
  { id: "WHITE", label: "White", icon: "🤍" },
  { id: "HERBAL", label: "Herbal", icon: "🌼" },
];

export default function LabPage() {
  const [ingredients, setIngredients] = useState<TeaIngredient[]>([]);
  const [blendRatios, setBlendRatios] = useState<Record<string, number>>({});
  const [waterTempC, setWaterTempC] = useState<number>(85);
  const [waterAmountMl, setWaterAmountMl] = useState<number>(200);
  const [steepingTimeSec, setSteepingTimeSec] = useState<number>(120);
  const [recipeName, setRecipeName] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filter & Search states
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showOnlyActive, setShowOnlyActive] = useState<boolean>(false);

  // New Interactive States
  const [servingStyle, setServingStyle] = useState<ServingStyle>("hot");
  const [garnishes, setGarnishes] = useState<string[]>([]);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [isBrewModalOpen, setIsBrewModalOpen] = useState<boolean>(false);
  const [isPostcardOpen, setIsPostcardOpen] = useState<boolean>(false);

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

  const handleSelectPreset = (preset: TeaPreset) => {
    setActivePresetId(preset.id);
    setRecipeName(preset.name);
    setWaterTempC(preset.waterTempC);
    setSteepingTimeSec(preset.steepingTimeSec);
    setWaterAmountMl(preset.waterAmountMl);
    setServingStyle(preset.servingStyle);
    setGarnishes(preset.garnishes);

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
        setShowSaveSuccess(true);
        setRecipeName("");
        setTimeout(() => setShowSaveSuccess(false), 3000);
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
      { dimension: "Sweetness", score: extraction.sweetnessScore, fullMark: 10 },
      { dimension: "Aroma", score: extraction.aromaScore, fullMark: 10 },
      { dimension: "Body", score: extraction.bodyScore, fullMark: 10 },
      { dimension: "Bitterness", score: extraction.bitternessScore, fullMark: 10 },
      { dimension: "Clarity", score: extraction.clarityScore, fullMark: 10 },
    ];
  }, [extraction]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-light/30 border border-amber/30 text-dark-wood text-xs font-semibold mb-2">
          <Globe className="w-3.5 h-3.5 text-amber-700" />
          <span>World Specialty Tea Laboratory • 1,000+ Unique Possibilities</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-display text-dark-wood font-bold">
          Tea Blending Lab
        </h1>
        <p className="text-wood mt-2 text-base sm:text-lg">
          Blend rare leaves from 11 countries, tune extraction physics, and discover custom sensory profiles
        </p>
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
                <span>🍃</span> World Tea Pantry ({ingredients.length})
              </h2>

              {/* Active blend counter badge */}
              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={() => setShowOnlyActive(!showOnlyActive)}
                  className={cn(
                    "text-xs px-2.5 py-1 rounded-full border transition-all cursor-pointer font-medium flex items-center gap-1.5 w-fit",
                    showOnlyActive
                      ? "bg-dark-wood text-cream border-dark-wood shadow-sm"
                      : "bg-white/80 border-wood/20 text-wood hover:bg-cream"
                  )}
                >
                  <Filter className="w-3 h-3" />
                  <span>{activeCount} Selected Teas {showOnlyActive ? "(Showing Selected)" : "(View Selected)"}</span>
                </button>
              )}
            </div>

            {/* Category Filter Tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {CATEGORY_TABS.map((tab) => {
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
                      "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer shrink-0 border",
                      isSelected
                        ? "bg-amber text-white border-amber shadow-sm"
                        : "bg-white/70 backdrop-blur-sm border-wood/15 text-wood/80 hover:bg-white hover:border-wood/30"
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
              <Search className="w-4 h-4 text-wood/50 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by tea name or country (e.g. Matcha, Earl Grey, Japan)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-white/70 backdrop-blur-sm border border-wood/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber/50 placeholder:text-wood/50"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-wood/60 hover:text-dark-wood"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Ingredients Controls List */}
            {isLoading ? (
              <p className="text-wood py-6 text-center">Opening tea canisters...</p>
            ) : filteredIngredients.length === 0 ? (
              <div className="text-center py-8 bg-white/40 rounded-2xl border border-wood/15 text-xs text-wood/70">
                No teas found matching "{searchQuery || selectedCategory}".
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
            <h2 className="text-2xl font-display text-dark-wood mb-4 flex items-center gap-2">
              <span>🌡️</span> Brew Parameters
            </h2>
            <div className="space-y-4">
              <Card className="bg-white/80 backdrop-blur-sm border-wood/20">
                <CardContent className="pt-6">
                  <div className="flex justify-between mb-2">
                    <label className="font-medium text-dark-wood flex items-center gap-1.5">
                      <span>🌡️</span> Water Temperature
                    </label>
                    <span className="text-amber font-bold">{waterTempC}°C</span>
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
                  <div className="flex justify-between text-[11px] text-wood/60 mt-1">
                    <span>60°C (Cold/Delicate)</span>
                    <span>80°C (Green/Oolong)</span>
                    <span>100°C (Boiling Black)</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-wood/20">
                <CardContent className="pt-6">
                  <div className="flex justify-between mb-2">
                    <label className="font-medium text-dark-wood flex items-center gap-1.5">
                      <span>⏳</span> Steeping Time
                    </label>
                    <span className="text-amber font-bold">{formatTime(steepingTimeSec)}</span>
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
                  <div className="flex justify-between text-[11px] text-wood/60 mt-1">
                    <span>30s (Flash Steep)</span>
                    <span>120s (Balanced)</span>
                    <span>300s (Deep Extraction)</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-wood/20">
                <CardContent className="pt-6">
                  <div className="flex justify-between mb-2">
                    <label className="font-medium text-dark-wood flex items-center gap-1.5">
                      <span>💧</span> Water Amount
                    </label>
                    <span className="text-amber font-bold">{waterAmountMl}ml</span>
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
                </CardContent>
              </Card>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Visual Scene & Profiler (6 cols on lg) */}
        <div className="lg:col-span-6 space-y-6 flex flex-col items-center order-1 lg:order-2">
          {/* Animated Cup Scene with Dynamic Glaze, Turbidity & Garnishes */}
          <div className="w-full bg-white/40 backdrop-blur-sm rounded-3xl p-6 border border-wood/15 shadow-sm flex flex-col items-center">
            <CozyCupScene
              liquidColor={extraction?.renderedHex || "#d1d5db"}
              opacity={hasBlend ? 0.85 : 0.2}
              steamIntensity={Math.max(0, (waterTempC - 60) / 40)}
              servingStyle={servingStyle}
              cupGlaze={extraction?.cupGlaze || "earthenware"}
              turbidity={extraction?.turbidity || "velvet"}
              garnishes={garnishes}
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
                  className="px-5 py-2 bg-amber hover:bg-wood text-white font-medium rounded-full shadow-md flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Live Zen Brew ({formatTime(steepingTimeSec)})</span>
                </Button>

                <Button
                  onClick={() => setIsPostcardOpen(true)}
                  variant="outline"
                  className="px-4 py-2 border-wood/30 bg-white/80 hover:bg-cream text-dark-wood font-medium rounded-full shadow-sm flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105"
                >
                  <Share2 className="w-3.5 h-3.5 text-wood" />
                  <span>🎴 Issue Tea Ticket</span>
                </Button>
              </motion.div>
            )}
          </div>

          {/* Serving Style & Botanicals Selector */}
          <ServingStyleSelector
            servingStyle={servingStyle}
            onStyleChange={setServingStyle}
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
                    <span className="font-mono text-xs font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-300">
                      {extraction.blendCode}
                    </span>
                    {extraction.originCountries && extraction.originCountries.length > 0 && (
                      <span className="text-xs text-wood font-medium">
                        {extraction.originCountries.join(" • ")}
                      </span>
                    )}
                  </div>
                  <h3 className="text-3xl font-display text-dark-wood flex items-center justify-center gap-2 mt-1.5">
                    ✨ {extraction.cozyTitle} ✨
                  </h3>
                </div>

                <Card className="bg-white/60 backdrop-blur-sm border-wood/20">
                  <CardContent className="pt-5 pb-5 text-center italic text-wood text-sm sm:text-base">
                    "{extraction.tastingNotes}"
                  </CardContent>
                </Card>

                {/* Radar Chart */}
                <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-wood/15 flex flex-col items-center">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-wood/70 mb-2">
                    Sensory Flavor Radar
                  </h4>
                  <FlavorRadarChart data={radarData} size="md" />
                </div>

                {/* Color Hex & Glaze Badge */}
                <div className="flex items-center justify-center gap-4 bg-white/50 backdrop-blur-sm py-3 px-6 rounded-2xl border border-wood/15">
                  <span className="text-dark-wood font-medium text-sm">Extracted Liquor:</span>
                  <div
                    className="w-8 h-8 rounded-full shadow-inner border border-wood/20"
                    style={{ backgroundColor: extraction.renderedHex }}
                  />
                  <Badge variant="outline" className="text-wood border-wood font-mono text-xs">
                    {extraction.renderedHex}
                  </Badge>
                  <span className="text-xs text-wood capitalize">
                    Ceramic: {extraction.cupGlaze}
                  </span>
                </div>

                {/* Sommelier Advice & Food Pairing */}
                <SommelierAdviceSection
                  advices={sommelierData.advices}
                  pairings={sommelierData.pairings}
                />

                {/* Save Blend Card */}
                <Card className="border-wood/30 shadow-md bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-dark-wood text-lg flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber" />
                        Save Your Blend to Community Archive
                      </span>
                      <Button
                        onClick={() => setIsPostcardOpen(true)}
                        variant="ghost"
                        className="text-xs text-wood hover:text-dark-wood p-0 h-auto cursor-pointer"
                      >
                        🎴 Preview Ticket
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <input
                      type="text"
                      placeholder="Name your recipe (e.g. Kyoto Morning Reverie)"
                      className="w-full px-3 py-2 border border-wood/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber/50 text-sm bg-white"
                      value={recipeName}
                      onChange={(e) => setRecipeName(e.target.value)}
                    />
                    <div className="relative">
                      <Button
                        className="w-full bg-dark-wood hover:bg-wood text-cream cursor-pointer rounded-xl font-medium"
                        disabled={isSaving || !recipeName.trim()}
                        onClick={handleSave}
                      >
                        {isSaving ? "Saving to Archive..." : "Save Recipe"}
                      </Button>
                      <AnimatePresence>
                        {showSaveSuccess && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="absolute top-full left-0 right-0 mt-2 p-2 bg-emerald-100 text-emerald-800 rounded-xl text-center text-sm font-medium border border-emerald-200"
                          >
                            ✓ Recipe saved successfully to archive!
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-wood/60 italic py-12"
              >
                Select a signature preset or adjust world tea sliders to brew
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
        garnishes={garnishes}
      />

      {/* Shareable Vintage Tea Postcard Modal */}
      {extraction && (
        <TeaPostcardModal
          isOpen={isPostcardOpen}
          onClose={() => setIsPostcardOpen(false)}
          title={recipeName || extraction.cozyTitle}
          extraction={extraction}
          blendInputs={ingredients.map((ing) => ({
            ingredient: ing,
            ratioPercent: blendRatios[ing.id] || 0,
          }))}
          waterTempC={waterTempC}
          steepingTimeSec={steepingTimeSec}
          waterAmountMl={waterAmountMl}
          servingStyle={servingStyle}
          garnishes={garnishes}
        />
      )}
    </div>
  );
}
