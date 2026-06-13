import React from "react";
import ProductHeader from "./ProductHeader";
import HeadingDescription from "@/components/ui/HeadingDescription";
// import ProductFilterSearch from "@/components/ui/ProductFilterSearch";
// import ProductCard from "@/components/ui/ProductCard";
// import RegisterOnApp from "@/components/ui/RegisterOnApp";
import Reviews from "@/components/ui/Reviews";
import Footer from "@/components/ui/Footer";

type props = {
  slug: string;
};

type AllowedSlug =
  | "supports-immunity"
  | "aids-digestion"
  | "promotes-relaxation"
  | "enhances-energy-levels"
  | "capsules"
  | "powders"
  | "teas"
  | "face-oils"
  | "creams"
  | "cleansers"
  | "hair-oils"
  | "shampoos"
  | "hair-masks";
const HealthyLivingProductpage = ({ slug }: props) => {
  const allowedSlugs: AllowedSlug[] = [
    "supports-immunity",
    "aids-digestion",
    "promotes-relaxation",
    "enhances-energy-levels",
    "capsules",
    "powders",
    "teas",
    "face-oils",
    "creams",
    "cleansers",
    "hair-oils",
    "shampoos",
    "hair-masks",
  ];

  const slugToImage: Record<AllowedSlug, string> = {
    "supports-immunity": "2d9352553931e5c819d797c2021f90b6cc5487cb (1).webp",
    "aids-digestion": "2d9352553931e5c819d797c2021f90b6cc5487cb (1).webp",
    "promotes-relaxation": "2d9352553931e5c819d797c2021f90b6cc5487cb (1).webp",
    "enhances-energy-levels":
      "2d9352553931e5c819d797c2021f90b6cc5487cb (1).webp",

    capsules: "2d9352553931e5c819d797c2021f90b6cc5487cb (1).webp",
    powders: "4777fae28bf8c8529b660c5ef85ae3659de6d557.webp",
    teas: "b4158a315fa57749b144b6d49c4f448d4a4d7249.webp",

    "face-oils": "d2cb8935bb558e99e2e4b28b0b9676798515ab77.webp",
    creams: "820d80edf257bfaaafaf9f554b155a673f1442d5 (1).webp",
    cleansers: "06e813a64e3ac39522ae949f8180359993726b4d.webp",

    "hair-oils": "58fc0fa164ef0ee9e82f34ad3160c3b9c3e8657c.webp",
    shampoos: "58fc0fa164ef0ee9e82f34ad3160c3b9c3e8657c (1).webp",
    "hair-masks": "fecb41921011cc0e5db4dbd75df119f1ea19d248.webp",
  };

  if (!allowedSlugs.includes(slug as AllowedSlug)) {
    return <div>Invalid slug</div>;
  }

  const image = slugToImage[slug as AllowedSlug];

  return (
    <div>
      <ProductHeader
        heading="Every Grain, A Burst of Taste"
        text="Handpicked, pure, and powerful  our spices bring depth, warmth, and character to every recipe"
        imageLink={image}
      />
      <HeadingDescription
        heading="Explore Our Collection"
        text="Shop By All Spices"
        description="Discover authentic spices from across Asia, each category carefully for quality and flavor Indian Spices"
      />

      <div className="grid grid-col-1 lg:grid-cols-[auto_1fr] gap-4 container mx-auto p-5 items-start">
        {/* <ProductFilterSearch
          // categoriesData={categoriesData}
          storesData={storesData}
          title1={"Spices Category"}
          title2={"Stores"}
        />
        <ProductCard /> */}
      </div>

      {/* <RegisterOnApp /> */}
      <Reviews />
      <Footer />
    </div>
  );
};

export default HealthyLivingProductpage;

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
      weight: "5g",
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
      weight: "5g",
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
      weight: "5g",
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
      weight: "5g",
    },

    {
      id: 5,
      title: "Whole Cumin Seeds",
      image: "268598abe4d4ba567742332ae571b20ea98ce9d9.jpg",
      price: 7.99,
      oldPrice: null,
      tag: "best seller",
      off: "",
      rating: 4,
      reviews: 189,
      left: 24,
      description: `Premium quality organic turmeric from Kerala, India. Rich... `,
      weight: "5g",
    },

    {
      id: 6,
      title: "Whole Cumin Seeds",
      image: "00d83a5cfaaef67b8a9dc507414d03d78021b706.jpg",
      price: 7.99,
      oldPrice: null,
      tag: "premium",
      off: "",
      rating: 4,
      reviews: 189,
      left: 24,
      description: `Premium quality organic turmeric from Kerala, India. Rich... `,
      weight: "5g",
    },

    {
      id: 7,
      title: "Whole Cumin Seeds",
      image: "142243c6982a0b8b776915568007e3f82a24e74c.jpg",
      price: 7.99,
      oldPrice: null,
      tag: "best seller",
      off: "",
      rating: 4,
      reviews: 189,
      left: 24,
      description: `Premium quality organic turmeric from Kerala, India. Rich... `,
      weight: "5g",
    },

    {
      id: 8,
      title: "Whole Cumin Seeds",
      image: "9b12b7606d96c119efaa1f5498f4718a68810063.jpg",
      price: 7.99,
      oldPrice: null,
      tag: "premium",
      off: "",
      rating: 4,
      reviews: 189,
      left: 24,
      description: `Premium quality organic turmeric from Kerala, India. Rich... `,
      weight: "5g",
    },

    {
      id: 8,
      title: "Whole Cumin Seeds",
      image: "9b12b7606d96c119efaa1f5498f4718a68810063.jpg",
      price: 7.99,
      oldPrice: null,
      tag: "premium",
      off: "",
      rating: 4,
      reviews: 189,
      left: 24,
      description: `Premium quality organic turmeric from Kerala, India. Rich... `,
      weight: "5g",
    },

    {
      id: 8,
      title: "Whole Cumin Seeds",
      image: "9b12b7606d96c119efaa1f5498f4718a68810063.jpg",
      price: 7.99,
      oldPrice: null,
      tag: "premium",
      off: "",
      rating: 4,
      reviews: 189,
      left: 24,
      description: `Premium quality organic turmeric from Kerala, India. Rich... `,
      weight: "5g",
    },

    {
      id: 8,
      title: "Whole Cumin Seeds",
      image: "9b12b7606d96c119efaa1f5498f4718a68810063.jpg",
      price: 7.99,
      oldPrice: null,
      tag: "premium",
      off: "",
      rating: 4,
      reviews: 189,
      left: 24,
      description: `Premium quality organic turmeric from Kerala, India. Rich... `,
      weight: "5g",
    },
  ];
  const title = "Spices";
  const categoriesData = [
    { name: "All Spices" },
    {
      name: "Indian Spices",
      children: ["Garam Masala", "Turmeric", "Cumin", "Cardamom"],
    },
    {
      name: "Chinese Spices",
      children: ["Star Anise", "Szechuan Pepper", "Five Spice"],
    },

    { name: "Thai Spices" }, // No children
    { name: "Blend Spices" },
  ];

  const storesData = [
    "Bvr Spices",
    "Neam Spices",
    "Thika Masala",
    "Too Spicy",
    "Aron Masalas",
    "Farm Special",
    "Zafrani Mehal",
    "Chili Fresh",
    "Good Spices",
  ];
*/
