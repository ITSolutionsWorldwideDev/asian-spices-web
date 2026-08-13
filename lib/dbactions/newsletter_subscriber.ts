import { pool } from "@/core/db";

export const subscribeUser = async (
  email: string,
  wantsAppLaunchNotice: boolean = false,
) => {
  try {
    const query = `
      INSERT INTO newsletter_subscribers (email, status, wants_app_launch_notice)
      VALUES ($1, 'subscribed', $2)
      ON CONFLICT (email) DO UPDATE
        SET wants_app_launch_notice =
          newsletter_subscribers.wants_app_launch_notice OR EXCLUDED.wants_app_launch_notice
      RETURNING *;
    `;

    const values = [email, wantsAppLaunchNotice];

    const result = await pool.query(query, values);

    return { success: true, data: result.rows[0] };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};
