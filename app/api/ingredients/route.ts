import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_TEA_INGREDIENTS } from "@/lib/default-tea-data";

export async function GET() {
  try {
    const ingredients = await prisma.teaIngredient.findMany({
      orderBy: { category: "asc" },
    });
    if (ingredients && ingredients.length > 0) {
      return NextResponse.json(ingredients);
    }
    // If DB is empty, use default specialty tea ingredients
    return NextResponse.json(DEFAULT_TEA_INGREDIENTS);
  } catch (error) {
    console.warn("Database unavailable, falling back to default specialty teas:", error);
    return NextResponse.json(DEFAULT_TEA_INGREDIENTS);
  }
}

