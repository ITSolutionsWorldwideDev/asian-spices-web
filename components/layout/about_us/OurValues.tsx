import React from "react";
import ValueCard from "./ValueCard";

const OurValues = () => {
  return (
    <section className=" bg-white py-16 rounded-lg container mx-auto">
      <div className="mx-auto max-w-7xl px-4">
        {/* Heading */}
        <div className="mb-12 text-center">
          <p className="text-sm font-medium text-gray-500">Our Values</p>
          <h2 className="mt-2 text-base text-gray-700 max-w-2xl mx-auto">
            These core principles guide everything we do, from sourcing to
            customer service
          </h2>
        </div>

        {/* Grid */}
        <ValueCard />
      </div>
    </section>
  );
};

export default OurValues;
