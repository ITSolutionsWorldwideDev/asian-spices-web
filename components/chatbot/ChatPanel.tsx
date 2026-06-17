"use client";

import { useEffect, useRef, useState } from "react";

import { ChatHeader } from "@/components/chatbot/ChatHeader";
import { ChatInput } from "@/components/chatbot/ChatInput";
import { EmptyState } from "@/components/chatbot/EmptyState";
import { ErrorBanner } from "@/components/chatbot/ErrorBanner";
import { MessageList } from "@/components/chatbot/MessageList";
import { TypingIndicator } from "@/components/chatbot/TypingIndicator";
import {
  BibiClientError,
  getStoredChatSessionId,
  resetStoredChatSessionId,
  sendChatMessage,
} from "@/lib/bibiClient";
import type {
  BackendConnectionStatus,
  ChatMessage,
  ChatRequest,
} from "@/types/chat";

const CHAT_HISTORY_STORAGE_KEY = "bibi-chat-history";
const initialAssistantMessage: ChatMessage = {
  id: "assistant-welcome",
  role: "assistant",
  content:
    "Hi there! I'm here to help you find the perfect spice blend or a traditional recipe. What are we cooking today?",
  timestamp: "",
  status: "sent",
};

function createMessage(
  role: ChatMessage["role"],
  content: string,
  overrides: Partial<ChatMessage> = {},
): ChatMessage {
  const normalizedContent =
    role === "assistant" ? normalizeAssistantCopy(content) : content;

  return {
    id: crypto.randomUUID(),
    role,
    content: normalizedContent,
    timestamp: new Date().toISOString(),
    status: "sent",
    ...overrides,
  };
}

type ChatPanelProps = {
  onClose: () => void;
};

export function ChatPanel({ onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    loadStoredMessages(),
  );
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(() =>
    getStoredChatSessionId(),
  );
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] =
    useState<BackendConnectionStatus>("connected");
  const [endpointLabel, setEndpointLabel] =
    useState<string>(buildEndpointLabel());
  const [lastSubmitted, setLastSubmitted] = useState<string | null>(null);
  const [requestPhase, setRequestPhase] = useState<
    "idle" | "sending" | "thinking"
  >("idle");
  const phaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isPending = requestPhase !== "idle";

  useEffect(() => {
    return () => {
      if (phaseTimerRef.current) {
        clearTimeout(phaseTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    persistMessages(messages);
  }, [messages]);

  async function submitMessage(messageText?: string, isRetry = false) {
    const content = (messageText ?? input).trim();
    if (!content || isPending) {
      return;
    }

    setError(null);
    setLastSubmitted(content);

    if (!isRetry) {
      const outgoing = createMessage("user", content, { status: "sending" });
      setMessages((current) => [...current, outgoing]);
      setInput("");
    } else {
      setMessages((current) =>
        current.map((message, index) =>
          index === current.length - 1 && message.role === "user"
            ? { ...message, status: "sending", errorMessage: null }
            : message,
        ),
      );
    }

    const request: ChatRequest = {
      message: content,
      conversationId,
      metadata: {
        source: "bibi-frontend",
        company: "Asian Spices",
        agent: "Bibi",
      },
    };

    setRequestPhase("sending");
    if (phaseTimerRef.current) {
      clearTimeout(phaseTimerRef.current);
    }
    phaseTimerRef.current = setTimeout(() => {
      setMessages((current) =>
        current.map((message) =>
          message.role === "user" &&
          message.content === content &&
          message.status === "sending"
            ? { ...message, status: "sent" }
            : message,
        ),
      );
      setRequestPhase((current) =>
        current === "sending" ? "thinking" : current,
      );
    }, 180);

    try {
      const result = await sendChatMessage(request);

      setConversationId(result.conversationId);
      setConnectionStatus(result.connectionStatus);
      setEndpointLabel(result.endpointUrl ?? buildEndpointLabel());
      setMessages((current) => [
        ...current,
        createMessage("assistant", result.reply, {
          csvUrl: result.csvUrl ?? null,
          previewTable: result.previewTable ?? null,
          images: result.images ?? null,
          videos: result.videos ?? null,
        }),
      ]);
    } catch (submissionError) {
      const message =
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to reach the Bibi backend.";

      if (submissionError instanceof BibiClientError) {
        setConnectionStatus(submissionError.connectionStatus);
        setEndpointLabel(submissionError.endpointUrl ?? buildEndpointLabel());
      } else {
        setConnectionStatus("unreachable");
      }

      setError(message);
      setMessages((current) =>
        current.map((message) =>
          message.role === "user" && message.content === content
            ? { ...message, status: "error", errorMessage: "Delivery failed" }
            : message,
        ),
      );
    } finally {
      if (phaseTimerRef.current) {
        clearTimeout(phaseTimerRef.current);
        phaseTimerRef.current = null;
      }
      setRequestPhase("idle");
    }
  }

  function handleRetry() {
    if (lastSubmitted) {
      void submitMessage(lastSubmitted, true);
    }
  }

  function handlePromptSelect(prompt: string) {
    setInput(prompt);
  }

  function handleClearChat() {
    if (phaseTimerRef.current) {
      clearTimeout(phaseTimerRef.current);
      phaseTimerRef.current = null;
    }

    window.localStorage.removeItem(CHAT_HISTORY_STORAGE_KEY);
    setMessages([initialAssistantMessage]);
    setInput("");
    setError(null);
    setLastSubmitted(null);
    setRequestPhase("idle");
    setConnectionStatus("connected");
    setEndpointLabel(buildEndpointLabel());
    setConversationId(resetStoredChatSessionId());
  }
  /* bg-[rgba(255,250,244,0.62)]  */

  return (
    <section className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[2rem] border border-[rgba(255,255,255,0.36)] bg-white shadow-[0_28px_90px_rgba(64,40,27,0.26)]">
      <ChatHeader
        connectionStatus={connectionStatus}
        isLoading={isPending}
        endpointLabel={endpointLabel}
        onClose={onClose}
        onClear={handleClearChat}
        onRetry={error ? handleRetry : null}
      />

      {error ? (
        <ErrorBanner
          message={error}
          onRetry={handleRetry}
          disabled={isPending}
        />
      ) : null}

      {messages.length ? (
        <MessageList messages={messages} onPromptSelect={handlePromptSelect} />
      ) : (
        <EmptyState />
      )}

      {isPending ? (
        <TypingIndicator
          phase={requestPhase === "sending" ? "sending" : "thinking"}
        />
      ) : null}

      <ChatInput
        value={input}
        isLoading={isPending}
        onChange={setInput}
        onSubmit={() => {
          void submitMessage();
        }}
      />
    </section>
  );
}

function buildEndpointLabel() {
  return "n8n chat";
}

function normalizeAssistantCopy(content: string) {
  return content
    .replace(
      /not currently listed in our database/gi,
      "not currently shown on the website",
    )
    .replace(
      /currently listed in our database/gi,
      "currently shown on the website",
    )
    .replace(/from our database/gi, "from the website")
    .replace(/in our database/gi, "on the website")
    .replace(/\bdatabase\b/gi, "website");
}

function loadStoredMessages(): ChatMessage[] {
  if (typeof window === "undefined") {
    return [initialAssistantMessage];
  }

  try {
    const raw = window.localStorage.getItem(CHAT_HISTORY_STORAGE_KEY);
    if (!raw) {
      return [initialAssistantMessage];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.length) {
      return [initialAssistantMessage];
    }

    const messages = parsed
      .map((entry) => sanitizeStoredMessage(entry))
      .filter((entry): entry is ChatMessage => Boolean(entry));

    return messages.length ? messages : [initialAssistantMessage];
  } catch {
    return [initialAssistantMessage];
  }
}

function persistMessages(messages: ChatMessage[]) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      CHAT_HISTORY_STORAGE_KEY,
      JSON.stringify(messages),
    );
  } catch {
    // Ignore storage failures and keep the in-memory chat available.
  }
}

function sanitizeStoredMessage(value: unknown): ChatMessage | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const record = value as Record<string, unknown>;
  const role =
    record.role === "user" ||
    record.role === "assistant" ||
    record.role === "system"
      ? record.role
      : null;
  const id =
    typeof record.id === "string" && record.id.trim() ? record.id : null;
  const content = typeof record.content === "string" ? record.content : null;
  const timestamp =
    typeof record.timestamp === "string" ? record.timestamp : "";

  if (!role || !id || content === null) {
    return null;
  }

  return {
    id,
    role,
    content: role === "assistant" ? normalizeAssistantCopy(content) : content,
    timestamp,
    csvUrl: typeof record.csvUrl === "string" ? record.csvUrl : null,
    previewTable: Array.isArray(record.previewTable)
      ? (record.previewTable as ChatMessage["previewTable"])
      : null,
    images: Array.isArray(record.images)
      ? (record.images as ChatMessage["images"])
      : null,
    videos: Array.isArray(record.videos)
      ? (record.videos as ChatMessage["videos"])
      : null,
    status:
      record.status === "sending" ||
      record.status === "sent" ||
      record.status === "error"
        ? record.status
        : "sent",
    errorMessage:
      typeof record.errorMessage === "string" ? record.errorMessage : null,
  };
}
