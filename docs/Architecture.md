TemanUsaha CRM — Architecture

Prinsip

Modular monolith, server-side authorization, validasi terpusat, business rules di server, dan semua data tenant memakai workspace_id.

Stack

Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, Supabase Auth, PostgreSQL, Prisma atau Drizzle, Zod, Recharts, TanStack Table, Vitest, dan Playwright.

Alur Sistem

Browser → Next.js UI/Server Components → Server Actions/Route Handlers
→ Zod + Authorization + Domain Services → PostgreSQL

Struktur Folder

src/
  app/(auth)/login
  app/(dashboard)/{dashboard,customers,products,transactions,follow-ups}
  components/{ui,layout,dashboard,customers,transactions}
  db/{schema.ts,queries}
  lib/{auth,permissions,validations,whatsapp}
  server/{actions,services}
  types/

Modul Domain

Identity: user, workspace, membership. CRM: customer, tag, interaction. Catalog: product. Sales: transaction, transaction_item. Retention: follow_up. Reporting: aggregate queries.

Request Pattern

UI mengirim input → Zod memvalidasi → session dan membership diperiksa → permission diperiksa → service menjalankan database transaction → cache/path di-revalidate → typed result dikembalikan.

Authorization

owner dapat mengelola seluruh workspace, membership, dan export. staff dapat mengelola pelanggan, produk, transaksi, dan follow-up. Semua repository wajib menerima workspaceId; jangan mempercayai workspace ID dari client. Jika memakai Supabase, tambahkan Row Level Security.

Integrasi dan Performance

MVP memakai wa.me deep link dengan nomor E.164 dan pesan ter-encode. Gunakan server components untuk read-heavy pages, pagination, debounce search, dan index berdasarkan workspace/status/tanggal. Background jobs, email, dan WhatsApp API resmi ditambahkan kemudian.

Security dan Testing

Secret hanya di server, rate limit login/export, error tidak membocorkan detail database, migration versioning, dan backup. Unit test mencakup kalkulasi total, normalisasi nomor, segmentasi, dan permission. E2E mencakup login → customer → product → transaction → dashboard.