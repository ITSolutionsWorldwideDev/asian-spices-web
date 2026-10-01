import React from "react";
interface HeadingDescriptionProps {
  heading: string;
  text?: string;
  description?: string;
}

const HeadingDescription = ({
  heading,
  text,
  description,
}: HeadingDescriptionProps) => {
  return (
    <div className="text-center max-w-2xl mx-auto my-6 sm:my-8 px-4">
      <h2 className="py-2 font-bold text-2xl sm:text-3xl lg:text-4xl text-red-600">
        {heading}
      </h2>

      {text && (
        <p className="mt-3 text-gray-600 text-base sm:text-lg tracking-wide">
          {text}
        </p>
      )}

      {description && (
        <p className="mt-2 text-gray-500 text-sm sm:text-base leading-relaxed px-1">
          {description}
        </p>
      )}
    </div>
  );
};

export default HeadingDescription;
