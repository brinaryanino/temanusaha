import { notFound } from "next/navigation";
import { db } from "@/db/client";
import { requireContext } from "@/lib/auth";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CustomerForm } from "@/components/forms/customer-form";
import { addCustomerTag, addInteraction, deleteCustomer, removeCustomerTag, updateCustomer } from "@/server/actions/crm";
import { formatDate, formatRupiah } from "@/lib/utils";
import { getSegment } from "@/lib/segmentation";
import { X } from "lucide-react";

export default async function CustomerDetail({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{success?:string;error?:string}>}) {
  const ctx=await requireContext(), {id}=await params, p=await searchParams;
  const customer=await db.customer.findFirst({
    where:{id,workspaceId:ctx.workspaceId,deletedAt:null},
    include:{
      transactions:{orderBy:{transactedAt:"desc"},take:5},
      followUps:{orderBy:{dueAt:"desc"},take:5},
      tags:{include:{tag:true},orderBy:{createdAt:"asc"}},
      interactions:{include:{user:{select:{name:true}}},orderBy:{occurredAt:"desc"},take:20}
    }
  });
  if(!customer) notFound();
  return <>
    <PageHeader title={customer.name} description={`${getSegment(customer)} • Pelanggan sejak ${formatDate(customer.createdAt)}`}/>
    {(p.success||p.error)&&<p role="status" className={`mb-4 rounded-lg p-3 ${p.error?"bg-red-50 text-red-700":"bg-green-50 text-green-700"}`}>{p.error||p.success}</p>}
    <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
      <div className="space-y-5">
        <Card className="p-5"><h2 className="mb-5 text-lg font-semibold">Informasi pelanggan</h2><CustomerForm action={updateCustomer.bind(null,customer.id)} customer={customer}/></Card>
        <Card className="p-5">
          <h2 className="text-lg font-semibold">Tag pelanggan</h2>
          <div className="mt-3 flex flex-wrap gap-2">{customer.tags.map(({tag})=><span key={tag.id} className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">{tag.name}<form action={removeCustomerTag.bind(null,customer.id,tag.id)}><button aria-label={`Hapus tag ${tag.name}`} className="grid size-7 place-items-center rounded-full hover:bg-blue-100"><X size={14}/></button></form></span>)}{!customer.tags.length&&<span className="text-sm text-muted-foreground">Belum ada tag.</span>}</div>
          <form action={addCustomerTag.bind(null,customer.id)} className="mt-4 flex gap-2"><label className="flex-1"><span className="sr-only">Tag baru</span><Input name="tag" placeholder="Contoh: VIP, reseller" required/></label><Button variant="outline">Tambah tag</Button></form>
        </Card>
        <Card className="p-5">
          <h2 className="text-lg font-semibold">Catat interaksi</h2>
          <form action={addInteraction.bind(null,customer.id)} className="mt-4 space-y-3"><label className="block text-sm font-medium">Jenis<select name="interactionType" className="mt-1 min-h-11 w-full rounded-lg border bg-white px-3"><option>Catatan</option><option>Telepon</option><option>WhatsApp</option><option>Kunjungan</option></select></label><label className="block text-sm font-medium">Isi interaksi<textarea name="content" required className="mt-1 min-h-24 w-full rounded-lg border p-3"/></label><Button>Simpan interaksi</Button></form>
          <div className="mt-6 space-y-4">{customer.interactions.map(item=><article key={item.id} className="border-t pt-4"><div className="flex justify-between gap-3 text-sm"><strong>{item.type}</strong><time className="text-xs text-muted-foreground">{formatDate(item.occurredAt)}</time></div><p className="mt-1 whitespace-pre-wrap text-sm">{item.content}</p><p className="mt-1 text-xs text-muted-foreground">Dicatat oleh {item.user.name}</p></article>)}{!customer.interactions.length&&<p className="text-sm text-muted-foreground">Belum ada interaksi yang dicatat.</p>}</div>
        </Card>
      </div>
      <div className="space-y-5">
        <Card className="p-5"><h2 className="font-semibold">Ringkasan pembelian</h2><dl className="mt-4 grid grid-cols-2 gap-4"><div><dt className="text-xs text-muted-foreground">Lifetime value</dt><dd className="mt-1 text-xl font-bold tabular-nums">{formatRupiah(customer.totalSpend)}</dd></div><div><dt className="text-xs text-muted-foreground">Transaksi</dt><dd className="mt-1 text-xl font-bold">{customer.transactionCount}</dd></div></dl></Card>
        <Card className="p-5"><h2 className="font-semibold">Transaksi terakhir</h2><div className="mt-3 space-y-3">{customer.transactions.length?customer.transactions.map(t=><div key={t.id} className="flex justify-between border-t pt-3 text-sm"><span>{t.invoiceNumber}</span><strong>{formatRupiah(t.total)}</strong></div>):<p className="text-sm text-muted-foreground">Belum ada transaksi.</p>}</div></Card>
        <Card className="p-5"><h2 className="font-semibold">Follow-up terbaru</h2><div className="mt-3 space-y-3">{customer.followUps.length?customer.followUps.map(f=><div key={f.id} className="border-t pt-3 text-sm"><strong>{f.type}</strong><p className="text-xs text-muted-foreground">{formatDate(f.dueAt)} • {f.status}</p></div>):<p className="text-sm text-muted-foreground">Belum ada follow-up.</p>}</div></Card>
        <Card className="p-5"><h2 className="font-semibold">Zona arsip</h2><p className="my-3 text-sm text-muted-foreground">Riwayat transaksi tetap tersimpan setelah pelanggan diarsipkan.</p><form action={deleteCustomer.bind(null,customer.id)}><button className="min-h-11 rounded-lg border border-red-200 px-4 font-semibold text-danger">Arsipkan pelanggan</button></form></Card>
      </div>
    </div>
  </>;
}
