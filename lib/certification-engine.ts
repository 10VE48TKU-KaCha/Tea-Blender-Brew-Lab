import { ExtractionResult, BlendInput, TeaCategory } from "@/types/tea";

// ==========================================
// 1. DAILY MYSTERY QUEST TYPES & LOGIC
// ==========================================

export interface DailyQuestCriteria {
  minSweetness?: number;
  minAroma?: number;
  maxBitterness?: number;
  minBody?: number;
  minClarity?: number;
  requiredCategory?: TeaCategory;
  minTempC?: number;
  maxTempC?: number;
  minSteepSec?: number;
  maxSteepSec?: number;
}

export interface DailyMysteryQuest {
  id: string; // e.g. "quest_2026_09_30"
  dateKey: string; // YYYY-MM-DD
  patronName: string;
  patronTitleEn: string;
  patronTitleTh: string;
  patronAvatar: string;
  storyEn: string;
  storyTh: string;
  flavorHintEn: string;
  flavorHintTh: string;
  rewardCoins: number;
  criteria: DailyQuestCriteria;
}

const ROTATING_DAILY_TEMPLATES: Omit<DailyMysteryQuest, "id" | "dateKey">[] = [
  {
    patronName: "Lady Eleanor",
    patronTitleEn: "Highland Aristocrat & Tea Connoisseur",
    patronTitleTh: "สุภาพสตรีแห่งที่ราบสูง ผู้หลงใหลในกลิ่นอายชาอังกฤษ",
    patronAvatar: "👑",
    storyEn: "“I seek an afternoon companion that sings of floral grace and velvety sweetness, yet keeps bitterness so faint it feels like a soft silk ribbon.”",
    storyTh: "“ฉันกำลังมองหาชาบ่ายที่ส่งกลิ่นหอมดอกไม้อบอวล และรสหวานนุ่มลิ้นดั่งแพรไหม โดยต้องไม่มีรสขมฝาดบาดคอแม้แต่น้อย”",
    flavorHintEn: "Sweetness ≥ 6.0, Aroma ≥ 7.0, Bitterness ≤ 3.5",
    flavorHintTh: "ความหวาน ≥ 6.0, กลิ่นหอม ≥ 7.0, ความขมฝาด ≤ 3.5",
    rewardCoins: 120,
    criteria: {
      minSweetness: 6.0,
      minAroma: 7.0,
      maxBitterness: 3.5,
      maxTempC: 90,
    },
  },
  {
    patronName: "Monk Genki",
    patronTitleEn: "Zen Monastery Herbalist",
    patronTitleTh: "พระอาจารย์เก็นกิ ผู้รักษาความสงบแห่งอารามเซน",
    patronAvatar: "🧘‍♂️",
    storyEn: "“For our dawn meditation, we require a pure elixir of clarity and serene body. It must include green or white leaves to cultivate deep mindfulness.”",
    storyTh: "“สำหรับการนั่งสมาธิรุ่งอรุณ เราต้องการน้ำชาที่ใสสะอาดบริสุทธิ์ มีบอดี้เบาสบาย และต้องมีส่วนผสมของชาเขียวหรือชาขาวเพื่อความตื่นรู้”",
    flavorHintEn: "Clarity ≥ 6.5, Bitterness ≤ 4.0, Green or White tea required",
    flavorHintTh: "ความใสบริสุทธิ์ ≥ 6.5, ความขม ≤ 4.0, ต้องมีชาเขียวหรือชาขาว",
    rewardCoins: 130,
    criteria: {
      minClarity: 6.5,
      maxBitterness: 4.0,
      requiredCategory: "GREEN",
      maxTempC: 85,
    },
  },
  {
    patronName: "Alchemist Soren",
    patronTitleEn: "Nordic Spice Crafter",
    patronTitleTh: "โซเรน นักแปรธาตุกลิ่นอายแถบสแกนดิเนเวีย",
    patronAvatar: "🧙‍♂️",
    storyEn: "“The frost bites hard today. Brew me an invigorating potion with deep body and aromatic resonance that warms the heart through the storm.”",
    storyTh: "“พายุหิมะเริ่มพัดแรงแล้ว ชงยาอายุวัฒนะที่มีบอดี้แน่นหนาและกลิ่นอายลึกล้ำให้อบอุ่นหัวใจหน่อยสิ”",
    flavorHintEn: "Body ≥ 6.5, Aroma ≥ 6.5, Brew temp ≥ 85°C",
    flavorHintTh: "เนื้อสัมผัส (Body) ≥ 6.5, กลิ่นหอม ≥ 6.5, อุณหภูมิ ≥ 85°C",
    rewardCoins: 140,
    criteria: {
      minBody: 6.5,
      minAroma: 6.5,
      minTempC: 85,
    },
  },
  {
    patronName: "Flora the Botanist",
    patronTitleEn: "Orchid & Botanical Explorer",
    patronTitleTh: "ฟลอรา นักพฤกษศาสตร์ผู้ตามหาดอกไม้หายาก",
    patronAvatar: "🌺",
    storyEn: "“I’ve hiked across cliffs all morning! I desire an ultra-aromatic floral infusion with gentle sweetness that restores tired senses.”",
    storyTh: "“ฉันเดินสำรวจหน้าผามาทั้งเช้า อยากได้ชาดอกไม้หอมฟุ้ง หวานนุ่มนวลชวนสดชื่นเพื่อฟื้นฟูประสาทสัมผัส”",
    flavorHintEn: "Aroma ≥ 7.5, Sweetness ≥ 5.8",
    flavorHintTh: "กลิ่นหอม ≥ 7.5, ความหวานธรรมชาติ ≥ 5.8",
    rewardCoins: 125,
    criteria: {
      minAroma: 7.5,
      minSweetness: 5.8,
    },
  },
  {
    patronName: "Captain Blackwood",
    patronTitleEn: "Spice Route Sea Voyager",
    patronTitleTh: "กัปตันแบล็ควู้ด นักเดินเรือเส้นทางเครื่องเทศ",
    patronAvatar: "⚓",
    storyEn: "“Aye, give me a bold sailor's brew! Robust black tea character, full mouthfeel, and brewed piping hot to cut through the sea salt.”",
    storyTh: "“ขอชารสเข้มของกะลาสีเรือ! เนื้อสัมผัสแน่นหนัก ชาดำเข้มข้น และต้องชงด้วยน้ำร้อนจัดเพื่อสู้กับลมทะเล”",
    flavorHintEn: "Body ≥ 7.0, Water temp ≥ 90°C, Black tea required",
    flavorHintTh: "เนื้อสัมผัส ≥ 7.0, อุณหภูมิน้ำ ≥ 90°C, ต้องมีชาดำ",
    rewardCoins: 150,
    criteria: {
      minBody: 7.0,
      minTempC: 90,
      requiredCategory: "BLACK",
    },
  },
  {
    patronName: "Princess Sakura",
    patronTitleEn: "Kyoto Royal Garden Keeper",
    patronTitleTh: "เจ้าหญิงซากุระ ผู้ดูแลสวนหลวงแห่งเกียวโต",
    patronAvatar: "🌸",
    storyEn: "“A delicate twilight cup, please. It must be sweet and clear like a spring pond under the cherry blossoms, steeped with utmost patience.”",
    storyTh: "“ขอชาถ้วยละมุนยามพลบค่ำ รสหวานและใสสะอาดดั่งสระน้ำต้องกลีบซากุระ ชงด้วยความประณีตไม่เร่งร้อน”",
    flavorHintEn: "Sweetness ≥ 6.5, Clarity ≥ 6.8, Bitterness ≤ 3.0",
    flavorHintTh: "ความหวาน ≥ 6.5, ความใส ≥ 6.8, ความขม ≤ 3.0",
    rewardCoins: 135,
    criteria: {
      minSweetness: 6.5,
      minClarity: 6.8,
      maxBitterness: 3.0,
      maxTempC: 85,
    },
  },
  {
    patronName: "Master Ryu",
    patronTitleEn: "Grand Gongfu Tea Master",
    patronTitleTh: "ปรมาจารย์ริว ผู้สืบทอดศาสตร์กงฟูฉา",
    patronAvatar: "🍵",
    storyEn: "“The Golden Harmony is elusive. Blend a cup that balances aroma and sweetness above 7.0, without letting bitterness overpower clarity.”",
    storyTh: "“ความสมดุลสีทองนั้นหาได้ยาก จงเบลนด์ชาที่มีกลิ่นและความหวานเกิน 7.0 โดยไม่ให้รสขมมาบดบังความใสกระจ่าง”",
    flavorHintEn: "Aroma ≥ 7.0, Sweetness ≥ 7.0, Bitterness ≤ 4.0",
    flavorHintTh: "กลิ่นหอม ≥ 7.0, ความหวาน ≥ 7.0, ความขม ≤ 4.0",
    rewardCoins: 160,
    criteria: {
      minAroma: 7.0,
      minSweetness: 7.0,
      maxBitterness: 4.0,
    },
  },
];

export function getTodayDailyQuest(): DailyMysteryQuest {
  const now = new Date();
  const dateKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  
  // Calculate deterministic index based on date string hash
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) {
    hash = (hash << 5) - hash + dateKey.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % ROTATING_DAILY_TEMPLATES.length;
  const template = ROTATING_DAILY_TEMPLATES[index];

  return {
    ...template,
    id: `quest_${dateKey.replace(/-/g, "_")}`,
    dateKey,
  };
}

export interface QuestEvaluation {
  isPassed: boolean;
  scorePercent: number;
  checks: {
    labelEn: string;
    labelTh: string;
    passed: boolean;
    currentValue: string;
    targetValue: string;
  }[];
}

export function evaluateDailyQuest(
  quest: DailyMysteryQuest,
  extraction: ExtractionResult | null,
  blendInputs: BlendInput[],
  waterTempC: number,
  steepingTimeSec: number
): QuestEvaluation {
  if (!extraction) {
    return {
      isPassed: false,
      scorePercent: 0,
      checks: [{ labelEn: "No blend active", labelTh: "ยังไม่มีการเบลนด์ชา", passed: false, currentValue: "-", targetValue: "-" }],
    };
  }

  const { criteria } = quest;
  const checks: QuestEvaluation["checks"] = [];

  if (criteria.minSweetness !== undefined) {
    const passed = extraction.sweetnessScore >= criteria.minSweetness;
    checks.push({
      labelEn: "Sweetness Score",
      labelTh: "ความหวานธรรมชาติ",
      passed,
      currentValue: extraction.sweetnessScore.toFixed(1),
      targetValue: `≥ ${criteria.minSweetness.toFixed(1)}`,
    });
  }

  if (criteria.minAroma !== undefined) {
    const passed = extraction.aromaScore >= criteria.minAroma;
    checks.push({
      labelEn: "Aroma Score",
      labelTh: "กลิ่นหอม",
      passed,
      currentValue: extraction.aromaScore.toFixed(1),
      targetValue: `≥ ${criteria.minAroma.toFixed(1)}`,
    });
  }

  if (criteria.maxBitterness !== undefined) {
    const passed = extraction.bitternessScore <= criteria.maxBitterness;
    checks.push({
      labelEn: "Max Bitterness",
      labelTh: "ความขมฝาดสูงสุด",
      passed,
      currentValue: extraction.bitternessScore.toFixed(1),
      targetValue: `≤ ${criteria.maxBitterness.toFixed(1)}`,
    });
  }

  if (criteria.minBody !== undefined) {
    const passed = extraction.bodyScore >= criteria.minBody;
    checks.push({
      labelEn: "Body / Mouthfeel",
      labelTh: "เนื้อสัมผัส (Body)",
      passed,
      currentValue: extraction.bodyScore.toFixed(1),
      targetValue: `≥ ${criteria.minBody.toFixed(1)}`,
    });
  }

  if (criteria.minClarity !== undefined) {
    const passed = extraction.clarityScore >= criteria.minClarity;
    checks.push({
      labelEn: "Clarity Score",
      labelTh: "ความใสบริสุทธิ์",
      passed,
      currentValue: extraction.clarityScore.toFixed(1),
      targetValue: `≥ ${criteria.minClarity.toFixed(1)}`,
    });
  }

  if (criteria.requiredCategory) {
    const hasCategory = blendInputs.some(
      (b) => b.ratioPercent > 0 && (b.ingredient.category === criteria.requiredCategory || (criteria.requiredCategory === "GREEN" && b.ingredient.category === "WHITE"))
    );
    checks.push({
      labelEn: `Required Botanical (${criteria.requiredCategory})`,
      labelTh: `ต้องมีใบชาหมวด (${criteria.requiredCategory})`,
      passed: hasCategory,
      currentValue: hasCategory ? "Included" : "Missing",
      targetValue: criteria.requiredCategory,
    });
  }

  if (criteria.minTempC !== undefined) {
    const passed = waterTempC >= criteria.minTempC;
    checks.push({
      labelEn: "Water Temperature Min",
      labelTh: "อุณหภูมิน้ำขั้นต่ำ",
      passed,
      currentValue: `${waterTempC}°C`,
      targetValue: `≥ ${criteria.minTempC}°C`,
    });
  }

  if (criteria.maxTempC !== undefined) {
    const passed = waterTempC <= criteria.maxTempC;
    checks.push({
      labelEn: "Water Temperature Max",
      labelTh: "อุณหภูมิน้ำสูงสุด",
      passed,
      currentValue: `${waterTempC}°C`,
      targetValue: `≤ ${criteria.maxTempC}°C`,
    });
  }

  const passedCount = checks.filter((c) => c.passed).length;
  const scorePercent = Math.round((passedCount / checks.length) * 100);
  const isPassed = scorePercent === 100;

  return {
    isPassed,
    scorePercent,
    checks,
  };
}

export function isDailyQuestCompleted(questId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(`kissa_quest_done_${questId}`) === "true";
  } catch {
    return false;
  }
}

export function markDailyQuestCompleted(questId: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`kissa_quest_done_${questId}`, "true");
  } catch (e) {
    console.error(e);
  }
}

// ==========================================
// 2. TEA MASTER CERTIFICATION EXAM SYSTEM
// ==========================================

export type ExamTier = "APPRENTICE" | "ARTISAN" | "GRAND_MASTER";

export interface ExamQuestion {
  id: string;
  questionEn: string;
  questionTh: string;
  optionsEn: string[];
  optionsTh: string[];
  correctIndex: number;
  explanationEn: string;
  explanationTh: string;
}

export interface PracticalChallenge {
  titleEn: string;
  titleTh: string;
  promptEn: string;
  promptTh: string;
  criteria: DailyQuestCriteria;
}

export interface ExamTierData {
  tier: ExamTier;
  titleEn: string;
  titleTh: string;
  japaneseTitle: string;
  badge: string;
  descriptionEn: string;
  descriptionTh: string;
  color: string;
  questions: ExamQuestion[];
  practicalChallenge: PracticalChallenge;
}

export const EXAM_TIERS: Record<ExamTier, ExamTierData> = {
  APPRENTICE: {
    tier: "APPRENTICE",
    titleEn: "Novice Steeper (Level 1)",
    titleTh: "ผู้ฝึกหัดชงชา (ระดับ 1)",
    japaneseTitle: "初伝 茶道見習い",
    badge: "🌱",
    color: "#059669",
    descriptionEn: "Master the foundational physics of water temperature, tannin extraction, and leaf categories.",
    descriptionTh: "เรียนรู้พื้นฐานอุณหภูมิของน้ำ สารแทนนิน และการแยกแยะหมวดหมู่ของใบชา",
    questions: [
      {
        id: "q1_1",
        questionEn: "Why is water temperature typically kept between 70°C–80°C for delicate Japanese Green Teas?",
        questionTh: "เหตุใดการชงชาเขียวญี่ปุ่นคุณภาพสูงจึงควรใช้อุณหภูมิน้ำประมาณ 70°C–80°C?",
        optionsEn: [
          "To speed up steeping time to under 10 seconds",
          "To extract sweet amino acids (L-Theanine) while preventing excessive bitter tannins",
          "Because green tea leaves cannot absorb warm water above 80°C",
          "To make the tea color turn dark amber",
        ],
        optionsTh: [
          "เพื่อเร่งเวลาการสกัดให้เสร็จภายใน 10 วินาที",
          "เพื่อดึงกรดอะมิโนแอล-ธีอะนีนรสหวาน โดยไม่ให้สารแทนนินฝาดขมละลายออกมามากเกินไป",
          "เพราะใบชาเขียวไม่สามารถดูดซึมน้ำที่ร้อนกว่า 80°C ได้",
          "เพื่อทำให้น้ำชาเปลี่ยนเป็นสีอำพันเข้ม",
        ],
        correctIndex: 1,
        explanationEn: "Amino acids extract at lower temperatures, whereas bitter catechins extract rapidly at boiling temperatures.",
        explanationTh: "กรดอะมิโนรสหวานละลายได้ดีที่อุณหภูมิต่ำ ขณะที่สารคาเทชินและแทนนินรสฝาดจะถูกสกัดออกมาอย่างรวดเร็วที่จุดเดือด",
      },
      {
        id: "q1_2",
        questionEn: "What primary chemical compounds in tea leaves are responsible for astringency and drying mouthfeel?",
        questionTh: "สารประกอบชนิดใดในใบชาที่มีบทบาทหลักในการทำให้เกิดรสฝาดและอาการแห้งสากในปาก?",
        optionsEn: [
          "Tannins and Polyphenols",
          "Natural Fructose sugars",
          "Essential floral oils",
          "Chlorophyll pigment",
        ],
        optionsTh: [
          "สารแทนนินและโพลีฟีนอล (Tannins & Polyphenols)",
          "น้ำตาลฟรักโทสธรรมชาติ",
          "น้ำมันหอมระเหยจากดอกไม้",
          "สารคลอโรฟิลล์สีเขียว",
        ],
        correctIndex: 0,
        explanationEn: "Tannins bind to salivary proteins in the mouth, causing lubrication reduction and the tactile dry astringent sensation.",
        explanationTh: "แทนนินจะจับตัวกับโปรตีนในน้ำลาย ทำให้ความลื่นในช่องปากลดลงจนเกิดความรู้สึกฝาดสากคอ",
      },
    ],
    practicalChallenge: {
      titleEn: "The Balanced Morning Dew",
      titleTh: "ชาหยาดน้ำค้างยามเช้า",
      promptEn: "Craft a gentle morning tea with natural Sweetness ≥ 5.5 and Bitterness ≤ 3.5 using water temperature ≤ 85°C.",
      promptTh: "ผสมและสกัดชาที่เน้นความหวานธรรมชาติ ≥ 5.5 และความขม ≤ 3.5 โดยใช้อุณหภูมิไม่เกิน 85°C",
      criteria: {
        minSweetness: 5.5,
        maxBitterness: 3.5,
        maxTempC: 85,
      },
    },
  },

  ARTISAN: {
    tier: "ARTISAN",
    titleEn: "Artisan Sommelier (Level 2)",
    titleTh: "ช่างชาผู้เชี่ยวชาญ (ระดับ 2)",
    japaneseTitle: "中伝 茶匠専門士",
    badge: "🫖",
    color: "#d97706",
    descriptionEn: "Deep dive into oxidation chemistry, high-mountain Oolong terroirs, and multi-layered body extraction.",
    descriptionTh: "เจาะลึกปฏิกิริยาออกซิเดชัน แหล่งกำเนิดชาภูเขาสูง และการบาลานซ์บอดี้ของน้ำชา",
    questions: [
      {
        id: "q2_1",
        questionEn: "What key biological transformation distinguishes Oolong tea from completely non-oxidized Green tea and fully oxidized Black tea?",
        questionTh: "ปฏิกิริยาเคมีทางชีวภาพใดที่เป็นตัวกำหนดความแตกต่างระหว่างชาอู่หลง ชาเขียว และชาดำ?",
        optionsEn: [
          "Enzymatic oxidation controlled at partial levels (15%–70%)",
          "The amount of sugar added during the sun-withering process",
          "Whether the tea bush was grown in sea water",
          "Deep roasting in an electric microwave",
        ],
        optionsTh: [
          "การควบคุมการเกิดปฏิกิริยาออกซิเดชันด้วยเอนไซม์ให้อยู่ในระดับกึ่งหนึ่ง (15%–70%)",
          "ปริมาณน้ำตาลที่เติมเข้าไปในขั้นตอนการผึ่งแดด",
          "การปลูกต้นชาด้วยน้ำทะเล",
          "การนำไปอบในไมโครเวฟความร้อนสูง",
        ],
        correctIndex: 0,
        explanationEn: "Oolong is semi-oxidized, creating a vast spectrum from floral green oolongs to dark fruity charcoal oolongs.",
        explanationTh: "ชาอู่หลงคือชากึ่งหมัก (Semi-oxidized) ทำให้เกิดเฉดรสชาติตั้งแต่กลิ่นดอกไม้สดไปจนถึงกลิ่นผลไม้สุกและคาราเมล",
      },
      {
        id: "q2_2",
        questionEn: "How does L-Theanine interact with caffeine in high-grade specialty teas?",
        questionTh: "สารแอล-ธีอะนีน (L-Theanine) ทำงานร่วมกับคาเฟอีนในใบชาชั้นดีอย่างไร?",
        optionsEn: [
          "It completely neutralizes caffeine into water molecules",
          "It crosses the blood-brain barrier to modulate caffeine absorption, inducing alert calm without jittery spikes",
          "It doubles the heart rate response",
          "It converts the liquid into alcoholic compounds",
        ],
        optionsTh: [
          "ทำลายโมเลกุลคาเฟอีนให้กลายเป็นน้ำบริสุทธิ์",
          "ซึมผ่านแนวกั้นสมองเพื่อชะลอการดูดซึมคาเฟอีน ส่งเสริมคลื่นสมอง Alpha ให้เกิดสมาธิสงบโดยไม่ใจสั่น",
          "เร่งอัตราการเต้นของหัวใจเป็นสองเท่า",
          "เปลี่ยนโมเลกุลของน้ำชาให้กลายเป็นแอลกอฮอล์",
        ],
        correctIndex: 1,
        explanationEn: "L-Theanine creates a state of relaxed alertness and sustained focus, avoiding the sharp crash associated with coffee.",
        explanationTh: "แอล-ธีอะนีนช่วยให้สมองตื่นตัวอย่างผ่อนคลายและมีสมาธิต่อเนื่องโดยไม่เกิดอาการวูบดิ่งหลังหมดฤทธิ์คาเฟอีน",
      },
    ],
    practicalChallenge: {
      titleEn: "High-Mountain Floral Body",
      titleTh: "ชาหอมยอดเขาสูงเนื้อแน่น",
      promptEn: "Formulate a blend boasting intense Aroma ≥ 7.0 and substantial Body ≥ 6.0 with Sweetness ≥ 6.0.",
      promptTh: "ผสมชาที่ให้กลิ่นหอมกระจายตัว ≥ 7.0 มีเนื้อสัมผัส (Body) ≥ 6.0 และมีความหวาน ≥ 6.0",
      criteria: {
        minAroma: 7.0,
        minBody: 6.0,
        minSweetness: 6.0,
      },
    },
  },

  GRAND_MASTER: {
    tier: "GRAND_MASTER",
    titleEn: "Grand Tea Master (Level 3)",
    titleTh: "ปรมาจารย์แห่งวิถีชา (ระดับ 3)",
    japaneseTitle: "皆伝 永世茶聖",
    badge: "🏆",
    color: "#b45309",
    descriptionEn: "The pinnacle of tea alchemy. Harmonize all 5 sensory dimensions into the legendary Golden Ratio.",
    descriptionTh: "จุดสูงสุดแห่งศาสตร์การสกัดชา ผสมผสานทั้ง 5 มิติสัมผัสให้เข้าสู่สัดส่วนทองคำ",
    questions: [
      {
        id: "q3_1",
        questionEn: "In specialty tea extraction science, how does Total Dissolved Solids (TDS) and Extraction Yield guide the evaluation of 'Under-extracted' vs 'Over-extracted' liquor?",
        questionTh: "ในทางวิทยาศาสตร์การสกัดชา ค่า TDS และ Extraction Yield บ่งชี้ภาวะสกัดน้อยเกินไป (Under) หรือมากเกินไป (Over) อย่างไร?",
        optionsEn: [
          "TDS measures dissolved organic solids; under-extraction results in thin sour notes, while over-extraction yields harsh astringent polyphenols",
          "TDS only measures water boiling bubbles and has no relation to taste",
          "High TDS always guarantees the sweetest possible cup",
          "Over-extraction makes tea turn completely colorless",
        ],
        optionsTh: [
          "TDS วัดปริมาณของแข็งที่สกัดลงในน้ำ; การสกัดน้อยเกินไปจะทำให้ชาจืดและเปรี้ยวแหลม ส่วนการสกัดมากเกินไปจะดึงโพลีฟีนอลฝาดขมสากคอออกมา",
          "TDS วัดแค่ฟองเดือดของน้ำ ไม่มีความเกี่ยวข้องกับรสชาติ",
          "TDS ที่สูงมากๆ จะรับประกันว่าชามีรสหวานที่สุดเสมอ",
          "การสกัดมากเกินไปจะทำให้น้ำชากลายเป็นน้ำเปล่าไร้สี",
        ],
        correctIndex: 0,
        explanationEn: "Optimal extraction balances volatile aroma compounds, sugars, and palatable body before harsh heavy tannins overwhelm the liquor.",
        explanationTh: "การสกัดที่สมบูรณ์แบบต้องดึงสารหอมระเหย น้ำตาลธรรมชาติ และเนื้อสัมผัสที่พอเหมาะ ก่อนที่สารแทนนินโมเลกุลใหญ่จะละลายออกมาทำลายรสชาติ",
      },
      {
        id: "q3_2",
        questionEn: "What defines 'Cha Qi' (茶气 - Tea Energy) in classical Gongfu tea philosophy?",
        questionTh: "คำว่า 'ชาชี่' (Cha Qi - พลังแห่งชา) ในปรัชญากงฟูฉาแบบดั้งเดิมหมายถึงอะไร?",
        optionsEn: [
          "The physiological and mindful resonance—warmth, back relaxation, and heightened clarity—experienced from ancient arbor teas",
          "The steam pressure created inside an iron kettle",
          "Artificial carbon dioxide gas pumped into cold tea bottles",
          "The price tag printed on vintage tea packaging",
        ],
        optionsTh: [
          "ปฏิกิริยาทางกายและจิตใจ เช่น ความอบอุ่นที่แผ่ซ่านตามกระดูกสันหลัง ความผ่อนคลายลึก และจิตที่ตื่นรู้จากการดื่มชาต้นโบราณ",
          "แรงดันไอน้ำที่เกิดขึ้นภายในกาน้ำชาเหล็ก",
          "ก๊าซคาร์บอนไดออกไซด์ที่อัดเข้าไปในขวดชาพร้อมดื่ม",
          "ป้ายราคาและปีที่พิมพ์บนห่อใบชาเก่า",
        ],
        correctIndex: 0,
        explanationEn: "Cha Qi reflects the holistic sensory, neurological, and bodily sensation induced by superior terroir and pristine ancient tea chemistry.",
        explanationTh: "ชาชี่คือประสบการณ์การรับรู้แบบองค์รวม ทั้งทางระบบประสาทและความรู้สึกอุ่นสบายในร่างกายที่เกิดจากใบชาคุณภาพเยี่ยม",
      },
    ],
    practicalChallenge: {
      titleEn: "The Golden Harmony Elixir",
      titleTh: "โอสถสารแห่งสัดส่วนทองคำ",
      promptEn: "Achieve the elusive Golden Balance: Sweetness ≥ 6.8, Aroma ≥ 7.5, Clarity ≥ 6.0, and Bitterness ≤ 3.8.",
      promptTh: "บรรลุความสมดุลทองคำ: ความหวาน ≥ 6.8, กลิ่นหอม ≥ 7.5, ความใสบริสุทธิ์ ≥ 6.0 และความขม ≤ 3.8",
      criteria: {
        minSweetness: 6.8,
        minAroma: 7.5,
        minClarity: 6.0,
        maxBitterness: 3.8,
      },
    },
  },
};

export interface CertificateRecord {
  tier: ExamTier;
  candidateName: string;
  certificateId: string;
  issueDate: string;
  scorePercent: number;
}

export function getIssuedCertificates(): Record<ExamTier, CertificateRecord | null> {
  if (typeof window === "undefined") {
    return { APPRENTICE: null, ARTISAN: null, GRAND_MASTER: null };
  }
  try {
    const raw = localStorage.getItem("kissa_tea_master_certificates");
    if (!raw) return { APPRENTICE: null, ARTISAN: null, GRAND_MASTER: null };
    return JSON.parse(raw);
  } catch {
    return { APPRENTICE: null, ARTISAN: null, GRAND_MASTER: null };
  }
}

export function saveIssuedCertificate(cert: CertificateRecord): void {
  if (typeof window === "undefined") return;
  try {
    const current = getIssuedCertificates();
    current[cert.tier] = cert;
    localStorage.setItem("kissa_tea_master_certificates", JSON.stringify(current));
  } catch (err) {
    console.error("Failed to save certificate:", err);
  }
}
