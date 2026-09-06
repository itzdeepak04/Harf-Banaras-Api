export declare class ProductQueryDto {
    search?: string;
    sareeType?: string;
    fabric?: string;
    occasion?: string;
    colour?: string;
    workIntensity?: string;
    minPrice?: string;
    maxPrice?: string;
    inStockOnly?: string;
    isNewArrival?: string;
    isBestSeller?: string;
    discountedOnly?: string;
    sort?: 'featured' | 'newest' | 'price_asc' | 'price_desc' | 'best_selling' | 'rating';
    page?: string;
    limit?: string;
    pageSize?: string;
    pageLimit?: string;
}
