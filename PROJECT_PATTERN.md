# Project Pattern Guide — ebooi (eBook Platform)

> A reference document describing the architecture, file management, and technologies of this project.
> Reuse this exact stack + structure to build a **School Management System**.

---

## 🧱 Technologies Used

### Frontend (`frontend/`)
| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 16.x (App Router) | React framework — pages, routing, SSR |
| **TypeScript** | 5.x (strict) | Type safety |
| **React** | 19.x | UI library |
| **Tailwind CSS** | 4.x | Styling (+ `tw-animate-css`) |
| **shadcn/ui** | latest | Prebuilt accessible UI primitives in `components/ui/` |
| **TanStack Query** | 5.x | Server state: fetching, caching, mutations |
| **Zustand** | 5.x | Client/global state (e.g. search store) |
| **axios** | 1.x | HTTP client + interceptors |
| **react-hook-form + zod** | 7.x / 4.x | Form handling + schema validation (`@hookform/resolvers`) |
| **sonner** | 2.x | Toast notifications |
| **lucide-react / react-icons** | — | Icons |
| **recharts** | 3.x | Admin dashboard charts |
| **next-themes** | 0.4.x | Dark/light mode |

### Backend (`backend/`)
| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | 18+ | Runtime (CommonJS modules) |
| **Express** | 5.x | REST API framework |
| **MongoDB + Mongoose** | 7 / 9 | Database + ODM |
| **jsonwebtoken (JWT)** | 9.x | Access + refresh tokens |
| **bcrypt** | 6.x | Password hashing |
| **express-validator** | 7.x | Request validation |
| **multer + multer-storage-cloudinary + cloudinary** | 2.x | File/image uploads to Cloudinary |
| **nodemailer** | 9.x | Email sending (SMTP) |
| **pdfkit / pdf-lib** | — | PDF invoice/document generation |
| **http-errors** | 2.x | Standardized error creation |
| **cors / cookie-parser / dotenv** | — | Middleware & config |
| **nodemon** | 3.x | Dev hot-reload |

### Deployment Pattern
- Backend → Render (or similar). Frontend → separate host.
- Cross-origin cookie auth requires all three together:
  - Cookies: `sameSite: "none"` + `secure: true`
  - CORS: exact frontend origin (never `*`) + `credentials: true`
  - Axios requests: `withCredentials: true`

---

## 🗂️ File Management / Structure

```
root/
├── backend/
│   ├── controllers/            # request handlers — ONE FILE PER RESOURCE
│   │   ├── usersController.js      # auth, profile, password reset
│   │   ├── bookController.js       # CRUD, pagination, filters
│   │   ├── orderController.js      # ...
│   │   └── adminController.js      # dashboard aggregates
│   ├── models/                 # Mongoose schemas — PascalCase SINGULAR
│   │   ├── User.js                 # role enum, status enum, refreshToken field
│   │   ├── Book.js
│   │   └── Order.js                # ... one model per collection
│   ├── routers/                # Express routers — ONE FILE PER RESOURCE
│   │   └── usersRouter.js          # wires: upload → validators → controller
│   ├── middlewares/
│   │   ├── common/             # cross-cutting middleware
│   │   │   ├── checkLogin.js       # JWT verify + requireRole("admin") RBAC
│   │   │   └── errorHandler.js     # 404 handler + central JSON error handler
│   │   ├── users/              # resource-specific middleware
│   │   │   ├── addUserValidators.js    # express-validator chains
│   │   │   └── avatarUpload.js         # multer/cloudinary upload config
│   │   └── books/
│   │       └── bookUpload.js           # cover + PDF upload
│   ├── utils/                  # helpers
│   │   ├── jwt.js                      # sign/verify access & refresh tokens
│   │   ├── token.js                    # random token generation
│   │   ├── setRefreshCookie.js         # httpOnly refresh cookie helper
│   │   ├── sendEmail.js                # nodemailer transport wrapper
│   │   ├── cloudinary.js               # upload/destroy asset helpers
│   │   ├── singleUploader.js           # generic multer uploader factory
│   │   ├── generateInvoice.js          # PDFKit documents
│   │   └── fonts/                      # bundled TTF fonts for PDFs
│   ├── emails/
│   │   ├── layouts/                    # header.js / footer.js (shared HTML shell)
│   │   └── templates/                  # welcomeEmail, orderEmail, resetPasswordEmail…
│   ├── scripts/                # one-off seed/migration scripts
│   ├── public/                 # static: uploads, invoices
│   ├── app.js                  # ⭐ Express app: middleware chain + route mounting
│   ├── server.js               # ⭐ connectDB() — mongoose connection
│   ├── package.json
│   └── .env                    # secrets (never committed)
│
└── frontend/
    ├── app/                        # ⭐ Next.js App Router
    │   ├── layout.tsx                  # root: Providers nest + Toaster
    │   ├── globals.css                 # Tailwind entry
    │   ├── loading.tsx / not-found.tsx
    │   ├── (public)/                   # route group: storefront pages
    │   │   ├── layout.tsx              # group-specific layout (navbar/footer)
    │   │   └── page.tsx                # home
    │   ├── (auth)/                     # login/, register/ — guest-only
    │   ├── (user)/                     # profile/ — logged-in users
    │   ├── (private)/                  # protected pages
    │   └── (admin)/                    # admin/ — role-guarded dashboard
    ├── features/                   # ⭐ FEATURE-SLICED MODULES (core pattern!)
    │   └── <feature>/                  # books, cart, checkout, orders, auth,
    │       ├── api/                    #   admin, home, profile, reviews, coupon,
    │       │   └── book.api.ts         #   library… one folder per domain
    │       ├── hooks/
    │       │   └── use-book.ts         # TanStack Query hooks wrapping api/
    │       ├── types/
    │       │   └── book.types.ts       # interfaces for the feature
    │       ├── components/             # feature-scoped UI (can nest subfolders)
    │       ├── schemas/                # zod form schemas
    │       └── utils/                  # feature helpers
    ├── services/
    │   └── api/
    │       ├── axios.ts                # instance + interceptors (auto-refresh 401)
    │       ├── endpoints.ts            # ⭐ ALL API paths as nested const object
    │       ├── api.ts                  # tiny wrapper exporting get/post/put/patch/delete
    │       └── token.ts                # access token in-memory get/set/clear
    ├── providers/                  # React context providers
    │   ├── query-provider.tsx          # TanStack QueryClientProvider
    │   ├── auth-provider.tsx           # auth context, bootstrap token refresh
    │   └── theme-provider.tsx          # next-themes
    ├── stores/                     # Zustand stores
    │   └── search-store.ts
    ├── components/
    │   ├── ui/                         # shadcn primitives (button, dialog, table…)
    │   ├── layout/                     # navbar, footer, nav-links, user-menu
    │   └── search/                     # shared search components
    ├── hooks/                      # generic hooks (use-debounce, use-auth…)
    ├── lib/                        # query-client.ts, utils.ts (cn helper)
    ├── types/                      # global shared types
    ├── constants/                  # index.ts — app-wide constants
    ├── middleware.ts               # edge middleware: role-based redirects via cookies
    ├── public/                     # static assets (images, svgs)
    └── next.config.ts / tsconfig.json / postcss.config.mjs
```

---

## 🔁 Core Patterns (how the pieces fit together)

### 1. Backend request lifecycle
```
Request → app.js middleware chain (cors → json → static → cookies)
        → router (/api/v1/<resource>)
        → [upload middleware] → [validators] → [checkLogin] → [requireRole]
        → controller (try/catch → next(err))
        → res.status(201).json({ message, data })
        ↓ on error
        errorHandler.js (404 notFoundHandler + centralized JSON errors)
```

### 2. Controller conventions
- One exported async function per action: `addX`, `getXs`, `getX`, `updateX`, `deleteX`.
- Always `try { … } catch (err) { next(err) }` — never respond inside catch directly.
- Success shape: `{ message: "...", data }`. Error shape: `{ message: "..." }`.

### 3. Auth pattern (JWT dual-token)
- Login/register → returns short-lived **accessToken** in body + sets long-lived **refreshToken** as httpOnly cookie (`setRefreshCookie`), also persisted on the User doc.
- Backend guard: `checkLogin` reads `Authorization: Bearer <token>`; on expiry returns `401` with `code: "TOKEN_EXPIRED"`.
- Role guard: `requireRole("admin")` chained after `checkLogin`.
- Frontend keeps accessToken **in memory only** (`services/api/token.ts`). On any 401/TOKEN_EXPIRED, the axios response interceptor calls `/refresh-token`, queues concurrent requests while refreshing, retries the original request, and hard-redirects to `/login` if refresh fails.

### 4. Frontend data-fetching pattern (per feature)
```
features/books/types/book.types.ts     ← define interfaces first
features/books/api/book.api.ts         ← plain async fns: api.get<Resp>(ENDPOINTS.X)
features/books/hooks/use-book.ts       ← "use client" + useQuery/useMutation wrappers
app/(public)/books/page.tsx            ← page consumes hooks only
```
- Query keys are arrays: `["books", params]`, `["book", id]`.
- Mutations invalidate related queries; toasts via `sonner`.

### 5. Route organization (App Router)
- **Route groups** `(...)` separate layouts without affecting URLs: `(public)` gets marketing/navbar layout, `(auth)` minimal layout, `(user)`/`(admin)` guarded layouts.
- Pages stay thin — they import from `features/`, never fetch inline.
- `middleware.ts` handles coarse redirects by reading cookies (e.g. admin visiting `/` → `/admin`).

### 6. Endpoint registry
All URLs live in one place (`services/api/endpoints.ts`) as a nested frozen object:
```ts
export const ENDPOINTS = {
  BOOKS: {
    LIST: "/books",
    DETAILS: (id: string) => `/books/${id}`,
  },
} as const;
```

---

## 🏫 Mapping to a School Management System

Keep everything identical; swap the domain resources:

| eBook Platform | School Management Equivalent |
|---|---|
| Book | Student / Teacher / Course |
| Category | Class / Section / Department |
| Order | Enrollment / Fee Payment |
| Cart | Course Registration |
| Review | Result / Grade |
| Coupon | Scholarship / Discount |
| Wishlist | Timetable / Attendance |
| `bookController.js` | `studentController.js`, `teacherController.js`, … |

**Example new resources** (each = model + router + controller [+ middleware folder]):
`users`, `students`, `teachers`, `classes`, `subjects`, `attendance`, `exams`, `results`, `fees`, `notices`, `timetables`.

**Example backend mount:**
```js
app.use("/api/v1/students", studentRouter);
app.use("/api/v1/classes", classRouter);
app.use("/api/v1/attendance", attendanceRouter);
```

**Example frontend feature slice:**
```
features/students/
├── api/students.api.ts
├── hooks/use-students.ts
├── types/student.types.ts
├── schemas/student.schema.ts
└── components/students-table.tsx
```

Roles to use in the existing `role` enum instead of `["admin","user"]`:
`["admin", "teacher", "student", "parent"]` — `requireRole()` already supports multiple roles.

---

## ⚙️ Environment Variables

**backend/.env**
```env
APP_NAME= PORT= BACKEND_URL= FRONTEND_URL=
MONGO_CONNECTION_STRING=
JWT_ACCESS_SECRET= JWT_REFRESH_SECRET= JWT_ACCESS_EXPIRES= JWT_REFRESH_EXPIRES=
COOKIE_NAME= COOKIE_SECRET=
CLOUDINARY_CLOUD_NAME= CLOUDINARY_API_KEY= CLOUDINARY_API_SECRET=
EMAIL_USER= EMAIL_PASS= EMAIL_FROM=
ADMIN_ACCESS_CODE=
```

**frontend/.env.local**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

---

## 🚀 Scripts

| Location | Command | Purpose |
|---|---|---|
| backend | `npm start` | dev server (nodemon, NODE_ENV=development) |
| backend | `npm run prod` | production (node app.js) |
| frontend | `npm run dev` | Next.js dev server |
| frontend | `npm run build` / `start` | production build / serve |
| frontend | `npm run lint` | ESLint |
