/**
 * Imports up to 50 Shopify + 50 AliExpress products per category into MongoDB.
 * Shopify: public /products.json from configured storefronts (no API key).
 * AliExpress: Affiliate Open Platform (legacy Taobao router) — requires env credentials.
 *
 * Run: npm run import:products --prefix backend
 */

const crypto = require("crypto");
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/young_wears";
const PER_SOURCE = 50;

const productSchema = new mongoose.Schema(
  {
    name: String,
    category: String,
    audience: String,
    price: Number,
    sizes: [String],
    image: String,
    description: String,
    trending: Boolean,
    stock: Number,
    isNew: Boolean,
    source: { type: String, enum: ["seed", "shopify", "aliexpress"], default: "seed" },
    productUrl: String,
    externalId: { type: String, sparse: true, unique: true },
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

const GYMSHARK = "gymshark.myshopify.com";
const BROOKLYN = "brooklyn-theme.myshopify.com";

function stripHtml(html) {
  if (!html) return "";
  return String(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function signTaobaoMd5(params, secret) {
  const keys = Object.keys(params)
    .filter((k) => k !== "sign" && params[k] !== undefined && params[k] !== null)
    .sort();
  let str = "";
  for (const k of keys) str += `${k}${params[k]}`;
  const body = `${secret}${str}${secret}`;
  return crypto.createHash("md5").update(body, "utf8").digest("hex").toUpperCase();
}

function shanghaiTimestamp() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t)?.value || "";
  return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}:${get("second")}`;
}

async function fetchShopifyPages(hostname, maxTotal = 400) {
  const all = [];
  let page = 1;
  while (all.length < maxTotal) {
    const url = `https://${hostname}/products.json?limit=250&page=${page}`;
    const res = await fetch(url);
    if (!res.ok) break;
    const data = await res.json();
    const batch = data.products;
    if (!Array.isArray(batch) || batch.length === 0) break;
    all.push(...batch);
    if (batch.length < 250) break;
    page += 1;
    if (page > 15) break;
  }
  return all;
}

function pt(p) {
  return p.product_type || "";
}

function pickN(products, predicate, n, fallback = () => true) {
  const primary = products.filter(predicate);
  const out = primary.slice(0, n);
  if (out.length >= n) return out;
  const used = new Set(out.map((p) => p.id));
  const rest = products.filter((p) => !used.has(p.id) && fallback(p));
  out.push(...rest.slice(0, n - out.length));
  return out;
}

function mapShopifyDoc(product, ctx) {
  const v = product.variants?.[0];
  const price = v ? parseFloat(v.price) : 0;
  let sizes = ["One Size"];
  const sizeOpt = product.options?.find((o) => /size/i.test(o.name));
  if (sizeOpt?.values?.length) sizes = sizeOpt.values;
  const img = product.images?.[0]?.src || product.image?.src || "";
  const desc = stripHtml(product.body_html || "").slice(0, 600);
  const stockSum =
    product.variants?.reduce((s, x) => s + (Number(x.inventory_quantity) || 0), 0) ?? 0;

  return {
    name: String(product.title || "Product").slice(0, 220),
    category: ctx.categoryTitle,
    audience: ctx.audience,
    price: Number.isFinite(price) && price > 0 ? price : 24.99,
    sizes,
    image: img,
    description: desc || `${product.title} — sourced from a public Shopify storefront.`,
    trending: false,
    stock: stockSum > 0 ? Math.min(999, stockSum) : 48,
    isNew: false,
    source: "shopify",
    productUrl: `https://${ctx.hostname}/products/${product.handle}`,
    externalId: `shopify:${ctx.hostname}:${product.id}`,
  };
}

function extractAliProducts(json) {
  if (json?.error_response) return { error: json.error_response, products: [] };
  const resp = json.aliexpress_affiliate_product_query_response;
  const result = resp?.resp_result || resp?.result;
  const raw = result?.products?.product ?? result?.products;
  if (!raw) return { products: [] };
  const list = Array.isArray(raw) ? raw : [raw];
  return { products: list };
}

async function fetchAliExpressSearch(keywords, pageSize = PER_SOURCE) {
  const appKey = process.env.ALIEXPRESS_APP_KEY;
  const secret = process.env.ALIEXPRESS_APP_SECRET;
  const trackingId = process.env.ALIEXPRESS_TRACKING_ID;
  if (!appKey || !secret || !trackingId) {
    return { skipped: true, products: [] };
  }

  const params = {
    method: "aliexpress.affiliate.product.query",
    app_key: appKey,
    sign_method: "md5",
    timestamp: shanghaiTimestamp(),
    format: "json",
    v: "2.0",
    keywords: String(keywords).slice(0, 200),
    page_no: "1",
    page_size: String(pageSize),
    target_currency: "USD",
    target_language: "EN",
    tracking_id: trackingId,
    ship_to_country: "US",
  };
  params.sign = signTaobaoMd5(params, secret);

  const res = await fetch("https://gw.api.taobao.com/router/rest", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
    body: new URLSearchParams(params),
  });
  const json = await res.json();
  const { error, products } = extractAliProducts(json);
  if (error) return { error, products: [] };
  return { products };
}

function mapAliDoc(raw, ctx) {
  const title = raw.product_title || raw.title || "AliExpress product";
  const id =
    raw.product_id ??
    raw.productId ??
    raw.item_id ??
    `h${crypto.createHash("sha1").update(`${title}-${ctx.categoryTitle}`).digest("hex").slice(0, 24)}`;
  const priceStr = raw.target_sale_price ?? raw.sale_price ?? raw.discount_price ?? raw.original_price ?? "0";
  const price = parseFloat(String(priceStr).replace(/[^\d.]/g, "")) || 9.99;
  const img =
    raw.product_main_image_url ||
    raw.image_url ||
    (Array.isArray(raw.product_small_image_urls?.string) ? raw.product_small_image_urls.string[0] : "") ||
    "";
  const url =
    raw.promotion_link ||
    raw.product_detail_url ||
    raw.product_url ||
    raw.url ||
    `https://www.aliexpress.com/item/${id}.html`;

  return {
    name: String(title).slice(0, 220),
    category: ctx.categoryTitle,
    audience: ctx.audience,
    price,
    sizes: ["One Size"],
    image: img,
    description: `${title} — imported via AliExpress Affiliate search.`,
    trending: false,
    stock: 60,
    isNew: false,
    source: "aliexpress",
    productUrl: url,
    externalId: `aliexpress:${id}`,
  };
}

async function shopifyChildClothes() {
  const bk = await fetchShopifyPages(BROOKLYN, 100);
  const gym = await fetchShopifyPages(GYMSHARK, 300);
  const bkIds = new Set(bk.map((p) => p.id));
  const kidPred = (p) =>
    /kid|youth|junior|child|baby|toddler|mini|boys|girls/i.test(`${p.title} ${pt(p)}`);

  let chosen = pickN(bk, kidPred, PER_SOURCE, () => true);
  if (chosen.length < PER_SOURCE) {
    const restBk = bk.filter((p) => !chosen.some((c) => c.id === p.id));
    chosen = [...chosen, ...pickN(restBk, () => true, PER_SOURCE - chosen.length, () => true)];
  }
  if (chosen.length < PER_SOURCE) {
    const need = PER_SOURCE - chosen.length;
    const fromGym = pickN(
      gym,
      (p) => !chosen.some((c) => c.id === p.id),
      need,
      () => true
    );
    chosen = [...chosen, ...fromGym];
  }
  return chosen.slice(0, PER_SOURCE).map((p) =>
    mapShopifyDoc(p, {
      categoryTitle: "Child Clothes",
      audience: "child",
      hostname: bkIds.has(p.id) ? BROOKLYN : GYMSHARK,
    })
  );
}

const CATEGORY_PLAN = [
  { categoryTitle: "Child Clothes", audience: "child", aliKeywords: "kids clothes boys girls toddler outfit", shopify: shopifyChildClothes },
  {
    categoryTitle: "Adult Clothes",
    audience: "adult",
    aliKeywords: "men clothing casual shirt pants jacket",
    shopify: async () => {
      const gym = await fetchShopifyPages(GYMSHARK, 300);
      return pickN(gym, (p) => pt(p).startsWith("Mens"), PER_SOURCE, () => true).map((p) =>
        mapShopifyDoc(p, { categoryTitle: "Adult Clothes", audience: "adult", hostname: GYMSHARK })
      );
    },
  },
  {
    categoryTitle: "Women Clothes",
    audience: "women",
    aliKeywords: "women fashion dress blouse skirt outfit",
    shopify: async () => {
      const gym = await fetchShopifyPages(GYMSHARK, 300);
      return pickN(gym, (p) => pt(p).startsWith("Womens"), PER_SOURCE, () => true).map((p) =>
        mapShopifyDoc(p, { categoryTitle: "Women Clothes", audience: "women", hostname: GYMSHARK })
      );
    },
  },
  {
    categoryTitle: "Other Wears",
    audience: "unisex",
    aliKeywords: "fashion accessories hat belt bag socks jewelry",
    shopify: async () => {
      const gym = await fetchShopifyPages(GYMSHARK, 300);
      return pickN(
        gym,
        (p) => pt(p).startsWith("Unisex") || /accessories|sock|cap|hat|belt/i.test(pt(p)),
        PER_SOURCE,
        () => true
      ).map((p) => mapShopifyDoc(p, { categoryTitle: "Other Wears", audience: "unisex", hostname: GYMSHARK }));
    },
  },
  {
    categoryTitle: "Activewear & Gym",
    audience: "unisex",
    aliKeywords: "sportswear gym leggings yoga workout fitness set",
    shopify: async () => {
      const gym = await fetchShopifyPages(GYMSHARK, 300);
      return pickN(
        gym,
        (p) =>
          /short|tank|legging|sport bra|jogger|hoodie|ss tops|sleeveless/i.test(pt(p)) ||
          /lift|run|train|gym/i.test(pt(p)),
        PER_SOURCE,
        () => true
      ).map((p) => mapShopifyDoc(p, { categoryTitle: "Activewear & Gym", audience: "unisex", hostname: GYMSHARK }));
    },
  },
  {
    categoryTitle: "Footwear & Sneakers",
    audience: "unisex",
    aliKeywords: "sneakers running shoes sport shoes casual shoes men women",
    shopify: async () => {
      const gym = await fetchShopifyPages(GYMSHARK, 300);
      return pickN(
        gym,
        (p) => /shoe|sneaker|trainer|slide|sock/i.test(pt(p)) || /shoe|sneaker|slide/i.test(p.title),
        PER_SOURCE,
        () => true
      ).map((p) =>
        mapShopifyDoc(p, { categoryTitle: "Footwear & Sneakers", audience: "unisex", hostname: GYMSHARK })
      );
    },
  },
];

async function run() {
  await mongoose.connect(MONGODB_URI);
  const removed = await Product.deleteMany({ source: { $in: ["shopify", "aliexpress"] } });
  console.log(`Removed previous marketplace rows: ${removed.deletedCount}`);

  let shopifyTotal = 0;
  let aliTotal = 0;

  for (const plan of CATEGORY_PLAN) {
    const ctxBase = { categoryTitle: plan.categoryTitle, audience: plan.audience };

    const shopifyDocs = await plan.shopify();
    await Product.insertMany(shopifyDocs, { ordered: false }).catch((e) => {
      if (e?.code === 11000 || e?.writeErrors) {
        console.warn(`Shopify insert partial duplicate for ${plan.categoryTitle}, continuing.`);
      } else throw e;
    });
    shopifyTotal += shopifyDocs.length;
    console.log(`Shopify → ${plan.categoryTitle}: ${shopifyDocs.length} products`);

    const aliResult = await fetchAliExpressSearch(plan.aliKeywords, PER_SOURCE);
    if (aliResult.skipped) {
      console.warn(
        `AliExpress → ${plan.categoryTitle}: skipped (set ALIEXPRESS_APP_KEY, ALIEXPRESS_APP_SECRET, ALIEXPRESS_TRACKING_ID)`
      );
    } else if (aliResult.error) {
      console.warn(`AliExpress → ${plan.categoryTitle}: API error`, aliResult.error);
    } else {
      const aliDocs = (aliResult.products || [])
        .slice(0, PER_SOURCE)
        .map((raw) => mapAliDoc(raw, ctxBase))
        .filter((d) => d.externalId);
      await Product.insertMany(aliDocs, { ordered: false }).catch((e) => {
        if (e?.code === 11000 || e?.writeErrors) {
          console.warn(`AliExpress insert partial duplicate for ${plan.categoryTitle}, continuing.`);
        } else throw e;
      });
      aliTotal += aliDocs.length;
      console.log(`AliExpress → ${plan.categoryTitle}: ${aliDocs.length} products`);
    }
  }

  console.log(`Done. Shopify documents inserted: ${shopifyTotal}, AliExpress: ${aliTotal}`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
