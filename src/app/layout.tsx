import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
const geist = Geist({ subsets:["latin"], display:"swap" });
export const metadata:Metadata={title:"TemanUsaha CRM",description:"CRM sederhana untuk UMKM Indonesia"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="id"><body className={geist.className}><a href="#main" className="sr-only focus:not-sr-only">Lewati ke konten</a>{children}</body></html>}
