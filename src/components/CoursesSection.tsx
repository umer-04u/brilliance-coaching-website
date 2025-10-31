"use client"; // Ise client component banayein taaki Supabase call aasan ho

import { supabase } from "@/lib/supabaseClient";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { useState, useEffect } from "react"; // Hooks import karein

// --- YEH HAI FIX ---
// Course type ko yahan define kiya gaya hai
interface Course {
  id: number;
  title: string;
  description: string;
}

export default function CoursesSection() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      // Data ko server-side ki jagah client-side par fetch karein
      const { data } = await supabase.from("courses").select("*");
      if (data) {
        setCourses(data);
      }
    };
    fetchCourses();
  }, []);

  if (!courses || courses.length === 0) {
    return null; // Jab tak courses load na ho, kuch na dikhayein
  }

  return (
    <section id="courses-section" className="bg-gray-900 py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-white mb-12">
          Courses We Offer
        </h2>

        {/* Grid container ko 'items-stretch' diya gaya hai */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {courses.map((course: Course) => (
            // CardContainer ko 'h-full' diya gaya hai
            <CardContainer key={course.id} className="inter-var h-full">
              {/* CardBody ko 'h-full flex flex-col' diya gaya hai */}
              <CardBody className="relative group/card bg-gray-800 hover:shadow-2xl hover:shadow-blue-500/20 border-white/[0.2] w-full h-full flex flex-col rounded-xl p-8 border">
                <CardItem
                  translateZ="50"
                  className="text-2xl font-bold text-white mb-4"
                >
                  {course.title}
                </CardItem>

                {/* Description ko 'flex-grow' diya gaya hai taaki woh bachi hui jagah le le */}
                <CardItem
                  as="p"
                  translateZ="60"
                  className="text-gray-300 text-sm max-w-sm mt-2 flex-grow"
                >
                  {course.description}
                </CardItem>
              </CardBody>
            </CardContainer>
          ))}
        </div>
      </div>
    </section>
  );
}
