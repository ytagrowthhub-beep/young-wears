/** 20 items per Product Type filter bucket — mirrors backend seed logic. */

export const SHOP_PRODUCT_TYPES_GRID = ["T-Shirts & Tops", "Shorts", "Leggings", "Jackets", "Accessories"];
export const PRODUCTS_PER_PRODUCT_TYPE = 20;

const IMAGE_POOL = [
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200",
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1200",
  "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1200",
  "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=1200",
  "https://images.unsplash.com/photo-1543076447-215ad9ba6923?q=80&w=1200",
  "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1200",
  "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1200",
  "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=1200",
  "https://images.unsplash.com/photo-1521369909029-2afed882baee?q=80&w=1200",
  "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1200",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1200",
  "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=1200",
];

const COLOR_ROTATION = [["Black"], ["Blue"], ["White"], ["Green"], ["Pink"], ["Grey"]];
const FEATURE_ROTATION = [
  ["Breathable"],
  ["Lightweight"],
  ["Seamless"],
  ["Pockets"],
  ["Breathable", "Lightweight"],
  ["Pockets", "Lightweight"],
];

const CATEGORY_ROTATION = [
  { category: "Women Clothes", audience: "women", facetGender: "Women" },
  { category: "Adult Clothes", audience: "adult", facetGender: "Men" },
  { category: "Activewear & Gym", audience: "unisex", facetGender: "Unisex" },
  { category: "Child Clothes", audience: "child", facetGender: "Kids" },
  { category: "Other Wears", audience: "unisex", facetGender: "Unisex" },
];

const TYPE_BASE_NAMES = {
  "T-Shirts & Tops": "Studio Tee",
  Shorts: "Flex Short",
  Leggings: "Pulse Legging",
  Jackets: "Metro Jacket",
  Accessories: "Street Accessory",
};

const ADULT_SIZES_BY_TYPE = {
  "T-Shirts & Tops": ["XS", "S", "M", "L", "XL"],
  Shorts: ["S", "M", "L", "XL"],
  Leggings: ["XS", "S", "M", "L"],
  Jackets: ["S", "M", "L", "XL"],
  Accessories: ["One Size"],
};

function sizesFor(ptype, category) {
  if (ptype === "Accessories") return ["One Size"];
  if (category === "Child Clothes") return ["4Y", "6Y", "8Y", "10Y"];
  return ADULT_SIZES_BY_TYPE[ptype];
}

function slugProductType(ptype) {
  return ptype.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function buildProductTypeGridSamples() {
  const rows = [];
  for (const ptype of SHOP_PRODUCT_TYPES_GRID) {
    const slug = slugProductType(ptype);
    const baseLabel = TYPE_BASE_NAMES[ptype];
    for (let i = 0; i < PRODUCTS_PER_PRODUCT_TYPE; i++) {
      const slot = CATEGORY_ROTATION[i % CATEGORY_ROTATION.length];
      const colors = COLOR_ROTATION[i % COLOR_ROTATION.length];
      const features = FEATURE_ROTATION[i % FEATURE_ROTATION.length];
      const idx = i + 1;
      const baseName = `${baseLabel} ${String(idx).padStart(2, "0")}`;
      const price = Math.round((24.99 + i * 2.15 + slug.length * 0.35) * 100) / 100;
      const image = IMAGE_POOL[(i + slug.length + ptype.length) % IMAGE_POOL.length];
      rows.push({
        _id: `ptype-${slug}-${idx}`,
        name: `Young Wears ${baseName}`,
        category: slot.category,
        audience: slot.audience,
        price,
        sizes: sizesFor(ptype, slot.category),
        image,
        description: `${baseName}. Product type ${ptype}. Colors: ${colors.join(", ")}. ${features.join(", ")}.`,
        trending: false,
        stock: 40 + (i % 12),
        isNew: false,
        facets: {
          productType: ptype,
          gender: slot.facetGender,
          colors,
          features,
        },
      });
    }
  }
  return rows;
}
