import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const ingredients = await prisma.teaIngredient.findMany({
      orderBy: { category: "asc" },
    });
    return NextResponse.json(ingredients);
  } catch (error) {
    console.error("Failed to fetch ingredients:", error);
    return NextResponse.json(
      { error: "Failed to fetch ingredients" },
      { status: 500 }
    );
  }
}
