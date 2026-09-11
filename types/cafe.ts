import { CupVesselType, ServingStyle, TeaIngredient } from "./tea";

export type RitualStep =
  | "KETTLE_TEMP"      // 1. Tune & heat kettle
  | "WARM_TEAWARE"     // 2. Warm teapot & cup with hot water, discard to chapan
  | "SCOOP_LEAVES"     // 3. Scoop tea leaves into teapot with bamboo chashaku
  | "AWAKENING_RINSE"  // 4. Quick flash rinse and pour out
  | "SPIRAL_POUR"      // 5. Circular spiral pouring to agitate leaves
  | "STEEPING_WINDOW"  // 6. Watch leaves unfurl, hit stop in golden extraction window
  | "PLACE_STRAINER"   // 8. Place fine brass strainer
  | "DECANT_PITCHER"   // 9. Pour into Gong Dao Bei fairness pitcher
  // Menu specific branches:
  | "MATCHA_WHISK"     // 7. Special branch for Matcha orders (Chasen frothing)
  | "ICE_DROP"         // 10. Special branch for Iced orders (Ice tongs drop)
  | "MILK_STEAM"       // 11. Special branch for Latte orders (Steaming & art)
  | "FINISHING_MIST"   // 12. Garnish & aroma mist
  | "SERVE_EVALUATION";// Final tasting

export type TeapotType = "glass" | "kyusu" | "zisha" | "porcelain";

export interface TeapotConfig {
  id: TeapotType;
  name: string;
  nameTh: string;
  material: string;
  materialTh: string;
  desc: string;
  descTh: string;
  icon: string;
  bestFor: string;
  colorHex: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  nameTh: string;
  avatarEmoji: string;
  role: string;
  roleTh: string;
  bio: string;
  bioTh: string;
  orderDialogue: string;
  orderDialogueTh: string;
  favoriteNotes: string;
  favoriteNotesTh: string;
  requiredStyle: ServingStyle;
  targetTemp: number;
  targetSteepSec: number;
  suggestedTeapot: TeapotType;
  suggestedCup: CupVesselType;
  targetRadar: {
    sweetness: number;
    aroma: number;
    body: number;
    bitterness: number;
    clarity: number;
  };
  preferredTeaNames: string[];
}

export interface RitualProgressScores {
  tempScore: number;       // 0 - 100
  rinseScore: number;      // 0 - 100
  spiralScore: number;     // 0 - 100
  steepScore: number;      // 0 - 100
  decantScore: number;     // 0 - 100
  branchScore: number;     // 0 - 100 (whisk / ice / milk)
  garnishScore: number;    // 0 - 100
}

export interface CafeCustomerState {
  customerId: string;
  starsEarned: number; // 0-3
  timesServed: number;
  unlockedPolaroid: boolean;
  bestScore: number;
}

export interface ShopItem {
  id: string;
  category: "teapot" | "cup" | "latteArt";
  name: string;
  nameTh: string;
  priceCoins: number;
  icon: string;
  desc: string;
  descTh: string;
}
