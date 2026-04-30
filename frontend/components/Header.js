"use client";

import Link from "next/link";
import { ShoppingBag, User, Menu, X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/categories", label: "Categories" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const megaMenu = {
  Women: {
    groups: [
      { title: "Trending", links: ["New Arrivals", "Best Sellers", "Running Edit"] },
      { title: "Products", links: ["Tops", "Leggings", "Sports Sets", "Jackets"] },
      { title: "Shop By", links: ["Women Clothes", "Top Rated", "Most Loved"] },
    ],
    featured: [
      { title: "NEW IN", subtitle: "Fresh drops this week", href: "/categories/women-clothes" },
      { title: "BEST SELLERS", subtitle: "Most loved fits", href: "/shop?category=Women%20Clothes" },
    ],
  },
  Men: {
    groups: [
      { title: "Trending", links: ["New Arrivals", "Best Sellers", "Training Picks"] },
      { title: "Products", links: ["T-Shirts", "Shorts", "Joggers", "Outerwear"] },
      { title: "Shop By", links: ["Adult Clothes", "Most Popular", "Performance"] },
    ],
    featured: [
      { title: "SHORTS JUST LANDED", subtitle: "Lightweight and breathable", href: "/categories/adult-clothes" },
      { title: "MOST POPULAR", subtitle: "Daily essentials", href: "/shop?category=Adult%20Clothes" },
    ],
  },
  Accessories: {
    groups: [
      { title: "Trending", links: ["All Accessories", "New Arrivals", "Best Sellers"] },
      { title: "Collections", links: ["Bags", "Caps", "Socks", "Footwear"] },
      { title: "Shop By", links: ["Other Wears", "Seasonal Edit", "Last Chance"] },
    ],
    featured: [
      { title: "ACCESSORIES EDIT", subtitle: "Complete every look", href: "/categories/other-wears" },
      { title: "TOP PICKS", subtitle: "Bags, shoes and more", href: "/shop?category=Other%20Wears" },
    ],
  },
  Explore: {
    groups: [
      { title: "Guides", links: ["Style Guide", "Size Guide", "Lookbook"] },
      { title: "Content", links: ["Blog", "Category Guides", "New to Young Wears?"] },
      { title: "Highlights", links: ["Best Sellers", "Most Loved", "Weekly Deals"] },
    ],
    featured: [
      { title: "YOUNG WEARS BLOG", subtitle: "20 style stories", href: "/blog" },
      { title: "SHOP CATEGORIES", subtitle: "Browse by collection", href: "/categories" },
    ],
  },
};

const MEGA_KEYS = Object.keys(megaMenu);

export default function Header() {
  const [open, setOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState("");
  const { items } = useCart();
  const { user } = useAuth();
  const pathname = usePathname();

  const uid = useId();
  const megaPanelRef = useRef(null);
  const triggerRefs = useRef({});

  const focusTrigger = useCallback((name) => {
    const el = triggerRefs.current[name];
    if (el && typeof el.focus === "function") el.focus();
  }, []);

  const closeMegaMenu = useCallback(
    (returnToMenuName) => {
      setActiveMegaMenu("");
      if (returnToMenuName) requestAnimationFrame(() => focusTrigger(returnToMenuName));
    },
    [focusTrigger]
  );

  useEffect(() => {
    if (!activeMegaMenu) return undefined;
    const onDocKeyDown = (e) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      closeMegaMenu(activeMegaMenu);
    };
    document.addEventListener("keydown", onDocKeyDown);
    return () => document.removeEventListener("keydown", onDocKeyDown);
  }, [activeMegaMenu, closeMegaMenu]);

  useEffect(() => {
    if (!activeMegaMenu || !megaPanelRef.current) return undefined;
    const panel = megaPanelRef.current;
    const focusables = panel.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
    const nodes = [...focusables].filter((el) => !el.hasAttribute("disabled"));
    if (!nodes.length) return undefined;

    const onPanelKeyDown = (e) => {
      if (e.key !== "Tab" || nodes.length < 2) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    panel.addEventListener("keydown", onPanelKeyDown);
    return () => panel.removeEventListener("keydown", onPanelKeyDown);
  }, [activeMegaMenu]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="text-xl font-bold text-[#0A1F44]">
          Young <span className="text-[#FF7A00]">Wears</span>
        </Link>

        <button
          className="rounded-lg p-1 text-[#0A1F44] hover:bg-slate-100 md:hidden"
          onClick={() => setOpen((s) => !s)}
          aria-label="Toggle navigation menu"
        >
          {open ? <X /> : <Menu />}
        </button>

        <nav
          className={`${open ? "flex" : "hidden"} absolute left-4 right-4 top-16 flex-col gap-2 rounded-xl border border-slate-100 bg-white p-3 shadow-lg md:static md:flex md:flex-row md:gap-6 md:border-none md:bg-transparent md:p-0 md:shadow-none`}
        >
          {navLinks.map((link) => {
            const isShopLink = link.href.startsWith("/shop");
            const isActive = isShopLink ? pathname.startsWith("/shop") : pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2 text-sm transition ${
                  isActive ? "bg-slate-100 text-[#0A1F44]" : "text-slate-700 hover:bg-slate-50 hover:text-[#0A1F44]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative text-[#0A1F44] transition hover:text-[#FF7A00]">
            <ShoppingBag />
            {!!items.length && (
              <span className="absolute -right-2 -top-2 rounded-full bg-[#FF7A00] px-1.5 text-xs text-white">{items.length}</span>
            )}
          </Link>

          {user ? (
            <Link href="/profile" className="text-[#0A1F44] transition hover:text-[#FF7A00]" aria-label="Profile">
              <User />
            </Link>
          ) : (
            <Link href="/login" className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-[#0A1F44] hover:bg-slate-50">
              Login
            </Link>
          )}
        </div>
      </div>

      <div className="hidden border-t border-slate-100 px-4 py-2 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
          <div className="flex flex-wrap items-center gap-4">
            {MEGA_KEYS.map((menuName) => {
              const panelId = `${uid}-mega-panel-${menuName}`;
              const triggerId = `${uid}-mega-trigger-${menuName}`;
              const isOpen = activeMegaMenu === menuName;
              return (
                <button
                  key={menuName}
                  id={triggerId}
                  ref={(el) => {
                    triggerRefs.current[menuName] = el;
                  }}
                  type="button"
                  className={`rounded-sm px-0.5 hover:text-[#0A1F44] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A1F44] ${
                    isOpen ? "text-[#0A1F44]" : ""
                  }`}
                  aria-haspopup="true"
                  aria-expanded={isOpen}
                  aria-controls={isOpen ? panelId : undefined}
                  onMouseEnter={() => setActiveMegaMenu(menuName)}
                  onFocus={() => setActiveMegaMenu(menuName)}
                  onClick={() => setActiveMegaMenu((prev) => (prev === menuName ? "" : menuName))}
                  onKeyDown={(e) => {
                    const idx = MEGA_KEYS.indexOf(menuName);
                    if (e.key === "ArrowRight") {
                      e.preventDefault();
                      focusTrigger(MEGA_KEYS[(idx + 1) % MEGA_KEYS.length]);
                    } else if (e.key === "ArrowLeft") {
                      e.preventDefault();
                      focusTrigger(MEGA_KEYS[(idx - 1 + MEGA_KEYS.length) % MEGA_KEYS.length]);
                    } else if (e.key === "ArrowDown") {
                      if (!isOpen) setActiveMegaMenu(menuName);
                      e.preventDefault();
                      requestAnimationFrame(() => {
                        const link = megaPanelRef.current?.querySelector("a[href]");
                        link?.focus();
                      });
                    } else if (e.key === "Escape" && isOpen) {
                      e.preventDefault();
                      closeMegaMenu(menuName);
                    }
                  }}
                >
                  {menuName}
                </button>
              );
            })}
          </div>

          <Link href="/shop" className="text-[#FF7A00] hover:opacity-80">
            New In
          </Link>
        </div>
      </div>

      {!!activeMegaMenu && (
        <div className="relative hidden md:block" onMouseLeave={() => setActiveMegaMenu("")}>
          <div
            id={`${uid}-mega-panel-${activeMegaMenu}`}
            ref={megaPanelRef}
            role="region"
            aria-labelledby={`${uid}-mega-trigger-${activeMegaMenu}`}
            tabIndex={-1}
            className="absolute left-0 right-0 z-50 border-y border-slate-100 bg-white shadow-xl outline-none"
          >
            <div className="mx-auto grid max-w-7xl gap-6 px-6 py-6 lg:grid-cols-[1.3fr_1.3fr_1.3fr_1fr]">
              {megaMenu[activeMegaMenu].groups.map((group) => (
                <div key={group.title}>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">{group.title}</h4>
                  <ul className="mt-3 space-y-2">
                    {group.links.map((item) => (
                      <li key={item}>
                        <Link
                          href="/shop"
                          className="rounded-sm text-sm text-[#0A1F44] hover:text-[#FF7A00] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A1F44]"
                          onClick={() => setActiveMegaMenu("")}
                        >
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <div className="space-y-3">
                {megaMenu[activeMegaMenu].featured.map((card) => (
                  <Link
                    key={card.title}
                    href={card.href}
                    className="block rounded-xl border border-slate-200 p-3 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A1F44]"
                    onClick={() => setActiveMegaMenu("")}
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#FF7A00]">{card.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{card.subtitle}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
