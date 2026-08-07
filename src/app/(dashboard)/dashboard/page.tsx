import { db } from "@/db/client";
import { requireContext } from "@/lib/auth";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { formatRupiah } from "@/lib/utils";
import { Users,UserPlus,ReceiptText,WalletCards } from "lucide-react";

export default async function Dashboard(){
  const ctx=await requireContext(),now=new Date(),since=new Date(now.getTime()-30*864e5),monthStart=new Date(now.getFullYear(),now.getMonth(),1);
  const [customers,newCustomers,transactions,paid,overdue,topCustomers]=await Promise.all([
    db.customer.count({where:{workspaceId:ctx.workspaceId,deletedAt:null}}),
    db.customer.count({where:{workspaceId:ctx.workspaceId,deletedAt:null,createdAt:{gte:monthStart}}}),
    db.transaction.count({where:{workspaceId:ctx.workspaceId,transactedAt:{gte:monthStart}}}),
    db.transaction.findMany({where:{workspaceId:ctx.workspaceId,status:"PAID",transactedAt:{gte:since}},select:{total:true,transactedAt:true,items:{select:{productNameSnapshot:true,quantity:true,lineTotal:true}}}}),
    db.followUp.findMany({where:{workspaceId:ctx.workspaceId,status:"PENDING",dueAt:{lt:now}},include:{customer:true},orderBy:{dueAt:"asc"},take:5}),
    db.customer.findMany({where:{workspaceId:ctx.workspaceId,deletedAt:null},orderBy:{totalSpend:"desc"},take:5})
  ]);
  const revenue=paid.reduce((sum,item)=>sum+item.total,0),chart=new Map<string,number>(),productTotals=new Map<string,{quantity:number;revenue:number}>();
  for(let i=29;i>=0;i--){const date=new Date(now.getTime()-i*864e5);chart.set(date.toLocaleDateString("id-ID",{day:"2-digit",month:"short"}),0)}
  paid.forEach(transaction=>{
    const key=transaction.transactedAt.toLocaleDateString("id-ID",{day:"2-digit",month:"short"});chart.set(key,(chart.get(key)||0)+transaction.total);
    transaction.items.forEach(item=>{const current=productTotals.get(item.productNameSnapshot)||{quantity:0,revenue:0};current.quantity+=item.quantity;current.revenue+=item.lineTotal;productTotals.set(item.productNameSnapshot,current)})
  });
  const topProducts=[...productTotals].sort((a,b)=>b[1].revenue-a[1].revenue).slice(0,5);
  const metrics=[{label:"Total pelanggan",value:customers,icon:Users},{label:"Pelanggan baru",value:newCustomers,icon:UserPlus},{label:"Transaksi bulan ini",value:transactions,icon:ReceiptText},{label:"Pendapatan 30 hari",value:formatRupiah(revenue),icon:WalletCards}];
  return <>
    <PageHeader title={`Selamat datang, ${ctx.user.name.split(" ")[0]}`} description="Berikut kondisi usaha Anda hari ini."/>
    <section aria-label="Metrik utama" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(({label,value,icon:Icon})=><Card key={label} className="p-5"><div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">{label}</span><span className="grid size-10 place-items-center rounded-lg bg-blue-50 text-primary"><Icon size={19}/></span></div><strong className="mt-3 block text-2xl font-bold tabular-nums">{value}</strong></Card>)}</section>
    <div className="mt-5 grid gap-5 xl:grid-cols-[1.7fr_1fr]">
      <Card className="p-5"><h2 className="text-lg font-semibold">Tren pendapatan</h2><p className="text-sm text-muted-foreground">30 hari terakhir, transaksi lunas</p><RevenueChart data={[...chart].map(([date,value])=>({date,revenue:value}))}/></Card>
      <Card className="p-5"><h2 className="text-lg font-semibold">Follow-up terlambat</h2><div className="mt-3 space-y-3">{overdue.map(item=><div key={item.id} className="border-t pt-3"><strong className="text-sm">{item.customer.name}</strong><p className="text-xs text-muted-foreground">{item.type}</p></div>)}{!overdue.length&&<p className="mt-6 text-sm text-muted-foreground">Semua follow-up terkendali. Bagus!</p>}</div></Card>
      <Card className="p-5"><h2 className="text-lg font-semibold">Produk terlaris</h2><div className="mt-3 space-y-3">{topProducts.map(([name,total],index)=><div key={name} className="flex items-center justify-between border-t pt-3 text-sm"><div><span className="text-xs text-muted-foreground">#{index+1}</span><strong className="ml-2">{name}</strong><p className="text-xs text-muted-foreground">{total.quantity} item terjual</p></div><strong className="tabular-nums">{formatRupiah(total.revenue)}</strong></div>)}{!topProducts.length&&<p className="text-sm text-muted-foreground">Belum ada penjualan produk.</p>}</div></Card>
      <Card className="p-5"><h2 className="text-lg font-semibold">Pelanggan teratas</h2><div className="mt-3 space-y-3">{topCustomers.map((customer,index)=><div key={customer.id} className="flex items-center justify-between border-t pt-3 text-sm"><span><span className="mr-2 text-xs text-muted-foreground">#{index+1}</span><strong>{customer.name}</strong></span><strong className="tabular-nums">{formatRupiah(customer.totalSpend)}</strong></div>)}</div></Card>
    </div>
  </>;
}
