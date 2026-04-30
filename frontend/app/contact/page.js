import Link from "next/link";
import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contact Us | Young Wears",
  description: "Get in touch with Young Wears for orders, sizing, or general questions.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#FF7A00]">Contact</p>
        <h1 className="mt-2 text-3xl font-bold text-[#0A1F44] md:text-4xl">We&apos;re here to help</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Send us a note about orders, sizing, returns, or anything else. We read every message and aim to reply within
          one business day.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <aside className="space-y-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:p-8">
          <div>
            <h2 className="font-semibold text-[#0A1F44]">Customer care</h2>
            <p className="mt-2 text-sm text-slate-600">
              Email{" "}
              <a href="mailto:support@youngwears.example" className="font-medium text-[#0A1F44] underline-offset-2 hover:underline">
                support@youngwears.example
              </a>
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-[#0A1F44]">Hours</h2>
            <p className="mt-2 text-sm text-slate-600">Monday–Friday, 9am–6pm (local time)</p>
          </div>
          <div>
            <h2 className="font-semibold text-[#0A1F44]">Quick links</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/shop" className="text-[#0A1F44] underline-offset-2 hover:underline">
                  Shop all products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-[#0A1F44] underline-offset-2 hover:underline">
                  Browse categories
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-[#0A1F44] underline-offset-2 hover:underline">
                  Style blog
                </Link>
              </li>
            </ul>
          </div>
        </aside>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-xl font-bold text-[#0A1F44]">Send a message</h2>
          <p className="mt-1 text-sm text-slate-500">Fields marked required must be filled before submitting.</p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
