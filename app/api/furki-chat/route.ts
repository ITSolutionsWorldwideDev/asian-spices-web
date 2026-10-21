// app/api/furki-chat/route.ts

import { NextResponse } from "next/server";

export const runtime = "nodejs";

const FURKI_WEBHOOK_URL = process.env.FURKI_WEBHOOK_URL?.trim() || null;
const FURKI_TIMEOUT_MS = Number.parseInt(
  process.env.FURKI_TIMEOUT_MS?.trim() ?? "25000",
  10,
);

const MAX_MESSAGE_LENGTH = 2000;
const SESSION_ID_PATTERN = /^[A-Za-z0-9-]{8,64}$/;

// Customers see these, so no internal details (webhook URL, n8n errors).
const UNAVAILABLE_MESSAGE =
  "Furki can't connect right now. Please try again in a moment, or reach us through our contact page.";
const TIMEOUT_MESSAGE =
  "Furki is taking longer than usual to answer. Please try again in a moment.";
const FALLBACK_REPLY = "Sorry, I couldn't understand. Could you rephrase that?";

export async function POST(request: Request) {
  let body: { message?: unknown; sessionId?: unknown };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const message = typeof body?.message === "string" ? body.message.trim() : "";
  if (!message) {
    return NextResponse.json(
      { error: "A non-empty `message` field is required." },
      { status: 400 },
    );
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: `Please keep your message under ${MAX_MESSAGE_LENGTH} characters.` },
      { status: 400 },
    );
  }

  // One n8n memory per visitor; never share a fixed id between visitors.
  const sessionId =
    typeof body?.sessionId === "string" && SESSION_ID_PATTERN.test(body.sessionId)
      ? body.sessionId
      : crypto.randomUUID();

  if (!FURKI_WEBHOOK_URL) {
    console.error("[furki-chat] FURKI_WEBHOOK_URL is not set.");
    return NextResponse.json({ error: UNAVAILABLE_MESSAGE }, { status: 503 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort("FURKI_TIMEOUT"),
    Number.isFinite(FURKI_TIMEOUT_MS) ? FURKI_TIMEOUT_MS : 25000,
  );

  try {
    const response = await fetch(FURKI_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // The n8n flow reads body.chatInput and keys its memory on body.sessionId.
      body: JSON.stringify({ chatInput: message, sessionId }),
      signal: controller.signal,
      cache: "no-store",
    });

    const text = await response.text();
    const payload = text ? safeJsonParse(text) : null;

    if (!response.ok) {
      console.error(
        `[furki-chat] Webhook responded with status ${response.status}.`,
        extractErrorMessage(payload),
      );
      return NextResponse.json({ error: UNAVAILABLE_MESSAGE }, { status: 502 });
    }

    const reply = extractReply(payload);
    if (reply === FALLBACK_REPLY) {
      // Log only the shape: an echo of the request (headers/body keys) means the
      // n8n AI Agent was skipped or failed.
      const first = Array.isArray(payload) ? payload[0] : payload;
      console.error(
        "[furki-chat] No reply found in webhook response. Top-level keys:",
        first && typeof first === "object" ? Object.keys(first) : typeof first,
      );
    }

    return NextResponse.json({ reply, sessionId });
  } catch (error) {
    const timedOut = controller.signal.aborted;
    console.error(
      timedOut
        ? `[furki-chat] Webhook exceeded the ${FURKI_TIMEOUT_MS}ms timeout.`
        : "[furki-chat] Webhook request failed.",
      timedOut ? "" : error,
    );

    return NextResponse.json(
      { error: timedOut ? TIMEOUT_MESSAGE : UNAVAILABLE_MESSAGE },
      { status: 504 },
    );
  } finally {
    clearTimeout(timeout);
  }
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function extractReply(payload: unknown): string {
  if (Array.isArray(payload)) {
    return extractReply(payload[0]);
  }

  if (typeof payload === "string") {
    return payload.trim() || FALLBACK_REPLY;
  }

  const record =
    payload && typeof payload === "object"
      ? (payload as Record<string, unknown>)
      : {};
  const candidate =
    record.output ?? record.text ?? record.reply ?? record.answer ?? record.message;

  return typeof candidate === "string" && candidate.trim()
    ? candidate
    : FALLBACK_REPLY;
}

function extractErrorMessage(payload: unknown): string | null {
  if (typeof payload === "string") {
    return payload.trim().slice(0, 300) || null;
  }

  if (!payload || typeof payload !== "object") {
    return null;
  }

  const record = payload as Record<string, unknown>;
  return typeof record.error === "string"
    ? record.error
    : typeof record.message === "string"
      ? record.message
      : null;
}
