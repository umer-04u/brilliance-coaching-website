"use client";

import React from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

// Yahan apni gallery ki images ke naam daalein
const images = [
  "/images/classroom1.png",
  "/images/coaching1.png",
  "/images/drawing-competition.png",
  "/images/maa-saraswati.png",
  "/images/roof.png",
];

export default function ImageGallery() {
  // Embla Carousel ko autoplay plugin ke saath set up karein
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 3000 }),
  ]);

  return (
    <section className="bg-gray-800 py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-white mb-12">
          Glimpses of Our Academy
        </h2>

        <div className="embla" ref={emblaRef}>
          <div className="embla__container">
            {images.map((src, index) => (
              <div className="embla__slide p-2" key={index}>
                <div className="relative h-64 md:h-80 overflow-hidden rounded-lg">
                  <Image
                    src={src}
                    alt={`Coaching gallery image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
