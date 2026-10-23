import ProductTabs from "@/components/features/products/detail/ProductTabs";
import Footer from "@/components/layout/Footer";
import Nav from "@/components/layout/Nav";
import ProductDesc from "@/components/features/products/ProductDesc";
import React from "react";

const page = ({ item }: any) => {
  return (
    <div>
      <div className="bg-black">
        <Nav />
      </div>
      {/* <ProductDesc />
      <ProductTabs /> */}
      {/* <div className="mt-10 p-5">
        <h1 className="text-black font-bold">You May Also Like</h1>
      </div> */}
      <Footer />
    </div>
  );
};

export default page;
