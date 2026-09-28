import { TeaIngredient, Recipe } from "@/types/tea";

export const DEFAULT_TEA_INGREDIENTS: TeaIngredient[] = [
  // === BLACK TEAS ===
  {
    id: "tea-assam-golden-tips",
    name: "Assam Golden Tips 🇮🇳",
    category: "BLACK",
    baseColor: "#7A3212",
    bodyScore: 9,
    tanninScore: 8,
    aromaScore: 6,
  },
  {
    id: "tea-darjeeling-first-flush",
    name: "Darjeeling First Flush 🇮🇳",
    category: "BLACK",
    baseColor: "#C27A3A",
    bodyScore: 5,
    tanninScore: 6,
    aromaScore: 9,
  },
  {
    id: "tea-ceylon-nuwara-eliya",
    name: "Ceylon Nuwara Eliya 🇱🇰",
    category: "BLACK",
    baseColor: "#B55B24",
    bodyScore: 7,
    tanninScore: 7,
    aromaScore: 8,
  },
  {
    id: "tea-earl-grey-bergamot",
    name: "Classic Earl Grey Bergamot 🇬🇧",
    category: "BLACK",
    baseColor: "#6E381A",
    bodyScore: 7,
    tanninScore: 6,
    aromaScore: 9,
  },
  {
    id: "tea-lapsang-souchong-smoky",
    name: "Lapsang Souchong Smoky 🇨🇳",
    category: "BLACK",
    baseColor: "#422013",
    bodyScore: 9,
    tanninScore: 7,
    aromaScore: 9,
  },
  {
    id: "tea-yunnan-vintage-puerh",
    name: "Yunnan Vintage Pu-erh 🇨🇳",
    category: "BLACK",
    baseColor: "#33190E",
    bodyScore: 10,
    tanninScore: 5,
    aromaScore: 7,
  },

  // === GREEN TEAS ===
  {
    id: "tea-kyoto-uji-matcha",
    name: "Kyoto Uji Ceremonial Matcha 🇯🇵",
    category: "GREEN",
    baseColor: "#3D6E35",
    bodyScore: 8,
    tanninScore: 6,
    aromaScore: 9,
  },
  {
    id: "tea-shizuoka-sencha",
    name: "Shizuoka Sencha 🇯🇵",
    category: "GREEN",
    baseColor: "#84A951",
    bodyScore: 4,
    tanninScore: 5,
    aromaScore: 7,
  },
  {
    id: "tea-kyoto-roasted-hojicha",
    name: "Kyoto Roasted Hojicha 🇯🇵",
    category: "GREEN",
    baseColor: "#8C6541",
    bodyScore: 6,
    tanninScore: 3,
    aromaScore: 8,
  },
  {
    id: "tea-argentine-yerba-mate",
    name: "Argentine Yerba Mate 🇦🇷",
    category: "GREEN",
    baseColor: "#6E8B3D",
    bodyScore: 7,
    tanninScore: 8,
    aromaScore: 7,
  },

  // === OOLONG TEAS ===
  {
    id: "tea-alishan-high-mountain-oolong",
    name: "Alishan High Mountain Oolong 🇹🇼",
    category: "OOLONG",
    baseColor: "#D4A537",
    bodyScore: 5,
    tanninScore: 4,
    aromaScore: 9,
  },
  {
    id: "tea-wuyi-da-hong-pao",
    name: "Wuyi Da Hong Pao Rock Oolong 🇨🇳",
    category: "OOLONG",
    baseColor: "#8B4513",
    bodyScore: 8,
    tanninScore: 6,
    aromaScore: 9,
  },
  {
    id: "tea-oriental-beauty-honey",
    name: "Oriental Beauty Honey Oolong 🇹🇼",
    category: "OOLONG",
    baseColor: "#B86B32",
    bodyScore: 6,
    tanninScore: 4,
    aromaScore: 10,
  },

  // === WHITE TEAS ===
  {
    id: "tea-fujian-silver-needle",
    name: "Fujian Silver Needle (Baihao) 🇨🇳",
    category: "WHITE",
    baseColor: "#D8CEB2",
    bodyScore: 2,
    tanninScore: 2,
    aromaScore: 8,
  },

  // === HERBAL & BOTANICALS ===
  {
    id: "tea-bavarian-chamomile",
    name: "Bavarian Chamomile 🇩🇪",
    category: "HERBAL",
    baseColor: "#E0D268",
    bodyScore: 2,
    tanninScore: 1,
    aromaScore: 8,
  },
  {
    id: "tea-provence-french-lavender",
    name: "Provence French Lavender 🇫🇷",
    category: "HERBAL",
    baseColor: "#8D7B9D",
    bodyScore: 2,
    tanninScore: 1,
    aromaScore: 10,
  },
  {
    id: "tea-nile-valley-hibiscus",
    name: "Nile Valley Hibiscus 🇪🇬",
    category: "HERBAL",
    baseColor: "#9E1A34",
    bodyScore: 5,
    tanninScore: 4,
    aromaScore: 8,
  },
  {
    id: "tea-cederberg-red-rooibos",
    name: "Cederberg Red Rooibos 🇿🇦",
    category: "HERBAL",
    baseColor: "#9E3818",
    bodyScore: 6,
    tanninScore: 2,
    aromaScore: 8,
  },
];

export interface EnrichedRecipe {
  id: string;
  title: string;
  description: string | null;
  waterTempC: number;
  waterAmountMl: number;
  steepingTimeSec: number;
  bitternessScore: number;
  aromaScore: number;
  sweetnessScore: number;
  bodyScore: number;
  renderedHex: string;
  createdAt: string;
  vesselType?: string;
  cupGlaze?: string;
  coasterStyle?: string;
  servingStyle?: string;
  turbidity?: string;
  latteArt?: string | null;
  garnishes?: string;
  blendItems: {
    id: string;
    recipeId: string;
    ingredientId: string;
    ratioPercent: number;
    ingredient: TeaIngredient;
  }[];
}

export const DEFAULT_RECIPES: EnrichedRecipe[] = [
  {
    id: "recipe-kyoto-zen",
    title: "Tokyo Emerald Zen Latte",
    description: "Ceremonial Kyoto Uji matcha balanced with roasted Hojicha and steamed silky foam.",
    waterTempC: 80,
    waterAmountMl: 160,
    steepingTimeSec: 60,
    bitternessScore: 4.8,
    aromaScore: 8.7,
    sweetnessScore: 6.2,
    bodyScore: 7.3,
    renderedHex: "#4C6B38",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    vesselType: "chawan",
    cupGlaze: "kintsugi",
    coasterStyle: "stone",
    servingStyle: "latte",
    turbidity: "cloudy",
    latteArt: "bear",
    garnishes: "[]",
    blendItems: [
      {
        id: "bi-1",
        recipeId: "recipe-kyoto-zen",
        ingredientId: "tea-kyoto-uji-matcha",
        ratioPercent: 65,
        ingredient: DEFAULT_TEA_INGREDIENTS.find((i) => i.id === "tea-kyoto-uji-matcha")!,
      },
      {
        id: "bi-2",
        recipeId: "recipe-kyoto-zen",
        ingredientId: "tea-kyoto-roasted-hojicha",
        ratioPercent: 35,
        ingredient: DEFAULT_TEA_INGREDIENTS.find((i) => i.id === "tea-kyoto-roasted-hojicha")!,
      },
    ],
  },
  {
    id: "recipe-alishan-fog",
    title: "Alishan High Mountain Orchid Mist",
    description: "High altitude Taiwanese oolong with crystalline Chinese Silver Needle.",
    waterTempC: 85,
    waterAmountMl: 180,
    steepingTimeSec: 140,
    bitternessScore: 2.9,
    aromaScore: 9.4,
    sweetnessScore: 7.8,
    bodyScore: 4.6,
    renderedHex: "#D8AB44",
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    vesselType: "gaiwan",
    cupGlaze: "hakuji",
    coasterStyle: "marble",
    servingStyle: "hot",
    turbidity: "crystal",
    latteArt: null,
    garnishes: "[]",
    blendItems: [
      {
        id: "bi-3",
        recipeId: "recipe-alishan-fog",
        ingredientId: "tea-alishan-high-mountain-oolong",
        ratioPercent: 80,
        ingredient: DEFAULT_TEA_INGREDIENTS.find((i) => i.id === "tea-alishan-high-mountain-oolong")!,
      },
      {
        id: "bi-4",
        recipeId: "recipe-alishan-fog",
        ingredientId: "tea-fujian-silver-needle",
        ratioPercent: 20,
        ingredient: DEFAULT_TEA_INGREDIENTS.find((i) => i.id === "tea-fujian-silver-needle")!,
      },
    ],
  },
  {
    id: "recipe-provence-lullaby",
    title: "Provence Midnight Serenade",
    description: "Soothing French lavender and chamomile with honeyed floral serenity.",
    waterTempC: 92,
    waterAmountMl: 220,
    steepingTimeSec: 210,
    bitternessScore: 1.4,
    aromaScore: 9.8,
    sweetnessScore: 8.5,
    bodyScore: 3.2,
    renderedHex: "#A283AA",
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    vesselType: "mug",
    cupGlaze: "sakura",
    coasterStyle: "ceramic",
    servingStyle: "hot",
    turbidity: "velvet",
    latteArt: null,
    garnishes: '["lavender","honey"]',
    blendItems: [
      {
        id: "bi-5",
        recipeId: "recipe-provence-lullaby",
        ingredientId: "tea-bavarian-chamomile",
        ratioPercent: 70,
        ingredient: DEFAULT_TEA_INGREDIENTS.find((i) => i.id === "tea-bavarian-chamomile")!,
      },
      {
        id: "bi-6",
        recipeId: "recipe-provence-lullaby",
        ingredientId: "tea-provence-french-lavender",
        ratioPercent: 30,
        ingredient: DEFAULT_TEA_INGREDIENTS.find((i) => i.id === "tea-provence-french-lavender")!,
      },
    ],
  },
];

// In-memory runtime recipe store to keep newly saved recipes accessible even without database
const inMemoryRecipes: EnrichedRecipe[] = [...DEFAULT_RECIPES];

export function getInMemoryRecipes(): EnrichedRecipe[] {
  return inMemoryRecipes;
}

export function addInMemoryRecipe(recipe: EnrichedRecipe): void {
  inMemoryRecipes.unshift(recipe);
}

export function findInMemoryRecipeById(id: string): EnrichedRecipe | undefined {
  return inMemoryRecipes.find((r) => r.id === id);
}
