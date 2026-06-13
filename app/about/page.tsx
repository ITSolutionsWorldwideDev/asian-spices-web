import Achievement from "@/components/layout/about_us/Achievement";
import OurTeam from "@/components/layout/about_us/OurTeam";
import OurValues from "@/components/layout/about_us/OurValues";
import Story from "@/components/layout/about_us/Story";
import ProductPageHeader from "@/components/ui/ProductPageHeader";
import Redirect from "@/components/layout/about_us/Redirect";
import React from "react";
import Footer from "@/components/ui/Footer";

const AboutUs = () => {
  return (
    <div>
      <ProductPageHeader
        heading="Bringing Authentic Asian Flavors to Your Kitchen"
        text="Asian Spices was founded with a simple mission to source the finest Asian spices directly from theirregions of origin and bring them to passionate home cooks and professional chefs around the world."
        videoLink="/spices/Comp 1_10.mp4"
      />
      <div className="mt-10">
        <Achievement />
      </div>

      <div className="bg-gray-50 mt-10">
        <Story />
        <OurValues />
        <OurTeam />
        <Redirect />
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;
