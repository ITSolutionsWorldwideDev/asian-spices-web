"use client";

import { CirclePlus, SendHorizontal } from "lucide-react";
import {
  type ChangeEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
} from "react";

type ChatInputProps = {
  value: string;
  isLoading: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

function resizeTextarea(element: HTMLTextAreaElement | null) {
  if (!element) {
    return;
  }

  element.style.height = "0px";
  element.style.height = `${Math.min(element.scrollHeight, 220)}px`;
}

export function ChatInput({
  value,
  isLoading,
  onChange,
  onSubmit,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    resizeTextarea(textareaRef.current);
  }, [value]);

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    onChange(event.target.value);
    resizeTextarea(event.target);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  }

  return (
    <div className="notranslate bg-transparent px-2.5 py-2 sm:px-5 sm:py-3.5" translate="no">
      <div className="flex items-center gap-1.5 sm:gap-3 rounded-[1.15rem] sm:rounded-[1.75rem] border border-[rgba(255,255,255,0.34)] bg-[rgba(255,255,255,0.72)] px-2.5 py-1 sm:px-4 sm:py-2.5 shadow-[0_8px_20px_rgba(95,61,37,0.06)]">
        <button
          type="button"
          disabled
          className="inline-flex h-7 w-7 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full text-[rgba(112,89,73,0.92)]"
          aria-label="Attachment options"
        >
          <CirclePlus className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
        <div className="relative flex-1 min-w-0">
          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Ask Bibi about spices, recipes, or swaps"
            className="max-h-[120px] min-h-[34px] sm:min-h-[46px] w-full resize-none overflow-hidden bg-transparent px-1 py-1 sm:py-2 text-xs sm:text-sm leading-5 sm:leading-6 text-[#5a4d44] outline-none placeholder:text-[rgba(152,139,126,0.94)]"
          />
        </div>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading || !value.trim()}
          className="inline-flex h-7 w-7 sm:h-[40px] sm:w-[40px] shrink-0 items-center justify-center rounded-lg sm:rounded-[0.95rem] bg-[#b45534] text-white shadow-[0_6px_16px_rgba(180,85,52,0.24)] transition hover:brightness-95 disabled:cursor-not-allowed disabled:bg-[rgba(180,85,52,0.42)] cursor-pointer"
          aria-label="Send message"
        >
          <SendHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>
      </div>
      <div className="pt-1.5 text-center text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.16em] text-[rgba(153,138,124,0.85)]">
        Bibi for Asian Spices
      </div>
    </div>
  );
}
