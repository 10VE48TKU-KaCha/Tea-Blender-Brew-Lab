"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { RitualStep, CustomerProfile } from "@/types/cafe";
import { LatteArtType } from "@/types/tea";
import {
  playWaterPour,
  playLeafScoopSound,
  playTeacupClink,
  playIceDropSound,
  playWhiskSound,
  playSoftTick,
  playChime,
} from "@/lib/audio";
import { Button } from "@/components/ui/button";
import { Sparkles, Flame, Droplets, Waves, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface InteractiveBrewStepProps {
  step: RitualStep;
  customer: CustomerProfile;
  onStepComplete: (score: number, extraData?: any) => void;
}

export default function InteractiveBrewStep({
  step,
  customer,
  onStepComplete,
}: InteractiveBrewStepProps) {
  const { lang } = useLanguage();

  // Step 1: Kettle Temp states
  const [currentTemp, setCurrentTemp] = useState<number>(65);
  const [isHeating, setIsHeating] = useState<boolean>(false);

  // Step 2: Warm Teaware
  const [hasPouredWarmWater, setHasPouredWarmWater] = useState<boolean>(false);
  const [hasDiscardedWater, setHasDiscardedWater] = useState<boolean>(false);

  // Step 3: Leaf Scooping
  const [scoopCount, setScoopCount] = useState<number>(0);

  // Step 4: Awakening Rinse
  const [rinseProgress, setRinseProgress] = useState<number>(0);
  const [isRinsingActive, setIsRinsingActive] = useState<boolean>(false);

  // Step 5: Spiral Pour
  const [spiralProgress, setSpiralProgress] = useState<number>(0);
  const [isHoldingPour, setIsHoldingPour] = useState<boolean>(false);

  // Step 6: Steeping Window
  const [steepProgress, setSteepProgress] = useState<number>(0);
  const [hasStoppedSteep, setHasStoppedSteep] = useState<boolean>(false);

  // Branch: Matcha Whisk
  const [whiskHits, setWhiskHits] = useState<number>(0);

  // Branch: Ice Drop
  const [hasDroppedIce, setHasDroppedIce] = useState<boolean>(false);

  // Branch: Milk Steam
  const [selectedLatteArt, setSelectedLatteArt] = useState<LatteArtType>("bear");
  const [milkFrothLevel, setMilkFrothLevel] = useState<number>(0);

  // Step 12: Finishing Mist
  const [mistSprayed, setMistSprayed] = useState<boolean>(false);

  // Interval refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // ================= 1. KETTLE TEMP =================
  useEffect(() => {
    if (step === "KETTLE_TEMP" && isHeating) {
      timerRef.current = setInterval(() => {
        setCurrentTemp((prev) => {
          if (prev >= 100) {
            clearInterval(timerRef.current!);
            return 100;
          }
          return prev + 1;
        });
      }, 100);
    } else if (!isHeating && timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step, isHeating]);

  const handleStopKettle = () => {
    setIsHeating(false);
    playChime();
    const diff = Math.abs(currentTemp - customer.targetTemp);
    const score = Math.max(40, 100 - diff * 12);
    onStepComplete(score, { boiledTemp: currentTemp });
  };

  // ================= 2. WARM TEAWARE =================
  const handlePourWarmWater = () => {
    setHasPouredWarmWater(true);
    playWaterPour(1500);
  };

  const handleDiscardRinseWater = () => {
    setHasDiscardedWater(true);
    playTeacupClink();
    setTimeout(() => {
      onStepComplete(100);
    }, 600);
  };

  // ================= 3. LEAF SCOOPING =================
  const handleScoopLeaf = () => {
    playLeafScoopSound();
    const next = scoopCount + 1;
    setScoopCount(next);
    if (next >= 3) {
      setTimeout(() => {
        onStepComplete(100);
      }, 500);
    }
  };

  // ================= 4. AWAKENING RINSE =================
  const handleStartRinse = () => {
    setIsRinsingActive(true);
    playWaterPour(2500);
    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setRinseProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setIsRinsingActive(false);
        playTeacupClink();
        setTimeout(() => {
          onStepComplete(100);
        }, 400);
      }
    }, 200);
  };

  // ================= 5. SPIRAL POUR =================
  useEffect(() => {
    if (step === "SPIRAL_POUR" && isHoldingPour) {
      playWaterPour(2000);
      timerRef.current = setInterval(() => {
        setSpiralProgress((prev) => {
          const next = prev + 4;
          if (next >= 100) {
            clearInterval(timerRef.current!);
            setIsHoldingPour(false);
            onStepComplete(100);
            return 100;
          }
          return next;
        });
      }, 100);
    } else if (!isHoldingPour && timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step, isHoldingPour]);

  // ================= 6. STEEPING WINDOW =================
  useEffect(() => {
    if (step === "STEEPING_WINDOW" && !hasStoppedSteep) {
      timerRef.current = setInterval(() => {
        setSteepProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timerRef.current!);
            return 100;
          }
          playSoftTick();
          return prev + 2;
        });
      }, 140);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step, hasStoppedSteep]);

  const handleStopSteep = () => {
    if (hasStoppedSteep) return;
    setHasStoppedSteep(true);
    if (timerRef.current) clearInterval(timerRef.current);
    playChime();

    // Sweet spot target is 70-85%
    const target = 75;
    const diff = Math.abs(steepProgress - target);
    const score = Math.max(30, 100 - diff * 4);
    setTimeout(() => {
      onStepComplete(score);
    }, 600);
  };

  // ================= 8. DECANT PITCHER =================
  const handleDecantPitcher = () => {
    playWaterPour(2200);
    setTimeout(() => {
      playChime();
      onStepComplete(100);
    }, 1200);
  };

  // ================= 7. MATCHA WHISK =================
  const handleWhiskStroke = () => {
    playWhiskSound();
    const next = whiskHits + 1;
    setWhiskHits(next);
    if (next >= 6) {
      playChime();
      setTimeout(() => {
        onStepComplete(100);
      }, 400);
    }
  };

  // ================= 10. ICE DROP =================
  const handleDropIce = () => {
    playIceDropSound();
    setHasDroppedIce(true);
    setTimeout(() => {
      onStepComplete(100);
    }, 600);
  };

  // ================= 11. MILK STEAM & ART =================
  const handleSteamMilk = () => {
    playWaterPour(1500);
    setMilkFrothLevel(100);
  };

  const handleFinishLatte = () => {
    playChime();
    onStepComplete(100, { latteArt: selectedLatteArt });
  };

  // ================= 12. FINISHING MIST =================
  const handleSprayMist = () => {
    playWhiskSound();
    setMistSprayed(true);
    playChime();
    setTimeout(() => {
      onStepComplete(100);
    }, 600);
  };

  return (
    <div className="w-full bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-wood/20 shadow-sm">
      {/* 1. KETTLE TEMP TUNING */}
      {step === "KETTLE_TEMP" && (
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Flame className="w-5 h-5 text-amber-600 animate-pulse" />
            <h4 className="font-display font-bold text-dark-wood text-lg">
              {lang === "th" ? "1. ต้มน้ำร้อนให้อุณหภูมิตรงเป้าหมาย" : "1. Heat Kettle to Target Temperature"}
            </h4>
          </div>
          <p className="text-xs text-wood">
            {lang === "th"
              ? `ลูกค้าต้องการอุณหภูมิประมาณ ${customer.targetTemp}°C (กดปุ่มต้มแล้วหยุดเมื่อถึงจุดพอดี)`
              : `Customer requested ~${customer.targetTemp}°C. Hold or toggle boil, then stop in the sweet spot.`}
          </p>

          <div className="flex items-center justify-center gap-4 py-2">
            <div className="font-mono text-3xl font-extrabold text-amber-700 bg-amber-50 px-5 py-2 rounded-2xl border border-amber-300 shadow-inner">
              {currentTemp}°C
            </div>
            <div className="text-xs text-wood/70 text-left">
              <div>{lang === "th" ? "เป้าหมาย:" : "Target:"} <span className="font-bold text-dark-wood">{customer.targetTemp}°C</span></div>
              <div>{lang === "th" ? "สถานะ:" : "Status:"} {isHeating ? (lang === "th" ? "🔥 กำลังเดือด..." : "🔥 Boiling...") : (lang === "th" ? "พร้อม" : "Ready")}</div>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            {!isHeating ? (
              <Button
                onClick={() => setIsHeating(true)}
                className="bg-amber-700 hover:bg-amber-800 text-white rounded-xl px-6 cursor-pointer font-semibold shadow-md"
              >
                🔥 {lang === "th" ? "เริ่มต้มน้ำ (Heat Water)" : "Start Heating"}
              </Button>
            ) : (
              <Button
                onClick={handleStopKettle}
                className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-8 cursor-pointer font-bold shadow-md animate-bounce"
              >
                🛑 {lang === "th" ? "หยุดอุณหภูมิ (Lock Temperature!)" : "Lock Temp!"}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* 2. WARM TEAWARE */}
      {step === "WARM_TEAWARE" && (
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Droplets className="w-5 h-5 text-sky-600" />
            <h4 className="font-display font-bold text-dark-wood text-lg">
              {lang === "th" ? "2. ลวกกาและอุ่นถ้วยชา (溫壺燙杯)" : "2. Warm the Teapot & Teacup"}
            </h4>
          </div>
          <p className="text-xs text-wood">
            {lang === "th"
              ? "รินน้ำร้อนลวกเนื้อดินเผาให้ตื่นตัว แล้วเทน้ำทิ้งลงถาดรองชาไม้ไผ่"
              : "Rinse ceramic with hot water to awaken the clay, then discard into the bamboo drainage tray."}
          </p>

          <div className="flex justify-center gap-3 py-2">
            {!hasPouredWarmWater ? (
              <Button
                onClick={handlePourWarmWater}
                className="bg-sky-700 hover:bg-sky-800 text-white rounded-xl px-6 cursor-pointer font-semibold shadow-md"
              >
                💧 {lang === "th" ? "รินน้ำร้อนลวกกาและถ้วย" : "Pour Warming Water"}
              </Button>
            ) : (
              <Button
                onClick={handleDiscardRinseWater}
                className="bg-amber-800 hover:bg-amber-900 text-white rounded-xl px-6 cursor-pointer font-semibold shadow-md animate-pulse"
              >
                🌊 {lang === "th" ? "เทน้ำทิ้งลงถาดรองชา (Discard into Tray)" : "Discard into Tray"}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* 3. SCOOP LEAVES */}
      {step === "SCOOP_LEAVES" && (
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl">🥢</span>
            <h4 className="font-display font-bold text-dark-wood text-lg">
              {lang === "th" ? "3. ใช้ช้อนไม้ไผ่ตักใบชาใส่กา" : "3. Scoop Tea Leaves into the Pot"}
            </h4>
          </div>
          <p className="text-xs text-wood">
            {lang === "th"
              ? `กดตักช้อนชาไม้ไผ่ 3 ครั้ง (${scoopCount}/3 ช้อน)`
              : `Tap the bamboo scoop 3 times to measure leaves (${scoopCount}/3 scoops).`}
          </p>

          {/* Bamboo scoop visual progress */}
          <div className="flex justify-center gap-2">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className={`w-10 h-10 rounded-xl flex items-center justify-center border text-lg transition-all ${
                  scoopCount >= num
                    ? "bg-emerald-100 border-emerald-400 text-emerald-800 shadow-inner scale-105"
                    : "bg-wood/5 border-wood/20 text-wood/30"
                }`}
              >
                {scoopCount >= num ? "🍃" : "🥄"}
              </div>
            ))}
          </div>

          <Button
            onClick={handleScoopLeaf}
            disabled={scoopCount >= 3}
            className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl px-6 cursor-pointer font-semibold shadow-md"
          >
            🍃 {lang === "th" ? "ตักใบชาลงกา (Scoop Leaves)" : "Scoop Tea Leaves"}
          </Button>
        </div>
      )}

      {/* 4. AWAKENING RINSE */}
      {step === "AWAKENING_RINSE" && (
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Waves className="w-5 h-5 text-amber-600" />
            <h4 className="font-display font-bold text-dark-wood text-lg">
              {lang === "th" ? "4. ล้างใบชาน้ำแรก ปลุกยอดชา (醒茶)" : "4. Tea Awakening Flash Rinse"}
            </h4>
          </div>
          <p className="text-xs text-wood">
            {lang === "th"
              ? "รินน้ำร้อนท่วมใบชา 3 วินาทีแล้วเทออกทันที เพื่อล้างฝุ่นและช่วยให้ใบชาคลี่ตัว"
              : "Flash-steep hot water for 3 seconds then discard to open up the tightly curled leaves."}
          </p>

          <div className="w-full bg-wood/10 h-3 rounded-full overflow-hidden max-w-xs mx-auto border border-wood/20">
            <div
              className="bg-amber-600 h-full transition-all duration-200"
              style={{ width: `${rinseProgress}%` }}
            />
          </div>

          <Button
            onClick={handleStartRinse}
            disabled={isRinsingActive}
            className="bg-amber-700 hover:bg-amber-800 text-white rounded-xl px-6 cursor-pointer font-semibold shadow-md"
          >
            {isRinsingActive
              ? (lang === "th" ? "กำลังล้างและเทน้ำแรก..." : "Rinsing Leaves...")
              : (lang === "th" ? "🌊 กดรินน้ำแรกปลุกชา (Flash Rinse)" : "Flash Rinse Now")}
          </Button>
        </div>
      )}

      {/* 5. SPIRAL POUR */}
      {step === "SPIRAL_POUR" && (
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl">🌀</span>
            <h4 className="font-display font-bold text-dark-wood text-lg">
              {lang === "th" ? "5. รินน้ำร้อนวนเป็นก้นหอย (Spiral Pour)" : "5. Spiral Pour to Agitate Leaves"}
            </h4>
          </div>
          <p className="text-xs text-wood">
            {lang === "th"
              ? "กดปุ่มค้างไว้เพื่อรินน้ำวนกระตุ้นใบชาทุกใบอย่างทั่วถึงจนเต็ม 100%"
              : "Press and hold to pour in a spiral motion, aerating the liquor until filled to 100%."}
          </p>

          <div className="w-full bg-wood/10 h-4 rounded-full overflow-hidden max-w-sm mx-auto border border-wood/20">
            <div
              className="bg-gradient-to-r from-amber-500 to-amber-700 h-full transition-all duration-100"
              style={{ width: `${spiralProgress}%` }}
            />
          </div>

          <Button
            onMouseDown={() => setIsHoldingPour(true)}
            onMouseUp={() => setIsHoldingPour(false)}
            onTouchStart={() => setIsHoldingPour(true)}
            onTouchEnd={() => setIsHoldingPour(false)}
            className="bg-amber-800 hover:bg-amber-900 active:scale-95 text-white rounded-xl px-8 py-3 cursor-pointer font-bold shadow-lg"
          >
            🌀 {lang === "th" ? "กดค้างเพื่อรินน้ำวน (Hold to Spiral Pour)" : "Hold to Spiral Pour"} ({spiralProgress}%)
          </Button>
        </div>
      )}

      {/* 6. STEEPING WINDOW */}
      {step === "STEEPING_WINDOW" && (
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl">⏳</span>
            <h4 className="font-display font-bold text-dark-wood text-lg">
              {lang === "th" ? "6. จับจังหวะสกัดชา (Golden Steep Window)" : "6. Golden Extraction Window"}
            </h4>
          </div>
          <p className="text-xs text-wood">
            {lang === "th"
              ? "กดปุ่ม 'ยกที่กรอง / หยุดสกัด' เมื่อเข็มเวลาเข้าสู่โซนสีทอง (Golden Zone)"
              : "Tap 'Lift Strainer' when the timing marker enters the Golden Zone."}
          </p>

          {/* Timeline Bar with Golden Zone */}
          <div className="relative w-full bg-wood/15 h-6 rounded-full overflow-hidden max-w-md mx-auto border border-wood/30">
            {/* Golden Zone marker at 65% - 85% */}
            <div
              className="absolute top-0 bottom-0 bg-amber-400/40 border-x-2 border-amber-500"
              style={{ left: "65%", width: "20%" }}
            />
            {/* Progress fill */}
            <div
              className="bg-amber-700 h-full transition-all duration-100"
              style={{ width: `${steepProgress}%` }}
            />
          </div>

          <div className="flex justify-between max-w-md mx-auto text-[11px] text-wood/70 px-2">
            <span>{lang === "th" ? "จืดชืด (Under)" : "Under-steeped"}</span>
            <span className="font-bold text-amber-700">✨ {lang === "th" ? "โกลเด้นโซน" : "Golden Zone"} ✨</span>
            <span>{lang === "th" ? "ขมฝาด (Over)" : "Over-steeped"}</span>
          </div>

          <Button
            onClick={handleStopSteep}
            disabled={hasStoppedSteep}
            className="bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-xl px-8 cursor-pointer font-bold shadow-md hover:scale-105 active:scale-95"
          >
            🛑 {lang === "th" ? "ยกที่กรอง / หยุดสกัด (Lift Strainer!)" : "Lift Strainer / Stop Steep!"}
          </Button>
        </div>
      )}

      {/* 7. PLACE BRASS STRAINER */}
      {step === "PLACE_STRAINER" && (
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl">🕸️</span>
            <h4 className="font-display font-bold text-dark-wood text-lg">
              {lang === "th" ? "7. วางตะแกรงกรองทองเหลือง (Place Brass Strainer)" : "7. Place Fine Brass Strainer"}
            </h4>
          </div>
          <p className="text-xs text-wood">
            {lang === "th"
              ? "วางตะแกรงกรองตาถี่ลงบนเหยือกพักชาเพื่อดักเศษใบชาเล็กๆ ให้ชาใสบริสุทธิ์"
              : "Rest the fine brass mesh strainer atop the fairness pitcher to catch micro-particles."}
          </p>

          <Button
            onClick={() => {
              playTeacupClink();
              onStepComplete(100);
            }}
            className="bg-amber-700 hover:bg-amber-800 text-white rounded-xl px-6 cursor-pointer font-semibold shadow-md"
          >
            🕸️ {lang === "th" ? "วางตะแกรงกรอง (Place Strainer)" : "Place Strainer"}
          </Button>
        </div>
      )}

      {/* 8. DECANT FAIRNESS PITCHER */}
      {step === "DECANT_PITCHER" && (
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl">⚖️</span>
            <h4 className="font-display font-bold text-dark-wood text-lg">
              {lang === "th" ? "8. รินชาลงเหยือกพักชา (Gong Dao Bei)" : "8. Decant into Fairness Pitcher"}
            </h4>
          </div>
          <p className="text-xs text-wood">
            {lang === "th"
              ? "รินน้ำชาผ่านที่กรองลงเหยือกพักชา เพื่อให้น้ำชาทั้งกาผสมเป็นเนื้อเดียวกันอย่างสมบูรณ์"
              : "Decant through the strainer into the Gong Dao Bei to unify the extraction liquor."}
          </p>

          <Button
            onClick={handleDecantPitcher}
            className="bg-amber-800 hover:bg-amber-900 text-white rounded-xl px-8 cursor-pointer font-bold shadow-md animate-pulse"
          >
            ⚖️ {lang === "th" ? "รินลงเหยือกพักชา (Decant Pitcher)" : "Decant to Pitcher"}
          </Button>
        </div>
      )}

      {/* 9A. BRANCH: MATCHA WHISK */}
      {step === "MATCHA_WHISK" && (
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl">🍵</span>
            <h4 className="font-display font-bold text-dark-wood text-lg">
              {lang === "th" ? "ตีฟองชามัทฉะด้วยแปรงไม้ไผ่ (Chasen Whisking)" : "Whisk Ceremonial Matcha with Chasen"}
            </h4>
          </div>
          <p className="text-xs text-wood">
            {lang === "th"
              ? `กดตีแปรงไม้ไผ่ซิกแซกแบบ W-motion รัวๆ (${whiskHits}/6 ครั้ง)`
              : `Tap rapidly in a W-motion to generate velvety microfoam (${whiskHits}/6 strokes).`}
          </p>

          <div className="w-full bg-emerald-100 h-3 rounded-full overflow-hidden max-w-xs mx-auto border border-emerald-300">
            <div
              className="bg-emerald-600 h-full transition-all duration-150"
              style={{ width: `${(whiskHits / 6) * 100}%` }}
            />
          </div>

          <Button
            onClick={handleWhiskStroke}
            className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl px-8 cursor-pointer font-bold shadow-md hover:scale-105 active:scale-95"
          >
            🍵 {lang === "th" ? "ตีฟองชา (Whisk Stroke!)" : "Whisk Foam!"}
          </Button>
        </div>
      )}

      {/* 9B. BRANCH: ICE DROP */}
      {step === "ICE_DROP" && (
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl">🧊</span>
            <h4 className="font-display font-bold text-dark-wood text-lg">
              {lang === "th" ? "คีบน้ำแข็งก้อนกลมใส่แก้ว (Artisan Ice Sphere Drop)" : "Drop Artisan Clear Ice Sphere"}
            </h4>
          </div>
          <p className="text-xs text-wood">
            {lang === "th"
              ? "ใช้ที่คีบทองเหลืองปล่อยก้อนน้ำแข็งทรงกลมใสลงในแก้วทรงสูง"
              : "Use brass tongs to gently drop a slow-melting crystal ice sphere into the tumbler."}
          </p>

          <Button
            onClick={handleDropIce}
            disabled={hasDroppedIce}
            className="bg-sky-700 hover:bg-sky-800 text-white rounded-xl px-8 cursor-pointer font-bold shadow-md animate-bounce"
          >
            🧊 {lang === "th" ? "ปล่อยก้อนน้ำแข็งลงแก้ว (Drop Ice)" : "Drop Ice Sphere"}
          </Button>
        </div>
      )}

      {/* 9C. BRANCH: MILK STEAM & LATTE ART */}
      {step === "MILK_STEAM" && (
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl">🥛</span>
            <h4 className="font-display font-bold text-dark-wood text-lg">
              {lang === "th" ? "สตรีมนม & เลือกลายลาเต้อาร์ต (Milk Steaming & Art)" : "Steam Milk & Choose Latte Art"}
            </h4>
          </div>

          {milkFrothLevel === 0 ? (
            <Button
              onClick={handleSteamMilk}
              className="bg-amber-700 hover:bg-amber-800 text-white rounded-xl px-6 cursor-pointer font-semibold shadow-md"
            >
              🥛 {lang === "th" ? "สตรีมนมให้เกิดไมโครโฟม (Steam Milk 65°C)" : "Steam Microfoam"}
            </Button>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-wood">
                {lang === "th" ? "เลือกลายฟองนมที่ลูกค้าชื่นชอบ:" : "Select your finishing latte art pattern:"}
              </p>
              <div className="flex justify-center gap-2">
                {(["bear", "cat", "heart", "sakura"] as LatteArtType[]).map((art) => (
                  <button
                    key={art}
                    type="button"
                    onClick={() => setSelectedLatteArt(art)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold capitalize cursor-pointer transition-all ${
                      selectedLatteArt === art
                        ? "bg-dark-wood text-cream border-dark-wood shadow-xs scale-105"
                        : "bg-white border-wood/20 text-wood hover:bg-cream"
                    }`}
                  >
                    {art === "bear" ? "🐻 Bear" : art === "cat" ? "🐱 Cat" : art === "heart" ? "💖 Heart" : "🌸 Sakura"}
                  </button>
                ))}
              </div>
              <Button
                onClick={handleFinishLatte}
                className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl px-8 cursor-pointer font-bold shadow-md"
              >
                ✨ {lang === "th" ? "วาดลายลาเต้อาร์ต (Finish Art)" : "Pour Latte Art"}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* 10. FINISHING MIST & GARNISH */}
      {step === "FINISHING_MIST" && (
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <h4 className="font-display font-bold text-dark-wood text-lg">
              {lang === "th" ? "10. โรยการ์นิช & พ่นละอองกลิ่นอโรม่า (Finishing Mist)" : "10. Botanical Garnish & Citrus Mist"}
            </h4>
          </div>
          <p className="text-xs text-wood">
            {lang === "th"
              ? "ประดับกลีบดอกไม้แห้ง และฉีดสเปรย์ละอองกลิ่นซิตรัสก่อนยกเสิร์ฟ"
              : "Dust botanicals and spray a gentle citrus mist over the rim before serving."}
          </p>

          <Button
            onClick={handleSprayMist}
            disabled={mistSprayed}
            className="bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-xl px-8 cursor-pointer font-bold shadow-md animate-pulse"
          >
            ✨ {lang === "th" ? "พ่นสเปรย์อโรม่า & พร้อมเสิร์ฟ!" : "Spray Mist & Ready to Serve!"}
          </Button>
        </div>
      )}
    </div>
  );
}
