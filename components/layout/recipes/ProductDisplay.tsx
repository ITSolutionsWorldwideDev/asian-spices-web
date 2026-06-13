"use client";
import React from "react";
import { useState } from "react";
import RecipesProductCard from "@/components/ui/RecipesProductCard";
import { FaArrowRight } from "react-icons/fa6";
const ProductDisplay = () => {
  const [showAllStores, setShowAllStores] = useState(false);
  const recipes_product_data = [
    {
      title: "Chicken Biryani Recipe",
      image: "recipe-1.png", // replace with your image

      description:
        "Chicken Biryani is a fragrant South Asian dish made by layering aromatic basmati rice with tender, spiced chicken, caramelized onions, fresh herbs, and saffron. Slow-cooked using the traditional dum method, it blends rich flavors and textures, making it a festive favorite for family gatherings and celebrations.",
    },
    {
      title: "Chicken Pizza Recipe",
      image: "recipe-2.png",

      description:
        "A golden crust topped with tender chicken chunks, rich tomato sauce, and a generous layer of melted mozzarella and cheddar cheese. Seasoned with herbs and spices, this pizza blends savory chicken flavor with gooey, creamy cheese — a hearty favorite for casual meals, parties, and family gatherings.",
    },

    {
      title: "Chicken Pizza Recipe",
      image: "recipe-3.png",

      description:
        "A golden crust topped with tender chicken chunks, rich tomato sauce, and a generous layer of melted mozzarella and cheddar cheese. Seasoned with herbs and spices, this pizza blends savory chicken flavor with gooey, creamy cheese — a hearty favorite for casual meals, parties, and family gatherings.",
    },

    {
      title: "Chicken Pizza Recipe",
      image: "recipe-4.png",

      description:
        "A golden crust topped with tender chicken chunks, rich tomato sauce, and a generous layer of melted mozzarella and cheddar cheese. Seasoned with herbs and spices, this pizza blends savory chicken flavor with gooey, creamy cheese — a hearty favorite for casual meals, parties, and family gatherings.",
    },

    {
      title: "Chicken Pizza Recipe",
      image: "recipe-5.png",

      description:
        "A golden crust topped with tender chicken chunks, rich tomato sauce, and a generous layer of melted mozzarella and cheddar cheese. Seasoned with herbs and spices, this pizza blends savory chicken flavor with gooey, creamy cheese — a hearty favorite for casual meals, parties, and family gatherings.",
    },

    {
      title: "Chicken Pizza Recipe",
      image: "511d75edd299a537dadb2933ba8ea0178e2c3185.png",

      description:
        "A golden crust topped with tender chicken chunks, rich tomato sauce, and a generous layer of melted mozzarella and cheddar cheese. Seasoned with herbs and spices, this pizza blends savory chicken flavor with gooey, creamy cheese — a hearty favorite for casual meals, parties, and family gatherings.",
    },

    {
      title: "Chicken Pizza Recipe",
      image: "511d75edd299a537dadb2933ba8ea0178e2c3185.png",

      description:
        "A golden crust topped with tender chicken chunks, rich tomato sauce, and a generous layer of melted mozzarella and cheddar cheese. Seasoned with herbs and spices, this pizza blends savory chicken flavor with gooey, creamy cheese — a hearty favorite for casual meals, parties, and family gatherings.",
    },

    {
      title: "Chicken Pizza Recipe",
      image: "511d75edd299a537dadb2933ba8ea0178e2c3185.png",

      description:
        "A golden crust topped with tender chicken chunks, rich tomato sauce, and a generous layer of melted mozzarella and cheddar cheese. Seasoned with herbs and spices, this pizza blends savory chicken flavor with gooey, creamy cheese — a hearty favorite for casual meals, parties, and family gatherings.",
    },

    {
      title: "Chicken Pizza Recipe",
      image: "511d75edd299a537dadb2933ba8ea0178e2c3185.png",

      description:
        "A golden crust topped with tender chicken chunks, rich tomato sauce, and a generous layer of melted mozzarella and cheddar cheese. Seasoned with herbs and spices, this pizza blends savory chicken flavor with gooey, creamy cheese — a hearty favorite for casual meals, parties, and family gatherings.",
    },

    {
      title: "Chicken Pizza Recipe",
      image: "511d75edd299a537dadb2933ba8ea0178e2c3185.png",

      description:
        "A golden crust topped with tender chicken chunks, rich tomato sauce, and a generous layer of melted mozzarella and cheddar cheese. Seasoned with herbs and spices, this pizza blends savory chicken flavor with gooey, creamy cheese — a hearty favorite for casual meals, parties, and family gatherings.",
    },

    {
      title: "Chicken Pizza Recipe",
      image: "511d75edd299a537dadb2933ba8ea0178e2c3185.png",

      description:
        "A golden crust topped with tender chicken chunks, rich tomato sauce, and a generous layer of melted mozzarella and cheddar cheese. Seasoned with herbs and spices, this pizza blends savory chicken flavor with gooey, creamy cheese — a hearty favorite for casual meals, parties, and family gatherings.",
    },

    {
      title: "Chicken Pizza Recipe",
      image: "511d75edd299a537dadb2933ba8ea0178e2c3185.png",

      description:
        "A golden crust topped with tender chicken chunks, rich tomato sauce, and a generous layer of melted mozzarella and cheddar cheese. Seasoned with herbs and spices, this pizza blends savory chicken flavor with gooey, creamy cheese — a hearty favorite for casual meals, parties, and family gatherings.",
    },

    {
      title: "Chicken Pizza Recipe",
      image: "511d75edd299a537dadb2933ba8ea0178e2c3185.png",

      description:
        "A golden crust topped with tender chicken chunks, rich tomato sauce, and a generous layer of melted mozzarella and cheddar cheese. Seasoned with herbs and spices, this pizza blends savory chicken flavor with gooey, creamy cheese — a hearty favorite for casual meals, parties, and family gatherings.",
    },

    {
      title: "Chicken Pizza Recipe",
      image: "511d75edd299a537dadb2933ba8ea0178e2c3185.png",

      description:
        "A golden crust topped with tender chicken chunks, rich tomato sauce, and a generous layer of melted mozzarella and cheddar cheese. Seasoned with herbs and spices, this pizza blends savory chicken flavor with gooey, creamy cheese — a hearty favorite for casual meals, parties, and family gatherings.",
    },
  ];

  const visibleStores = showAllStores
    ? recipes_product_data
    : recipes_product_data.slice(0, 12);
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-3 gap-8 mt-10">
        {visibleStores.map((card, idx) => (
          <div className="shadow-2xl rounded-2xl " key={idx}>
            <RecipesProductCard card={card} />
          </div>
        ))}
      </div>
      <div>
        {recipes_product_data.length > 12 && (
          <div className="flex justify-center mt-8 mb-10">
            <button
              onClick={() => setShowAllStores(!showAllStores)}
              className="relative flex items-center justify-center px-10 py-5 bg-black  text-white font-semibold rounded-lg transition-colors group cursor-pointer"
            >
              <span className="absolute inset-0 bg-linear-to-r  from-white/40 to-white/90 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-center"></span>

              {showAllStores ? (
                "See Less"
              ) : (
                <>
                  See More
                  <FaArrowRight className="ml-5" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDisplay;
