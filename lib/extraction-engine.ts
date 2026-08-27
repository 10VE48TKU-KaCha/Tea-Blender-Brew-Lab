import type { BlendInput, BrewParams, ExtractionResult, TeaCategory } from "@/types/tea";

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

// === Procedural Naming Engine (8,000+ Combinations) ===
const PREFIXES = [
  "Midnight", "Morning Dew", "Velvet", "Twilight", "Whispering",
  "Golden", "Autumn", "Serene", "Imperial", "Cloud",
  "Mystic", "Solar", "Mountain", "Celestial", "Wild",
  "Highland", "Silver", "Hearth", "Forest", "Ember"
];

const CORE_NOTES: Record<string, string[]> = {
  sweetness: ["Honey", "Caramel", "Peach", "Nectar", "Vanilla", "Maple"],
  aroma: ["Orchid", "Jasmine", "Bergamot", "Lavender", "Blossom", "Lotus"],
  body: ["Malty", "Roasted", "Cedar", "Chestnut", "Cocoa", "Oak"],
  bitterness: ["Dark Pine", "Smoke", "Espresso", "Brisk Bark", "Mineral"],
  clarity: ["Dewdrop", "Spring", "Alpine", "Crystal", "Meadow"],
};

const SUFFIXES = [
  "Nectar", "Melody", "Dream", "Embrace", "Symphony",
  "Reverie", "Breeze", "Haven", "Elixir", "Serenade",
  "Horizon", "Solitude", "Whisper", "Radiance", "Mirage",
  "Lullaby", "Awakening", "Cascade", "Harmony", "Anthem"
];

/**
 * Procedurally generates an artisan title from over 8,000 combinations
 * based on the primary & secondary sensory dimensions and ingredient weights.
 */
function generateProceduralTitle(
  scores: { sweetness: number; aroma: number; body: number; bitterness: number; clarity: number },
  hashSeed: number
): string {
  const entries: [string, number][] = [
    ["sweetness", scores.sweetness],
    ["aroma", scores.aroma],
    ["body", scores.body],
    ["bitterness", scores.bitterness],
    ["clarity", scores.clarity],
  ];
  entries.sort((a, b) => b[1] - a[1]);
  const primaryDim = entries[0][0];

  const prefixIdx = Math.abs(hashSeed) % PREFIXES.length;
  const prefix = PREFIXES[prefixIdx];

  const notesList = CORE_NOTES[primaryDim] || CORE_NOTES.aroma;
  const noteIdx = Math.abs(Math.floor(hashSeed / 7)) % notesList.length;
  const coreNote = notesList[noteIdx];

  const suffixIdx = Math.abs(Math.floor(hashSeed / 31)) % SUFFIXES.length;
  const suffix = SUFFIXES[suffixIdx];

  return `${prefix} ${coreNote} ${suffix}`;
}

/**
 * Generates a unique deterministic Blend Discovery Code (e.g. #KISSA-4821)
 */
function generateBlendCode(blendInputs: BlendInput[], params: BrewParams): string {
  let hash = 5381;
  for (const b of blendInputs) {
    if (b.ratioPercent > 0) {
      for (let i = 0; i < b.ingredient.name.length; i++) {
        hash = ((hash << 5) + hash) + b.ingredient.name.charCodeAt(i);
      }
      hash += Math.round(b.ratioPercent * 100);
    }
  }
  hash += params.waterTempC * 17 + params.steepingTimeSec * 13;
  const codeNum = Math.abs(hash % 9000) + 1000;
  return `#KISSA-${codeNum}`;
}

/**
 * Extracts origin countries from ingredient names (e.g., 🇯🇵 Japan, 🇹🇼 Taiwan)
 */
function extractOrigins(blendInputs: BlendInput[]): string[] {
  const flags: Record<string, string> = {
    "🇯🇵": "Japan",
    "🇨🇳": "China",
    "🇹🇼": "Taiwan",
    "🇮🇳": "India",
    "🇱🇰": "Sri Lanka",
    "🇬🇧": "United Kingdom",
    "🇫🇷": "France",
    "🇩🇪": "Germany",
    "🇪🇬": "Egypt",
    "🇿🇦": "South Africa",
    "🇦🇷": "Argentina",
  };

  const countries = new Set<string>();
  for (const b of blendInputs) {
    if (b.ratioPercent > 0) {
      for (const [flag, country] of Object.entries(flags)) {
        if (b.ingredient.name.includes(flag)) {
          countries.add(`${flag} ${country}`);
        }
      }
    }
  }
  return Array.from(countries);
}

// === Tasting Notes Generator ===
function generateTastingNotes(scores: {
  sweetness: number;
  aroma: number;
  body: number;
  bitterness: number;
  clarity: number;
  extractionFactor: number;
  dominantCategory?: TeaCategory;
}): string {
  const notes: string[] = [];

  // Sweetness notes
  if (scores.sweetness >= 7.5) notes.push("Rich wildflower honey and succulent dried stone fruit sweetness");
  else if (scores.sweetness >= 4.5) notes.push("Gentle natural sweetness with subtle caramel undertones");
  else notes.push("Dry, crisp and refreshing palate");

  // Aroma notes
  if (scores.aroma >= 7.5) notes.push("exquisite bouquet of blooming florals and fragrant botanicals");
  else if (scores.aroma >= 4.5) notes.push("balanced aromatic wafts of toasted nuts and herbs");
  else notes.push("quiet, subtle warmth");

  // Body notes
  if (scores.body >= 7.5) notes.push("Full-bodied, velvety mouthfeel lingering pleasantly");
  else if (scores.body >= 4.5) notes.push("Medium-bodied with silky smooth texture");
  else notes.push("Light, clean and delicate cup");

  // Bitterness notes
  if (scores.bitterness >= 7.5) notes.push("bold tannic resonance providing deep backbone");
  else if (scores.bitterness >= 4.5) notes.push("pleasant tea astringency that stimulates the palate");
  else notes.push("silky smooth finish with virtually zero bitterness");

  return notes.join(", ") + ".";
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
    blendCode: "#KISSA-0000",
    cupGlaze: "hakuji",
    turbidity: "clear",
    originCountries: [],
  };
}

// === Main Extraction Function ===
export function calculateExtraction(
  blendInputs: BlendInput[],
  params: BrewParams
): ExtractionResult {
  const activeBlends = blendInputs.filter((b) => b.ratioPercent > 0);
  if (activeBlends.length === 0) return defaultResult();

  // 1. Extraction Factor (0–1)
  const tempNorm = Math.max(0, Math.min(1, (params.waterTempC - 60) / 40));
  const timeNorm = Math.max(0, Math.min(1, (params.steepingTimeSec - 30) / 270));
  const extractionFactor = tempNorm * 0.58 + timeNorm * 0.42;

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

  // Darken based on extraction
  const darkenFactor = 1 - extractionFactor * 0.35;
  rSum *= darkenFactor;
  gSum *= darkenFactor;
  bSum *= darkenFactor;

  const renderedHex = rgbToHex(rSum, gSum, bSum);
  const opacity = round2(0.25 + extractionFactor * 0.65);

  // 4. Weighted base scores
  const wTannin = weighted.reduce((s, i) => s + i.ingredient.tanninScore * i.weight, 0);
  const wAroma = weighted.reduce((s, i) => s + i.ingredient.aromaScore * i.weight, 0);
  const wBody = weighted.reduce((s, i) => s + i.ingredient.bodyScore * i.weight, 0);

  // 5. Flavor Scores (1–10)
  const bitterness = clampScore(wTannin * extractionFactor * 1.5);
  const sweetness = clampScore(10 - bitterness * 0.65 + (1 - extractionFactor) * 1.6);
  const aroma = clampScore(wAroma * (0.6 + extractionFactor * 0.55));
  const body = clampScore(wBody * (0.4 + extractionFactor * 0.75));
  const clarity = clampScore(
    10 - body * 0.38 - (extractionFactor > 0.8 ? 2.5 : extractionFactor > 0.5 ? 1 : 0)
  );

  // 6. Dominant Category & Origin
  const dominantItem = [...weighted].sort((a, b) => b.weight - a.weight)[0];
  const dominantCategory = dominantItem?.ingredient.category || "BLACK";
  const originCountries = extractOrigins(blendInputs);

  // 7. Visual Cup Glaze & Turbidity
  let cupGlaze: "celadon" | "tenmoku" | "hakuji" | "earthenware" = "earthenware";
  let turbidity: "clear" | "cloudy" | "velvet" = "velvet";

  if (dominantCategory === "GREEN") {
    cupGlaze = "celadon";
    turbidity = dominantItem.ingredient.name.includes("Matcha") ? "cloudy" : "velvet";
  } else if (dominantCategory === "BLACK") {
    cupGlaze = "tenmoku";
    turbidity = "velvet";
  } else if (dominantCategory === "WHITE") {
    cupGlaze = "hakuji";
    turbidity = "clear";
  } else if (dominantCategory === "OOLONG") {
    cupGlaze = "hakuji";
    turbidity = "clear";
  }

  // 8. Procedural Unique Blend Code & Title
  const blendCode = generateBlendCode(blendInputs, params);
  const hashSeed = parseInt(blendCode.replace("#KISSA-", ""), 10) || 1234;
  const scores = { sweetness, aroma, body, bitterness, clarity };
  const cozyTitle = generateProceduralTitle(scores, hashSeed);
  const tastingNotes = generateTastingNotes({ ...scores, extractionFactor, dominantCategory });

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
    blendCode,
    cupGlaze,
    turbidity,
    originCountries,
  };
}
