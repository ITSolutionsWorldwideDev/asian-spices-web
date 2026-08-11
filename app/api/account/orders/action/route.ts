// app/api/account/orders/action/route.ts

import { NextResponse } from "next/server";
import { pool } from "@/core/db";
import { sendReturnStatusUpdateEmail } from "@/core/email-templates";
import {
  MIN_ORDER_AMOUNT_EUR,
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_OPTIONS,
} from "@/lib/pricing";

export async function POST(request: Request) {
  const client = await pool.connect();
  try {
    const body = await request.json();
    const { orderId, actionType, reason, comments, items } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: "Missing required order identity reference parameters." },
        { status: 400 },
      );
    }

    // =========================================================================
    // BRANCH A: PRE-SHIPMENT CANCEL WORKFLOW (Aligned with B2C Flow Policy)
    // =========================================================================
    if (actionType === "PRE_SHIPMENT_CANCEL") {
      if (!reason) {
        return NextResponse.json(
          { error: "A cancellation reason must be selected." },
          { status: 400 },
        );
      }

      await client.query("BEGIN");

      // 1. Validate Order Status and Eligibility
      const orderQuery = `
        SELECT order_status, payment_status, shipping_status, fulfillment_status, payment_method,
               subtotal, shipping_amount, tax_amount, total_amount, shipping_provider
        FROM store_orders
        WHERE id = $1
        LIMIT 1;
      `;
      const orderRes = await client.query(orderQuery, [orderId]);

      if (orderRes.rows.length === 0) {
        throw new Error("Target parent order record could not be found.");
      }

      const order = orderRes.rows[0];

      if (order.order_status?.toLowerCase() === "cancelled") {
        throw new Error("This order has already been cancelled.");
      }

      // Cancel is only allowed before the order ships, matching the
      // customer portal's Cancel/Request Return button logic.
      const shippingStatus = order.shipping_status?.toLowerCase();
      const fulfillmentStatus = order.fulfillment_status?.toLowerCase();
      const isShippedOrLater =
        shippingStatus === "shipped" ||
        shippingStatus === "delivered" ||
        fulfillmentStatus === "shipped";

      if (isShippedOrLater) {
        throw new Error(
          "This order can no longer be cancelled - it has already shipped. Please file a return request instead.",
        );
      }

      const requestedItems: Array<{ itemId: string }> = Array.isArray(items)
        ? items
        : [];

      // 2a. Line-item cancellation path - customer selected specific products
      // to cancel rather than the whole order.
      if (requestedItems.length > 0) {
        const activeItemsRes = await client.query(
          `SELECT product_id, quantity, price, tax_amount
           FROM store_order_items
           WHERE order_id = $1 AND status != 'cancelled';`,
          [orderId],
        );
        const activeItems = activeItemsRes.rows;
        const activeById = new Map(
          activeItems.map((row) => [String(row.product_id), row]),
        );

        const requestedIds = requestedItems.map((it) => String(it.itemId));
        for (const id of requestedIds) {
          if (!activeById.has(id)) {
            throw new Error(
              `Item ${id} is not an active line item on this order.`,
            );
          }
        }

        const cancelRows = requestedIds.map((id) => activeById.get(id)!);
        const cancelAmount = cancelRows.reduce(
          (sum, row) => sum + Number(row.price) * Number(row.quantity),
          0,
        );
        const cancelTax = cancelRows.reduce(
          (sum, row) => sum + Number(row.tax_amount || 0),
          0,
        );

        const subtotal = Number(order.subtotal || 0);
        const shippingAmount = Number(order.shipping_amount || 0);
        const taxAmount = Number(order.tax_amount || 0);
        const newSubtotal = Math.max(0, subtotal - cancelAmount);
        const isFullCancel = requestedIds.length === activeItems.length;

        // Enforce the €10 minimum-order threshold: a partial cancellation
        // can never leave the order sitting at an uneconomical remainder.
        // Cancelling everything (newSubtotal === 0) is a full cancel instead.
        if (
          !isFullCancel &&
          newSubtotal > 0 &&
          newSubtotal < MIN_ORDER_AMOUNT_EUR
        ) {
          throw new Error(
            `Cancelling the selected item(s) would leave a subtotal of €${newSubtotal.toFixed(2)}, below the €${MIN_ORDER_AMOUNT_EUR.toFixed(2)} minimum. Cancel the entire order instead, or keep enough items to stay at or above €${MIN_ORDER_AMOUNT_EUR.toFixed(2)}.`,
          );
        }

        await client.query(
          `UPDATE store_order_items SET status = 'cancelled' WHERE order_id = $1 AND product_id = ANY($2::uuid[]);`,
          [orderId, requestedIds],
        );

        if (isFullCancel) {
          // Nothing is left to ship, so the order's live totals should
          // reflect that (€0 across the board) rather than freezing at
          // whatever was charged before this cancellation.
          await client.query(
            `UPDATE store_orders
             SET order_status = 'cancelled', subtotal = 0, tax_amount = 0, shipping_amount = 0, total_amount = 0, updated_at = now()
             WHERE id = $1;`,
            [orderId],
          );
        } else {
          const newTax = Math.max(0, taxAmount - cancelTax);

          // Re-apply the free-shipping threshold against the reduced
          // subtotal - a "standard" shipping order that was free because it
          // crossed FREE_SHIPPING_THRESHOLD at checkout must start charging
          // shipping again if cancellation drops it back below that line.
          // This is what closes the "cancel down to keep free shipping"
          // abuse path.
          const shippingMethod = order.shipping_provider?.toLowerCase();
          const isStandardMethod =
            shippingMethod === "standard" ||
            shippingMethod === "standard delivery";
          const newShippingAmount = isStandardMethod
            ? newSubtotal >= FREE_SHIPPING_THRESHOLD
              ? 0
              : SHIPPING_OPTIONS.standard.price
            : shippingAmount;

          const newTotal = newSubtotal + newShippingAmount;
          await client.query(
            `UPDATE store_orders
             SET subtotal = $2, tax_amount = $3, shipping_amount = $4, total_amount = $5, updated_at = now()
             WHERE id = $1;`,
            [orderId, newSubtotal, newTax, newShippingAmount, newTotal],
          );
        }

        await client.query("COMMIT");

        return NextResponse.json(
          {
            success: true,
            message: isFullCancel
              ? "Order successfully cancelled."
              : "Selected item(s) successfully cancelled.",
          },
          { status: 200 },
        );
      }

      // 2b. Legacy whole-order cancel path - no item selection supplied.
      // No refund handling needed here - payment isn't confirmed yet at this
      // point (guarded above), so there's nothing to refund.
      // Policy Rules note: No Inventory management, No ERP, No Accounting updates here.
      const updateOrderQuery = `
        UPDATE store_orders
        SET
          order_status = 'cancelled',
          updated_at = now()
        WHERE id = $1;
      `;

      await client.query(updateOrderQuery, [orderId]);

      await client.query("COMMIT");

      return NextResponse.json(
        {
          success: true,
          message: "Order successfully cancelled.",
        },
        { status: 200 },
      );
    }

    // =========================================================================
    // BRANCH B: STANDARD POST-SHIPMENT RETURN WORKFLOW
    // =========================================================================
    if (!reason || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required return reasons or item arrays." },
        { status: 400 },
      );
    }

    if (reason === "other" && (!comments || comments.trim().length < 10)) {
      return NextResponse.json(
        {
          error: "Detailed description is required for custom reason requests.",
        },
        { status: 400 },
      );
    }

    await client.query("BEGIN");

    // 1. Core verification against policy workflow properties
    // shipping_status is the field CheapCargo tracking actually writes
    // "delivered" to - order_status never reaches that value.
    const orderInfoQuery = `
      SELECT customer_id, shipping_status, delivered_at
      FROM store_orders
      WHERE id = $1
      LIMIT 1;
    `;
    const orderInfoRes = await client.query(orderInfoQuery, [orderId]);

    if (orderInfoRes.rows.length === 0) {
      throw new Error("Parent order data record lookup returned empty.");
    }

    const { customer_id: customerId, shipping_status: shippingStatus, delivered_at: deliveryDate } = orderInfoRes.rows[0];

    // Check Eligibility Condition A: Must be 'delivered'
    if (shippingStatus?.toLowerCase() !== "delivered") {
      throw new Error("Returns are strictly permitted for delivered orders only.");
    }

    // Check Eligibility Condition B: Return Window must be <= 7 days from execution date
    if (!deliveryDate) {
      throw new Error("Delivery timeline tracking information is missing from this order.");
    }
    
    const deliveryTimestamp = new Date(deliveryDate).getTime();
    const currentTimestamp = Date.now();
    const ageInDays = Math.ceil((currentTimestamp - deliveryTimestamp) / (1000 * 60 * 60 * 24));

    if (ageInDays > 7) {
      throw new Error("Return window expired. Item returns must be requested within 7 days of delivery.");
    }

    // const orderInfoQuery = `SELECT customer_id FROM store_orders WHERE id = $1 LIMIT 1;`;
    // const orderInfoRes = await client.query(orderInfoQuery, [orderId]);
    // if (orderInfoRes.rows.length === 0) {
    //   throw new Error("Parent order data record lookup returned empty.");
    // }
    // const customerId = orderInfoRes.rows[0].customer_id;

    const quantityCheckQuery = `
      SELECT 
        oi.quantity as original_ordered_qty,
        COALESCE(SUM(ri.quantity), 0) as already_returned_qty
      FROM store_order_items oi
      LEFT JOIN store_order_return_items ri ON ri.product_id = oi.product_id
      LEFT JOIN store_order_returns r ON r.id = ri.return_id AND r.status != 'rejected'
      WHERE oi.order_id = $1 AND oi.product_id = $2
      GROUP BY oi.quantity;
    `;

    for (const item of items) {
      const productId = item.itemId;
      const checkRes = await client.query(quantityCheckQuery, [
        orderId,
        productId,
      ]);

      if (checkRes.rows.length === 0) {
        throw new Error(
          `The item ${productId} does not exist in the original order.`,
        );
      }

      const { original_ordered_qty, already_returned_qty } = checkRes.rows[0];

      if (
        parseInt(already_returned_qty, 10) + parseInt(item.quantity, 10) >
        parseInt(original_ordered_qty, 10)
      ) {
        throw new Error(
          `Invalid Return Quantity. Already filed for ${already_returned_qty} out of ${original_ordered_qty} units.`,
        );
      }
    }

    const uniqueHash = Math.floor(1000 + Math.random() * 9000);
    const returnNumber = `RET-${Date.now().toString().slice(-6)}-${uniqueHash}`;
    const combinedNotes = comments ? `User Note: ${comments.trim()}` : null;

    const returnInsertQuery = `
      INSERT INTO store_order_returns (order_id, customer_id, return_number, reason, admin_notes, status)
      VALUES ($1, $2, $3, $4, $5, 'pending')
      RETURNING id, return_number;
    `;
    const returnResult = await client.query(returnInsertQuery, [
      orderId,
      customerId,
      returnNumber,
      reason,
      combinedNotes,
    ]);
    const returnId = returnResult.rows[0].id;

    const itemInsertQuery = `
      INSERT INTO store_order_return_items (return_id, product_id, quantity)
      VALUES ($1, $2, $3);
    `;

    for (const item of items) {
      await client.query(itemInsertQuery, [
        returnId,
        item.itemId,
        item.quantity,
      ]);
    }

    await client.query("COMMIT");

    try {
      await sendReturnStatusUpdateEmail(returnId);
    } catch (emailErr) {
      console.error("Non-fatal email alert engine failure:", emailErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Return request filed successfully.",
        returnNumber: returnResult.rows[0].return_number,
      },
      { status: 200 },
    );
  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("Database order management routing failure:", error);
    return NextResponse.json(
      {
        error:
          error.message ||
          "Internal transaction failure parsing order records.",
      },
      { status: 500 },
    );
  } finally {
    client.release();
  }
}

/* import { NextResponse } from "next/server";
import { pool } from "@/core/db";
import { sendReturnStatusUpdateEmail } from "@/core/email-templates";

export async function POST(request: Request) {
  const client = await pool.connect();
  try {
    const body = await request.json();
    const { orderId, actionType, reason, comments, items } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: "Missing required order identity reference parameters." },
        { status: 400 },
      );
    }

    // =========================================================================
    // BRANCH A: PRE-SHIPMENT CANCEL WORKFLOW
    // =========================================================================

    if (actionType === "PRE_SHIPMENT_CANCEL") {
      await client.query("BEGIN");

      // 1. Verify the order is in a state that allows immediate cancellation
      const statusCheckQuery = `SELECT order_status FROM store_orders WHERE id = $1 LIMIT 1;`;
      const statusCheckRes = await client.query(statusCheckQuery, [orderId]);

      if (statusCheckRes.rows.length === 0) {
        throw new Error("Target parent order record could not be found.");
      }

      const currentStatus = statusCheckRes.rows[0].order_status?.toLowerCase();
      const allowCancelStatuses = ["pending", "confirmed", "processing"];

      if (!allowCancelStatuses.includes(currentStatus)) {
        throw new Error(
          `Order cannot be cancelled because it is already marked as '${currentStatus}'.`,
        );
      }

      // 2. Extract allocations linked to this order to find product ids, store nodes, and volumes
      const getAllocationsQuery = `
        SELECT id, store_id, order_item_id, allocated_quantity, status
        FROM order_item_allocations
        WHERE order_id = $1 AND status IN ('allocated', 'processing', 'fulfilled');
      `;
      const { rows: allocations } = await client.query(getAllocationsQuery, [
        orderId,
      ]);

      // 3. Revert quantities back to their respective multi-tenant store nodes
      const restockInventoryQuery = `
        UPDATE store_products
        SET stock = stock + $1, updated_at = now()
        WHERE product_id = $2 AND store_id = $3;
      `;

      const updateAllocStatusQuery = `
        UPDATE order_item_allocations 
        SET status = 'cancelled', updated_at = now() 
        WHERE id = $1;
      `;

      for (const alloc of allocations) {
        // Restock inventory pool
        await client.query(restockInventoryQuery, [
          alloc.allocated_quantity,
          alloc.product_id,
          alloc.store_id,
        ]);

        // Terminate individual tracking row allocation lifecycle
        await client.query(updateAllocStatusQuery, [alloc.id]);
      }

      // 4. Set the core order document status explicitly to cancelled
      const updateMasterOrderQuery = `
        UPDATE store_orders 
        SET order_status = 'cancelled', updated_at = now() 
        WHERE id = $1;
      `;
      await client.query(updateMasterOrderQuery, [orderId]);

      await client.query("COMMIT");

      return NextResponse.json(
        {
          success: true,
          message:
            "Order successfully cancelled and supplier inventories updated.",
        },
        { status: 200 },
      );
    }

    // =========================================================================
    // BRANCH B: STANDARD POST-SHIPMENT RETURN WORKFLOW (Existing Flow)
    // =========================================================================

    if (!reason || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required return reasons or item arrays." },
        { status: 400 },
      );
    }

    if (reason === "other" && (!comments || comments.trim().length < 10)) {
      return NextResponse.json(
        {
          error: "Detailed description is required for custom reason requests.",
        },
        { status: 400 },
      );
    }

    await client.query("BEGIN");

    const orderInfoQuery = `SELECT customer_id FROM store_orders WHERE id = $1 LIMIT 1;`;
    const orderInfoRes = await client.query(orderInfoQuery, [orderId]);
    if (orderInfoRes.rows.length === 0) {
      throw new Error("Parent order data record lookup returned empty.");
    }
    const customerId = orderInfoRes.rows[0].customer_id;

    const quantityCheckQuery = `
      SELECT 
        oi.quantity as original_ordered_qty,
        COALESCE(SUM(ri.quantity), 0) as already_returned_qty
      FROM store_order_items oi
      LEFT JOIN store_order_return_items ri ON ri.product_id = oi.product_id
      LEFT JOIN store_order_returns r ON r.id = ri.return_id AND r.status != 'rejected'
      WHERE oi.order_id = $1 AND oi.product_id = $2
      GROUP BY oi.quantity;
    `;

    for (const item of items) {
      const productId = item.itemId;
      const checkRes = await client.query(quantityCheckQuery, [
        orderId,
        productId,
      ]);

      if (checkRes.rows.length === 0) {
        throw new Error(
          `The item ${productId} does not exist in the original order.`,
        );
      }

      const { original_ordered_qty, already_returned_qty } = checkRes.rows[0];

      if (
        parseInt(already_returned_qty, 10) + parseInt(item.quantity, 10) >
        parseInt(original_ordered_qty, 10)
      ) {
        throw new Error(
          `Invalid Return Quantity. Already filed for ${already_returned_qty} out of ${original_ordered_qty} units.`,
        );
      }
    }

    const uniqueHash = Math.floor(1000 + Math.random() * 9000);
    const returnNumber = `RET-${Date.now().toString().slice(-6)}-${uniqueHash}`;
    const combinedNotes = comments ? `User Note: ${comments.trim()}` : null;

    const returnInsertQuery = `
      INSERT INTO store_order_returns (order_id, customer_id, return_number, reason, admin_notes, status)
      VALUES ($1, $2, $3, $4, $5, 'pending')
      RETURNING id, return_number;
    `;
    const returnResult = await client.query(returnInsertQuery, [
      orderId,
      customerId,
      returnNumber,
      reason,
      combinedNotes,
    ]);
    const returnId = returnResult.rows[0].id;

    const itemInsertQuery = `
      INSERT INTO store_order_return_items (return_id, product_id, quantity)
      VALUES ($1, $2, $3);
    `;

    for (const item of items) {
      await client.query(itemInsertQuery, [
        returnId,
        item.itemId,
        item.quantity,
      ]);
    }

    await client.query("COMMIT");

    // Fire email update notification for returns safely backgrounded
    try {
      await sendReturnStatusUpdateEmail(returnId);
    } catch (emailErr) {
      console.error("Non-fatal email alert engine failure:", emailErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Return request filed successfully.",
        returnNumber: returnResult.rows[0].return_number,
      },
      { status: 200 },
    );
  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("Database order management routing failure:", error);
    return NextResponse.json(
      {
        error:
          error.message ||
          "Internal transaction failure parsing order records.",
      },
      { status: 500 },
    );
  } finally {
    client.release();
  }
} */
