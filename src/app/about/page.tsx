
export default function AboutPage() {
  return (
    <>
      <main className="min-h-screen bg-gradient-to-tr from-black via-neutral-700/60 to-black text-white pt-24 px-4 md:px-8">
        <div className="container mx-auto py-12">
          <h1 className="text-5xl font-bold text-center mb-12">
            About Brilliance Coaching Academy
          </h1>

          <section className="bg-gray-800 p-8 rounded-lg shadow-lg mb-12">
            <h2 className="text-3xl font-semibold mb-6 text-blue-400">
              Our Mission
            </h2>
            <p className="text-lg leading-relaxed mb-4">
              At Brilliance Academy, our mission is to ignite the spark of
              knowledge and empower students to achieve their highest academic
              potential. We believe in nurturing talent, fostering critical
              thinking, and building a strong foundation for a successful
              future.
            </p>
            <p className="text-lg leading-relaxed">
              We are committed to providing an exceptional learning environment
              where every student feels valued, challenged, and inspired to
              excel.
            </p>
          </section>

          <section className="bg-gray-800 p-8 rounded-lg shadow-lg mb-12">
            <h2 className="text-3xl font-semibold mb-6 text-blue-400">
              Our Vision
            </h2>
            <p className="text-lg leading-relaxed mb-4">
              To be the leading coaching institute recognized for its innovative
              teaching methodologies, unwavering commitment to student success,
              and contribution to creating responsible and brilliant minds.
            </p>
            <p className="text-lg leading-relaxed">
              We envision a future where our students not only ace their
              examinations but also develop a lifelong love for learning and
              become leaders in their chosen fields.
            </p>
          </section>

          <section className="bg-gray-800 p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-semibold mb-6 text-blue-400">
              Why Choose Us?
            </h2>
            <ul className="list-disc list-inside space-y-3 text-lg">
              <li>Experienced and Dedicated Faculty</li>
              <li>Personalized Attention and Mentorship</li>
              <li>Comprehensive Study Material and Regular Tests</li>
              <li>State-of-the-Art Learning Facilities</li>
              <li>Proven Track Record of Success</li>
            </ul>
          </section>
        </div>
      </main>
    </>
  );
}
