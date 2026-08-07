import { test,expect } from "@playwright/test";

test("alur navigasi autentikasi publik",async({page})=>{
  await page.goto("/login");
  await expect(page.getByRole("heading",{name:"Selamat datang kembali"})).toBeVisible();
  await page.getByRole("link",{name:"Lupa kata sandi?"}).click();
  await expect(page).toHaveURL(/\/forgot-password/);
  await expect(page.getByRole("heading",{name:"Pulihkan kata sandi"})).toBeVisible();
  await page.getByRole("link",{name:"Kembali ke halaman masuk"}).click();
  await page.getByRole("link",{name:"Daftar gratis"}).click();
  await expect(page.getByRole("heading",{name:"Mulai kelola pelanggan"})).toBeVisible();
});

test("halaman privat mengarahkan pengguna tanpa sesi ke login",async({page})=>{
  test.skip(!process.env.NEXT_PUBLIC_SUPABASE_URL||!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,"Memerlukan proyek Supabase untuk memvalidasi sesi");
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login/);
});
