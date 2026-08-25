import HealthyLivingProductpage from "@/components/layout/healthyliving/HealthyLivingProductpage";
import React from "react";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    subcategories?: string;
    brands?: string;
    min?: string;
    max?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  return (
    <div>
      <HealthyLivingProductpage params={params} searchParams={searchParams} />
    </div>
  );
}