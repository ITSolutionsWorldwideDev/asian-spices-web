// app/api/account/orders/[id]/invoice/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { webAuthOptions } from "@/core/auth";
import { pool } from "@/core/db";
import { jsPDF } from "jspdf";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(webAuthOptions);

  const { id } = await params;

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orderId = id;
  const client = await pool.connect();

  try {
    // 1. Fetch order details and verify ownership and payment status
    const orderQuery = `
      SELECT o.*,
        json_agg(
          json_build_object(
            'title', p.name,
            'price', oi.price,
            'quantity', oi.quantity
          )
        ) AS cart_items,
        json_agg(
          json_build_object(
            'company_name', c.company_name,
            'customer_name', c.first_name || ' ' || c.last_name,
            'email', c.email,
            'phone', c.phone,
            'city', c.city,
            'postcode', c.postcode
          )
        ) AS customer_info
      FROM store_orders o
      LEFT JOIN store_order_items oi ON oi.order_id = o.id
      LEFT JOIN store_products p ON oi.product_id = p.id
      LEFT JOIN store_customers c ON c.id = o.customer_id
      WHERE o.id = $1 
      GROUP BY o.id
    `; // AND c.user_id = $2

    const { rows } = await client.query(orderQuery, [orderId]); // , session.user.id
    const order = rows[0];

    // console.log('order details ==== ',order);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 🛑 Security Gate: Enforce invoice creation only for paid orders
    if (order.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Invoices are only available for paid transactions." },
        { status: 403 },
      );
    }

    // 🚀 IN-MEMORY PDF GENERATION (Immune to Next.js bundling paths bugs)
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    // --- PDF DESIGN LAYOUT ---

    // Header Banner
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor("#111827");
    doc.text("INVOICE", 450, 50, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor("#4B5563");
    doc.text("Asian Spices", 50, 50);
    doc.text("123 Business Rd, Amsterdam", 50, 65);
    doc.text("VAT: NL87654321B01", 50, 80);

    const topMetaY = 130;

    // Bill To Section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor("#111827");
    doc.text("Invoice To:", 50, topMetaY);

    doc.setFont("helvetica", "normal");
    doc.setTextColor("#4B5563");
    doc.text(
      `${order.customer_info[0]?.customer_name || "Valued Customer"}`,
      50,
      topMetaY + 15,
    );
    // doc.text(`${order.shipping_address?.email || ""}`, 50, topMetaY + 30);
    doc.text(`${order.customer_email || ""}`, 50, topMetaY + 30);
    doc.text(`${order.shipping_address_line1 || ""}`, 50, topMetaY + 45);
    doc.text(`${order.shipping_address_line2 || ""}`, 50, topMetaY + 60);
    doc.text(`${order.shipping_city || ""}`, 50, topMetaY + 75);
    doc.text(`${order.shipping_state || ""}`, 50, topMetaY + 90);
    doc.text(`${order.shipping_postal_code || ""}`, 50, topMetaY + 105);
    doc.text(`${order.shipping_country || ""}`, 50, topMetaY + 120);

    // Meta Block Info Section
    doc.setFont("helvetica", "bold");
    doc.setTextColor("#111827");
    doc.text("Order Number:", 340, topMetaY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor("#4B5563");
    doc.text(`#${order.order_number}`, 440, topMetaY);

    doc.setFont("helvetica", "bold");
    doc.setTextColor("#111827");
    doc.text("Date:", 340, topMetaY + 15);
    doc.setFont("helvetica", "normal");
    doc.setTextColor("#4B5563");
    doc.text(
      `${new Date(order.created_at).toLocaleDateString()}`,
      440,
      topMetaY + 15,
    );

    doc.setFont("helvetica", "bold");
    doc.setTextColor("#111827");
    doc.text("Payment:", 340, topMetaY + 30);
    doc.setTextColor("#16A34A"); // Green paid confirmation marker
    doc.text("PAID", 440, topMetaY + 30);

    // Table Header Area
    let currentY = 280;
    doc.setFillColor(243, 244, 246); // Light gray background
    doc.rect(50, currentY, 500, 20, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor("#111827");
    doc.text("Item Description", 60, currentY + 14);
    doc.text("Qty", 340, currentY + 14);
    doc.text("Unit Price", 400, currentY + 14);
    doc.text("Total", 490, currentY + 14);

    currentY += 20;

    const validItems = Array.isArray(order.cart_items)
      ? order.cart_items.filter((i: any) => i && i.title)
      : [];

    // Loop through invoice item records
    validItems.forEach((item: any) => {
      currentY += 20;
      doc.setFont("helvetica", "normal");
      doc.setTextColor("#4B5563");

      // Draw truncated title lines smoothly
      doc.text(item.title.substring(0, 42), 60, currentY);
      doc.text(item.quantity.toString(), 345, currentY);
      doc.text(`€${Number(item.price).toFixed(2)}`, 400, currentY);
      doc.text(`€ ${(item.price * item.quantity).toFixed(2)}`, 490, currentY);

      // Horizontal separation borders
      doc.setDrawColor(229, 231, 235);
      doc.setLineWidth(0.5);
      doc.line(50, currentY + 6, 550, currentY + 6);
      currentY += 6;
    });

    // Summary calculation presentation lines
    currentY += 30;
    doc.setFont("helvetica", "normal");
    doc.setTextColor("#4B5563");
    doc.text("Subtotal:", 380, currentY);
    doc.text(`€${Number(order.subtotal || 0).toFixed(2)}`, 490, currentY);

    currentY += 15;
    doc.text("Shipping:", 380, currentY);
    doc.text(
      `€${Number(order.shipping_amount || 0).toFixed(2)}`,
      490,
      currentY,
    );

    currentY += 15;
    doc.text("Tax (BTW):", 380, currentY);
    doc.text(`€${Number(order.tax_amount || 0).toFixed(2)}`, 490, currentY);

    currentY += 25;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor("#111827");
    doc.text("Total paid amount:", 320, currentY);
    doc.text(`€${Number(order.total_amount).toFixed(2)}`, 490, currentY);

    // Footer greeting message
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor("#9CA3AF");
    doc.text(
      "Thank you for choosing us! If you have any inquiries regarding this transactional invoice statement, contact help@yourstore.com",
      300,
      760,
      { align: "center" },
    );

    // Output straight as a raw array buffer stream type
    const pdfOutputArrayBuffer = doc.output("arraybuffer");
    const responseBody = new Uint8Array(pdfOutputArrayBuffer);

    return new NextResponse(responseBody, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice_order_${order.order_number}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error("Invoice compilation failed:", error);
    return NextResponse.json(
      { error: "Failed compiling invoice file PDF asset" },
      { status: 500 },
    );
  } finally {
    client.release();
  }
}
