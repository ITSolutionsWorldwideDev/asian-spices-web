// core/auth/core/callbacks.ts

import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";
import { runQuery } from "@/core/db";

export function createCallbacks(maxIdleTime: number) {
  return {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.userId = user.id;
        token.email = user.email;

        token.isPlatformAdmin = user.isPlatformAdmin ?? user.is_platform_admin;
        // token.storeRoles = user.storeRoles;
        token.storeRoles = user.storeRoles?.map((role: any) => ({
          store_id: role.store_id,
          role: role.role,
          slug: role.slug, // Map the slug here
        }));

        token.passwordChangedAt =
          user.passwordChangedAt ?? user.password_changed_at ?? null;
      }

      token.lastActiveAt = (token.lastActiveAt as number) || Date.now();

      // Re-check the DB's current password-changed timestamp on every call
      // (not just at sign-in). If it moved forward since this token was
      // issued, the password was reset/changed elsewhere — this token
      // should never be treated as valid again.
      if (token.userId && !token.passwordInvalid) {
        try {
          const res = await runQuery<{ password_changed_at: string | null }>(
            `SELECT password_changed_at FROM users WHERE id = $1`,
            [token.userId],
          );
          const dbChangedAt = res.rows[0]?.password_changed_at ?? null;
          const tokenChangedAt = (token.passwordChangedAt as string | null) ?? null;

          if (
            dbChangedAt &&
            (!tokenChangedAt || new Date(dbChangedAt) > new Date(tokenChangedAt))
          ) {
            token.passwordInvalid = true;
          }
        } catch (error) {
          console.error("[Auth] password_changed_at check failed:", error);
        }
      }

      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      const now = Date.now();
      const lastActive = (token.lastActiveAt as number) || now;
      const idleExpired = now - lastActive > maxIdleTime;

      if (session.user) {
        session.user.id = token.userId as string;
        session.user.email = token.email as string;
        session.user.isPlatformAdmin = !!token.isPlatformAdmin;
        session.user.storeRoles = (token.storeRoles as any[]) || [];
      }

      session.expired = Boolean(idleExpired || token.passwordInvalid);
      return session;
    },
  };
}

