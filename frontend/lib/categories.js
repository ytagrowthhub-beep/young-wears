export const categoryMeta = {
  "Child Clothes": {
    slug: "child-clothes",
    title: "Child Clothes",
    description: "Playful, durable, and trend-right essentials for kids on the move.",
    heroImage:
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=1400",
  },
  "Adult Clothes": {
    slug: "adult-clothes",
    title: "Adult Clothes",
    description: "Modern daily wear blending comfort, fit, and premium street style.",
    heroImage:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1400",
  },
  "Women Clothes": {
    slug: "women-clothes",
    title: "Women Clothes",
    description: "Versatile silhouettes crafted for confident, contemporary looks.",
    heroImage:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1400",
  },
  "Other Wears": {
    slug: "other-wears",
    title: "Other Wears",
    description: "Accessories and footwear that complete every outfit with impact.",
    heroImage:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1400",
  },
};

export const categories = Object.values(categoryMeta);

export const categoryBySlug = Object.values(categoryMeta).reduce((acc, item) => {
  acc[item.slug] = item;
  return acc;
}, {});
