export const blogPosts = Array.from({ length: 20 }).map((_, idx) => {
  const topics = [
    "Streetwear Essentials",
    "Budget Style Hacks",
    "Kids Outfit Guide",
    "Work-to-Weekend Looks",
    "Seasonal Color Trends",
    "Capsule Wardrobe",
    "Sustainable Fashion Tips",
    "Sneaker Styling",
    "Family Matching Outfits",
    "Confidence Through Style",
  ];
  const topic = topics[idx % topics.length];
  return {
    id: idx + 1,
    title: `Young Wears Blog ${idx + 1}: ${topic}`,
    excerpt:
      "Discover practical styling ideas, trend insights, and budget-friendly tips to level up your wardrobe for every generation.",
    author: idx % 2 === 0 ? "Young Wears Team" : "Style Editor",
    date: `2026-04-${String((idx % 28) + 1).padStart(2, "0")}`,
    readTime: `${4 + (idx % 4)} min read`,
    category: ["Trends", "Styling", "Kids", "Women", "Adult"][idx % 5],
  };
});
