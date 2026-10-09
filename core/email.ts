// core/email.ts
import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  fromAccount?: "billing" | "order" | "partners" | "support" | "noreply" | "default";
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    content?: any;
    path?: string;
    cid?: string;
    contentType?: string;
    contentDisposition?: "inline" | "attachment";
  }>;
}

function cleanVal(v?: string) {
  return (v || "").replace(/^['"]|['"]$/g, "").trim();
}

const SMTP_HOST = cleanVal(process.env.SMTP_HOST) || "mail.asianspices.online";
const SMTP_PORT = Number(cleanVal(process.env.SMTP_PORT)) || 587;
const IS_SECURE = SMTP_PORT === 465;

const SMTP_PROFILES = {
  default: {
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: IS_SECURE,
    auth: {
      user: cleanVal(process.env.SMTP_ORDER_USER) || "order@asianspices.online",
      pass: cleanVal(process.env.SMTP_ORDER_PASS),
    },
    fromAddress: '"Asian Spices Orders" <order@asianspices.online>',
  },
  order: {
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: IS_SECURE,
    auth: {
      user: cleanVal(process.env.SMTP_ORDER_USER) || "order@asianspices.online",
      pass: cleanVal(process.env.SMTP_ORDER_PASS),
    },
    fromAddress: '"Asian Spices Orders" <order@asianspices.online>',
  },
  billing: {
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: IS_SECURE,
    auth: {
      user: cleanVal(process.env.SMTP_FINANCE_USER) || "finance@asianspices.online",
      pass: cleanVal(process.env.SMTP_FINANCE_PASS),
    },
    fromAddress: '"Asian Spices Finance" <finance@asianspices.online>',
  },

  partners: {
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: IS_SECURE,
    auth: {
      user: cleanVal(process.env.SMTP_PARTNERS_USER) || "partners@asianspices.online",
      pass: cleanVal(process.env.SMTP_PARTNERS_PASS),
    },
    fromAddress: '"Asian Spices Partners" <partners@asianspices.online>',
  },

  support: {
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: IS_SECURE,
    auth: {
      user: cleanVal(process.env.SMTP_SUPPORT_USER) || "support@asianspices.online",
      pass: cleanVal(process.env.SMTP_SUPPORT_PASS),
    },
    fromAddress: '"Asian Spices Support" <support@asianspices.online>',
  },

  noreply: {
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: IS_SECURE,
    auth: {
      user: cleanVal(process.env.SMTP_NOREPLY_USER) || "no-reply@asianspices.online",
      pass: cleanVal(process.env.SMTP_NOREPLY_PASS),
    },
    fromAddress: '"Asian Spices" <no-reply@asianspices.online>',
  },
};

type ProfileKey = keyof typeof SMTP_PROFILES;

const transporterCache = new Map<ProfileKey, nodemailer.Transporter>();

function getTransporter(profileKey: ProfileKey) {
  const profile = SMTP_PROFILES[profileKey] || SMTP_PROFILES.default;

  let transporter = transporterCache.get(profileKey);
  if (!transporter) {
    transporter = nodemailer.createTransport({
      pool: true,
      maxConnections: 3,
      maxMessages: 100,
      host: profile.host,
      port: profile.port,
      secure: profile.secure,
      auth: {
        user: profile.auth.user,
        pass: profile.auth.pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 15000,
      greetingTimeout: 10000,
      socketTimeout: 20000,
    });
    transporterCache.set(profileKey, transporter);
  }

  return {
    transporter,
    fromAddress: profile.fromAddress,
  };
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  fromAccount = "default",
  replyTo,
  cc,
  bcc,
  attachments,
}: EmailOptions) {
  const profileKey: ProfileKey = SMTP_PROFILES[fromAccount]
    ? fromAccount
    : "default";

  const { transporter, fromAddress } = getTransporter(profileKey);

  // const defaultCC = ["admin@asianspices.online", "backup@asianspices.online"];
  // const finalCC = cc ? (Array.isArray(cc) ? [...cc, ...defaultCC] : [cc, ...defaultCC]) : defaultCC;

  const isTest = cleanVal(process.env.IS_TEST_EMAIL) === "true";
  const finalSubject = isTest && !subject.trim().toUpperCase().startsWith("[TEST]")
    ? `[TEST] ${subject}`
    : subject;

  const mailOptions = {
    from: fromAddress,
    to,
    cc,
    bcc,
    subject: finalSubject,
    html,
    text,
    replyTo,
    attachments,
  };

  try {
    const info = await transporter.sendMail(mailOptions);

    if (process.env.NODE_ENV !== "production") {
      console.log(`[Email Sent] ID: ${info.messageId} via [${profileKey}] | Subject: ${finalSubject}`);
    }
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[Email Failure] Profile [${profileKey}]:`, error);
    throw new Error(`Email dispatch failed via SMTP profile: ${profileKey}`);
  }
}
