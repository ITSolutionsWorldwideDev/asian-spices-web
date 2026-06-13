import { pool } from "@/core/db";

export const getCategoryWithSubcategories = async (slug: string) => {
  try {
    // 🔹 Step 1: Get category by slug
    const categoryResult = await pool.query(
      `SELECT id, slug 
       FROM store_categories 
       WHERE LOWER(slug) = LOWER($1)`,
      [slug],
    );

    if (categoryResult.rows.length === 0) {
      return { error: "Category not found" };
    }

    const category = categoryResult.rows[0];

    // 🔹 Step 2: Get subcategories
    const subCategoryResult = await pool.query(
      `SELECT id,name 
       FROM store_subcategories 
       WHERE category_id = $1`,
      [category.id],
    );

    return {
      category,
      subcategories: subCategoryResult.rows,
    };
  } catch (error) {
    console.error("DB Action Error:", error);
    return { error: "Database error" };
  }
};
