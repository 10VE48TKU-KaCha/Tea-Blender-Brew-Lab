import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CreateRecipeInputSchema } from "@/types/tea";
import { calculateExtraction } from "@/lib/extraction-engine";
import type { BlendInput } from "@/types/tea";
import {
  DEFAULT_TEA_INGREDIENTS,
  getInMemoryRecipes,
  addInMemoryRecipe,
  EnrichedRecipe,
} from "@/lib/default-tea-data";

export async function GET() {
  try {
    const recipes = await prisma.recipe.findMany({
      include: {
        blendItems: {
          include: {
            ingredient: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    if (recipes && recipes.length > 0) {
      return NextResponse.json(recipes);
    }
    return NextResponse.json(getInMemoryRecipes());
  } catch (error) {
    console.warn("Database unavailable, returning in-memory recipes archive:", error);
    return NextResponse.json(getInMemoryRecipes());
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = CreateRecipeInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const {
      title,
      description,
      waterTempC,
      waterAmountMl,
      steepingTimeSec,
      blendItems,
      renderedHex: clientHex,
      vesselType,
      cupGlaze,
      coasterStyle,
      servingStyle,
      turbidity,
      latteArt,
      garnishes,
    } = parsed.data;

    // Normalize garnishes to JSON string
    let garnishesStr = "[]";
    if (Array.isArray(garnishes)) {
      garnishesStr = JSON.stringify(garnishes);
    } else if (typeof garnishes === "string") {
      garnishesStr = garnishes;
    }

    // Try finding ingredients from DB or fallback
    const ingredientIds = blendItems.map((b) => b.ingredientId);
    let resolvedIngredients: any[] = [];

    try {
      resolvedIngredients = await prisma.teaIngredient.findMany({
        where: { id: { in: ingredientIds } },
      });
    } catch {
      resolvedIngredients = [];
    }

    if (resolvedIngredients.length !== ingredientIds.length) {
      // Look up missing from DEFAULT_TEA_INGREDIENTS
      resolvedIngredients = ingredientIds.map((id) => {
        return (
          resolvedIngredients.find((i) => i.id === id) ||
          DEFAULT_TEA_INGREDIENTS.find((i) => i.id === id || i.name === id) ||
          DEFAULT_TEA_INGREDIENTS[0]
        );
      });
    }

    // Build blend inputs for extraction engine
    const blendInputs: BlendInput[] = blendItems.map((item) => {
      const ingredient = resolvedIngredients.find(
        (i) => i.id === item.ingredientId || i.name === item.ingredientId
      ) || DEFAULT_TEA_INGREDIENTS[0];

      return {
        ingredient: {
          id: ingredient.id,
          name: ingredient.name,
          category: ingredient.category,
          baseColor: ingredient.baseColor,
          bodyScore: ingredient.bodyScore,
          tanninScore: ingredient.tanninScore,
          aromaScore: ingredient.aromaScore,
        },
        ratioPercent: item.ratioPercent,
      };
    });

    // Calculate extraction
    const extraction = calculateExtraction(blendInputs, {
      waterTempC,
      waterAmountMl,
      steepingTimeSec,
    });

    // Try saving to Prisma DB
    try {
      const recipe = await prisma.recipe.create({
        data: {
          title,
          description: description ?? null,
          waterTempC,
          waterAmountMl,
          steepingTimeSec,
          bitternessScore: extraction.bitternessScore,
          aromaScore: extraction.aromaScore,
          sweetnessScore: extraction.sweetnessScore,
          bodyScore: extraction.bodyScore,
          renderedHex: clientHex || extraction.renderedHex,
          vesselType: vesselType || extraction.recommendedVessel || "mug",
          cupGlaze: cupGlaze || extraction.cupGlaze || "earthenware",
          coasterStyle: coasterStyle || "ceramic",
          servingStyle: servingStyle || "hot",
          turbidity: turbidity || extraction.turbidity || "velvet",
          latteArt: latteArt ?? null,
          garnishes: garnishesStr,
          blendItems: {
            create: blendItems.map((item) => ({
              ingredientId: item.ingredientId,
              ratioPercent: item.ratioPercent,
            })),
          },
        },
        include: {
          blendItems: {
            include: {
              ingredient: true,
            },
          },
        },
      });

      return NextResponse.json(recipe, { status: 201 });
    } catch (dbErr) {
      console.warn("Database create failed, saving to in-memory store:", dbErr);

      // Save to in-memory store as fallback
      const generatedId = `recipe-${Date.now()}`;
      const inMemRecipe: EnrichedRecipe = {
        id: generatedId,
        title,
        description: description ?? null,
        waterTempC,
        waterAmountMl,
        steepingTimeSec,
        bitternessScore: extraction.bitternessScore,
        aromaScore: extraction.aromaScore,
        sweetnessScore: extraction.sweetnessScore,
        bodyScore: extraction.bodyScore,
        renderedHex: clientHex || extraction.renderedHex,
        vesselType: vesselType || extraction.recommendedVessel || "mug",
        cupGlaze: cupGlaze || extraction.cupGlaze || "earthenware",
        coasterStyle: coasterStyle || "ceramic",
        servingStyle: servingStyle || "hot",
        turbidity: turbidity || extraction.turbidity || "velvet",
        latteArt: latteArt ?? null,
        garnishes: garnishesStr,
        createdAt: new Date().toISOString(),
        blendItems: blendInputs.map((bi, idx) => ({
          id: `bi-${generatedId}-${idx}`,
          recipeId: generatedId,
          ingredientId: bi.ingredient.id,
          ratioPercent: bi.ratioPercent,
          ingredient: bi.ingredient,
        })),
      };

      addInMemoryRecipe(inMemRecipe);
      return NextResponse.json(inMemRecipe, { status: 201 });
    }
  } catch (error) {
    console.error("Failed to process recipe request:", error);
    return NextResponse.json(
      { error: "Failed to create recipe" },
      { status: 500 }
    );
  }
}

