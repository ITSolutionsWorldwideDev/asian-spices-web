import HealthyLivingProductpage from "@/components/layout/healthyliving/HealthyLivingProductpage";
import React from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  
  const { slug } = await params;

  return (
    <div>
      <HealthyLivingProductpage slug={slug} />
    </div>
  );
}
