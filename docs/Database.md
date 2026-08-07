TemanUsaha CRM — Database Design

Database

PostgreSQL. Gunakan UUID, timestamp timezone-aware, foreign key, dan workspace_id pada seluruh tabel bisnis.

Relasi

users ──< memberships >── workspaces
workspaces ──< customers ──< transactions ──< transaction_items >── products
customers ──< follow_ups
customers ──< customer_tags >── tags
customers ──< interactions

Tabel

users: dikelola provider auth; id, email, name, created_at.

workspaces: id, name, slug, business_type, currency, timestamps.

memberships: id, workspace_id, user_id, role owner/staff, created_at; unique workspace/user.

customers: id, workspace_id, name, phone, email, address, source, status, notes, total_spend, transaction_count, last_purchase_at, timestamps, deleted_at.

products: id, workspace_id, name, description, category, price, is_active, timestamps, deleted_at.

transactions: id, workspace_id, customer_id, invoice_number, status, payment_method, subtotal, discount, total, notes, transacted_at, created_by, timestamps.

transaction_items: id, transaction_id, product_id, product_name_snapshot, unit_price, quantity, line_total.

follow_ups: id, workspace_id, customer_id, assigned_to, type, due_at, status, notes, completed_at, timestamps.

tags: id, workspace_id, name, color, created_at; unique workspace/name.

customer_tags: customer_id, tag_id, created_at; composite primary key.

interactions: id, workspace_id, customer_id, user_id, type, content, occurred_at, created_at.

Aturan Data

Simpan uang sebagai integer rupiah tanpa desimal. Quantity dan price harus positif. Total dihitung server-side. Simpan snapshot nama produk dan harga pada transaction_items agar histori tidak berubah. Normalisasi nomor ke E.164. Customer/product memakai soft delete; transaksi tidak dihapus fisik pada MVP.

Index

CREATE INDEX customers_workspace_name_idx ON customers(workspace_id, name);
CREATE INDEX customers_workspace_phone_idx ON customers(workspace_id, phone);
CREATE INDEX transactions_workspace_date_idx ON transactions(workspace_id, transacted_at DESC);
CREATE INDEX transactions_customer_date_idx ON transactions(customer_id, transacted_at DESC);
CREATE INDEX followups_workspace_due_idx ON follow_ups(workspace_id, status, due_at);
CREATE INDEX products_workspace_active_idx ON products(workspace_id, is_active);

Transaction Workflow

Validasi customer/product → buat transaction dan items dalam satu database transaction → hitung subtotal/discount/total → jika paid, update customer summary → commit → revalidate dashboard dan detail customer.

Tenant Isolation dan Migration

Ambil workspace dari session membership, bukan dari client. Aktifkan RLS bila memakai Supabase. Gunakan migration yang aman dan seed development berisi owner, staff, 20 customer, 10 product, transaksi 30 hari, dan follow-up overdue.