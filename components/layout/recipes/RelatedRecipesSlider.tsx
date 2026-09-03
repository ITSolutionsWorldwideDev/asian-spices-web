"use client";

import Link from "next/link";
import { Clock3, ChefHat } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Keyboard } from "swiper/modules";
import RecipeThumbnail from "@/components/layout/recipes/RecipeThumbnail";

import "swiper/css";
import "swiper/css/navigation";

type RelatedRecipe = {
  id: string;
  title: string;
  slug: string;
  short_description?: string | null;
  thumbnail_url?: string | null;
  cooking_time?: number | null;
  difficulty?: string | null;
  category_name?: string | null;
};

export default function RelatedRecipesSlider({
  recipes,
}: {
  recipes: RelatedRecipe[];
}) {
  if (!recipes?.length) return null;

  return (
    <div className="relative w-full px-2 sm:px-4">
      <Swiper
        modules={[Autoplay, Navigation, Keyboard]}
        loop={recipes.length > 4}
        speed={800}
        spaceBetween={16}
        grabCursor={true}
        keyboard={{ enabled: true }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        navigation
        breakpoints={{
          320: {
            slidesPerView: 1.2,
          },
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
          1280: {
            slidesPerView: 4,
          },
        }}
        className="py-6"
      >
        {recipes.map((recipe) => (
          <SwiperSlide key={recipe.id} className="!h-auto py-4">
            <Link
              href={`/recipes/${recipe.slug}`}
              className="group block h-full overflow-hidden rounded-3xl border bg-white transition duration-300 hover:shadow-xl"
            >
              <div className="relative h-[200px] overflow-hidden bg-gray-100">
                <RecipeThumbnail
                  src={recipe.thumbnail_url}
                  alt={recipe.title}
                  fill
                  sizes="(max-width: 640px) 80vw, (max-width: 1280px) 33vw, 25vw"
                  className="object-cover"
                />
                {recipe.category_name ? (
                  <div className="absolute left-4 top-4">
                    <span className="rounded-full bg-orange-600 px-3 py-1 text-xs text-white">
                      {recipe.category_name}
                    </span>
                  </div>
                ) : null}
              </div>

              <div className="p-5">
                <h3 className="line-clamp-2 text-lg font-bold text-gray-900">
                  {recipe.title}
                </h3>

                {recipe.short_description ? (
                  <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                    {recipe.short_description}
                  </p>
                ) : null}

                <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                  {recipe.cooking_time ? (
                    <div className="flex items-center gap-1">
                      <Clock3 size={16} aria-hidden />
                      {recipe.cooking_time} mins
                    </div>
                  ) : null}

                  {recipe.difficulty ? (
                    <div className="flex items-center gap-1 capitalize">
                      <ChefHat size={16} aria-hidden />
                      {recipe.difficulty}
                    </div>
                  ) : null}
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
