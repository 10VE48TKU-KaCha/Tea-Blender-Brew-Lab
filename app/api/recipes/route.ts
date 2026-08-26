import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CreateRecipeInputSchema } from "@/types/tea";
import { calculateExtraction } from "@/lib/extraction-engine";
import type { BlendInput } from "@/types/tea";

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
    return NextResponse.json(recipes);
  } catch (error) {
    console.error("Failed to fetch recipes:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 }
    );
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

    const { title, description, waterTempC, waterAmountMl, steepingTimeSec, blendItems } = parsed.data;

    // Fetch ingredient data for extraction calculation
    const ingredientIds = blendItems.map((b) => b.ingredientId);
    const ingredients = await prisma.teaIngredient.findMany({
      where: { id: { in: ingredientIds } },
    });

    if (ingredients.length !== ingredientIds.length) {
      return NextResponse.json(
        { error: "One or more ingredients not found" },
        { status: 400 }
      );
    }

    // Build blend inputs for extraction engine
    const blendInputs: BlendInput[] = blendItems.map((item) => {
      const ingredient = ingredients.find((i) => i.id === item.ingredientId)!;
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

    // Create recipe with blend items
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
        renderedHex: extraction.renderedHex,
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
  } catch (error) {
    console.error("Failed to create recipe:", error);
    return NextResponse.json(
      { error: "Failed to create recipe" },
      { status: 500 }
    );
  }
}
