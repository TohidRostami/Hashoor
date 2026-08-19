import { prisma } from "@/lib/db";
import type { CategoryDTO, ProductDTO, ProductDetailDTO } from "@/lib/types";
import { DEFAULT_PER_PAGE, type SortOption } from "../product-constants";

export type { SortOption };

const ORDER_BY: Record<SortOption, Record<string, "asc" | "desc">> = {
  newest: { createdAt: "desc" },
  "price-asc": { price: "asc" },
  "price-desc": { price: "desc" },
  bestseller: { isFeatured: "desc" },
};

export async function getCategories(): Promise<CategoryDTO[]> {
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
  return categories as unknown as CategoryDTO[];
}

export async function getCategoryBySlug(slug: string): Promise<CategoryDTO | null> {
  const category = await prisma.category.findUnique({ where: { slug } });
  return category as unknown as CategoryDTO | null;
}

export async function getFeaturedProducts(take = 4): Promise<ProductDTO[]> {
  const products = await prisma.product.findMany({
    where: { isPublished: true, isFeatured: true },
    include: { category: true, images: true },
    orderBy: { createdAt: "desc" },
    take,
  });
  return products as unknown as ProductDTO[];
}

export type GetProductsOptions = {
  categorySlug?: string;
  sort?: SortOption;
  query?: string;
  page?: number;
  perPage?: number;
};

export type GetProductsResult = {
  products: ProductDTO[];
  totalCount: number;
  page: number;
  perPage: number;
  totalPages: number;
};

export { PER_PAGE_OPTIONS, DEFAULT_PER_PAGE } from "../product-constants";

export async function getProducts(options: GetProductsOptions = {}): Promise<GetProductsResult> {
  const { categorySlug, sort = "newest", query } = options;
  const perPage = options.perPage && options.perPage > 0 ? options.perPage : DEFAULT_PER_PAGE;
  const page = options.page && options.page > 0 ? options.page : 1;
  const trimmedQuery = query?.trim();

  const where = {
    isPublished: true,
    ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    ...(trimmedQuery
      ? { OR: [{ name: { contains: trimmedQuery } }, { description: { contains: trimmedQuery } }] }
      : {}),
  };

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true, images: true },
      orderBy: ORDER_BY[sort],
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / perPage));

  return {
    products: products as unknown as ProductDTO[],
    totalCount,
    page: Math.min(page, totalPages),
    perPage,
    totalPages,
  };
}

export async function getProductBySlug(slug: string): Promise<ProductDetailDTO | null> {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: true,
      variants: { include: { size: true }, orderBy: { size: { sortOrder: "asc" } } },
    },
  });
  return product as unknown as ProductDetailDTO | null;
}

export async function getRelatedProducts(
  productId: string,
  categoryId: string,
  take = 4
): Promise<ProductDTO[]> {
  const products = await prisma.product.findMany({
    where: {
      isPublished: true,
      categoryId,
      NOT: { id: productId },
    },
    include: { category: true, images: true },
    take,
  });
  return products as unknown as ProductDTO[];
}

export async function searchProducts(query: string, take = 8): Promise<ProductDTO[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const products = await prisma.product.findMany({
    where: {
      isPublished: true,
      OR: [{ name: { contains: trimmed } }, { description: { contains: trimmed } }],
    },
    include: { category: true, images: true },
    take,
  });
  return products as unknown as ProductDTO[];
}
