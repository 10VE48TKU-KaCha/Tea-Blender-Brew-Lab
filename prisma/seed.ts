import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🍵 Seeding Kissa Lab database...");

  // Clear existing data
  await prisma.blendItem.deleteMany();
  await prisma.recipe.deleteMany();
  await prisma.teaIngredient.deleteMany();

  // Seed tea ingredients
  const ingredients = await Promise.all([
    prisma.teaIngredient.create({
      data: {
        name: "Assam Black",
        category: "BLACK",
        baseColor: "#8B4513",
        bodyScore: 9,
        tanninScore: 8,
        aromaScore: 6,
      },
    }),
    prisma.teaIngredient.create({
      data: {
        name: "Sencha Green",
        category: "GREEN",
        baseColor: "#9ACD32",
        bodyScore: 4,
        tanninScore: 5,
        aromaScore: 7,
      },
    }),
    prisma.teaIngredient.create({
      data: {
        name: "High Mountain Oolong",
        category: "OOLONG",
        baseColor: "#DAA520",
        bodyScore: 6,
        tanninScore: 4,
        aromaScore: 9,
      },
    }),
    prisma.teaIngredient.create({
      data: {
        name: "Chamomile Herbal",
        category: "HERBAL",
        baseColor: "#F0E68C",
        bodyScore: 2,
        tanninScore: 1,
        aromaScore: 8,
      },
    }),
  ]);

  console.log(`✅ Seeded ${ingredients.length} tea ingredients:`);
  ingredients.forEach((ing) => {
    console.log(`   ${ing.name} (${ing.category}) — Color: ${ing.baseColor}`);
  });

  console.log("\n🎉 Seeding complete!");
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
