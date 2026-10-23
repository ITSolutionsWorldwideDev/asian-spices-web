import React from "react";
import { Volume2, VolumeX } from "lucide-react";

// import { useReadAloud } from "./SpeakLoud";
import { useReadAloud } from "@/hooks/SpeakLoud";
const ReadAloudBtn = ({ ID }: { ID: string }) => {
  const { isSpeaking, handleReadAloud } = useReadAloud();
  return (
    <button
      className="flex items-center gap-1.5 text-blue-600 text-xs sm:text-sm mb-6 hover:underline cursor-pointer"
      onClick={() => handleReadAloud({ ID: `${ID}` })}
      type="button"
    >
      {isSpeaking ? (
        <VolumeX className="size-[20]" />
      ) : (
        <Volume2 className="size-[20]" />
      )}
      {isSpeaking ? "Stop" : "Read aloud"}
    </button>
  );
};

export default ReadAloudBtn;
