import { CustomerProfile, RitualProgressScores, CafeCustomerState, ShopItem } from "@/types/cafe";
import { ExtractionResult } from "@/types/tea";

export interface EvaluationResult {
  stars: number;             // 1, 2, or 3
  totalScorePercent: number; // 0 - 100
  flavorScore: number;       // 0 - 100
  techniqueScore: number;    // 0 - 100
  feedbackText: string;
  feedbackTextTh: string;
  coinsEarned: number;
  unlockedNewPolaroid: boolean;
}

export function evaluateCafeBrew(
  customer: CustomerProfile,
  extraction: ExtractionResult | null,
  scores: RitualProgressScores
): EvaluationResult {
  if (!extraction) {
    return {
      stars: 1,
      totalScorePercent: 40,
      flavorScore: 40,
      techniqueScore: 40,
      feedbackText: "The cup feels a bit light, but thank you for your warmth!",
      feedbackTextTh: "รสชาติอาจจะยังเบาไปนิด แต่ขอบคุณสำหรับความอบอุ่นนะจ๊ะ!",
      coinsEarned: 15,
      unlockedNewPolaroid: false,
    };
  }

  // 1. Calculate Flavor Match (50% weight)
  const t = customer.targetRadar;
  const sweetDiff = Math.abs(extraction.sweetnessScore - t.sweetness);
  const aromaDiff = Math.abs(extraction.aromaScore - t.aroma);
  const bodyDiff = Math.abs(extraction.bodyScore - t.body);
  const bitterDiff = Math.abs(extraction.bitternessScore - t.bitterness);
  const clarityDiff = Math.abs(extraction.clarityScore - t.clarity);

  const totalDiff = sweetDiff + aromaDiff + bodyDiff + bitterDiff + clarityDiff; // max ~ 30-40
  const flavorScore = Math.max(30, Math.round(100 - (totalDiff / 25) * 60));

  // 2. Calculate Technique Score (50% weight)
  const validScores = [
    scores.tempScore,
    scores.rinseScore,
    scores.spiralScore,
    scores.steepScore,
    scores.decantScore,
    scores.branchScore,
    scores.garnishScore,
  ].filter((s) => s > 0);

  const techniqueScore = validScores.length
    ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length)
    : 75;

  const totalScorePercent = Math.round(flavorScore * 0.5 + techniqueScore * 0.5);

  let stars = 1;
  let coinsEarned = 25;
  let feedbackText = "";
  let feedbackTextTh = "";

  if (totalScorePercent >= 84) {
    stars = 3;
    coinsEarned = 100;
    feedbackText = `Incredible mastery! "${extraction.cozyTitle}" captures every nuance of my dream cup!`;
    feedbackTextTh = `ยอดเยี่ยมที่สุด! ชา "${extraction.cozyTitle}" นี้ตรงใจและดึงรสชาติออกมาได้อย่างสมบูรณ์แบบ!`;
  } else if (totalScorePercent >= 68) {
    stars = 2;
    coinsEarned = 55;
    feedbackText = `A very lovely brew! The aromas shine brightly, just a touch more balance next time.`;
    feedbackTextTh = `ชงได้อร่อยมากเลยจ้ะ! กลิ่นหอมฟุ้งถูกใจ คราวหน้าปรับสมดุลอีกนิดจะเพอร์เฟกต์เลย!`;
  } else {
    stars = 1;
    coinsEarned = 30;
    feedbackText = `Thank you for the warm cup! A peaceful attempt on our journey of tea.`;
    feedbackTextTh = `ขอบคุณสำหรับชาอุ่นๆ แก้วนี้นะ ถือเป็นก้าวแรกที่สงบสุขในการฝึกฝนชงชา!`;
  }

  return {
    stars,
    totalScorePercent,
    flavorScore,
    techniqueScore,
    feedbackText,
    feedbackTextTh,
    coinsEarned,
    unlockedNewPolaroid: stars === 3,
  };
}

// LocalStorage Persistence Helpers
const STORAGE_KEY_COINS = "kissa_cafe_coins";
const STORAGE_KEY_CUSTOMERS = "kissa_cafe_customers";
const STORAGE_KEY_UNLOCKED_ITEMS = "kissa_cafe_unlocked_items";

export function getSavedCoins(): number {
  if (typeof window === "undefined") return 150;
  const saved = localStorage.getItem(STORAGE_KEY_COINS);
  return saved ? parseInt(saved, 10) : 150;
}

export function saveCoins(coins: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY_COINS, coins.toString());
}

export function getSavedCustomerStates(): Record<string, CafeCustomerState> {
  if (typeof window === "undefined") return {};
  try {
    const saved = localStorage.getItem(STORAGE_KEY_CUSTOMERS);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

export function updateCustomerState(
  customerId: string,
  stars: number,
  score: number
): void {
  if (typeof window === "undefined") return;
  const current = getSavedCustomerStates();
  const prev = current[customerId] || {
    customerId,
    starsEarned: 0,
    timesServed: 0,
    unlockedPolaroid: false,
    bestScore: 0,
  };

  current[customerId] = {
    customerId,
    starsEarned: Math.max(prev.starsEarned, stars),
    timesServed: prev.timesServed + 1,
    unlockedPolaroid: prev.unlockedPolaroid || stars === 3,
    bestScore: Math.max(prev.bestScore, score),
  };

  localStorage.setItem(STORAGE_KEY_CUSTOMERS, JSON.stringify(current));
}

export function getUnlockedItemIds(): string[] {
  if (typeof window === "undefined") return ["glass", "mug", "ceramic"];
  try {
    const saved = localStorage.getItem(STORAGE_KEY_UNLOCKED_ITEMS);
    return saved ? JSON.parse(saved) : ["glass", "mug", "ceramic"];
  } catch {
    return ["glass", "mug", "ceramic"];
  }
}

export function unlockShopItem(itemId: string): void {
  if (typeof window === "undefined") return;
  const items = getUnlockedItemIds();
  if (!items.includes(itemId)) {
    items.push(itemId);
    localStorage.setItem(STORAGE_KEY_UNLOCKED_ITEMS, JSON.stringify(items));
  }
}

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: "kyusu",
    category: "teapot",
    name: "Tokoname Kyusu",
    nameTh: "กาญี่ปุ่นมีด้ามจับโทโกนาเมะ",
    priceCoins: 120,
    icon: "🍵",
    desc: "Japanese side-handled clay teapot. Clay filter yields silkier green tea.",
    descTh: "กาชงชาด้ามข้างสไตล์ญี่ปุ่น กรองชาเขียวได้นุ่มละเอียด",
  },
  {
    id: "zisha",
    category: "teapot",
    name: "Yixing Purple Clay Pot",
    nameTh: "กาดินม่วงอี๋ซิงโบราณ",
    priceCoins: 200,
    icon: "🏺",
    desc: "Aged purple clay pot that seasons with every brew, deepening oolong body.",
    descTh: "กาดินม่วงโบราณที่ยิ่งชงยิ่งหอม บ่มรสชาติชาอู่หลงและผู่เอ๋อร์ให้เข้มลึก",
  },
  {
    id: "porcelain",
    category: "teapot",
    name: "Hakuji White Porcelain Pot",
    nameTh: "กาน้ำชาพอร์ซเลนสีขาวนวล",
    priceCoins: 160,
    icon: "🫖",
    desc: "Pure imperial porcelain reflecting true floral notes without distortion.",
    descTh: "เนื้อพอร์ซเลนเคลือบขาว สะท้อนกลิ่นหอมของชาดอกไม้ได้อย่างแท้จริง",
  },
  {
    id: "chawan",
    category: "cup",
    name: "Ceremonial Chawan Bowl",
    nameTh: "ถ้วยดินเผาชามัทฉะ (Chawan)",
    priceCoins: 100,
    icon: "🥣",
    desc: "Rustic handcrafted bowl designed for appreciating whisked tea froth.",
    descTh: "ชามดินเผาสไตล์วาบิซาบิ เหมาะสำหรับการตีและจิบชามัทฉะ",
  },
  {
    id: "gaiwan",
    category: "cup",
    name: "Gongfu Lidded Gaiwan",
    nameTh: "ถ้วยฝาปิดก้ายหว่าน (Gaiwan)",
    priceCoins: 110,
    icon: "☕",
    desc: "Traditional three-piece vessel (lid, bowl, saucer) for high-mountain aroma.",
    descTh: "ถ้วยมีฝาปิด 3 ชิ้นสำหรับดมกลิ่นและรินชากังฟู",
  },
];
