import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation/contact";
import { sendContactFormEmail } from "@/core/email-templates";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Invalid form data";

      return NextResponse.json({ success: false, message }, { status: 400 });
    }

    const result = await sendContactFormEmail(parsed.data);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: "Failed to send your message. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
