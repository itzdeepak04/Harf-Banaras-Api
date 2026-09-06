/**
 * Calculate price with tax
 */
export function calculatePriceWithTax(
  basePrice: number,
  taxPercentage: number,
): number {
  return basePrice + basePrice * (taxPercentage / 100);
}

/**
 * Calculate discount amount
 */
export function calculateDiscount(
  basePrice: number,
  discountPercentage: number,
): number {
  return basePrice * (discountPercentage / 100);
}

/**
 * Calculate final price after discount and tax
 */
export function calculateFinalPrice(
  basePrice: number,
  discountPercentage: number,
  taxPercentage: number,
): number {
  const afterDiscount = basePrice - calculateDiscount(basePrice, discountPercentage);
  return calculatePriceWithTax(afterDiscount, taxPercentage);
}

/**
 * Paginate array
 */
export function paginate<T>(
  items: T[],
  page: number = 1,
  limit: number = 10,
): { items: T[]; total: number; page: number; limit: number } {
  const total = items.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  return {
    items: items.slice(startIndex, endIndex),
    total,
    page,
    limit,
  };
}
