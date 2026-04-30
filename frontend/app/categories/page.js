import Link from "next/link";
import { categories } from "@/lib/categories";

export default function CategoriesPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-bold text-[#0A1F44]">Shop by Category</h1>
      <p className="mt-2 text-slate-500">Explore focused collections for every style need.</p>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/categories/${category.slug}`}
            className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div
              className="h-52 w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${category.heroImage})` }}
            />
            <div className="p-5">
              <h2 className="text-xl font-semibold text-[#0A1F44]">{category.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{category.description}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-[#FF7A00]">
                Explore {category.title}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
