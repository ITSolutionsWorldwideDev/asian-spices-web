import Cart from "@/components/ui/Cart";
import Footer from "@/components/ui/Footer";
import Nav from "@/components/ui/Nav";
import React from "react";

const page = async () => {
  return (
    <div>
      <div className="bg-black">
        <Nav />
      </div>
      <Cart />
      <Footer />
    </div>
  );
};

export default page;
