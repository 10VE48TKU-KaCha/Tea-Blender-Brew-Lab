"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExamTier,
  EXAM_TIERS,
  CertificateRecord,
  getIssuedCertificates,
  saveIssuedCertificate,
  evaluateDailyQuest,
} from "@/lib/certification-engine";
import { useLanguage } from "@/context/LanguageContext";
import { BlendInput, ExtractionResult } from "@/types/tea";
import CertificateView from "./CertificateView";
import { Button } from "@/components/ui/button";
import {
  Award,
  X,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  HelpCircle,
  FlaskConical,
  RotateCcw,
  ArrowLeft,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { playChime } from "@/lib/audio";

interface TeaMasterExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentExtraction: ExtractionResult | null;
  currentBlendInputs: BlendInput[];
  waterTempC: number;
  steepingTimeSec: number;
}

type ExamStep = "SELECT_TIER" | "THEORY_QUIZ" | "PRACTICAL_CHALLENGE" | "VIEW_CERTIFICATE";

export default function TeaMasterExamModal({
  isOpen,
  onClose,
  currentExtraction,
  currentBlendInputs,
  waterTempC,
  steepingTimeSec,
}: TeaMasterExamModalProps) {
  const { lang } = useLanguage();
  const [activeTier, setActiveTier] = useState<ExamTier>("APPRENTICE");
  const [examStep, setExamStep] = useState<ExamStep>("SELECT_TIER");
  const [issuedCerts, setIssuedCerts] = useState<Record<ExamTier, CertificateRecord | null>>({
    APPRENTICE: null,
    ARTISAN: null,
    GRAND_MASTER: null,
  });

  // Theory quiz states
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showAnswerResult, setShowAnswerResult] = useState(false);

  // Candidate Name for certificate
  const [candidateName, setCandidateName] = useState("Tea Master");
  const [activeCertificate, setActiveCertificate] = useState<CertificateRecord | null>(null);

  useEffect(() => {
    if (isOpen) {
      const certs = getIssuedCertificates();
      setIssuedCerts(certs);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const tierData = EXAM_TIERS[activeTier];

  const handleStartExam = (tier: ExamTier) => {
    setActiveTier(tier);
    // Check if already certified
    const existing = issuedCerts[tier];
    if (existing) {
      setActiveCertificate(existing);
      setExamStep("VIEW_CERTIFICATE");
      return;
    }
    setQuestionIndex(0);
    setSelectedAnswers([]);
    setShowAnswerResult(false);
    setExamStep("THEORY_QUIZ");
  };

  const handleSelectOption = (idx: number) => {
    if (showAnswerResult) return;
    const currentQ = tierData.questions[questionIndex];
    setSelectedAnswers((prev) => [...prev, idx]);
    setShowAnswerResult(true);
  };

  const handleNextQuestion = () => {
    setShowAnswerResult(false);
    if (questionIndex + 1 < tierData.questions.length) {
      setQuestionIndex(questionIndex + 1);
    } else {
      // Check if all answers correct
      const allCorrect = tierData.questions.every(
        (q, idx) => selectedAnswers[idx] === q.correctIndex
      );
      if (allCorrect) {
        setExamStep("PRACTICAL_CHALLENGE");
      } else {
        alert(
          lang === "th"
            ? "มีคำตอบบางข้อที่ไม่ถูกต้อง กรุณาลองทบทวนทฤษฎีใหม่อีกครั้ง"
            : "Some answers were incorrect. Please review the theory and retry."
        );
        setExamStep("SELECT_TIER");
      }
    }
  };

  // Evaluate practical challenge
  const practicalEval = evaluateDailyQuest(
    {
      id: "exam_practical",
      dateKey: "",
      patronName: "",
      patronTitleEn: "",
      patronTitleTh: "",
      patronAvatar: "",
      storyEn: "",
      storyTh: "",
      flavorHintEn: "",
      flavorHintTh: "",
      rewardCoins: 0,
      criteria: tierData.practicalChallenge.criteria,
    },
    currentExtraction,
    currentBlendInputs,
    waterTempC,
    steepingTimeSec
  );

  const handleCompleteCertification = () => {
    if (!practicalEval.isPassed) return;

    const newCert: CertificateRecord = {
      tier: activeTier,
      candidateName: candidateName.trim() || "Artisan Tea Master",
      certificateId: `KISSA-${activeTier.substring(0, 3)}-${Date.now().toString().slice(-6)}`,
      issueDate: new Date().toISOString(),
      scorePercent: 100,
    };

    saveIssuedCertificate(newCert);
    setIssuedCerts((prev) => ({ ...prev, [activeTier]: newCert }));
    setActiveCertificate(newCert);
    setExamStep("VIEW_CERTIFICATE");
    playChime();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-[#FDFBF7] border border-amber-900/20 rounded-3xl shadow-2xl overflow-hidden text-stone-900 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-950/10 bg-amber-50/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-600/10 text-amber-700 flex items-center justify-center border border-amber-600/20 shadow-xs">
              <Award className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-stone-900">
                {lang === "th" ? "สถาบันสอบวัดระดับช่างชา" : "Tea Master Academy & Certification"}
              </h3>
              <p className="text-xs text-stone-600">
                {lang === "th"
                  ? "ทดสอบความรู้การสกัดและทักษะการปรุงชาเพื่อรับใบประกาศนียบัตรเกียรติยศ"
                  : "Examine theory and practical extraction to earn classical Sommelier credentials"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-black/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: SELECT TIER */}
          {examStep === "SELECT_TIER" && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h4 className="font-display font-bold text-lg text-stone-900">
                  {lang === "th" ? "เลือกระดับชั้นการสอบวัดผล" : "Select Certification Level"}
                </h4>
                <p className="text-xs text-stone-500">
                  {lang === "th"
                    ? "แต่ละระดับจะมีการสอบทฤษฎี 2 ข้อ และการลงมือเบลนด์ชาจริงตามโจทย์ในแล็บ"
                    : "Each tier requires passing a theoretical quiz and a live laboratory blend challenge."}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {(Object.keys(EXAM_TIERS) as ExamTier[]).map((tierKey) => {
                  const t = EXAM_TIERS[tierKey];
                  const hasCert = issuedCerts[tierKey] !== null;

                  return (
                    <div
                      key={tierKey}
                      onClick={() => handleStartExam(tierKey)}
                      className={cn(
                        "p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 group",
                        hasCert
                          ? "bg-amber-50/70 border-amber-300 hover:bg-amber-100/70 shadow-xs"
                          : "bg-white border-stone-200 hover:border-amber-400 hover:shadow-md"
                      )}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="text-3xl p-2.5 rounded-2xl bg-stone-50 border border-stone-200 group-hover:scale-105 transition-transform">
                          {t.badge}
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <h5 className="font-bold text-sm text-stone-900">
                              {lang === "th" ? t.titleTh : t.titleEn}
                            </h5>
                            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                              {t.japaneseTitle}
                            </span>
                          </div>
                          <p className="text-xs text-stone-600">
                            {lang === "th" ? t.descriptionTh : t.descriptionEn}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        {hasCert ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{lang === "th" ? "สอบผ่านแล้ว" : "Certified"}</span>
                          </span>
                        ) : (
                          <Button
                            size="sm"
                            className="rounded-xl text-xs bg-amber-800 hover:bg-amber-900 text-white font-semibold cursor-pointer"
                          >
                            <span>{lang === "th" ? "เริ่มสอบ" : "Start Exam"}</span>
                            <ChevronRight className="w-3.5 h-3.5 ml-1" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: THEORY QUIZ */}
          {examStep === "THEORY_QUIZ" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between text-xs text-stone-500 pb-2 border-b border-stone-200">
                <button
                  type="button"
                  onClick={() => setExamStep("SELECT_TIER")}
                  className="flex items-center gap-1 hover:text-stone-900"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{lang === "th" ? "ย้อนกลับ" : "Back"}</span>
                </button>
                <span className="font-bold font-mono">
                  {lang === "th" ? "คำถามที่" : "Question"} {questionIndex + 1} /{" "}
                  {tierData.questions.length}
                </span>
              </div>

              {/* Question */}
              <div className="space-y-3">
                <h4 className="text-base font-bold text-stone-900 leading-snug">
                  {lang === "th"
                    ? tierData.questions[questionIndex].questionTh
                    : tierData.questions[questionIndex].questionEn}
                </h4>

                {/* Options */}
                <div className="space-y-2 pt-1">
                  {(lang === "th"
                    ? tierData.questions[questionIndex].optionsTh
                    : tierData.questions[questionIndex].optionsEn
                  ).map((option, oIdx) => {
                    const isSelected = selectedAnswers[questionIndex] === oIdx;
                    const isCorrect = tierData.questions[questionIndex].correctIndex === oIdx;

                    return (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => handleSelectOption(oIdx)}
                        disabled={showAnswerResult}
                        className={cn(
                          "w-full text-left p-3.5 rounded-2xl border text-xs font-medium transition-all flex items-center justify-between gap-3",
                          !showAnswerResult
                            ? "bg-white border-stone-200 hover:border-amber-400 hover:bg-amber-50/50"
                            : isCorrect
                            ? "bg-emerald-50 border-emerald-300 text-emerald-950 font-bold"
                            : isSelected
                            ? "bg-red-50 border-red-300 text-red-950"
                            : "bg-white/60 border-stone-200 opacity-60"
                        )}
                      >
                        <span>{option}</span>
                        {showAnswerResult && isCorrect && (
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                {showAnswerResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 space-y-1"
                  >
                    <div className="font-bold flex items-center gap-1.5 text-amber-900">
                      <HelpCircle className="w-4 h-4 text-amber-600" />
                      <span>{lang === "th" ? "คำอธิบายทางวิชาการ:" : "Technical Rationale:"}</span>
                    </div>
                    <p className="leading-relaxed">
                      {lang === "th"
                        ? tierData.questions[questionIndex].explanationTh
                        : tierData.questions[questionIndex].explanationEn}
                    </p>
                  </motion.div>
                )}
              </div>

              {showAnswerResult && (
                <div className="flex justify-end pt-3">
                  <Button
                    onClick={handleNextQuestion}
                    className="bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold"
                  >
                    <span>{lang === "th" ? "ข้อถัดไป" : "Continue"}</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: PRACTICAL CHALLENGE */}
          {examStep === "PRACTICAL_CHALLENGE" && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-100/70 to-orange-100/40 border border-amber-200 space-y-2">
                <div className="flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-amber-700" />
                  <h4 className="font-bold text-sm text-stone-900">
                    {lang === "th" ? "บททดสอบปฏิบัติ:" : "Practical Laboratory Challenge:"}{" "}
                    {lang === "th"
                      ? tierData.practicalChallenge.titleTh
                      : tierData.practicalChallenge.titleEn}
                  </h4>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {lang === "th"
                    ? tierData.practicalChallenge.promptTh
                    : tierData.practicalChallenge.promptEn}
                </p>
              </div>

              {/* Real-time verification from current Lab parameters */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-700">
                    {lang === "th"
                      ? "การตรวจสอบสูตรปัจจุบันในแล็บ:"
                      : "Live Verification from Lab Counter:"}
                  </span>
                  <span
                    className={cn(
                      "font-bold font-mono text-xs px-2.5 py-0.5 rounded-full",
                      practicalEval.isPassed
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    )}
                  >
                    {practicalEval.scorePercent}% {lang === "th" ? "ตรงตามเกณฑ์" : "Match"}
                  </span>
                </div>

                <div className="space-y-1.5">
                  {practicalEval.checks.map((check, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "flex items-center justify-between p-2.5 rounded-xl border text-xs",
                        check.passed
                          ? "bg-emerald-50/60 border-emerald-200 text-emerald-950 font-medium"
                          : "bg-stone-50 border-stone-200 text-stone-600"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {check.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <span className="w-4 h-4 rounded-full border border-stone-400 flex items-center justify-center text-[10px]">
                            ✕
                          </span>
                        )}
                        <span>{lang === "th" ? check.labelTh : check.labelEn}</span>
                      </div>
                      <div className="font-mono text-[11px]">
                        <span className={check.passed ? "text-emerald-700 font-bold" : "text-stone-500"}>
                          {check.currentValue}
                        </span>
                        <span className="text-stone-400 mx-1">/</span>
                        <span className="font-semibold">{check.targetValue}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Candidate Name Input */}
              {practicalEval.isPassed && (
                <div className="p-4 rounded-2xl bg-white border border-emerald-300 space-y-2">
                  <label className="text-xs font-bold text-stone-800 block">
                    {lang === "th" ? "ระบุชื่อของคุณสำหรับพิมพ์ลงในใบประกาศนียบัตร:" : "Enter your name for the official certificate:"}
                  </label>
                  <input
                    type="text"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="Candidate Name"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 font-serif font-bold text-stone-900"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setExamStep("SELECT_TIER")}
                  className="rounded-xl text-xs"
                >
                  {lang === "th" ? "ยกเลิก" : "Cancel"}
                </Button>

                {practicalEval.isPassed ? (
                  <Button
                    size="sm"
                    onClick={handleCompleteCertification}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 mr-1.5" />
                    <span>{lang === "th" ? "ออกใบประกาศนียบัตรเกียรติยศ" : "Issue My Certificate"}</span>
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={onClose}
                    className="bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold"
                  >
                    <span>{lang === "th" ? "ปรับแต่งสูตรในแล็บต่อ" : "Tune Parameters in Lab"}</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: VIEW CERTIFICATE */}
          {examStep === "VIEW_CERTIFICATE" && activeCertificate && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <button
                  type="button"
                  onClick={() => setExamStep("SELECT_TIER")}
                  className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1 font-semibold"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{lang === "th" ? "กลับไปหน้าเลือกระดับ" : "All Certificates"}</span>
                </button>
              </div>

              <CertificateView certificate={activeCertificate} onClose={onClose} />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
