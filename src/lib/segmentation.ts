export type SegmentCustomer = { transactionCount: number; totalSpend: number; lastPurchaseAt: Date | null; status?: string };
export function getSegment(customer: SegmentCustomer, now = new Date()) {
  if (customer.status === "PROSPECT" || customer.transactionCount === 0) return "Prospek";
  const inactiveDays = customer.lastPurchaseAt ? (now.getTime() - customer.lastPurchaseAt.getTime()) / 86_400_000 : Infinity;
  if (inactiveDays > 60) return "Tidak aktif";
  if (customer.totalSpend >= 5_000_000) return "Bernilai tinggi";
  if (customer.transactionCount >= 3) return "Loyal";
  return "Baru";
}
