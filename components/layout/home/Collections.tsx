import CollectionLargeCard from "./Collection_Large_Card";
import CollectionSmallCard from "./Collection_Small_Card";
import CollectionAnimatedText from "./Collection_Animated_Text";
import HeadingDescription from "../../ui/HeadingDescription";
import FlashSale from "./Flash_Sale";

const categories = [
  {
    title: "Indian Spices",
    subtitle: "Aromatic and bold flavors",
    products: 45,
    image: "51a25dd3ceed905ce38efab0118f616f234fbd37-min.webp",
    gradient: "amber-300",
  },
  {
    title: "Chines Spices",
    subtitle: "Balanced and harmonious",
    products: 60,
    image: "524531ab08204ddf1a7e11f44c85ef183cbf3159-min.webp",
    gradient: "red-500",
  },
  {
    title: "Thai Spices",
    subtitle: "Fresh and vibrant",
    products: 20,
    image: "e01dc03bcc26642793fa084cbeeeb30acf275580-min.webp",
    gradient: "green-600",
  },
  {
    title: "Blend Spices",
    subtitle: "Expert Combinations",
    products: 30,
    image: "30ae0eaf7c426c1f8cd606e51796fc3d9a40c59d-min.webp",
    gradient: "white",
  },
];

export default function Collections() {
  return (
    <>
      <div className=" relative   ">
        <div>
          <img
            src="/assets/home/collections/531683f465ac68a63e0eb661c769a19e4a41cb38-(1)-min.webp"
            alt=""
            className="absolute inset-0 opacity-90 w-full"
          />
        </div>
        <div className="bg-white/80 relative py-20">
          <div className="container mx-auto  ">
            {/* Top Section */}

            <HeadingDescription
              heading="Explore Our Collection"
              // text="Shop By Category"
              description={`Discover authentic spices from across Asia, each category carefully for quality and flavor Indian Spices`}
            />
            <FlashSale />
          </div>
        </div>
      </div>

      <div className="bg-white/80 py-20">
        <div className="container mx-auto  ">
          {/* Grid Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-20">
            {categories.map((item, index) => {
              // Large card (left)
              if (index === 0) {
                return <CollectionLargeCard key={index} item={item} />;
              }

              // Right column (two stacked small cards)
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

              // Bottom full-width card
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

      {/* Bottom Typography */}
    </>
  );
}
