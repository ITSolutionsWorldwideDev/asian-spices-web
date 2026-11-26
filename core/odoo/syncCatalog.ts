import { pool } from "@/core/db";
import { odooExecute } from "./client";
import slugify from "slugify";
import crypto from "crypto";

export async function syncOdooCatalogToDatabase() {
  // 1. Fetch categories from Odoo
  const odooCategories = await odooExecute<Array<{ id: number; name: string }>>(
    "product.category",
    "search_read",
    [[]],
    { fields: ["id", "name"] }
  );

  // Pre-load all existing store_categories in 1 query
  const existingCatsRes = await pool.query("SELECT id, name FROM store_categories");
  const catMap = new Map<string, string>(); // category name lower -> store_categories.id
  for (const row of existingCatsRes.rows) {
    if (row.name) catMap.set(row.name.trim().toLowerCase(), row.id);
  }

  for (const oCat of odooCategories) {
    if (!oCat.name) continue;
    const cleanName = oCat.name.trim();
    if (!catMap.has(cleanName.toLowerCase())) {
      const catId = crypto.randomUUID();
      const slug = slugify(cleanName, { lower: true, strict: true }) || `cat-${oCat.id}`;
      await pool.query(
        "INSERT INTO store_categories (id, name, slug, status, created_at, updated_at) VALUES ($1, $2, $3, 1, NOW(), NOW())",
        [catId, cleanName, slug]
      );
      catMap.set(cleanName.toLowerCase(), catId);
    }
  }

  // 2. Pre-load all existing product SKUs in 1 single query
  const existingProductsRes = await pool.query("SELECT id, sku FROM store_products WHERE sku IS NOT NULL");
  const existingSkuMap = new Map<string, string>(); // sku -> id
  for (const row of existingProductsRes.rows) {
    if (row.sku) existingSkuMap.set(row.sku.trim(), row.id);
  }

  // 3. Fetch all active products from Odoo
  const odooProducts = await odooExecute<
    Array<{
      id: number;
      name: string;
      default_code: string | false;
      list_price: number;
      categ_id: [number, string] | false;
      qty_available?: number;
      active: boolean;
    }>
  >(
    "product.product",
    "search_read",
    [[["active", "=", true]]],
    {
      fields: [
        "id",
        "name",
        "default_code",
        "list_price",
        "categ_id",
        "qty_available",
        "active",
      ],
      limit: 3000,
    }
  );

  let updatedCount = 0;
  let insertedCount = 0;
  let skippedNoSkuCount = 0;

  // Process in concurrent batches of 15 for fast execution
  const BATCH_SIZE = 15;
  for (let i = 0; i < odooProducts.length; i += BATCH_SIZE) {
    const batch = odooProducts.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async (oProd) => {
        const sku = (oProd.default_code || "").toString().trim();
        if (!sku) {
          skippedNoSkuCount++;
          return;
        }

        const price = Number(oProd.list_price) || 0;
        const catName = oProd.categ_id ? oProd.categ_id[1].trim().toLowerCase() : "";
        const categoryId = catMap.get(catName) || null;

        if (existingSkuMap.has(sku)) {
          // Update existing product
          await pool.query(
            `UPDATE store_products 
             SET base_price = $1, 
                 category_id = COALESCE($2, category_id), 
                 updated_at = NOW() 
             WHERE sku = $3`,
            [price, categoryId, sku]
          );
          updatedCount++;
        } else {
          // Insert new product
          const newId = crypto.randomUUID();
          const baseSlug =
            slugify(oProd.name || sku, { lower: true, strict: true }) ||
            sku.toLowerCase();
          const slug = `${baseSlug}-${sku.toLowerCase().replace(/[^a-z0-9]/g, "")}`;
          const qty =
            oProd.qty_available !== undefined && oProd.qty_available !== null
              ? Math.max(0, Math.floor(oProd.qty_available))
              : 100;

          await pool.query(
            `INSERT INTO store_products (
              id, name, slug, sku, item_code, base_price, quantity, status, category_id, created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, 1, $8, NOW(), NOW())`,
            [newId, oProd.name || sku, slug, sku, sku, price, qty, categoryId]
          );
          existingSkuMap.set(sku, newId);
          insertedCount++;
        }
      })
    );
  }

  return {
    totalOdooProducts: odooProducts.length,
    updated: updatedCount,
    inserted: insertedCount,
    skippedNoSku: skippedNoSkuCount,
    categoriesCount: catMap.size,
  };
}
