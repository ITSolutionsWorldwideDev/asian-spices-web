// apps/web/components/layout/productdescpage/DescMain.tsx

import ProductDesc from "@/components/ui/ProductDesc";
import Footer from "@/components/ui/Footer";
import Nav from "@/components/ui/Nav";
// import ProductCard from "@/components/ui/ProductCard";
import RelatedProductsSlider from "./RelatedProductsSlider";

interface Props {
  product: any;
  relatedProducts: any[];
}

export default function ProductDescrption({ product, relatedProducts }: Props) {
  return (
    <div className="bg-gray-50">
      <div className="bg-black">
        <Nav />
      </div>

      <ProductDesc product={product} />

      <div className="container mx-auto mt-10 p-5">
        <h1 className="text-black font-bold mb-5">You May Also Like</h1>

        {/* <ProductCard products={relatedProducts} /> */}
        <RelatedProductsSlider products={relatedProducts} />
      </div>

      <Footer />
    </div>
  );
}
