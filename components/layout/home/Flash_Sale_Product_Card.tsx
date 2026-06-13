"use client";
import { useState } from "react";
import Image from "next/image";
import Flash_Sale_Hover_product_Card from "./Flash_Sale_Hover_product_Card";
import { TfiTimer } from "react-icons/tfi";

interface FlashSaleProduct {
  id: number;
  title: string;
  image: string;
  price: number;
  oldPrice: number;
  off: string;
  left: number;
  save: string;
  description: string;
  qualities: string[];
  rating: number;
  rating_percentage: string;
}

const FlashSaleProductCard = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const FalshSaleProducts: FlashSaleProduct[] = [
    {
      id: 1,
      title: "Premium Saffron",
      image: "6a6c5e09b8f76078ff74a389fb2e9d49eb1a02b9.jpg",
      price: 39.99,
      oldPrice: 69.99,
      off: "43% OFF",
      left: 12,
      save: "$30.00",
      description:
        "Premium saffron, known as the “king of spices” or “red gold,” is a rare and valuable spice harvested from the Crocus sativus flower requiring about 75,000 blossoms for just one pound. Its rich aroma and vibrant color make it a prized ingredient in gourmet dishes, traditional remedies for mood and digestion, and luxury skincare for its soothing and brightening effects.",
      qualities: [
        `Deep Red Threads`,
        `Intense Aroma`,
        `Hand-Harvested`,
        `Strong Coloring Power`,
        `Distinct Flavor`,
        `ISO Grade I Certified`,
      ],
      rating: 324,
      rating_percentage: "90%",
    },
    {
      id: 2,
      title: "Organic Garam Masala",
      image: "083782e31e411838bf8aa3bec2c2d18932e8e7c8.jpg",
      price: 14.99,
      oldPrice: 24.99,
      off: "43% OFF",
      left: 12,
      save: "$10.00",
      description:
        "Premium saffron, known as the “king of spices” or “red gold,” is a rare and valuable spice harvested from the Crocus sativus flower requiring about 75,000 blossoms for just one pound. Its rich aroma and vibrant color make it a prized ingredient in gourmet dishes, traditional remedies for mood and digestion, and luxury skincare for its soothing and brightening effects.",
      qualities: [
        `Deep Red Threads`,
        `Intense Aroma`,
        `Hand-Harvested`,
        `Strong Coloring Power`,
        `Distinct Flavor`,
        `ISO Grade I Certified`,
      ],
      rating: 324,
      rating_percentage: "90%",
    },
    {
      id: 3,
      title: "Star Anise Whole",
      image: "6618d6869cf24a597449d4b814eba26459cdc371.jpg",
      price: 11.99,
      oldPrice: 19.99,
      off: "43% OFF",
      left: 12,
      save: "$8.00",
      description:
        "Premium saffron, known as the “king of spices” or “red gold,” is a rare and valuable spice harvested from the Crocus sativus flower requiring about 75,000 blossoms for just one pound. Its rich aroma and vibrant color make it a prized ingredient in gourmet dishes, traditional remedies for mood and digestion, and luxury skincare for its soothing and brightening effects.",
      qualities: [
        `Deep Red Threads`,
        `Intense Aroma`,
        `Hand-Harvested`,
        `Strong Coloring Power`,
        `Distinct Flavor`,
        `ISO Grade I Certified`,
      ],
      rating: 324,
      rating_percentage: "90%",
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
      {FalshSaleProducts.map((item) => (
        <div
          key={item.id}
          className="bg-white text-black rounded-2xl p-5 shadow-lg relative"
        >
          {/* Image */}
          <div className="relative ">
            <span className="absolute z-20 top-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
              {item.off}
            </span>
            {/* <span className="absolute bottom-3 z-50 right-3 bg-white/90 text-black text-xs px-2 py-1 rounded-full">
              only {item.left} left!
            </span> */}

            <div
              className="relative h-48 w-full overflow-hidden rounded-xl  cursor-pointer"
              onMouseEnter={() => setHoveredId(item.id)}
            >
              <Image
                src={`/assets/home/hot_sale/${item.image}`}
                alt={item.title}
                fill
                className="object-cover hover:scale-110"
              />
            </div>
          </div>

          {/* Content */}
          <h3 className="mt-4 text-gray-500 text-lg">{item.title}</h3>

          <div className="mt-2 flex items-center gap-2">
            <span className="text-orange-500 text-xl font-bold">
              ${item.price}
            </span>
            <span className="text-gray-400 line-through text-sm">
              ${item.oldPrice}
            </span>
          </div>

          <p className="text-green-600 text-sm mt-1 flex items-center ">
            <TfiTimer className="mr-2" />
            You save {item.save}
          </p>

          <button className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition cursor-pointer">
            Grab This Deal
          </button>

          <div
            className={`absolute -top-1/4 left-0  h-full   rounded-2xl transition-transform duration-300 ${
              hoveredId === item.id ? "translate-x-0" : "hidden"
            } z-50`}
          >
            {item && (
              <Flash_Sale_Hover_product_Card
                item={item}
                setHoveredId={setHoveredId}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FlashSaleProductCard;
