import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-white/10 backdrop-blur-md text-white w-full fixed top-0 left-0 z-10">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold">
          <Link href="/">Brilliance Coaching Academy</Link>
        </div>
        <div className="space-x-8 text-lg flex items-center">
          <Link
            href="/about"
            className="hover:text-blue-300 transition duration-300"
          >
            About Us
          </Link>
          <Link
            href="/contact"
            className="hover:text-blue-300 transition duration-300"
          >
            Contact Us
          </Link>
          <div className="h-6 border-l border-gray-500"></div>
          <Link
            href="/student-login"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md text-sm transition duration-300"
          >
            Student Login
          </Link>
          <Link
            href="/teacher-login"
            className="hover:text-blue-300 transition duration-300 text-sm"
          >
            Teacher Login
          </Link>
        </div>
      </nav>
    </header>
  );
}
