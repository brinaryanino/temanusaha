import Link from "next/link";
import { db } from "@/db/client";
import { requireContext } from "@/lib/auth";
import { getSegment } from "@/lib/segmentation";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate,formatRupiah } from "@/lib/utils";

const segmentNames=["Semua","Baru","Loyal","Tidak aktif","Bernilai tinggi","Prospek"] as const;
export default async function Segments({searchParams}:{searchParams:Promise<{segment?:string;page?:string}>}){
  const ctx=await requireContext(),params=await searchParams,selected=segmentNames.includes(params.segment as typeof segmentNames[number])?params.segment||"Semua":"Semua",page=Math.max(1,Number(params.page)||1),pageSize=12;
  const customers=await db.customer.findMany({where:{workspaceId:ctx.workspaceId,deletedAt:null},orderBy:{createdAt:"desc"}});
  const segmented=customers.map(customer=>({customer,segment:getSegment(customer)})),filtered=selected==="Semua"?segmented:segmented.filter(item=>item.segment===selected),rows=filtered.slice((page-1)*pageSize,page*pageSize),pages=Math.max(1,Math.ceil(filtered.length/pageSize));
  return <>
    <PageHeader title="Segmentasi pelanggan" description="Kenali pelanggan yang perlu dipertahankan, diaktifkan kembali, atau ditindaklanjuti."/>
    <nav aria-label="Filter segmen" className="mb-5 flex gap-2 overflow-x-auto">{segmentNames.map(segment=><Link key={segment} href={`?segment=${encodeURIComponent(segment)}`} className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold ${selected===segment?"bg-primary text-white":"border bg-white"}`}>{segment}<span className="ml-2 text-xs opacity-75">{segment==="Semua"?segmented.length:segmented.filter(item=>item.segment===segment).length}</span></Link>)}</nav>
    {rows.length?<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{rows.map(({customer,segment})=><Link key={customer.id} href={`/customers/${customer.id}`}><Card className="h-full p-4 transition-colors hover:bg-surface-muted"><div className="flex items-start justify-between gap-3"><strong>{customer.name}</strong><Badge tone={segment==="Loyal"||segment==="Bernilai tinggi"?"success":segment==="Tidak aktif"?"warning":"info"}>{segment}</Badge></div><dl className="mt-4 grid grid-cols-2 gap-3 text-sm"><div><dt className="text-xs text-muted-foreground">Total belanja</dt><dd className="font-semibold tabular-nums">{formatRupiah(customer.totalSpend)}</dd></div><div><dt className="text-xs text-muted-foreground">Pembelian terakhir</dt><dd>{customer.lastPurchaseAt?formatDate(customer.lastPurchaseAt):"Belum ada"}</dd></div></dl></Card></Link>)}</div>:<Card className="p-12 text-center text-muted-foreground">Belum ada pelanggan pada segmen ini.</Card>}
    <div className="mt-5 flex items-center justify-between text-sm"><span>Halaman {page} dari {pages}</span><div className="flex gap-2">{page>1&&<Link className="rounded-lg border bg-white px-3 py-2" href={`?segment=${encodeURIComponent(selected)}&page=${page-1}`}>Sebelumnya</Link>}{page<pages&&<Link className="rounded-lg border bg-white px-3 py-2" href={`?segment=${encodeURIComponent(selected)}&page=${page+1}`}>Berikutnya</Link>}</div></div>
  </>;
}
