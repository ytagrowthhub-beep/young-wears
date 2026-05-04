import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { sampleProducts } from "@/lib/sampleProducts";
import { categoryBySlug } from "@/lib/categories";
import { getServerApiBaseUrl } from "@/lib/serverApiBase";

export function generateStaticParams() {
  return Object.keys(categoryBySlug).map((slug) => ({ slug }));
}

async function getCategoryProducts(categoryTitle) {
  const baseUrl = getServerApiBaseUrl();
  try {
    const response = await fetch(
      `${baseUrl}/products?category=${encodeURIComponent(categoryTitle)}`,
      { cache: "no-store" }
    );
    if (!response.ok) throw new Error("Failed");
    return await response.json();
  } catch {
    return sampleProducts.filter((product) => product.category === categoryTitle);
  }
}

export default async function CategoryDetailPage({ params }) {
  const { slug } = await params;
  const category = categoryBySlug[slug];
  if (!category) return notFound();
  const products = await getCategoryProducts(category.title);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <Link href="/categories" className="text-sm font-medium text-[#0A1F44] hover:underline">
        Back to Categories
      </Link>
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div
          className="h-56 bg-cover bg-center"
          style={{ backgroundImage: `linear-gradient(rgba(10,31,68,0.35), rgba(10,31,68,0.35)), url(${category.heroImage})` }}
        />
        <div className="p-6">
          <h1 className="text-3xl font-bold text-[#0A1F44]">{category.title}</h1>
          <p className="mt-2 text-slate-600">{category.description}</p>
          <Link
            href={`/shop?category=${encodeURIComponent(category.title)}`}
            className="mt-4 inline-block rounded-lg bg-[#0A1F44] px-5 py-2 text-sm font-semibold text-white"
          >
            Open in Shop Filters
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
