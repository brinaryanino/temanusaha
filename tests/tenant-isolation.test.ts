import { PrismaClient } from "@prisma/client";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const db = new PrismaClient();
const suffix = crypto.randomUUID().slice(0, 8);
const workspaceA = `aaaaaaaa-0000-4000-8000-${suffix.padEnd(12, "0")}`;
const workspaceB = `bbbbbbbb-0000-4000-8000-${suffix.padEnd(12, "0")}`;
let foreignCustomerId = "";

describe("isolasi tenant PostgreSQL", () => {
  beforeAll(async () => {
    await db.workspace.createMany({
      data: [
        { id: workspaceA, name: "Workspace Isolasi A", slug: `isolation-a-${suffix}` },
        { id: workspaceB, name: "Workspace Isolasi B", slug: `isolation-b-${suffix}` },
      ],
    });
    const foreignCustomer = await db.customer.create({
      data: { workspaceId: workspaceB, name: "Pelanggan Workspace B", status: "ACTIVE" },
    });
    foreignCustomerId = foreignCustomer.id;
  }, 30_000);

  afterAll(async () => {
    await db.workspace.deleteMany({ where: { id: { in: [workspaceA, workspaceB] } } });
    await db.$disconnect();
  }, 30_000);

  it("workspace lain tidak dapat membaca pelanggan berdasarkan id", async () => {
    const result = await db.customer.findFirst({
      where: { id: foreignCustomerId, workspaceId: workspaceA },
    });
    expect(result).toBeNull();
  }, 30_000);

  it("workspace lain tidak dapat memperbarui pelanggan berdasarkan id", async () => {
    const result = await db.customer.updateMany({
      where: { id: foreignCustomerId, workspaceId: workspaceA },
      data: { name: "Tidak boleh berubah" },
    });
    expect(result.count).toBe(0);
    const unchanged = await db.customer.findUniqueOrThrow({ where: { id: foreignCustomerId } });
    expect(unchanged.name).toBe("Pelanggan Workspace B");
  }, 30_000);
});
