# TemanUsaha CRM

CRM SaaS multitenant untuk UMKM Indonesia, dibuat dengan Next.js App Router, Prisma/PostgreSQL, Supabase Auth, Tailwind CSS, Zod, Recharts, Vitest, dan Playwright.

## Menjalankan lokal

1. Gunakan Node.js 20+ dan PostgreSQL 15+.
2. Salin `.env.example` menjadi `.env.local`, lalu isi URL database dan kredensial proyek Supabase.
3. Pastikan Supabase tidak menggunakan trigger profil/workspace lain yang bertabrakan dengan onboarding aplikasi.
4. Jalankan:

```bash
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Aplikasi tersedia di `http://localhost:3000`.

## Kredensial demo lokal

Seed membuat akun Supabase bila `SUPABASE_SERVICE_ROLE_KEY` tersedia:

- Owner: `owner@temanusaha.local` / `DemoOwner123!`
- Staff: `staff@temanusaha.local` / `DemoStaff123!`

Gunakan hanya pada lingkungan development. Tanpa service-role key, buat pengguna Auth dengan UUID yang tercantum di `prisma/seed.ts`, atau daftar akun baru melalui UI.

## Perintah kualitas

```bash
npm run typecheck
npm run lint
npm test
npm run test:e2e
npm run build
```

## Keamanan dan arsitektur

- Semua query bisnis mendapat `workspaceId` dari membership pengguna yang terautentikasi; nilai tenant tidak diterima dari form.
- Export hanya untuk owner. Owner dan staff dapat menjalankan operasional CRM.
- Input server divalidasi Zod. Harga produk dan total transaksi dibaca/dihitung ulang pada server dalam transaksi database.
- Pelanggan dan produk dihapus secara lunak. Item transaksi menyimpan snapshot nama dan harga.
- Uang disimpan sebagai integer rupiah.

## Keterbatasan MVP

- Satu membership/workspace aktif per pengguna; pemilih multi-workspace belum tersedia.
- Undangan staff, import CSV, inventory, broadcast WhatsApp, dan payment gateway belum termasuk MVP.
- Rate limiting sebaiknya diterapkan di reverse proxy/Supabase sebelum deployment publik.
