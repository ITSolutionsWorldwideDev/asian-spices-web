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

  const catMap = new Map<string, string>(); // category name lowercase -> store_categories.id
  for (const oCat of odooCategories) {
    if (!oCat.name) continue;
    const cleanName = oCat.name.trim();
    const existing = await pool.query(
      "SELECT id FROM store_categories WHERE LOWER(name) = LOWER($1) LIMIT 1",
      [cleanName]
    );

    if (existing.rows.length > 0) {
      catMap.set(cleanName.toLowerCase(), existing.rows[0].id);
    } else {
      const catId = crypto.randomUUID();
      const slug = slugify(cleanName, { lower: true, strict: true }) || `cat-${oCat.id}`;
      await pool.query(
        "INSERT INTO store_categories (id, name, slug, status, created_at, updated_at) VALUES ($1, $2, $3, 1, NOW(), NOW())",
        [catId, cleanName, slug]
      );
      catMap.set(cleanName.toLowerCase(), catId);
    }
  }

  // 2. Fetch all active products from Odoo
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

  for (const oProd of odooProducts) {
    const sku = (oProd.default_code || "").toString().trim();
    if (!sku) {
      skippedNoSkuCount++;
      continue;
    }

    const price = Number(oProd.list_price) || 0;
    const catName = oProd.categ_id ? oProd.categ_id[1].trim().toLowerCase() : "";
    const categoryId = catMap.get(catName) || null;

    // Check if product exists in store_products by SKU
    const existing = await pool.query(
      "SELECT id FROM store_products WHERE sku = $1 LIMIT 1",
      [sku]
    );

    if (existing.rows.length > 0) {
      // Update price and category without duplicating
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
      insertedCount++;
    }
  }

  return {
    totalOdooProducts: odooProducts.length,
    updated: updatedCount,
    inserted: insertedCount,
    skippedNoSku: skippedNoSkuCount,
    categoriesCount: catMap.size,
  };
}
