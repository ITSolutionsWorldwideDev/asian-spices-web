"use client";

import { useEffect, useRef } from "react";

import { MessageBubble } from "@/components/chatbot/MessageBubble";
import { QuickPromptChips } from "@/components/chatbot/QuickPromptChips";
import type { ChatMessage } from "@/types/chat";

type MessageListProps = {
  messages: ChatMessage[];
  onPromptSelect?: (value: string) => void;
};

export function MessageList({ messages, onPromptSelect }: MessageListProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const showWelcomePrompts =
    messages.length === 1 &&
    messages[0]?.role === "assistant" &&
    typeof onPromptSelect === "function";

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) {
      return;
    }

    if (lastMessage.role === "assistant") {
      const target = containerRef.current?.querySelector<HTMLElement>(
        `[data-message-id="${lastMessage.id}"]`,
      );
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  return (
    <div
      ref={containerRef}
      className="scrollbar-thin min-h-0 flex-1 overflow-y-auto overscroll-contain bg-[linear-gradient(180deg,rgba(255,252,247,0.16)_0%,rgba(251,248,242,0.1)_100%)] px-4 py-4 sm:px-5"
    >
      <div className="space-y-4">
        {showWelcomePrompts ? (
          <div className="pb-2 pt-1">
            <div className="mb-5 flex justify-center">
              <span className="rounded-full bg-[rgba(231,237,242,0.95)] px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgba(129,135,146,0.9)]">
                Today
              </span>
            </div>
          </div>
        ) : null}
        {messages.map((message) => (
          <div key={message.id} data-message-id={message.id}>
            <MessageBubble message={message} />
          </div>
        ))}
        {showWelcomePrompts ? (
          <QuickPromptChips onSelect={onPromptSelect} />
        ) : null}
        <div ref={endRef} />
      </div>
    </div>
  );
}
