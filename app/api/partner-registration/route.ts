// app/api/partner-registration/route.ts

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/core/db";
import { sendPartnerRegistrationEmail } from "@/core/email-templates";
import { checkEuVatNumber } from "@/core/partner-registration/vies";
import {
  isPrivilegedEmail,
  PRIVILEGED_EMAIL_ERROR,
} from "@/core/partner-registration/check-privileged-email";

const generateApplicationId = () => {
  const date = new Date();

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  const random = Math.floor(10000 + Math.random() * 90000);

  return `APP-${y}${m}${d}-${random}`;
};

export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    kvk_number,
    company_name,
    chamber_of_commerce_number,
    country,
    street,
    house_number,
    additional_address,
    postal_code,
    city,
    chamberFiles,
    power_of_attorney_document,
    first_name,
    middle_name,
    last_name,
    business_phone_number,
    business_email_address,
    vat_number: rawVatNumber,
    idin,
  } = body;

  /* ---------------- VALIDATION ---------------- */

  if (!company_name) {
    return NextResponse.json(
      { error: "Company name is required" },
      { status: 400 },
    );
  }

  if (!business_email_address) {
    return NextResponse.json(
      { error: "Business email is required" },
      { status: 400 },
    );
  }

  if (await isPrivilegedEmail(String(business_email_address))) {
    return NextResponse.json(
      { error: PRIVILEGED_EMAIL_ERROR, code: "PRIVILEGED_EMAIL" },
      { status: 409 },
    );
  }

  if (!chamberFiles || chamberFiles.length === 0) {
    return NextResponse.json(
      { error: "Chamber documents are required" },
      { status: 400 },
    );
  }

  if (!rawVatNumber) {
    return NextResponse.json(
      { error: "VAT number is required" },
      { status: 400 },
    );
  }

  const vatCheck = await checkEuVatNumber({
    vat_number: rawVatNumber,
    country,
  });
  if (!vatCheck.ok) {
    return NextResponse.json(
      { error: vatCheck.error, code: vatCheck.code },
      { status: vatCheck.code === "SERVICE_UNAVAILABLE" ? 503 : 400 },
    );
  }

  const vat_number = vatCheck.formatted;
  const client = await pool.connect();

  try {
    /* ---------------- APPLICATION ID ---------------- */

    const application_id = generateApplicationId();

    /* ---------------- DUPLICATE CHECK ---------------- */

    const existing = await client.query(
      `
      SELECT
        CASE
          WHEN ($1::text IS NOT NULL AND $1 <> '' AND (kvk_number = $1 OR chamber_of_commerce_number = $1))
            OR ($2::text IS NOT NULL AND $2 <> '' AND (kvk_number = $2 OR chamber_of_commerce_number = $2))
            THEN 'chamber_of_commerce'
          WHEN ($3::text IS NOT NULL AND $3 <> '' AND vat_number = $3)
            THEN 'vat'
        END AS conflict_field
      FROM partner_registration
      WHERE
        ($1::text IS NOT NULL AND $1 <> '' AND (kvk_number = $1 OR chamber_of_commerce_number = $1))
        OR ($2::text IS NOT NULL AND $2 <> '' AND (kvk_number = $2 OR chamber_of_commerce_number = $2))
        OR ($3::text IS NOT NULL AND $3 <> '' AND vat_number = $3)
      LIMIT 1
      `,
      [kvk_number, chamber_of_commerce_number, vat_number],
    );

    if (existing.rows.length > 0) {
      const conflict = existing.rows[0].conflict_field;
      const error =
        conflict === "vat"
          ? "A registration with this VAT number already exists. Please use a different VAT number or contact support if you need help."
          : "A registration with this Chamber of Commerce number already exists. Please use a different number or contact support if you need help.";

      return NextResponse.json({ error }, { status: 409 });
    }

    /* ---------------- START TRANSACTION ---------------- */

    await client.query("BEGIN");

    /* ---------------- INSERT ---------------- */

    const result = await client.query(
      `
      INSERT INTO partner_registration (
        application_id,
        kvk_number,
        company_name,
        chamber_of_commerce_number,
        country,
        street,
        house_number,
        additional_address,
        postal_code,
        city,
        chamber_of_commerce_extract_document,
        power_of_attorney_document,
        first_name,
        middle_name,
        last_name,
        business_phone_number,
        business_email_address,
        vat_number,
        idin
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
        $11,$12,$13,$14,$15,$16,$17,$18,$19
      )
      RETURNING *
      `,
      [
        application_id,
        kvk_number,
        company_name,
        chamber_of_commerce_number,
        country,
        street,
        house_number,
        additional_address,
        postal_code,
        city,
        chamberFiles || [],
        power_of_attorney_document || [],
        first_name,
        middle_name,
        last_name,
        business_phone_number,
        business_email_address,
        vat_number,
        idin || null,
      ],
    );

    

    /* ---------------- COMMIT ---------------- */

    await client.query("COMMIT");

    // Must await on Vercel — fire-and-forget is killed once the response is sent.
    const emailResult = await sendPartnerRegistrationEmail({
      email: business_email_address,
      companyName: company_name,
      firstName: first_name,
      applicationId: application_id,
    });

    if (!emailResult.success) {
      console.error(
        "[Partner Registration Email Failed]",
        application_id,
        emailResult.error,
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Registration submitted successfully",
        application_id,
        emailSent: emailResult.success,
        ...(emailResult.success
          ? {}
          : {
              emailError:
                emailResult.error instanceof Error
                  ? emailResult.error.message
                  : String(emailResult.error ?? "Email dispatch failed"),
            }),
        data: result.rows[0],
      },
      { status: 201 },
    );
  } catch (err: any) {
    await client.query("ROLLBACK");

    console.error("Partner Registration Error:", err);

    return NextResponse.json(
      {
        error: err.message || "Internal Server Error",
      },
      { status: 500 },
    );
  } finally {
    client.release();
  }
}
