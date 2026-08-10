// app/api/guru-chat/route.ts

import { NextResponse } from "next/server";

export const runtime = "nodejs";

const GURU_WEBHOOK_URL = process.env.GURU_WEBHOOK_URL?.trim() || null;
const GURU_TIMEOUT_MS = Number.parseInt(
  process.env.GURU_TIMEOUT_MS?.trim() ?? "25000",
  10,
);

export async function POST(request: Request) {
  let body: { message?: unknown };

  try {
    body = (await request.json()) as { message?: unknown };
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

  if (!GURU_WEBHOOK_URL) {
    return NextResponse.json(
      {
        error:
          "GURU_WEBHOOK_URL is not configured on the server, so the live Guru chat flow is unavailable.",
      },
      { status: 503 },
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort("GURU_TIMEOUT"),
    Number.isFinite(GURU_TIMEOUT_MS) ? GURU_TIMEOUT_MS : 25000,
  );

  try {
    const response = await fetch(GURU_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatInput: message }),
      signal: controller.signal,
      cache: "no-store",
    });

    const text = await response.text();
    const payload = text ? safeJsonParse(text) : null;

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            extractErrorMessage(payload) ??
            `The Guru webhook responded with status ${response.status}.`,
        },
        { status: response.status },
      );
    }

    return NextResponse.json({ reply: extractReply(payload) });
  } catch (error) {
    const message =
      error instanceof Error && error.name === "AbortError"
        ? `Guru took too long to respond. The webhook exceeded the ${GURU_TIMEOUT_MS}ms timeout.`
        : "Guru couldn't reach the chat service.";

    return NextResponse.json({ error: message }, { status: 504 });
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
  if (typeof payload === "string") {
    return payload.trim() || "Sorry, I couldn't understand.";
  }

  const record =
    payload && typeof payload === "object"
      ? (payload as Record<string, unknown>)
      : {};
  const candidate = record.output ?? record.text ?? record.message;

  return typeof candidate === "string" && candidate.trim()
    ? candidate
    : "Sorry, I couldn't understand.";
}

function extractErrorMessage(payload: unknown): string | null {
  if (typeof payload === "string") {
    return payload.trim() || null;
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
