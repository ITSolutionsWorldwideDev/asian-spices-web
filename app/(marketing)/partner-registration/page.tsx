// app/partner-registration/page.tsx

import React from "react";
import type { Metadata } from "next";
import PartnerRegistration from "@/components/features/partner-registration/PartnerRegistration";

export const metadata: Metadata = {
  title: "Become a Partner | Asian Spices Partner Registration",
  description:
    "Interested in partnering with Asian Spices? Register here to start the application process.",
  alternates: {
    canonical: "/partner-registration",
  },
};

const page = () => {
  return <PartnerRegistration />;
};

export default page;
