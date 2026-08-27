import { pool } from "@/core/db";

/** Active categories + subcategories for the shop mega menu */
export const getShopCategories = async () => {
  const { rows } = await pool.query<{
    id: string;
    name: string;
    slug: string;
    subcategory_id: string | null;
    subcategory_name: string | null;
    subcategory_slug: string | null;
  }>(
    `SELECT c.id, c.name, c.slug,
            sc.id AS subcategory_id, sc.name AS subcategory_name, sc.slug AS subcategory_slug
     FROM store_categories c
     LEFT JOIN store_subcategories sc ON sc.category_id = c.id
     WHERE c.status = 1 AND LOWER(c.slug) <> 'healthy-living'
     ORDER BY c.name ASC, sc.name ASC`,
  );

  const map = new Map<
    string,
    {
      id: string;
      name: string;
      slug: string;
      subcategories: { id: string; name: string; slug: string }[];
    }
  >();

  for (const row of rows) {
    let cat = map.get(row.id);
    if (!cat) {
      cat = { id: row.id, name: row.name, slug: row.slug, subcategories: [] };
      map.set(row.id, cat);
    }
    if (row.subcategory_id && row.subcategory_name && row.subcategory_slug) {
      cat.subcategories.push({
        id: row.subcategory_id,
        name: row.subcategory_name,
        slug: row.subcategory_slug,
      });
    }
  }

  return Array.from(map.values());
};

export const getStoreCategoryBySlug = async (slug: string) => {
  const { rows } = await pool.query<{ id: string; name: string; slug: string }>(
    `SELECT id, name, slug FROM store_categories
     WHERE LOWER(slug) = LOWER($1) AND status = 1`,
    [slug],
  );
  return rows[0] ?? null;
};

export const getStoreSubcategoryBySlug = async (
  categorySlug: string,
  subcategorySlug: string,
) => {
  const { rows } = await pool.query<{
    id: string;
    name: string;
    slug: string;
    category_id: string;
    category_name: string;
    category_slug: string;
  }>(
    `SELECT sc.id, sc.name, sc.slug, sc.category_id,
            c.name AS category_name, c.slug AS category_slug
     FROM store_subcategories sc
     JOIN store_categories c ON c.id = sc.category_id
     WHERE LOWER(c.slug) = LOWER($1)
       AND LOWER(sc.slug) = LOWER($2)
       AND c.status = 1`,
    [categorySlug, subcategorySlug],
  );
  return rows[0] ?? null;
};

export const getCategoryWithSubcategories = async (slug: string) => {
  try {
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

    const subCategoryResult = await pool.query(
      `SELECT id, name, slug
       FROM store_subcategories
       WHERE category_id = $1
       ORDER BY name ASC`,
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
