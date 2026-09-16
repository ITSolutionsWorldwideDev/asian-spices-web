import HealthyLivingProductpage from "@/components/layout/healthyliving/HealthyLivingProductpage";
import { getCatalogMatchForSlug } from "@/lib/dbactions/categories";

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
