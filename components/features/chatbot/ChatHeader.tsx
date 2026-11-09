import Image from "next/image";
import { RotateCcw, Trash2, X } from "lucide-react";
import type { BackendConnectionStatus } from "@/types/chat";

type ChatHeaderProps = {
  connectionStatus: BackendConnectionStatus;
  isLoading: boolean;
  endpointLabel: string;
  onClose: () => void;
  onClear: () => void;
  onRetry?: (() => void) | null;
};

export function ChatHeader({
  connectionStatus,
  isLoading,
  endpointLabel,
  onClose,
  onClear,
  onRetry,
}: ChatHeaderProps) {
  void connectionStatus;
  void endpointLabel;

  return (
    <div className="flex items-center justify-between gap-2 border-b border-[rgba(255,255,255,0.24)] bg-[rgba(255,250,244,0.34)] px-3 py-2.5 sm:px-5 sm:py-3.5 text-[#2c2720]">
      <div className="flex items-center min-w-0">
        <div className="relative h-6 w-[86px] sm:h-9 sm:w-[120px] md:h-10 md:w-[132px] shrink-0">
          <Image
            src="/assets/chatbot/asian-spices-logo.webp"
            alt="Asian Spices logo"
            fill
            className="object-contain object-left"
            sizes="(max-width: 640px) 86px, 132px"
            priority
          />
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <button
          type="button"
          onClick={onClear}
          disabled={isLoading}
          className="inline-flex items-center gap-1 sm:gap-2 rounded-full bg-[rgba(255,250,244,0.34)] px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-medium text-[#7a5a48] transition hover:bg-[rgba(255,250,244,0.48)] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          aria-label="Clear chat history"
        >
          <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span>Clear</span>
        </button>
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            disabled={isLoading}
            className="inline-flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-[rgba(255,250,244,0.34)] text-[#7a5a48] transition hover:bg-[rgba(255,250,244,0.48)] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            aria-label="Retry message"
          >
            <RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        ) : null}
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-[rgba(255,250,244,0.34)] text-[#7a5a48] transition hover:bg-[rgba(255,250,244,0.48)] cursor-pointer"
          aria-label="Close Bibi chat"
        >
          <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>
      </div>
    </div>
  );
}
