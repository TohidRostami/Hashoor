export type SortOption = "newest" | "price-asc" | "price-desc" | "bestseller";

export const PER_PAGE_OPTIONS = [8, 12, 24, 48] as const;
export const DEFAULT_PER_PAGE = 8;
