import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CozyCupScene from "@/components/game/CozyCupScene";
import FlavorRadarChart from "@/components/charts/FlavorRadarChart";
import RecipeShareBar from "@/components/recipes/RecipeShareBar";

export const dynamic = "force-dynamic";

export default async function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const recipe = await prisma.recipe.findUnique({
    where: { id },
    include: {
      blendItems: {
        include: {
          ingredient: true
        }
      }
    }
  });

  if (!recipe) {
    notFound();
  }

  let parsedGarnishes: string[] = [];
  try {
    if (recipe.garnishes) {
      parsedGarnishes = JSON.parse(recipe.garnishes);
    }
  } catch (e) {
    parsedGarnishes = [];
  }

  const radarData = [
    { dimension: "Sweetness", score: recipe.sweetnessScore, fullMark: 10 },
    { dimension: "Aroma", score: recipe.aromaScore, fullMark: 10 },
    { dimension: "Body", score: recipe.bodyScore, fullMark: 10 },
    { dimension: "Bitterness", score: recipe.bitternessScore, fullMark: 10 },
    { dimension: "Clarity", score: Math.max(1, 10 - recipe.bodyScore * 0.4), fullMark: 10 },
  ];

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/recipes" className="text-wood hover:text-dark-wood transition-colors flex items-center gap-2 w-fit">
          <span>←</span> Back to Archive
        </Link>
      </div>

      <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-8 border border-wood/20 shadow-sm mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-display text-dark-wood font-bold mb-4">
          {recipe.title}
        </h1>
        {recipe.description && (
          <p className="text-wood text-lg italic mb-6">"{recipe.description}"</p>
        )}
        
        <div className="flex justify-center items-center h-72 mb-6">
          <CozyCupScene 
            liquidColor={recipe.renderedHex || "#D4A574"} 
            opacity={0.9} 
            steamIntensity={Math.max(0, (recipe.waterTempC - 60) / 40)} 
            servingStyle={(recipe.servingStyle as any) || "hot"}
            vesselType={(recipe.vesselType as any) || "mug"}
            cupGlaze={(recipe.cupGlaze as any) || "earthenware"}
            coasterStyle={(recipe.coasterStyle as any) || "ceramic"}
            turbidity={(recipe.turbidity as any) || "velvet"}
            latteArt={(recipe.latteArt as any) || undefined}
            garnishes={parsedGarnishes}
          />
        </div>

        <RecipeShareBar
          recipeId={recipe.id}
          title={recipe.title}
          description={recipe.description}
          renderedHex={recipe.renderedHex || "#D4A574"}
          waterTempC={recipe.waterTempC}
          waterAmountMl={recipe.waterAmountMl}
          steepingTimeSec={recipe.steepingTimeSec}
          sweetnessScore={recipe.sweetnessScore}
          aromaScore={recipe.aromaScore}
          bodyScore={recipe.bodyScore}
          bitternessScore={recipe.bitternessScore}
          vesselType={(recipe.vesselType as any) || "mug"}
          cupGlaze={(recipe.cupGlaze as any) || "earthenware"}
          coasterStyle={(recipe.coasterStyle as any) || "ceramic"}
          servingStyle={(recipe.servingStyle as any) || "hot"}
          turbidity={(recipe.turbidity as any) || "velvet"}
          latteArt={(recipe.latteArt as any) || undefined}
          garnishes={parsedGarnishes}
          blendItems={recipe.blendItems.map((b) => ({
            ingredient: b.ingredient,
            ratioPercent: b.ratioPercent,
          }))}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-wood/20 shadow-sm">
          <CardHeader>
            <CardTitle className="text-dark-wood font-display text-2xl text-center">Flavor Profile</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <FlavorRadarChart data={radarData} size="lg" />
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-6 w-full px-4">
              {radarData.map(d => (
                <div key={d.dimension} className="flex justify-between items-center border-b border-wood/10 pb-2">
                  <span className="text-wood font-medium">{d.dimension}</span>
                  <span className="text-dark-wood font-bold">{d.score.toFixed(1)}/10</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="border-wood/20 shadow-sm">
            <CardHeader>
              <CardTitle className="text-dark-wood font-display text-2xl">Brew Parameters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-cream rounded-lg border border-wood/10">
                  <span className="text-wood font-medium flex items-center gap-2">🌡️ Temperature</span>
                  <span className="text-amber font-bold text-lg">{recipe.waterTempC}°C</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-cream rounded-lg border border-wood/10">
                  <span className="text-wood font-medium flex items-center gap-2">⏳ Time</span>
                  <span className="text-amber font-bold text-lg">{formatTime(recipe.steepingTimeSec)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-cream rounded-lg border border-wood/10">
                  <span className="text-wood font-medium flex items-center gap-2">💧 Water</span>
                  <span className="text-amber font-bold text-lg">{recipe.waterAmountMl}ml</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-wood/20 shadow-sm">
            <CardHeader>
              <CardTitle className="text-dark-wood font-display text-2xl">Blend Composition</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recipe.blendItems.map((item: any) => (
                  <div key={item.id} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-dark-wood">{item.ingredient.name}</span>
                      <span className="text-wood">{item.ratioPercent}%</span>
                    </div>
                    <div className="h-2 bg-cream rounded-full overflow-hidden border border-wood/10">
                      <div 
                        className="h-full bg-amber transition-all"
                        style={{ width: `${Math.min(100, item.ratioPercent)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="text-center text-wood/60 text-sm">
            Created on {new Date(recipe.createdAt).toLocaleDateString(undefined, { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
