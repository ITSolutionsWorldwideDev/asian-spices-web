import React from "react";

interface HeadingDescriptionProps {
  heading: string;
  text?: string;
  description: string;
}

const HeadingDescription = ({
  heading,
  text,
  description,
}: HeadingDescriptionProps) => {
  return (
    <div className="text-center max-w-2xl mx-auto my-10 px-4 ">
      {/* Heading */}
      <h3
        className="py-4 font-bold text-2xl sm:text-3xl lg:text-4xl rounded-full 
                     bg-linear-to-r from-orange-100 to-orange-200 text-red-500"
      >
        {heading}
      </h3>

      {/* Subtext */}
      <p className="mt-4 text-gray-600 text-base sm:text-lg tracking-wide">
        {text}
      </p>

      {/* Description */}
      <p className="mt-3 text-gray-500 text-sm sm:text-base leading-relaxed px-1">
        {description}
      </p>
    </div>
  );
};

export default HeadingDescription;
