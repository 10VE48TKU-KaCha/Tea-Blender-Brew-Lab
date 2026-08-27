import { PrismaClient, TeaCategory } from "@prisma/client";

const prisma = new PrismaClient();

interface SeedTea {
  name: string;
  category: TeaCategory;
  baseColor: string;
  bodyScore: number;
  tanninScore: number;
  aromaScore: number;
}

// 18 Legendary World Teas spanning East Asia, South Asia, Europe, Middle East, Africa & Americas
const WORLD_TEAS: SeedTea[] = [
  // === BLACK TEAS ===
  {
    name: "Assam Golden Tips 🇮🇳",
    category: "BLACK",
    baseColor: "#7A3212",
    bodyScore: 9,
    tanninScore: 8,
    aromaScore: 6,
  },
  {
    name: "Darjeeling First Flush 🇮🇳",
    category: "BLACK",
    baseColor: "#C27A3A",
    bodyScore: 5,
    tanninScore: 6,
    aromaScore: 9,
  },
  {
    name: "Ceylon Nuwara Eliya 🇱🇰",
    category: "BLACK",
    baseColor: "#B55B24",
    bodyScore: 7,
    tanninScore: 7,
    aromaScore: 8,
  },
  {
    name: "Classic Earl Grey Bergamot 🇬🇧",
    category: "BLACK",
    baseColor: "#6E381A",
    bodyScore: 7,
    tanninScore: 6,
    aromaScore: 9,
  },
  {
    name: "Lapsang Souchong Smoky 🇨🇳",
    category: "BLACK",
    baseColor: "#422013",
    bodyScore: 9,
    tanninScore: 7,
    aromaScore: 9,
  },
  {
    name: "Yunnan Vintage Pu-erh 🇨🇳",
    category: "BLACK",
    baseColor: "#33190E",
    bodyScore: 10,
    tanninScore: 5,
    aromaScore: 7,
  },

  // === GREEN TEAS ===
  {
    name: "Kyoto Uji Ceremonial Matcha 🇯🇵",
    category: "GREEN",
    baseColor: "#3D6E35",
    bodyScore: 8,
    tanninScore: 6,
    aromaScore: 9,
  },
  {
    name: "Shizuoka Sencha 🇯🇵",
    category: "GREEN",
    baseColor: "#84A951",
    bodyScore: 4,
    tanninScore: 5,
    aromaScore: 7,
  },
  {
    name: "Kyoto Roasted Hojicha 🇯🇵",
    category: "GREEN",
    baseColor: "#8C6541",
    bodyScore: 6,
    tanninScore: 3,
    aromaScore: 8,
  },
  {
    name: "Argentine Yerba Mate 🇦🇷",
    category: "GREEN",
    baseColor: "#6E8B3D",
    bodyScore: 7,
    tanninScore: 8,
    aromaScore: 7,
  },

  // === OOLONG TEAS ===
  {
    name: "Alishan High Mountain Oolong 🇹🇼",
    category: "OOLONG",
    baseColor: "#D4A537",
    bodyScore: 5,
    tanninScore: 4,
    aromaScore: 9,
  },
  {
    name: "Wuyi Da Hong Pao Rock Oolong 🇨🇳",
    category: "OOLONG",
    baseColor: "#8B4513",
    bodyScore: 8,
    tanninScore: 6,
    aromaScore: 9,
  },
  {
    name: "Oriental Beauty Honey Oolong 🇹🇼",
    category: "OOLONG",
    baseColor: "#B86B32",
    bodyScore: 6,
    tanninScore: 4,
    aromaScore: 10,
  },

  // === WHITE TEAS ===
  {
    name: "Fujian Silver Needle (Baihao) 🇨🇳",
    category: "WHITE",
    baseColor: "#D8CEB2",
    bodyScore: 2,
    tanninScore: 2,
    aromaScore: 8,
  },

  // === HERBAL & BOTANICALS ===
  {
    name: "Bavarian Chamomile 🇩🇪",
    category: "HERBAL",
    baseColor: "#E0D268",
    bodyScore: 2,
    tanninScore: 1,
    aromaScore: 8,
  },
  {
    name: "Provence French Lavender 🇫🇷",
    category: "HERBAL",
    baseColor: "#8D7B9D",
    bodyScore: 2,
    tanninScore: 1,
    aromaScore: 10,
  },
  {
    name: "Nile Valley Hibiscus 🇪🇬",
    category: "HERBAL",
    baseColor: "#9E1A34",
    bodyScore: 5,
    tanninScore: 4,
    aromaScore: 8,
  },
  {
    name: "Cederberg Red Rooibos 🇿🇦",
    category: "HERBAL",
    baseColor: "#9E3818",
    bodyScore: 6,
    tanninScore: 2,
    aromaScore: 8,
  },
];

async function main() {
  console.log("🍵 Seeding World Specialty Teas for Kissa Lab...");

  // Clear existing blend items and recipes first to avoid foreign key constraints
  await prisma.blendItem.deleteMany();
  await prisma.recipe.deleteMany();
  await prisma.teaIngredient.deleteMany();

  const created = await Promise.all(
    WORLD_TEAS.map((tea) =>
      prisma.teaIngredient.create({
        data: tea,
      })
    )
  );

  console.log(`✅ Successfully seeded ${created.length} World Specialty Teas:`);
  created.forEach((ing) => {
    console.log(`   • ${ing.name} (${ing.category}) [Color: ${ing.baseColor}]`);
  });

  console.log("\n🎉 World Tea Pantry Seeding Complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
