import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { BarChart3, Clock3, Users } from "lucide-react";
import Nav from "@/components/ui/Nav";
import RecipeHeaderActions from "./RecipeHeaderActions";

type RecipeDetailHeaderProps = {
  recipe: {
    id: string;
    title: string;
    short_description?: string | null;
    thumbnail_url?: string | null;
    category_name?: string | null;
    category_slug?: string | null;
    preparation_time?: number | null;
    cooking_time?: number | null;
    servings?: number | null;
    difficulty?: string | null;
    is_featured?: boolean | null;
  };
  averageRating?: number;
  reviewCount?: number;
  favoriteCount?: number;
  isFavorited?: boolean;
};

function formatMinutes(value?: number | null) {
  if (value == null || Number.isNaN(Number(value))) return "—";
  return `${Number(value)} min`;
}

function MetaCell({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-4 sm:px-5 sm:py-5 ${
        highlight ? "bg-[#e8924a] text-white" : "bg-white text-gray-900"
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
          highlight ? "bg-white/20 text-white" : "bg-orange-50 text-[#e8924a]"
        }`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p
          className={`text-xs sm:text-sm ${
            highlight ? "text-white/90" : "text-gray-500"
          }`}
        >
          {label}
        </p>
        <p className="truncate text-sm font-bold sm:text-base">{value}</p>
      </div>
    </div>
  );
}

export default function RecipeDetailHeader({
  recipe,
  averageRating = 0,
  reviewCount = 0,
  favoriteCount = 0,
  isFavorited = false,
}: RecipeDetailHeaderProps) {
  const prep = recipe.preparation_time;
  const cook = recipe.cooking_time;
  const total =
    prep != null || cook != null ? Number(prep || 0) + Number(cook || 0) : null;

  const badge = recipe.category_name
    ? recipe.category_name
    : recipe.is_featured
      ? "Featured Recipe"
      : "Heritage Recipe";

  return (
    <section className="relative">
      {/* HERO — full-width banner (original size) */}
      <div className="relative h-[420px] overflow-hidden sm:h-[520px] md:h-[600px] lg:h-[640px]">
        <Image
          src={recipe.thumbnail_url || "/assets/alt-recipe-banner.jpg"}
          alt={recipe.title}
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover object-center"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/25" />

        <div className="absolute inset-x-0 top-0 z-20">
          <Nav />
        </div>

        <div className="absolute inset-0 z-10 flex items-end">
          <div className="container mx-auto px-4 pb-8 sm:px-6 sm:pb-10 md:pb-12">
            <div className="max-w-3xl">
              {recipe.category_slug ? (
                <Link
                  href={`/recipes?category=${recipe.category_slug}`}
                  className="mb-3 inline-flex rounded-md bg-[#e8924a] px-3 py-1.5 text-xs font-semibold tracking-wide text-white sm:mb-4 sm:text-sm"
                >
                  {badge}
                </Link>
              ) : (
                <span className="mb-3 inline-flex rounded-md bg-[#e8924a] px-3 py-1.5 text-xs font-semibold tracking-wide text-white sm:mb-4 sm:text-sm">
                  {badge}
                </span>
              )}

              <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-[3.25rem]">
                {recipe.title}
              </h1>

              {recipe.short_description && (
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/90 sm:mt-4 sm:text-base md:text-[17px]">
                  {recipe.short_description}
                </p>
              )}
            </div>

            <div className="mt-5 sm:mt-6">
              <RecipeHeaderActions
                recipeId={recipe.id}
                title={recipe.title}
                commentsHref="#recipe-reviews"
                averageRating={averageRating}
                reviewCount={reviewCount}
                favoriteCount={favoriteCount}
                isFavorited={isFavorited}
              />
            </div>
          </div>
        </div>
      </div>

      {/* META BAR */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="container mx-auto grid grid-cols-2 overflow-hidden sm:grid-cols-3 lg:grid-cols-5">
          <div className="border-b border-r border-gray-200 sm:border-b-0">
            <MetaCell
              icon={<Clock3 className="h-5 w-5" aria-hidden />}
              label="Prep Time"
              value={formatMinutes(prep)}
            />
          </div>
          <div className="border-b border-gray-200 sm:border-b-0 sm:border-r lg:border-r">
            <MetaCell
              icon={<Clock3 className="h-5 w-5" aria-hidden />}
              label="Cook Time"
              value={formatMinutes(cook)}
            />
          </div>
          <div className="border-b border-r border-gray-200 sm:border-b-0 lg:border-r">
            <MetaCell
              icon={<Clock3 className="h-5 w-5" aria-hidden />}
              label="Total Time"
              value={formatMinutes(total)}
            />
          </div>
          <div className="border-b border-gray-200 sm:border-b-0 sm:border-r lg:border-b-0">
            <MetaCell
              icon={<Users className="h-5 w-5" aria-hidden />}
              label="Servings"
              value={
                recipe.servings != null ? String(recipe.servings) : "—"
              }
            />
          </div>
          <div className="col-span-2 sm:col-span-1 lg:col-span-1">
            <MetaCell
              icon={<BarChart3 className="h-5 w-5" aria-hidden />}
              label="Difficulty"
              value={
                recipe.difficulty
                  ? recipe.difficulty.charAt(0).toUpperCase() +
                    recipe.difficulty.slice(1).toLowerCase()
                  : "—"
              }
              highlight
            />
          </div>
        </div>
      </div>
    </section>
  );
}
