"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Leaf, Trash2, X } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type GuruMessage = {
  id: string;
  role: "user" | "guru";
  content: string;
};

const WELCOME_MESSAGE =
  "Hi there! I'm here to help with natural remedies and healthy spices. How can I help today?";

const TOPIC_CARDS: Array<{ emoji: string; label: string; description: string }> = [
  { emoji: "🌶️", label: "Spice Benefits", description: "Discover the health benefits of natural spices." },
  { emoji: "🌿", label: "Herbal Remedies", description: "Learn about traditional herbal remedies." },
  { emoji: "❤️", label: "Health & Wellness", description: "Natural wellness tips for everyday health." },
  { emoji: "🥗", label: "Healthy Recipes", description: "Explore healthy recipe ideas." },
  { emoji: "🍃", label: "Medicinal Herbs", description: "Discover powerful medicinal herbs." },
  { emoji: "🌱", label: "Natural Ingredients", description: "Learn about healthy natural ingredients." },
];

const TOPIC_PROMPTS: Record<string, string> = {
  "Spice Benefits": "I want to learn more about spice health benefits.",
  "Herbal Remedies": "I want to learn about herbal remedies.",
  "Health & Wellness": "I want to improve my health and wellness.",
  "Healthy Recipes": "I'm looking for healthy recipes.",
  "Medicinal Herbs": "I want to learn about medicinal herbs.",
  "Natural Ingredients": "I want to learn about natural ingredients.",
};

function createMessage(role: GuruMessage["role"], content: string): GuruMessage {
  return { id: crypto.randomUUID(), role, content };
}

function GuruAvatar({ size }: { size: number }) {
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full shadow-[0_12px_28px_rgba(59,92,49,0.18)] ring-1 ring-[rgba(122,158,84,0.2)]"
      style={{ width: size, height: size }}
    >
      {hasError ? (
        <div className="flex h-full w-full items-center justify-center bg-[#eef3e6]">
          <Leaf className="h-1/2 w-1/2 text-[#5c7a3f]" />
        </div>
      ) : (
        <Image
          src="/assets/chatbot/guru-avatar.jpeg"
          alt="Guru logo"
          fill
          className="object-cover"
          sizes={`${size}px`}
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
}

type GuruChatPanelProps = {
  onClose: () => void;
};

export function GuruChatPanel({ onClose }: GuruChatPanelProps) {
  const [messages, setMessages] = useState<GuruMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const showTopics = messages.length === 0;

  async function sendMessage(messageText?: string) {
    const content = (messageText ?? input).trim();
    if (!content || isSending) {
      return;
    }

    setMessages((current) => [...current, createMessage("user", content)]);
    setInput("");
    setIsSending(true);

    try {
      const response = await fetch("/api/guru-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content }),
      });

      const data = await response.json();
      const reply =
        response.ok && typeof data.reply === "string"
          ? data.reply
          : (data.error ?? "Unable to connect with Guru.");

      setMessages((current) => [...current, createMessage("guru", reply)]);
    } catch {
      setMessages((current) => [
        ...current,
        createMessage("guru", "Unable to connect with Guru."),
      ]);
    } finally {
      setIsSending(false);
    }
  }

  function handleSelectTopic(label: string) {
    const prompt = TOPIC_PROMPTS[label] ?? label;
    setInput(prompt);
    inputRef.current?.focus();
  }

  function handleClearChat() {
    setMessages([]);
    setInput("");
    setIsSending(false);
  }

  return (
    <section className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[2rem] border border-[rgba(122,158,84,0.18)] bg-white shadow-[0_28px_90px_rgba(51,66,38,0.22)]">
      <div className="flex items-center justify-between gap-4 border-b border-[rgba(122,158,84,0.14)] bg-[rgba(240,246,232,0.5)] px-5 py-4">
        <div className="relative h-12 w-[132px] shrink-0">
          <Image
            src="/assets/chatbot/guru-header-logo.jpeg"
            alt="Guru - Asian Health Expert"
            fill
            className="object-contain object-left"
            sizes="132px"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleClearChat}
            disabled={isSending}
            className="inline-flex items-center gap-2 rounded-full bg-[rgba(240,246,232,0.7)] px-3 py-2 text-sm font-medium text-[#4f6b38] transition hover:bg-[rgba(240,246,232,1)] disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Clear chat history"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(240,246,232,0.7)] text-[#4f6b38] transition hover:bg-[rgba(240,246,232,1)]"
            aria-label="Close Guru chat"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <GuruAvatar size={56} />
            <div className="flex-1 space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8a9c7a]">
                Guru for Asian Spices
              </p>
              <div className="rounded-[1.45rem] border border-[rgba(122,158,84,0.16)] bg-[#f9faf7] px-[1.05rem] py-[0.95rem] text-[15px] leading-7 text-[#3c4a30]">
                {WELCOME_MESSAGE}
              </div>
            </div>
          </div>

          {showTopics ? (
            <div>
              <p className="mb-3 px-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8a9c7a]">
                Try one of these
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {TOPIC_CARDS.map((topic) => (
                  <button
                    key={topic.label}
                    type="button"
                    onClick={() => handleSelectTopic(topic.label)}
                    className="rounded-[1.1rem] border border-[rgba(122,158,84,0.16)] bg-white p-4 text-left shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition hover:-translate-y-0.5 hover:border-[rgba(122,158,84,0.4)] hover:bg-[#f6f9f1]"
                  >
                    <span className="font-semibold text-[#3c4a30]">
                      {topic.emoji} {topic.label}
                    </span>
                    <span className="mt-1 block text-[13px] text-[#7c8a70]">
                      {topic.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "items-start gap-3"}`}
            >
              {message.role === "guru" ? <GuruAvatar size={45} /> : null}
              <div
                className={
                  message.role === "user"
                    ? "max-w-[82%] rounded-[1.45rem] rounded-br-sm bg-[#f3f3f3] px-4 py-2.5 text-sm leading-7 text-[#333]"
                    : "max-w-[calc(100%-4rem)] rounded-[1.45rem] bg-[#f4f4f4] px-4 py-3 text-[15px] leading-7 text-[#3c4a30]"
                }
              >
                {message.role === "user" ? (
                  message.content
                ) : (
                  <div className="prose-guru">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isSending ? (
            <div className="flex items-start gap-3">
              <motion.div
                animate={
                  prefersReducedMotion
                    ? undefined
                    : { y: [0, -4, 0], scale: [1, 1.03, 1] }
                }
                transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                className="relative h-[64px] w-[64px] shrink-0 overflow-hidden rounded-full ring-1 ring-[rgba(122,158,84,0.2)]"
              >
                <video
                  className="h-full w-full object-cover"
                  src="/assets/chatbot/guru-thinking-animation.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="none"
                  aria-hidden="true"
                />
              </motion.div>
              <div className="flex items-center gap-2 rounded-[1.45rem] bg-[#f4f4f4] px-4 py-3">
                {[0, 1, 2].map((index) => (
                  <motion.span
                    key={index}
                    className="block h-2 w-2 rounded-full bg-[#8a9c7a]"
                    animate={{ opacity: [0.4, 1, 0.4], scale: [0.85, 1.05, 0.85] }}
                    transition={{
                      duration: 1.1,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: index * 0.15,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-[rgba(122,158,84,0.14)] bg-white px-4 py-3">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              void sendMessage();
            }
          }}
          placeholder="Select a topic or type your question..."
          className="flex-1 rounded-full border border-[rgba(122,158,84,0.2)] px-4 py-3 text-[15px] outline-none focus:border-[#7a9e54]"
        />
        <button
          type="button"
          onClick={() => void sendMessage()}
          disabled={isSending || !input.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#5c7a3f] text-lg text-white transition hover:bg-[#4f6b38] disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Send message"
        >
          ➤
        </button>
      </div>
    </section>
  );
}
