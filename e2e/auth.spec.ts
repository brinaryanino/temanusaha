import { test,expect } from "@playwright/test";

async function login(page:import("@playwright/test").Page,email:string,password:string){
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Kata sandi").fill(password);
  await page.getByRole("button",{name:"Masuk"}).click();
  await expect(page).toHaveURL(/\/dashboard/,{timeout:30_000});
}

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

test("Supabase menerima permintaan email pemulihan",async({page})=>{
  test.setTimeout(60_000);
  await page.goto("/forgot-password");
  await page.getByLabel("Email").fill("owner@temanusaha.local");
  await page.getByRole("button",{name:"Kirim tautan pemulihan"}).click();
  await expect(page.getByText("Jika email terdaftar, tautan pemulihan telah dikirim",{exact:true})).toBeVisible({timeout:30_000});
});


test("halaman privat mengarahkan pengguna tanpa sesi ke login",async({page})=>{
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login/);
});

test("owner dapat masuk dan melihat dashboard dari data Supabase",async({page})=>{
  await login(page,"owner@temanusaha.local","DemoOwner123!");
  await expect(page.getByRole("heading",{name:/Selamat datang, Ayu/})).toBeVisible({timeout:30_000});
  await expect(page.getByText("Total pelanggan")).toBeVisible({timeout:30_000});
});

test("staff dapat masuk dan mengakses operasional CRM",async({page})=>{
  await login(page,"staff@temanusaha.local","DemoStaff123!");
  await page.goto("/customers");
  await expect(page.getByRole("heading",{name:"Pelanggan"})).toBeVisible({timeout:30_000});
  await page.goto("/products");
  await expect(page.getByRole("heading",{name:"Produk & layanan"})).toBeVisible({timeout:30_000});
});

test("owner mencatat pelanggan, produk, dan transaksi",async({page})=>{
  test.setTimeout(150_000);
  const suffix=Date.now().toString().slice(-7),customer=`Pelanggan E2E ${suffix}`,product=`Produk E2E ${suffix}`;
  await login(page,"owner@temanusaha.local","DemoOwner123!");
  await page.goto("/customers/new");
  await page.getByLabel("Nama pelanggan *").fill(customer);
  await page.getByLabel("Nomor WhatsApp").fill(`08123${suffix}`);
  await page.getByRole("button",{name:"Simpan pelanggan"}).click();
  await expect(page).toHaveURL(/\/customers\?success=/,{timeout:30_000});
  await page.goto("/products");
  await page.getByLabel("Nama *").fill(product);
  await page.getByLabel("Harga (Rp) *").fill("25000");
  await page.getByRole("button",{name:"Simpan item"}).click();
  await expect(page.getByText("Produk berhasil ditambahkan",{exact:true})).toBeVisible({timeout:30_000});
  await page.goto("/transactions/new");
  await page.getByLabel("Pelanggan *").selectOption({label:customer});
  await page.getByLabel("Produk item 1").selectOption({label:`${product} — Rp 25.000`});
  await page.getByLabel("Jumlah item 1").fill("2");
  await page.getByRole("button",{name:"Simpan transaksi"}).click();
  await expect(page).toHaveURL(/\/transactions\/[0-9a-f-]+\?success=/,{timeout:45_000});
  await expect(page.getByText(customer)).toBeVisible({timeout:30_000});
  await expect(page.getByText("Rp 50.000",{exact:true}).first()).toBeVisible({timeout:30_000});
});
