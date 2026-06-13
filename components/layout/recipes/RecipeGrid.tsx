// apps/web/components/layout/recipes/RecipeGrid.tsx

import RecipeCard from "./RecipeCard";

interface RecipeGridProps {
  recipes: any[];
}

export default function RecipeGrid({
  recipes,
}: RecipeGridProps) {
  if (!recipes.length) {
    return (
      <div className="bg-white border rounded-3xl p-16 text-center">
        <h3 className="text-2xl font-bold mb-2">
          No Recipes Found
        </h3>

        <p className="text-gray-500">
          Try changing your filters or search.
        </p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
        />
      ))}
    </div>
  );
}