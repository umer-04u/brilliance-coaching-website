import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TeachersSection from "@/components/TeachersSection";
import CoursesSection from "@/components/CoursesSection";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <TeachersSection />
      <CoursesSection />
    </main>
  );
}
