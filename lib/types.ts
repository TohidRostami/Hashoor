export type CategoryDTO = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  image: string | null;
  sortOrder: number;
};

export type ProductImageDTO = {
  id: string;
  url: string;
  alt: string | null;
};

export type ProductDTO = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  isNew: boolean;
  isFeatured: boolean;
  isPublished: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  category: CategoryDTO;
  images: ProductImageDTO[];
};

export type SizeDTO = {
  id: string;
  name: string;
  description: string | null;
  sortOrder: number;
};

export type ProductVariantDTO = {
  id: string;
  sizeId: string | null;
  size: SizeDTO | null;
  color: string | null;
  colorHex: string | null;
  stock: number;
};

export type ProductDetailDTO = ProductDTO & {
  variants: ProductVariantDTO[];
};
