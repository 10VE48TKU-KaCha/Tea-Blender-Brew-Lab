import { CupVesselType, CupGlaze, LatteArtType, TeaIngredient } from "@/types/tea";
import { ServingStyle } from "@/components/game/CozyCupScene";

export interface JournalBlendItem {
  ingredientId: string;
  ingredientName: string;
  ratioPercent: number;
  category: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  date: string; // ISO String
  rating: number; // 1-5
  notes: string;
  tags: string[];
  waterTempC: number;
  waterAmountMl: number;
  steepingTimeSec: number;
  servingStyle: ServingStyle;
  vesselType?: CupVesselType;
  cupGlaze?: CupGlaze;
  garnishes?: string[];
  latteArt?: LatteArtType;
  renderedHex: string;
  blendItems: JournalBlendItem[];
  cozyTitle: string;
  tastingNotes?: string;
  scores: {
    sweetness: number;
    aroma: number;
    body: number;
    bitterness: number;
    clarity: number;
  };
  wellness?: {
    overallScore: number;
    benefitEn: string;
    benefitTh: string;
    caffeineLevel: string;
  };
}

const JOURNAL_STORAGE_KEY = "kissa_tasting_journal";
const CUSTOM_LEAVES_STORAGE_KEY = "kissa_custom_ingredients";

export function getJournalEntries(): JournalEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(JOURNAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Failed to read journal from localStorage:", err);
    return [];
  }
}

export function saveJournalEntry(entryData: Omit<JournalEntry, "id" | "date">): JournalEntry {
  const current = getJournalEntries();
  const newEntry: JournalEntry = {
    ...entryData,
    id: `journal_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    date: new Date().toISOString(),
  };

  const updated = [newEntry, ...current];
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to save journal entry:", err);
    }
  }
  return newEntry;
}

export function updateJournalEntry(id: string, updates: Partial<JournalEntry>): JournalEntry[] {
  const current = getJournalEntries();
  const updated = current.map((item) => (item.id === id ? { ...item, ...updates } : item));
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to update journal entry:", err);
    }
  }
  return updated;
}

export function deleteJournalEntry(id: string): JournalEntry[] {
  const current = getJournalEntries();
  const updated = current.filter((item) => item.id !== id);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to delete journal entry:", err);
    }
  }
  return updated;
}

export function getCustomIngredients(): TeaIngredient[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CUSTOM_LEAVES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Failed to read custom ingredients:", err);
    return [];
  }
}

export function saveCustomIngredient(ingredient: TeaIngredient): TeaIngredient[] {
  const current = getCustomIngredients();
  const filtered = current.filter((item) => item.id !== ingredient.id);
  const updated = [...filtered, ingredient];
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(CUSTOM_LEAVES_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to save custom ingredient:", err);
    }
  }
  return updated;
}

export function deleteCustomIngredient(id: string): TeaIngredient[] {
  const current = getCustomIngredients();
  const updated = current.filter((item) => item.id !== id);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(CUSTOM_LEAVES_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to delete custom ingredient:", err);
    }
  }
  return updated;
}
