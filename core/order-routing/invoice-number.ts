/**
 * Invoice number for PDF display — derived from the order number, not stored in the DB.
 * e.g. ORD-20260000000001 → INV-20260000000001
 */
export function invoiceNumberFromOrderNumber(orderNumber: string): string {
  const normalized = String(orderNumber ?? "").trim().replace(/^#+\s*/, "");
  if (!normalized) {
    return "INV-UNKNOWN";
  }

  if (/^ORD[-_\s]/i.test(normalized)) {
    return normalized.replace(/^ORD[-_\s]*/i, "INV-");
  }

  return `INV-${normalized}`;
}
