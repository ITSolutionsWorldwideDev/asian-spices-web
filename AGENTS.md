# Asian Spices Web

Next.js (App Router, TypeScript) customer-facing storefront for Asian Spices — checkout, cart, and order/payment flows.

## Structure
- `app/` — Next.js App Router organized into route groups (`(auth)`, `(account)`, `(shop)`, `(marketing)`, `(legal)`) and API routes (`app/api/`), including payment webhooks: `app/api/paypal/capture/route.ts`, `app/api/paynl/confirm/route.ts`
- `components/` — layered component architecture:
  - `components/ui/` — reusable UI primitives and shared atomic widgets
  - `components/layout/` — global layout (`Nav.tsx`, `Footer.tsx`, `navigation/`, `footer/`)
  - `components/features/` — domain/feature-scoped components (`about`, `account`, `auth`, `cart`, `category`, `chatbot`, `checkout`, `contact`, `healthy-living`, `home`, `legal`, `partner-registration`, `products`, `recipes`, `reviews`, `search`, `seller-hub`, `wishlist`)
  - `components/providers/` — application context & state providers (`Providers.tsx`, `GlobalDataProvider.tsx`, `CartSyncProvider.tsx`)
  - `components/seo/` — SEO & analytics (`JsonLd.tsx`, `GoogleTagManager.tsx`, `MetaPixel.tsx`)
- `core/` — backend infrastructure:
  - `core/db.ts` — PostgreSQL connection pool and query helpers
  - `core/email.ts` — nodemailer SMTP profiles + `sendEmail` (own copy — not shared with `asian-spices-admin`)
  - `core/email-templates.ts` — HTML email builders (e.g. `sendOrderConfirmationEmail`)
  - `core/auth/` — NextAuth configuration, providers, callbacks, and guards
  - `core/order-routing/` — multi-store order routing, order number (`order-number.ts`), and invoice number (`invoice-number.ts`) generators
  - `core/partner-registration/` — privileged email checks and EU VIES VAT validation (`vies.ts`)
  - `core/utils/` — mail templates (`core/utils/mails/`) and shared core utilities
- `lib/` — domain utilities and data access:
  - `lib/dbactions/` — server-side database queries (products, categories, recipes, reviews, stats)
  - `lib/catalog/` — product path, category guide parsing, card mapping, and ingredient matching
  - `lib/commerce/` — pricing (`pricing.ts`), tax (`tax.ts`), country resolution (`country.ts`), and Pay.nl helpers (`paynl.ts`)
  - `lib/seo/` — JSON-LD schema builders (`schema.ts`), GTM (`gtm.ts`), sitemap URLs (`sitemap-urls.ts`), and product metadata (`product-metadata.ts`)
  - `lib/integrations/` — external service clients (`bibiClient.ts`, `recaptcha.ts`)
  - `lib/validation/` — Zod schemas (`account.ts`, `checkout.ts`, `contact.ts`, `newsletter.ts`, `recipes.ts`) and error formatters
- `data/` — centralized static content and legal policy JSON (`data/legal/`, `data/faqsData.json`, `data/categoryContent.ts`, `data/healthyLivingData.ts`, `data/allProductsContent.ts`)
- `store/`, `hooks/`, `types/` — Zustand state stores (`store/`), custom React hooks (`hooks/`), and consolidated TypeScript types (`types/`)

## Order-confirmation email
`sendOrderConfirmationEmail` in `core/email-templates.ts` is called from both `app/api/paypal/capture/route.ts` and `app/api/paynl/confirm/route.ts` right after a payment is confirmed (fire-and-forget). It sends via the `noreply` SMTP profile (`core/email.ts`) — `to` is the customer, internal team addresses are `bcc`. Sending this profile in production requires `SMTP_NOREPLY_USER`/`SMTP_NOREPLY_PASS` to be set for the `no-reply@asianspices.online` mailbox.

## Related repo
`asian-spices-admin` (sibling directory) is the separate admin dashboard repo — not a monorepo/Turborepo setup despite what older docs here implied. It has its own, unused copy of `sendOrderConfirmationEmail` (dead code there).

## Dev vs. production: separate databases, separate 

s
The `dev` deployment (`asian-spices-dev-web.vercel.app`) and `main`/production point at **two different databases** via `DATABASE_URL2` (`core/db.ts`), scoped per Vercel environment. They are not synced. This means:
- The same email address can have a **different password** on dev vs. production — changing your password on one does not touch the other. A login that works on production and 401s on dev (or vice versa) is expected behavior, not a bug — just use the password that was last set on that specific environment.
- Password-reset/forgot-password emails (sent via the `support` SMTP profile, `core/email.ts`) can occasionally get rejected by the recipient's mail server with `550 ... classified as SPAM` if the same reset email is requested repeatedly in quick succession (e.g. during manual testing). This is mail-server reputation/rate behavior, not a broken mailbox or bad credentials — spacing out requests avoids it. Confirmed 2026-08-07.
