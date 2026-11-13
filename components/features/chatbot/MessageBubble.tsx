"use client";

import { type ReactNode } from "react";
import Link from "next/link";

import { motion, useReducedMotion } from "framer-motion";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

import { ImageResultGrid } from "@/components/features/chatbot/ImageResultGrid";
import { LogoAvatar } from "@/components/features/chatbot/LogoAvatar";
import { ProductLinkCard } from "@/components/features/chatbot/ProductLinkCard";
import { RecipeLinkCard } from "@/components/features/chatbot/RecipeLinkCard";
import { VideoResultCard } from "@/components/features/chatbot/VideoResultCard";
import type { ChatMessage } from "@/types/chat";

type MessageBubbleProps = {
  message: ChatMessage;
};

const YOUTUBE_URL_PATTERN =
  /https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})[^\s)]*/gi;

const PRODUCT_URL_PATTERN =
  /https?:\/\/(?:www\.)?(?:asianspices\.online|asian-spices-web\.vercel\.app|asian-spices\.nl)\/spices\/[A-Za-z0-9-_%]+/gi;

const RECIPE_URL_PATTERN =
  /https?:\/\/(?:www\.)?(?:asianspices\.online|asian-spices-web\.vercel\.app|asian-spices\.nl)\/recipes\/[A-Za-z0-9-_%]+/gi;

const MARKDOWN_COMPONENTS: Components = {
  a: ({ href, children }) =>
    href?.startsWith("/") && !href.startsWith("//") ? (
      <Link
        href={href}
        className="font-medium text-[#c9560f] underline decoration-[#c9560f]/40 transition hover:decoration-[#c9560f]"
      >
        {children}
      </Link>
    ) : (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-[#c9560f] underline decoration-[#c9560f]/40 transition hover:decoration-[#c9560f]"
      >
        {children}
      </a>
    ),
};

function formatTimestamp(timestamp: string) {
  if (!timestamp) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

function extractProductUrls(content: string) {
  const matches = content.match(PRODUCT_URL_PATTERN) ?? [];
  return Array.from(
    new Set(matches.map((match) => match.replace(/[).,!?\]]+$/g, "").trim())),
  );
}

function extractYouTubeUrls(content: string) {
  const matches = content.match(YOUTUBE_URL_PATTERN) ?? [];
  return Array.from(
    new Set(matches.map((match) => match.replace(/[).,!?\]]+$/g, "").trim())),
  );
}

function extractRecipeUrls(content: string) {
  const matches = content.match(RECIPE_URL_PATTERN) ?? [];
  return Array.from(
    new Set(matches.map((match) => match.replace(/[).,!?\]]+$/g, "").trim())),
  );
}

function sanitizeAssistantText(content: string) {
  return content
    .replace(YOUTUBE_URL_PATTERN, "")
    .replace(PRODUCT_URL_PATTERN, "")
    .replace(RECIPE_URL_PATTERN, "")
    .replace(
      /^\s*(?:[*_]{0,2})?(?:link|full recipe & instructions|video tutorial|video)(?:[*_]{0,2})?\s*:\s*.*$/gim,
      "",
    )
    .replace(
      /(?:\*\*|__)(?:link|full recipe & instructions|video tutorial|video)(?:\*\*|__)\s*:\s*[^\n]*/gim,
      "",
    )
    .replace(
      /\b(?:link|full recipe & instructions|video tutorial|video)\b\s*:\s*[^\n]*/gim,
      "",
    )
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function ContentSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-2 sm:space-y-3">
      <p className="px-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-[rgba(154,114,86,0.82)]">
        {title}
      </p>
      {children}
    </section>
  );
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const prefersReducedMotion = useReducedMotion();
  const isUser = message.role === "user";
  const timestampLabel = formatTimestamp(message.timestamp);
  const assistantText = isUser
    ? message.content
    : sanitizeAssistantText(message.content);
  const youtubeUrls = isUser ? [] : extractYouTubeUrls(message.content);
  const productUrls = isUser ? [] : extractProductUrls(message.content);
  const recipeUrls = isUser ? [] : extractRecipeUrls(message.content);
  const imageResults = isUser ? [] : (message.images ?? []);
  const videoResults = isUser ? [] : (message.videos ?? []);
  const showMetadata =
    Boolean(timestampLabel) ||
    message.status === "sending" ||
    message.status === "error";
  const showSupportLink =
    !isUser &&
    /\b(?:customer support|support team|contact us|my orders|order status|track your order|returns policy)\b/i.test(
      message.content,
    );

  return (
    <motion.div
      initial={
        prefersReducedMotion
          ? { opacity: 1 }
          : isUser
            ? { opacity: 0, y: 14 }
            : { opacity: 0, y: 18, scale: 0.985 }
      }
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.32, ease: "easeOut" }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} ${isUser ? "" : "items-start gap-2 sm:gap-3"}`}
    >
      {!isUser ? (
        <LogoAvatar className="h-8 w-8 sm:h-11 sm:w-11 shrink-0" rounded="rounded-full" ring />
      ) : null}
      <div
        className={`space-y-1.5 sm:space-y-3 ${isUser ? "max-w-[94%] items-end sm:max-w-[82%]" : "max-w-[calc(100%-2.5rem)] items-start sm:max-w-[calc(100%-3.5rem)]"}`}
      >
        {!isUser ? (
          <p className="px-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-[rgba(154,114,86,0.72)]">
            Bibi for Asian Spices
          </p>
        ) : null}
        {isUser || assistantText ? (
          <motion.div
            initial={
              prefersReducedMotion || isUser
                ? undefined
                : {
                    opacity: 0,
                    y: 10,
                    clipPath: "inset(0 0 100% 0 round 24px)",
                  }
            }
            animate={
              prefersReducedMotion || isUser
                ? undefined
                : { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0 round 24px)" }
            }
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className={`rounded-[1.15rem] sm:rounded-[1.55rem] px-3 py-2 sm:px-4 sm:py-3 shadow-[0_10px_24px_rgba(95,61,37,0.06)] ${
              isUser
                ? "rounded-br-sm border border-[rgba(223,123,103,0.16)] bg-[rgba(232,224,214,0.7)] text-[#554741] shadow-none"
                : "rounded-[1.15rem] sm:rounded-[1.45rem] border border-[rgba(233,228,219,0.98)] bg-white px-3 py-2 text-[var(--foreground)] sm:px-[1.15rem] sm:py-[1rem]"
            }`}
          >
            {isUser ? (
              <p className="whitespace-pre-wrap text-xs sm:text-sm leading-5 sm:leading-7">
                {message.content}
              </p>
            ) : (
              <div className="space-y-4">
                <div className="prose-bibi text-[15px] leading-8 text-[#4f443c] sm:text-[15px]">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={MARKDOWN_COMPONENTS}
                  >
                    {assistantText}
                  </ReactMarkdown>
                </div>
                {showSupportLink ? (
                  <div className="pt-1">
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(226,102,27,0.22)] bg-[#fff8f2] px-3.5 py-1.5 text-xs font-semibold text-[#c9560f] shadow-sm transition hover:bg-[#ffeedd]"
                    >
                      <span>💬 Need Help? Contact Customer Support</span>
                    </Link>
                  </div>
                ) : null}
              </div>
            )}
          </motion.div>
        ) : null}

        {!isUser && recipeUrls.length ? (
          <ContentSection title="Recipes">
            <div className="grid gap-2.5 sm:gap-4 lg:grid-cols-2">
              {recipeUrls.map((recipeUrl) => (
                <RecipeLinkCard
                  key={recipeUrl}
                  recipeUrl={recipeUrl}
                  youtubeUrlOverride={youtubeUrls[0] ?? null}
                />
              ))}
            </div>
          </ContentSection>
        ) : null}

        {!isUser && videoResults.length ? (
          <ContentSection title="Videos">
            <VideoResultCard videos={videoResults} />
          </ContentSection>
        ) : null}

        {!isUser && productUrls.length ? (
          <ContentSection title="Products">
            <div className="grid gap-2.5 sm:gap-4 lg:grid-cols-2">
              {productUrls.map((productUrl) => (
                <ProductLinkCard key={productUrl} productUrl={productUrl} />
              ))}
            </div>
          </ContentSection>
        ) : null}

        {!isUser && imageResults.length ? (
          <ContentSection title="Images">
            <ImageResultGrid images={imageResults} />
          </ContentSection>
        ) : null}

        {showMetadata ? (
          <div
            className={`flex items-center gap-2 px-1 text-[10px] text-[rgba(146,128,114,0.92)] ${isUser ? "justify-end" : "justify-start"}`}
          >
            {timestampLabel ? <span>{timestampLabel}</span> : null}
            {message.status === "sending" ? <span>Sending…</span> : null}
            {message.status === "error" ? (
              <span className="text-red-500">
                {message.errorMessage ?? "Not delivered"}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
