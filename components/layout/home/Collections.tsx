import CollectionLargeCard from "./Collection_Large_Card";
import CollectionSmallCard from "./Collection_Small_Card";
import CollectionAnimatedText from "./Collection_Animated_Text";
import HeadingDescription from "../../ui/HeadingDescription";
import FlashSale from "./Flash_Sale";

const categories = [
  {
    title: "Indian Spices XYZ",
    subtitle: "Aromatic and bold flavors",
    products: 45,
    image: "indian-spices.webp",
    gradient: "amber-300",
  },
  {
    title: "Chines Spices",
    subtitle: "Balanced and harmonious",
    products: 60,
    image: "chinese-spices.webp",
    gradient: "red-500",
  },
  {
    title: "Thai Spices",
    subtitle: "Fresh and vibrant",
    products: 20,
    image: "thai-spices.webp",
    gradient: "green-600",
  },
  {
    title: "Blend Spices",
    subtitle: "Expert Combinations",
    products: 30,
    image: "blend-spices.webp",
    gradient: "white",
  },
];

export default function Collections() {
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
              description={`Discover authentic spices from across Asia, each category carefully for quality and flavor Indian Spices`}
            />
            <FlashSale />
          </div>
        </div>
      </div>

      <div className="bg-white/80 py-20">
        <div className="container mx-auto ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-20">
            {categories.map((item, index) => {
              if (index === 0) {
                return <CollectionLargeCard key={index} item={item} />;
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
                  <div key={item.title}>
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
    </>
  );
}
