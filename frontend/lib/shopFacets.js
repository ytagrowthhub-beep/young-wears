/**
 * Derives shop filter facets from product fields so sidebar buttons match catalog rows.
 * Option strings must stay in sync with ShopPageClient FILTER_SECTIONS.
 */

export const PRODUCT_TYPE_OPTIONS = ["T-Shirts & Tops", "Shorts", "Leggings", "Jackets", "Accessories"];
export const GENDER_OPTIONS = ["Women", "Men", "Unisex", "Kids"];
export const FEATURE_OPTIONS = ["Breathable", "Lightweight", "Seamless", "Pockets"];
export const COLOR_OPTIONS = ["Black", "Blue", "White", "Green", "Pink", "Grey"];

export function inferShopFacets(product) {
  const name = (product.name || "").toLowerCase();
  const desc = (product.description || "").toLowerCase();
  const blob = `${name} ${desc}`;
  const cat = product.category || "";
  const audience = product.audience || "";

  let shopGender = "Unisex";
  if (cat === "Child Clothes" || audience === "child") shopGender = "Kids";
  else if (cat === "Women Clothes" || audience === "women") shopGender = "Women";
  else if (cat === "Adult Clothes" || audience === "adult") shopGender = "Men";

  if (/\bwomens\b|\bwomen\b|\bladies\b|\bfemale\b/i.test(blob)) shopGender = "Women";
  else if (/\bmens\b|\bmen's\b|\bfor men\b/i.test(blob)) shopGender = "Men";

  let shopProductType = "T-Shirts & Tops";
  if (
    /\bsock\b|shoe|sneaker|slide|trainer|cap|hat|\bbag\b|belt|wallet|strap|watch|sunglass|tote|backpack|duffel|accessor/i.test(
      blob
    )
  ) {
    shopProductType = "Accessories";
  } else if (/\bshort|shorts\b|cargo short|swim short/i.test(blob)) {
    shopProductType = "Shorts";
  } else if (/legging|tight|\bleggings\b/i.test(blob)) {
    shopProductType = "Leggings";
  } else if (/jacket|hoodie|blazer|coat|windbreaker|varsity|bomber|outerwear|parka|anorak/i.test(blob)) {
    shopProductType = "Jackets";
  } else if (
    /tee|t-shirt|shirt|top|blouse|polo|tank|dress|midi|skirt|romper|crew neck|sweatshirt|polo|chinos|jean|pant|jogger|cargo pant|tracksuit|hoodie/i.test(
      blob
    )
  ) {
    shopProductType = "T-Shirts & Tops";
  }

  const shopColors = [];
  const pairs = [
    ["black", "Black"],
    ["navy", "Blue"],
    ["blue", "Blue"],
    ["white", "White"],
    ["green", "Green"],
    ["olive", "Green"],
    ["pink", "Pink"],
    ["rose", "Pink"],
    ["grey", "Grey"],
    ["gray", "Grey"],
    ["charcoal", "Grey"],
    ["tan", "Grey"],
    ["khaki", "Green"],
    ["burgundy", "Pink"],
    ["red", "Pink"],
  ];
  for (const [needle, label] of pairs) {
    if (blob.includes(needle)) shopColors.push(label);
  }
  const uniq = [...new Set(shopColors)];
  const shopColorsResolved = uniq.length ? uniq : ["Black"];

  const shopFeatures = [];
  if (/breathable|mesh|ventilation|performance fabric|sport|run|train|gym|moisture|wicking|athletic/i.test(blob)) {
    shopFeatures.push("Breathable");
  }
  if (/lightweight|light weight|linen|airy|featherlight|\blight\b/i.test(blob)) {
    shopFeatures.push("Lightweight");
  }
  if (/seamless/i.test(blob)) shopFeatures.push("Seamless");
  if (/pocket|cargo/i.test(blob)) shopFeatures.push("Pockets");

  return {
    shopProductType,
    shopGender,
    shopColors: shopColorsResolved,
    shopFeatures,
  };
}

/**
 * Optional API/seed `facets` overrides inference so filters match curated buttons exactly.
 * Shape: { productType, gender, colors[], features[] }
 */
export function enrichProductForShop(product) {
  const inferred = inferShopFacets(product);
  const f = product.facets;
  if (!f || typeof f !== "object") {
    return { ...product, ...inferred };
  }
  return {
    ...product,
    shopProductType: f.productType || inferred.shopProductType,
    shopGender: f.gender || inferred.shopGender,
    shopColors: Array.isArray(f.colors) && f.colors.length ? f.colors : inferred.shopColors,
    shopFeatures: Array.isArray(f.features) && f.features.length ? f.features : inferred.shopFeatures,
  };
}
