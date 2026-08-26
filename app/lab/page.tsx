"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TeaIngredient, ExtractionResult, BlendInput } from "@/types/tea";
import { calculateExtraction } from "@/lib/extraction-engine";
import IngredientControl from "@/components/game/IngredientControl";
import CozyCupScene from "@/components/game/CozyCupScene";
import FlavorRadarChart from "@/components/charts/FlavorRadarChart";
import MobileActionDrawer from "@/components/game/MobileActionDrawer";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    const blendInputs: BlendInput[] = ingredients.map(ing => ({
      ingredient: ing,
      ratioPercent: blendRatios[ing.id] || 0
    }));
    
    const totalRatio = blendInputs.reduce((sum, item) => sum + item.ratioPercent, 0);
    if (totalRatio === 0) return null;

    return calculateExtraction(blendInputs, {
      waterTempC,
      waterAmountMl,
      steepingTimeSec
    });
  }, [ingredients, blendRatios, waterTempC, waterAmountMl, steepingTimeSec]);

  const handleRatioChange = (id: string, value: number) => {
    setBlendRatios(prev => ({ ...prev, [id]: value }));
  };

  const hasBlend = useMemo(() => {
    return Object.values(blendRatios).some(ratio => ratio > 0);
  }, [blendRatios]);

  const handleSave = async () => {
    if (!hasBlend || !recipeName.trim()) return;
    setIsSaving(true);
    
    try {
      const payload = {
        title: recipeName,
        description: "A cozy custom blend crafted in the lab.",
        waterTempC,
        waterAmountMl,
        steepingTimeSec,
        blendItems: Object.entries(blendRatios)
          .filter(([_, ratio]) => ratio > 0)
          .map(([ingredientId, ratioPercent]) => ({ ingredientId, ratioPercent }))
      };

      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
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
      { dimension: "Clarity", score: Math.max(1, 10 - extraction.bodyScore * 0.4), fullMark: 10 },
    ];
  }, [extraction]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-display text-dark-wood font-bold">Tea Blending Lab</h1>
        <p className="text-wood mt-2 text-lg">Craft your perfect brew</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* LEFT COLUMN: Controls */}
        <div className="space-y-8 order-2 md:order-1">
          <section>
            <h2 className="text-2xl font-display text-dark-wood mb-4 flex items-center gap-2">
              <span>🍃</span> Ingredients
            </h2>
            {isLoading ? (
              <p className="text-wood">Loading ingredients...</p>
            ) : (
              <motion.div layout className="space-y-4">
                {ingredients.map(ing => (
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

          <section>
            <h2 className="text-2xl font-display text-dark-wood mb-4 flex items-center gap-2">
              <span>🌡️</span> Brew Parameters
            </h2>
            <div className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between mb-2">
                    <label className="font-medium text-dark-wood">Water Temperature</label>
                    <span className="text-amber font-bold">{waterTempC}°C</span>
                  </div>
                  <input
                    type="range"
                    min={60}
                    max={100}
                    value={waterTempC}
                    onChange={(e) => setWaterTempC(Number(e.target.value))}
                    className="w-full"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between mb-2">
                    <label className="font-medium text-dark-wood">Steeping Time</label>
                    <span className="text-amber font-bold">{formatTime(steepingTimeSec)}</span>
                  </div>
                  <input
                    type="range"
                    min={30}
                    max={300}
                    step={5}
                    value={steepingTimeSec}
                    onChange={(e) => setSteepingTimeSec(Number(e.target.value))}
                    className="w-full"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between mb-2">
                    <label className="font-medium text-dark-wood">Water Amount</label>
                    <span className="text-amber font-bold">{waterAmountMl}ml</span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={500}
                    step={10}
                    value={waterAmountMl}
                    onChange={(e) => setWaterAmountMl(Number(e.target.value))}
                    className="w-full"
                  />
                </CardContent>
              </Card>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Visualization */}
        <div className="order-1 md:order-2 space-y-8 flex flex-col items-center">
          <CozyCupScene
            liquidColor={extraction?.renderedHex || "#d1d5db"}
            opacity={hasBlend ? 0.8 : 0.2}
            steamIntensity={Math.max(0, (waterTempC - 60) / 40)}
          />

          <AnimatePresence mode="wait">
            {extraction && hasBlend ? (
              <motion.div
                key="extraction-results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full space-y-6"
              >
                <div className="text-center">
                  <h3 className="text-3xl font-display text-dark-wood flex items-center justify-center gap-2">
                    ✨ {extraction.cozyTitle} ✨
                  </h3>
                </div>

                <Card className="bg-white/50 backdrop-blur-sm border-wood/20">
                  <CardContent className="pt-6 text-center italic text-wood">
                    "{extraction.tastingNotes}"
                  </CardContent>
                </Card>

                <div className="flex justify-center">
                  <FlavorRadarChart data={radarData} size="md" />
                </div>

                <div className="flex items-center justify-center gap-4">
                  <span className="text-dark-wood font-medium">Tea Color:</span>
                  <div 
                    className="w-12 h-12 rounded-full shadow-inner border border-wood/20"
                    style={{ backgroundColor: extraction.renderedHex }}
                  />
                  <Badge variant="outline" className="text-wood border-wood">
                    {extraction.renderedHex}
                  </Badge>
                </div>

                <Card className="border-wood/30 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-dark-wood">Save Your Blend</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <input
                      type="text"
                      placeholder="Name your recipe (e.g. Morning Comfort)"
                      className="w-full px-3 py-2 border border-wood/30 rounded-md focus:outline-none focus:ring-2 focus:ring-amber/50"
                      value={recipeName}
                      onChange={(e) => setRecipeName(e.target.value)}
                    />
                    <div className="relative">
                      <Button
                        className="w-full bg-dark-wood hover:bg-wood text-cream"
                        disabled={isSaving || !recipeName.trim()}
                        onClick={handleSave}
                      >
                        {isSaving ? "Saving..." : "Save Recipe"}
                      </Button>
                      <AnimatePresence>
                        {showSaveSuccess && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="absolute top-full left-0 right-0 mt-2 p-2 bg-green-100 text-green-800 rounded text-center text-sm font-medium"
                          >
                            Recipe saved successfully!
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
                Add ingredients to see your blend profile
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="md:hidden">
        <MobileActionDrawer
          onSave={handleSave}
          isSaving={isSaving}
          hasBlend={hasBlend}
          cozyTitle={extraction?.cozyTitle}
          renderedHex={extraction?.renderedHex}
        />
      </div>
    </div>
  );
}
