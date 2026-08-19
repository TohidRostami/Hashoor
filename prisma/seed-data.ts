export const CATEGORIES = [
  { slug: "shirts", title: "پیراهن", description: "پیراهن رسمی و کژوال", sortOrder: 1 },
  { slug: "tshirts", title: "تی‌شرت و پولوشرت", description: "روزمره و راحت", sortOrder: 2 },
  { slug: "pants", title: "شلوار", description: "کتان، پارچه‌ای و کژوال", sortOrder: 3 },
  { slug: "outerwear", title: "کاپشن و ژاکت", description: "برای فصل سرد", sortOrder: 4 },
  { slug: "shoes", title: "کفش", description: "رسمی و روزمره", sortOrder: 5 },
  { slug: "accessories", title: "اکسسوری", description: "کمربند، کلاه، شال‌گردن", sortOrder: 6 },
];

// Sizes are a store-wide, admin-managed list (see /admin/sizes) — seeded
// here with sensible defaults for clothing, but fully editable/extensible
// from the admin panel afterward (e.g. shoe sizes, one-size accessories).
export const SIZES: { name: string; description: string; sortOrder: number }[] = [
  { name: "S", description: "دور سینه ۸۸ تا ۹۲ سانتی‌متر", sortOrder: 1 },
  { name: "M", description: "دور سینه ۹۲ تا ۹۸ سانتی‌متر", sortOrder: 2 },
  { name: "L", description: "دور سینه ۹۸ تا ۱۰۴ سانتی‌متر", sortOrder: 3 },
  { name: "XL", description: "دور سینه ۱۰۴ تا ۱۱۰ سانتی‌متر", sortOrder: 4 },
];

export const PRODUCTS: {
  slug: string;
  name: string;
  categorySlug: string;
  price: number;
  compareAtPrice?: number;
  isNew?: boolean;
  isFeatured?: boolean;
  description: string;
}[] = [
  {
    slug: "pirahan-katan-sormei",
    name: "پیراهن کتان سرمه‌ای",
    categorySlug: "shirts",
    price: 1_890_000,
    isNew: true,
    isFeatured: true,
    description:
      "پیراهن آستین‌بلند از کتان خالص، برش راحت و یقه کلاسیک. مناسب استفاده روزمره یا نیمه‌رسمی. پارچه‌ی این پیراهن پیش از دوخت شسته شده تا بعد از اولین شست‌وشو تغییر اندازه ندهد.",
  },
  {
    slug: "pirahan-oxford-sefid",
    name: "پیراهن آکسفورد سفید",
    categorySlug: "shirts",
    price: 1_650_000,
    isFeatured: true,
    description:
      "پیراهن رسمی از پارچه آکسفورد، یقه کلاسیک و دوخت دقیق برای استفاده اداری. یکی از پایه‌ای‌ترین تکه‌های هر کمد لباس مردانه.",
  },
  {
    slug: "tishert-basic-yaghegerd",
    name: "تی‌شرت بیسیک یقه‌گرد",
    categorySlug: "tshirts",
    price: 690_000,
    description:
      "تی‌شرت نخی سنگین با یقه‌گرد و برش تنه‌راحت، مناسب پوشیدن روزانه یا زیرپوش کاپشن در فصل سرد.",
  },
  {
    slug: "poloshirt-pike",
    name: "پولوشرت پیکه طوسی",
    categorySlug: "tshirts",
    price: 890_000,
    isNew: true,
    description:
      "پولوشرت از پارچه پیکه با یقه دکمه‌دار، برای پوشش نیمه‌رسمی روزمره. سه دکمه‌ی صدفی و یقه‌ی بدون افتادگی.",
  },
  {
    slug: "shalvar-chino-zoghali",
    name: "شلوار چینو زغالی",
    categorySlug: "pants",
    price: 1_450_000,
    isFeatured: true,
    description:
      "شلوار چینو با برش مستقیم و کمر راحت، از پارچه‌ای با افت مناسب که در طول روز شکل خود را حفظ می‌کند.",
  },
  {
    slug: "shalvar-katan-khaki",
    name: "شلوار کتان خاکی",
    categorySlug: "pants",
    price: 1_390_000,
    description: "شلوار کتان سبک برای فصل گرم، برش کژوال و راحت با دو جیب کناری و دو جیب پشت.",
  },
  {
    slug: "zhaket-pashmi-tosi",
    name: "ژاکت پشمی طوسی",
    categorySlug: "outerwear",
    price: 3_200_000,
    compareAtPrice: 3_650_000,
    isFeatured: true,
    description:
      "ژاکت پشمی گرم با پوشش کامل، مناسب فصل سرد و لایه‌ی میانی زمستان. یقه‌ی ایستاده و بسته‌شدن با زیپ کامل.",
  },
  {
    slug: "kaposhen-safari",
    name: "کاپشن سافاری زیتونی",
    categorySlug: "outerwear",
    price: 2_890_000,
    isNew: true,
    description:
      "کاپشن سبک با جیب‌های کاربردی، مناسب اواخر پاییز و اوایل بهار. آستر داخلی برای راحتی بیشتر.",
  },
  {
    slug: "kafsh-charm-classic",
    name: "کفش چرم کلاسیک",
    categorySlug: "shoes",
    price: 2_750_000,
    isFeatured: true,
    description:
      "کفش چرم طبیعی با دوخت دستی، مناسب پوشش رسمی و نیمه‌رسمی. زیره‌ی ضدلغزش با راحتی مناسب پوشیدن طولانی.",
  },
  {
    slug: "kafsh-casual-canvas",
    name: "کفش کژوال کنواس",
    categorySlug: "shoes",
    price: 1_190_000,
    description: "کفش سبک روزمره با رویه‌ی کنواس و زیره راحت، برای استفاده روزانه.",
  },
  {
    slug: "kamarband-charm-meshki",
    name: "کمربند چرم مشکی",
    categorySlug: "accessories",
    price: 590_000,
    description: "کمربند چرم طبیعی با سگک فلزی ساده، مناسب استفاده روزانه با پیراهن یا شلوار رسمی.",
  },
  {
    slug: "shalgardan-pashmi",
    name: "شال‌گردن پشمی طوسی",
    categorySlug: "accessories",
    price: 490_000,
    isNew: true,
    description: "شال‌گردن بافت پشمی نرم، برای فصل سرد. اندازه‌ای مناسب برای چند حالت گره‌زدن مختلف.",
  },
];
