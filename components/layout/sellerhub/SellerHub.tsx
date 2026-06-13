import Nav from "@/components/ui/Nav";
import React from "react";
import AdvertisingSolution from "./AdvertisingSolution";
import Advantages from "./Advantages";
import KickstartSales from "./KickstartSales";
import Footer from "@/components/ui/Footer";
import SalesCalltoAction from "./SalesCalltoAction";

const PartnerPlatform = () => {
  return (
    <div>
      <div className="bg-black">
        <Nav />
      </div>
      <AdvertisingSolution />
      <Advantages />
      <KickstartSales />
      <SalesCalltoAction />
      <Footer />
    </div>
  );
};

export default PartnerPlatform;
