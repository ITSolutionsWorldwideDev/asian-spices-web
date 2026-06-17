// app/kitchen-appliances/[slug]/page.tsx

import ProductDescrption from "@/components/layout/productdescpage/DescMain";
import ProductNotFound from "@/components/layout/productdescpage/ProductNotFound";
import { getProductBySlug, getRelatedProducts } from "@/lib/dbactions/products";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product || !product.id) {
    return {
      title: "Product not found",
    };
  }

  return {
    title: product.name,
    description: product.description || "Product details",
  };
}

export default async function SpicesDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || !product.id) {
    return (
      <div className="bg-gray-50">
        <ProductNotFound />
      </div>
    );
  }

  const relatedProducts = await getRelatedProducts(product.category_id);

  return (
    <ProductDescrption product={product} relatedProducts={relatedProducts} />
  );
}

/* import ProductTabs from "@/components/layout/productdescpage/ProductTabs";
import ProductDesc from "@/components/ui/ProductDesc";
import React from "react";
import ProductCard from "@/components/ui/ProductCard";
import Footer from "@/components/ui/Footer";
import Nav from "@/components/ui/Nav";
import KitchenAppliancesProductDesc from "@/components/layout/productdescallpages/KitchenAppliancesProductDesc";

const kitchenDetailPage = () => {
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
  return (
    <div className="bg-gray-50">
      <KitchenAppliancesProductDesc />
    </div>
  );
};

export default kitchenDetailPage;
 */
