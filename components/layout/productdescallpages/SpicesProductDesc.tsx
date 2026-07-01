// apps/web/components/layout/productdescallpages/SpicesProductDesc.tsx

import ProductDesc from "@/components/ui/ProductDesc";
import Footer from "@/components/ui/Footer";
import Nav from "@/components/ui/Nav";
import ProductCard from "@/components/ui/ProductCard";

interface Props {
  product: any;
  relatedProducts: any[];
}

const SpicesProductDesc = ({ product, relatedProducts }: Props) => {
  return (
    <div className="bg-gray-50">
      <div className="bg-black">
        <Nav />
      </div>

      <ProductDesc product={product} />

      <div className="mt-10 p-5">
        <h1 className="text-black font-bold mb-5">You May Also Like</h1>

        <ProductCard products={relatedProducts} />
      </div>

      <Footer />
    </div>
  );
};

export default SpicesProductDesc;
