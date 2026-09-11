"use client";

import React from "react";
import { motion } from "framer-motion";
import { SHOP_ITEMS, unlockShopItem } from "@/lib/cafe-engine";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, X, Check, Lock, ShoppingBag } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { playChime } from "@/lib/audio";

interface TeawareShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  coins: number;
  unlockedIds: string[];
  onCoinsChange: (newCoins: number) => void;
  onUnlockedChange: (newIds: string[]) => void;
}

export default function TeawareShopModal({
  isOpen,
  onClose,
  coins,
  unlockedIds,
  onCoinsChange,
  onUnlockedChange,
}: TeawareShopModalProps) {
  const { lang } = useLanguage();

  if (!isOpen) return null;

  const handleBuyItem = (itemId: string, price: number) => {
    if (coins < price || unlockedIds.includes(itemId)) return;
    playChime();
    const newCoins = coins - price;
    const newIds = [...unlockedIds, itemId];
    onCoinsChange(newCoins);
    onUnlockedChange(newIds);
    unlockShopItem(itemId);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <Card className="w-full max-w-2xl max-h-[90vh] bg-[#fcfaf7] border-[#8c5e45]/30 shadow-2xl rounded-3xl overflow-hidden flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between border-b border-wood/15 pb-4 px-6">
          <div className="flex items-center gap-3">
            <CardTitle className="font-display text-2xl text-dark-wood flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-amber-700" />
              <span>{lang === "th" ? "ร้านค้าอุปกรณ์ชงชา (Artisan Teaware)" : "Artisan Teaware Shop"}</span>
            </CardTitle>
            <div className="flex items-center gap-1 bg-amber-100/80 px-3 py-1 rounded-full border border-amber-300 text-xs font-bold text-amber-900 shadow-inner">
              <Coins className="w-3.5 h-3.5 text-amber-700" />
              <span>{coins} {lang === "th" ? "เหรียญ" : "Coins"}</span>
            </div>
          </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SHOP_ITEMS.map((item) => {
              const isUnlocked = unlockedIds.includes(item.id);
              const canAfford = coins >= item.priceCoins;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 border border-wood/15 shadow-xs flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-2xl shadow-inner shrink-0">
                      {item.icon}
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-display font-bold text-dark-wood text-sm">
                        {lang === "th" ? item.nameTh : item.name}
                      </h4>
                      <p className="text-[11px] text-wood/80 line-clamp-2">
                        {lang === "th" ? item.descTh : item.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-wood/10">
                    <div className="flex items-center gap-1 font-bold text-xs text-amber-900">
                      <Coins className="w-3.5 h-3.5 text-amber-600" />
                      <span>{item.priceCoins} {lang === "th" ? "เหรียญ" : "Coins"}</span>
                    </div>

                    {isUnlocked ? (
                      <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        <Check className="w-3.5 h-3.5" />
                        <span>{lang === "th" ? "ปลดล็อกแล้ว" : "Unlocked"}</span>
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleBuyItem(item.id, item.priceCoins)}
                        disabled={!canAfford}
                        className={`text-xs rounded-xl px-3 py-1 cursor-pointer font-semibold shadow-xs ${
                          canAfford
                            ? "bg-amber-700 hover:bg-amber-800 text-white"
                            : "bg-wood/20 text-wood/50 cursor-not-allowed"
                        }`}
                      >
                        <Lock className="w-3 h-3 mr-1" />
                        <span>{lang === "th" ? "ปลดล็อก" : "Unlock"}</span>
                      </Button>
                    )}
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
