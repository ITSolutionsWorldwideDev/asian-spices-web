// apps/web/components/layout/recipes/RecipeCard.tsx
import Link from "next/link";

import Image from "next/image";

import { Clock3, ChefHat } from "lucide-react";

interface RecipeCardProps {
  recipe: any;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link
      href={`/recipes/${recipe.slug}`}
      className="group bg-white border rounded-3xl overflow-hidden hover:shadow-2xl transition duration-300"
    >
      {/* IMAGE */}
      <div className="relative h-[240px] overflow-hidden">
        <Image
          src={recipe.thumbnail_url || "/placeholder-food.jpg"}
          alt={recipe.title}
          fill
          className="object-cover group-hover:scale-105 transition duration-500"
        />

        {/* CATEGORY */}
        {recipe.category_name && (
          <div className="absolute top-4 left-4">
            <span className="bg-orange-600 text-white text-xs px-3 py-1 rounded-full">
              {recipe.category_name}
            </span>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-900 line-clamp-2">
          {recipe.title}
        </h3>

        <p className="text-sm text-gray-500 mt-2 line-clamp-3">
          {recipe.short_description}
        </p>

        {/* META */}
        <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
          {recipe.cooking_time && (
            <div className="flex items-center gap-1">
              <Clock3 size={16} />
              {recipe.cooking_time} mins
            </div>
          )}

          {recipe.difficulty && (
            <div className="flex items-center gap-1">
              <ChefHat size={16} />

              {recipe.difficulty}
            </div>
          )}
        </div>

        {/* TAGS */}
        {recipe.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {recipe.tags.slice(0, 3).map((tag: any) => (
              <span
                key={tag.id}
                className="text-xs px-2 py-1 rounded-full text-white"
                style={{
                  background: tag.color,
                }}
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
