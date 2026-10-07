// core/email-templates.ts

import fs from "fs";
import path from "path";
import { pool } from "./db";
import { sendEmail } from "./email";
import {
  generatePartnerVerificationEmailHtml,
  generatePartnerVerificationEmailText,
} from "./partner-email-template";

/**
 * Feature flag for the customer confirmation email when the Contact Us form is submitted.
 * - Set to `true`: Temporarily sends the Dutch "Partner Verification Email" (Welkom als goedgekeurde partner).
 * - Set to `false`: Reverts back to the standard "We've Received Your Message" confirmation email.
 * Note: The admin notification to support@asianspices.online is ALWAYS preserved and sent regardless of this flag.
 */
export const USE_TEMP_PARTNER_CONFIRMATION_EMAIL = false;

// Map delivery expectations contextually
const DELIVERY_DAYS_MAP: Record<string, string> = {
  "Standard Shipping": "3 - 5 business days",
  "Express Shipping": "1 - 2 business days",
  "Overnight Shipping": "Next business day",
};

interface PartnerOnboardingEmailOptions {
  email: string;
  companyName: string;
  firstName: string;
  applicationId: string;
}

interface PasswordResetEmailOptions {
  email: string;
  otp: string;
}

interface GuestAccountCreatedEmailOptions {
  email: string;
  password: string;
  firstName?: string;
}

interface ContactFormEmailOptions {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendOrderConfirmationEmail(orderId: string, customClient?: any) {
  const db = customClient || pool;
  try {
    // 1️⃣ Fetch complete payload variables for the email (with fallback to linked customer/user profiles)
    const orderQuery = await db.query(
      `SELECT 
         o.id,
         o.order_number, 
         COALESCE(
           NULLIF(TRIM(o.customer_email), ''), 
           NULLIF(TRIM(c.email), ''), 
           NULLIF(TRIM(u.email), '')
         ) AS customer_email, 
         o.total_amount, 
         o.shipping_provider, 
         o.shipping_city,
         (
           SELECT metadata->>'guest_temp_password'
           FROM order_events
           WHERE order_id = o.id AND event_type = 'created'
           LIMIT 1
         ) AS guest_temp_password
       FROM store_orders o
       LEFT JOIN store_customers c ON o.customer_id = c.id
       LEFT JOIN users u ON c.user_id = u.id
       WHERE o.id = $1`,
      [orderId],
    );

    if (orderQuery.rowCount === 0)
      return { success: false, error: "Order context missing" };

    const order = orderQuery.rows[0];
    const recipientEmail = order.customer_email?.trim();

    if (!recipientEmail) {
      console.error(`[Email Skipped] Order ${orderId} has no customer_email in store_orders or customer records`);
      return { success: false, error: "customer_email is null or missing" };
    }

    // Ensure store_orders.customer_email is backfilled if it was previously empty
    await db.query(
      `UPDATE store_orders SET customer_email = $1 WHERE id = $2 AND (customer_email IS NULL OR TRIM(customer_email) = '')`,
      [recipientEmail, orderId],
    ).catch(() => { });

    const deliveryWindow =
      DELIVERY_DAYS_MAP[order.shipping_provider] || "3 - 5 business days";

    const guestPassword = order.guest_temp_password?.trim() || null;
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://asianspices.online";
    const loginUrl = `${siteUrl.replace(/\/$/, "")}/login`;

    // 2️⃣ Build modern HTML Email Structure
    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #f0f0f0; padding: 20px; border-radius: 12px;">
        <h2 style="color: #ea580c; text-align: center;">Your Flavorful Journey Begins!</h2>
        <p>Hello,</p>
        <p>Thank you for shopping with <strong>Asian Spices</strong>. We are thrilled to confirm that your payment has been processed and your order is officially locked in.</p>
        
        <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0 0 8px 0;"><strong>Order Number:</strong> ${order.order_number}</p>
          <p style="margin: 0 0 8px 0;"><strong>Amount Paid:</strong> €${Number(order.total_amount).toFixed(2)}</p>
          <p style="margin: 0 0 8px 0;"><strong>Shipping Choice:</strong> ${order.shipping_provider}</p>
          <p style="margin: 0;"><strong>Estimated Delivery:</strong> ${deliveryWindow}</p>
        </div>

        ${guestPassword
        ? `
        <div style="background-color: #fff7ed; border: 1px solid #fed7aa; padding: 18px; border-radius: 10px; margin: 20px 0;">
          <h3 style="color: #ea580c; margin: 0 0 8px 0; font-size: 16px;">🎉 Your Asian Spices Account Has Been Created!</h3>
          <p style="margin: 0 0 12px 0; color: #4b5563; font-size: 14px; line-height: 1.5;">
            An <strong>Asian Spices</strong> account has been automatically created for you so you can easily track your order, view order history, and reorder anytime.
          </p>
          <div style="background-color: #ffffff; border: 1px solid #fed7aa; padding: 12px 16px; border-radius: 8px; font-size: 14px;">
            <p style="margin: 0 0 6px 0; color: #1f2937;"><strong>Email:</strong> ${escapeEmailText(recipientEmail)}</p>
            <p style="margin: 0; color: #1f2937;"><strong>Your Password:</strong> <code style="font-size: 16px; color: #ea580c; font-weight: 700; background: #fff1e6; padding: 2px 8px; border-radius: 4px;">${escapeEmailText(guestPassword)}</code></p>
          </div>
          <div style="text-align: center; margin-top: 16px;">
            <a href="${loginUrl}" style="display: inline-block; background-color: #ea580c; color: #ffffff; text-decoration: none; padding: 10px 22px; border-radius: 9999px; font-weight: 700; font-size: 13px;">
              Log in to your account
            </a>
          </div>
          <p style="margin: 10px 0 0 0; font-size: 12px; color: #6b7280; text-align: center;">
            For your security, please update your password after logging in.
          </p>
        </div>
            `
        : ""
      }

        <p>Our team is currently preparing your parcel for selection and dynamic routing. Once your tracking code registers out of the hub for delivery to <strong>${order.shipping_city}</strong>, we'll send a follow-up link immediately.</p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;" />
        <p style="font-size: 12px; color: #6b7280; text-align: center;">
          © 2026 Asian Spices Online. All rights reserved.<br>
          Need support? Reply directly to this thread or contact us via support@asianspices.online
        </p>
      </div>
    `;

    // 3️⃣ Dispatch (try "order" profile, fallback to "support" if SMTP rejects)
    try {
      await sendEmail({
        to: recipientEmail,
        bcc: ["sales@asianspices.online", "order@asianspices.online", "cheila.lopes@itsolutionshub2010.com", "ahmed.mehmood@itsolutionshub2010.com", "zraja@itsolutionsworldwide.com", "sdevi@itsolutionsworldwide.com", "ahmad.raza@itsolutionsworldwide.com"],
        subject: `Order Confirmed! 🎉 (Ref: ${order.order_number})`,
        html: emailHtml,
        fromAccount: "order",
      });
    } catch (orderProfileError) {
      console.warn("Order confirmation failed via 'order' profile, falling back to 'support' profile:", orderProfileError);
      await sendEmail({
        to: recipientEmail,
        bcc: ["sales@asianspices.online", "order@asianspices.online", "cheila.lopes@itsolutionshub2010.com", "ahmed.mehmood@itsolutionshub2010.com", "zraja@itsolutionsworldwide.com", "sdevi@itsolutionsworldwide.com", "ahmad.raza@itsolutionsworldwide.com"],
        subject: `Order Confirmed! 🎉 (Ref: ${order.order_number})`,
        html: emailHtml,
        fromAccount: "support",
      });
    }

    return { success: true };
  } catch (error) {
    console.error(
      "Error generating or dispatching order email template:",
      error,
    );
    return { success: false, error };
  }
}

function escapeEmailText(value: string) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendCancellationEmail(
  orderId: string,
  refundStatus?: string,
  reason?: string,
  comments?: string,
  amounts?: {
    orderTotal: number;
    refundAmount: number;
    subtotal?: number;
    shippingAmount?: number;
    taxAmount?: number;
  },
) {
  try {
    const orderQuery = await pool.query(
      `SELECT order_number, customer_email, total_amount, subtotal, shipping_amount, tax_amount, shipping_provider, payment_status
       FROM store_orders WHERE id = $1`,
      [orderId],
    );

    if (orderQuery.rowCount === 0) {
      return { success: false, error: "Order context missing" };
    }

    const order = orderQuery.rows[0];
    if (!order.customer_email) {
      return { success: false, error: "Customer email missing" };
    }

    const safeReason = escapeEmailText(reason || "Not specified");
    const safeComments = comments?.trim()
      ? escapeEmailText(comments.trim())
      : "";

    const orderSubtotal = Number(
      amounts?.subtotal ?? order.subtotal ?? 0,
    );
    const orderShipping = Number(
      amounts?.shippingAmount ?? order.shipping_amount ?? 0,
    );
    const orderTax = Number(amounts?.taxAmount ?? order.tax_amount ?? 0);
    const orderTotal = Number(
      amounts?.orderTotal ?? order.total_amount ?? 0,
    );
    const refundAmount = Number(amounts?.refundAmount ?? orderTotal);

    const fmt = (value: number) => `€${value.toFixed(2)}`;

    const refundNote =
      refundStatus === "Refund Successful"
        ? `A refund of ${fmt(refundAmount)} has been initiated to your original payment method. Please allow a few business days for it to appear.`
        : refundStatus === "No Refund Needed"
          ? "No payment was collected for this order, so no refund is required."
          : "If a payment was taken, our team will review the refund and follow up if needed.";

    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #f0f0f0; padding: 20px; border-radius: 12px;">
        <h2 style="color: #ea580c; text-align: center;">Order Cancelled</h2>
        <p>Hello,</p>
        <p>Your order with <strong>Asian Spices</strong> has been cancelled as requested. This message confirms that the cancellation is complete.</p>

        <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0 0 8px 0;"><strong>Order Number:</strong> ${escapeEmailText(order.order_number)}</p>
          <p style="margin: 0 0 8px 0;"><strong>Subtotal:</strong> ${fmt(orderSubtotal)}</p>
          <p style="margin: 0 0 8px 0;"><strong>Shipping:</strong> ${fmt(orderShipping)}</p>
          <p style="margin: 0 0 8px 0;"><strong>Tax:</strong> ${fmt(orderTax)}</p>
          <p style="margin: 0 0 8px 0;"><strong>Order Total:</strong> ${fmt(orderTotal)}</p>
          <p style="margin: 0 0 8px 0;"><strong>Refund Amount:</strong> ${fmt(refundAmount)}</p>
          <p style="margin: 0 0 8px 0;"><strong>Shipping Method:</strong> ${escapeEmailText(order.shipping_provider || "—")}</p>
          <p style="margin: 0 0 8px 0;"><strong>Cancellation Reason:</strong> ${safeReason}</p>
          ${safeComments
        ? `<p style="margin: 0;"><strong>Comments:</strong> ${safeComments}</p>`
        : ""
      }
        </div>

        <p>${refundNote}</p>
        <p>If you did not request this cancellation, or if you have any questions, reply to this email or contact us at support@asianspices.online.</p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;" />
        <p style="font-size: 12px; color: #6b7280; text-align: center;">
          © 2026 Asian Spices Online. All rights reserved.<br>
          Need support? Contact us via support@asianspices.online
        </p>
      </div>
    `;

    await sendEmail({
      to: order.customer_email,
      cc: [
        "sales@asianspices.online",
        "order@asianspices.online",
        "cheila.lopes@itsolutionshub2010.com",
        "ahmed.mehmood@itsolutionshub2010.com",
        "zraja@itsolutionsworldwide.com",
        "sdevi@itsolutionsworldwide.com",
      ],
      subject: `Order Cancelled (Ref: ${order.order_number})`,
      html: emailHtml,
      fromAccount: "order",
    });

    return { success: true };
  } catch (error) {
    console.error(
      `[Cancellation Email Dispatch Failure] Order ID: ${orderId}`,
      error,
    );
    return { success: false, error };
  }
}

export async function sendPartnerRegistrationEmail({
  email,
  companyName,
  firstName,
  applicationId,
}: PartnerOnboardingEmailOptions) {
  try {
    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; padding: 25px; border-radius: 12px; color: #1f2937;">
        <h2 style="color: #ea580c; text-align: center; margin-bottom: 20px;">Partner Application Received!</h2>
        <p>Dear ${firstName},</p>
        <p>Thank you for submitting your partner store application to join the <strong>Asian Spices</strong> merchant network. We are excited about the prospect of working together to expand your reach.</p>
        
        <p>Your application is currently under review by our super admin onboarding team. You can track the progress of your onboarding file using your unique application ID below:</p>
        
        <div style="background-color: #f9fafb; border-left: 4px solid #ea580c; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0 0 6px 0; font-size: 14px; color: #4b5563;"><strong>Company Name:</strong> ${companyName}</p>
          <p style="margin: 0; font-size: 16px; color: #111827;"><strong>Application Tracking ID:</strong> <code style="background-color: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-weight: bold; color: #ea580c;">${applicationId}</code></p>
        </div>

        <p><strong>What happens next?</strong></p>
        <ul style="padding-left: 20px; line-height: 1.6;">
          <li>Our operations desk will verify your KVK and Chamber of Commerce filings.</li>
          <li>We will check your location parameters to determine optimal localized delivery zones.</li>
          <li>Once approved, you will receive credentials to access your dedicated store manager application portal.</li>
        </ul>

        <p style="margin-top: 25px;">If you have any immediate questions regarding your application compliance documents, please reply directly to this message.</p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;" />
        <p style="font-size: 12px; color: #6b7280; text-align: center; margin: 0;">
          © 2026 Asian Spices Merchant Network. All rights reserved.<br>
          This is an automated tracking update from your vendor portal.
        </p>
      </div>
    `;

    await sendEmail({
      to: email,
      cc: ["ahmed.mehmood@itsolutionshub2010.com", "zraja@itsolutionsworldwide.com", "sdevi@itsolutionsworldwide.com"],
      subject: `Your Asian Spices Partner Application - ${applicationId}`,
      html: emailHtml,
      fromAccount: "partners",
    });

    return { success: true };
  } catch (error) {
    console.error(
      `[Partner Email Dispatch Failure] Application ID: ${applicationId}`,
      error,
    );
    return { success: false, error };
  }
}

// Add this alongside your existing functions in core/email-templates.ts

export async function sendReturnStatusUpdateEmail(returnId: string) {
  try {
    // 1️⃣ Fetch complete payload variables for the tracking event
    const returnQuery = await pool.query(
      `SELECT 
        r.id as return_id,
        r.return_number,
        r.status as return_status,
        r.reason as return_reason,
        r.admin_notes,
        o.order_number,
        o.customer_email,
        COALESCE(o.shipping_city, 'your location') as shipping_city,
        json_agg(
          json_build_object(
            'name', p.name,
            'quantity', ri.quantity
          )
        ) as return_items
       FROM store_order_returns r
       JOIN store_orders o ON o.id = r.order_id
       JOIN store_order_return_items ri ON ri.return_id = r.id
       JOIN products p ON p.id = ri.product_id
       WHERE r.id = $1
       GROUP BY r.id, o.order_number, o.customer_email, o.shipping_city;`,
      [returnId],
    );

    if (returnQuery.rowCount === 0) {
      return { success: false, error: "Return event context missing" };
    }

    const data = returnQuery.rows[0];
    const status = data.return_status;

    // 2️⃣ Define Context Variables Based on Current Workflow Status
    let statusLabel = "";
    let statusColor = "#ea580c"; // Default Orange
    let heroMessage = "";
    let introductionText = "";
    let instructionalBlock = "";

    switch (status) {
      case "pending":
        statusLabel = "Return Request Received";
        statusColor = "#d97706"; // Amber
        heroMessage = "We've Logged Your Request";
        introductionText = `We have received your return request for order <strong>#${data.order_number}</strong>. Our backend operations desk is currently auditing the details.`;
        instructionalBlock = `
          <div style="background-color: #fffbeb; border-left: 4px solid #d97706; padding: 15px; border-radius: 6px; margin: 20px 0; font-size: 14px; color: #b45309;">
            <strong>What's next?</strong> You don't need to do anything yet! We will notify you via email as soon as a platform admin reviews and approves your shipping arrangements.
          </div>
        `;
        break;

      case "approved":
        statusLabel = "Return Approved & Routed";
        statusColor = "#2563eb"; // Blue
        heroMessage = "Your Return is Approved!";
        introductionText = `Great news! Your return request under reference <strong>${data.return_number}</strong> has been approved. The individual fulfillment stores are prepared for your arrival package.`;
        instructionalBlock = `
          <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 15px; border-radius: 6px; margin: 20px 0; font-size: 14px; color: #1d4ed8;">
            <strong>Shipping Instructions:</strong><br>
            1. Package the items safely with their original tags and container cards.<br>
            2. Drop your parcel off at your closest regional transit point or courier box.<br>
            3. Use the return identification voucher token inside your user profile dashboard.
          </div>
        `;
        break;

      case "rejected":
        statusLabel = "Return Request Declined";
        statusColor = "#dc2626"; // Red
        heroMessage = "Update on Your Return Request";
        introductionText = `We are writing to let you know that your return request for order <strong>#${data.order_number}</strong> could not be approved at this time.`;

        const noteExcerpt = data.admin_notes
          ? `<p style="margin: 5px 0 0 0; font-style: italic;">"${data.admin_notes}"</p>`
          : `<p style="margin: 5px 0 0 0;">Please check your dashboard for additional details.</p>`;
        instructionalBlock = `
          <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; border-radius: 6px; margin: 20px 0; font-size: 14px; color: #991b1b;">
            <strong>Review Reason Given:</strong>
            ${noteExcerpt}
          </div>
        `;
        break;

      case "item_received":
        statusLabel = "Items Safely Returned";
        statusColor = "#16a34a"; // Green
        heroMessage = "Parcel Received & Verified!";
        introductionText = `We've successfully verified the delivery of your package for return reference <strong>${data.return_number}</strong> back at our fulfillment desks.`;
        instructionalBlock = `
          <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 15px; border-radius: 6px; margin: 20px 0; font-size: 14px; color: #166534;">
            <strong>Next Steps:</strong> Our finance pipeline has been flagged automatically. A credit reconciliation transfer for these items will settle back into your original account wallet configuration within 3-5 business days.
          </div>
        `;
        break;

      default:
        statusLabel = `Return Status Update: ${status}`;
        heroMessage = "Return Progress Alert";
        introductionText = `Your return file status update progress indicator has moved to: <strong>${status}</strong>.`;
    }

    // 3️⃣ Construct Dynamic Line-Item Rows
    let itemsTableRows = "";
    if (Array.isArray(data.return_items)) {
      data.return_items.forEach((item: any) => {
        itemsTableRows += `
          <tr>
            <td style="padding: 10px 0; border-b: 1px solid #f3f4f6; color: #374151;">${item.name}</td>
            <td style="padding: 10px 0; border-b: 1px solid #f3f4f6; text-align: right; color: #111827; font-weight: bold;">${item.quantity}x</td>
          </tr>
        `;
      });
    }

    // 4️⃣ Build the HTML Layout
    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; padding: 25px; border-radius: 12px; color: #1f2937; line-height: 1.5;">
        <div style="text-align: center; margin-bottom: 20px;">
          <span style="background-color: ${statusColor}15; color: ${statusColor}; px-3; py-1; border-radius: 9999px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; padding: 6px 14px; display: inline-block; border: 1px solid ${statusColor}30;">
            ${statusLabel}
          </span>
        </div>
        
        <h2 style="color: #111827; text-align: center; margin-top: 10px; margin-bottom: 20px; font-size: 24px; font-weight: 800; tracking-tight: -0.025em;">
          ${heroMessage}
        </h2>
        
        <p style="color: #4b5563; font-size: 15px;">Hello,</p>
        <p style="color: #4b5563; font-size: 15px;">${introductionText}</p>
        
        ${instructionalBlock}

        <div style="margin-top: 25px; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px 20px; background-color: #fafafa;">
          <h4 style="margin: 0 0 12px 0; color: #111827; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Filing Manifest Details</h4>
          <p style="margin: 0 0 6px 0; font-size: 13px; color: #6b7280;">Return Token: <span style="font-family: monospace; font-weight: bold; color: #111827;">${data.return_number}</span></p>
          <p style="margin: 0 0 12px 0; font-size: 13px; color: #6b7280;">Stated Reason: <span style="color: #111827; font-medium">${data.return_reason}</span></p>
          
          <table style="w-full; border-collapse: collapse; font-size: 14px; width: 100%; border-top: 1px dashed #e5e7eb; margin-top: 10px;">
            <thead>
              <tr>
                <th style="text-align: left; padding: 10px 0; color: #6b7280; font-weight: 500; font-size: 12px;">Product Title</th>
                <th style="text-align: right; padding: 10px 0; color: #6b7280; font-weight: 500; font-size: 12px;">Qty</th>
              </tr>
            </thead>
            <tbody>
              ${itemsTableRows}
            </tbody>
          </table>
        </div>

        <p style="margin-top: 25px; font-size: 14px; color: #6b7280;">
          If you have any questions or require modifications regarding this reverse dispatch, please reply to this support message thread.
        </p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;" />
        <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0;">
          © 2026 Asian Spices Operations Hub. All rights reserved.<br>
          Automated processing trace notification update pipeline context.
        </p>
      </div>
    `;

    // 5️⃣ Dispatch to Customer via SMTP
    await sendEmail({
      to: data.customer_email,
      cc: ["sales@asianspices.online", "order@asianspices.online"],
      subject: `[${statusLabel}] Return Update Ref: ${data.return_number}`,
      html: emailHtml,
      fromAccount: "order",
    });

    return { success: true };
  } catch (error) {
    console.error(
      `[Return Email Dispatch Crash] Identifier Reference: ${returnId}`,
      error,
    );
    return { success: false, error };
  }
}


export async function sendPasswordResetEmail({ email, otp }: PasswordResetEmailOptions) {
  const emailHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; padding: 25px; border-radius: 12px; color: #1f2937; line-height: 1.6;">
      <div style="text-align: center; margin-bottom: 20px;">
        <span style="background-color: #ea580c15; color: #ea580c; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; padding: 6px 14px; display: inline-block; border-radius: 9999px; border: 1px solid #ea580c30;">
          Account Verification
        </span>
      </div>

      <h2 style="color: #111827; text-align: center; margin-top: 10px; margin-bottom: 20px; font-size: 24px; font-weight: 800;">
        Your Verification Code
      </h2>

      <p>Hello,</p>
      <p>We received a request to update access for your <strong>Asian Spices</strong> account. Use this verification code on the reset password page:</p>

      <div style="text-align: center; margin: 30px 0;">
        <span style="display: inline-block; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px 28px; font-size: 32px; font-weight: 800; letter-spacing: 0.35em; color: #ea580c;">
          ${otp}
        </span>
      </div>

      <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0; font-size: 13px; color: #4b5563;">
        <p style="margin: 0 0 8px 0;">This code expires in 15 minutes.</p>
        <p style="margin: 0;">Go to the Asian Spices website, open <strong>Reset Password</strong>, and enter your email with this code.</p>
      </div>

      <p style="font-size: 14px; color: #6b7280; margin-top: 25px;">
        If you didn't request this, you can ignore this email — your password won't be changed.
      </p>

      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;" />
      <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0;">
        © 2026 Asian Spices Online. All rights reserved.<br>
        Need help? Contact us at support@asianspices.online
      </p>
    </div>
  `;

  const emailText = `Your Asian Spices verification code

We received a request to update access for your Asian Spices account.

Your verification code: ${otp}

This code expires in 15 minutes.

Go to the Asian Spices website, open Reset Password, and enter your email with this code.

If you didn't request this, you can ignore this email — your password won't be changed.

Need help? Contact us at support@asianspices.online
© 2026 Asian Spices Online. All rights reserved.`;

  try {
    await sendEmail({
      to: email,
      subject: "Your Asian Spices verification code",
      html: emailHtml,
      text: emailText,
      fromAccount: "support",
    });

    return { success: true };
  } catch (error) {
    console.error(`[Password Reset Email Fail] Target recipient: ${email}`, error);
    return { success: false, error };
  }
}

export async function sendGuestAccountCreatedEmail({
  email,
  password,
  firstName,
}: GuestAccountCreatedEmailOptions) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://asianspices.online";
  const loginUrl = `${siteUrl.replace(/\/$/, "")}/login`;
  const greeting = firstName?.trim() ? `Hello ${firstName.trim()},` : "Hello,";

  const emailHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; padding: 25px; border-radius: 12px; color: #1f2937; line-height: 1.6;">
      <div style="text-align: center; margin-bottom: 20px;">
        <span style="background-color: #ea580c15; color: #ea580c; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; padding: 6px 14px; display: inline-block; border-radius: 9999px; border: 1px solid #ea580c30;">
          Account Created
        </span>
      </div>

      <h2 style="color: #111827; text-align: center; margin-top: 10px; margin-bottom: 20px; font-size: 24px; font-weight: 800;">
        Your Asian Spices Account
      </h2>

      <p>${greeting}</p>
      <p>Thanks for your order! We created an <strong>Asian Spices</strong> account for you so you can track orders and reorder easily.</p>

      <div style="background-color: #f9fafb; padding: 16px; border-radius: 8px; margin: 20px 0; font-size: 14px; color: #4b5563;">
        <p style="margin: 0 0 8px 0;"><strong>Email:</strong> ${email}</p>
        <p style="margin: 0;"><strong>Temporary password:</strong> <code style="font-size: 16px; color: #ea580c; font-weight: 700;">${password}</code></p>
      </div>

      <p style="text-align: center; margin: 28px 0;">
        <a href="${loginUrl}" style="display: inline-block; background-color: #ea580c; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 9999px; font-weight: 700;">
          Log in to your account
        </a>
      </p>

      <p style="font-size: 14px; color: #6b7280;">
        For security, please change this password after you log in.
      </p>

      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;" />
      <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0;">
        © 2026 Asian Spices Online. All rights reserved.<br>
        Need help? Contact us at support@asianspices.online
      </p>
    </div>
  `;

  const emailText = `Your Asian Spices account

${greeting}

Thanks for your order! We created an Asian Spices account for you so you can track orders and reorder easily.

Email: ${email}
Temporary password: ${password}

Log in: ${loginUrl}

For security, please change this password after you log in.

Need help? Contact us at support@asianspices.online
© 2026 Asian Spices Online. All rights reserved.`;

  try {
    await sendEmail({
      to: email,
      subject: "Your Asian Spices account has been created",
      html: emailHtml,
      text: emailText,
      fromAccount: "support",
    });

    return { success: true };
  } catch (error) {
    console.error(
      `[Guest Account Email Fail] Target recipient: ${email}`,
      error,
    );
    return { success: false, error };
  }
}

interface AccountWelcomeEmailOptions {
  email: string;
  name?: string;
}

export async function sendAccountWelcomeEmail({
  email,
  name,
}: AccountWelcomeEmailOptions) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://asianspices.online";
  const loginUrl = `${siteUrl.replace(/\/$/, "")}/login`;
  const safeName = name?.trim() ? escapeEmailText(name.trim()) : "";
  const greeting = safeName ? `Hello ${safeName},` : "Hello,";

  const emailHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; padding: 25px; border-radius: 12px; color: #1f2937; line-height: 1.6;">
      <div style="text-align: center; margin-bottom: 20px;">
        <span style="background-color: #ea580c15; color: #ea580c; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; padding: 6px 14px; display: inline-block; border-radius: 9999px; border: 1px solid #ea580c30;">
          Welcome to Asian Spices
        </span>
      </div>

      <h2 style="color: #111827; text-align: center; margin-top: 10px; margin-bottom: 20px; font-size: 24px; font-weight: 800;">
        Your Account Has Been Created!
      </h2>

      <p>${greeting}</p>
      <p>Welcome to <strong>Asian Spices</strong>! Your account has been successfully created. We are thrilled to have you join our community and look forward to bringing authentic Asian flavors straight to your doorstep.</p>

      <div style="background-color: #f9fafb; padding: 16px; border-radius: 8px; margin: 20px 0; font-size: 14px; color: #4b5563;">
        <p style="margin: 0 0 8px 0;"><strong>Registered Email:</strong> ${escapeEmailText(email)}</p>
        <p style="margin: 0;">You can now log in anytime to track your orders, manage saved delivery addresses, and enjoy faster checkout.</p>
      </div>

      <div style="text-align: center; margin: 28px 0;">
        <a href="${loginUrl}" style="display: inline-block; background-color: #ea580c; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 9999px; font-weight: 700; font-size: 14px;">
          Log In to Asian Spices
        </a>
      </div>

      <p style="font-size: 14px; color: #6b7280;">
        If you have any questions or need help with your account, please reply directly to this email or contact us at support@asianspices.online.
      </p>

      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;" />
      <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0;">
        © 2026 Asian Spices Online. All rights reserved.<br>
        Need help? Contact us at support@asianspices.online
      </p>
    </div>
  `;

  const emailText = `Welcome to Asian Spices!

${greeting}

Your account has been created in Asian Spices.

Registered Email: ${email}
Log In: ${loginUrl}

You can now log in anytime to track your orders, save delivery addresses, and enjoy faster checkout.

Need help? Contact us at support@asianspices.online
© 2026 Asian Spices Online. All rights reserved.`;

  try {
    await sendEmail({
      to: email,
      subject: "Your Asian Spices account has been created 🎉",
      html: emailHtml,
      text: emailText,
      fromAccount: "support",
    });

    return { success: true };
  } catch (error) {
    console.error(
      `[Account Welcome Email Fail] Target recipient: ${email}`,
      error,
    );
    return { success: false, error };
  }
}

export async function sendContactFormEmail({
  fullName,
  email,
  subject,
  message,
}: ContactFormEmailOptions) {
  try {
    const safeName = escapeEmailText(fullName);
    const safeEmail = escapeEmailText(email);
    const safeSubject = escapeEmailText(subject);
    const safeMessage = escapeEmailText(message);

    const notificationHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; padding: 25px; border-radius: 12px; color: #1f2937; line-height: 1.6;">
        <h2 style="color: #111827; margin-top: 0; margin-bottom: 8px; font-size: 20px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em;">
          NEW CONTACT FORM SUBMISSION
        </h2>
        <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 14px; line-height: 1.5;">
          A new message has been submitted through the Asian Spices website contact form.
        </p>

        <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 12px 0; font-size: 13px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">
            CUSTOMER DETAILS
          </h3>
          <p style="margin: 0 0 10px 0; font-size: 14px; color: #111827;">
            <strong style="color: #4b5563; display: block; font-size: 12px; text-transform: uppercase; margin-bottom: 2px;">Name:</strong>
            ${safeName}
          </p>
          <p style="margin: 0 0 10px 0; font-size: 14px; color: #111827;">
            <strong style="color: #4b5563; display: block; font-size: 12px; text-transform: uppercase; margin-bottom: 2px;">Email:</strong>
            <a href="mailto:${safeEmail}" style="color: #ea580c; text-decoration: underline;">${safeEmail}</a>
          </p>
          <p style="margin: 0; font-size: 14px; color: #111827;">
            <strong style="color: #4b5563; display: block; font-size: 12px; text-transform: uppercase; margin-bottom: 2px;">Subject:</strong>
            ${safeSubject}
          </p>
        </div>

        <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 10px 0; font-size: 13px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">
            MESSAGE
          </h3>
          <p style="margin: 0; white-space: pre-wrap; font-size: 14px; color: #1f2937; line-height: 1.6;">${safeMessage}</p>
        </div>

        <div style="background-color: #fff7ed; border-left: 4px solid #ea580c; padding: 14px 16px; border-radius: 6px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 6px 0; font-size: 13px; font-weight: 700; color: #9a3412; text-transform: uppercase; letter-spacing: 0.05em;">
            SUPPORT ACTION
          </h3>
          <p style="margin: 0 0 8px 0; font-size: 13px; color: #7c2d12; line-height: 1.5;">
            Please review the customer's message and respond directly to the customer's email address.
          </p>
          <p style="margin: 0; font-size: 13px; color: #9a3412; font-style: italic; line-height: 1.5;">
            Please respond to customer complaints within 4 hours and general queries within 8 hours of receiving the message.
          </p>
        </div>

        <p style="margin: 0 0 4px 0; font-size: 14px; color: #4b5563;">Regards,</p>
        <p style="margin: 0 0 2px 0; font-size: 14px; font-weight: 700; color: #111827;">Asian Spices Support Team</p>
        <p style="margin: 0; font-size: 14px;">
          <a href="mailto:support@asianspices.online" style="color: #ea580c; text-decoration: none;">support@asianspices.online</a>
        </p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;" />
        <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0;">
          Sent via the Contact Us form on asianspices.online
        </p>
      </div>
    `;

    const notificationText = `NEW CONTACT FORM SUBMISSION

A new message has been submitted through the Asian Spices website contact form.

CUSTOMER DETAILS

Name:
${fullName}

Email:
${email}

Subject:
${subject}

MESSAGE

${message}

SUPPORT ACTION

Please review the customer's message and respond directly to the customer's email address.
* They need to respond within 4 hours for complaints and within 8 hours for general queries.

Regards,
Asian Spices Support Team
support@asianspices.online`;

    await sendEmail({
      to: "support@asianspices.online",
      replyTo: email,
      subject: `New Contact Form Submission – ${subject}`,
      html: notificationHtml,
      text: notificationText,
      fromAccount: "support",
    });

    // Small pause between emails to allow SMTP socket reuse
    await new Promise((r) => setTimeout(r, 300));

    const sendCustomerConfirmation = async () => {
      if (USE_TEMP_PARTNER_CONFIRMATION_EMAIL) {
        // Temporary Partner Verification confirmation email
        const nameParts = (fullName || "").trim().split(/\s+/);
        const lastName =
          nameParts.length > 1 ? nameParts.slice(1).join(" ") : fullName || "Partner";

        const publicImagesDir = path.join(process.cwd(), "public", "images");

        const imageConfigs = [
          { name: "asian-spices-logo.png", cid: "asianSpicesLogo" },
          { name: "check-circle.png", cid: "checkCircleIcon" },
          { name: "clock-circle.png", cid: "clockCircleIcon" },
          { name: "as-circle.png", cid: "asCircleIcon" },
          { name: "tiktok.png", cid: "tiktokIcon" },
          { name: "instagram.png", cid: "instagramIcon" },
          { name: "facebook.png", cid: "facebookIcon" },
          { name: "youtube.png", cid: "youtubeIcon" },
        ];

        const attachments: Array<{
          filename: string;
          path: string;
          cid: string;
          contentType: string;
        }> = [];

        for (const img of imageConfigs) {
          const filePath = path.join(publicImagesDir, img.name);
          if (fs.existsSync(filePath)) {
            attachments.push({
              filename: img.name,
              path: filePath,
              cid: img.cid,
              contentType: "image/png",
            });
          }
        }

        const partnerHtml = generatePartnerVerificationEmailHtml({
          fullName,
          lastName,
          email,
          logoUrl: "cid:asianSpicesLogo",
          checkCircleUrl: "cid:checkCircleIcon",
          clockCircleUrl: "cid:clockCircleIcon",
          asCircleUrl: "cid:asCircleIcon",
          tiktokIconUrl: "cid:tiktokIcon",
          instagramIconUrl: "cid:instagramIcon",
          facebookIconUrl: "cid:facebookIcon",
          youtubeIconUrl: "cid:youtubeIcon",
        });

        const partnerText = generatePartnerVerificationEmailText({
          fullName,
          lastName,
          email,
        });

        await sendEmail({
          to: email,
          subject: "Welkom als goedgekeurde partner - Asian Spices",
          html: partnerHtml,
          text: partnerText,
          attachments,
          fromAccount: "support",
        });
      } else {
        const confirmationHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; padding: 25px; border-radius: 12px; color: #1f2937; line-height: 1.6;">
          <h2 style="color: #111827; text-align: center; margin-top: 10px; margin-bottom: 20px; font-size: 24px; font-weight: 800;">
            We've Received Your Message
          </h2>

          <p>Hello ${fullName},</p>
          <p>Thanks for reaching out to <strong>Asian Spices</strong>. Our support team has received your message and will respond within 48 hours.</p>

          <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0; font-size: 14px; color: #4b5563;">
            <p style="margin: 0 0 8px 0;"><strong>Subject:</strong> ${subject}</p>
            <p style="margin: 0; white-space: pre-wrap;"><strong>Your message:</strong><br>${message}</p>
          </div>

          <p style="font-size: 14px; color: #6b7280;">This is an automated confirmation — please don't reply to this email. Our team will contact you directly at this address.</p>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;" />
          <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0;">
            © 2026 Asian Spices Online. All rights reserved.<br>
            Need urgent help? Contact us at support@asianspices.online
          </p>
        </div>
      `;

        await sendEmail({
          to: email,
          subject: "We've received your message — Asian Spices",
          html: confirmationHtml,
          // Temporarily on "support" — the "noreply" mailbox is currently
          // failing SMTP connections server-side, pending IT fixing it.
          fromAccount: "support",
        });
      }
    };

    try {
      await sendCustomerConfirmation();
    } catch (confErr) {
      console.warn("[Customer Confirmation Attempt 1 Failed, Retrying after 1s...]", confErr);
      await new Promise((r) => setTimeout(r, 1000));
      await sendCustomerConfirmation();
    }

    return { success: true };
  } catch (error) {
    console.error("[Contact Form Email Dispatch Failure]", error);
    return { success: false, error };
  }
}

export async function sendNewsletterWelcomeEmail(email: string) {
  try {
    // const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3002";
    const siteUrl = "https://www.asianspices.online/";

    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; padding: 25px; border-radius: 12px; color: #1f2937; line-height: 1.6;">
        <div style="text-align: center; margin-bottom: 20px;">
          <span style="background-color: #ea580c15; color: #ea580c; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; padding: 6px 14px; display: inline-block; border-radius: 9999px; border: 1px solid #ea580c30;">
            Newsletter
          </span>
        </div>

        <h2 style="color: #111827; text-align: center; margin-top: 10px; margin-bottom: 20px; font-size: 24px; font-weight: 800;">
          Thanks for Subscribing!
        </h2>

        <p>Hello,</p>
        <p>You have successfully subscribed to the <strong>Asian Spices</strong> newsletter. Thank you for joining our community!</p>
        <p>You'll now receive exclusive recipes, spice tips, special offers, and updates delivered straight to your inbox.</p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${siteUrl}" style="background-color: #ea580c; color: #ffffff; text-decoration: none; padding: 12px 24px; font-weight: 600; border-radius: 8px; display: inline-block;">
            Visit Asian Spices
          </a>
        </div>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;" />
        <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0;">
          © 2026 Asian Spices Online. All rights reserved.<br>
          Need help? Contact us at support@asianspices.online
        </p>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: "You subscribed to our newsletter — thank you! 🎉",
      html: emailHtml,
      fromAccount: "support",
    });

    return { success: true };
  } catch (error) {
    console.error(`[Newsletter Welcome Email Fail] Target recipient: ${email}`, error);
    return { success: false, error };
  }
}