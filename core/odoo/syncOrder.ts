import { pool } from "@/core/db";
import { odooExecute } from "./client";
import { syncCustomerToOdoo } from "./syncPartner";

async function getAsianSpicesCompanyId(): Promise<number | null> {
  try {
    const companies = await odooExecute<number[]>(
      "res.company",
      "search",
      [[["name", "ilike", "Asian Spices"]]],
      { limit: 1 }
    );
    if (companies?.length) return companies[0];

    const anyCompanies = await odooExecute<number[]>(
      "res.company",
      "search",
      [[]],
      { limit: 1 }
    );
    return anyCompanies?.[0] || null;
  } catch (err) {
    console.warn("[Odoo Company Resolution Warning]:", err);
    return null;
  }
}

async function getEurCurrencyId(): Promise<number | null> {
  try {
    const currencies = await odooExecute<number[]>(
      "res.currency",
      "search",
      [[["name", "=", "EUR"]]],
      { limit: 1 }
    );
    return currencies?.[0] || null;
  } catch (err) {
    console.warn("[Odoo EUR Currency Warning]:", err);
    return null;
  }
}

async function getEurPricelistId(
  eurCurrencyId: number | null,
  companyId: number | null
): Promise<number | null> {
  if (!eurCurrencyId) return null;
  try {
    const domain: unknown[] = [["currency_id", "=", eurCurrencyId]];
    if (companyId) {
      domain.push(["company_id", "in", [companyId, false]]);
    }
    const pricelists = await odooExecute<number[]>(
      "product.pricelist",
      "search",
      [domain],
      { limit: 1 }
    );
    return pricelists?.[0] || null;
  } catch (err) {
    console.warn("[Odoo EUR Pricelist Warning]:", err);
    return null;
  }
}

async function getOdooSalesTaxId(
  taxRatePercent: number,
  companyId: number | null
): Promise<number | null> {
  if (!taxRatePercent || taxRatePercent <= 0) return null;

  // 1. Company-specific search to prevent multi-company crossover error
  if (companyId) {
    try {
      const companyTaxes = await odooExecute<number[]>(
        "account.tax",
        "search",
        [[
          ["type_tax_use", "=", "sale"],
          ["amount", "=", taxRatePercent],
          ["company_id", "=", companyId],
        ]],
        { limit: 1 }
      );
      if (companyTaxes?.length) return companyTaxes[0];
    } catch (err) {
      console.warn("[Odoo Tax Company Filter Warning]:", err);
    }
  }

  // 2. Fallback search
  try {
    const fallbackTaxes = await odooExecute<number[]>(
      "account.tax",
      "search",
      [[
        ["type_tax_use", "=", "sale"],
        ["amount", "=", taxRatePercent],
      ]],
      { limit: 1 }
    );
    return fallbackTaxes?.[0] || null;
  } catch (err) {
    console.warn("[Odoo Tax Fallback Warning]:", err);
    return null;
  }
}

async function sendOdooInvoiceEmail(
  odooInvoiceId: number,
  odooContext: Record<string, unknown>
) {
  try {
    const templates = await odooExecute<number[]>(
      "mail.template",
      "search",
      [[
        ["model", "=", "account.move"],
        "|",
        ["name", "ilike", "Invoice"],
        ["name", "ilike", "Factuur"],
      ]],
      { limit: 1, context: odooContext }
    );

    const templateId = templates?.[0] || null;
    if (templateId) {
      await odooExecute(
        "mail.template",
        "send_mail",
        [templateId, odooInvoiceId],
        {
          force_send: true,
          email_values: {
            email_from: "order@asianspices.online",
            email_cc: "admin@asianspices.online,ahmad.raza@itsolutionsworldwide.com",
          },
          context: odooContext,
        }
      );
      console.log(`[Odoo Invoice Email]: Invoice #${odooInvoiceId} sent successfully via Odoo`);
    } else {
      console.warn("[Odoo Invoice Email Warning]: No mail.template found for account.move");
    }
  } catch (err) {
    console.warn("[Odoo Invoice Email Error]:", err);
  }
}

export async function syncPaidOrderToOdoo(orderId: string) {
  const orderRes = await pool.query(
    `SELECT o.*, s.name AS store_name
     FROM store_orders o
     LEFT JOIN stores s ON s.id = COALESCE(o.current_store_id, o.store_id)
     WHERE o.id = $1`,
    [orderId]
  );

  if (orderRes.rowCount === 0) throw new Error(`Order not found: ${orderId}`);
  const order = orderRes.rows[0];

  if (order.payment_status !== "paid") {
    return { skipped: true, reason: "Order is not paid yet" };
  }

  const existingOrders = await odooExecute<number[]>(
    "sale.order",
    "search",
    [[["client_order_ref", "=", order.order_number]]],
    { limit: 1 }
  );
  if (existingOrders?.length) {
    return { skipped: true, reason: "Already synced to Odoo", odooOrderId: existingOrders[0] };
  }

  const companyId = await getAsianSpicesCompanyId();
  const odooContext = companyId
    ? { allowed_company_ids: [companyId], company_id: companyId }
    : {};

  const eurCurrencyId = await getEurCurrencyId();
  const eurPricelistId = await getEurPricelistId(eurCurrencyId, companyId);

  const partnerId = await syncCustomerToOdoo(order.customer_id);

  const itemsRes = await pool.query(
    `SELECT oi.*, p.name AS product_name, p.sku AS product_sku
     FROM store_order_items oi
     LEFT JOIN store_products p ON p.id = oi.product_id
     WHERE oi.order_id = $1`,
    [orderId]
  );

  const orderLines: unknown[] = [];

  for (const item of itemsRes.rows) {
    const unitPriceExclVat = Number(item.price);
    const taxRate = Number(item.tax_rate || 0);
    const taxId = await getOdooSalesTaxId(taxRate, companyId);

    // Look up Odoo product by SKU from bulk imported POS catalog
    let odooProductId: number | null = null;
    if (item.product_sku) {
      try {
        const prods = await odooExecute<number[]>(
          "product.product",
          "search",
          [[
            ["default_code", "=", item.product_sku.trim()],
            ...(companyId ? [["company_id", "in", [companyId, false]]] : []),
          ]],
          { limit: 1, context: odooContext }
        );
        if (prods?.length) odooProductId = prods[0];
      } catch (prodErr) {
        console.warn("[Odoo Product Lookup Warning]:", prodErr);
      }
    }

    const lineData: Record<string, unknown> = {
      name: item.product_name || `Product (${item.product_id})`,
      product_uom_qty: Number(item.quantity),
      qty_delivered: Number(item.quantity),
      price_unit: unitPriceExclVat,
      tax_ids: taxId ? [[6, 0, [taxId]]] : [[6, 0, []]],
    };

    if (odooProductId) {
      lineData.product_id = odooProductId;
    }

    orderLines.push([0, 0, lineData]);
  }

  const shippingAmount = Number(order.shipping_amount || 0);
  if (shippingAmount > 0) {
    const standardVatId = await getOdooSalesTaxId(21, companyId);
    orderLines.push([
      0,
      0,
      {
        name: `Shipping (${order.shipping_provider || order.order_type})`,
        product_uom_qty: 1,
        qty_delivered: 1,
        price_unit: shippingAmount,
        tax_ids: standardVatId ? [[6, 0, [standardVatId]]] : [[6, 0, []]],
      },
    ]);
  }

  const discountAmount = Number(order.discount_amount || 0);
  if (discountAmount > 0) {
    orderLines.push([
      0,
      0,
      {
        name: "Order Discount",
        product_uom_qty: 1,
        price_unit: -Math.abs(discountAmount),
        tax_ids: [[6, 0, []]],
      },
    ]);
  }

  const orderPayload: Record<string, unknown> = {
    partner_id: partnerId,
    client_order_ref: order.order_number,
    origin: `${order.store_name || "Asian Spices"} | ${order.payment_method?.toUpperCase() || "ONLINE"} (${order.transaction_id || ""})`,
    note: `Store: ${order.store_name || "Default"} | Shipping: ${[
      order.shipping_address_line1,
      order.shipping_postal_code,
      order.shipping_city,
      order.shipping_country,
    ]
      .filter(Boolean)
      .join(", ")}`,
    order_line: orderLines,
  };

  if (companyId) {
    orderPayload.company_id = companyId;
  }
  if (eurCurrencyId) {
    orderPayload.currency_id = eurCurrencyId;
  }
  if (eurPricelistId) {
    orderPayload.pricelist_id = eurPricelistId;
  }

  const odooOrderId = await odooExecute<number>(
    "sale.order",
    "create",
    [orderPayload],
    { context: odooContext }
  );

  await odooExecute(
    "sale.order",
    "action_confirm",
    [[odooOrderId]],
    { context: odooContext }
  );

  let odooInvoiceId: number | null = null;
  try {
    const invoiceIds = await odooExecute<number[]>(
      "sale.order",
      "_create_invoices",
      [[odooOrderId]],
      { context: odooContext }
    );

    if (invoiceIds?.length) {
      odooInvoiceId = invoiceIds[0];

      // Ensure invoice uses EUR
      if (eurCurrencyId) {
        await odooExecute(
          "account.move",
          "write",
          [[odooInvoiceId], { currency_id: eurCurrencyId }],
          { context: odooContext }
        ).catch(() => {});
      }

      // Post invoice
      await odooExecute(
        "account.move",
        "action_post",
        [[odooInvoiceId]],
        { context: odooContext }
      );

      // Email invoice with PDF attachment to customer, BCC to admin & ahmad.raza
      await sendOdooInvoiceEmail(odooInvoiceId, odooContext);
    }
  } catch (invErr) {
    console.warn("[Odoo Invoice Creation Warning]:", invErr);
  }

  await pool.query(
    `UPDATE store_orders
     SET odoo_order_id = $1,
         odoo_invoice_id = $2,
         odoo_synced_at = NOW()
     WHERE id = $3`,
    [odooOrderId, odooInvoiceId, orderId]
  );

  return { success: true, odooPartnerId: partnerId, odooOrderId, odooInvoiceId };
}
