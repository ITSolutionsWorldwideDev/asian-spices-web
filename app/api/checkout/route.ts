// app/api/checkout/route.ts

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/core/db";
import { randomUUID } from "crypto";
import { getServerSession } from "next-auth";
import { webAuthOptions } from "@/core/auth";
import { assignNextStore } from "@/core/order-routing";
import { MIN_ORDER_AMOUNT_EUR } from "@/lib/pricing";

export async function POST(req: NextRequest) {
  // const store_id = randomUUID();

  const store_id = null;
  const client = await pool.connect();

  const session = await getServerSession(webAuthOptions);
  const userId = session?.user?.id || null;
  const userEmail = session?.user?.email || null;

  try {
    const body = await req.json();

    const {
      customer,
      shippingAddress,
      cartItems,
      pricing,
      // store_id,
    } = body;

    if (!cartItems?.length) {
      return NextResponse.json(
        { success: false, error: "Cart is empty", code: "EMPTY_CART" },
        { status: 400 },
      );
    }

    const merchandiseSubtotalEur = cartItems.reduce(
      (
        sum: number,
        item: { base_price?: number; price?: number; quantity?: number },
      ) => {
        const unit = Number(item.base_price ?? item.price ?? 0);
        const qty = Number(item.quantity ?? 1);
        return sum + unit * qty;
      },
      0,
    );

    if (merchandiseSubtotalEur < MIN_ORDER_AMOUNT_EUR) {
      return NextResponse.json(
        {
          success: false,
          error: `Minimum order amount is €${MIN_ORDER_AMOUNT_EUR.toFixed(2)}. Please add more items to your cart.`,
          code: "MIN_ORDER_AMOUNT",
        },
        { status: 400 },
      );
    }

    const email = userId ? userEmail : customer.email;

    await client.query("BEGIN");

    let customer_id: string;

    // 1️⃣ If logged in → try to find existing customer
    if (userId) {
      const existingCustomer = await client.query(
        `SELECT id FROM customers WHERE user_id = $1 LIMIT 1`,
        [userId],
      );

      if (existingCustomer.rowCount) {
        customer_id = existingCustomer.rows[0].id;
      } else {
        const result = await client.query(
          `INSERT INTO customers (user_id, email, first_name, last_name, phone)
          VALUES ($1,$2,$3,$4,$5)
          RETURNING id`,
          [
            userId,
            email,
            customer.firstName,
            customer.lastName,
            customer.phone,
          ],
        );

        customer_id = result.rows[0].id;
      }

      // 🔥 assign CUSTOMER role
      await client.query(
        `INSERT INTO store_users (user_id, store_id, role_id)
          SELECT $1, $2, id FROM roles 
          WHERE key = 'customer'
          AND NOT EXISTS (
            SELECT 1 FROM store_users 
            WHERE user_id = $1 AND store_id = $2
          )`,
        [userId, store_id],
      );
    } else {
      // ✅ GUEST FLOW
      const customerResult = await client.query(
        `INSERT INTO store_customers 
          (store_id, first_name, last_name, email, phone, city, postcode)
          VALUES ($1,$2,$3,$4,$5,$6,$7)
          RETURNING id`,
        [
          store_id,
          customer.firstName,
          customer.lastName,
          email,
          customer.phone,
          shippingAddress.city,
          shippingAddress.zip,
        ],
      );

      customer_id = customerResult.rows[0].id;

      const userCheck = await client.query(
        `SELECT id FROM users WHERE email = $1`,
        [email],
      );

      if (userCheck.rowCount === 0) {
        const bcrypt = require("bcryptjs");
        const tempPassword = Math.random().toString(36).slice(-8);

        const hash = await bcrypt.hash(tempPassword, 10);

        const newUser = await client.query(
          `INSERT INTO users (email, password_hash)
          VALUES ($1,$2)
          RETURNING id`,
          [email, hash],
        );

        const newUserId = newUser.rows[0].id;

        // link customer
        await client.query(
          `UPDATE store_customers SET user_id = $1 WHERE id = $2`,
          [newUserId, customer_id],
        );

        // assign role
        await client.query(
          `INSERT INTO store_users (user_id, store_id, role_id)
            SELECT $1, $2, id FROM roles 
            WHERE key = 'customer'
            AND NOT EXISTS (
              SELECT 1 FROM store_users 
              WHERE user_id = $1 AND store_id = $2
            )`,
          [newUserId, store_id],
        );
      }
    }

    // 2️⃣ Insert Address
    await client.query(
      `
      INSERT INTO store_customer_addresses(
        store_id,
        customer_id,
        label, 
        address_line1, 
        address_line2, 
        city, 
        state, 
        postal_code, 
        country
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      `,
      [
        store_id,
        customer_id,
        "Home",
        shippingAddress.address_line1,
        shippingAddress.appartment,
        shippingAddress.city,
        shippingAddress.state,
        shippingAddress.zip,
        shippingAddress.country,
      ],
    );

    // 3️⃣ Create Order
    const orderResult = await client.query(
      `
      INSERT INTO store_orders
      ( 
        store_id,
        order_number,
        customer_id,
        customer_email, 
        subtotal,
        discount_amount,
        shipping_amount,
        tax_amount,
        total_amount
       )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING id
      `,
      [
        store_id,
        `ORD-${Date.now()}`,
        customer_id,
        email,
        pricing.subtotal,
        pricing.discount,
        pricing.shipping,
        pricing.tax_amount || pricing.tax || 0,
        pricing.total,
      ],
    );

    const order_id = orderResult.rows[0].id;

    // 4️⃣ Insert Order Items

    const taxRulesResult = await client.query(
      `SELECT category_id, tax_rate FROM platform_tax_rules`,
    );
    const taxRules = taxRulesResult.rows;

    const globalRule = taxRules.find((r) => r.category_id === null);
    const globalRate = globalRule
      ? parseFloat(globalRule.tax_rate) / 100
      : 0.21;

    for (const item of cartItems) {
      const base_price = Number(item.base_price || 0);
      const quantity = Number(item.quantity || 1);
      const itemGrossTotal = base_price * quantity;

      const matchingRule = taxRules.find(
        (r) => r.category_id === item.category_id,
      );
      const activeRate = matchingRule
        ? parseFloat(matchingRule.tax_rate) / 100
        : globalRate;
      const extractedTaxAmount =
        itemGrossTotal - itemGrossTotal / (1 + activeRate);

      await client.query(
        `
        INSERT INTO store_order_items
        (
          order_id, 
          product_id, 
          quantity, 
          price,
          exchange_rate,
          tax_rate,
          tax_amount
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        `,
        [
          order_id,
          item.id,
          quantity,
          base_price,
          Number(item.exchange_rate ?? 1.0),
          activeRate,
          extractedTaxAmount,
        ],
      );
    }

    await assignNextStore(client, order_id);

    const { rows } = await client.query(
      `SELECT current_store_id FROM store_orders WHERE id = $1`,
      [order_id],
    );

    const new_store_id = rows[0].current_store_id;

    await client.query(
      `
      INSERT INTO store_customers 
      (store_id, user_id, first_name, last_name, email, phone, city, postcode)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      ON CONFLICT (store_id, user_id)
      DO NOTHING
      `,
      [
        new_store_id,
        userId,
        customer.firstName,
        customer.lastName,
        email,
        customer.phone,
        shippingAddress.city,
        shippingAddress.zip,
      ],
    );

    await client.query(
      `
      INSERT INTO store_users (user_id, store_id, role_id)
      SELECT $1, $2, id FROM roles 
      WHERE key = 'customer'
      ON CONFLICT (store_id, user_id) DO NOTHING
      `,
      [userId, new_store_id],
    );

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      order_id,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);

    return NextResponse.json(
      { success: false, error: "Checkout failed" },
      { status: 500 },
    );
  } finally {
    client.release();
  }
}

// const existingCustomer: any = await client.query(
//   `SELECT id FROM store_customers
//     WHERE user_id = $1 LIMIT 1`,
//   [userId],
// );

// if (existingCustomer.rowCount > 0) {
//   customer_id = existingCustomer.rows[0].id;
// } else {
//   // create new linked customer
//   const result = await client.query(
//     `INSERT INTO store_customers
//     (store_id, user_id, first_name, last_name, email, phone, city, postcode)
//     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
//     RETURNING id`,
//     [
//       store_id,
//       userId,
//       customer.firstName,
//       customer.lastName,
//       email,
//       customer.phone,
//       shippingAddress.city,
//       shippingAddress.zip,
//     ],
//   );

//   customer_id = result.rows[0].id;
// }
