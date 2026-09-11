"use client";

import React from "react";
import { motion } from "framer-motion";
import { CAFE_CUSTOMERS } from "@/lib/cafe-customers";
import { CafeCustomerState } from "@/types/cafe";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, X, BookHeart, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface CustomerGuestbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerStates: Record<string, CafeCustomerState>;
}

export default function CustomerGuestbookModal({
  isOpen,
  onClose,
  customerStates,
}: CustomerGuestbookModalProps) {
  const { lang } = useLanguage();

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <Card className="w-full max-w-3xl max-h-[90vh] bg-[#fcfaf7] border-[#8c5e45]/30 shadow-2xl rounded-3xl overflow-hidden flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between border-b border-wood/15 pb-4 px-6">
          <CardTitle className="font-display text-2xl text-dark-wood flex items-center gap-2">
            <BookHeart className="w-6 h-6 text-amber-700" />
            <span>{lang === "th" ? "สมุดบันทึกเรื่องราวลูกค้า (Customer Guestbook)" : "Customer Guestbook"}</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-wood/10 text-wood cursor-pointer"
          >
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto space-y-4">
          <p className="text-xs text-wood italic text-center">
            {lang === "th"
              ? "ชงชาให้ได้ 3 ดาว เพื่อปลดล็อกรูปถ่ายโพลารอยด์ของลูกค้าแต่ละท่าน!"
              : "Craft a 3-Star brew to unlock each customer's special polaroid memory!"}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CAFE_CUSTOMERS.map((cust) => {
              const state = customerStates[cust.id];
              const stars = state?.starsEarned || 0;
              const hasPolaroid = state?.unlockedPolaroid || false;
              const timesServed = state?.timesServed || 0;

              return (
                <div
                  key={cust.id}
                  className="bg-white rounded-2xl p-4 border border-wood/15 shadow-xs flex gap-4 items-start"
                >
                  {/* Polaroid Frame */}
                  <div className="w-24 shrink-0 bg-cream p-1.5 pb-3 rounded-lg border border-wood/20 shadow-xs flex flex-col items-center">
                    <div className="w-20 h-20 rounded bg-amber-50/80 border border-amber-200/60 flex items-center justify-center text-4xl shadow-inner relative">
                      {cust.avatarEmoji}
                      {hasPolaroid && (
                        <div className="absolute top-1 right-1 bg-amber-500 text-white rounded-full p-0.5">
                          <Sparkles className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-wood/80 mt-1.5 font-bold">
                      {hasPolaroid
                        ? (lang === "th" ? "⭐ 3 ดาวสมบูรณ์" : "⭐ 3-Star Master")
                        : (lang === "th" ? "ยังไม่ปลดล็อก" : "Locked")}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-display font-bold text-dark-wood text-base truncate">
                        {lang === "th" ? cust.nameTh : cust.name}
                      </h4>
                      <div className="flex text-amber-500 shrink-0">
                        {[1, 2, 3].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= stars ? "fill-amber-400 text-amber-500" : "text-wood/20"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="text-[11px] font-semibold text-amber-800">
                      {lang === "th" ? cust.roleTh : cust.role}
                    </div>

                    <p className="text-[11px] text-wood/80 line-clamp-2">
                      {lang === "th" ? cust.bioTh : cust.bio}
                    </p>

                    <div className="text-[10px] text-wood/60 pt-1 border-t border-wood/10">
                      <span>{lang === "th" ? "เสิร์ฟแล้ว:" : "Times served:"} {timesServed} {lang === "th" ? "ครั้ง" : "times"}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
