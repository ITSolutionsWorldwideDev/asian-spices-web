// core/auth/core/google-user.ts
import * as bcrypt from "bcryptjs";
import crypto from "crypto";
import { runQuery } from "@/core/db";
import type { AuthUser } from "./authorize";

async function loadStoreRoles(userId: string) {
  const rolesRes = await runQuery<{
    store_id: string;
    role: string;
    slug: string;
  }>(
    `SELECT su.store_id, r.key AS role, s.slug
     FROM store_users su
     JOIN stores s ON s.id = su.store_id
     JOIN roles r ON r.id = su.role_id
     WHERE su.user_id = $1`,
    [userId],
  );

  return rolesRes.rows;
}

/**
 * Finds an existing customer by email, or creates one for Google sign-in/sign-up.
 * Links Google to the same account if that email already registered with password.
 */
export async function findOrCreateGoogleUser(params: {
  email: string;
  name?: string | null;
}): Promise<AuthUser | null> {
  const email = params.email.trim().toLowerCase();
  if (!email) return null;

  const existing = await runQuery<{
    id: string;
    email: string;
    is_platform_admin: boolean;
    status: string | null;
  }>(
    `SELECT id, email, is_platform_admin, status
     FROM users
     WHERE LOWER(email) = LOWER($1)
     LIMIT 1`,
    [email],
  );

  const row = existing.rows[0];

  if (row) {
    if (row.status && row.status !== "active") {
      return null;
    }

    if (params.name) {
      await runQuery(
        `UPDATE users SET name = COALESCE(name, $1) WHERE id = $2`,
        [params.name, row.id],
      ).catch(() => {
        // name column may be missing on older schemas — non-fatal
      });
    }

    return {
      id: row.id,
      email: row.email,
      isPlatformAdmin: !!row.is_platform_admin,
      storeRoles: await loadStoreRoles(row.id),
    };
  }

  // Unusable random hash — Google-only accounts sign in via Google, not password
  const passwordHash = await bcrypt.hash(crypto.randomBytes(32).toString("hex"), 10);

  const created = await runQuery<{
    id: string;
    email: string;
    is_platform_admin: boolean;
  }>(
    `INSERT INTO users (email, password_hash, name)
     VALUES ($1, $2, $3)
     RETURNING id, email, is_platform_admin`,
    [email, passwordHash, params.name || null],
  );

  const user = created.rows[0];
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    isPlatformAdmin: !!user.is_platform_admin,
    storeRoles: [],
  };
}
