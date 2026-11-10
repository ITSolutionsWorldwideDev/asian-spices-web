// apps/web/components/layout/partner_registration/PartnerRegistration.tsx

import React from "react";
import TabSwitching from "./TabSwitching";
import Footer from "@/components/layout/Footer";

const PartnerRegistration = () => {
  return (
    <div>
      <div className="mb-4">
        <TabSwitching />
      </div>
      <Footer />
    </div>
  );
};

export default PartnerRegistration;
