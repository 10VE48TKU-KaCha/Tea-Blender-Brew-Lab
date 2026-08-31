export type Language = "en" | "th";

export interface TranslationDictionary {
  // Navigation & General
  navLab: string;
  navRecipes: string;
  navSubtitle: string;
  langToggle: string;

  // Lab Hero
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;

  // Preset Bar
  presetBookTitle: string;
  presetBookSubtitle: string;
  presetKyotoSpring: { name: string; badge: string; desc: string };
  presetRoyalVelvet: { name: string; badge: string; desc: string };
  presetTokyoZen: { name: string; badge: string; desc: string };
  presetMountainFog: { name: string; badge: string; desc: string };
  presetMidnightLullaby: { name: string; badge: string; desc: string };
  presetNordicBerry: { name: string; badge: string; desc: string };
  presetGoldenRooibos: { name: string; badge: string; desc: string };
  presetPersianSaffron: { name: string; badge: string; desc: string };

  // Pantry & Filters
  pantryTitle: string;
  searchPlaceholder: string;
  showOnlyActive: string;
  resetBlend: string;
  catAll: string;
  catBlack: string;
  catGreen: string;
  catOolong: string;
  catWhite: string;
  catHerbal: string;
  noTeasFound: string;
  tryAdjustingFilter: string;

  // Brew Parameters
  brewParamsTitle: string;
  waterTemp: string;
  steepingTime: string;
  waterAmount: string;
  tempHint: string;
  timeHint: string;
  waterHint: string;

  // Serving Styles & Garnishes
  servingStyleMode: string;
  styleHot: string;
  styleHotDesc: string;
  styleIced: string;
  styleIcedDesc: string;
  styleLatte: string;
  styleLatteDesc: string;
  latteFoamArt: string;
  artBear: string;
  artHeart: string;
  botanicalAddins: string;
  selectedCount: string;
  garnishOsmanthus: string;
  garnishRose: string;
  garnishCinnamon: string;
  garnishHoney: string;

  // Profiler & Sensory
  profilerTitle: string;
  sweetness: string;
  aroma: string;
  body: string;
  bitterness: string;
  clarity: string;
  startLiveBrew: string;
  createPostcard: string;
  recipeNamePlaceholder: string;
  saveRecipe: string;
  saving: string;
  savedSuccess: string;
  craftYourFirstBlend: string;

  // Sommelier & Pairings
  sommelierTitle: string;
  sommelierSubtitle: string;
  foodPairingTitle: string;
  foodPairingSubtitle: string;
  noBlendSelectedPrompt: string;

  // Zen Brew Modal
  zenSteepingProcess: string;
  muteSounds: string;
  unmuteSounds: string;
  steepingComplete: string;
  steepingCompleteDesc: string;
  startSteep: string;
  resumeSteep: string;
  pauseSteep: string;
  resetTimer: string;
  enjoyTea: string;
  phaseAwakening: string;
  phaseUnfurling: string;
  phaseAromas: string;
  phaseHarmony: string;
  phasePerfected: string;
  zenQuotes: string[];

  // Postcard Modal
  postcardTitle: string;
  postcardSubtitle: string;
  postcardDate: string;
  postcardBlendRatio: string;
  postcardSensoryMap: string;
  postcardSommelierNote: string;
  downloadPostcard: string;
  copyCardLink: string;
  linkCopied: string;

  // Recipe Archive & Details
  archiveTitle: string;
  archiveSubtitle: string;
  noRecipesYet: string;
  beTheFirstToCraft: string;
  goToLab: string;
  backToArchive: string;
  flavorProfile: string;
  blendComposition: string;
  createdOn: string;
  tastingNotesTitle: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    navLab: "Lab",
    navRecipes: "Recipes",
    navSubtitle: "Specialty Tea Profiler",
    langToggle: "ภาษาไทย",

    heroBadge: "World Specialty Tea Laboratory • 1,000+ Unique Possibilities",
    heroTitle: "Tea Blending Lab",
    heroSubtitle:
      "Blend rare leaves from 11 countries, tune extraction physics, and discover custom sensory profiles",

    presetBookTitle: "Signature Blend Book",
    presetBookSubtitle:
      "Crafted by Kissa Tea Masters • Click any preset to instantly pour its ratio & brew parameters",
    presetKyotoSpring: {
      name: "Kyoto Spring Mist",
      badge: "Light & Floral",
      desc: "Japanese Shizuoka Sencha softened with Bavarian chamomile blossoms",
    },
    presetRoyalVelvet: {
      name: "Royal Afternoon Velvet",
      badge: "Malty & Bold",
      desc: "Malty Indian Assam tips harmonized with creamy Alishan oolong",
    },
    presetTokyoZen: {
      name: "Tokyo Emerald Zen",
      badge: "Rich Umami",
      desc: "Kyoto ceremonial Uji matcha and toasty roasted Hojicha",
    },
    presetMountainFog: {
      name: "Alishan High Mountain Fog",
      badge: "Orchid Floral",
      desc: "High altitude Taiwanese oolong with crystalline Chinese Silver Needle",
    },
    presetMidnightLullaby: {
      name: "Provence Midnight Serenade",
      badge: "Caffeine-Free",
      desc: "Soothing French lavender and chamomile with honey swirl",
    },
    presetNordicBerry: {
      name: "Nordic Berry Hearth",
      badge: "Ruby Tart & Sweet",
      desc: "Hibiscus calyxes with wild elderberry and sweet cinnamon",
    },
    presetGoldenRooibos: {
      name: "Cape Golden Rooibos Glow",
      badge: "Honeyed & Earthy",
      desc: "South African red cedar rooibos layered with sweet osmanthus",
    },
    presetPersianSaffron: {
      name: "Persian Saffron Mirage",
      badge: "Regal & Spiced",
      desc: "Smoky Lapsang and black teas crowned with golden saffron threads",
    },

    pantryTitle: "World Tea Pantry",
    searchPlaceholder: "Search tea origin, type or name...",
    showOnlyActive: "Active in Blend",
    resetBlend: "Reset All",
    catAll: "All Teas",
    catBlack: "Black",
    catGreen: "Green",
    catOolong: "Oolong",
    catWhite: "White",
    catHerbal: "Herbal",
    noTeasFound: "No teas match your search criteria.",
    tryAdjustingFilter: "Try adjusting filters or search query",

    brewParamsTitle: "Extraction Physics Parameters",
    waterTemp: "Water Temperature",
    steepingTime: "Steeping Time",
    waterAmount: "Water Amount",
    tempHint: "Higher temp boosts polyphenols & tannins; lower temp enhances amino acids & sweetness.",
    timeHint: "Time drives extraction yield. Extended steeping increases body and astringency.",
    waterHint: "Adjusts concentration and sensory balance of the cup.",

    servingStyleMode: "Serving Style Mode",
    styleHot: "Hot Brew",
    styleHotDesc: "Chubby ceramic",
    styleIced: "Iced Glass",
    styleIcedDesc: "Crystal tumbler",
    styleLatte: "Tea Latte",
    styleLatteDesc: "Layered & foam art",
    latteFoamArt: "Latte Foam Art",
    artBear: "Cute Foam Bear",
    artHeart: "Rosetta Heart",
    botanicalAddins: "Botanical Floating Add-ins",
    selectedCount: "selected",
    garnishOsmanthus: "Osmanthus",
    garnishRose: "Rose Petals",
    garnishCinnamon: "Cinnamon",
    garnishHoney: "Honey Swirl",

    profilerTitle: "Sensory Extraction Profile",
    sweetness: "Sweetness",
    aroma: "Aroma",
    body: "Body",
    bitterness: "Bitterness",
    clarity: "Clarity",
    startLiveBrew: "Start Live Zen Brew",
    createPostcard: "Tea Postcard",
    recipeNamePlaceholder: "Name this signature blend...",
    saveRecipe: "Save Blend",
    saving: "Saving...",
    savedSuccess: "Saved to Recipe Archive!",
    craftYourFirstBlend: "Adjust ingredients above to preview live cup extraction",

    sommelierTitle: "Sommelier Tasting Notes & Insights",
    sommelierSubtitle: "Professional sensory analysis tailored to your current brew parameters",
    foodPairingTitle: "Curated Food & Pastry Pairings",
    foodPairingSubtitle: "Delicacies that harmonize with this cup's unique aroma and body",
    noBlendSelectedPrompt: "Blend at least one tea ingredient to unlock Sommelier advice",

    zenSteepingProcess: "Zen Steeping Process",
    muteSounds: "Mute sounds",
    unmuteSounds: "Unmute sounds",
    steepingComplete: "Steeping Complete! Take your warm, soothing sip. 🍵",
    steepingCompleteDesc: "Your tea has reached its peak extraction harmony.",
    startSteep: "Start Steep",
    resumeSteep: "Resume",
    pauseSteep: "Pause",
    resetTimer: "Reset Timer",
    enjoyTea: "Enjoy Tea",
    phaseAwakening: "💧 Awakening the leaves",
    phaseUnfurling: "🍃 Gentle leaf unfurling",
    phaseAromas: "✨ Rich aromas blooming",
    phaseHarmony: "🫖 Flavor harmony peaking",
    phasePerfected: "🍵 Infusion Perfected",
    zenQuotes: [
      "“Water is the mother of tea, a teapot its father, and fire the teacher.”",
      "“Drink your tea slowly and reverently, as if it is the axis on which the world revolves.”",
      "“There is poetry in a cup of tea, steeped gently with patience and care.”",
      "“Listen to the water singing softly in the kettle; every second deepens the flavor.”",
      "“Quiet your mind, let the leaves unfurl their quiet fragrant secrets.”",
    ],

    postcardTitle: "Artisan Tea Postcard",
    postcardSubtitle: "Share your custom tea creation with fellow tea enthusiasts",
    postcardDate: "Brew Date",
    postcardBlendRatio: "Blend Ratios",
    postcardSensoryMap: "Sensory Profile",
    postcardSommelierNote: "Master Sommelier Note",
    downloadPostcard: "Download Postcard",
    copyCardLink: "Copy Link",
    linkCopied: "Link Copied!",

    archiveTitle: "Recipe Archive",
    archiveSubtitle: "Explore community & signature handcrafted tea blends",
    noRecipesYet: "No recipes yet",
    beTheFirstToCraft: "Be the first to craft a cozy blend!",
    goToLab: "Go to Blending Lab",
    backToArchive: "Back to Archive",
    flavorProfile: "Flavor Profile",
    blendComposition: "Blend Composition",
    createdOn: "Created on",
    tastingNotesTitle: "Tasting Notes & Origin",
  },

  th: {
    navLab: "ห้องผสมชา",
    navRecipes: "คลังสูตรชา",
    navSubtitle: "เครื่องมือวิเคราะห์และจำลองการชงชา",
    langToggle: "English",

    heroBadge: "ห้องทดลองการผสมชาสากล • ความเป็นไปได้มากกว่า 1,000 รูปแบบ",
    heroTitle: "ห้องผสมและจำลองการชงชา",
    heroSubtitle:
      "ผสมผสานใบชาหายากจาก 11 ประเทศ ปรับแต่งฟิสิกส์การสกัด และค้นพบโปรไฟล์รสชาติเฉพาะตัวของคุณ",

    presetBookTitle: "ตำรับชาสูตรซิกเนเจอร์",
    presetBookSubtitle:
      "รังสรรค์โดยมาสเตอร์ทีเบลนเดอร์ • คลิกเพื่อโหลดสัดส่วนและพารามิเตอร์การชงทันที",
    presetKyotoSpring: {
      name: "หมอกฤดูใบไม้ผลิเกียวโต",
      badge: "หอมละมุนดอกไม้ & บางเบา",
      desc: "ชาเขียวเซนฉะชิซูโอกะผสานความนุ่มนวลจากดอกคาโมมายล์บาวาเรีย",
    },
    presetRoyalVelvet: {
      name: "รอยัลแอฟเทอร์นูนเวลเวต",
      badge: "เข้มข้นกลิ่นมอลต์ & หรูหรา",
      desc: "ยอดชายอดทองอัสสัมอินเดียผสานอู่หลงอาลีซานเนื้อเนียนนุ่ม",
    },
    presetTokyoZen: {
      name: "โตเกียวมรกตเซน",
      badge: "อูมามิเข้มข้น",
      desc: "มัทฉะเกรดพิธีการอูจิเกียวโตและโฮจิฉะคั่วหอมกรุ่น",
    },
    presetMountainFog: {
      name: "สายหมอกยอดเขาอาลีซาน",
      badge: "หอมดอกกล้วยไม้ป่า",
      desc: "ชาอู่หลงภูเขาสูงไต้หวันผสานชาขาวเข็มเงินประกายคริสตัลฝูเจี้ยน",
    },
    presetMidnightLullaby: {
      name: "บทเพลงราตรีโพรวองซ์",
      badge: "ไร้คาเฟอีน คลายกังวล",
      desc: "ลาเวนเดอร์ฝรั่งเศสผ่อนคลายและคาโมมายล์พร้อมละอองน้ำผึ้งแท้",
    },
    presetNordicBerry: {
      name: "ไออุ่นเบอร์รี่นอร์ดิก",
      badge: "เปรี้ยวอมหวานสีทับทิม",
      desc: "กระเจี๊ยบแดงป่าและเอลเดอร์เบอร์รี่ เพิ่มความอบอุ่นด้วยอบเชยแท่ง",
    },
    presetGoldenRooibos: {
      name: "รอยบอสสีทองอร่าม",
      badge: "กลิ่นน้ำผึ้ง & กลิ่นพฤกษา",
      desc: "ชารอยบอสแดงแอฟริกาใต้ผสานดอกหอมหมื่นลี้สีทองอร่าม",
    },
    presetPersianSaffron: {
      name: "ภาพลวงตาสะท้อนแซฟฟรอนเปอร์เซีย",
      badge: "รสชาติกษัตริย์ & เครื่องเทศ",
      desc: "ชาดำรมควันและชาดำชั้นยอด ประดับด้วยหญ้าฝรั่นแซฟฟรอนสีทอง",
    },

    pantryTitle: "คลังใบชาจากทั่วโลก",
    searchPlaceholder: "ค้นหาตามชื่อชา แหล่งกำเนิด หรือประเภท...",
    showOnlyActive: "แสดงเฉพาะที่เลือก",
    resetBlend: "ล้างทั้งหมด",
    catAll: "ชาทั้งหมด",
    catBlack: "ชาดำ",
    catGreen: "ชาเขียว",
    catOolong: "ชาอู่หลง",
    catWhite: "ชาขาว",
    catHerbal: "ชาสมุนไพร",
    noTeasFound: "ไม่พบใบชาที่ตรงกับคำค้นหา",
    tryAdjustingFilter: "ลองปรับตัวกรองหรือคำค้นหาใหม่",

    brewParamsTitle: "พารามิเตอร์การสกัดชา",
    waterTemp: "อุณหภูมิน้ำ",
    steepingTime: "เวลาในการชง",
    waterAmount: "ปริมาณน้ำ",
    tempHint: "อุณหภูมิสูงช่วยสกัดแทนนินและกลิ่นลึก อุณหภูมิต่ำช่วยรักษาความหวานและกรดอะมิโน",
    timeHint: "ระยะเวลาชงช่วยดึงบอดี้และสารสกัด ยิ่งชงนานรสชาติยิ่งเข้มข้นและฝาดขึ้น",
    waterHint: "ควบคุมความเข้มข้นและความสมดุลของรสสัมผัสในถ้วยชา",

    servingStyleMode: "สไตล์การเสิร์ฟ",
    styleHot: "ชาร้อนดั้งเดิม",
    styleHotDesc: "ถ้วยเซรามิกหนานุ่ม",
    styleIced: "ชาเย็นใส่น้ำแข็ง",
    styleIcedDesc: "แก้วคริสตัลใส",
    styleLatte: "ชาทีลาเต้",
    styleLatteDesc: "ฟองนมนุ่ม & ลาเต้อาร์ต",
    latteFoamArt: "ศิลปะฟองนมลาเต้",
    artBear: "น้องหมีฟองนมนุ่ม",
    artHeart: "หัวใจโรเซตต้า",
    botanicalAddins: "ท็อปปิ้งพฤกษศาสตร์ลอยน้ำ",
    selectedCount: "รายการที่เลือก",
    garnishOsmanthus: "ดอกหอมหมื่นลี้",
    garnishRose: "กลีบกุหลาบ",
    garnishCinnamon: "แท่งอบเชย",
    garnishHoney: "น้ำผึ้งแท้",

    profilerTitle: "มิติรสสัมผัสและโปรไฟล์การสกัด",
    sweetness: "ความหวานละมุน",
    aroma: "กลิ่นหอมฟุ้ง",
    body: "ความเข้มข้นบอดี้",
    bitterness: "ความฝาด/ขม",
    clarity: "ความใสบริสุทธิ์",
    startLiveBrew: "เริ่มชงแบบเซนสดๆ",
    createPostcard: "สร้างโปสการ์ดชา",
    recipeNamePlaceholder: "ตั้งชื่อสูตรชาของคุณ...",
    saveRecipe: "บันทึกสูตรนี้",
    saving: "กำลังบันทึก...",
    savedSuccess: "บันทึกลงคลังสูตรเรียบร้อยแล้ว!",
    craftYourFirstBlend: "ปรับสัดส่วนใบชาด้านบนเพื่อดูการจำลองสีและรสสัมผัสของน้ำชา",

    sommelierTitle: "คำแนะนำจากซอมเมลิเยร์ผู้เชี่ยวชาญ",
    sommelierSubtitle: "การวิเคราะห์มิติรสสัมผัสที่ปรับตามพารามิเตอร์การชงจริงของคุณ",
    foodPairingTitle: "ของว่างและขนมที่จับคู่ได้อย่างลงตัว",
    foodPairingSubtitle: "ขนมหวานและของว่างคัดสรรที่ช่วยชูรสชาติและบอดี้ของชาแก้วนี้",
    noBlendSelectedPrompt: "เลือกใบชาอย่างน้อยหนึ่งชนิดเพื่อรับคำแนะนำจากซอมเมลิเยร์",

    zenSteepingProcess: "พิธีการชงชาแบบเซน",
    muteSounds: "ปิดเสียง",
    unmuteSounds: "เปิดเสียง",
    steepingComplete: "การสกัดชงชาเสร็จสมบูรณ์! ได้เวลาจิบชาร้อนๆ ผ่อนคลายกายใจ 🍵",
    steepingCompleteDesc: "น้ำชาของคุณได้เดินทางมาถึงจุดที่รสชาติและกลิ่นผสานกลมกลืนที่สุดแล้ว",
    startSteep: "เริ่มชง",
    resumeSteep: "ชงต่อ",
    pauseSteep: "พักชั่วคราว",
    resetTimer: "รีเซ็ตเวลา",
    enjoyTea: "ดื่มด่ำกับชา",
    phaseAwakening: "💧 ปลุกใบชาให้ตื่นตัว",
    phaseUnfurling: "🍃 ใบชาเริ่มคลี่ตัวอย่างนุ่มนวล",
    phaseAromas: "✨ กลิ่นหอมอบอวลเริ่มผลิบาน",
    phaseHarmony: "🫖 รสชาติผสานกันอย่างลงตัวสูงสุด",
    phasePerfected: "🍵 รังสรรค์น้ำชาเสร็จสมบูรณ์",
    zenQuotes: [
      "“สายน้ำคือมารดาของชา กาน้ำชาคือบิดา และเปลวไฟคือครูผู้ประสิทธิ์ประสาท”",
      "“จงดื่มชาอย่างช้าๆ และดื่มด่ำ ราวกับว่านี่คือแกนหมุนของโลกทั้งใบ”",
      "“มีบทกวีซ่อนอยู่ในถ้วยชา ทุกหยดที่ค่อยๆ สกัดด้วยความอดทนและความใส่ใจ”",
      "“สดับฟังเสียงน้ำขับขานในกาต้มน้ำ ทุกวินาทีที่ผ่านไป รสชาติยิ่งลึกซึ้ง”",
      "“ทำจิตใจให้สงบนิ่ง แล้วปล่อยให้ใบชาคลี่คลายความหอมลับอันสงบงาม”",
    ],

    postcardTitle: "โปสการ์ดชาฝีมือช่างศิลป์",
    postcardSubtitle: "บันทึกและแบ่งปันสูตรชาเฉพาะตัวของคุณให้คนรักชาได้ชื่นชม",
    postcardDate: "วันที่รังสรรค์",
    postcardBlendRatio: "สัดส่วนการผสม",
    postcardSensoryMap: "แผนผังรสสัมผัส",
    postcardSommelierNote: "บันทึกจากมาสเตอร์ซอมเมลิเยร์",
    downloadPostcard: "ดาวน์โหลดโปสการ์ด",
    copyCardLink: "คัดลอกลิงก์",
    linkCopied: "คัดลอกลิงก์แล้ว!",

    archiveTitle: "คลังสูตรชา",
    archiveSubtitle: "สำรวจสูตรผสมชาจากชุมชนและสูตรชาซิกเนเจอร์อันประณีต",
    noRecipesYet: "ยังไม่มีสูตรชาในคลัง",
    beTheFirstToCraft: "มาเป็นคนแรกที่สร้างสรรค์สูตรชาแสนอบอุ่นกันเถอะ!",
    goToLab: "ไปยังห้องผสมชา",
    backToArchive: "กลับไปยังคลังสูตร",
    flavorProfile: "โปรไฟล์รสชาติ",
    blendComposition: "ส่วนประกอบใบชา",
    createdOn: "สร้างเมื่อวันที่",
    tastingNotesTitle: "โน้ตรสสัมผัสและแหล่งกำเนิด",
  },
};

// Thai translations for World Tea ingredients
export const THAI_INGREDIENT_NAMES: Record<string, string> = {
  "Assam Golden Tips 🇮🇳": "อัสสัมยอดทองคำ 🇮🇳",
  "Darjeeling First Flush 🇮🇳": "ดาร์จีลิ่งฟลัชแรก 🇮🇳",
  "Ceylon Nuwara Eliya 🇱🇰": "ซีลอนนูวาราเอลิยา 🇱🇰",
  "Classic Earl Grey Bergamot 🇬🇧": "เอิร์ลเกรย์เบอร์กามอตคลาสสิก 🇬🇧",
  "Lapsang Souchong Smoky 🇨🇳": "ลาปซางซูชองรมควัน 🇨🇳",
  "Yunnan Vintage Pu-erh 🇨🇳": "ผู่เอ๋อร์วินเทจยูนนาน 🇨🇳",
  "Kyoto Uji Ceremonial Matcha 🇯🇵": "มัทฉะเกรดพิธีการอูจิเกียวโต 🇯🇵",
  "Shizuoka Sencha 🇯🇵": "เซนฉะชิซูโอกะ 🇯🇵",
  "Kyoto Roasted Hojicha 🇯🇵": "โฮจิฉะคั่วเกียวโต 🇯🇵",
  "Argentine Yerba Mate 🇦🇷": "เยอร์บามาเต้อาร์เจนตินา 🇦🇷",
  "Alishan High Mountain Oolong 🇹🇼": "อู่หลงภูเขาสูงอาลีซาน 🇹🇼",
  "Fujian Tie Guan Yin 🇨🇳": "ทิกวนอิมฝูเจี้ยน 🇨🇳",
  "Wuyi Da Hong Pao 🇨🇳": "ต้าหงเผาเขาอู่อี๋ 🇨🇳",
  "Fujian Silver Needle (Baihao) 🇨🇳": "เข็มเงินไป่ห่าวฝูเจี้ยน 🇨🇳",
  "Fujian White Peony (Baimudan) 🇨🇳": "ไป่หมู่ตันโบตั๋นขาว 🇨🇳",
  "Bavarian Chamomile 🇩🇪": "คาโมมายล์บาวาเรีย 🇩🇪",
  "Provence French Lavender 🇫🇷": "ลาเวนเดอร์ฝรั่งเศสโพรวองซ์ 🇫🇷",
  "Egyptian Sun-Dried Hibiscus 🇪🇬": "กระเจี๊ยบแดงตากแห้งอียิปต์ 🇪🇬",
};

// Thai translations for Sommelier notes & Food pairings
export const THAI_FOOD_PAIRINGS: Record<string, { name: string; category: string; reason: string }> = {
  "Devonshire Cream Scones": {
    name: "สโคนครีมเดวอนเชียร์",
    category: "ขนมคลาสสิกอังกฤษ",
    reason: "คล็อตเต็ดครีมเข้มข้นและแยมเบอร์รี่ช่วยตัดความฝาดของแทนนินได้อย่างหมดจด",
  },
  "70% Dark Chocolate Tart": {
    name: "ทาร์ตดาร์กช็อกโกแลต 70%",
    category: "ขนมหวานรสเข้ม",
    reason: "ความเข้มข้นของโกโก้มอลต์เสริมบอดี้ของชาให้หนักแน่นยิ่งขึ้นโดยไม่กลบกัน",
  },
  "White Peach Macaron": {
    name: "มาการองพีชขาว",
    category: "ขนมอบฝรั่งเศส",
    reason: "เมอแรงก์อัลมอนด์และผลไม้หอมหวานช่วยชูกลิ่นดอกไม้ที่กำลังเบ่งบานในชา",
  },
  "Lemon & Thyme Madeleine": {
    name: "มาเดอลีนเลมอนไทม์",
    category: "ขนมอบเนื้อเบา",
    reason: "ความสดชื่นของซิตรัสเข้ากันได้ดีกับความหวานธรรมชาติอย่างนุ่มนวล",
  },
  "Matcha Warabi Mochi": {
    name: "วาราบิโมจิมัทฉะ",
    category: "วากาชิญี่ปุ่น",
    reason: "เนื้อสัมผัสนุ่มเนียนและผงถั่วคินาโกะช่วยเน้นความใสสะอาดบริสุทธิ์ของชา",
  },
  "Earl Grey Financier": {
    name: "ฟินองซิเยร์กลิ่นเอิร์ลเกรย์",
    category: "เค้กเนยอัลมอนด์",
    reason: "เนยสีทองอบและผิวมะกรูดช่วยดึงความหรูหราของชาร้อนให้เด่นชัด",
  },
};
