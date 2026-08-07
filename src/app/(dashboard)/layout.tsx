import { requireContext } from "@/lib/auth"; import { Sidebar } from "@/components/layout/sidebar";
export default async function DashboardLayout({children}:{children:React.ReactNode}){const ctx=await requireContext();return <div className="min-h-dvh"><Sidebar workspace={ctx.workspace.name}/><main id="main" className="mx-auto max-w-[1440px] p-4 lg:ml-[248px] lg:p-8">{children}</main></div>}
