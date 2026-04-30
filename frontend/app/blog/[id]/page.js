import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts } from "@/lib/blogPosts";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ id: String(post.id) }));
}

export default async function BlogDetailPage({ params }) {
  const { id } = await params;
  const post = blogPosts.find((item) => String(item.id) === id);
  if (!post) return notFound();

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <Link href="/blog" className="text-sm font-medium text-[#0A1F44] hover:underline">
        Back to Blog
      </Link>
      <article className="mt-4 rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#FF7A00]">{post.category}</p>
        <h1 className="mt-3 text-3xl font-bold text-[#0A1F44]">{post.title}</h1>
        <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-500">
          <span>{post.author}</span>
          <span>{post.date}</span>
          <span>{post.readTime}</span>
        </div>
        <p className="mt-6 text-slate-700">{post.excerpt}</p>
        <div className="mt-5 space-y-4 text-slate-600">
          <p>
            Young Wears believes great style should be easy, affordable, and expressive. This article
            breaks down practical outfit combinations you can wear every day while still keeping a premium look.
          </p>
          <p>
            Start with one statement piece, balance it with neutral basics, then complete the fit with
            accessories from our Other Wears collection. This simple system helps you build repeatable looks
            that feel effortless and modern.
          </p>
          <p>
            For families, consider mixing tones across child and adult outfits to create coordinated style
            without looking overly matched. Focus on comfort-first fabrics and silhouettes that move with you.
          </p>
        </div>
      </article>
    </div>
  );
}
