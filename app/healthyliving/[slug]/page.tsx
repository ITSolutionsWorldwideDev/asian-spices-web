import type { Metadata } from "next";
import HealthyLivingProductpage from "@/components/layout/healthyliving/HealthyLivingProductpage";
import { getCatalogMatchForSlug } from "@/lib/dbactions/categories";
import { slugContent, AllowedSlug } from "@/data/healthyLivingData";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = slugContent[slug as AllowedSlug];
  if (content?.metaTitle) {
    return {
      title: content.metaTitle,
      description: content.metaDesc || content.text,
      alternates: {
        canonical: `/healthyliving/${slug}`,
      },
    };
  }
  return {
    title: `${slug.replace(/-/g, " ")} | Healthy Living | Asian Spices`,
    alternates: {
      canonical: `/healthyliving/${slug}`,
    },
  };
}

export default async function Page({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const catalogMatch = await getCatalogMatchForSlug(slug);

  return (
    <HealthyLivingProductpage
      params={params}
      searchParams={searchParams}
      catalogMatch={catalogMatch}
    />
  );
}
