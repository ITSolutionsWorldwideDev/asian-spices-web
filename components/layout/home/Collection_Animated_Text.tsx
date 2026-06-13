import React, { FC } from "react";

const CollectionAnimatedText: FC = () => {
  return (
    <div className="text-center md:text-left">
      <h1 className=" leading-tight animate-color-cycle">
        <span
          className="text-6xl 2xl:text-[8rem]  font-black  text-transparent 
                        [text-stroke:2px_black] [-webkit-text-stroke:2px_black] 
                        mr-7"
          style={{ color: "var(--color-one, #94a3b8)" }}
        >
          ONE
        </span>
        {/* //    */}

        <span
          className="text-6xl 2xl:text-[8rem]  font-black text-transparent 
                        [text-stroke:2px_black] [-webkit-text-stroke:2px_black] 
                        text-shadow-outline"
          style={{ color: "var(--color-two, #94a3b8)" }}
        >
          SPICE
        </span>
        {/* //    */}

        <br />
        <span
          className="text-6xl 2xl:text-[8rem]  font-black text-transparent 
                        [text-stroke:2px_black] [-webkit-text-stroke:2px_black] 
                        text-shadow-outline mr-7"
          style={{ color: "var(--color-three, #94a3b8)" }}
        >
          AT A
        </span>
        {/* //    */}

        <span
          className="text-6xl 2xl:text-[8rem]  font-black text-transparent 
                        [text-stroke:2px_black] [-webkit-text-stroke:2px_black] 
                        text-shadow-outline"
          style={{ color: "var(--color-four, #94a3b8)" }}
        >
          TIME
        </span>
      </h1>
    </div>
  );
};

export default CollectionAnimatedText;
