import React from "react";
import { ReactNode } from "react";
import { Leaf, Heart, Users, Shield } from "lucide-react";

export interface ValueItem {
  id: number;
  title: string;
  description: string;
  icon: ReactNode;
}

interface ValueCardProps {
  item: ValueItem;
}

const ValueCard = () => {
  const valuesData: ValueItem[] = [
    {
      id: 1,
      title: "Sustainability",
      description:
        "We partner with farmers who use sustainable farming practices to protect our planet for future generations.",
      icon: <Leaf size={24} />,
    },
    {
      id: 2,
      title: "Quality First",
      description:
        "Every spice is hand-selected and lab-tested to ensure you receive only the highest quality products.",
      icon: <Heart size={24} />,
    },
    {
      id: 3,
      title: "Fair Trade",
      description:
        "We believe in fair compensation for farmers and support local communities through ethical sourcing.",
      icon: <Users size={24} />,
    },
    {
      id: 4,
      title: "Authenticity",
      description:
        "Our spices are sourced directly from their regions of origin to guarantee authentic flavors.",
      icon: <Shield size={24} />,
    },
  ];
  return (
    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
      {valuesData.map((item, ind) => (
        <div className="flex flex-col items-center text-center px-6"  key={ind}>
          <div
            className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-500"
           
          >
            {item.icon}
          </div>

          <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>

          <p className="mt-2 text-sm text-gray-600 leading-relaxed">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ValueCard;
