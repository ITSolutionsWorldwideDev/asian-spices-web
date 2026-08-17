import Link from "next/link";
import { Clock3, Eye, Heart } from "lucide-react";
import RecipeVideoPlayer from "./RecipeVideoPlayer";
import YouTubeDuration from "./YouTubeDuration";
import { getRecipeImageSrc } from "@/core/utils";

type RecipeTag = {
  id: string;
  name: string;
  slug: string;
  color?: string | null;
};

type RecipeAboutSectionProps = {
  recipe: {
    id: string;
    title: string;
    slug: string;
    content?: string | null;
    thumbnail_url?: string | null;
    youtube_url?: string | null;
    youtube_video_id?: string | null;
    preparation_time?: number | null;
    cooking_time?: number | null;
    total_views?: number | null;
    origin?: string | null;
    category_name?: string | null;
    category_slug?: string | null;
    tags?: RecipeTag[];
  };
  favoriteCount?: number;
  viewCount?: number;
  videoDuration?: string;
};

function formatCompactCount(value?: number | null) {
  const n = Number(value || 0);
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
}

function formatDuration(
  prep?: number | null,
  cook?: number | null,
): string {
  const prepMins = Number(prep);
  const cookMins = Number(cook);
  const total =
    (Number.isFinite(prepMins) ? prepMins : 0) +
    (Number.isFinite(cookMins) ? cookMins : 0);

  if (!total) return "";
  if (total >= 60) {
    const h = Math.floor(total / 60);
    const m = total % 60;
    return m ? `${h}h ${m}m` : `${h}h`;
  }
  return `${total} min`;
}

export default function RecipeAboutSection({
  recipe,
  favoriteCount = 0,
  viewCount,
  videoDuration = "",
}: RecipeAboutSectionProps) {
  const cuisine = recipe.origin || "Asian";
  const diet = recipe.category_name || "—";
  const videoThumb = recipe.youtube_video_id
    ? `https://img.youtube.com/vi/${recipe.youtube_video_id}/hqdefault.jpg`
    : recipe.thumbnail_url || "/assets/alt-recipe-banner.jpg";

  return (
    <section className="bg-[#faf7f2]">
      <div className="container mx-auto px-4 pb-8 pt-6 sm:px-6">
        {/* Breadcrumbs */}
        <nav className="mb-5 text-sm text-gray-500" aria-label="Breadcrumb">
          <Link href="/" className="transition hover:text-orange-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          {recipe.category_slug ? (
            <>
              <Link
                href={`/recipes?category=${recipe.category_slug}`}
                className="transition hover:text-orange-600"
              >
                {recipe.category_name || "Category"}
              </Link>
              <span className="mx-2">/</span>
            </>
          ) : (
            <>
              <Link href="/recipes" className="transition hover:text-orange-600">
                Recipes
              </Link>
              <span className="mx-2">/</span>
            </>
          )}
          <span className="font-medium text-orange-600">{recipe.title}</span>
        </nav>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          {/* About card */}
          <article
            id="recipe-content"
            className="h-fit rounded-2xl border border-gray-100 bg-white p-6 shadow-md sm:p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 sm:text-[1.75rem]">
              About this recipe
            </h2>

            {recipe.content ? (
              <div
                className="prose prose-sm mt-5 max-w-none text-gray-600 prose-headings:font-bold prose-p:leading-7 sm:prose-base"
                dangerouslySetInnerHTML={{ __html: recipe.content }}
              />
            ) : (
              <p className="mt-5 text-[15px] leading-7 text-gray-600">
                No content available for this recipe yet.
              </p>
            )}

            <div className="mt-8 flex flex-wrap gap-x-16 gap-y-4 border-t border-gray-100 pt-6">
              <div>
                <p className="text-sm text-gray-500">Cuisine</p>
                <p className="mt-1 text-base font-bold text-gray-900">
                  {cuisine}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Diet</p>
                <p className="mt-1 text-base font-bold text-gray-900">
                  {diet}
                </p>
              </div>
            </div>
          </article>

          {/* Video card */}
          <aside className="h-fit rounded-2xl border border-gray-100 bg-white p-5 shadow-md sm:p-6">
            <RecipeVideoPlayer
              title={recipe.title}
              youtubeVideoId={recipe.youtube_video_id}
              thumbnailUrl={videoThumb}
            />

            <h3 className="mt-4 text-xl font-bold text-gray-900">
              Watch the recipe
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-600 sm:text-[15px]">
              Follow along with our step-by-step video guide to make the
              perfect {recipe.title} at home.
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-600">
              <span className="inline-flex items-center gap-2">
                <Eye className="h-4 w-4 text-gray-500" aria-hidden />
                {formatCompactCount(viewCount ?? recipe.total_views)} views
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-gray-500" aria-hidden />
                <YouTubeDuration
                  videoId={recipe.youtube_video_id}
                  fallback={
                    videoDuration ||
                    formatDuration(
                      recipe.preparation_time,
                      recipe.cooking_time,
                    )
                  }
                />
              </span>
              <span className="inline-flex items-center gap-2">
                <Heart className="h-4 w-4 text-gray-500" aria-hidden />
                {formatCompactCount(favoriteCount)} likes
              </span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
