TemanUsaha CRM — PRD

Ringkasan

TemanUsaha CRM adalah SaaS untuk UMKM makanan/minuman, toko online, jasa lokal, laundry, salon, dan freelancer. Produk membantu pemilik menyimpan data pelanggan, mencatat transaksi, memahami segmentasi pelanggan, dan melakukan follow-up melalui WhatsApp.

Tujuan

Menggantikan pencatatan yang tersebar di WhatsApp, buku, dan spreadsheet.

Mengetahui pelanggan baru, loyal, tidak aktif, dan bernilai tinggi.

Mengurangi pelanggan yang terlupakan melalui reminder follow-up.

Non-goals MVP

Broadcast WhatsApp otomatis, payment gateway, akuntansi penuh, inventory kompleks, multi-cabang, dan aplikasi mobile native.

Persona dan User Stories

Pemilik UMKM: melihat ringkasan penjualan, pelanggan, dan follow-up.

Admin/karyawan: menambah pelanggan, produk, transaksi, dan menyelesaikan follow-up.

Sebagai pemilik, saya ingin melihat total pelanggan, transaksi, pendapatan, dan pelanggan baru.

Sebagai admin, saya ingin mencatat pelanggan dan riwayat pembeliannya.

Sebagai pemilik, saya ingin melihat pelanggan yang sudah lama tidak membeli.

Sebagai pengguna, saya ingin membuat follow-up dan membuka chat WhatsApp pelanggan.

Sebagai pemilik, saya ingin mengekspor data pelanggan dan transaksi.

Fitur MVP

Authentication dan workspace

Register, login, logout, reset password, serta role owner dan staff. Semua data terisolasi per workspace.

Dashboard

Metric cards, grafik pendapatan, produk terlaris, pelanggan teratas, dan follow-up jatuh tempo.

Pelanggan

CRUD nama, nomor WhatsApp, email, alamat, sumber, status, tag, dan catatan. Sediakan pencarian, filter, pagination, serta halaman detail berisi lifetime value dan timeline transaksi.

Produk dan transaksi

CRUD produk/layanan. Transaksi mendukung banyak item, diskon, status draft/paid/cancelled, metode pembayaran, dan kalkulasi total server-side.

Follow-up

Tugas dengan pelanggan, tanggal, tipe, catatan, dan status. Filter overdue/today/upcoming/completed serta tombol deep link WhatsApp.

Segmentasi dan laporan

Segmentasi new, loyal, inactive, high-value, dan prospect. Laporan pendapatan, transaksi, produk terlaris, pelanggan teratas, serta export CSV.

Acceptance Criteria

Halaman privat tidak bisa diakses tanpa session.

Semua query bisnis memakai workspace_id.

Total transaksi tidak dapat dimanipulasi dari client.

Follow-up overdue muncul di dashboard.

Semua form memiliki validasi, loading, error, empty state, dan success feedback.

UI usable pada mobile, tablet, dan desktop.

Prioritas

P0: auth, pelanggan, produk, transaksi, dashboard, follow-up, role access, responsive UI.

P1: import CSV, custom tags, PDF report, multi-workspace, audit log.

P2: WhatsApp API resmi, loyalty points, AI recommendation, multi-cabang.

Metrics dan Risiko

Activation diukur dari pelanggan dan transaksi pertama; metrik berikutnya weekly active workspaces, follow-up selesai, dan repeat purchase rate. Data pelanggan harus dilindungi dengan auth, authorization, HTTPS, dan penyimpanan data minimal. Mulai WhatsApp dengan deep link karena API resmi memiliki persyaratan tersendiri.