// lib/product/map-product-card.ts
// Shared product shape for ProductCard (category listings + Explore The Collection)

export function mapProductCardData(items: any[]) {
  return (items || []).map((p: any) => {
    const basePrice = Number(p.min_offered_price || p.base_price || 0);
    const salePrice = Number(p.sale_price || basePrice);
    const rawSave = basePrice - salePrice;

    let offBadge = "";
    if (rawSave > 0) {
      if (p.discount_type === "percentage" || p.discount_type === "Bulk") {
        offBadge =
          p.discount_value && p.discount_value !== "NaN"
            ? `${p.discount_value}% OFF`
            : `${Math.round((rawSave / basePrice) * 100)}% OFF`;
      } else if (p.discount_type === "fixed") {
        offBadge = `€${p.discount_value} OFF`;
      } else {
        offBadge = `${Math.round((rawSave / basePrice) * 100)}% OFF`;
      }
    }

    return {
      ...p,
      id: p.id,
      name: p.name,
      image: p.image,
      // Keep catalog base_price (flash / ProductCard VAT + discount need this)
      base_price: Number(p.base_price || 0),
      min_offered_price:
        p.min_offered_price != null && p.min_offered_price !== ""
          ? Number(p.min_offered_price)
          : null,
      oldPrice: rawSave > 0 ? basePrice : null,
      off: offBadge,
      description: p.description || "",
      seller_name: p.seller_name || null,
    };
  });
}
