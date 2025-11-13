import HeroSection from "@/components/HeroSection";
const TeachersSection = dynamic(() => import("@/components/TeachersSection"));
const CoursesSection = dynamic(() => import("@/components/CoursesSection"));;
const ImageGallery = dynamic(() => import("@/components/ImageGallery"));
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabaseClient";

export default async function HomePage() {
  // Data ko server par fetch karein
  const { data: courses } = await supabase.from("courses").select("*");
  const { data: teachers } = await supabase.from("teachers").select("*");
  return (
    <main>
      <HeroSection />
      <ImageGallery />
      <CoursesSection courses={courses || []} />
      <TeachersSection teachers={teachers || []} />
    </main>
  );
}
