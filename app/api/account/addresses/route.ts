// app/api/account/addresses/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { webAuthOptions } from "@/core/auth";
import { pool } from "@/core/db";
import { addressSchema } from "@/lib/validation/account";

export async function GET() {
  const session = await getServerSession(webAuthOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await pool.connect();

  try {
    const { rows } = await client.query(
      `
      SELECT a.*,c.first_name,c.last_name,c.phone
      FROM store_customer_addresses a
      JOIN store_customers c ON c.id = a.customer_id
      WHERE c.user_id = $1
      ORDER BY a.is_default DESC,a.created_at DESC
      `,
      [session.user.id],
    );

    // Deduplicate addresses (keeping default or newest) and cleanup redundant duplicates
    const seen = new Set<string>();
    const uniqueRows: typeof rows = [];
    const duplicateIds: any[] = [];

    for (const addr of rows) {
      const key = [
        addr.address_line1?.trim().toLowerCase() || "",
        addr.address_line2?.trim().toLowerCase() || "",
        addr.postal_code?.trim().toLowerCase() || "",
        addr.city?.trim().toLowerCase() || "",
        addr.country?.trim().toLowerCase() || "",
      ].join("|");

      if (seen.has(key)) {
        duplicateIds.push(addr.id);
      } else {
        seen.add(key);
        uniqueRows.push(addr);
      }
    }

    if (duplicateIds.length > 0) {
      await client
        .query(`DELETE FROM store_customer_addresses WHERE id = ANY($1)`, [
          duplicateIds,
        ])
        .catch((e) =>
          console.error("Failed to cleanup duplicate addresses:", e),
        );
    }

    return NextResponse.json({
      success: true,
      addresses: uniqueRows,
    });
  } catch (err) {
    console.error("GET ADDRESSES ERROR:", err);

    return NextResponse.json(
      { error: "Failed to fetch addresses" },
      { status: 500 },
    );
  } finally {
    client.release();
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(webAuthOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const parsed = addressSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { rows: customerRows } = await client.query(
      `SELECT id FROM store_customers WHERE user_id = $1 LIMIT 1`,
      [session.user.id],
    );

    const customer_id = customerRows[0]?.id;

    if (!customer_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data } = parsed;

    // =========================
    // CHECK FIRST ADDRESS
    // =========================
    const { rows: existingAddresses } = await client.query(
      `
      SELECT id
      FROM store_customer_addresses
      WHERE customer_id = $1
      LIMIT 1
      `,
      [customer_id],
    );

    // =========================
    // CHECK DUPLICATE ADDRESS
    // =========================
    const { rows: duplicateCheck } = await client.query(
      `
      SELECT id FROM store_customer_addresses
      WHERE customer_id = $1
        AND LOWER(TRIM(address_line1)) = LOWER(TRIM($2))
        AND LOWER(TRIM(COALESCE(address_line2, ''))) = LOWER(TRIM(COALESCE($3, '')))
        AND LOWER(TRIM(COALESCE(postal_code, ''))) = LOWER(TRIM(COALESCE($4, '')))
        AND LOWER(TRIM(COALESCE(city, ''))) = LOWER(TRIM(COALESCE($5, '')))
        AND LOWER(TRIM(COALESCE(country, ''))) = LOWER(TRIM(COALESCE($6, '')))
      LIMIT 1
      `,
      [
        customer_id,
        data.address_line1 || "",
        data.address_line2 || "",
        data.postal_code || "",
        data.city || "",
        data.country || "",
      ],
    );

    if (duplicateCheck.length > 0) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "Address already exists" },
        { status: 409 },
      );
    }

    const isFirstAddress = existingAddresses.length === 0;

    // =========================
    // INSERT ADDRESS
    // =========================
    const { rows } = await client.query(
      `
      INSERT INTO store_customer_addresses
      (
        store_id,
        customer_id,
        label,
        address_line1,
        address_line2,
        city,
        state,
        postal_code,
        country,
        is_default,
        is_shipping_address,
        is_billing_address
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      `,
      [
        null,
        customer_id,
        data.label,
        data.address_line1,
        data.address_line2 || null,
        data.city,
        data.state || null,
        data.postal_code,
        data.country,

        // first address auto default
        isFirstAddress,

        data.is_shipping_address,
        data.is_billing_address,
      ],
    );

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      address: rows[0],
    });
  } catch (err) {
    await client.query("ROLLBACK");

    console.error("CREATE ADDRESS ERROR:", err);

    return NextResponse.json(
      { error: "Failed to create address" },
      { status: 500 },
    );
  } finally {
    client.release();
  }
}
