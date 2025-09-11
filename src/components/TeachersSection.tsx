import { supabase } from "@/lib/supabaseClient";

export default async function TeachersSection() {
  const { data: teachers } = await supabase.from("teachers").select("*");

  if (!teachers) {
    return null;
  }

  return (
    <section className="bg-gray-800 py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-white mb-12">
          Meet Our Expert Teachers
        </h2>
        <div className="grid grid-cols-1 md-grid-cols-3 gap-8">
          {teachers.map((teacher) => (
            <div
              key={teacher.id} //<- Key ab sahi jagah par hai
              className="bg-gray-900 rounded-lg p-6 text-center transform hover--translate-y-2 transition duration-300"
            >
              <img
                className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-blue-500"
                src={teacher.imageUrl}
                alt={teacher.name}
              />
              <h3 className="text-2xl font-semibold text-white">
                {teacher.name}
              </h3>
              <p className="text-blue-400">{teacher.subject}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
