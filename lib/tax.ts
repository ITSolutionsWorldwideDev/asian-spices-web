/** Resolve VAT rate: category rule → global rule → 21%. */
export function resolveTaxRate(
  taxRules: { category_id: string | null; tax_rate: string }[],
  categoryId?: string | null,
  options?: { loaded?: boolean },
): number {
  // Avoid the temporary 21% flash before /api/tax-rules finishes
  if (options?.loaded === false) return 0;

  const matching = taxRules.find(
    (r) =>
      r.category_id != null &&
      categoryId &&
      String(r.category_id) === String(categoryId),
  );
  if (matching) {
    const rate = parseFloat(matching.tax_rate);
    if (Number.isFinite(rate)) return rate / 100;
  }

  const global = taxRules.find((r) => r.category_id === null);
  if (global) {
    const rate = parseFloat(global.tax_rate);
    if (Number.isFinite(rate)) return rate / 100;
  }

  // Fallback only when rules are loaded and neither category nor global exists
  return 0.21;
}
