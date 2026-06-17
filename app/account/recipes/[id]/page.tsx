// app/account/recipes/[id]/page.tsx

import { notFound } from "next/navigation";

import { getRecipeById } from "@/lib/dbactions/recipes";
import RecipeForm from "@/components/layout/account/recipes/RecipeForm";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditRecipePage({ params }: Props) {
  const { id } = await params;

  const recipe = await getRecipeById(id);

  if (!recipe) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <RecipeForm recipeId={id} initialData={recipe} />
    </div>
  );
}
