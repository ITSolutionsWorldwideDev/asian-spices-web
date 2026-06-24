import HeadingDescription from "@/components/ui/HeadingDescription";
import ProductPageHeader from "@/components/ui/ProductPageHeader";
import ProductFilterSearch from "@/components/ui/ProductFilterSearch";
import ProductCard from "@/components/ui/ProductCard";
import React from "react";
// import RegisterOnApp from "@/components/ui/RegisterOnApp";
import Reviews from "@/components/ui/Reviews";
import Footer from "@/components/ui/Footer";

const FoodAndBeverages = () => {
  return (
    <div>
      <ProductPageHeader
        heading="Every Grain, A Burst of Taste"
        text="Handpicked, pure, and powerful  our spices bring depth, warmth, and character to every recipe"
        videoLink="/foods-beverages/0_Food_Asian_Food_3840x2160.mp4"
      />

      <HeadingDescription
        heading="Explore Our Collection"
        text="Shop By All Foods & Beverages"
        description="Discover authentic Foods & Beverages from across Asia, each category carefully for quality and flavor Foods"
      />

      <div className="lg:grid lg:grid-cols-[auto_1fr] lg:gap-4 container mx-auto p-5 lg:items-start "></div>
      {/* <RegisterOnApp /> */}
      <Reviews />
      <Footer />
    </div>
  );
};

export default FoodAndBeverages;
