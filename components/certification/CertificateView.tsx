"use client";

import React, { useRef } from "react";
import { CertificateRecord, EXAM_TIERS, ExamTier } from "@/lib/certification-engine";
import { useLanguage } from "@/context/LanguageContext";
import { KissaLogo } from "@/components/ui/KissaLogo";
import { Button } from "@/components/ui/button";
import { Download, Printer, Award, ShieldCheck, Sparkles } from "lucide-react";

interface CertificateViewProps {
  certificate: CertificateRecord;
  onClose?: () => void;
}

export default function CertificateView({ certificate, onClose }: CertificateViewProps) {
  const { lang } = useLanguage();
  const certRef = useRef<HTMLDivElement>(null);
  const tierData = EXAM_TIERS[certificate.tier];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center space-y-6 w-full max-w-2xl mx-auto">
      {/* Certificate Frame (Vintage Parchment & Gold Foil) */}
      <div
        ref={certRef}
        className="w-full bg-[#FAF6EE] text-stone-900 border-8 border-[#C5A059] rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden print:border-4 print:shadow-none"
        style={{
          boxShadow: "0 20px 50px rgba(78, 52, 26, 0.25), inset 0 0 40px rgba(197, 160, 89, 0.15)",
        }}
      >
        {/* Subtle Watermark Mon Crest */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none select-none">
          <KissaLogo size="lg" showSubtitle={false} />
        </div>

        {/* Inner Gold Foil Double Border */}
        <div className="border border-[#C5A059]/60 p-6 sm:p-8 rounded-xl relative space-y-6 text-center">
          {/* Top Crest & Monogram */}
          <div className="flex flex-col items-center justify-center space-y-1">
            <div className="w-12 h-12 rounded-full border-2 border-[#C5A059] p-1 flex items-center justify-center bg-white/80 shadow-xs">
              <KissaLogo size="sm" showSubtitle={false} />
            </div>
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#8C6D37] pt-1">
              Kissa Specialty Tea Academy
            </span>
            <span className="text-xs text-stone-500 font-serif tracking-widest">
              喫茶道 鑑定免許
            </span>
          </div>

          {/* Title */}
          <div className="space-y-1">
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold tracking-wide text-[#3D2817]">
              {lang === "th" ? "ใบประกาศนียบัตรช่างชา" : "Certificate of Tea Mastery"}
            </h1>
            <p className="font-mono text-xs text-[#8C6D37] tracking-wider font-semibold">
              {tierData.japaneseTitle} • {tierData.titleEn}
            </p>
          </div>

          {/* Certificate Body Text */}
          <div className="space-y-3 py-2 max-w-lg mx-auto">
            <p className="text-xs text-stone-600 font-serif leading-relaxed">
              {lang === "th"
                ? "ขอประกาศให้ทราบโดยทั่วกันว่า ผู้ผ่านการทดสอบอันทรงเกียรติรายนี้ ได้บรรลุศาสตร์แห่งการสกัดน้ำชา ความรู้เคมีพฤกษา และการปรุงรสสัมผัสระดับสูงสุด"
                : "This certifies that the esteemed candidate has demonstrated profound technical mastery of extraction thermodynamics, botanical chemistry, and sensory harmony."}
            </p>

            <div className="py-2 border-b-2 border-dotted border-[#C5A059]/50 max-w-xs mx-auto">
              <span className="font-serif text-xl sm:text-2xl font-bold text-[#1E1915] tracking-wide">
                {certificate.candidateName}
              </span>
            </div>

            <p className="text-[11px] text-stone-500 font-serif">
              {lang === "th"
                ? `ได้รับการแต่งตั้งให้ดำรงสถานะ ${tierData.titleTh} ประจำห้องทดลองชา Kissa Lab`
                : `Conferred with the honor and title of ${tierData.titleEn} at Kissa Tea Lab.`}
            </p>
          </div>

          {/* Bottom Details, Red Hanko Stamp & Signatures */}
          <div className="pt-6 border-t border-[#C5A059]/40 flex items-center justify-between gap-4 text-left">
            <div className="space-y-1 text-[11px] font-mono text-stone-600">
              <div>
                <span className="font-semibold text-stone-700">Serial ID:</span> {certificate.certificateId}
              </div>
              <div>
                <span className="font-semibold text-stone-700">Issue Date:</span>{" "}
                {new Date(certificate.issueDate).toLocaleDateString()}
              </div>
              <div>
                <span className="font-semibold text-stone-700">Exam Score:</span>{" "}
                <span className="text-emerald-700 font-bold">{certificate.scorePercent}%</span>
              </div>
            </div>

            {/* Red Hanko Japanese Vermilion Seal (印) */}
            <div className="relative flex flex-col items-center">
              <div className="w-14 h-14 border-2 border-[#BE123C] rounded-lg p-1 flex items-center justify-center rotate-[-4deg] shadow-xs select-none">
                <div className="border border-[#BE123C] w-full h-full flex flex-col items-center justify-center text-[#BE123C] font-serif font-black text-xs leading-none">
                  <span>喫茶</span>
                  <span>之印</span>
                </div>
              </div>
              <span className="text-[9px] font-mono text-stone-400 mt-1">Official Seal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <Button
          onClick={handlePrint}
          className="bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold px-5 shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>{lang === "th" ? "พิมพ์ / บันทึกเป็น PDF" : "Print / Save PDF"}</span>
        </Button>
        {onClose && (
          <Button
            onClick={onClose}
            variant="outline"
            className="rounded-xl text-xs px-4"
          >
            {lang === "th" ? "ปิดหน้าต่าง" : "Close"}
          </Button>
        )}
      </div>
    </div>
  );
}
