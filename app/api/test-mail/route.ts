// app/api/test-mail/route.ts
// TEMPORARY: test ke baad delete kar dena.
//
// Use:
// /api/test-mail?to=GMAIL&key=KEY&t=order&v=full&acc=order
//   t   = order | account | partner   (partner = jo mail ja rahi hai, baseline)
//   v   = full | nocommunity | nopromo | both
//   acc = order | support | partners | default   (SMTP profile)

import { NextResponse } from 'next/server';
import { sendEmail } from '@/core/email';
import { getEmailBrandingAttachments } from '@/core/utils/mails/shared';
import {
  generateOrderConfirmationEmailHtml,
  generateOrderConfirmationEmailText,
} from '@/core/utils/mails/order-confirmation';
import {
  generateAccountRegistrationEmailHtml,
  generateAccountRegistrationEmailText,
} from '@/core/utils/mails/account-reg';
import {
  generatePartnerApplicationEmailHtml,
  generatePartnerApplicationEmailText,
} from '@/core/utils/mails/partner-application';

export const dynamic = 'force-dynamic';

const PROMO = /\b(gratis|cadeaus|cadeau|kortingen|win|spaar)\b/gi;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const to = searchParams.get('to');
  const key = searchParams.get('key');
  const t = searchParams.get('t') || 'order';
  const v = searchParams.get('v') || 'full';
  const acc = (searchParams.get('acc') || 'order') as any;

  if (key !== process.env.TEST_MAIL_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!to) return NextResponse.json({ error: 'to missing' }, { status: 400 });

  let html = '';
  let text = '';
  let subject = '';

  if (t === 'order') {
    const data = {
      orderNumber: 'AS-TEST-1001',
      firstName: 'Test',
      email: to,
      deliveryDate: 'woensdag 14 oktober',
      deliveryAddress: 'Teststraat 1',
      postalCode: '1234 AB',
      city: 'Amsterdam',
      items: [{ name: 'Garam Masala 100g', sku: 'GM-100', quantity: 2, price: '4.99' }],
      subtotal: '9.98',
      shippingCost: 'Gratis',
      rewardPoints: 9,
      totalAmount: '9.98',
    };
    html = generateOrderConfirmationEmailHtml(data);
    text = generateOrderConfirmationEmailText(data);
    subject = 'Bestelbevestiging #AS-TEST-1001 - Asian Spices';
  } else if (t === 'account') {
    const data = { firstName: 'Test', lastName: 'User', email: to, accountType: 'Klantaccount' };
    html = generateAccountRegistrationEmailHtml(data);
    text = generateAccountRegistrationEmailText(data);
    subject = 'Bevestiging registratie account – Asian Spices';
  } else if (t === 'guest') {
    const data = { firstName: 'Test', email: to, temporaryPassword: 'ASTESTPASSWORD123', accountType: 'Klantaccount' };
    html = generateAccountRegistrationEmailHtml(data);
    text = generateAccountRegistrationEmailText(data);
    subject = 'Uw Asian Spices account is aangemaakt';
  } else {
    const data = { companyName: 'Test BV', firstName: 'Test', email: to, applicationId: 'APP-TEST-1' };
    html = generatePartnerApplicationEmailHtml(data);
    text = generatePartnerApplicationEmailText(data);
    subject = 'Uw partneraanvraag is ontvangen (APP-TEST-1) - Asian Spices';
  }

  const stripCommunity = v === 'nocommunity' || v === 'both';
  const stripPromo = v === 'nopromo' || v === 'both';

  if (stripCommunity) {
    html = html
      .replace(/<!-- 6\. Community[\s\S]*?(?=<!-- 7\. FAQ)/, '')
      .replace(/<!-- 4\. Community Card[\s\S]*?(?=<!-- 5\. Support)/, '');
  }
  if (stripPromo || stripCommunity) {
    html = html.replace(PROMO, 'extra');
    text = text.replace(PROMO, 'extra');
  }

  const meta = { type: t, variant: v, profile: acc, htmlKB: Math.round(Buffer.byteLength(html) / 1024) };

  try {
    await sendEmail({
      to,
      subject: `[${t}-${v}-${acc}] ${subject}`,
      html,
      text,
      attachments: getEmailBrandingAttachments(),
      fromAccount: acc,
    });
    return NextResponse.json({ ok: true, ...meta });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, ...meta, error: err?.message, code: err?.code, response: err?.response },
      { status: 500 },
    );
  }
}