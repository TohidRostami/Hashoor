"use server";

import { searchProducts } from "@/lib/queries/products";
import type { ProductDTO } from "@/lib/types";

export async function searchProductsAction(
  query: string,
): Promise<ProductDTO[]> {
  return searchProducts(query);
}
