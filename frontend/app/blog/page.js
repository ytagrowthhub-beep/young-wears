import { blogPosts } from "@/lib/blogPosts";
import Link from "next/link";

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-bold text-[#0A1F44]">Young Wears Blog</h1>
      <p className="mt-2 text-slate-500">
        20 style articles covering child clothes, adult clothes, women clothes, and other wears.
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <article key={post.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#FF7A00]">{post.category}</p>
            <h2 className="mt-2 text-lg font-semibold text-[#0A1F44]">{post.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{post.excerpt}</p>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
              <span>{post.author}</span>
              <span>{post.readTime}</span>
            </div>
            <p className="mt-1 text-xs text-slate-400">{post.date}</p>
            <Link href={`/blog/${post.id}`} className="mt-4 inline-block rounded-lg bg-[#0A1F44] px-4 py-2 text-sm font-semibold text-white">
              Read Article
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
