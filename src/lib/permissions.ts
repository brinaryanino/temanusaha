import type { Role } from "@prisma/client";
export type Permission="manage_crm"|"export_data"|"manage_members";
export function hasPermission(role:Role,permission:Permission){if(role==="OWNER")return true;return permission==="manage_crm";}
