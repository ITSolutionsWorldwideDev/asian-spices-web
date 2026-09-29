// apps\web\app\partnerplatform\page.tsx

import React from "react";
import type { Metadata } from "next";
import PartnerPlatform from "@/components/layout/sellerhub/SellerHub";

export const metadata: Metadata = {
  title: "Partner Platform | Asian Spices",
  description:
    "Log in to the Asian Spices Partner Platform to manage your account, orders, and partnership details.",
  alternates: {
    canonical: "/partnerplatform",
  },
};

const page = () => {
  return (
    <div>
      <PartnerPlatform />
    </div>
  );
};

export default page;
