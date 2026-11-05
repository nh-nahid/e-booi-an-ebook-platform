# ebooi — UI/UX Design Brief

> Paste this whole file into ChatGPT (or any design tool) and ask it to design the UI.
> A suggested prompt is at the very end.

---

## 1. Product in one paragraph

**ebooi** (live at **ebooi.bd**) is a **Bangla-first online ebook store for Bangladesh**.
Readers browse and buy **digital books (PDF ebooks only)**, pay with local methods
(bKash, Nagad, Rocket, cards via an online payment gateway), and the purchased book is
**added to their personal Library instantly** where they can read it online in a built-in
reader or download it. There is **no physical product, no shipping, no delivery address
and no Cash on Delivery.**

- **Audience:** Bangladeshi readers, mostly on **mobile phones**, comfortable with Bangla.
  Popular categories: Islamic books, career & livelihood, self-learning, series,
  science, business.
- **Language:** UI copy is **Bangla**. Numerals and prices are shown in BDT (৳).
  Latin text (English titles, author names) must sit comfortably next to Bangla script.
- **Tone:** trustworthy, calm, modern, friendly. Not flashy.
- **Business goal:** build trust (payment security, legit books) and make
  *discover → buy → read* as short as possible.

---

## 2. Current visual language (keep or evolve — your call)

| Token | Value | Used for |
|---|---|---|
| Primary accent (teal) | `#2DBDB6` | buttons, active states, links on dark, icons |
| Teal tint | `#E6F7F6` | selected card backgrounds, info boxes |
| Ink / navy | `#0A0E2A` | headings, footer & dark surfaces |
| Body text | `#374151` | paragraphs |
| Muted text | `#6B7280`, placeholder `#9AA3AF` | captions, helper text |
| Border | `#E1E5E8` | cards, inputs, dividers |
| Page background | `#F7F9FA` | page canvas (cards are white on top) |
| Footer muted | `#A7B0C8`, `#7c86a3` | footer links and copyright |

- **Fonts:** Inter (Latin) + Noto Sans Bengali (Bangla), weights 400–700.
- **Shape:** rounded cards (`rounded-2xl`), pill badges, 10px base radius, thin 1px borders, very light shadows.
- **Icons:** lucide-react (line icons).
- **Theme:** light by default; dark mode is wired in (next-themes) but not designed — a dark theme is welcome.
- **Current feel:** clean, white-card-on-light-grey, teal accent on dark-navy. It works but is
  fairly generic — **the goal is a more distinctive, premium, book-loving identity.**

---

## 3. What I want from the redesign

1. A **memorable brand feel** for a bookstore (warm, literary, modern) while staying fast and clear.
2. **Mobile-first** layouts (most traffic is phones); great on tablet/desktop too.
3. **Excellent Bangla typography** (line-height, size, weight; long titles that wrap; mixed Bangla/English).
4. A **cohesive design system**: colors, type scale, spacing, radii, shadows, buttons, inputs,
   badges, cards, tables, dialogs, toasts, empty/loading/error states.
5. Strong **trust signals** at checkout and on the home page.
6. A pleasant **in-browser reading experience**.
7. Accessible: WCAG AA contrast, visible focus states, 44px touch targets.

---

## 4. Sitemap

**Public**
- `/` Home
- `/books` Catalog (search, filter, sort, pagination) · `/books/[id]` Book detail
- `/shop` (alias of catalog) · `/wishlist`
- `/login` · `/register` · forgot / reset password
- `/offers` Offers & coupons
- Info pages (shared simple layout): `/about`, `/support` (contact + FAQ),
  `/privacy`, `/terms`, `/refund-policy`

**Logged-in reader**
- `/cart` · `/checkout` · `/payment-success` (and payment failed / cancelled screens)
- `/orders` · `/orders/[id]` (with invoice download)
- `/library` — "আমার বইসমূহ" (My Books) · `/read/[bookId]` — reader
- `/profile` — profile card, edit form, avatar upload, change password

**Admin** (`/admin/...`, role-guarded, sidebar + header layout)
- Dashboard · Books · Orders · Users · Authors · Publishers · Categories

---

## 5. Page-by-page content

### Global chrome
- **Navbar:** logo (left) · pill search bar with placeholder **"কাঙ্ক্ষিত বই খুঁজুন"** ·
  icons: Library, Cart (with item-count badge), Profile/Login. Mobile: bottom or compact nav
  (Home, Books, Library, Profile).
- **Footer (dark navy):** logo + short blurb + social (Facebook, WhatsApp) · columns:
  *কুইক লিংক* (categories, top books, pre-order, offers), *সহায়তা* (support, privacy,
  terms, refund policy, about), *যোগাযোগের তথ্য* (email, WhatsApp) ·
  copyright "© ২০২৬ ebooi. সর্বস্বত্ব সংরক্ষিত।" On mobile the columns are accordions.

### Home `/`
Sections in order:
1. **Hero** — headline + CTA, rotating **promo slider** (e.g. "সব বইয়ে সর্বদা X% ছাড় — কুপন কোড ব্যবহার করুন"), and **stats**: বই · পাঠক · লেখক · ক্যাটাগরি · সন্তুষ্ট গ্রাহক.
2. **Categories** — "ক্যাটাগরি সমূহ": ইসলামিক বই, কর্ম ও জীবিকা, সেলফ লার্নিং, সিরিজ, বিজ্ঞান, ব্যবসা (each with book count, "টি বই").
3. **Book rails** (header + "see all"): *সকল বই* (featured), *নতুন প্রকাশিত বই*, *বেস্ট সেলিং বই*.
4. **Pre-order** — "প্রি-অর্ডার" books.
5. **Trust section** — legit books straight from publishers · **instant** access after payment · secure payment · 24/7 support.
6. **Testimonials** — "গ্রাহকদের মতামত / পাঠকরা যা বলছেন" (name, quote).
7. Footer.

### Book card (reused everywhere)
Cover (tall ratio) · title (2-line clamp) · author · star rating + review count ·
price in ৳ with struck-through `originalPrice` and **discount % badge** when applicable ·
badges: *Pre-order*, *Featured* · actions: add to cart, wishlist heart, share ·
for owned books the CTA changes to **পড়ুন (Read)** / **ডাউনলোড (Download)**.

### Catalog `/books`
Hero/banner · toolbar ("সর্বমোট N টি বই", sort: latest / best-selling / price) ·
filters (category, price range, featured; **bottom-sheet filters on mobile**) ·
grid of book cards · pagination · skeleton + empty states.

### Book detail `/books/[id]`
Breadcrumb · **cover gallery** · title, author, category, rating, **views / sold** counters,
price + discount · primary **Add to cart** / **Buy now** · wishlist · share (copy link) ·
**"কিছু অংশ পড়ে দেখুন" (preview a sample, opens a modal)** · "কেনা হয়েছে" state if owned ·
**tabs:** বিবরণ (description) · বিস্তারিত তথ্য (details) · রিভিউ (reviews list + add-review form with stars) ·
**related books** grid.

### Cart `/cart`
Item rows (cover, title, author, price, remove) · "কার্ট খালি করুন" · **Order summary**
card: promo code input ("প্রয়োগ করুন"), subtotal, discount, total, **"চেকআউট করুন"**,
note "নিরাপদ ও সুরক্ষিত পেমেন্ট" · "শপিং চালিয়ে যান" · friendly empty state.

### Checkout `/checkout`
Items summary · **no address form** (digital-only; explain this in a friendly line:
"পেমেন্টের সাথে সাথেই বইগুলো আপনার লাইব্রেরিতে যোগ হয়ে যাবে") · contact details ·
**payment method selector** (radio cards): *মোবাইল ব্যাংকিং — bKash, Nagad, Rocket*,
*কার্ড — Visa, Mastercard*, *EPS gateway* · order total card with coupon discount ·
pay button → redirects to the payment gateway's hosted page.

### Payment result
- **Success:** "পেমেন্ট সফল হয়েছে", order number, purchased books with Read/Download, "আমার অর্ডার দেখুন", "শপিং চালিয়ে যান".
- **Failed / Cancelled:** clear explanation and a retry path.

### Orders `/orders`, `/orders/[id]`
Order cards (date, items, total, **payment-status badge**: pending / paid / failed) ·
detail page: items, price breakdown (subtotal, discount, final), payment method,
transaction id, **download invoice (PDF)**. *(Order has a legacy `orderStatus` field — in the
UI emphasise payment status; there is nothing to "ship".)*

### Library `/library` — "আমার বইসমূহ"
Grid/list of purchased books with **পড়ুন / ডাউনলোড / শেয়ার করুন** (share → Facebook, WhatsApp, copy link) ·
empty state: "আপনার লাইব্রেরিতে কোনো বই নেই — কিনুন এবং সাথে সাথে পড়া শুরু করুন" + "বই কিনুন".

### Reader `/read/[bookId]`
Distraction-free PDF reader: back button ("ফিরে যান"), title, **page prev/next**, **zoom in/out**,
page indicator, loading state ("বইটি লোড হচ্ছে..."), error state (not purchased / network).
Ideas welcome: reading progress, night mode, font/brightness controls, bookmarks.

### Auth & Profile
Login, register (name, email, phone, password), forgot/reset password ·
Profile: avatar, name/email/phone, edit form, change-password form, skeletons.

### Info pages
Simple readable document layout: title, "last updated", sections with a teal left-border heading,
bullet lists, contact box. Support page: two contact cards (email, WhatsApp) + FAQ accordion.

### Admin
Layout: **left sidebar + top header**, light grey canvas.
- **Dashboard:** stat cards (users, books, orders, revenue) · monthly **sales chart** · **top-selling books** · recent orders · latest users.
- **Books:** filterable table + add/edit dialog (cover upload, PDF upload, price, original price, category, featured, pre-order, published) + view dialog.
- **Users:** table with search/role filter, add / edit / view / delete dialogs, pagination.
- **Orders:** table with payment-status badges and status update.
- Authors, Publishers, Categories: simple CRUD tables.

---

## 6. Data the UI works with

- **Book:** title, author, description, category, price, originalPrice (optional, for discount), coverImage,
  averageRating, reviewCount, isFeatured, isPreOrder, isPublished, sold, views, createdAt.
- **Order:** items[{book, price}], totalAmount, discountAmount, finalAmount, coupon,
  paymentStatus (pending/paid/failed), paymentMethod, transactionId, paidAt, invoice.
- **User:** name, email, phone, avatar, role (user/admin).
- **Review:** rating (1–5), comment, user, date.
- **Coupon:** code, discount value, expiry.

---

## 7. Technical constraints (so the design is buildable)

- **Stack:** Next.js (App Router) + React + TypeScript + **Tailwind CSS v4** + **shadcn/ui** components +
  lucide-react icons + recharts (admin charts). Please express the design in terms that map to Tailwind utilities / shadcn primitives.
- Components already available: button, input, textarea, select, dialog, sheet (bottom drawer), dropdown-menu,
  table, card, badge, avatar, skeleton, toast (sonner).
- Cover images come from Cloudinary; book covers are **portrait** (assume ~2:3).
- Must handle: loading skeletons, empty states, error states, long Bangla titles, missing cover/avatar.
- Performance matters (mobile networks in Bangladesh): avoid heavy imagery and large web fonts beyond the two above.

---

## 8. Copy to avoid (leftover from an older "physical books" version)

The product is **digital only**. Do **not** design for or mention: delivery times ("২৪–৭২ ঘণ্টায় পৌঁছে যাবে"),
shipping address, print quality, courier, Cash on Delivery, order tracking steps like "shipped".
Some existing text (e.g. the trust section's "দ্রুত ডেলিভারি" and one testimonial about print quality)
is outdated — replace with digital-first messaging such as "তাৎক্ষণিক অ্যাক্সেস", "যেকোনো ডিভাইসে পড়ুন",
"নিরাপদ পেমেন্ট".

---

## 9. Deliverables I'd like

1. A short **design direction** (mood, personality, 2–3 alternative directions to choose from).
2. A **design system** (color palette with accessible pairs, type scale for Bangla + Latin, spacing, radius, elevation, component styles).
3. **High-fidelity screens**, mobile first then desktop, for: Home, Catalog, Book detail, Cart, Checkout, Payment success,
   Library, Reader, Login/Register, Profile, Support/Info page, Admin dashboard.
4. **Component states:** hover, focus, disabled, loading, empty, error.
5. If possible, the screens as **HTML + Tailwind** (or detailed enough to translate to Tailwind/shadcn).

### Suggested prompt to send with this file

> Act as a senior product designer. Using the attached brief for ebooi, a Bangla-first digital
> ebook store, propose three distinct visual directions, then fully develop the one I pick into a
> design system and mobile-first high-fidelity screens. Keep it implementable with Tailwind CSS v4
> and shadcn/ui, with excellent Bangla typography.
