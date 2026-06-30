import Footer from "@/components/ui/Footer";
import HeadingDescription from "@/components/ui/HeadingDescription";
// import ProductCard from "@/components/ui/ProductCard";
// import ProductFilterSearch from "@/components/ui/ProductFilterSearch";
import ProductPageHeader from "@/components/ui/ProductPageHeader";
// import RegisterOnApp from "@/components/ui/RegisterOnApp";
import Reviews from "@/components/ui/Reviews";
import React from "react";

const spices = () => {
  return (
    <div className="category-animation">
      <ProductPageHeader
        heading="Every Grain, A Burst of Taste"
        text="Handpicked, pure, and powerful  our spices bring depth, warmth, and character to every recipe"
        videoLink={"/spices/Comp 1_10.mp4"}
      />

      <HeadingDescription
        heading="Explore Our Collection"
        text="Shop By All Spices"
        description="Discover authentic spices from across Asia, each category carefully for quality and flavor Indian Spices"
      />
      <div className="grid grid-col-1 lg:grid-cols-[auto_1fr] gap-4 container mx-auto p-5 items-start"></div>

      {/* <RegisterOnApp /> */}
      <Reviews />
      <Footer />
    </div>
  );
};

export default spices;
