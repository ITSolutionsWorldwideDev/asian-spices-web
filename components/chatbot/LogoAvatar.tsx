"use client";

import { Bot } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type LogoAvatarProps = {
  size?: number;
  rounded?: string;
  ring?: boolean;
  priority?: boolean;
};

export function LogoAvatar({
  size = 64,
  rounded = "rounded-[1.6rem]",
  ring = false,
  priority = false,
}: LogoAvatarProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-transparent ${rounded} ${
        ring ? "shadow-[0_16px_34px_rgba(95,61,37,0.18)] ring-1 ring-[rgba(197,122,49,0.14)]" : ""
      }`}
      style={{ width: size, height: size }}
    >
      {hasError ? (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-[#f6efe1] shadow-[0_12px_28px_rgba(95,61,37,0.12)]">
          <Bot className="h-8 w-8 text-[var(--saffron)]" />
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
