import CollectionLargeCard from "./Collection_Large_Card";
import CollectionSmallCard from "./Collection_Small_Card";
import CollectionAnimatedText from "./Collection_Animated_Text";
import HeadingDescription from "../../ui/HeadingDescription";
import FlashSale from "./Flash_Sale";
import { getLatestRecipeCategories } from "@/lib/dbactions/recipes";

const fallbackImages = [
  "indian-spices.webp",
  "chinese-spices.webp",
  "thai-spices.webp",
  "blend-spices.webp",
];

const gradients = ["amber-300", "red-500", "green-600", "white"];

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

  return (
    <>
      <div className="relative overflow-hidden">
        <div>
          <img
            src="/assets/home/collections/collection-bg.webp"
            alt=""
            className="absolute inset-0 opacity-90 w-full h-full object-cover"
          />
        </div>
        <div className="bg-white/80 relative py-20">
          <div className="container mx-auto">
            <HeadingDescription
              heading="Explore Our Collection"
              description="Discover authentic recipes from across Asia, each category carefully curated for quality and flavor."
            />
            <FlashSale />
          </div>
        </div>
      </div>

      {categories.length > 0 && (
        <div className="bg-white/80 py-20">
          <div className="container mx-auto ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-20">
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
      )}
    </>
  );
}
