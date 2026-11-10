"use client";

import { Bot } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type LogoAvatarProps = {
  size?: number;
  rounded?: string;
  ring?: boolean;
  priority?: boolean;
  className?: string;
};

export function LogoAvatar({
  size = 48,
  rounded = "rounded-full",
  ring = false,
  priority = false,
  className = "",
}: LogoAvatarProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={`relative flex items-center justify-center shrink-0 overflow-hidden bg-transparent ${rounded} ${
        ring ? "shadow-[0_10px_24px_rgba(95,61,37,0.16)] ring-1 ring-[rgba(197,122,49,0.14)]" : ""
      } ${className}`}
      style={className ? undefined : { width: size, height: size }}
    >
      {hasError ? (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-[#f6efe1] shadow-[0_12px_28px_rgba(95,61,37,0.12)]">
          <Bot className="h-5 w-5 sm:h-7 sm:w-7 text-[var(--saffron)]" />
        </div>
      ) : (
        <Image
          src="/assets/chatbot/bibi-logo-widget-clean.png"
          alt="Bibi logo"
          fill
          className="object-contain"
          sizes={`${size}px`}
          onError={() => setHasError(true)}
          priority={priority}
        />
      )}
    </div>
  );
}
