import { z } from "zod";

// === Enums ===
export const TeaCategoryEnum = z.enum(["BLACK", "GREEN", "OOLONG", "HERBAL", "WHITE"]);
export type TeaCategory = z.infer<typeof TeaCategoryEnum>;

export const TEA_CATEGORY_LABELS: Record<TeaCategory, string> = {
  BLACK: "Black Tea",
  GREEN: "Green Tea",
  OOLONG: "Oolong Tea",
  HERBAL: "Herbal Tea",
  WHITE: "White Tea",
};

export const TEA_CATEGORY_EMOJI: Record<TeaCategory, string> = {
  BLACK: "🫖",
  GREEN: "🍵",
  OOLONG: "🌿",
  HERBAL: "🌼",
  WHITE: "🤍",
};

// === Zod Schemas ===
export const TeaIngredientSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: TeaCategoryEnum,
  baseColor: z.string(),
  bodyScore: z.number().int().min(1).max(10),
  tanninScore: z.number().int().min(1).max(10),
  aromaScore: z.number().int().min(1).max(10),
});
export type TeaIngredient = z.infer<typeof TeaIngredientSchema>;

export const BlendItemSchema = z.object({
  id: z.string(),
  recipeId: z.string(),
  ingredientId: z.string(),
  ratioPercent: z.number().min(0).max(100),
});
export type BlendItem = z.infer<typeof BlendItemSchema>;

export const RecipeSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  waterTempC: z.number().min(60).max(100),
  waterAmountMl: z.number().min(50).max(500),
  steepingTimeSec: z.number().int().min(30).max(300),
  bitternessScore: z.number(),
  aromaScore: z.number(),
  sweetnessScore: z.number(),
  bodyScore: z.number(),
  renderedHex: z.string(),
  createdAt: z.coerce.date(),
});
export type Recipe = z.infer<typeof RecipeSchema>;

// === Extraction Engine Types ===
export interface BlendInput {
  ingredient: TeaIngredient;
  ratioPercent: number;
}

export interface BrewParams {
  waterTempC: number;
  waterAmountMl: number;
  steepingTimeSec: number;
}

// === Vessel, Glaze & Presentation Types ===
export type CupVesselType =
  | "mug"       // Classic Yunomi / Artisan Ceramic Mug
  | "tumbler"   // Fluted Crystal Tumbler / Can Glass (Iced)
  | "latte"     // Wide Cafe Latte Bowl
  | "chawan"    // Japanese Ceremonial Matcha Bowl
  | "gaiwan"    // Chinese Gongfu Gaiwan (Lidded bowl)
  | "goblet"    // Cold Brew Stemmed Wine Goblet
  | "kuksa"     // Scandinavian Carved Wooden Cup
  | "zisha";    // Yixing Purple Clay Cup

export type CupGlaze =
  | "celadon"     // Celadon Jade Green
  | "tenmoku"     // Tenmoku Rust Bronze
  | "hakuji"      // Pure Hakuji Porcelain
  | "earthenware" // Warm Stoneware / Terracotta
  | "sakura"      // Sakura Blossom Pink
  | "kintsugi"    // Kintsugi Gold Vein Repair
  | "obsidian"    // Midnight Obsidian Stardust
  | "wood"        // Natural Hinoki / Teak Wood
  | "crystal";    // Diamond Ribbed Crystal Glass

export type CoasterStyle =
  | "wood"     // Bamboo / Cedar Wood Ring
  | "rattan"   // Woven Rattan Coaster
  | "marble"   // Carrara White Marble Tray
  | "ceramic"  // Gold-Rim Glazed Saucer
  | "stone"    // Zen Riverstone Pedestal
  | "none";    // Floating / Clean Table

export type LatteArtType = "bear" | "heart" | "leaf" | "cat" | "sakura";

export interface ExtractionResult {
  renderedHex: string;
  opacity: number;
  sweetnessScore: number;
  aromaScore: number;
  bodyScore: number;
  bitternessScore: number;
  clarityScore: number;
  cozyTitle: string;
  tastingNotes: string;
  blendCode?: string;
  recommendedVessel?: CupVesselType;
  cupGlaze?: CupGlaze;
  turbidity?: "clear" | "cloudy" | "velvet";
  originCountries?: string[];
}

// === API Input Schema ===
export const CreateRecipeInputSchema = z.object({
  title: z.string().min(1, "Recipe name is required").max(100),
  description: z.string().max(500).nullable().optional(),
  waterTempC: z.number().min(60).max(100),
  waterAmountMl: z.number().min(50).max(500),
  steepingTimeSec: z.number().int().min(30).max(300),
  blendItems: z
    .array(
      z.object({
        ingredientId: z.string(),
        ratioPercent: z.number().min(0).max(100),
      })
    )
    .min(1, "At least one ingredient is required"),
});
export type CreateRecipeInput = z.infer<typeof CreateRecipeInputSchema>;

// === API Response Types ===
export type BlendItemWithIngredient = BlendItem & {
  ingredient: TeaIngredient;
};

export type RecipeWithBlends = Recipe & {
  blendItems: BlendItemWithIngredient[];
};

// === Flavor Dimension Keys ===
export const FLAVOR_DIMENSIONS = [
  "sweetnessScore",
  "aromaScore",
  "bodyScore",
  "bitternessScore",
  "clarityScore",
] as const;

export const FLAVOR_LABELS: Record<string, string> = {
  sweetnessScore: "Sweetness",
  aromaScore: "Aroma",
  bodyScore: "Body",
  bitternessScore: "Bitterness",
  clarityScore: "Clarity",
};
