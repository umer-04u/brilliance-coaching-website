import Image from "next/image";

// Yahan apni images ke naam daalein jo aapne public/images folder mein rakhe hain
const images = [
  "/images/classroom1.png",
  "/images/coaching1.png",
  "/images/drawing-competition.png",
  "/images/maa-saraswati.png",
  "/images/roof.png",
];

export default function ImageGallery() {
  return (
    <section className="bg-gray-900 py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-white mb-12">
          Our Gallery
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((src, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-lg shadow-lg transform hover:scale-105 transition duration-300"
            >
              <Image
                src={src}
                alt={`Coaching gallery image ${index + 1}`}
                width={500}
                height={300}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
