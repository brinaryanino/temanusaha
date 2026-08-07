import { redirect } from "next/navigation";
import { hasPermission, type Permission } from "@/lib/permissions";
import { db } from "@/db/client";
import { createSupabaseServerClient } from "@/lib/supabase/server";
export async function requireContext() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const membership = await db.membership.findFirst({ where: { userId: user.id }, include: { workspace: true, user: true } });
  if (!membership) redirect("/onboarding");
  return { userId: user.id, workspaceId: membership.workspaceId, role: membership.role, workspace: membership.workspace, user: membership.user };
}
export async function requirePermission(permission:Permission) { const context = await requireContext(); if (!hasPermission(context.role,permission)) throw new Error("Akses ditolak"); return context; }
export async function requireOwner() { return requirePermission("export_data"); }
