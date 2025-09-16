import { supabase } from "@/lib/supabaseClient";

export default async function CoursesSection() {
  const { data: courses } = await supabase.from("courses").select("*");

  if (!courses) {
    return null;
  }

  return (
    <section id ="courses-section" className="bg-gray-900 py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-white mb-12">
          Courses We Offer
        </h2>
        <div className="grid grid-cols-1 md-grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course.id} //<- Key ab sahi jagah par hai
              className="bg-gray-800 p-8 rounded-xl shadow-lg transform hover:scale-105 transition duration-300"
            >
              <h3 className="text-2xl font-bold text-white mb-4">
                {course.title}
              </h3>
              <p className="text-gray-300">{course.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
