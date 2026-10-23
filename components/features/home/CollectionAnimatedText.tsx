import { FC } from "react";

/** White fill + black outline — matches the mock slogan */
const outlineStyle = {
  color: "#ffffff",
  WebkitTextStroke: "2px #111111",
  paintOrder: "stroke fill" as const,
};

const CollectionAnimatedText: FC = () => {
  return (
    <div className="flex h-full w-full items-center text-left">
      <h2 className="w-full font-black uppercase leading-[0.95] tracking-tight">
        <span className="block">
          <span className="text-5xl text-amber-500 sm:text-6xl xl:text-7xl 2xl:text-[5.5rem]">
            One{" "}
          </span>
          <span
            className="text-5xl sm:text-6xl xl:text-7xl 2xl:text-[5.5rem]"
            style={outlineStyle}
          >
            Spice
          </span>
        </span>
        <span
          className="mt-1 block text-5xl sm:text-6xl xl:text-7xl 2xl:text-[5.5rem]"
          style={outlineStyle}
        >
          At A Time.
        </span>
      </h2>
    </div>
  );
};

export default CollectionAnimatedText;
