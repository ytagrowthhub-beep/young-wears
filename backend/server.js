const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "young_wears_secret";
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/young_wears";

app.use(cors());
app.use(express.json({ limit: "2mb" }));

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    profilePicture: { type: String, default: "" },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: String,
    category: String,
    audience: String,
    price: Number,
    sizes: [String],
    image: String,
    description: String,
    trending: Boolean,
    stock: Number,
    isNew: Boolean,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
const Product = mongoose.model("Product", productSchema);

const childClothes = [
  ["Mini Motion Tee", 24.99, ["4Y", "6Y", "8Y", "10Y"], "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=1200"],
  ["Tiny Trail Hoodie", 29.99, ["4Y", "6Y", "8Y", "10Y"], "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=1200"],
  ["Playtime Cargo Set", 34.99, ["4Y", "6Y", "8Y"], "https://images.unsplash.com/photo-1476234251651-f353703a034d?q=80&w=1200"],
  ["Junior Street Joggers", 22.99, ["4Y", "6Y", "8Y", "10Y"], "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200"],
  ["Little Star Denim", 27.99, ["4Y", "6Y", "8Y", "10Y"], "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200"],
  ["Color Pop Windbreaker", 31.99, ["6Y", "8Y", "10Y"], "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=1200"],
  ["Happy Day Dress", 26.99, ["4Y", "6Y", "8Y"], "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200"],
  ["School Run Polo", 19.99, ["4Y", "6Y", "8Y", "10Y"], "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200"],
  ["Weekend Knit Set", 33.99, ["4Y", "6Y", "8Y"], "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200"],
  ["Adventure Shorts", 18.99, ["4Y", "6Y", "8Y", "10Y"], "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1200"],
  ["Mini Classic Shirt", 21.99, ["4Y", "6Y", "8Y", "10Y"], "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200"],
  ["Sunny Day Romper", 25.99, ["4Y", "6Y", "8Y"], "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200"],
  ["Youth Flex Tracksuit", 38.99, ["6Y", "8Y", "10Y"], "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=1200"],
];

const adultClothes = [
  ["Urban Drift Tee", 34.99, ["S", "M", "L", "XL"], "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200"],
  ["Sunset Cargo Pants", 54.99, ["30", "32", "34", "36"], "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1200"],
  ["Metro Fit Hoodie", 49.99, ["S", "M", "L", "XL"], "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1200"],
  ["Core Denim Jacket", 69.99, ["S", "M", "L"], "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?q=80&w=1200"],
  ["Essential Polo", 32.99, ["S", "M", "L", "XL"], "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200"],
  ["Street Taper Jeans", 57.99, ["30", "32", "34", "36"], "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1200"],
  ["Coastline Linen Shirt", 39.99, ["S", "M", "L", "XL"], "https://images.unsplash.com/photo-1484515991647-c5760fcecfc7?q=80&w=1200"],
  ["All Day Chinos", 45.99, ["30", "32", "34", "36"], "https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=1200"],
  ["Modern Crew Sweatshirt", 41.99, ["S", "M", "L", "XL"], "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=1200"],
  ["Young Wears Varsity Jacket", 74.99, ["S", "M", "L"], "https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=1200"],
  ["Athleisure Flex Set", 63.99, ["S", "M", "L", "XL"], "https://images.unsplash.com/photo-1506629905607-d9f3174d0a5e?q=80&w=1200"],
  ["Weekend Utility Shirt", 37.99, ["S", "M", "L", "XL"], "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1200"],
  ["Everyday Comfort Tee", 28.99, ["S", "M", "L", "XL"], "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=1200"],
];

const womenClothes = [
  ["Skyline Jacket", 79.99, ["S", "M", "L"], "https://images.unsplash.com/photo-1543076447-215ad9ba6923?q=80&w=1200"],
  ["Bloom Knit Dress", 64.99, ["S", "M", "L"], "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1200"],
  ["Chic Flow Blouse", 38.99, ["S", "M", "L", "XL"], "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200"],
  ["Luna Fit Jeans", 55.99, ["26", "28", "30", "32"], "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=1200"],
  ["Velvet Evening Top", 42.99, ["S", "M", "L"], "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200"],
  ["Daisy Day Midi Dress", 59.99, ["S", "M", "L"], "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1200"],
  ["Cityline Wide Pants", 49.99, ["S", "M", "L", "XL"], "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200"],
  ["Morning Glow Cardigan", 44.99, ["S", "M", "L"], "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200"],
  ["Classic Wrap Skirt", 36.99, ["S", "M", "L"], "https://images.unsplash.com/photo-1551232864-3f0890e580d9?q=80&w=1200"],
  ["Summer Breeze Top", 29.99, ["S", "M", "L", "XL"], "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1200"],
  ["Signature Blazer", 84.99, ["S", "M", "L"], "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=1200"],
  ["Softline Lounge Set", 58.99, ["S", "M", "L", "XL"], "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=1200"],
];

const otherWears = [
  ["Everyday Cap", 16.99, ["One Size"], "https://images.unsplash.com/photo-1521369909029-2afed882baee?q=80&w=1200"],
  ["Street Crossbody Bag", 28.99, ["One Size"], "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200"],
  ["Urban Sneakers", 72.99, ["39", "40", "41", "42", "43"], "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200"],
  ["Classic Leather Belt", 22.99, ["M", "L", "XL"], "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1200"],
  ["Comfy Crew Socks", 9.99, ["One Size"], "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?q=80&w=1200"],
  ["Weekend Tote", 24.99, ["One Size"], "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1200"],
  ["Sport Watch Strap", 18.99, ["One Size"], "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=1200"],
  ["Minimal Wallet", 19.99, ["One Size"], "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1200"],
  ["Travel Duffel", 49.99, ["One Size"], "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1200"],
  ["Youth Backpack", 34.99, ["One Size"], "https://images.unsplash.com/photo-1500534623283-312aade485b7?q=80&w=1200"],
  ["Athletic Slides", 23.99, ["39", "40", "41", "42"], "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1200"],
  ["Polarized Sunglasses", 27.99, ["One Size"], "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1200"],
];

const makeProducts = (items, category, audience) =>
  items.map(([name, price, sizes, image], index) => ({
    name: `Young Wears ${name}`,
    category,
    audience,
    price,
    sizes,
    image,
    description: `${name} crafted for modern comfort, standout style, and everyday confidence.`,
    trending: index < 3,
    stock: Math.max(2, 18 - index),
    isNew: index < 2,
  }));

const sampleProducts = [
  ...makeProducts(childClothes, "Child Clothes", "child"),
  ...makeProducts(adultClothes, "Adult Clothes", "adult"),
  ...makeProducts(womenClothes, "Women Clothes", "women"),
  ...makeProducts(otherWears, "Other Wears", "unisex"),
];

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "Young Wears API is running." });
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "Email already in use." });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Registration failed." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials." });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials." });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });
    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed." });
  }
});

app.get("/api/profile", authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  if (!user) return res.status(404).json({ message: "User not found." });
  return res.json(user);
});

app.put("/api/profile", authMiddleware, async (req, res) => {
  const allowed = ["name", "email", "phone", "address", "profilePicture"];
  const updates = {};
  allowed.forEach((field) => {
    if (typeof req.body[field] !== "undefined") updates[field] = req.body[field];
  });

  const user = await User.findByIdAndUpdate(req.userId, updates, { new: true }).select("-password");
  if (!user) return res.status(404).json({ message: "User not found." });
  return res.json(user);
});

app.delete("/api/profile", authMiddleware, async (req, res) => {
  await User.findByIdAndDelete(req.userId);
  return res.json({ message: "Account deleted." });
});

app.get("/api/products", async (req, res) => {
  const { category, minPrice, maxPrice, size } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (size) filter.sizes = size;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const products = await Product.find(filter).sort({ createdAt: -1 });
  return res.json(products);
});

app.get("/api/products/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found." });
  return res.json(product);
});

async function bootstrap() {
  try {
    await mongoose.connect(MONGODB_URI);
    const count = await Product.countDocuments();
    if (count < sampleProducts.length) {
      await Product.deleteMany({});
      await Product.insertMany(sampleProducts);
      console.log(`Sample products seeded: ${sampleProducts.length}`);
    }
    app.listen(PORT, () => {
      console.log(`Young Wears API running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
}

bootstrap();
