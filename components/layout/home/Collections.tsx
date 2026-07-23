import Image from "next/image";
import CollectionLargeCard from "./Collection_Large_Card";
import CollectionSmallCard from "./Collection_Small_Card";
import CollectionAnimatedText from "./Collection_Animated_Text";
import { getLatestRecipeCategories } from "@/lib/dbactions/recipes";

const fallbackImages = [
  "indian-spices.webp",
  "chinese-spices.webp",
  "thai-spices.webp",
  "blend-spices.webp",
];

const gradients = ["amber-300", "red-500", "green-600", "white"];

/** DB-backed category grid only — Flash Sale lives in Home for earlier paint. */
export default async function Collections() {
  const recipeCategories = await getLatestRecipeCategories(4);

  const categories = recipeCategories.map((category, index) => ({
    title: category.name,
    subtitle: `Explore our latest ${category.name.toLowerCase()} recipes`,
    products: category.recipe_count,
    image: fallbackImages[index % fallbackImages.length],
    gradient: gradients[index % gradients.length],
    slug: category.slug,
  }));

  if (!categories.length) {
    return null;
  }

  const [first, second, third, fourth] = categories;

  return (
    <div className="relative overflow-hidden py-16 md:py-20">
      {/* Faint spice pattern background */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.14]">
        <Image
          src="/assets/home/collections/collection-bg.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          loading="lazy"
        />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        {/* 3-column mosaic: tall | stacked | card + slogan */}
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 lg:h-[640px] xl:h-[700px]">
          {first && (
            <div className="min-h-[420px] lg:row-span-2 lg:min-h-0">
              <CollectionLargeCard item={first} />
            </div>
          )}

          {second && (
            <div className="min-h-[220px] lg:min-h-0">
              <CollectionSmallCard item={second} />
            </div>
          )}

          {fourth && (
            <div className="min-h-[220px] lg:min-h-0">
              <CollectionSmallCard item={fourth} />
            </div>
          )}

          {third && (
            <div className="min-h-[220px] lg:min-h-0">
              <CollectionSmallCard item={third} />
            </div>
          )}

          <div className="flex min-h-[160px] items-center lg:min-h-0">
            <CollectionAnimatedText />
          </div>
        </div>
      </div>
    </div>
  );
}
