import { prisma } from "@/lib/prisma";
import RecipeCard from "@/components/recipes/RecipeCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function RecipesArchivePage() {
  const recipes = await prisma.recipe.findMany({
    include: {
      blendItems: {
        include: {
          ingredient: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-display text-dark-wood font-bold flex items-center justify-center gap-3">
          📚 Recipe Archive
        </h1>
        <p className="text-wood mt-2 text-lg">Community tea blends</p>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-20 flex flex-col items-center gap-4">
          <div className="text-6xl">🫖</div>
          <h2 className="text-2xl font-display text-dark-wood">No recipes yet</h2>
          <p className="text-wood">Be the first to craft a cozy blend!</p>
          <Link href="/lab">
            <Button className="mt-4 bg-dark-wood hover:bg-wood text-cream">
              Go to Blending Lab
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe as any} />
          ))}
        </div>
      )}
    </div>
  );
}
