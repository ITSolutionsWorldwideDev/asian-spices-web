import { pool } from "@/core/db";

export const testimonials = async (
  name: string,
  email: string,
  comment: string,
  rating: number,
  product_id: number,
) => {
  console.log("Inserting testimonial with values:", {
    name,
    email,
    comment,
    rating,
    product_id,
  });
  try {
    const query = `
      INSERT INTO product_reviews (name, email, comment, rating, product_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const values = [name, email, comment, rating, product_id];

    const result = await pool.query(query, values);

    return { success: true, data: result.rows[0] };
  } catch (error: any) {
    // Handle duplicate email error
    if (error.code === "23505") {
      return { success: false, message: "Email already subscribed" };
    }

    return { success: false, message: error.message };
  }
};
