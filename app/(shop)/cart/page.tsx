import Cart from "@/components/features/cart/Cart";
import Nav from "@/components/layout/Nav";
import React from "react";

const page = async () => {
  return (
    <div>
      <div className="bg-black">
        <Nav />
      </div>
      <Cart />
    </div>
  );
};

export default page;
