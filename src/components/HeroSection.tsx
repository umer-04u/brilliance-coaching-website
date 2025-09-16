"use client"; // Animations ke liye ise client component banana zaroori hai

import { motion } from "framer-motion"; // Framer Motion se 'motion' import karein
import Link from 'next/link';
export default function HeroSection() {
  return (
    // Section ko animate karein
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900 text-white flex items-center justify-center min-h-screen"
    >
      <div className="text-center p-6">
        {/* Heading ko animate karein */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-5xl md:text-7xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
        >
          Unlock Your Potential
        </motion.h1>

        {/* Paragraph ko animate karein */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
        >
          Join Brilliance Coaching Academy and excel in your journey.
        </motion.p>

        {/* Button ko animate karein */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
        <Link href="#courses-section">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105">
            Explore Our Courses
          </button>
        </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}
