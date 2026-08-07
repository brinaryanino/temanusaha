export type PriceItem = { unitPrice: number; quantity: number };
export function calculateTransaction(items: PriceItem[], discount = 0) {
  if (!Number.isInteger(discount) || discount < 0) throw new Error("Diskon tidak valid");
  const subtotal = items.reduce((sum, item) => {
    if (!Number.isInteger(item.unitPrice) || item.unitPrice <= 0 || !Number.isInteger(item.quantity) || item.quantity <= 0) throw new Error("Item tidak valid");
    return sum + item.unitPrice * item.quantity;
  }, 0);
  if (!items.length || discount > subtotal) throw new Error("Total transaksi tidak valid");
  return { subtotal, discount, total: subtotal - discount };
}
