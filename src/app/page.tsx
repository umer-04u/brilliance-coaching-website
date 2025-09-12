import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TeachersSection from "@/components/TeachersSection";
import CoursesSection from "@/components/CoursesSection";
import ImageGallery from "@/components/ImageGallery";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <TeachersSection />
      <ImageGallery />
      <CoursesSection />
    </main>
  );
}
