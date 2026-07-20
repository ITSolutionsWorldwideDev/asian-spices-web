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

  return (
    <div className="bg-white/80 py-20">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          {categories.map((item, index) => {
            if (index === 0) {
              return <CollectionLargeCard key={item.slug} item={item} />;
            }

            if (index === 1) {
              return (
                <div key="right-column" className="flex flex-col gap-6">
                  {categories[1] && (
                    <CollectionSmallCard item={categories[1]} />
                  )}
                  {categories[2] && (
                    <CollectionSmallCard item={categories[2]} />
                  )}
                </div>
              );
            }

            if (index >= 3) {
              return (
                <div key={item.slug}>
                  <CollectionSmallCard item={item} />
                </div>
              );
            }

            return null;
          })}

          <CollectionAnimatedText />
        </div>
      </div>
    </div>
  );
}
