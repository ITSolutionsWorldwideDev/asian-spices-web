// components/layout/home/Spicy_Story.tsx

import { ArrowRight } from "lucide-react";
import RecipesProductCard from "@/components/ui/RecipesProductCard";
import Link from "next/link";
import { getHomeRecipes } from "@/lib/dbactions/recipes";

export default async function Spicy_Story() {
  const recipes = await getHomeRecipes(8);

  const recipeCards = recipes.map((recipe) => ({
    title: recipe.title,
    slug: recipe.slug,
    description: recipe.short_description || "",
    thumbnail_url: recipe.thumbnail_url,
  }));

  return (
    <section className="w-full overflow-hidden py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-4xl md:text-5xl font-extrabold mb-14">
          Where Every Dish Tells a Spicy Story 🔥
        </h2>
      </div>

      {recipeCards.length > 0 ? (
        <div className="container mx-auto px-4 overflow-hidden lg:py-4">
          <div className="flex gap-10 w-max animate-marquee hover:[animation-play-state:paused]">
            {recipeCards.map((card) => (
              <div
                key={`orig-${card.slug}`}
                className="bg-white rounded-3xl shadow-xl w-[300px] md:w-[400px] flex-shrink-0"
              >
                <RecipesProductCard card={card} />
              </div>
            ))}

            {recipeCards.map((card) => (
              <div
                key={`clone-${card.slug}`}
                className="bg-white rounded-3xl shadow-xl w-[300px] md:w-[400px] flex-shrink-0"
                aria-hidden="true"
              >
                <RecipesProductCard card={card} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No recipes available yet. Check back soon!
        </p>
      )}

      <div className="flex justify-center mt-14 space-x-5">
        <button className="cursor-pointer relative px-6 py-3 font-bold text-white text-sm bg-black rounded-lg overflow-hidden group">
          <span className="relative z-10 flex items-center justify-center">
            <Link href={`/recipes`} className="flex items-center justify-center">
              See More <ArrowRight className="ml-4" />
            </Link>
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/40 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-center"></span>
        </button>

        <button className="cursor-pointer bg-black relative px-6 py-3 font-bold text-sm text-white rounded-lg overflow-hidden group ">
          <span className="relative z-10 flex items-center justify-center">
            <Link href={`/recipes`} className="flex items-center justify-center">
              Add Your Own Story
            </Link>
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/40 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-center"></span>
        </button>
      </div>
    </section>
  );
}
