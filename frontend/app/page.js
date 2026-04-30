import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import { sampleProducts } from "@/lib/sampleProducts";
import HeroSlider from "@/components/HeroSlider";
import DealCountdown from "@/components/DealCountdown";
import HomePersonalizedSections from "@/components/HomePersonalizedSections";

async function getProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/products`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch");
    return await res.json();
  } catch {
    return sampleProducts;
  }
}

export default async function Home() {
  const products = await getProducts();
  const featured = products.slice(0, 4);
  const spotlight = products[4] || products[0];
  const spotlightTwo = products[8] || products[1];
  const spotlightThree = products[12] || products[2];
  const categoryCounts = ["Child Clothes", "Adult Clothes", "Women Clothes", "Other Wears"].map((title) => ({
    title,
    href: `/categories/${title.toLowerCase().replace(/\s+/g, "-")}`,
    count: products.filter((item) => item.category === title).length,
  }));
  return (
    <div>
      <section className="yw-gradient text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-6 py-20 md:grid-cols-2">
          <div>
            <p className="mb-3 inline-block rounded-full bg-white/20 px-3 py-1 text-sm">Style for Every Generation</p>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">
              Welcome to Young Wears - Fashion for All Ages
            </h1>
            <p className="mt-4 max-w-lg text-slate-100">
              Stylish and affordable essentials for kids and adults with a premium look and everyday comfort.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className="rounded-full bg-[#FF7A00] px-6 py-3 font-semibold transition hover:scale-105">
                Shop Now
              </Link>
              <Link href="/shop" className="rounded-full border border-white/60 px-6 py-3 font-semibold hover:bg-white/10">
                Explore Collection
              </Link>
            </div>
            <div className="mt-6">
              <DealCountdown durationHours={24} />
            </div>
          </div>
          <HeroSlider />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-bold text-[#0A1F44]">Featured Categories</h2>
          <p className="text-sm text-slate-500">{products.length} products available</p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {categoryCounts.map((category) => (
            <Link key={category.title} href={category.href} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <h3 className="text-xl font-semibold text-[#0A1F44]">{category.title}</h3>
              <p className="mt-2 text-sm text-slate-500">Trendy designs made for confidence and comfort.</p>
              <p className="mt-3 text-sm font-semibold text-[#FF7A00]">{category.count} items</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-14">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            ["New In", "Fresh drops this week", "/shop"],
            ["Best Sellers", "Most loved by customers", "/shop?sort=featured"],
            ["For Every Run", "Lightweight comfort picks", "/categories/adult-clothes"],
            ["Accessories Edit", "Bags, caps, shoes and more", "/categories/other-wears"],
          ].map(([title, subtitle, href]) => (
            <Link key={title} href={href} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#FF7A00]">{title}</p>
              <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
            </Link>
          ))}
        </div>
      </section>

      {spotlight && (
        <section className="mx-auto max-w-7xl px-6 pb-14">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:p-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#FF7A00]">Single Product Spotlight</p>
            <div className="mt-3 grid gap-6 md:grid-cols-[1.15fr_1fr]">
              <div>
                <h2 className="text-3xl font-bold text-[#0A1F44]">{spotlight.name}</h2>
                <p className="mt-3 text-slate-600">{spotlight.description}</p>
                <p className="mt-4 text-2xl font-bold text-[#0A1F44]">${spotlight.price.toFixed(2)}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href={`/product/${spotlight._id}`} className="rounded-lg bg-[#0A1F44] px-5 py-3 text-sm font-semibold text-white">
                    View Product
                  </Link>
                  <Link href="/shop" className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-[#0A1F44]">
                    Continue Shopping
                  </Link>
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="relative mb-4 h-56 overflow-hidden rounded-xl">
                  <Image
                    src={spotlight.image}
                    alt={spotlight.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                </div>
                <h3 className="text-lg font-semibold text-[#0A1F44]">Why this product?</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  <li>- Popular fit and easy styling for daily wear</li>
                  <li>- Best value in current weekly deal</li>
                  <li>- Available in multiple sizes for family matching</li>
                </ul>
                <div className="mt-5">
                  <DealCountdown durationHours={12} />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-6 pb-14">
        <h2 className="text-2xl font-bold text-[#0A1F44]">Editor&apos;s Picks</h2>
        <p className="mt-1 text-sm text-slate-500">A clean curated set for faster shopping decisions.</p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {spotlightTwo && (
        <section className="mx-auto max-w-7xl px-6 pb-14">
          <div className="grid gap-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:grid-cols-[1fr_1.2fr] md:p-8">
            <div className="rounded-2xl bg-[#0A1F44] p-6 text-white">
              <div className="relative mb-4 h-52 overflow-hidden rounded-xl">
                <Image
                  src={spotlightTwo.image}
                  alt={spotlightTwo.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 35vw"
                />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#FFD166]">Single Product Feature</p>
              <h3 className="mt-2 text-2xl font-bold">{spotlightTwo.name}</h3>
              <p className="mt-3 text-sm text-slate-100">{spotlightTwo.description}</p>
              <p className="mt-4 text-xl font-bold">${spotlightTwo.price.toFixed(2)}</p>
              <Link href={`/product/${spotlightTwo._id}`} className="mt-5 inline-block rounded-lg bg-[#FF7A00] px-4 py-2 text-sm font-semibold text-white">
                Shop This Look
              </Link>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
              <p className="text-sm font-semibold text-[#0A1F44]">Style Notes</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>- Designed for comfort and everyday movement</li>
                <li>- Easy to pair with wardrobe staples</li>
                <li>- High demand item in this week&apos;s collection</li>
              </ul>
              <div className="mt-5">
                <DealCountdown durationHours={10} />
              </div>
            </div>
          </div>
        </section>
      )}

      <HomePersonalizedSections products={products} />

      {spotlightThree && (
        <section className="mx-auto max-w-7xl px-6 pb-14">
          <div className="rounded-2xl border border-slate-100 bg-gradient-to-r from-slate-50 to-white p-6 shadow-sm md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div className="max-w-2xl">
                <div className="relative mb-4 h-56 overflow-hidden rounded-xl">
                  <Image
                    src={spotlightThree.image}
                    alt={spotlightThree.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#FF7A00]">Single Product Drop</p>
                <h3 className="mt-2 text-3xl font-bold text-[#0A1F44]">{spotlightThree.name}</h3>
                <p className="mt-3 text-slate-600">{spotlightThree.description}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">Limited-time price</p>
                <p className="mt-1 text-2xl font-bold text-[#0A1F44]">${spotlightThree.price.toFixed(2)}</p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`/product/${spotlightThree._id}`} className="rounded-lg bg-[#0A1F44] px-5 py-3 text-sm font-semibold text-white">
                View Product
              </Link>
              <Link href="/shop" className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-[#0A1F44]">
                Browse More
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-6 pb-14">
        <h2 className="text-2xl font-bold text-[#0A1F44]">What Customers Say</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            "Amazing quality for the price.",
            "Perfect styles for my whole family.",
            "Fast shipping and beautiful packaging.",
          ].map((quote) => (
            <div key={quote} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <p className="text-slate-600">&ldquo;{quote}&rdquo;</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-14">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 md:p-8">
          <h2 className="text-2xl font-bold text-[#0A1F44]">How Do You Shop?</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-4">
            {[
              ["Trending", "/shop"],
              ["New Arrivals", "/shop"],
              ["Category Guides", "/categories"],
              ["Style Blog", "/blog"],
            ].map(([label, href]) => (
              <Link
                key={label}
                href={href}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-[#0A1F44] transition hover:bg-slate-50"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="rounded-2xl bg-[#FFD166] p-8 text-[#0A1F44]">
          <h2 className="text-2xl font-bold">Get 10% Off Your First Order</h2>
          <p className="mt-2">Join our newsletter for drops, trends, and exclusive offers.</p>
          <div className="mt-4 flex gap-3">
            <input className="w-full max-w-md rounded-lg bg-white px-4 py-3 outline-none" placeholder="Enter your email" />
            <button className="rounded-lg bg-[#0A1F44] px-5 py-3 font-semibold text-white">Subscribe</button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-[#0A1F44]">Young Wears Style Blog</h2>
              <p className="mt-1 text-sm text-slate-500">Explore 20 fresh articles with practical fashion inspiration.</p>
            </div>
            <Link href="/blog" className="rounded-lg bg-[#0A1F44] px-5 py-3 font-semibold text-white">
              Visit Blog
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Free shipping over $60", "Fast nationwide delivery on qualified orders."],
            ["Easy returns in 7 days", "Hassle-free return process for a better buying experience."],
            ["Secure checkout", "Trusted payments and protected customer data."],
          ].map(([title, desc]) => (
            <div key={title} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-[#0A1F44]">{title}</h3>
              <p className="mt-2 text-sm text-slate-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
