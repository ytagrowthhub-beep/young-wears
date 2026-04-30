"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const slides = [
  {
    src: "https://images.unsplash.com/photo-1484515991647-c5760fcecfc7?q=80&w=900",
    alt: "Young Wears male model in casual look",
  },
  {
    src: "https://images.unsplash.com/photo-1536766820879-059fec98ec0a?q=80&w=900",
    alt: "Young Wears male model in trendy outfit",
  },
];

export default function HeroSlider() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative h-96 overflow-hidden rounded-2xl">
      {slides.map((slide, index) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-700 ${active === index ? "opacity-100" : "opacity-0"}`}
        >
          <Image src={slide.src} alt={slide.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" priority={index === 0} />
        </div>
      ))}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.src}
            onClick={() => setActive(index)}
            className={`h-2 w-8 rounded-full transition ${active === index ? "bg-white" : "bg-white/50"}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
