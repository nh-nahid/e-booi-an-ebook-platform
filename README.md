<div align="center">

# 📚 eBooi

**A modern ebook & bookstore platform for Bangladesh — instant digital
downloads, physical shipping, and local payments (bKash / Nagad / cards),
all in one checkout.**

[![Next.js](https://img.shields.io/badge/Next.js-App%20Router-000000?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express%205-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![SSLCommerz](https://img.shields.io/badge/Payments-SSLCommerz-D9A441?style=flat-square)](https://sslcommerz.com/)

🔗 **Live:** [e-booi.com](https://e-booi.com)

</div>

---

### ✨ What makes this stack a little different

> 🇧🇩 **Built for the local market, not adapted to it.** Payments route
> through SSLCommerz so customers pay with bKash, Nagad, Rocket, or card
> without ever leaving the checkout page. Invoices are typeset in a font
> that renders Bengali *and* Latin script correctly in the same PDF — most
> off-the-shelf setups quietly fail one or the other.

---

## 🗂️ Table of Contents

- [Tech Stack](#-tech-stack)
- [Architecture Decisions](#-architecture-decisions-worth-knowing)
- [Getting Started](#-getting-started)
- [API Overview](#-api-overview)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [Known Open Items](#-known-open-items)

---

## 🧱 Tech Stack

<table>
<tr>
<td valign="top" width="50%">

**Frontend**
- ⚛️ Next.js (App Router) + TypeScript
- 🔄 TanStack Query (React Query)
- 🧩 Shadcn/ui
- 🎨 Tailwind CSS
- 🌐 axios · sonner (toasts) · lucide-react

</td>
<td valign="top" width="50%">

**Backend**
- 🟢 Node.js + Express 5
- 🍃 MongoDB + Mongoose
- 🔐 JWT access/refresh, httpOnly cookies
- 💳 SSLCommerz (`sslcommerz-lts`)
- 📄 PDFKit (bilingual invoices)
- ✉️ Nodemailer

</td>
</tr>
</table>

---

## 🧠 Architecture Decisions Worth Knowing

<details>
<summary><b>💳 Payment method vs. gateway</b></summary>
<br>

The frontend lets shoppers pick a granular method (`card` / `bkash` /
`nagad` / `cod`); the backend maps this to a gateway (`sslcommerz` / `cod`)
via a `GATEWAY_MAP`. Only the gateway is persisted on the `Order` document —
the specific method chosen isn't currently tracked past that point.

</details>

<details>
<summary><b>📦 Stock & cart timing</b></summary>
<br>

| Order type | Stock reduced | Cart cleared |
|---|---|---|
| Cash on Delivery | Immediately at order creation | Immediately |
| Gateway (SSLCommerz) | Deferred to `paymentSuccess` | Deferred to `paymentSuccess` |

This means an abandoned or failed online payment never silently empties a
cart or reduces real inventory for a sale that never happened.

</details>

<details>
<summary><b>🎟️ Coupons are calculated twice, on purpose</b></summary>
<br>

`applyCoupon` is a **stateless calculator** used for cart/checkout previews
only — nothing is persisted. Real validation and `usedCount` increments
happen inside `createOrder`, so a client can never trust its own discount
math into the server.

</details>

<details>
<summary><b>🖋️ Bilingual invoices</b></summary>
<br>

PDFKit's built-in fonts only cover Latin glyphs, and Google's script-specific
`Noto Sans Bengali` build swings the other way — full Bengali, **zero Latin
letters**. Invoices use **Hind Siliguri** instead, which covers full Latin
*and* Bengali in a single font file.

</details>

<details>
<summary><b>✉️ Email never blocks checkout</b></summary>
<br>

Order confirmation emails fire **after** the response is sent to the
client, not awaited inline. A slow or blocked SMTP connection (a real
constraint on some hosts) can never hang or fail the checkout request
itself.

</details>

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB connection string (Atlas or local)
- SSLCommerz sandbox or live store credentials
- An email-sending method (see ⚠️ note below)

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm start        # dev — nodemon, NODE_ENV=development
npm run prod     # prod — node app.js, NODE_ENV=production
```

<details>
<summary>📋 <b>Environment variables</b></summary>

```env
# Application
APP_NAME=
PORT=

# URLs
BACKEND_URL=
FRONTEND_URL=

# Database
MONGO_CONNECTION_STRING=

# JWT & Cookies
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRES=
JWT_REFRESH_EXPIRES=
COOKIE_NAME=
COOKIE_SECRET=

# SSLCommerz
SSL_STORE_ID=
SSL_STORE_PASSWORD=
SSL_IS_LIVE=

# Email (Gmail SMTP)
EMAIL_USER=
EMAIL_PASS=
EMAIL_FROM=

# Password reset
RESET_PASSWORD_EXPIRE=

# Admin
ADMIN_ACCESS_CODE=
```

</details>

> ⚠️ **Email in production:** Gmail SMTP can time out on hosts that
> restrict raw SMTP (some Render tiers included). If email sending stalls
> in production, switch to an HTTP-based provider — Resend, SendGrid, or
> Mailgun all work over port 443, which is never blocked.

> 🔤 **Missing invoice fonts?** `utils/generateInvoice.js` expects
> `utils/fonts/HindSiliguri-Regular.ttf` and `HindSiliguri-Bold.ttf`.
> Grab both from [Google Fonts](https://fonts.google.com/specimen/Hind+Siliguri).

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

---

## 🔌 API Overview

All routes are prefixed with `/api/v1`.

| Resource | Path | Highlights |
|---|---|---|
| 👤 Auth/Users | `/users` | register · login · refresh-token · profile · password reset · admin user mgmt |
| 📖 Books | `/books` | list · detail · create/update/delete (admin) |
| 🛒 Cart | `/cart` | get · add · update quantity · remove · clear |
| 📦 Orders | `/orders` | create · list (own/admin) · detail · status updates · invoice/book download |
| 💳 Payment | `/payment` | initiate SSLCommerz · success/fail/cancel callbacks |
| 🎟️ Coupons | `/coupons` | create/list/delete (admin) · apply (preview) |
| ⭐ Reviews | `/reviews` | per-book: list · add · update · delete |
| ❤️ Wishlist | `/wishlist` | get · add · remove |
| 📊 Admin | `/admin` | dashboard stats · monthly sales · top books · user mgmt |
| 🏠 Home | `/home` | homepage aggregate data |

Auth uses short-lived JWT access tokens + a longer-lived refresh token, both
as httpOnly cookies. Protected routes use `checkLogin`; admin-only routes
add `requireRole("admin")`.

---

## 🗃️ Project Structure

```
backend/
├── controllers/     # request handlers, one file per resource
├── models/          # Book · Order · User · Cart · Coupon · Review · Wishlist
├── routers/         # Express routers, one file per resource
├── middlewares/
│   ├── common/       # checkLogin, requireRole, error handler
│   ├── users/         # validators, avatar upload
│   └── books/          # cover/PDF upload
├── utils/            # JWT, email, invoice generation, uploads
├── emails/
│   ├── layouts/        # shared header/footer
│   └── templates/       # order, shipping, payment, welcome, reset-password
├── public/            # static files, covers, PDFs, invoices
├── app.js             # Express app, middleware, routing
└── server.js          # MongoDB connection

frontend/
├── app/               # Next.js App Router pages
├── features/          # feature-scoped hooks / api / components / types
│   ├── checkout/  ├── cart/  ├── orders/  └── admin/
├── components/         # shared layout (Navbar, Footer, etc.)
├── providers/            # AuthProvider / auth context
└── middleware.ts          # route-level auth guarding
```

---

## ☁️ Deployment

- **Backend** — Render
- **Frontend** — separate host, custom domain `e-booi.com`

Since frontend and backend are cross-origin, cookie auth requires all three
of these together:

- ✅ Cookies set with `sameSite: "none"` and `secure: true`
- ✅ CORS configured with the **exact** frontend origin (never `*`) + `credentials: true`
- ✅ Axios requests sent with `withCredentials: true`

---

## 🧩 Known Open Items

| # | Item | Status |
|---|---|---|
| 1 | Stock race condition — pre-payment check vs. post-payment decrement | 🔴 Needs re-validation in `paymentSuccess` |
| 2 | Specific payment method (bKash/Nagad/card) not persisted past gateway mapping | 🟡 Add `paymentMethodDetail` if needed for analytics |
| 3 | Cart vs. checkout discount display inconsistency | 🟡 Confirm if `originalPrice` is ever populated |
| 4 | No customer-facing "cancel order" endpoint | 🟡 Admin-only status updates exist today |

---

## 👤 Author

**Nahid Hossain**

[![Email](https://img.shields.io/badge/Email-nahid4510%40gmail.com-D14836?style=flat-square&logo=gmail&logoColor=white)](mailto:nahid4510@gmail.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-nahid--nh-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/nahid-nh)

---

<div align="center">

Made with 📖 and 🇧🇩 for readers who want their books their way.

</div>
