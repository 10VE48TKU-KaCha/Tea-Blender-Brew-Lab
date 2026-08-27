import { BlendInput, BrewParams, ExtractionResult } from "@/types/tea";

export interface SommelierAdvice {
  level: "good" | "tip" | "warning";
  title: string;
  message: string;
}

export interface FoodPairing {
  name: string;
  emoji: string;
  category: string;
  reason: string;
}

/**
 * Analyzes brew parameters against blend ingredients to provide expert Sommelier insights.
 */
export function getSommelierAdvices(
  blendInputs: BlendInput[],
  params: BrewParams,
  extraction: ExtractionResult
): SommelierAdvice[] {
  const advices: SommelierAdvice[] = [];
  const activeBlends = blendInputs.filter((b) => b.ratioPercent > 0);

  if (activeBlends.length === 0) return advices;

  // Dominant tea category
  const dominantBlend = [...activeBlends].sort(
    (a, b) => b.ratioPercent - a.ratioPercent
  )[0];
  const dominantCategory = dominantBlend?.ingredient.category;

  // 1. Green Tea Temperature Sensitivity
  const greenTeaPresent = activeBlends.some(
    (b) => b.ingredient.category === "GREEN"
  );
  if (greenTeaPresent && params.waterTempC > 82) {
    advices.push({
      level: "warning",
      title: "Green Tea Temperature Warning",
      message: `At ${params.waterTempC}°C, tender green tea catechins overheat, releasing astringent tannins. Try dropping to 70–80°C to preserve natural sweet Umami.`,
    });
  } else if (greenTeaPresent && params.waterTempC <= 78) {
    advices.push({
      level: "good",
      title: "Gentle Green Steep",
      message: `Optimal ${params.waterTempC}°C temperature preserves delicate L-theanine and fresh grassy sweetness.`,
    });
  }

  // 2. Black Tea Extraction Heat
  const blackTeaPresent = activeBlends.some(
    (b) => b.ingredient.category === "BLACK"
  );
  if (blackTeaPresent && params.waterTempC < 85) {
    advices.push({
      level: "tip",
      title: "Assam Needs More Heat",
      message: `Full-bodied black teas thrive around 90–95°C to dissolve heavy polyphenols and malty aromas.`,
    });
  }

  // 3. Steeping Time Guidelines
  if (params.steepingTimeSec > 210 && extraction.bitternessScore >= 7) {
    advices.push({
      level: "warning",
      title: "Potential Over-Extraction",
      message: `Steeping for ${(params.steepingTimeSec / 60).toFixed(1)} mins has driven bitterness to ${extraction.bitternessScore.toFixed(1)}/10. Consider shortening to 120s.`,
    });
  } else if (params.steepingTimeSec < 60 && extraction.bodyScore < 3.5) {
    advices.push({
      level: "tip",
      title: "Quick Infusion Note",
      message: "Fast steeping preserves clear floral high notes, but yields a lighter, more delicate body.",
    });
  }

  // 4. Herbal & Floral Notes
  const herbalPresent = activeBlends.some(
    (b) => b.ingredient.category === "HERBAL"
  );
  if (herbalPresent && params.waterTempC >= 90) {
    advices.push({
      level: "good",
      title: "Herbal Essential Oils",
      message: "High temperature effectively releases soothing botanical oils from chamomile flowers.",
    });
  }

  // Fallback praise if everything is nicely balanced
  if (advices.length === 0) {
    advices.push({
      level: "good",
      title: "Harmonious Brew Balance",
      message: `This blend strikes an elegant balance with ${extraction.sweetnessScore.toFixed(1)} sweetness and ${extraction.aromaScore.toFixed(1)} aroma score.`,
    });
  }

  return advices;
}

/**
 * Recommends curated pastries and delicacies pairing with the tea's flavor radar profile.
 */
export function getFoodPairings(extraction: ExtractionResult): FoodPairing[] {
  const pairings: FoodPairing[] = [];

  // Heavy Body & Tannic Bitterness -> Rich buttery or chocolate treats
  if (extraction.bodyScore >= 6.5 || extraction.bitternessScore >= 6.5) {
    pairings.push({
      name: "Devonshire Cream Scones",
      emoji: "🧈",
      category: "British Classic",
      reason: "Rich clotted cream and berry jam slice through robust tannins cleanly.",
    });
    pairings.push({
      name: "70% Dark Chocolate Tart",
      emoji: "🍫",
      category: "Rich Confection",
      reason: "Malty cocoa depth complements bold body without competing.",
    });
  }

  // High Floral Aroma & Sweetness -> Light delicate fruity patisseries
  if (extraction.aromaScore >= 6 || extraction.sweetnessScore >= 6) {
    pairings.push({
      name: "White Peach Macaron",
      emoji: "🍑",
      category: "French Pâtisserie",
      reason: "Almond meringue and fragrant fruit elevate blooming floral notes.",
    });
    pairings.push({
      name: "Lemon & Thyme Madeleine",
      emoji: "🍋",
      category: "Light Pastry",
      reason: "Citrus brightness harmonizes with gentle natural sweetness.",
    });
  }

  // High Clarity & Fresh Green -> Zen Japanese wagashi or chiffon
  if (extraction.clarityScore >= 6 || extraction.sweetnessScore > 5) {
    pairings.push({
      name: "Matcha Warabi Mochi",
      emoji: "🍵",
      category: "Japanese Wagashi",
      reason: "Soft silky texture and roasted soybean powder highlight clean tea notes.",
    });
    pairings.push({
      name: "Earl Grey Fluffy Chiffon",
      emoji: "🍰",
      category: "Chiffon Cake",
      reason: "Feather-light sponge cake creates a serene, comforting afternoon ritual.",
    });
  }

  // Fallback guarantee 2 items
  if (pairings.length < 2) {
    pairings.push({
      name: "Vanilla Bean Shortbread",
      emoji: "🍪",
      category: "Artisan Cookie",
      reason: "Crumbly buttery sweetness pairs effortlessly with any artisanal brew.",
    });
    pairings.push({
      name: "Caramelized Almond Financier",
      emoji: "🧁",
      category: "French Tea Cake",
      reason: "Nutty browned butter enhances the tea's warming aroma.",
    });
  }

  return pairings.slice(0, 3);
}
