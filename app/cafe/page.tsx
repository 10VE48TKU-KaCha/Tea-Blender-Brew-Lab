"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TeaIngredient, BlendInput, CupVesselType, LatteArtType } from "@/types/tea";
import {
  RitualStep,
  CustomerProfile,
  TeapotType,
  RitualProgressScores,
  CafeCustomerState,
} from "@/types/cafe";
import { CAFE_CUSTOMERS, TEAPOTS } from "@/lib/cafe-customers";
import {
  evaluateCafeBrew,
  EvaluationResult,
  getSavedCoins,
  saveCoins,
  getSavedCustomerStates,
  updateCustomerState,
  getUnlockedItemIds,
} from "@/lib/cafe-engine";
import { calculateExtraction } from "@/lib/extraction-engine";
import TeawarePotScene from "@/components/cafe/TeawarePotScene";
import InteractiveBrewStep from "@/components/cafe/InteractiveBrewStep";
import CustomerDialogue from "@/components/cafe/CustomerDialogue";
import TastingResultModal from "@/components/cafe/TastingResultModal";
import CustomerGuestbookModal from "@/components/cafe/CustomerGuestbookModal";
import TeawareShopModal from "@/components/cafe/TeawareShopModal";
import CozyCupScene from "@/components/game/CozyCupScene";
import FlavorRadarChart from "@/components/charts/FlavorRadarChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Coins,
  BookHeart,
  ShoppingBag,
  Volume2,
  VolumeX,
  CloudRain,
  Flame,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import {
  startAmbientRain,
  stopAmbientRain,
  startFireplace,
  stopFireplace,
  playChime,
  playSipSound,
} from "@/lib/audio";
import { useLanguage } from "@/context/LanguageContext";

type GamePhase =
  | "GREETING"
  | "SELECT_EQUIPMENT"
  | "SELECT_LEAVES"
  | "RITUAL_IN_PROGRESS"
  | "EVALUATION";

export default function CafePage() {
  const { lang } = useLanguage();

  // Ingredients & Pantry data
  const [ingredients, setIngredients] = useState<TeaIngredient[]>([]);
  const [blendRatios, setBlendRatios] = useState<Record<string, number>>({});

  // Active Customer & Progression
  const [customerIndex, setCustomerIndex] = useState<number>(0);
  const currentCustomer: CustomerProfile = CAFE_CUSTOMERS[customerIndex];
  const [coins, setCoins] = useState<number>(150);
  const [unlockedItemIds, setUnlockedItemIds] = useState<string[]>(["glass", "mug", "ceramic"]);
  const [customerStates, setCustomerStates] = useState<Record<string, CafeCustomerState>>({});

  // Teaware Selections
  const [selectedTeapot, setSelectedTeapot] = useState<TeapotType>("glass");
  const [selectedCup, setSelectedCup] = useState<CupVesselType>("mug");
  const [latteArt, setLatteArt] = useState<LatteArtType>("bear");

  // Game Flow State
  const [gamePhase, setGamePhase] = useState<GamePhase>("GREETING");
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  // Ritual Scores
  const [ritualScores, setRitualScores] = useState<RitualProgressScores>({
    tempScore: 0,
    rinseScore: 0,
    spiralScore: 0,
    steepScore: 0,
    decantScore: 0,
    branchScore: 0,
    garnishScore: 0,
  });
  const [boiledWaterTemp, setBoiledWaterTemp] = useState<number>(85);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);

  // Modals
  const [isGuestbookOpen, setIsGuestbookOpen] = useState<boolean>(false);
  const [isShopOpen, setIsShopOpen] = useState<boolean>(false);

  // Ambient Sound Controller (off | rain | fireplace)
  const [ambientMode, setAmbientMode] = useState<"off" | "rain" | "fireplace">("off");

  // Load Saved Data
  useEffect(() => {
    setCoins(getSavedCoins());
    setUnlockedItemIds(getUnlockedItemIds());
    setCustomerStates(getSavedCustomerStates());

    async function loadIngredients() {
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
        console.error("Failed to load ingredients for cafe", err);
      }
    }
    loadIngredients();
  }, []);

  // Ambient Sound Toggle Handler
  const toggleAmbientSound = () => {
    if (ambientMode === "off") {
      setAmbientMode("rain");
      startAmbientRain(0.12);
    } else if (ambientMode === "rain") {
      stopAmbientRain();
      setAmbientMode("fireplace");
      startFireplace(0.1);
    } else {
      stopFireplace();
      setAmbientMode("off");
    }
  };

  useEffect(() => {
    return () => {
      stopAmbientRain();
      stopFireplace();
    };
  }, []);

  // Compute Active Ritual Steps based on Customer's Order Type
  const activeRitualSteps: RitualStep[] = useMemo(() => {
    const steps: RitualStep[] = [
      "KETTLE_TEMP",
      "WARM_TEAWARE",
      "SCOOP_LEAVES",
      "AWAKENING_RINSE",
      "SPIRAL_POUR",
      "STEEPING_WINDOW",
      "PLACE_STRAINER",
      "DECANT_PITCHER",
    ];

    // Branch variations:
    if (currentCustomer.requiredStyle === "latte") {
      steps.push("MILK_STEAM");
    } else if (currentCustomer.requiredStyle === "iced") {
      steps.push("ICE_DROP");
    } else if (
      currentCustomer.preferredTeaNames.some((name) => name.toLowerCase().includes("matcha"))
    ) {
      steps.push("MATCHA_WHISK");
    }

    steps.push("FINISHING_MIST");
    return steps;
  }, [currentCustomer]);

  // Extraction Engine Calculation
  const extraction = useMemo(() => {
    if (!ingredients.length) return null;
    const blendInputs: BlendInput[] = ingredients.map((ing) => ({
      ingredient: ing,
      ratioPercent: blendRatios[ing.id] || 0,
    }));

    const totalRatio = blendInputs.reduce((sum, item) => sum + item.ratioPercent, 0);
    if (totalRatio === 0) return null;

    return calculateExtraction(blendInputs, {
      waterTempC: boiledWaterTemp,
      waterAmountMl: 200,
      steepingTimeSec: currentCustomer.targetSteepSec,
    });
  }, [ingredients, blendRatios, boiledWaterTemp, currentCustomer]);

  // Handle Accepting Customer Order
  const handleAcceptOrder = () => {
    // Pre-select suggested teaware if unlocked
    if (unlockedItemIds.includes(currentCustomer.suggestedTeapot)) {
      setSelectedTeapot(currentCustomer.suggestedTeapot);
    }
    if (unlockedItemIds.includes(currentCustomer.suggestedCup)) {
      setSelectedCup(currentCustomer.suggestedCup);
    }
    setGamePhase("SELECT_EQUIPMENT");
  };

  // Next Customer
  const handleNextCustomer = () => {
    setEvaluationResult(null);
    setCustomerIndex((prev) => (prev + 1) % CAFE_CUSTOMERS.length);
    // Reset ratios
    const resetR: Record<string, number> = {};
    ingredients.forEach((ing) => {
      resetR[ing.id] = 0;
    });
    setBlendRatios(resetR);
    setGamePhase("GREETING");
    setCurrentStepIndex(0);
  };

  // Switch customer from dialogue
  const handleSwitchCustomer = () => {
    setCustomerIndex((prev) => (prev + 1) % CAFE_CUSTOMERS.length);
  };

  // Confirm Equipment & Proceed to Leaf Selection
  const handleConfirmEquipment = () => {
    setGamePhase("SELECT_LEAVES");
  };

  // Confirm Blend & Begin Ritual
  const handleConfirmBlend = () => {
    const hasLeaves = Object.values(blendRatios).some((r) => r > 0);
    if (!hasLeaves) return;
    setGamePhase("RITUAL_IN_PROGRESS");
    setCurrentStepIndex(0);
  };

  // Step Completion Handler
  const handleStepComplete = (score: number, extraData?: any) => {
    const currentStep = activeRitualSteps[currentStepIndex];

    // Record individual score
    if (currentStep === "KETTLE_TEMP") {
      setRitualScores((prev) => ({ ...prev, tempScore: score }));
      if (extraData?.boiledTemp) setBoiledWaterTemp(extraData.boiledTemp);
    } else if (currentStep === "AWAKENING_RINSE") {
      setRitualScores((prev) => ({ ...prev, rinseScore: score }));
    } else if (currentStep === "SPIRAL_POUR") {
      setRitualScores((prev) => ({ ...prev, spiralScore: score }));
    } else if (currentStep === "STEEPING_WINDOW") {
      setRitualScores((prev) => ({ ...prev, steepScore: score }));
    } else if (currentStep === "DECANT_PITCHER") {
      setRitualScores((prev) => ({ ...prev, decantScore: score }));
    } else if (["MATCHA_WHISK", "ICE_DROP", "MILK_STEAM"].includes(currentStep)) {
      setRitualScores((prev) => ({ ...prev, branchScore: score }));
      if (extraData?.latteArt) setLatteArt(extraData.latteArt);
    } else if (currentStep === "FINISHING_MIST") {
      setRitualScores((prev) => ({ ...prev, garnishScore: score }));
    }

    // Advance to next step or final evaluation
    if (currentStepIndex + 1 < activeRitualSteps.length) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      // Completed all ritual steps! Move to evaluation!
      playSipSound();
      const evalRes = evaluateCafeBrew(currentCustomer, extraction, ritualScores);
      setEvaluationResult(evalRes);

      // Award coins
      const newCoins = coins + evalRes.coinsEarned;
      setCoins(newCoins);
      saveCoins(newCoins);

      // Update customer state & guestbook
      updateCustomerState(currentCustomer.id, evalRes.stars, evalRes.totalScorePercent);
      setCustomerStates(getSavedCustomerStates());

      setGamePhase("EVALUATION");
    }
  };

  // Quick preset ratio helper
  const handleAddRatio = (id: string, amount: number) => {
    setBlendRatios((prev) => ({
      ...prev,
      [id]: Math.max(0, Math.min(100, (prev[id] || 0) + amount)),
    }));
  };

  return (
    <div className="min-h-screen pb-16 px-4 max-w-7xl mx-auto space-y-6">
      {/* Top Header Bar */}
      <header className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 pb-2 border-b border-wood/15">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-700 text-cream flex items-center justify-center text-xl shadow-xs">
            🍵
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-dark-wood">
              {lang === "th" ? "Kissa Cafe: คาเฟ่ชงชาหัตถศิลป์" : "Kissa Cafe: Artisan Tea Bar"}
            </h1>
            <p className="text-xs text-wood">
              {lang === "th"
                ? "ต้อนรับลูกค้า รับออร์เดอร์ และรังสรรค์พิธีชงชาชั้นเลิศ"
                : "Welcome cozy patrons, craft authentic rituals, and earn tea master prestige."}
            </p>
          </div>
        </div>

        {/* Top Control Badges & Audio Toggles */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
          {/* Tea Coins Badge */}
          <div className="flex items-center gap-1.5 bg-amber-100/90 border border-amber-300 px-3 py-1.5 rounded-full text-xs font-bold text-amber-900 shadow-inner">
            <Coins className="w-4 h-4 text-amber-700" />
            <span>{coins} {lang === "th" ? "เหรียญ" : "Coins"}</span>
          </div>

          {/* Shop Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsShopOpen(true)}
            className="rounded-xl border-wood/25 bg-white/80 hover:bg-cream text-dark-wood text-xs cursor-pointer shadow-xs"
          >
            <ShoppingBag className="w-3.5 h-3.5 mr-1 text-amber-700" />
            <span>{lang === "th" ? "ร้านค้าอุปกรณ์" : "Teaware Shop"}</span>
          </Button>

          {/* Guestbook Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsGuestbookOpen(true)}
            className="rounded-xl border-wood/25 bg-white/80 hover:bg-cream text-dark-wood text-xs cursor-pointer shadow-xs"
          >
            <BookHeart className="w-3.5 h-3.5 mr-1 text-amber-700" />
            <span>{lang === "th" ? "สมุดลูกค้า" : "Guestbook"}</span>
          </Button>

          {/* Ambient Sound Toggle */}
          <button
            type="button"
            onClick={toggleAmbientSound}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all shadow-xs ${
              ambientMode === "rain"
                ? "bg-sky-100 border-sky-300 text-sky-900"
                : ambientMode === "fireplace"
                ? "bg-amber-100 border-amber-300 text-amber-900"
                : "bg-white/70 border-wood/20 text-wood/60 hover:bg-cream"
            }`}
            title="Toggle Cozy Ambient ASMR"
          >
            {ambientMode === "rain" ? (
              <>
                <CloudRain className="w-3.5 h-3.5 text-sky-700 animate-bounce" />
                <span>🌧️ {lang === "th" ? "ฝนพรำ" : "Rain"}</span>
              </>
            ) : ambientMode === "fireplace" ? (
              <>
                <Flame className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                <span>🪵 {lang === "th" ? "เตาฟืน" : "Hearth"}</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>{lang === "th" ? "เสียงเงียบ" : "Mute"}</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* MAIN GAME CONTENT AREA */}
      <main className="space-y-6">
        {/* PHASE 1: GREETING & ORDER DIALOGUE */}
        {gamePhase === "GREETING" && (
          <CustomerDialogue
            customer={currentCustomer}
            onAcceptOrder={handleAcceptOrder}
            onSwitchCustomer={handleSwitchCustomer}
          />
        )}

        {/* PHASE 2: SELECT TEAWARE EQUIPMENT */}
        {gamePhase === "SELECT_EQUIPMENT" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-display font-bold text-dark-wood">
                {lang === "th" ? "เลือกกาและถ้วยชาประจำออเดอร์" : "Select Your Teapot & Cup"}
              </h2>
              <p className="text-xs text-wood">
                {lang === "th"
                  ? `ลูกค้าแนะนำ: กา ${currentCustomer.suggestedTeapot} และถ้วย ${currentCustomer.suggestedCup}`
                  : `Customer suggestion: ${currentCustomer.suggestedTeapot} pot with ${currentCustomer.suggestedCup} vessel.`}
              </p>
            </div>

            {/* Teapot Selection Cards */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-wood/80">
                {lang === "th" ? "1. เลือกกาน้ำชา (Teapot)" : "1. Choose Teapot"}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TEAPOTS.map((pot) => {
                  const isUnlocked = unlockedItemIds.includes(pot.id);
                  const isSelected = selectedTeapot === pot.id;

                  return (
                    <div
                      key={pot.id}
                      onClick={() => isUnlocked && setSelectedTeapot(pot.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                        !isUnlocked
                          ? "opacity-50 bg-wood/5 border-wood/20 cursor-not-allowed"
                          : isSelected
                          ? "bg-amber-50/90 border-amber-600 shadow-md ring-2 ring-amber-500/30 scale-102"
                          : "bg-white/80 border-wood/15 hover:bg-white"
                      }`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-cream border border-wood/20 flex items-center justify-center text-2xl shrink-0">
                        {pot.icon}
                      </div>
                      <div className="space-y-0.5">
                        <div className="font-bold text-sm text-dark-wood">
                          {lang === "th" ? pot.nameTh : pot.name}
                        </div>
                        <div className="text-[11px] text-wood/80">
                          {lang === "th" ? pot.descTh : pot.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cup Selection Cards */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-wood/80">
                {lang === "th" ? "2. เลือกถ้วยชา (Teacup / Vessel)" : "2. Choose Vessel"}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "mug", name: "Artisan Mug", nameTh: "ถ้วยเซรามิก", icon: "☕" },
                  { id: "chawan", name: "Chawan Bowl", nameTh: "ถ้วยดินเผา", icon: "🥣" },
                  { id: "tumbler", name: "Ice Tumbler", nameTh: "แก้วใสทรงสูง", icon: "🥛" },
                  { id: "latte", name: "Latte Bowl", nameTh: "ชามลาเต้", icon: "🍨" },
                ].map((v) => {
                  const isUnlocked = unlockedItemIds.includes(v.id);
                  const isSelected = selectedCup === v.id;

                  return (
                    <button
                      key={v.id}
                      type="button"
                      disabled={!isUnlocked}
                      onClick={() => setSelectedCup(v.id as CupVesselType)}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        !isUnlocked
                          ? "opacity-50 bg-wood/5 border-wood/20 cursor-not-allowed"
                          : isSelected
                          ? "bg-amber-50 border-amber-600 shadow-sm ring-1 ring-amber-500 font-bold"
                          : "bg-white/80 border-wood/15 hover:bg-white text-wood"
                      }`}
                    >
                      <span className="text-2xl">{v.icon}</span>
                      <span className="text-xs">{lang === "th" ? v.nameTh : v.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Continue Button */}
            <div className="flex justify-between items-center pt-2">
              <Button
                variant="outline"
                onClick={() => setGamePhase("GREETING")}
                className="text-xs border-wood/25 text-wood cursor-pointer rounded-xl"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                {lang === "th" ? "กลับไปหน้าออเดอร์" : "Back to Order"}
              </Button>
              <Button
                onClick={handleConfirmEquipment}
                className="bg-dark-wood hover:bg-wood text-cream font-semibold rounded-xl px-6 cursor-pointer shadow-md"
              >
                <span>{lang === "th" ? "ยืนยันอุปกรณ์ & ไปเลือกใบชา" : "Confirm Teaware & Blend"}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* PHASE 3: BLEND SELECTION */}
        {gamePhase === "SELECT_LEAVES" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Left: Customer Order Clues & Preview Radar */}
            <div className="lg:col-span-4 space-y-4">
              <Card className="bg-white/80 backdrop-blur-md border-wood/20 rounded-3xl p-5 space-y-4 shadow-sm">
                <div className="flex items-center gap-3 border-b border-wood/15 pb-3">
                  <span className="text-3xl">{currentCustomer.avatarEmoji}</span>
                  <div>
                    <h4 className="font-bold font-display text-dark-wood">
                      {lang === "th" ? currentCustomer.nameTh : currentCustomer.name}
                    </h4>
                    <p className="text-[11px] text-wood/80 italic">
                      "{lang === "th" ? currentCustomer.orderDialogueTh : currentCustomer.orderDialogue}"
                    </p>
                  </div>
                </div>

                {/* Target hints */}
                <div className="space-y-1.5 text-xs text-wood">
                  <div>
                    <strong>{lang === "th" ? "ใบชาที่ลูกค้าชอบ:" : "Patron favorites:"}</strong>
                    <ul className="list-disc list-inside text-[11px] text-dark-wood mt-0.5 space-y-0.5">
                      {currentCustomer.preferredTeaNames.map((name) => (
                        <li key={name}>{name}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Extraction Preview */}
                {extraction && (
                  <div className="bg-cream/60 rounded-2xl p-3 border border-amber/20 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-dark-wood">{extraction.cozyTitle}</span>
                      <div
                        className="w-4 h-4 rounded-full border border-wood/20 shadow-xs"
                        style={{ backgroundColor: extraction.renderedHex }}
                      />
                    </div>
                    <div className="h-40 flex items-center justify-center">
                      <FlavorRadarChart
                        data={[
                          { dimension: "Sweet", score: extraction.sweetnessScore, fullMark: 10 },
                          { dimension: "Aroma", score: extraction.aromaScore, fullMark: 10 },
                          { dimension: "Body", score: extraction.bodyScore, fullMark: 10 },
                          { dimension: "Bitter", score: extraction.bitternessScore, fullMark: 10 },
                          { dimension: "Clarity", score: extraction.clarityScore, fullMark: 10 },
                        ]}
                        size="sm"
                      />
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleConfirmBlend}
                  disabled={!extraction}
                  className="w-full bg-dark-wood hover:bg-wood text-cream font-semibold rounded-xl py-2.5 shadow-md cursor-pointer transition-all hover:scale-102"
                >
                  ✨ {lang === "th" ? "เริ่มพิธีการชง (Start Ritual!)" : "Begin Artisan Ritual!"}
                </Button>
              </Card>
            </div>

            {/* Right: World Tea Pantry Quick Pickers */}
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-dark-wood text-xl flex items-center gap-2">
                  <span>🍃</span> {lang === "th" ? "เลือกใบชาลงในเบลนด์" : "Select Tea Leaves"}
                </h3>
                <span className="text-xs text-wood">
                  {Object.values(blendRatios).filter((r) => r > 0).length}{" "}
                  {lang === "th" ? "ชนิดที่เลือก" : "teas selected"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[580px] overflow-y-auto pr-1">
                {ingredients.map((ing) => {
                  const ratio = blendRatios[ing.id] || 0;
                  const isPatronFavorite = currentCustomer.preferredTeaNames.includes(ing.name);

                  return (
                    <div
                      key={ing.id}
                      className={`p-3 rounded-2xl border transition-all ${
                        ratio > 0
                          ? "bg-amber-50/80 border-amber-600/50 shadow-xs"
                          : "bg-white/80 border-wood/15 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-3 h-3 rounded-full border border-wood/20 shrink-0"
                              style={{ backgroundColor: ing.baseColor }}
                            />
                            <h4 className="font-semibold text-xs text-dark-wood line-clamp-1">
                              {ing.name}
                            </h4>
                          </div>
                          {isPatronFavorite && (
                            <Badge className="text-[10px] bg-amber-600 text-white font-normal px-1.5 py-0">
                              ⭐ {lang === "th" ? "ลูกค้าชอบ" : "Favorite"}
                            </Badge>
                          )}
                        </div>

                        {/* Ratio controls */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleAddRatio(ing.id, -25)}
                            className="w-6 h-6 rounded-lg bg-wood/10 text-wood text-xs flex items-center justify-center font-bold hover:bg-wood/20 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-mono text-xs font-bold text-dark-wood">
                            {ratio}%
                          </span>
                          <button
                            type="button"
                            onClick={() => handleAddRatio(ing.id, 25)}
                            className="w-6 h-6 rounded-lg bg-amber-600 text-white text-xs flex items-center justify-center font-bold hover:bg-amber-700 cursor-pointer shadow-2xs"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* PHASE 4: ACTIVE RITUAL IN PROGRESS */}
        {gamePhase === "RITUAL_IN_PROGRESS" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 max-w-4xl mx-auto"
          >
            {/* Step Progress Bar */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-wood/20 shadow-xs space-y-2">
              <div className="flex justify-between text-xs text-wood font-medium">
                <span>
                  {lang === "th" ? "ขั้นตอนที่" : "Step"} {currentStepIndex + 1} / {activeRitualSteps.length}
                </span>
                <span className="font-bold text-dark-wood">
                  {activeRitualSteps[currentStepIndex].replace(/_/g, " ")}
                </span>
              </div>
              <div className="w-full bg-wood/15 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-600 h-full transition-all duration-300"
                  style={{
                    width: `${((currentStepIndex + 1) / activeRitualSteps.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Dynamic Teapot Workstation Scene */}
            <div className="bg-white/50 backdrop-blur-md rounded-3xl p-6 border border-wood/20 shadow-md">
              <TeawarePotScene
                teapotType={selectedTeapot}
                teaColor={extraction?.renderedHex || "#d97706"}
                waterLevel={
                  currentStepIndex >= 4 ? 90 : currentStepIndex >= 1 ? 50 : 0
                }
                steamIntensity={Math.max(0, (boiledWaterTemp - 60) / 40)}
                kettleTemp={boiledWaterTemp}
                isKettleActive={activeRitualSteps[currentStepIndex] === "KETTLE_TEMP"}
                hasLeavesInPot={currentStepIndex >= 2}
                hasStrainerOnPitcher={currentStepIndex >= 6}
                pitcherLiquidLevel={currentStepIndex >= 7 ? 85 : 0}
                isRinsingPot={
                  activeRitualSteps[currentStepIndex] === "WARM_TEAWARE" ||
                  activeRitualSteps[currentStepIndex] === "AWAKENING_RINSE"
                }
              />
            </div>

            {/* Interactive Step Controller Component */}
            <InteractiveBrewStep
              key={activeRitualSteps[currentStepIndex]}
              step={activeRitualSteps[currentStepIndex]}
              customer={currentCustomer}
              onStepComplete={handleStepComplete}
            />
          </motion.div>
        )}
      </main>

      {/* PHASE 5: TASTING EVALUATION MODAL */}
      <AnimatePresence>
        {gamePhase === "EVALUATION" && evaluationResult && (
          <TastingResultModal
            customer={currentCustomer}
            extraction={extraction}
            evaluation={evaluationResult}
            blendRatios={blendRatios}
            ingredients={ingredients}
            waterTempC={boiledWaterTemp}
            steepingTimeSec={currentCustomer.targetSteepSec}
            onNextCustomer={handleNextCustomer}
            onBrewAgain={() => {
              setGamePhase("SELECT_EQUIPMENT");
              setCurrentStepIndex(0);
            }}
          />
        )}
      </AnimatePresence>

      {/* CUSTOMER GUESTBOOK MODAL */}
      <CustomerGuestbookModal
        isOpen={isGuestbookOpen}
        onClose={() => setIsGuestbookOpen(false)}
        customerStates={customerStates}
      />

      {/* TEAWARE SHOP MODAL */}
      <TeawareShopModal
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
        coins={coins}
        unlockedIds={unlockedItemIds}
        onCoinsChange={setCoins}
        onUnlockedChange={setUnlockedItemIds}
      />
    </div>
  );
}
