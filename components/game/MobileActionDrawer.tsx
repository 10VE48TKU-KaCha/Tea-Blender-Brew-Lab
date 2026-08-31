"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface MobileActionDrawerProps {
  onSave: () => void;
  isSaving: boolean;
  hasBlend: boolean;
  cozyTitle?: string;
  renderedHex?: string;
}

export function MobileActionDrawer({
  onSave,
  isSaving,
  hasBlend,
  cozyTitle,
  renderedHex,
}: MobileActionDrawerProps) {
  const { t, lang } = useLanguage();
  const title = cozyTitle || (lang === "th" ? "สูตรชาของคุณ" : "Your Blend");

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", bounce: 0, duration: 0.4 }}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/90 backdrop-blur-md border-t border-amber/20 pb-safe pt-4 px-4 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {renderedHex && (
            <div
              className="h-8 w-8 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: renderedHex }}
            />
          )}
          <span className="font-semibold text-wood-dark">{title}</span>
        </div>
        <Button
          onClick={onSave}
          disabled={!hasBlend || isSaving}
          className="min-w-[100px]"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : t.saveRecipe}
        </Button>
      </div>
    </motion.div>
  );
}

export default MobileActionDrawer;
