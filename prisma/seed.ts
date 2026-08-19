import { PrismaClient } from "../lib/generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { CATEGORIES, SIZES, PRODUCTS } from "./seed-data";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("→ در حال پاک کردن داده‌های قبلی...");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.size.deleteMany();
  await prisma.discountCode.deleteMany();

  console.log("→ در حال ساخت سایزها...");
  const sizeIds: string[] = [];
  for (const size of SIZES) {
    const created = await prisma.size.create({ data: size });
    sizeIds.push(created.id);
  }

  console.log("→ در حال ساخت دسته‌بندی‌ها...");
  const categoryBySlug = new Map<string, string>();
  for (const cat of CATEGORIES) {
    const created = await prisma.category.create({ data: cat });
    categoryBySlug.set(cat.slug, created.id);
  }

  console.log("→ در حال ساخت محصولات...");
  for (const p of PRODUCTS) {
    const categoryId = categoryBySlug.get(p.categorySlug);
    if (!categoryId) continue;

    await prisma.product.create({
      data: {
        slug: p.slug,
        name: p.name,
        description: p.description,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        categoryId,
        isNew: p.isNew ?? false,
        isFeatured: p.isFeatured ?? false,
        variants: {
          create: sizeIds.map((sizeId) => ({
            sizeId,
            stock: Math.floor(Math.random() * 12) + 3,
          })),
        },
      },
    });
  }

  console.log("→ در حال ساخت کد تخفیف نمونه...");
  await prisma.discountCode.create({
    data: {
      code: "HASHOR10",
      type: "PERCENTAGE",
      value: 10,
      isActive: true,
    },
  });

  console.log("→ در حال ساخت تنظیمات پیش‌فرض سایت...");
  await prisma.siteSetting.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

  console.log("✓ seed کامل شد.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
