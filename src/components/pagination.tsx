import Link from "next/link";

export function Pagination({page,total,pageSize,params={},pageParam="page"}:{page:number;total:number;pageSize:number;params?:Record<string,string|undefined>;pageParam?:string}){
  const pages=Math.max(1,Math.ceil(total/pageSize));
  const href=(nextPage:number)=>`?${new URLSearchParams({...Object.fromEntries(Object.entries(params).filter(([,value])=>value!==undefined)) as Record<string,string>,[pageParam]:String(nextPage)}).toString()}`;
  return <nav aria-label="Paginasi" className="mt-4 flex items-center justify-between text-sm"><span>Halaman {page} dari {pages}</span><div className="flex gap-2">{page>1&&<Link className="rounded-lg border bg-white px-3 py-2 font-medium" href={href(page-1)}>Sebelumnya</Link>}{page<pages&&<Link className="rounded-lg border bg-white px-3 py-2 font-medium" href={href(page+1)}>Berikutnya</Link>}</div></nav>;
}
