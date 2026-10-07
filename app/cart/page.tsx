import Cart from "@/components/ui/Cart";
import Nav from "@/components/ui/Nav";
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
