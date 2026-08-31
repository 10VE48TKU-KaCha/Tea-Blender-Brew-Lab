"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import {
  Language,
  TranslationDictionary,
  translations,
  THAI_INGREDIENT_NAMES,
  THAI_FOOD_PAIRINGS,
} from "@/lib/i18n";
import { FoodPairing } from "@/lib/sommelier-engine";

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: TranslationDictionary;
  translateIngredient: (name: string) => string;
  translateFoodPairing: (pairing: FoodPairing) => FoodPairing;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "kissa_tea_language";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const savedLang = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (savedLang === "en" || savedLang === "th") {
        setLangState(savedLang);
      } else {
        // Detect browser language
        const browserLang = navigator.language.toLowerCase();
        if (browserLang.startsWith("th")) {
          setLangState("th");
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch {
      // Ignore localStorage errors
    }
  };

  const toggleLang = () => {
    setLang(lang === "en" ? "th" : "en");
  };

  const t = useMemo(() => translations[lang] || translations.en, [lang]);

  const translateIngredient = (name: string) => {
    if (lang === "th") {
      return THAI_INGREDIENT_NAMES[name] || name;
    }
    return name;
  };

  const translateFoodPairing = (pairing: FoodPairing): FoodPairing => {
    if (lang === "th" && THAI_FOOD_PAIRINGS[pairing.name]) {
      const th = THAI_FOOD_PAIRINGS[pairing.name];
      return {
        ...pairing,
        name: th.name,
        category: th.category,
        reason: th.reason,
      };
    }
    return pairing;
  };

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        toggleLang,
        t,
        translateIngredient,
        translateFoodPairing,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
