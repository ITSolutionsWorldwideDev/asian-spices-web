import { pool } from "@/core/db";
import { odooExecute } from "./client";

export async function syncCustomerToOdoo(customerId: string): Promise<number> {
  const custRes = await pool.query(
    `SELECT c.*,
            a.address_line1, a.address_line2, a.city AS addr_city,
            a.postal_code AS addr_postal, a.country AS addr_country
     FROM store_customers c
     LEFT JOIN store_customer_addresses a
       ON a.customer_id = c.id AND (a.is_billing_address = true OR a.is_default = true)
     WHERE c.id = $1
     ORDER BY a.is_billing_address DESC, a.is_default DESC
     LIMIT 1`,
    [customerId]
  );

  if (custRes.rowCount === 0) {
    throw new Error(`Customer not found in AS DB: ${customerId}`);
  }

  const c = custRes.rows[0];
  const isBusiness = c.customer_type === "business";
  const fullName = [c.first_name, c.last_name].filter(Boolean).join(" ").trim();
  const displayName =
    isBusiness && c.company_name
      ? c.company_name
      : fullName || c.email || "Guest Customer";

  const countryCode = (c.addr_country || "NL").toUpperCase();
  const countryIds = await odooExecute<number[]>(
    "res.country",
    "search",
    [[["code", "=", countryCode]]],
    { limit: 1 }
  );

  const partnerPayload: Record<string, unknown> = {
    name: displayName,
    ref: c.id,
    company_type: isBusiness ? "company" : "person",
    email: c.email || false,
    phone: c.phone || false,
    street: c.address_line1 || false,
    street2: c.address_line2 || false,
    city: c.addr_city || c.city || false,
    zip: c.addr_postal || c.postcode || false,
    country_id: countryIds?.[0] || false,
    vat: isBusiness && c.tax_id ? c.tax_id : false,
    customer_rank: 1,
  };

  let partnerId: number | null = c.odoo_partner_id || null;

  if (!partnerId) {
    const existingByRef = await odooExecute<number[]>(
      "res.partner",
      "search",
      [[["ref", "=", c.id]]],
      { limit: 1 }
    );
    if (existingByRef?.length) {
      partnerId = existingByRef[0];
    } else if (c.email) {
      const existingByEmail = await odooExecute<number[]>(
        "res.partner",
        "search",
        [[["email", "=", c.email]]],
        { limit: 1 }
      );
      if (existingByEmail?.length) partnerId = existingByEmail[0];
    }
  }

  if (partnerId) {
    await odooExecute("res.partner", "write", [[partnerId], partnerPayload]);
  } else {
    partnerId = await odooExecute<number>("res.partner", "create", [
      partnerPayload,
    ]);
  }

  await pool.query(
    `UPDATE store_customers SET odoo_partner_id = $1 WHERE id = $2`,
    [partnerId, customerId]
  );
  return partnerId;
}
