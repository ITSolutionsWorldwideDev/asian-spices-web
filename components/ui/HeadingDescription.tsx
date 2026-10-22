import React from "react";
interface HeadingDescriptionProps {
  heading: string;
  text?: string;
  description?: string;
  as?: "h1" | "h2" | "h3";
}

const HeadingDescription = ({
  heading,
  text,
  description,
  as: Tag = "h2",
}: HeadingDescriptionProps) => {
  return (
    <div className="text-center max-w-2xl mx-auto my-6 sm:my-8 px-4">
      <Tag className="py-2 font-bold text-2xl sm:text-3xl lg:text-4xl text-red-600">
        {heading}
      </Tag>

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
