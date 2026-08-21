// core/auth/web/auth-options.ts
import type { NextAuthOptions } from "next-auth";
import { credentialsProvider, googleProvider } from "../core/providers";
import { createCallbacks } from "../core/callbacks";
import { SESSION_IDLE_TIME } from "../core/constants";
import { findOrCreateGoogleUser } from "../core/google-user";

const googleEnabled = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
);

export const webAuthOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    credentialsProvider("web"),
    ...(googleEnabled ? [googleProvider()] : []),
  ],

  callbacks: {
    ...createCallbacks(SESSION_IDLE_TIME.WEB),

    async signIn({ user, account }) {
      if (account?.provider !== "google") {
        return true;
      }

      if (!user.email) {
        return false;
      }

      const dbUser = await findOrCreateGoogleUser({
        email: user.email,
        name: user.name,
      });

      if (!dbUser) {
        return false;
      }

      // Map NextAuth user to our DB user so JWT/session use the real UUID
      user.id = dbUser.id;
      user.email = dbUser.email;
      user.isPlatformAdmin = dbUser.isPlatformAdmin;
      user.storeRoles = dbUser.storeRoles;

      return true;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // seconds
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },
};
