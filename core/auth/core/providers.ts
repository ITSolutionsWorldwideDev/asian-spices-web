// core/auth/core/providers.ts
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { authorizeUser } from "./authorize";
import { AUTH_ROLES } from "./constants";
import { verifyRecaptcha, verifySignupAuthToken } from "@/lib/integrations/recaptcha";

type AppType = "admin" | "web";

interface StoreRole {
  role: string;
  store_id: string;
  slug: string;
}

export function credentialsProvider(app: AppType) {
  return CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
      captchaToken: { label: "Captcha", type: "text" },
      signupBypass: { label: "Signup Bypass", type: "text" },
    },

    async authorize(credentials) {
      if (!credentials?.email || !credentials.password) {
        return null;
      }

      // Verify reCAPTCHA on web customer sign in if key is configured
      if (app === "web" && process.env.RECAPTCHA_SECRET_KEY) {
        const signupBypass = (credentials as { signupBypass?: string })?.signupBypass;
        const isBypassed = verifySignupAuthToken(credentials.email, signupBypass);

        if (!isBypassed) {
          const captchaResult = await verifyRecaptcha(
            (credentials as { captchaToken?: string })?.captchaToken,
          );
          if (!captchaResult.success) {
            throw new Error(captchaResult.message || "CAPTCHA verification failed");
          }
        }
      }

      const user = await authorizeUser(credentials.email, credentials.password);

      // 🔒 ADMIN APP ACCESS RULES

      if (app === "admin") {
        const isAdmin =
          user.isPlatformAdmin === true ||
          (user.storeRoles as StoreRole[])?.some((r) =>
            (
              [
                AUTH_ROLES.ADMIN,
                AUTH_ROLES.MANAGER,
                AUTH_ROLES.EDITOR,
              ] as string[]
            ).includes(r.role),
          );

        if (!isAdmin) {
          throw new Error("Not authorized for admin access");
        }
      }

      // 🛍️ WEB APP ACCESS RULES
      if (app === "web") {
        return user;
      }

      return user as any;
    },
  });
}

export function googleProvider() {
  return GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    allowDangerousEmailAccountLinking: true,
  });
}
