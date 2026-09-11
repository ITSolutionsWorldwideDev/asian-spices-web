import ComingSoonCategory from "@/components/ui/ComingSoonCategory";
import Footer from "@/components/ui/Footer";
import Nav from "@/components/ui/Nav";
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

  if (!catalogMatch) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <div className="bg-black">
          <Nav />
        </div>

        <ComingSoonCategory
          title="Healthy Living"
          description="We're preparing our Healthy Living collection — health benefits, herbal supplements, and natural skin & hair care. Stay tuned!"
          features={["Health Benefits", "Herbal Supplements", "Natural Care"]}
        />

        <Footer />
      </div>
    );
  }

  return (
    <HealthyLivingProductpage
      params={params}
      searchParams={searchParams}
      catalogMatch={catalogMatch}
    />
  );
}
