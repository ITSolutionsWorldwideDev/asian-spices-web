import ProductCard from "@/components/ui/ProductCard";

import Image from "next/image";

type Product = {
  id: number;
  title: string;
  image: string;
  base_price: number;
  oldPrice: number | null;
  tag: string;
  off: string;
  rating: number;
  reviews: number;
  left: number;
  description: string;
  // weight?:string;
};

const products = [
  {
    id: 1,
    title: "Organic Turmeric Powder",
    image: "8a94a27bd306859ae9b600c037a4132590040eeb.jpg",
    base_price: 12.99,
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
    base_price: 9.99,
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
    base_price: 18.99,
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
    base_price: 7.99,
    oldPrice: null,
    tag: "best seller",
    off: "",
    rating: 4,
    reviews: 189,
    left: 24,
    description: `Premium quality organic turmeric from Kerala, India. Rich... `,
  },

  {
    id: 5,
    title: "Whole Cumin Seeds",
    image: "268598abe4d4ba567742332ae571b20ea98ce9d9.jpg",
    base_price: 7.99,
    oldPrice: null,
    tag: "best seller",
    off: "",
    rating: 4,
    reviews: 189,
    left: 24,
    description: `Premium quality organic turmeric from Kerala, India. Rich... `,
  },

  {
    id: 6,
    title: "Whole Cumin Seeds",
    image: "00d83a5cfaaef67b8a9dc507414d03d78021b706.jpg",
    base_price: 7.99,
    oldPrice: null,
    tag: "premium",
    off: "",
    rating: 4,
    reviews: 189,
    left: 24,
    description: `Premium quality organic turmeric from Kerala, India. Rich... `,
  },

  {
    id: 7,
    title: "Whole Cumin Seeds",
    image: "142243c6982a0b8b776915568007e3f82a24e74c.jpg",
    base_price: 7.99,
    oldPrice: null,
    tag: "best seller",
    off: "",
    rating: 4,
    reviews: 189,
    left: 24,
    description: `Premium quality organic turmeric from Kerala, India. Rich... `,
  },

  {
    id: 8,
    title: "Whole Cumin Seeds",
    image: "9b12b7606d96c119efaa1f5498f4718a68810063.jpg",
    base_price: 7.99,
    oldPrice: null,
    tag: "premium",
    off: "",
    rating: 4,
    reviews: 189,
    left: 24,
    description: `Premium quality organic turmeric from Kerala, India. Rich... `,
  },
];

export default function Premium_Spice_Collection() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12 flex justify-center">
        <Image
          src={`/assets/home/premium_collection/badb5e252931de727eded2874c87728ae8ecc916.png`}
          alt="premium SPiece"
          width={150}
          height={140}
          className="object-cover "
        />

        <div>
          <h1 className="md:text-6xl md:font-extrabold text-4xl">
            Premium Spice{" "}
          </h1>
          <h1 className="md:text-8xl md:font-extrabold text-4xl">Collection</h1>
        </div>
      </div>

      <div className="flex justify-center items-center ">
        <p className="text-gray-500 ">
          Discover our most popular spices, handpicked for exceptional quality
          and authentic flavor
        </p>
      </div>

      {/* <ProductCard  /> */}
    </div>
  );
}
