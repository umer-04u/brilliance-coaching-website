"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { FaLinkedin, FaInstagram } from "react-icons/fa"; // Twitter ki jagah Instagram import karein
import { motion } from "framer-motion";

interface Teacher {
  id: number;
  name: string;
  subject: string;
  imageUrl: string;
  linkedin_url?: string;
  instagram_url?: string; // twitter_url ko instagram_url se badla
}

export default function TeachersSection() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      const { data } = await supabase.from("teachers").select("*");
      if (data) {
        setTeachers(data);
      }
    };
    fetchTeachers();
  }, []);

  return (
    <section className="bg-gray-800 py-20">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center text-white mb-16"
        >
          Meet Our Expert Teachers
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {teachers.map((teacher, index) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-900 rounded-lg text-center overflow-hidden shadow-lg group"
            >
              <div className="relative h-64">
                {/* --- IMAGE FIX: Image component ko aup-to-date props ke saath aup-to-date kiya --- */}
                <Image
                  src={teacher.imageUrl}
                  alt={teacher.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 relative">
                <h3 className="text-2xl font-semibold text-white">
                  {teacher.name}
                </h3>
                <p className="text-blue-400 mb-4">{teacher.subject}</p>

                {/* --- INSTAGRAM FIX: Social Media Icons ko aup-to-date kiya --- */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {teacher.linkedin_url && (
                    <a
                      href={teacher.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-500"
                    >
                      <FaLinkedin size={24} />
                    </a>
                  )}
                  {teacher.instagram_url && (
                    <a
                      href={teacher.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-pink-500"
                    >
                      <FaInstagram size={24} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
