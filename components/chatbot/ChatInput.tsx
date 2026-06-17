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
    <div className="bg-transparent px-4 py-4 sm:px-5">
      <div className="flex items-center gap-3 rounded-[1.75rem] border border-[rgba(255,255,255,0.34)] bg-[rgba(255,255,255,0.72)] px-4 py-3 shadow-[0_10px_24px_rgba(95,61,37,0.08)]">
        <button
          type="button"
          disabled
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[rgba(112,89,73,0.92)]"
          aria-label="Attachment options"
        >
          <CirclePlus className="h-5 w-5" />
        </button>
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Ask Bibi about spices, recipes, or swaps"
            className="max-h-[140px] min-h-[52px] w-full resize-none overflow-hidden bg-transparent px-1 py-2 text-[15px] leading-9 text-[#5a4d44] outline-none placeholder:text-[rgba(152,139,126,0.94)]"
          />
        </div>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading || !value.trim()}
          className="inline-flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-[0.95rem] bg-[#b45534] text-white shadow-[0_10px_22px_rgba(180,85,52,0.28)] transition hover:brightness-95 disabled:cursor-not-allowed disabled:bg-[rgba(180,85,52,0.42)]"
          aria-label="Send message"
        >
          <SendHorizontal className="h-4.5 w-4.5" />
        </button>
      </div>
      <div className="pt-3 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-[rgba(153,138,124,0.85)]">
        Bibi for Asian Spices
      </div>
    </div>
  );
}
