"use client";

import React from "react";
import { motion } from "framer-motion";
import { CustomerProfile } from "@/types/cafe";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, MessageCircleHeart } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface CustomerDialogueProps {
  customer: CustomerProfile;
  onAcceptOrder: () => void;
  onSwitchCustomer: () => void;
}

export default function CustomerDialogue({
  customer,
  onAcceptOrder,
  onSwitchCustomer,
}: CustomerDialogueProps) {
  const { lang } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="bg-white/85 backdrop-blur-md border-wood/25 shadow-md overflow-hidden rounded-3xl">
        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* Customer Avatar & Intro Header */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-100/70 border border-amber-300 flex items-center justify-center text-4xl sm:text-5xl shadow-inner shrink-0">
              {customer.avatarEmoji}
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber/15 text-amber-900 text-xs font-semibold">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>{lang === "th" ? customer.roleTh : customer.role}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-dark-wood">
                {lang === "th" ? customer.nameTh : customer.name}
              </h3>
              <p className="text-xs text-wood/80 italic line-clamp-1">
                "{lang === "th" ? customer.bioTh : customer.bio}"
              </p>
            </div>
          </div>

          {/* Speech Bubble with Dialogue */}
          <div className="relative bg-cream/60 border border-amber/30 rounded-2xl p-4 sm:p-5 text-dark-wood shadow-inner">
            <div className="flex items-start gap-2.5">
              <MessageCircleHeart className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <p className="font-serif italic text-base sm:text-lg leading-relaxed">
                "{lang === "th" ? customer.orderDialogueTh : customer.orderDialogue}"
              </p>
            </div>
          </div>

          {/* Sensory Clues & Target Profile Preview */}
          <div className="bg-white/60 rounded-2xl p-4 border border-wood/15 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-wood/70">
              {lang === "th" ? "📋 โน้ตรสชาติ & อุปกรณ์ที่ลูกค้าชื่นชอบ" : "📋 Desired Flavor & Teaware Clues"}
            </h4>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 font-medium">
                🍶 {lang === "th" ? "สไตล์เสิร์ฟ:" : "Serving:"} {customer.requiredStyle.toUpperCase()}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 font-medium">
                🌡️ ~{customer.targetTemp}°C
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 font-medium">
                ⏳ ~{customer.targetSteepSec}s
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 font-medium">
                ✨ {lang === "th" ? customer.favoriteNotesTh : customer.favoriteNotes}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onSwitchCustomer}
              className="text-xs border-2 border-wood/25 text-wood-dark font-semibold hover:bg-cream rounded-xl cursor-pointer"
            >
              🔄 {lang === "th" ? "เปลี่ยนลูกค้าคนถัดไป" : "Next Customer"}
            </Button>
            <Button
              onClick={onAcceptOrder}
              className="bg-gradient-to-r from-[#BA4A1E] via-[#C85826] to-[#D96830] hover:from-[#A43E16] hover:to-[#BA4A1E] text-white font-bold rounded-xl px-6 py-2.5 shadow-md shadow-orange-950/20 cursor-pointer transition-all hover:scale-105 active:scale-95"
            >
              🍵 {lang === "th" ? "รับออเดอร์ & เริ่มเลือกใบชา" : "Accept Order & Begin"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
