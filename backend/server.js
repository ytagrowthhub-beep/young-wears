const path = require("path");
const crypto = require("crypto");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, ".env") });
dotenv.config({ path: path.join(__dirname, ".env.local"), override: true });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));

const childClothes = [
  ["Mini Motion Tee", 24.99, ["4Y", "6Y", "8Y", "10Y"], "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=1200"],
  ["Tiny Trail Hoodie", 29.99, ["4Y", "6Y", "8Y", "10Y"], "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=1200"],
  ["Playtime Cargo Set", 34.99, ["4Y", "6Y", "8Y"], "https://images.unsplash.com/photo-1476234251651-f353703a034d?q=80&w=1200"],
  ["Junior Street Joggers", 22.99, ["4Y", "6Y", "8Y", "10Y"], "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200"],
  ["Little Star Denim", 27.99, ["4Y", "6Y", "8Y", "10Y"], "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200"],
  ["Color Pop Windbreaker", 31.99, ["6Y", "8Y", "10Y"], "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=1200"],
  ["Happy Day Dress", 26.99, ["4Y", "6Y", "8Y"], "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200"],
  ["School Run Polo", 19.99, ["4Y", "6Y", "8Y", "10Y"], "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200"],
  ["Weekend Knit Set", 33.99, ["4Y", "6Y", "8Y"], "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200"],
  ["Adventure Shorts", 18.99, ["4Y", "6Y", "8Y", "10Y"], "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1200"],
  ["Mini Classic Shirt", 21.99, ["4Y", "6Y", "8Y", "10Y"], "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200"],
  ["Sunny Day Romper", 25.99, ["4Y", "6Y", "8Y"], "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200"],
  ["Youth Flex Tracksuit", 38.99, ["6Y", "8Y", "10Y"], "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=1200"],
  ["Rainbow Stripe Tee", 21.99, ["4Y", "6Y", "8Y"], "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=1200"],
  ["Mesh Pocket Shorts", 19.99, ["4Y", "6Y", "8Y", "10Y"], "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1200"],
  ["Soft Pink Hoodie", 27.99, ["4Y", "6Y", "8Y"], "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=1200"],
  ["Green Zip Jacket", 32.99, ["6Y", "8Y", "10Y"], "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=1200"],
  ["White Tennis Socks", 8.99, ["One Size"], "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?q=80&w=1200"],
  ["Stride Velcro Sneaker", 41.99, ["28", "30", "32", "34"], "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200"],
];

const adultClothes = [
  ["Urban Drift Tee", 34.99, ["S", "M", "L", "XL"], "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200"],
  ["Sunset Cargo Pants", 54.99, ["30", "32", "34", "36"], "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1200"],
  ["Metro Fit Hoodie", 49.99, ["S", "M", "L", "XL"], "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1200"],
  ["Core Denim Jacket", 69.99, ["S", "M", "L"], "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?q=80&w=1200"],
  ["Essential Polo", 32.99, ["S", "M", "L", "XL"], "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200"],
  ["Street Taper Jeans", 57.99, ["30", "32", "34", "36"], "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1200"],
  ["Coastline Linen Shirt", 39.99, ["S", "M", "L", "XL"], "https://images.unsplash.com/photo-1484515991647-c5760fcecfc7?q=80&w=1200"],
  ["All Day Chinos", 45.99, ["30", "32", "34", "36"], "https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=1200"],
  ["Modern Crew Sweatshirt", 41.99, ["S", "M", "L", "XL"], "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=1200"],
  ["Young Wears Varsity Jacket", 74.99, ["S", "M", "L"], "https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=1200"],
  ["Athleisure Flex Set", 63.99, ["S", "M", "L", "XL"], "https://images.unsplash.com/photo-1506629905607-d9f3174d0a5e?q=80&w=1200"],
  ["Weekend Utility Shirt", 37.99, ["S", "M", "L", "XL"], "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1200"],
  ["Everyday Comfort Tee", 28.99, ["S", "M", "L", "XL"], "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=1200"],
  ["Navy Oxford Shirt", 41.99, ["S", "M", "L", "XL"], "https://images.unsplash.com/photo-1484515991647-c5760fcecfc7?q=80&w=1200"],
  ["Black Slim Jeans", 59.99, ["30", "32", "34", "36"], "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1200"],
  ["Grey Pocket Joggers", 46.99, ["S", "M", "L", "XL"], "https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=1200"],
  ["White Crew Socks Pack", 14.99, ["One Size"], "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?q=80&w=1200"],
  ["Olive Cargo Shorts", 44.99, ["30", "32", "34"], "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1200"],
];

const womenClothes = [
  ["Skyline Jacket", 79.99, ["S", "M", "L"], "https://images.unsplash.com/photo-1543076447-215ad9ba6923?q=80&w=1200"],
  ["Bloom Knit Dress", 64.99, ["S", "M", "L"], "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1200"],
  ["Chic Flow Blouse", 38.99, ["S", "M", "L", "XL"], "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200"],
  ["Luna Fit Jeans", 55.99, ["26", "28", "30", "32"], "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=1200"],
  ["Velvet Evening Top", 42.99, ["S", "M", "L"], "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200"],
  ["Daisy Day Midi Dress", 59.99, ["S", "M", "L"], "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1200"],
  ["Cityline Wide Pants", 49.99, ["S", "M", "L", "XL"], "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200"],
  ["Morning Glow Cardigan", 44.99, ["S", "M", "L"], "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200"],
  ["Classic Wrap Skirt", 36.99, ["S", "M", "L"], "https://images.unsplash.com/photo-1551232864-3f0890e580d9?q=80&w=1200"],
  ["Summer Breeze Top", 29.99, ["S", "M", "L", "XL"], "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1200"],
  ["Signature Blazer", 84.99, ["S", "M", "L"], "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=1200"],
  ["Softline Lounge Set", 58.99, ["S", "M", "L", "XL"], "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=1200"],
  ["Rose Wrap Top", 36.99, ["S", "M", "L"], "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1200"],
  ["Indigo Wide Jeans", 62.99, ["26", "28", "30", "32"], "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=1200"],
  ["Pink Seamless Tank", 34.99, ["S", "M", "L", "XL"], "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1200"],
  ["Black Midi Skirt", 42.99, ["S", "M", "L"], "https://images.unsplash.com/photo-1551232864-3f0890e580d9?q=80&w=1200"],
  ["Green Lightweight Cardigan", 47.99, ["S", "M", "L"], "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200"],
];

const otherWears = [
  ["Everyday Cap", 16.99, ["One Size"], "https://images.unsplash.com/photo-1521369909029-2afed882baee?q=80&w=1200"],
  ["Street Crossbody Bag", 28.99, ["One Size"], "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200"],
  ["Urban Sneakers", 72.99, ["39", "40", "41", "42", "43"], "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200"],
  ["Classic Leather Belt", 22.99, ["M", "L", "XL"], "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1200"],
  ["Comfy Crew Socks", 9.99, ["One Size"], "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?q=80&w=1200"],
  ["Weekend Tote", 24.99, ["One Size"], "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1200"],
  ["Sport Watch Strap", 18.99, ["One Size"], "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=1200"],
  ["Minimal Wallet", 19.99, ["One Size"], "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1200"],
  ["Travel Duffel", 49.99, ["One Size"], "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1200"],
  ["Youth Backpack", 34.99, ["One Size"], "https://images.unsplash.com/photo-1500534623283-312aade485b7?q=80&w=1200"],
  ["Athletic Slides", 23.99, ["39", "40", "41", "42"], "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1200"],
  ["Polarized Sunglasses", 27.99, ["One Size"], "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1200"],
  ["Blue Canvas Belt", 21.99, ["S", "M", "L"], "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1200"],
  ["Green Gym Towel", 12.99, ["One Size"], "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1200"],
  ["Grey Wool Beanie", 24.99, ["One Size"], "https://images.unsplash.com/photo-1521369909029-2afed882baee?q=80&w=1200"],
];

const activewearGym = [
  ["Velocity Seamless Leggings", 54.99, ["XS", "S", "M", "L"], "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1200"],
  ["Mesh Training Tank", 32.99, ["S", "M", "L", "XL"], "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1200"],
  ["Breathable Running Shorts", 38.99, ["S", "M", "L"], "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200"],
  ["Performance Zip Hoodie", 67.99, ["S", "M", "L", "XL"], "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1200"],
  ["Womens Sports Bra", 41.99, ["XS", "S", "M", "L"], "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1200"],
  ["Mens Training Joggers", 56.99, ["S", "M", "L", "XL"], "https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=1200"],
  ["Lightweight Track Jacket", 61.99, ["S", "M", "L"], "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=1200"],
  ["Pocket Running Shorts", 36.99, ["S", "M", "L"], "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1200"],
  ["Kids Gym Tee", 22.99, ["4Y", "6Y", "8Y"], "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=1200"],
  ["Unisex Yoga Mat Strap", 18.99, ["One Size"], "https://images.unsplash.com/photo-1500534623283-312aade485b7?q=80&w=1200"],
];

const footwearSneakers = [
  ["Pulse Runner Sneakers", 92.99, ["39", "40", "41", "42", "43"], "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200"],
  ["Court White Leather Shoe", 84.99, ["40", "41", "42", "43"], "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1200"],
  ["Trail Grip Trainer", 79.99, ["39", "40", "41", "42"], "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200"],
  ["Black Athletic Slides", 29.99, ["39", "40", "41", "42"], "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1200"],
  ["Pink Running Shoe", 88.99, ["38", "39", "40", "41"], "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1200"],
  ["Grey Sock Sneakers", 76.99, ["40", "41", "42", "43"], "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1200"],
  ["Unisex Court Socks Pack", 16.99, ["One Size"], "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?q=80&w=1200"],
];

const makeProducts = (items, category, audience) =>
  items.map(([name, price, sizes, image], index) => ({
    name: `Young Wears ${name}`,
    category,
    audience,
    price,
    sizes,
    image,
    description: `${name} crafted for modern comfort, standout style, and everyday confidence.`,
    trending: index < 3,
    stock: Math.max(2, 18 - index),
    isNew: index < 2,
    source: "seed",
  }));

const sampleProducts = [
  ...makeProducts(childClothes, "Child Clothes", "child"),
  ...makeProducts(adultClothes, "Adult Clothes", "adult"),
  ...makeProducts(womenClothes, "Women Clothes", "women"),
  ...makeProducts(otherWears, "Other Wears", "unisex"),
  ...makeProducts(activewearGym, "Activewear & Gym", "unisex"),
  ...makeProducts(footwearSneakers, "Footwear & Sneakers", "unisex"),
];

/** Explicit facets aligned with shop sidebar buttons (product type, gender, color, features). */
function describeFacetProduct(baseName, facets) {
  const colorStr = facets.colors?.join(", ") || "";
  const featStr = facets.features?.join(", ") || "";
  return `${baseName}. Flagship fit with tagged facets for filters: ${colorStr}. ${featStr}. Designed for modern comfort and standout style.`;
}

function facetShowcaseDoc(row) {
  const [baseName, price, sizes, image, category, audience, facets] = row;
  return {
    name: `Young Wears ${baseName}`,
    category,
    audience,
    price,
    sizes,
    image,
    description: describeFacetProduct(baseName, facets),
    trending: false,
    stock: 48,
    isNew: true,
    source: "seed",
    externalId: facets.externalId,
    facets: {
      productType: facets.productType,
      gender: facets.gender,
      colors: facets.colors,
      features: facets.features,
    },
  };
}

const facetShowcaseRows = [
  [
    "Facet Pink Crew Tee",
    32.99,
    ["XS", "S", "M", "L", "XL"],
    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1200",
    "Women Clothes",
    "women",
    {
      externalId: "seed-facet-w-top-pink",
      productType: "T-Shirts & Tops",
      gender: "Women",
      colors: ["Pink"],
      features: ["Breathable", "Lightweight"],
    },
  ],
  [
    "Facet Blue Cargo Shorts",
    44.99,
    ["30", "32", "34", "36"],
    "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1200",
    "Adult Clothes",
    "adult",
    {
      externalId: "seed-facet-m-short-blue",
      productType: "Shorts",
      gender: "Men",
      colors: ["Blue"],
      features: ["Pockets"],
    },
  ],
  [
    "Facet Black Studio Leggings",
    58.99,
    ["XS", "S", "M", "L"],
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1200",
    "Activewear & Gym",
    "unisex",
    {
      externalId: "seed-facet-u-leg-black",
      productType: "Leggings",
      gender: "Unisex",
      colors: ["Black"],
      features: ["Seamless", "Breathable"],
    },
  ],
  [
    "Facet Green Windbreaker",
    36.99,
    ["4Y", "6Y", "8Y", "10Y"],
    "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=1200",
    "Child Clothes",
    "child",
    {
      externalId: "seed-facet-k-jkt-green",
      productType: "Jackets",
      gender: "Kids",
      colors: ["Green"],
      features: ["Lightweight"],
    },
  ],
  [
    "Facet Grey Beanie",
    22.99,
    ["One Size"],
    "https://images.unsplash.com/photo-1521369909029-2afed882baee?q=80&w=1200",
    "Other Wears",
    "unisex",
    {
      externalId: "seed-facet-u-acc-grey",
      productType: "Accessories",
      gender: "Unisex",
      colors: ["Grey"],
      features: ["Breathable"],
    },
  ],
  [
    "Facet White Oxford Shirt",
    46.99,
    ["S", "M", "L", "XL"],
    "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=1200",
    "Adult Clothes",
    "adult",
    {
      externalId: "seed-facet-m-top-white",
      productType: "T-Shirts & Tops",
      gender: "Men",
      colors: ["White"],
      features: ["Lightweight", "Pockets"],
    },
  ],
  [
    "Facet White Tennis Skirt",
    42.99,
    ["XS", "S", "M", "L"],
    "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1200",
    "Women Clothes",
    "women",
    {
      externalId: "seed-facet-w-short-white",
      productType: "Shorts",
      gender: "Women",
      colors: ["White"],
      features: ["Seamless", "Lightweight"],
    },
  ],
  [
    "Facet Navy Trail Shorts",
    39.99,
    ["S", "M", "L", "XL"],
    "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1200",
    "Activewear & Gym",
    "unisex",
    {
      externalId: "seed-facet-u-short-blue2",
      productType: "Shorts",
      gender: "Unisex",
      colors: ["Blue"],
      features: ["Breathable", "Pockets"],
    },
  ],
  [
    "Facet Pink Kids Tank",
    19.99,
    ["4Y", "6Y", "8Y"],
    "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=1200",
    "Child Clothes",
    "child",
    {
      externalId: "seed-facet-k-top-pink",
      productType: "T-Shirts & Tops",
      gender: "Kids",
      colors: ["Pink"],
      features: ["Breathable"],
    },
  ],
  [
    "Facet Charcoal Leggings",
    52.99,
    ["XS", "S", "M", "L"],
    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1200",
    "Women Clothes",
    "women",
    {
      externalId: "seed-facet-w-leg-grey",
      productType: "Leggings",
      gender: "Women",
      colors: ["Grey"],
      features: ["Seamless"],
    },
  ],
  [
    "Facet Black Packable Jacket",
    89.99,
    ["S", "M", "L", "XL"],
    "https://images.unsplash.com/photo-1543076447-215ad9ba6923?q=80&w=1200",
    "Women Clothes",
    "women",
    {
      externalId: "seed-facet-w-jkt-black",
      productType: "Jackets",
      gender: "Women",
      colors: ["Black"],
      features: ["Lightweight", "Pockets"],
    },
  ],
  [
    "Facet Green Gym Bag",
    34.99,
    ["One Size"],
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1200",
    "Other Wears",
    "unisex",
    {
      externalId: "seed-facet-u-acc-green",
      productType: "Accessories",
      gender: "Unisex",
      colors: ["Green"],
      features: ["Pockets", "Lightweight"],
    },
  ],
];

const facetShowcaseProducts = facetShowcaseRows.map(facetShowcaseDoc);

/** Twenty catalog rows per Product Type sidebar bucket (100 total). */
const SHOP_PRODUCT_TYPES_GRID = ["T-Shirts & Tops", "Shorts", "Leggings", "Jackets", "Accessories"];
const PRODUCTS_PER_PRODUCT_TYPE = 20;

const PTYPE_IMAGE_POOL = [
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

const PTYPE_COLOR_ROTATION = [["Black"], ["Blue"], ["White"], ["Green"], ["Pink"], ["Grey"]];
const PTYPE_FEATURE_ROTATION = [
  ["Breathable"],
  ["Lightweight"],
  ["Seamless"],
  ["Pockets"],
  ["Breathable", "Lightweight"],
  ["Pockets", "Lightweight"],
];

const PTYPE_CATEGORY_ROTATION = [
  { category: "Women Clothes", audience: "women", facetGender: "Women" },
  { category: "Adult Clothes", audience: "adult", facetGender: "Men" },
  { category: "Activewear & Gym", audience: "unisex", facetGender: "Unisex" },
  { category: "Child Clothes", audience: "child", facetGender: "Kids" },
  { category: "Other Wears", audience: "unisex", facetGender: "Unisex" },
];

const PTYPE_BASE_NAMES = {
  "T-Shirts & Tops": "Studio Tee",
  Shorts: "Flex Short",
  Leggings: "Pulse Legging",
  Jackets: "Metro Jacket",
  Accessories: "Street Accessory",
};

const PTYPE_ADULT_SIZES = {
  "T-Shirts & Tops": ["XS", "S", "M", "L", "XL"],
  Shorts: ["S", "M", "L", "XL"],
  Leggings: ["XS", "S", "M", "L"],
  Jackets: ["S", "M", "L", "XL"],
  Accessories: ["One Size"],
};

function slugifyProductType(ptype) {
  return ptype.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function ptypeSizes(ptype, category) {
  if (ptype === "Accessories") return ["One Size"];
  if (category === "Child Clothes") return ["4Y", "6Y", "8Y", "10Y"];
  return PTYPE_ADULT_SIZES[ptype];
}

function buildProductTypeGridProducts() {
  const out = [];
  for (const ptype of SHOP_PRODUCT_TYPES_GRID) {
    const slug = slugifyProductType(ptype);
    const baseLabel = PTYPE_BASE_NAMES[ptype];
    for (let i = 0; i < PRODUCTS_PER_PRODUCT_TYPE; i++) {
      const slot = PTYPE_CATEGORY_ROTATION[i % PTYPE_CATEGORY_ROTATION.length];
      const colors = PTYPE_COLOR_ROTATION[i % PTYPE_COLOR_ROTATION.length];
      const features = PTYPE_FEATURE_ROTATION[i % PTYPE_FEATURE_ROTATION.length];
      const idx = i + 1;
      const baseName = `${baseLabel} ${String(idx).padStart(2, "0")}`;
      const price = Math.round((24.99 + i * 2.15 + slug.length * 0.35) * 100) / 100;
      const image = PTYPE_IMAGE_POOL[(i + slug.length + ptype.length) % PTYPE_IMAGE_POOL.length];
      const externalId = `seed-ptype-${slug}-${idx}`;
      out.push({
        name: `Young Wears ${baseName}`,
        category: slot.category,
        audience: slot.audience,
        price,
        sizes: ptypeSizes(ptype, slot.category),
        image,
        description: describeFacetProduct(baseName, { colors, features }),
        trending: false,
        stock: 40 + (i % 12),
        isNew: false,
        source: "seed",
        externalId,
        facets: {
          productType: ptype,
          gender: slot.facetGender,
          colors,
          features,
        },
      });
    }
  }
  return out;
}

const productTypeGridProducts = buildProductTypeGridProducts();

function syntheticId(seed) {
  return crypto.createHash("sha256").update(String(seed)).digest("hex").slice(0, 24);
}

function buildMemoryCatalog() {
  const facetMap = new Map();
  for (const doc of facetShowcaseProducts) {
    facetMap.set(doc.externalId, {
      ...doc,
      _id: syntheticId(`ext:${doc.externalId}`),
      createdAt: new Date(),
    });
  }
  for (const doc of productTypeGridProducts) {
    facetMap.set(doc.externalId, {
      ...doc,
      _id: syntheticId(`ext:${doc.externalId}`),
      createdAt: new Date(),
    });
  }
  const samples = sampleProducts.map((p, i) => ({
    ...p,
    _id: syntheticId(`sample:${p.category}:${p.name}:${i}`),
    createdAt: new Date(),
  }));
  return [...samples, ...facetMap.values()];
}

const MEMORY_PRODUCTS = buildMemoryCatalog();

function filterProducts(query) {
  let list = [...MEMORY_PRODUCTS];
  const { category, minPrice, maxPrice, size } = query;
  if (category) list = list.filter((p) => p.category === category);
  if (size) list = list.filter((p) => Array.isArray(p.sizes) && p.sizes.includes(size));
  if (minPrice || maxPrice) {
    list = list.filter((p) => {
      if (minPrice && p.price < Number(minPrice)) return false;
      if (maxPrice && p.price > Number(maxPrice)) return false;
      return true;
    });
  }
  return list.sort((a, b) => b.createdAt - a.createdAt);
}

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "Young Wears API is running.",
    catalogSize: MEMORY_PRODUCTS.length,
  });
});

app.get("/api/products", (req, res) => {
  const products = filterProducts(req.query);
  return res.json(products);
});

app.get("/api/products/:id", (req, res) => {
  const product = MEMORY_PRODUCTS.find((p) => String(p._id) === String(req.params.id));
  if (!product) return res.status(404).json({ message: "Product not found." });
  return res.json(product);
});

app.listen(PORT, () => {
  console.log(`Young Wears API on port ${PORT} — in-memory catalog (${MEMORY_PRODUCTS.length} products). Auth is handled by Supabase on the frontend.`);
});
