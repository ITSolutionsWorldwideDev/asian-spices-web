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
    <div className="flex items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.24)] bg-[rgba(255,250,244,0.34)] px-5 py-4 text-[#2c2720]">
      <div className="flex items-center">
        <div className="relative h-10 w-[132px] shrink-0">
          <Image
            src="/assets/chatbot/asian-spices-logo.webp"
            alt="Asian Spices logo"
            fill
            className="object-contain object-left"
            sizes="132px"
            priority
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onClear}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-full bg-[rgba(255,250,244,0.34)] px-3 py-2 text-sm font-medium text-[#7a5a48] transition hover:bg-[rgba(255,250,244,0.48)] disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Clear chat history"
        >
          <Trash2 className="h-4 w-4" />
          <span>Clear</span>
        </button>
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            disabled={isLoading}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(255,250,244,0.34)] text-[#7a5a48] transition hover:bg-[rgba(255,250,244,0.48)] disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Retry message"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        ) : null}
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(255,250,244,0.34)] text-[#7a5a48] transition hover:bg-[rgba(255,250,244,0.48)]"
          aria-label="Close Bibi chat"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
