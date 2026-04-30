import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "./providers";
import AnnouncementBar from "@/components/AnnouncementBar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://young-wears.vercel.app"),
  title: "Young Wears | Style for Every Generation",
  description: "Modern fashion store for kids and adults.",
  keywords: ["young wears", "fashion", "kids wear", "mens wear", "womens wear", "ecommerce clothing"],
  openGraph: {
    title: "Young Wears | Style for Every Generation",
    description: "Shop premium, affordable fashion for kids and adults.",
    type: "website",
    url: "/",
    siteName: "Young Wears",
    images: [
      {
        url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200",
        width: 1200,
        height: 630,
        alt: "Young Wears fashion collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Young Wears | Style for Every Generation",
    description: "Modern fashion for every generation.",
    images: ["https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-slate-50 text-slate-900">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <AnnouncementBar />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
