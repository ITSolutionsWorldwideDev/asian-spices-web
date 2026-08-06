# Asian Spices Web

Next.js (App Router, TypeScript) customer-facing storefront for Asian Spices — checkout, cart, and order/payment flows.

## Structure
- `app/` — pages and API routes, including payment webhooks: `app/api/paypal/capture/route.ts`, `app/api/paynl/confirm/route.ts`
- `core/` — `core/email.ts` (nodemailer SMTP profiles + `sendEmail`, own copy — not shared with `asian-spices-admin`), `core/email-templates.ts` (HTML email builders, e.g. `sendOrderConfirmationEmail`)
- `store/`, `hooks/`, `types/` — storefront state/data
- `components/` — UI components

## Order-confirmation email
`sendOrderConfirmationEmail` in `core/email-templates.ts` is called from both `app/api/paypal/capture/route.ts` and `app/api/paynl/confirm/route.ts` right after a payment is confirmed (fire-and-forget). It sends via the `noreply` SMTP profile (`core/email.ts`) — `to` is the customer, internal team addresses are `bcc`. Sending this profile in production requires `SMTP_NOREPLY_USER`/`SMTP_NOREPLY_PASS` to be set for the `no-reply@asianspices.online` mailbox.

## Related repo
`asian-spices-admin` (sibling directory) is the separate admin dashboard repo — not a monorepo/Turborepo setup despite what older docs here implied. It has its own, unused copy of `sendOrderConfirmationEmail` (dead code there).
