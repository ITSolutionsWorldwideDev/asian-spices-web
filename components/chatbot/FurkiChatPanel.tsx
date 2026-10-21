"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Headset, Trash2, X } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

type FurkiMessage = {
  id: string;
  role: "user" | "furki";
  content: string;
};

// Session id lives in localStorage (one n8n memory per visitor, like Bibi);
// messages live in sessionStorage so the chat survives page changes in the tab.
const SESSION_STORAGE_KEY = "furki-chat-session-id";
const MESSAGES_STORAGE_KEY = "furki-chat-messages";

const WELCOME_MESSAGE =
  "Hi, I'm Furki from Asian Spices customer support! Ask me about orders, shipping, returns, payments or your account. How can I help today?";

const TOPIC_CARDS: Array<{ emoji: string; label: string; description: string }> = [
  { emoji: "📦", label: "My Order", description: "Questions about an order you placed." },
  { emoji: "🚚", label: "Shipping & Delivery", description: "Delivery times, costs and countries." },
  { emoji: "↩️", label: "Returns & Refunds", description: "How returns and refunds work." },
  { emoji: "💳", label: "Payments", description: "Payment methods and payment issues." },
  { emoji: "👤", label: "My Account", description: "Login, password and account help." },
  { emoji: "🌶️", label: "Products", description: "Questions about our spices and products." },
];

const TOPIC_PROMPTS: Record<string, string> = {
  "My Order": "I have a question about my order.",
  "Shipping & Delivery": "How does shipping and delivery work?",
  "Returns & Refunds": "How can I return a product or get a refund?",
  Payments: "Which payment methods can I use?",
  "My Account": "I need help with my account.",
  Products: "I have a question about a product.",
};

// Furki links to pages where the other bots live (e.g. /recipes for Bibi):
// site links navigate client-side, anything else opens in a new tab.
const MARKDOWN_COMPONENTS: Components = {
  a: ({ href, children }) =>
    href?.startsWith("/") && !href.startsWith("//") ? (
      <Link href={href}>{children}</Link>
    ) : (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
};

function createMessage(role: FurkiMessage["role"], content: string): FurkiMessage {
  return { id: crypto.randomUUID(), role, content };
}

function getOrCreateSessionId() {
  try {
    const stored = window.localStorage.getItem(SESSION_STORAGE_KEY)?.trim();
    if (stored) return stored;
    const sessionId = crypto.randomUUID();
    window.localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
    return sessionId;
  } catch {
    return crypto.randomUUID();
  }
}

function resetSessionId() {
  try {
    window.localStorage.setItem(SESSION_STORAGE_KEY, crypto.randomUUID());
    window.sessionStorage.removeItem(MESSAGES_STORAGE_KEY);
  } catch {
    // Storage blocked (private mode etc.) - nothing to reset.
  }
}

function loadStoredMessages(): FurkiMessage[] {
  try {
    const stored = window.sessionStorage.getItem(MESSAGES_STORAGE_KEY);
    const parsed = stored ? (JSON.parse(stored) as unknown) : null;
    return Array.isArray(parsed)
      ? parsed.filter(
          (entry): entry is FurkiMessage =>
            Boolean(entry) &&
            typeof entry.id === "string" &&
            (entry.role === "user" || entry.role === "furki") &&
            typeof entry.content === "string",
        )
      : [];
  } catch {
    return [];
  }
}

function FurkiAvatar({ size }: { size: number }) {
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#1f1b18] shadow-[0_12px_28px_rgba(31,27,24,0.2)] ring-1 ring-[rgba(226,102,27,0.25)]"
      style={{ width: size, height: size }}
    >
      {hasError ? (
        <Headset className="h-1/2 w-1/2 text-[#f2a65a]" />
      ) : (
        <Image
          src="/assets/chatbot/furki-avatar.webp"
          alt="Furki"
          fill
          className="object-cover"
          sizes={`${size}px`}
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
}

type FurkiChatPanelProps = {
  onClose: () => void;
};

export function FurkiChatPanel({ onClose }: FurkiChatPanelProps) {
  // Client-only component (loaded with ssr: false), so storage is safe to read here.
  const [messages, setMessages] = useState<FurkiMessage[]>(loadStoredMessages);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const showTopics = messages.length === 0;

  useEffect(() => {
    try {
      if (messages.length) {
        window.sessionStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
      }
    } catch {
      // Storage blocked - the chat still works, it just won't survive a reload.
    }
  }, [messages]);

  useEffect(() => {
    // Keep the welcome message and topics in view until the chat has started.
    if (!messages.length) return;
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isSending]);

  async function sendMessage(messageText?: string) {
    const content = (messageText ?? input).trim();
    if (!content || isSending) {
      return;
    }

    setMessages((current) => [...current, createMessage("user", content)]);
    setInput("");
    setIsSending(true);

    try {
      const response = await fetch("/api/furki-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          sessionId: getOrCreateSessionId(),
        }),
      });

      const data = await response.json();
      const reply =
        response.ok && typeof data.reply === "string"
          ? data.reply
          : (data.error ?? "Furki can't connect right now. Please try again in a moment.");

      setMessages((current) => [...current, createMessage("furki", reply)]);
    } catch {
      setMessages((current) => [
        ...current,
        createMessage("furki", "Furki can't connect right now. Please try again in a moment."),
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
    resetSessionId();
    setMessages([]);
    setInput("");
    setIsSending(false);
  }

  return (
    <section className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[2rem] border border-[rgba(226,102,27,0.18)] bg-white shadow-[0_28px_90px_rgba(31,27,24,0.24)]">
      <div className="flex items-center justify-between gap-4 bg-[#1f1b18] px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <FurkiAvatar size={44} />
          <div className="min-w-0">
            <p className="text-base font-semibold leading-tight text-white">Furki</p>
            <p className="flex items-center gap-1.5 truncate text-xs text-[#f2c9a3]">
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#4ade80]" aria-hidden="true" />
              Customer Support
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleClearChat}
            disabled={isSending}
            className="inline-flex items-center gap-2 rounded-full bg-[rgba(255,255,255,0.1)] px-3 py-2 text-sm font-medium text-white transition hover:bg-[rgba(255,255,255,0.18)] disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Clear chat history"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(255,255,255,0.1)] text-white transition hover:bg-[rgba(255,255,255,0.18)]"
            aria-label="Close Furki chat"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <FurkiAvatar size={56} />
            <div className="flex-1 space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#a8876e]">
                Furki for Asian Spices
              </p>
              <div className="rounded-[1.45rem] border border-[rgba(226,102,27,0.16)] bg-[#fff8f2] px-[1.05rem] py-[0.95rem] text-[15px] leading-7 text-[#3a2e26]">
                {WELCOME_MESSAGE}
              </div>
            </div>
          </div>

          {showTopics ? (
            <div>
              <p className="mb-3 px-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#a8876e]">
                Try one of these
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {TOPIC_CARDS.map((topic) => (
                  <button
                    key={topic.label}
                    type="button"
                    onClick={() => handleSelectTopic(topic.label)}
                    className="rounded-[1.1rem] border border-[rgba(226,102,27,0.16)] bg-white p-4 text-left shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition hover:-translate-y-0.5 hover:border-[rgba(226,102,27,0.4)] hover:bg-[#fff8f2]"
                  >
                    <span className="font-semibold text-[#3a2e26]">
                      {topic.emoji} {topic.label}
                    </span>
                    <span className="mt-1 block text-[13px] text-[#8a7464]">
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
              {message.role === "furki" ? <FurkiAvatar size={45} /> : null}
              <div
                className={
                  message.role === "user"
                    ? "max-w-[82%] whitespace-pre-wrap break-words rounded-[1.45rem] rounded-br-sm bg-[#fdebdc] px-4 py-2.5 text-sm leading-7 text-[#3a2e26]"
                    : "max-w-[calc(100%-4rem)] break-words rounded-[1.45rem] bg-[#f4f4f4] px-4 py-3 text-[15px] leading-7 text-[#3a2e26]"
                }
              >
                {message.role === "user" ? (
                  message.content
                ) : (
                  <div className="prose-furki [&_a]:font-medium [&_a]:text-[#c9560f] [&_a]:underline [&_ol]:list-decimal [&_ol]:pl-5 [&_p+p]:mt-2 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-5">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={MARKDOWN_COMPONENTS}>
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
              >
                <FurkiAvatar size={45} />
              </motion.div>
              <div className="flex items-center gap-2 rounded-[1.45rem] bg-[#f4f4f4] px-4 py-3">
                {[0, 1, 2].map((index) => (
                  <motion.span
                    key={index}
                    className="block h-2 w-2 rounded-full bg-[#e2661b]"
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

      <div className="flex items-center gap-3 border-t border-[rgba(226,102,27,0.14)] bg-white px-4 py-3">
        <input
          ref={inputRef}
          type="text"
          value={input}
          maxLength={2000}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              void sendMessage();
            }
          }}
          placeholder="Select a topic or type your question..."
          className="min-w-0 flex-1 rounded-full border border-[rgba(226,102,27,0.25)] px-4 py-3 text-[15px] outline-none focus:border-[#e2661b]"
        />
        <button
          type="button"
          onClick={() => void sendMessage()}
          disabled={isSending || !input.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e2661b] text-lg text-white transition hover:bg-[#c9560f] disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Send message"
        >
          ➤
        </button>
      </div>
    </section>
  );
}
