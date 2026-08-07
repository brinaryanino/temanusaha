TemanUsaha CRM — Design System

Arah Visual

Profesional, hangat, sederhana, dan mudah dipahami pemilik UMKM. Deep blue menyampaikan kepercayaan; green menyampaikan pertumbuhan dan sukses.

Color Tokens

--background:#F8FAFC; --surface:#FFFFFF; --surface-muted:#F1F5F9;
--foreground:#0F172A; --muted-foreground:#64748B; --primary:#1D4ED8;
--primary-hover:#1E40AF; --success:#16A34A; --warning:#D97706;
--danger:#DC2626; --border:#E2E8F0; --info:#0284C7;

Pastikan kontras WCAG AA dan jangan memakai warna sebagai satu-satunya penanda status.

Typography

Inter atau Geist Sans. Display 30/700, page title 24/700, section title 18/600, body 14–16px, caption 12px, dan metric number 28/700.

Spacing dan Layout

Skala 4px: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64. Sidebar desktop 248px, content max-width 1440px, padding desktop 32px/mobile 16px, radius card 12px, radius input/button 8px. Grid metric 4 kolom desktop, 2 tablet, 1 mobile.

Komponen

Button: primary, secondary, outline, ghost, destructive; tinggi 40px; wajib ada disabled/loading.

Input: label terlihat, helper/error text, format nomor WhatsApp, bukan placeholder-only.

Card: border tipis; shadow hanya untuk elemen floating.

Badge: green success, amber pending/overdue, red danger, blue informational.

Table: search, filter, sorting, pagination, row action; berubah menjadi card list di mobile.

Drawer untuk form cepat; modal untuk konfirmasi destruktif.

Toast untuk feedback singkat, error juga ditampilkan dekat field.

Halaman

Dashboard berisi metric, chart, follow-up, dan top customers. Customers berisi search/filter/table. Detail customer berisi profile, transaksi, dan follow-up. Transactions berisi filter dan create drawer. Follow-ups memakai tab overdue/today/upcoming/completed.

UX dan Accessibility

Setiap halaman memiliki loading skeleton, empty state dengan CTA, error state dengan retry, dan success feedback. Mobile-first, keyboard accessible, focus ring terlihat, icon memiliki label, dan touch target minimal 40px.