// apps/web/components/layout/partner_registration/PartnerRegistration.tsx

import React from "react";
import TabSwitching from "./TabSwitching";
import Nav from "@/components/ui/Nav";
import Footer from "@/components/ui/Footer";

const PartnerRegistration = () => {
  return (
    <div>
      <div className="bg-black mb-4">
        <Nav />
      </div>
      <TabSwitching />
      <Footer />
    </div>
  );
};

export default PartnerRegistration;
