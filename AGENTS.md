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

## Dev vs. production: separate databases, separate passwords
The `dev` deployment (`asian-spices-dev-web.vercel.app`) and `main`/production point at **two different databases** via `DATABASE_URL2` (`core/db.ts`), scoped per Vercel environment. They are not synced. This means:
- The same email address can have a **different password** on dev vs. production — changing your password on one does not touch the other. A login that works on production and 401s on dev (or vice versa) is expected behavior, not a bug — just use the password that was last set on that specific environment.
- Password-reset/forgot-password emails (sent via the `support` SMTP profile, `core/email.ts`) can occasionally get rejected by the recipient's mail server with `550 ... classified as SPAM` if the same reset email is requested repeatedly in quick succession (e.g. during manual testing). This is mail-server reputation/rate behavior, not a broken mailbox or bad credentials — spacing out requests avoids it. Confirmed 2026-08-07.
