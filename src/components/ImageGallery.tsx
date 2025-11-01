"use client";

import { Carousel } from "@/components/ui/carousel"; // Naya carousel component import karein

// Aapke purane ImageGallery.tsx se images
const slideData = [
  {
    title: "Classroom",
    src: "/images/classroom1.png",
  },
  {
    title: "Coaching Center",
    src: "/images/coaching1.png",
  },
  {
    title: "Drawing Competition",
    src: "/images/drawing-competition.png",
  },
  {
    title: "Saraswati Puja",
    src: "/images/maa-saraswati.png",
  },
  {
    title: "Rooftop",
    src: "/images/roof.png",
  },
];

export default function ImageGallery() {
  return (
    <section className="bg-gradient-to-tr from-black via-neutral-700/60 to-black py-24">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-white mb-12">
          Glimpses of Our Academy
        </h2>

        {/* Naya Carousel Component yahan istemal karein */}
        <div className="relative overflow-hidden w-full h-full py-20">
          <Carousel slides={slideData} />
        </div>
      </div>
    </section>
  );
}
