// apps/web/components/layout/productdescpage/DescMain.tsx

import ProductDesc from "@/components/ui/ProductDesc";
import Footer from "@/components/ui/Footer";
import Nav from "@/components/ui/Nav";
import RelatedProductsSlider from "./RelatedProductsSlider";

interface Props {
  product: any;
  relatedProducts: any[];
  category: string;
}

export default function ProductDescrption({
  product,
  relatedProducts,
  category,
}: Props) {
  const displayCategory = product?.category_name || category;

  return (
    <div className="bg-gray-50">
      <div className="bg-black">
        <Nav />
      </div>

      <ProductDesc product={product} category={displayCategory} />

      <div className="container mx-auto mt-6 sm:mt-10 px-4 py-4 sm:p-5">
        <h2 className="text-black font-bold text-lg sm:text-xl mb-4 sm:mb-5">You May Also Like</h2>
        <RelatedProductsSlider products={relatedProducts} />
      </div>

      <Footer />
    </div>
  );
}
