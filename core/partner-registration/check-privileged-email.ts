import { runQuery } from "@/core/db";
import { AUTH_ROLES } from "@/core/auth/core/constants";

/** Roles that cannot reuse their email for partner registration. */
export const PRIVILEGED_EMAIL_ROLES = [
  AUTH_ROLES.SUPER_ADMIN,
  AUTH_ROLES.ADMIN,
  AUTH_ROLES.MANAGER,
  AUTH_ROLES.EDITOR,
  "store_owner",
  "owner",
] as const;

export const PRIVILEGED_EMAIL_ERROR =
  "this email already exist for this role";

/**
 * Returns true when the email belongs to a platform admin or a user with a
 * privileged store role (admin / manager / editor / store owner).
 */
export async function isPrivilegedEmail(email: string): Promise<boolean> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return false;

  const result = await runQuery<{ blocked: boolean }>(
    `
    SELECT EXISTS (
      SELECT 1
      FROM users u
      WHERE LOWER(u.email) = $1
        AND (
          u.is_platform_admin = true
          OR EXISTS (
            SELECT 1
            FROM store_users su
            JOIN roles r ON r.id = su.role_id
            WHERE su.user_id = u.id
              AND r.key = ANY($2::text[])
          )
        )
    ) AS blocked
    `,
    [normalized, [...PRIVILEGED_EMAIL_ROLES]],
  );

  return !!result.rows[0]?.blocked;
}
