"use client";

import { useEffect, useState } from "react";

const messages = [
  "Free standard shipping on orders over $60",
  "Get 10% off when you sign up for emails",
  "Students get 12% off with valid ID",
  "Refer a friend and both get $10 off",
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-[#0A1F44] px-4 py-2 text-center text-xs font-medium text-white md:text-sm">
      {messages[index]}
    </div>
  );
}
