import React from "react";

interface FlashSaleProduct {
  id: number;
  title: string;
  image: string;
  price: number;
  oldPrice: number;
  off: string;
  left: number;
  save: string;
  description: string;
  qualities: string[];
  rating: number;
  rating_percentage: string;
}

interface HoverCardProps {
  item: FlashSaleProduct;
  setHoveredId: React.Dispatch<React.SetStateAction<number | null>>;
}

// Replace with your image path

// Star icon component
const StarIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
  <svg
    className={`w-5 h-5 ${filled ? "text-yellow-400" : "text-gray-300"}`}
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.817 2.045a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.817-2.045a1 1 0 00-1.175 0l-2.817 2.045c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const Flash_Sale_Hover_product_Card: React.FC<HoverCardProps> = ({
  item,
  setHoveredId,
}) => {
  const stars = [1, 2, 3, 4, 5].map((i) => i <= item.rating);

  return (
    <div
      className="max-w-lg mx-auto bg-white shadow-xl rounded-xl p-4 border border-gray-100   hover-card"
      onMouseLeave={() => setHoveredId(null)}
    >
      {/* Header: Image, Title, Price, Rating */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="w-28  shrink-0">
          <img
            src={`/assets/home/hot_sale/${item.image}`}
            alt="Premium Saffron"
            className="  object-cover rounded-lg border border-gray-200"
            style={{ aspectRatio: "1/1" }}
          />
        </div>

        <div className="grow">
          <h2 className="text-xl font-serif font-semibold text-gray-800 ">
            {item.title}
          </h2>

          <div className="flex items-baseline space-x-2 mb-3">
            <span className="text-4xl font-bold text-orange-500">
              {item.price}
            </span>
            <span className="text-xl text-gray-400 line-through">
              {item.oldPrice}
            </span>
          </div>

          <div className="flex items-center">
            {stars.map((filled, index) => (
              <StarIcon key={index} filled={filled} />
            ))}
            <span className="ml-2 text-gray-600">({item.rating})</span>
          </div>
        </div>
      </div>

      <hr className="  " />

      {/* Feature Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        {item.qualities.map((tag, index) => (
          <span
            key={index}
            className="px-3  text-sm font-medium text-gray-700  rounded-full border bg-gray-300 border-gray-200 shadow-sm"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm leading-relaxed ">
        {item.description}
      </p>
    </div>
  );
};

export default Flash_Sale_Hover_product_Card;
