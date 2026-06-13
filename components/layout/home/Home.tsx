// apps/web/components/layout/home/Home.tsx

import React from "react";
import Header from "./Header";
import AnnouncementBar from "./Announcement_Bar";
import HeroSection from "./Collections";
// import FlashSale from "./Flash_Sale";
import Premium_Spice_Collection from "./Premium_Spice_Collection";
import Smart_Appliances from "./Smart_Appliances";
import Story from "./Story";
import Spicy_Story from "./Spicy_Story";
import WhyChooseUs from "./WhyChooseUs";
// import RegisterOnApp from "@/components/ui/RegisterOnApp";
import Reviews from "@/components/ui/Reviews";
import Footer from "@/components/ui/Footer";
import RegisterOnAppModal from "@/components/ui/RegisterOnAppModal";

// import dynamic from "next/dynamic";

// const RegisterOnAppModal = dynamic(
//   () => import("@/components/ui/RegisterOnAppModal"),
//   {
//     ssr: false,
//   }
// );

const Homei = () => {
  return (
    <div>
      <RegisterOnAppModal />

      <Header />
      <AnnouncementBar />
      <HeroSection />
      {/* <FlashSale />  */}
      <Premium_Spice_Collection />
      <Smart_Appliances />
      <Story />
      <Spicy_Story />
      <WhyChooseUs />
      {/* <RegisterOnApp /> */}
      <div className="bg-gray-100">
        <Reviews />
      </div>
      <Footer />
    </div>
  );
};

export default Homei;

// const menuData = {
//   name: "Healthy Living",
//   children: [
//     {
//       heading: "Health Benefits of Herbs",
//       category: [
//         "Supports Immunity",
//         "Aids Digestion",
//         "Promotes Relaxation",
//         "Enhances Energy Levels",
//       ],
//     },
//     {
//       heading: "Herbal Food Supplements",
//       category: ["Capsules", "Powders", "Teas"],
//     },
//     {
//       heading: "Herbal Skin Products",
//       category: ["Face oils", "Creams", "Cleansers"],
//     },
//     {
//       heading: "Herbal Hair Products",
//       category: ["Hair oils", "Shampoos", "Hair masks"],
//     },
//   ],
// };
