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
  "Activewear & Gym": {
    slug: "activewear-gym",
    title: "Activewear & Gym",
    description: "Performance layers, breathable fabrics, and gym-ready silhouettes with everyday polish.",
    heroImage:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1400",
  },
  "Footwear & Sneakers": {
    slug: "footwear-sneakers",
    title: "Footwear & Sneakers",
    description: "Sneakers, slides, and street-ready pairs built for long days and bold moves.",
    heroImage:
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1400",
  },
};

/** Display order for nav, shop, and home — keys match product `category` in the API. */
export const categoryTitles = Object.keys(categoryMeta);

export const categoryDisplayOrder = [
  "Women Clothes",
  "Adult Clothes",
  "Child Clothes",
  "Activewear & Gym",
  "Footwear & Sneakers",
  "Other Wears",
];

export const categories = Object.values(categoryMeta);

export const categoryBySlug = Object.values(categoryMeta).reduce((acc, item) => {
  acc[item.slug] = item;
  return acc;
}, {});
