import type { BlendInput, BrewParams, ExtractionResult } from "@/types/tea";

// === Helpers ===
function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return (
    "#" +
    clamp(r).toString(16).padStart(2, "0") +
    clamp(g).toString(16).padStart(2, "0") +
    clamp(b).toString(16).padStart(2, "0")
  );
}

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

function clampScore(v: number): number {
  return round2(Math.max(1, Math.min(10, v)));
}

// === Cozy Title Generator ===
function generateCozyTitle(scores: {
  sweetness: number;
  aroma: number;
  body: number;
  bitterness: number;
  clarity: number;
}): string {
  const { sweetness, aroma, body, bitterness, clarity } = scores;
  const entries: [string, number][] = [
    ["sweetness", sweetness],
    ["aroma", aroma],
    ["body", body],
    ["bitterness", bitterness],
    ["clarity", clarity],
  ];
  entries.sort((a, b) => b[1] - a[1]);
  const [primary, secondary] = [entries[0][0], entries[1][0]];

  const titles: Record<string, Record<string, string>> = {
    sweetness: {
      aroma: "Honey Blossom Dream",
      body: "Velvet Caramel Embrace",
      bitterness: "Bittersweet Sunset",
      clarity: "Crystal Honey Dew",
      sweetness: "Golden Nectar Bliss",
    },
    aroma: {
      sweetness: "Fragrant Meadow Whisper",
      body: "Aromatic Fireside",
      bitterness: "Smoky Garden Path",
      clarity: "Morning Mist Bouquet",
      aroma: "Blooming Cloud",
    },
    body: {
      sweetness: "Warm Maple Hearth",
      aroma: "Rich Forest Floor",
      bitterness: "Bold Oak Barrel",
      clarity: "Midnight Silk",
      body: "Deep Earth Comfort",
    },
    bitterness: {
      sweetness: "Dark Chocolate Rain",
      aroma: "Roasted Twilight",
      body: "Storm Brew Awakening",
      clarity: "Sharp Morning Frost",
      bitterness: "Double Bold Thunder",
    },
    clarity: {
      sweetness: "Spring Water Kiss",
      aroma: "Dewdrop Serenade",
      body: "Serene River Stone",
      bitterness: "Zen Garden Clarity",
      clarity: "Pure Mountain Stream",
    },
  };

  return titles[primary]?.[secondary] ?? "Artisan's Mystery Blend";
}

// === Tasting Notes Generator ===
function generateTastingNotes(scores: {
  sweetness: number;
  aroma: number;
  body: number;
  bitterness: number;
  clarity: number;
  extractionFactor: number;
}): string {
  const notes: string[] = [];

  // Sweetness notes
  if (scores.sweetness >= 7) notes.push("Luscious honey and dried fruit sweetness");
  else if (scores.sweetness >= 4) notes.push("Gentle natural sweetness");
  else notes.push("Dry and crisp finish");

  // Aroma notes
  if (scores.aroma >= 7) notes.push("with captivating floral and herbal bouquet");
  else if (scores.aroma >= 4) notes.push("with pleasant aromatic undertones");
  else notes.push("with subtle, quiet fragrance");

  // Body notes
  if (scores.body >= 7) notes.push("Full-bodied and rich on the palate");
  else if (scores.body >= 4) notes.push("Medium-bodied with smooth texture");
  else notes.push("Light and delicate mouthfeel");

  // Bitterness notes
  if (scores.bitterness >= 7) notes.push("Bold tannic bite with lingering depth");
  else if (scores.bitterness >= 4) notes.push("Balanced astringency");
  else notes.push("Almost no bitterness, very approachable");

  // Clarity notes
  if (scores.clarity >= 7) notes.push("Crystal-clear liquor with bright character");
  else if (scores.clarity >= 4) notes.push("Clear cup with good definition");
  else notes.push("Deep, opaque brew with complex layers");

  // Extraction note
  if (scores.extractionFactor > 0.7) notes.push("Fully extracted — bold and intense");
  else if (scores.extractionFactor > 0.4) notes.push("Well-extracted — balanced and harmonious");
  else notes.push("Lightly extracted — gentle and nuanced");

  return notes.join(". ") + ".";
}

// === Default (empty) result ===
function defaultResult(): ExtractionResult {
  return {
    renderedHex: "#F5E6D3",
    opacity: 0.1,
    sweetnessScore: 5,
    aromaScore: 5,
    bodyScore: 1,
    bitternessScore: 1,
    clarityScore: 10,
    cozyTitle: "Empty Cup Meditation",
    tastingNotes: "A quiet moment with warm water. Add some tea leaves to begin your journey.",
  };
}

// === Main Extraction Function ===
export function calculateExtraction(
  blendInputs: BlendInput[],
  params: BrewParams
): ExtractionResult {
  // Filter out zero-ratio ingredients
  const activeBlends = blendInputs.filter((b) => b.ratioPercent > 0);
  if (activeBlends.length === 0) return defaultResult();

  // 1. Extraction Factor (0–1)
  const tempNorm = Math.max(0, Math.min(1, (params.waterTempC - 60) / 40));
  const timeNorm = Math.max(0, Math.min(1, (params.steepingTimeSec - 30) / 270));
  const extractionFactor = tempNorm * 0.6 + timeNorm * 0.4;

  // 2. Normalize ratios to sum to 1
  const totalRatio = activeBlends.reduce((s, b) => s + b.ratioPercent, 0);
  const weighted = activeBlends.map((b) => ({
    ...b,
    weight: b.ratioPercent / totalRatio,
  }));

  // 3. Dynamic Color Blending
  let rSum = 0, gSum = 0, bSum = 0;
  for (const item of weighted) {
    const [r, g, b] = hexToRgb(item.ingredient.baseColor);
    rSum += r * item.weight;
    gSum += g * item.weight;
    bSum += b * item.weight;
  }

  // Darken based on extraction (higher extraction = darker)
  const darkenFactor = 1 - extractionFactor * 0.35;
  rSum *= darkenFactor;
  gSum *= darkenFactor;
  bSum *= darkenFactor;

  const renderedHex = rgbToHex(rSum, gSum, bSum);
  const opacity = round2(0.25 + extractionFactor * 0.65);

  // 4. Weighted base scores from ingredients
  const wTannin = weighted.reduce((s, i) => s + i.ingredient.tanninScore * i.weight, 0);
  const wAroma = weighted.reduce((s, i) => s + i.ingredient.aromaScore * i.weight, 0);
  const wBody = weighted.reduce((s, i) => s + i.ingredient.bodyScore * i.weight, 0);

  // 5. Flavor Scores (1–10)
  const bitterness = clampScore(wTannin * extractionFactor * 1.6);
  const sweetness = clampScore(10 - bitterness * 0.7 + (1 - extractionFactor) * 1.5);
  const aroma = clampScore(wAroma * (0.6 + extractionFactor * 0.55));
  const body = clampScore(wBody * (0.4 + extractionFactor * 0.75));
  const clarity = clampScore(
    10 - body * 0.4 - (extractionFactor > 0.8 ? 2.5 : extractionFactor > 0.5 ? 1 : 0)
  );

  // 6. Generate cozy title & tasting notes
  const scores = { sweetness, aroma, body, bitterness, clarity };
  const cozyTitle = generateCozyTitle(scores);
  const tastingNotes = generateTastingNotes({ ...scores, extractionFactor });

  return {
    renderedHex,
    opacity,
    sweetnessScore: sweetness,
    aromaScore: aroma,
    bodyScore: body,
    bitternessScore: bitterness,
    clarityScore: clarity,
    cozyTitle,
    tastingNotes,
  };
}
