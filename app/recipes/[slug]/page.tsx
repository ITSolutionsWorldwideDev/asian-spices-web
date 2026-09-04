// app/recipes/[slug]/page.tsx

// import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { getRecipeBySlug } from "@/lib/dbactions/recipes";
import { getRelatedRecipes } from "@/lib/dbactions/relatedRecipes";
import {
  getRecipeFavoriteCount,
  getRecipeViewCount,
  getYoutubeVideoStats,
  isRecipeFavorited,
} from "@/lib/dbactions/recipeStats";
import { getRecipeReviewsSummary } from "@/lib/dbactions/products";
import { getRecipeNutrition } from "@/lib/dbactions/recipeNutrition";
import { getRecipeJsonLd } from "@/lib/schema";
import JsonLd from "@/components/seo/JsonLd";
import { webAuthOptions } from "@/core/auth";
import Footer from "@/components/ui/Footer";
import RecipeDetailHeader from "@/components/layout/recipes/RecipeDetailHeader";
import RecipeAboutSection from "@/components/layout/recipes/RecipeAboutSection";
import RecipeIngredientsInstructionsSection from "@/components/layout/recipes/RecipeIngredientsInstructionsSection";
import RecipeNutritionSection from "@/components/layout/recipes/RecipeNutritionSection";
import RecipeReviewsSection from "@/components/layout/recipes/RecipeReviewsSection";
import RelatedRecipesSlider from "@/components/layout/recipes/RelatedRecipesSlider";

interface RecipePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: RecipePageProps) {
  const { slug } = await params;

  const recipe = await getRecipeBySlug(slug);

  if (!recipe) {
    return {
      title: "Recipe Not Found",
    };
  }

  const title = (recipe.seo_title || recipe.title || "").trim();
  const description = (
    recipe.seo_description ||
    recipe.short_description ||
    ""
  ).trim();

  const clamp = (text: string, max: number) => {
    if (text.length <= max) return text;
    const cut = text.slice(0, max);
    const lastSpace = cut.lastIndexOf(" ");
    return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trim();
  };

  return {
    title: clamp(title, 60),
    description: clamp(description, 160),
    keywords: recipe.seo_keywords,
    alternates: {
      canonical: `/recipes/${slug}`,
    },
  };
}

export default async function RecipeDetailPage({ params }: RecipePageProps) {
  const { slug } = await params;

  const recipe = await getRecipeBySlug(slug);

  if (!recipe) {
    notFound();
  }

  const session = await getServerSession(webAuthOptions);

  const [reviewsSummary, favoriteCount, dbViews, youtubeStats, relatedRecipes, nutrition, isFavorited] =
    await Promise.all([
      getRecipeReviewsSummary(recipe.id),
      getRecipeFavoriteCount(recipe.id),
      getRecipeViewCount(recipe.id),
      getYoutubeVideoStats(recipe.youtube_video_id),
      getRelatedRecipes(recipe.id, recipe.category_id),
      getRecipeNutrition(recipe.id),
      session?.user?.id
        ? isRecipeFavorited(recipe.id, session.user.id)
        : Promise.resolve(false),
    ]);

  const viewCount = Math.max(
    Number(recipe.total_views || 0),
    Number(dbViews || 0),
    Number(youtubeStats.views || 0),
  );
  const likeCount = Math.max(
    Number(favoriteCount || 0),
    Number(youtubeStats.likes || 0),
  );

  return (
    <div className="bg-[#faf7f2]">
      <JsonLd data={getRecipeJsonLd(recipe, nutrition, reviewsSummary)} />
      <RecipeDetailHeader
        recipe={recipe}
        averageRating={reviewsSummary.average}
        reviewCount={reviewsSummary.total}
        favoriteCount={favoriteCount}
        isFavorited={isFavorited}
      />

      <RecipeAboutSection
        recipe={recipe}
        favoriteCount={likeCount}
        viewCount={viewCount}
        videoDuration={youtubeStats.duration}
      />

      <RecipeIngredientsInstructionsSection
        ingredients={recipe.ingredients}
        instructions={recipe.instructions}
      />

      <RecipeNutritionSection
        nutrients={nutrition}
        thumbnailUrl={recipe.thumbnail_url}
      />

      <RecipeReviewsSection
        recipeId={recipe.id}
        initialAverage={reviewsSummary.average}
        initialTotal={reviewsSummary.total}
      />

      {relatedRecipes.length > 0 && (
        <section className="bg-[#faf7f2]">
          <div className="container mx-auto px-4 pb-10 sm:px-6 sm:pb-12">
            <h2 className="mb-5 text-2xl font-bold text-gray-900 sm:text-3xl">
              You May Also Like
            </h2>
            <RelatedRecipesSlider recipes={relatedRecipes} />
          </div>
        </section>
      )}

      {/*
      <section className="container mx-auto px-4 pb-10 sm:px-6 sm:pb-12">
        <aside className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-lg font-bold">Recipe Tags</h3>

              <div className="flex flex-wrap gap-3">
                {recipe.tags.map((tag: any) => (
                  <Link
                    key={tag.id}
                    href={`/recipes?tag=${tag.slug}`}
                    className="rounded-full px-4 py-2 text-sm font-medium text-white"
                    style={{
                      background: tag.color || "#ef4444",
                    }}
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 p-6 text-white">
            <h3 className="mb-3 text-xl font-bold">Love this recipe?</h3>

            <p className="mb-5 text-sm text-white/90">
              Share this delicious recipe with your friends and family.
            </p>

            <div className="flex gap-3">
              <Link
                href="https://www.facebook.com/profile.php?id=61591119970456"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black"
              >
                Facebook
              </Link>
            </div>
          </div>
        </aside>
      </section>
      */}

      <Footer />
    </div>
  );
}
