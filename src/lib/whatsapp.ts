export function normalizeWhatsApp(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) return null;
  const normalized = digits.startsWith("0") ? `62${digits.slice(1)}` : digits.startsWith("62") ? digits : `62${digits}`;
  return normalized.length >= 10 && normalized.length <= 15 ? `+${normalized}` : null;
}
export function whatsappUrl(phone: string, message = "Halo, kami dari TemanUsaha ingin menghubungi Anda.") {
  const normalized = normalizeWhatsApp(phone);
  return normalized ? `https://wa.me/${normalized.slice(1)}?text=${encodeURIComponent(message)}` : null;
}
