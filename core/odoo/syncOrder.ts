import { pool } from "@/core/db";
import { odooExecute } from "./client";
import { syncCustomerToOdoo } from "./syncPartner";

async function getOdooSalesTaxId(taxRatePercent: number): Promise<number | null> {
  if (!taxRatePercent || taxRatePercent <= 0) return null;
  const taxes = await odooExecute<number[]>(
    "account.tax",
    "search",
    [[["type_tax_use", "=", "sale"], ["amount", "=", taxRatePercent]]],
    { limit: 1 }
  );
  return taxes?.[0] || null;
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
    const taxId = await getOdooSalesTaxId(taxRate);

    orderLines.push([
      0,
      0,
      {
        name: item.product_name || `Product (${item.product_id})`,
        product_uom_qty: Number(item.quantity),
        price_unit: unitPriceExclVat,
        tax_id: taxId ? [[6, 0, [taxId]]] : [[6, 0, []]],
      },
    ]);
  }

  const shippingAmount = Number(order.shipping_amount || 0);
  if (shippingAmount > 0) {
    const standardVatId = await getOdooSalesTaxId(21);
    orderLines.push([
      0,
      0,
      {
        name: `Shipping (${order.shipping_provider || order.order_type})`,
        product_uom_qty: 1,
        price_unit: shippingAmount,
        tax_id: standardVatId ? [[6, 0, [standardVatId]]] : [[6, 0, []]],
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
        tax_id: [[6, 0, []]],
      },
    ]);
  }

  const odooOrderId = await odooExecute<number>("sale.order", "create", [
    {
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
    },
  ]);

  await odooExecute("sale.order", "action_confirm", [[odooOrderId]]);

  const invoiceIds = await odooExecute<number[]>("sale.order", "_create_invoices", [[odooOrderId]]);
  let odooInvoiceId: number | null = null;

  if (invoiceIds?.length) {
    odooInvoiceId = invoiceIds[0];
    await odooExecute("account.move", "action_post", [[odooInvoiceId]]);
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
