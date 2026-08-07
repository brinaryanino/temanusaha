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
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login/);
});

test("owner dapat masuk dan melihat dashboard dari data Supabase",async({page})=>{
  await page.goto("/login");
  await page.getByLabel("Email").fill("owner@temanusaha.local");
  await page.getByLabel("Kata sandi").fill("DemoOwner123!");
  await page.getByRole("button",{name:"Masuk"}).click();
  await expect(page).toHaveURL(/\/dashboard/,{timeout:30_000});
  await expect(page.getByRole("heading",{name:/Selamat datang, Ayu/})).toBeVisible({timeout:30_000});
  await expect(page.getByText("Total pelanggan")).toBeVisible({timeout:30_000});
  await expect(page.getByText("20",{exact:true}).first()).toBeVisible({timeout:30_000});
});
