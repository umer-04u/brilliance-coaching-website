"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { Boxes } from "@/components/ui/background-boxes";
import { cn } from "@/lib/utils"; 

export default function HeroSection() {
  return (
    <div className="min-h-screen relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center rounded-lg">
      {/* --- YEH NAYA BACKGROUND HAI --- */}
      <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
      <Boxes />

      {/* --- YEH AAPKA PURANA CONTENT AUR BUTTON HAI (z-20 ke saath) --- */}
        {/* Glow effect ke liye wrapper */}
        <div className="relative inline-block">
          {/* Glow element (background mein) */}
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-3xl opacity-40"></div>

          {/* Heading (glow ke upar) */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative z-30 text-5xl md:text-7xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
          >
            Unlock Your Potential
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="relatize z-30 text-xl text-gray-300 mb-8 max-w-2xl mx-auto mt-4"
        >
          Join Brilliance Coaching Academy and excel in your Computer Science
          journey.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="relative z-30"
        >
          <Link href="#courses-section">
            {/* --- AAPKA PURANA BUTTON --- */}
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105">
              Explore Our Courses
            </button>
          </Link>
        </motion.div>
    </div>
  );
}
