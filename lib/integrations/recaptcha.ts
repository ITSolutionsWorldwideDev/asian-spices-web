export async function verifyRecaptcha(token?: string | null): Promise<{
  success: boolean;
  message?: string;
}> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  // In development without keys configured, allow pass so local testing isn't blocked
  if (!secretKey) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[reCAPTCHA] RECAPTCHA_SECRET_KEY is not defined. Skipping verification in non-production.",
      );
      return { success: true };
    }
    return {
      success: false,
      message: "Server reCAPTCHA configuration is missing.",
    };
  }

  if (!token) {
    return {
      success: false,
      message: "Please complete the CAPTCHA verification.",
    };
  }

  try {
    const params = new URLSearchParams();
    params.append("secret", secretKey);
    params.append("response", token);

    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = (await response.json()) as {
      success: boolean;
      "error-codes"?: string[];
    };

    if (!data.success) {
      return {
        success: false,
        message: "CAPTCHA verification failed. Please try again.",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("[reCAPTCHA] Verification error:", error);
    return {
      success: false,
      message: "Unable to verify CAPTCHA. Please try again later.",
    };
  }
}

import crypto from "crypto";

export function generateSignupAuthToken(email: string): string {
  const secret = process.env.NEXTAUTH_SECRET || "asian-spices-secret";
  const timestamp = Date.now().toString();
  const hmac = crypto
    .createHmac("sha256", secret)
    .update(`${email.toLowerCase()}:${timestamp}`)
    .digest("hex");
  return `${timestamp}:${hmac}`;
}

export function verifySignupAuthToken(email?: string, token?: string | null): boolean {
  if (!email || !token) return false;
  const parts = token.split(":");
  if (parts.length !== 2) return false;
  const [timestamp, hmac] = parts;
  const ts = Number(timestamp);
  if (isNaN(ts)) return false;

  // Valid for 2 minutes (120,000ms)
  if (Math.abs(Date.now() - ts) > 120000) {
    return false;
  }

  const secret = process.env.NEXTAUTH_SECRET || "asian-spices-secret";
  const expectedHmac = crypto
    .createHmac("sha256", secret)
    .update(`${email.toLowerCase()}:${timestamp}`)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expectedHmac));
  } catch {
    return false;
  }
}

