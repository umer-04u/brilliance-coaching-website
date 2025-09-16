"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-white flex items-center justify-center min-h-screen"
    >
      <div className="text-center p-6 relative z-10">
        {/* Glow effect ke liye wrapper */}
        <div className="relative inline-block">
          {/* Glow element (background mein) */}
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-3xl opacity-40"></div>

          {/* Heading (glow ke upar) */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative text-5xl md:text-7xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
          >
            Unlock Your Potential
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto mt-4"
        >
          Join Brilliance Coaching Academy and excel in your journey.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link href="#courses-section">
            {/* Naya Gradient Button */}
            <button className="text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/30">
              Explore Our Courses
            </button>
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}
