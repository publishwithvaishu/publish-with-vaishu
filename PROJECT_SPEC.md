# Publish With Vaishu — Project Specification

> Build this as a production-ready academic book publishing & e-commerce platform.
> This file is the single source of truth. Do not add roles, features, or workflows
> that are not described here.

---

## 1. What we are building

**Publish With Vaishu** is an academic book publishing and e-commerce platform that
sells **physical academic books** (no eBooks, no downloads). The books are University
of Madras syllabus titles — B.Com, BBA, BCA, B.Sc, M.Sc, Management, Commerce,
Computer Science, Conference Proceedings and Research Publications.

This is **NOT** a marketplace like Amazon. It is a single-publisher academic store.

---

## 2. Roles (only TWO)

### Admin (platform owner)
Full control over: authors, books, orders, categories, customers, shipping,
notifications, reports. Only the admin can publish books, manage inventory,
update order status, and enter shipment tracking details.

### Customer
Can register, log in, browse, search, add to cart, place orders, pay, track orders,
view order history, maintain profile, and add reviews. Customers cannot upload books
or access any admin features.

### IMPORTANT — Authors are NOT users
- There is **NO author login**.
- There is **NO author dashboard or panel**.
- Authors are records created and managed entirely by the admin.
- Authors only **receive email notifications** (book sold, order delivered).

---

## 3. Tech stack (use exactly this)

| Layer | Technology |
|---|---|
| Frontend framework | Next.js (App Router) + React |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Authentication | NextAuth (credentials + customer accounts) |
| Image storage | Cloudinary (store only the image URL in the DB, never the file) |
| Payments | Razorpay (UPI, Credit Card, Debit Card, Net Banking) |
| Email | Resend |
| Hosting | Vercel (frontend + serverless API routes) |
| Repo | GitHub |

All services must work on their **free tiers**. No paid VPS.

---

## 4. Design direction (very important)

**Style: Apple / Notion — minimal, premium, generous white space.**

- **70% of users are on mobile** → build mobile-first. Desktop is the enhancement.
- Light theme only. Off-white / white background (`#FFFFFF` / `#FCFBF7`).
- Near-black text (`#1D1D1F`), muted gray secondary text (`#6E6E73`).
- Solid black pill buttons for primary CTAs.
- Large bold headings; a two-tone headline style (first line dark, second line gray).
- Thin `1px` divider lines between sections instead of heavy boxes.
- Book cards: large cover image, minimal text below (title, author, price). No heavy borders.
- Category selectors are **pill chips** (outline style), not big colored boxes.
- Bottom navigation bar on mobile: Home, Categories, Cart, Account.
- Tap targets minimum 44px height.
- Use a serif font for book titles on detail pages for an academic feel; sans-serif for UI.
- A hero section with a full-width image and a text overlay ("Academic books, done right.").

### Homepage section order (must follow this exact order)
1. Header (logo + account icon)
2. Hero: full-width image with overlaid headline + subtext
3. Primary CTA button ("Explore books")
4. Trust stats row (Books published, Authors, Students served)
5. Search bar
6. "Browse by course" category chips (B.Com, BBA, BCA, M.Sc)
7. Featured books grid
8. "Why students choose us" — 3 short trust points (typography only, no icons/boxes)
9. Footer

> The brand intro/trust content comes FIRST, then the books. The homepage should feel
> like a premium publisher's site, not a busy shopping cart.

---

## 5. Data model (Supabase / PostgreSQL)

### authors
- id (uuid, pk)
- name (text)
- email (text)
- phone (text)
- photo_url (text)        ← Cloudinary URL
- bio (text)
- designation (text)
- institution (text)
- created_at (timestamptz)

### categories
- id (uuid, pk)
- name (text)             ← e.g. "B.Com", "BBA", "Conference Proceedings"
- slug (text, unique)
- created_at (timestamptz)

### books
- id (uuid, pk)
- title (text)
- subtitle (text)
- isbn (text)
- author_id (uuid, fk → authors.id)
- category_id (uuid, fk → categories.id)
- price (numeric)
- stock_quantity (integer)
- pages (integer)
- language (text)
- description (text)
- table_of_contents (text)
- cover_image_url (text)  ← Cloudinary URL
- preview_pdf_url (text, nullable)
- publication_date (date)
- is_featured (boolean, default false)
- created_at (timestamptz)

### customers
- id (uuid, pk)
- name (text)
- email (text, unique)
- password_hash (text)
- phone (text)
- created_at (timestamptz)

### addresses
- id (uuid, pk)
- customer_id (uuid, fk → customers.id)
- full_name, mobile, email, address, city, state, pincode (text)

### orders
- id (uuid, pk)
- order_number (text, unique)   ← human-readable, e.g. PWV-2026-0001
- customer_id (uuid, fk → customers.id)
- subtotal, shipping_charge, grand_total (numeric)
- status (enum: confirmed | processing | packed | shipped | delivered | cancelled)
- razorpay_payment_id (text)
- razorpay_order_id (text)
- shipping_address (jsonb)       ← snapshot of address at order time
- courier_name (text, nullable)
- tracking_number (text, nullable)
- tracking_url (text, nullable)
- created_at (timestamptz)

### order_items
- id (uuid, pk)
- order_id (uuid, fk → orders.id)
- book_id (uuid, fk → books.id)
- title_snapshot (text)          ← store title at purchase time
- price_snapshot (numeric)
- quantity (integer)

### reviews
- id (uuid, pk)
- book_id (uuid, fk → books.id)
- customer_id (uuid, fk → customers.id)
- rating (integer 1–5)
- comment (text)
- created_at (timestamptz)

---

## 6. Customer-facing pages

| Route | Purpose |
|---|---|
| `/` | Homepage (section order in §4) |
| `/books` | Catalog: search, filter (category/author/price), sort (newest/price/popularity) |
| `/books/[id]` | Book details: cover, title, author, ISBN, price, availability, description, ToC, related books, reviews. Buttons: Add to Cart, Buy Now |
| `/cart` | Cart: list items, edit quantity, remove, show subtotal + shipping + grand total |
| `/checkout` | Address form (full name, mobile, email, address, city, state, pincode) → Razorpay |
| `/orders` | Order history |
| `/orders/[id]` | Order tracking page (status stepper + courier info + "Track Shipment" button) |
| `/account` | Profile, addresses, reviews |
| `/login`, `/register` | Customer auth |

---

## 7. Admin pages

| Route | Purpose |
|---|---|
| `/admin` | Dashboard: total books, orders, customers, revenue, best sellers, recent orders |
| `/admin/books` | List + create + edit books (upload cover to Cloudinary) |
| `/admin/authors` | List + create + edit authors (upload photo to Cloudinary) |
| `/admin/categories` | List + create categories |
| `/admin/orders` | List orders, update status, enter courier name + tracking number + URL |
| `/admin/customers` | View customers |

Admin is a single owner account. Protect all `/admin/*` routes server-side.

---

## 8. Core business logic

### Inventory
- When an order is successfully paid, **reduce `stock_quantity`** for each book by the
  ordered quantity.
- If `stock_quantity` reaches 0, show **"Out of Stock"** and disable purchase.

### Order lifecycle (admin controls transitions)
`confirmed → processing → packed → shipped → delivered` (or `cancelled`)

### Shipping (manual, NO courier API)
- When admin marks an order "shipped", admin enters: courier name, tracking number,
  tracking URL.
- Customer's order page shows a **"Track Shipment"** button that opens the courier's
  website (`tracking_url`) in a new tab. We do **not** integrate any courier API.

### Payments
- Use Razorpay checkout. On success, verify the signature server-side, then create the
  order and reduce stock. Never trust the client for payment confirmation.

---

## 9. Email notifications (Resend)

| Trigger | Recipient | Contents |
|---|---|---|
| Order placed | Customer | Order number, books, amount |
| Book sold | Author (if author email exists) | Book name, order number, quantity |
| Order shipped | Customer | Courier name, tracking number |
| Order delivered | Customer + Author | Confirmation |

---

## 10. Business rules (do not violate)

1. No author login.
2. No author dashboard.
3. Physical books only.
4. No eBook downloads.
5. No royalty module.
6. No withdrawal module.
7. No courier API integration (manual tracking only).
8. Admin controls everything.
9. Customers can only purchase and track orders.
10. Authors only receive notification emails.

---

## 11. Environment variables needed

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RESEND_API_KEY=
ADMIN_EMAIL=
ADMIN_PASSWORD_HASH=
```

---

## 12. Build order (suggested)

1. Next.js + Tailwind project setup, design tokens (colors, fonts, spacing).
2. Supabase schema + seed a few categories, authors, books.
3. Homepage (static, with seed data) — get the premium look right first.
4. Catalog + book details + cart (client state).
5. Customer auth (NextAuth).
6. Checkout + Razorpay + order creation + stock reduction.
7. Order history + tracking page.
8. Admin dashboard + CRUD for books/authors/categories/orders.
9. Resend email notifications.
10. Polish, mobile QA, deploy to Vercel.

Deliver working, tested code at each step. Mobile-first throughout.
