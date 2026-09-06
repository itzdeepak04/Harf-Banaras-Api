export declare function calculatePriceWithTax(basePrice: number, taxPercentage: number): number;
export declare function calculateDiscount(basePrice: number, discountPercentage: number): number;
export declare function calculateFinalPrice(basePrice: number, discountPercentage: number, taxPercentage: number): number;
export declare function paginate<T>(items: T[], page?: number, limit?: number): {
    items: T[];
    total: number;
    page: number;
    limit: number;
};
