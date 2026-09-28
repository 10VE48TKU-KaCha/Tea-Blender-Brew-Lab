import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { findInMemoryRecipeById } from "@/lib/default-tea-data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: {
        blendItems: {
          include: {
            ingredient: true,
          },
        },
      },
    });

    if (recipe) {
      return NextResponse.json(recipe);
    }
  } catch (error) {
    console.warn(`Database lookup failed for recipe ${id}, checking in-memory store:`, error);
  }

  // Fallback to in-memory store
  const inMem = findInMemoryRecipeById(id);
  if (inMem) {
    return NextResponse.json(inMem);
  }

  return NextResponse.json(
    { error: "Recipe not found" },
    { status: 404 }
  );
}

