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
        <h1 className="text-black font-bold mb-5">
          You May Also Like
        </h1>

        <ProductCard products={relatedProducts} />
      </div>

      <Footer />
    </div>
  );
};

export default SpicesProductDesc;

/* import ProductTabs from "@/components/layout/productdescpage/ProductTabs";
import ProductDesc from "@/components/ui/ProductDesc";
import React from "react";
import ProductCard from "@/components/ui/ProductCard";
import Footer from "@/components/ui/Footer";
import Nav from "@/components/ui/Nav";

const SpicesProductDesc = () => {
  return (
    <div className="bg-gray-50">
      <div className="bg-black">
        <Nav />
      </div>

      <ProductDesc />
      <div className="mt-10 p-5">
        <h1 className="text-black font-bold">You May Also Like</h1>
      </div>
      <Footer />
    </div>
  );
};

export default SpicesProductDesc; */

{
  /* <ProductCard item={products} /> */
}
{
  /* <ProductCard  /> */
}
/* 


  const products = [
    {
      id: 1,
      title: "Organic Turmeric Powder",
      image: "8a94a27bd306859ae9b600c037a4132590040eeb.jpg",
      price: 12.99,
      oldPrice: 16.99,
      tag: "Best Seller",
      off: "43% OFF",
      rating: 5,
      reviews: 324,
      left: 24,
      description: `Premium quality organic turmeric from Kerala, India. Rich fdsajfk jfsakdjf kfjdsnfljasdnf fasdjfnlasdjf `,
    },
    {
      id: 2,
      title: "Kashmiri Red Chili",
      image: "4caf9d6641bf36d533305c3780224db74f2fcb10.jpg",
      price: 9.99,
      oldPrice: 18.99,
      tag: "premium",
      off: "45% OFF",
      rating: 5,
      reviews: 256,
      left: 24,
      description: `Premium quality organic turmeric from Kerala, India. Rich... `,
    },
    {
      id: 3,
      title: "Green Cardamom Pods",
      image: "d0d71ccc77225c5632c6a8252e49efd239f36128.jpg",
      price: 18.99,
      oldPrice: null,
      tag: "Premium",
      off: "",
      rating: 5,
      reviews: 412,
      left: 24,
      description: `Premium quality organic turmeric from Kerala, India. Rich... `,
    },
    {
      id: 4,
      title: "Whole Cumin Seeds",
      image: "f0628e7f24dc881ed02eabe0e8baad05fe12cecf.jpg",
      price: 7.99,
      oldPrice: null,
      tag: "best seller",
      off: "",
      rating: 4,
      reviews: 189,
      left: 24,
      description: `Premium quality organic turmeric from Kerala, India. Rich... `,
    },
  ];
*/
