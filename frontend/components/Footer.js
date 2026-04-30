import Link from "next/link";

export default function Footer() {
  return (
    <footer id="contact" className="mt-20 bg-[#0A1F44] text-slate-100">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-4">
        <div>
          <h3 className="text-xl font-semibold">Young Wears</h3>
          <p className="mt-2 text-sm text-slate-300">Style for Every Generation.</p>
        </div>
        <div>
          <h4 className="font-semibold">Quick Links</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li><Link className="hover:text-white transition" href="/">Home</Link></li>
            <li><Link className="hover:text-white transition" href="/shop">Shop</Link></li>
            <li><Link className="hover:text-white transition" href="/categories">Categories</Link></li>
            <li><Link className="hover:text-white transition" href="/blog">Blog</Link></li>
            <li><Link className="hover:text-white transition" href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Follow Us</h4>
          <p className="mt-3 text-sm text-slate-300">Instagram | TikTok | Facebook</p>
        </div>
        <div>
          <h4 className="font-semibold">Help</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li><Link className="hover:text-white transition" href="/shop">Delivery Information</Link></li>
            <li><Link className="hover:text-white transition" href="/shop">Returns Policy</Link></li>
            <li><Link className="hover:text-white transition" href="/login">My Account</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
