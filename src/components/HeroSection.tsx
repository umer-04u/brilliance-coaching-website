"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { Boxes } from "@/components/ui/background-boxes";
import { cn } from "@/lib/utils";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";

export default function HeroSection() {
  const words = [
    { text: "Join" },
    { text: "Brilliance", className: "dark:text-blue-500" },
    { text: "Coaching", className: "dark:text-blue-500" },
    { text: "Academy", className: "dark:text-blue-500" },
    { text: "and" },
    { text: "excel" },
    { text: "in" },
    { text: "your" },
    { text: "Academic", className: "dark:text-amber-500" },
    { text: "journey." },
  ];
  return (
    <div className="min-h-screen relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center rounded-lg">
      {/* --- YEH NAYA BACKGROUND HAI --- */}
      <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
      <Boxes />
      {/* Glow effect ke liye wrapper */}
      <div className="relative inline-block">
        {/* Glow element (background mein) */}
        <div className="absolute -inset-2 rounded-full blur-3xl opacity-40"></div>

        {/* Heading (glow ke upar) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500" // Wrapper ko poori width di
        >
          Unlock Your Potential
        </motion.div>
      </div>
      <TypewriterEffectSmooth
        words={words}
        // Wrapper div ki saari classes yahan move kar di
        className="relative z-20 text-lg sm:text-xl text-gray-300 mb-8 mx-auto mt-4"
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="relative z-30"
      >
        <Link href="#courses-section">
          {/* --- AAPKA PURANA BUTTON --- */}
          <HoverBorderGradient
            containerClassName="rounded-full"
            as="button"
            className="dark:bg-gradient-to-r from-blue-500 to-purple-600 bg-blue-600 text-gray-800 dark:text-gray-800 font-bold flex items-center space-x-2"
          >
            <span>Explore Our Courses</span>
          </HoverBorderGradient>
        </Link>
      </motion.div>
    </div>
  );
}
