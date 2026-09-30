import { TeaIngredient, BlendInput, ExtractionResult } from "@/types/tea";

export interface WellnessDimension {
  id: string;
  nameEn: string;
  nameTh: string;
  icon: string;
  score: number; // 1-10
  color: string;
  summaryEn: string;
  summaryTh: string;
}

export interface WellnessAnalysis {
  dimensions: WellnessDimension[];
  overallScore: number; // 1-10
  primaryBenefitEn: string;
  primaryBenefitTh: string;
  wellnessQuoteEn: string;
  wellnessQuoteTh: string;
  functionalTags: { labelEn: string; labelTh: string; color: string }[];
  caffeineLevel: "NONE" | "LOW" | "MODERATE" | "HIGH";
  caffeineDescEn: string;
  caffeineDescTh: string;
  bestTimeToDrinkEn: string;
  bestTimeToDrinkTh: string;
}

/**
 * Calculates evidence-informed functional wellness scores based on:
 * - Tea botanical category (Black, Green, Oolong, White, Herbal)
 * - Extraction metrics (temp, steep time, tannin/body)
 * - Botanical properties of common specialty teas
 */
export function calculateWellnessMatrix(
  blendInputs: BlendInput[],
  extraction: ExtractionResult,
  waterTempC: number,
  steepingTimeSec: number
): WellnessAnalysis {
  const activeBlends = blendInputs.filter((b) => b.ratioPercent > 0);
  const totalRatio = activeBlends.reduce((acc, b) => acc + b.ratioPercent, 0);

  if (activeBlends.length === 0 || totalRatio === 0) {
    return getEmptyWellnessAnalysis();
  }

  // Calculate weighted botanical categories
  let greenRatio = 0;
  let whiteRatio = 0;
  let oolongRatio = 0;
  let blackRatio = 0;
  let herbalRatio = 0;

  activeBlends.forEach((item) => {
    const normRatio = item.ratioPercent / totalRatio;
    switch (item.ingredient.category) {
      case "GREEN":
        greenRatio += normRatio;
        break;
      case "WHITE":
        whiteRatio += normRatio;
        break;
      case "OOLONG":
        oolongRatio += normRatio;
        break;
      case "BLACK":
        blackRatio += normRatio;
        break;
      case "HERBAL":
        herbalRatio += normRatio;
        break;
    }
  });

  // 1. Antioxidant Power (Polyphenols, EGCG, Catechins)
  // Green and White teas are richest in delicate catechins; optimal at 75-85°C.
  // Over-boiling (100°C for green) degrades some catechins slightly, but extracts more polyphenols overall.
  let antioxidant = (whiteRatio * 9.5 + greenRatio * 9.0 + oolongRatio * 7.5 + blackRatio * 6.5 + herbalRatio * 5.5);
  if (waterTempC >= 75 && waterTempC <= 90) antioxidant += 0.5;
  if (steepingTimeSec >= 90) antioxidant += 0.5;
  antioxidant = Math.min(10, Math.max(1, Math.round(antioxidant * 10) / 10));

  // 2. Sustained Focus & Calm Energy (L-Theanine to Caffeine ratio)
  // Green and high-mountain Oolongs have high L-Theanine, promoting alpha brainwaves without jitter.
  let focusEnergy = (greenRatio * 9.2 + oolongRatio * 8.6 + whiteRatio * 7.8 + blackRatio * 6.8 + herbalRatio * 3.5);
  // Sweetness & moderate extraction support smooth absorption
  if (extraction.bitternessScore <= 5.0) focusEnergy += 0.5;
  focusEnergy = Math.min(10, Math.max(1, Math.round(focusEnergy * 10) / 10));

  // 3. Serenity & Stress Relief (Sleep & Nervous System Soothing)
  // High in Chamomile/Herbal, high in L-Theanine Green/White when steeped gently.
  let serenity = (herbalRatio * 9.5 + whiteRatio * 8.0 + oolongRatio * 6.5 + greenRatio * 5.0 + blackRatio * 2.5);
  if (waterTempC <= 85) serenity += 0.5;
  if (extraction.bitternessScore <= 4.0) serenity += 0.5;
  serenity = Math.min(10, Math.max(1, Math.round(serenity * 10) / 10));

  // 4. Digestive Harmony (Gut motility & Warm stomach comfort)
  // Black tea, oxidized Oolong, Ginger/Peppermint herbal teas excel here.
  let digestion = (blackRatio * 9.0 + oolongRatio * 8.5 + herbalRatio * 8.0 + greenRatio * 5.0 + whiteRatio * 4.5);
  if (waterTempC >= 85) digestion += 0.5; // warm brews stimulate gastric enzymes
  digestion = Math.min(10, Math.max(1, Math.round(digestion * 10) / 10));

  // 5. Cellular Hydration & Metabolic Clarity
  // Light body, high clarity, low astringency/tannin.
  let hydration = (whiteRatio * 9.2 + herbalRatio * 8.8 + greenRatio * 7.5 + oolongRatio * 6.8 + blackRatio * 5.0);
  if (extraction.clarityScore >= 6.5) hydration += 0.6;
  if (extraction.bitternessScore <= 4.0) hydration += 0.4;
  hydration = Math.min(10, Math.max(1, Math.round(hydration * 10) / 10));

  // Caffeine level determination
  const caffeinatedRatio = 1.0 - herbalRatio;
  let caffeineLevel: "NONE" | "LOW" | "MODERATE" | "HIGH" = "LOW";
  let caffeineDescEn = "";
  let caffeineDescTh = "";

  if (caffeinatedRatio < 0.1) {
    caffeineLevel = "NONE";
    caffeineDescEn = "Caffeine-Free (0mg) — Perfect anytime, gentle on sleep";
    caffeineDescTh = "ปราศจากคาเฟอีน (0 มก.) — ดื่มได้ตลอดวัน ไม่รบกวนการนอน";
  } else if (caffeinatedRatio < 0.4 || (whiteRatio > 0.6 && waterTempC < 85)) {
    caffeineLevel = "LOW";
    caffeineDescEn = "Mild Lift (15–25mg) — Gentle wakefulness without heart flutter";
    caffeineDescTh = "เบาสบาย (15–25 มก.) — ปลุกความสดชื่นอย่างนุ่มนวล ไม่ใจสั่น";
  } else if (blackRatio > 0.6 && steepingTimeSec >= 150) {
    caffeineLevel = "HIGH";
    caffeineDescEn = "Robust Wakefulness (45–65mg) — Invigorating morning clarity";
    caffeineDescTh = "ตื่นเต็มตา (45–65 มก.) — กระตุ้นพลังยามเช้าทดแทนกาแฟได้ดีเยี่ยม";
  } else {
    caffeineLevel = "MODERATE";
    caffeineDescEn = "Balanced Energy (25–40mg) — Sustained focus with smooth decline";
    caffeineDescTh = "สมดุลพอเหมาะ (25–40 มก.) — เสริมสมาธิยาวนาน ผ่อนคลายไม่ดิ่ง";
  }

  // Functional tags
  const functionalTags: { labelEn: string; labelTh: string; color: string }[] = [];
  if (antioxidant >= 8.0) {
    functionalTags.push({
      labelEn: "EGCG & Polyphenol Rich",
      labelTh: "อุดมสารต้านอนุมูลอิสระ EGCG",
      color: "bg-emerald-100 text-emerald-800 border-emerald-300",
    });
  }
  if (focusEnergy >= 7.5 && caffeineLevel !== "NONE") {
    functionalTags.push({
      labelEn: "Alpha-Wave Focus (L-Theanine)",
      labelTh: "เสริมสมาธิคลื่นสมองอัลฟา",
      color: "bg-teal-100 text-teal-800 border-teal-300",
    });
  }
  if (serenity >= 7.5) {
    functionalTags.push({
      labelEn: "Stress Relief & Zen Calm",
      labelTh: "คลายความเครียด ปลอบประโลมจิตใจ",
      color: "bg-indigo-100 text-indigo-800 border-indigo-300",
    });
  }
  if (digestion >= 7.5) {
    functionalTags.push({
      labelEn: "Post-Meal Digestive Aid",
      labelTh: "ช่วยย่อยหลังมื้ออาหาร",
      color: "bg-amber-100 text-amber-800 border-amber-300",
    });
  }
  if (hydration >= 7.8) {
    functionalTags.push({
      labelEn: "Detox & Gentle Hydration",
      labelTh: "คืนความสดชื่นชุ่มชื้นแก่เซลล์",
      color: "bg-sky-100 text-sky-800 border-sky-300",
    });
  }

  // Dimensions
  const dimensions: WellnessDimension[] = [
    {
      id: "antioxidant",
      nameEn: "Antioxidant Vitality",
      nameTh: "พลังต้านอนุมูลอิสระ (EGCG)",
      icon: "🛡️",
      score: antioxidant,
      color: "#059669",
      summaryEn: "Shields cells from oxidative stress and revitalizes tissue radiance.",
      summaryTh: "ปกป้องเซลล์จากสารอนุมูลอิสระ คืนความสดใสและชะลอวัย",
    },
    {
      id: "focus",
      nameEn: "Sustained Mental Focus",
      nameTh: "สมาธิและการตื่นตัวอย่างสงบ",
      icon: "⚡",
      score: focusEnergy,
      color: "#0d9488",
      summaryEn: "L-Theanine synergy promotes sharp cognitive clarity without jitters.",
      summaryTh: "แอล-ธีอะนีนช่วยเสริมสมาธิการทำงานโดยไม่ทำให้ใจสั่น",
    },
    {
      id: "serenity",
      nameEn: "Serenity & Relax",
      nameTh: "ความผ่อนคลายและลดความตึงเครียด",
      icon: "🧘",
      score: serenity,
      color: "#6366f1",
      summaryEn: "Calms the autonomic nervous system and gently unwinds tension.",
      summaryTh: "ปรับสมดุลระบบประสาท คลายความเหนื่อยล้าในสมอง",
    },
    {
      id: "digestion",
      nameEn: "Digestive Balance",
      nameTh: "ปรับสมดุลระบบย่อยอาหาร",
      icon: "🍃",
      score: digestion,
      color: "#d97706",
      summaryEn: "Warming polyphenols support gut flora and post-meal comfort.",
      summaryTh: "สารแทนนินและโพลีฟีนอลอุ่นช่วยกระตุ้นการย่อยอาหาร",
    },
    {
      id: "hydration",
      nameEn: "Cellular Hydration",
      nameTh: "ความชุ่มชื้นและขับของเสีย",
      icon: "💧",
      score: hydration,
      color: "#0284c7",
      summaryEn: "High-clarity extraction delivers smooth, bioavailable micro-hydration.",
      summaryTh: "ความฝาดต่ำส่งเสริมการดูดซึมน้ำและคืนความสมดุลให้ร่างกาย",
    },
  ];

  // Best time to drink & quote
  let bestTimeToDrinkEn = "Throughout the day";
  let bestTimeToDrinkTh = "ดื่มได้ตลอดวัน";
  let primaryBenefitEn = "";
  let primaryBenefitTh = "";
  let wellnessQuoteEn = "";
  let wellnessQuoteTh = "";

  if (caffeineLevel === "NONE" || serenity >= 8.0) {
    bestTimeToDrinkEn = "Evening / 1 Hour Before Bedtime";
    bestTimeToDrinkTh = "ช่วงค่ำ หรือ 1 ชั่วโมงก่อนเข้านอน";
    primaryBenefitEn = "Deep Restorative Serenity";
    primaryBenefitTh = "ฟื้นฟูร่างกายและส่งเสริมการหลับลึก";
    wellnessQuoteEn = "A gentle lullaby in a teacup, soothing the mind into peaceful stillness.";
    wellnessQuoteTh = "ดั่งบทเพลงกล่อมนอนในถ้วยชา ช่วยปลอบประโลมจิตใจสู่ความสงบสุข";
  } else if (caffeineLevel === "HIGH" || (focusEnergy >= 8.0 && blackRatio > 0.5)) {
    bestTimeToDrinkEn = "Morning / Sunrise Kickstart";
    bestTimeToDrinkTh = "ช่วงเช้าหลังตื่นนอน หรือเริ่มต้นวันใหม่";
    primaryBenefitEn = "Energizing Awakening & Metabolic Lift";
    primaryBenefitTh = "ปลุกความกระปรี้กระเปร่าและกระตุ้นการเผาผลาญ";
    wellnessQuoteEn = "Ignites morning clarity and sets an invigorated rhythm for your endeavors.";
    wellnessQuoteTh = "จุดประกายพลังงานยามเช้า เติมไฟให้คุณพร้อมลุยทุกภารกิจ";
  } else if (digestion >= 8.0) {
    bestTimeToDrinkEn = "30–45 Mins After Meals";
    bestTimeToDrinkTh = "30–45 นาทีหลังมื้ออาหาร";
    primaryBenefitEn = "Harmonious Digestive Comfort";
    primaryBenefitTh = "ย่อยอาหารสบายท้อง สดชื่นเบากาย";
    wellnessQuoteEn = "Gently settles the stomach with warm botanical warmth and balance.";
    wellnessQuoteTh = "ปรับสมดุลลำไส้ด้วยสัมผัสอุ่นละมุน คืนความสบายตัวหลังมื้ออร่อย";
  } else {
    bestTimeToDrinkEn = "Mid-Afternoon (2:00 PM – 4:00 PM)";
    bestTimeToDrinkTh = "ช่วงบ่าย (14:00 - 16:00 น.)";
    primaryBenefitEn = "Afternoon Flow State & Focus";
    primaryBenefitTh = "สมาธิไหลลื่นยามบ่าย ขจัดความง่วงซึม";
    wellnessQuoteEn = "The perfect companion for creative contemplation and sustained focus.";
    wellnessQuoteTh = "เพื่อนคู่ใจในชั่วโมงสร้างสรรค์ ช่วยให้ความคิดแจ่มใสไร้ความเหนื่อยล้า";
  }

  const overallScore = Math.round(((antioxidant + focusEnergy + serenity + digestion + hydration) / 5) * 10) / 10;

  return {
    dimensions,
    overallScore,
    primaryBenefitEn,
    primaryBenefitTh,
    wellnessQuoteEn,
    wellnessQuoteTh,
    functionalTags,
    caffeineLevel,
    caffeineDescEn,
    caffeineDescTh,
    bestTimeToDrinkEn,
    bestTimeToDrinkTh,
  };
}

function getEmptyWellnessAnalysis(): WellnessAnalysis {
  return {
    dimensions: [],
    overallScore: 0,
    primaryBenefitEn: "No blend selected",
    primaryBenefitTh: "ยังไม่ได้เลือกสัดส่วนใบชา",
    wellnessQuoteEn: "Select tea leaves to calculate functional wellness attributes.",
    wellnessQuoteTh: "เลือกใบชาเพื่อคำนวณสรรพคุณทางสุขภาพ",
    functionalTags: [],
    caffeineLevel: "NONE",
    caffeineDescEn: "-",
    caffeineDescTh: "-",
    bestTimeToDrinkEn: "-",
    bestTimeToDrinkTh: "-",
  };
}
