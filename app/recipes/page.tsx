import { prisma } from "@/lib/prisma";
import RecipeCard from "@/components/recipes/RecipeCard";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sparkles, Beaker, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function RecipesArchivePage() {
  const recipes = await prisma.recipe.findMany({
    include: {
      blendItems: {
        include: {
          ingredient: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      {/* Illustrated Codex Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-wood/25 shadow-md group">
        <div className="relative h-56 sm:h-72 md:h-80 w-full overflow-hidden">
          <Image
            src="/images/vintage_tea_codex.jpg"
            alt="Vintage Tea Codex Archive"
            fill
            priority
            className="object-cover object-center group-hover:scale-102 transition-transform duration-700"
          />
          {/* Frosted vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-wood/90 via-dark-wood/50 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-end text-center p-6 sm:p-8 text-white space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-semibold text-amber-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Community Tea Lore • {recipes.length} Blends Recorded</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold drop-shadow-md text-cream">
              The Tea Codex Archive
            </h1>
            <p className="text-cream/90 text-xs sm:text-sm md:text-base max-w-xl mx-auto drop-shadow-xs">
              Explore handcrafted tea recipes, extraction profiles, and flavor radars created by tea lovers across the world.
            </p>
          </div>
        </div>
      </div>

      {/* Header Controls & Create Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-wood/15 shadow-xs">
        <div className="text-xs text-wood font-medium">
          Showing <span className="font-bold text-dark-wood">{recipes.length}</span> archived artisan recipes
        </div>
        <div className="flex items-center gap-2">
          <Link href="/lab">
            <Button variant="outline" size="sm" className="rounded-xl text-xs">
              <Beaker className="w-3.5 h-3.5 mr-1" />
              Open Lab
            </Button>
          </Link>
          <Link href="/lab">
            <Button size="sm" className="rounded-xl text-xs bg-gradient-to-r from-[#BA4A1E] via-[#C85826] to-[#D96830] hover:from-[#A43E16] hover:to-[#BA4A1E] text-white font-bold shadow-xs">
              <Plus className="w-3.5 h-3.5 mr-1" />
              Craft New Blend
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid of Recipe Cards */}
      {recipes.length === 0 ? (
        <div className="text-center py-20 flex flex-col items-center gap-4 bg-white/50 backdrop-blur-md rounded-3xl border border-wood/15 p-8">
          <div className="text-6xl animate-bounce">🫖</div>
          <h2 className="text-2xl font-display font-bold text-dark-wood">No recipes yet</h2>
          <p className="text-wood text-sm max-w-md">
            Be the first tea master to craft and save an artisan blend into the archive!
          </p>
          <Link href="/lab">
            <Button className="mt-2 bg-gradient-to-r from-[#BA4A1E] via-[#C85826] to-[#D96830] hover:from-[#A43E16] hover:to-[#BA4A1E] text-white rounded-xl font-bold shadow-md shadow-orange-950/20">
              Go to Blending Lab ↗
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
