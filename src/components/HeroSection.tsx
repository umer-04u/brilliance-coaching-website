export default function HeroSection() {
  return (
    <section className="bg-gray-900 text-white flex items-center justify-center min-h-screen">
      <div className="text-center p-6">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Unlock Your Potential
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Join Brilliance Coaching Academy and excel in your journey.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105">
          Explore Courses
        </button>
      </div>
    </section>
  );
}
