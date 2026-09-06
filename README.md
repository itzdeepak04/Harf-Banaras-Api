# Harf Banaras — Backend (NestJS + MongoDB)

## What's done (MVP + this pass)
- Auth: register/login (email OR mobile), forgot/reset password, JWT
- Role-based access: customer / inventory_manager / admin (guards + decorators)
- Users: profile, addresses, Admin staff creation/activation (now audit-logged)
- Categories: saree type / occasion / collection, admin CRUD
- Products: full field set from spec, filtering (price/fabric/occasion/colour/work
  intensity/in-stock/discounted/new/bestseller), sorting, pagination, stock
  adjustment with mandatory reason + movement history (now audit-logged)
- Cart: add / "− qty +" stepper / remove, stock-validated, **coupon apply/remove
  with live discount calc**
- Wishlist: add/remove/list
- **Coupons module (new)**: admin CRUD, percentage/flat discount types, min
  order value, optional max-discount cap, expiry, usage limits;
  `POST /coupons/validate` for customer-side pre-checkout validation
- **Settings module (new)**: singleton collection for flat shipping fee,
  free-shipping threshold, tax %; `GET /settings` (public),
  `PATCH /settings` (admin) — orders now read from this instead of hardcoded values
- **Audit log (wired in)**: `AuditLogService` + `GET /audit-log` (admin).
  Now writes on: product create/update, stock adjustments, order placed/
  cancelled/status-changed, staff activate/deactivate
- Orders: **COD-only checkout**, stock decrement on order, coupon discount
  applied + redeemed on placement, dynamic shipping/tax via Settings, status
  history, cancellation (only while placed/confirmed/packed), Admin status updates
- Reviews: verified-purchase gated (must have a delivered order containing the product)
- Dashboard: Admin summary (sales, orders, AOV, low/out of stock, new customers),
  Inventory Manager summary (active/added-today/low/out-of-stock/drafts, stock
  movement history)
- **Seed script (new)**: `npm run seed` creates 16 sample Banarasi sarees
  (₹5,000–₹1,00,000) across 5 saree types and 4 occasions, with placeholder images
- `createResponse(HttpStatus, message, data)` pattern used everywhere, matching
  your existing convention
- Global JWT guard + RolesGuard enforced server-side (not just frontend checks)

## Setup
```
npm install
npm run start:dev
```
Requires a running MongoDB instance — set `MONGO_URI` in `.env`.

To populate sample data:
```
npm run seed
```

## NOT yet built (next steps)
1. **Payment gateway integration** — intentionally skipped this pass (kept
   COD-only per your instruction). `PaymentMethod` enum still has `upi`/`card`/
   `netbanking` reserved; wire in Razorpay (or similar) inside
   `orders.service.ts` when ready, gated behind `paymentStatus`.
2. **CSV import/export for inventory** — not implemented. `core/utils/export/`
   has a stub `index.ts` to build this into.
3. **Email/SMS delivery** — forgot-password still returns a `devToken` in the
   response instead of emailing/texting it; swap in a real provider
   (`core/mail/` scaffold exists but has no working templates/sender yet).
4. **Virtual Try-On, WhatsApp assistance, Hindi/English toggle** — out of
   scope for this MVP pass; not started.
5. **Unit tests** — none written yet (spec files not created for any module).
6. **~~Coupon UI on the admin side~~ — done.** The frontend now has an
   `/admin/coupons` page doing full CRUD against this module (see frontend
   README).
7. **~~Settings UI on the admin side~~ — done.** The frontend now has an
   `/admin/settings` page reading/writing this module (see frontend README).
   Same for `/dashboard/admin`, `/dashboard/inventory`, and
   `PATCH /orders/:id/status` — all now have a matching admin frontend page.

## Suggested prompt to continue
> "Continue the Harf Banaras NestJS backend. Add CSV import/export for
> inventory, wire in a real email/SMS provider for password resets, add unit
> tests for the coupons/settings/orders services, and integrate Razorpay as
> an additional payment method alongside COD."

## Note on this pass (frontend Admin/Inventory console)
No backend code changed in this pass — the existing `/dashboard`, `/coupons`,
`/settings`, and `/orders` (admin) endpoints were already complete and are
now consumed by a new `/admin` section in the frontend. See the frontend
README for what was built there.
