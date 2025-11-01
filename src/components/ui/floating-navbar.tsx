"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion"; // <-- Sahi library import ki gayi hai
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import toast from "react-hot-toast";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
  }[];
  className?: string;
}) => {
  // --- YAHAN SE AAPKA PURANA NAVBAR LOGIC SHURU HOTA HAI ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null); // Type ko <div> karein

  // Dropdown band karne ke liye logic
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // Login status aur approval check karne ke liye logic
  useEffect(() => {
    const checkUserStatus = async (session: any) => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();
      if (profile && profile.role === "student") {
        const { data: student } = await supabase
          .from("students")
          .select("status")
          .eq("id", session.user.id)
          .single();
        if (student && student.status !== "active") {
          toast.error("Your account is pending teacher approval.", {
            duration: 5000,
          });
          await supabase.auth.signOut();
          router.push("/");
        }
      }
    };
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      if (session) checkUserStatus(session);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      if (session) checkUserStatus(session);
    });
    return () => subscription.unsubscribe();
  }, [router]);

  // Logout function
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };
  // --- AAPKA NAVBAR LOGIC YAHAN KHATAM HOTA HAI ---

  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      let direction = current! - scrollYProgress.getPrevious()!;
      if (scrollYProgress.get() < 0.05) {
        setVisible(true); // Top par hamesha dikhayein
      } else {
        if (direction < 0) {
          setVisible(true); // Scroll up par dikhayein
        } else {
          setVisible(false); // Scroll down par chhupayein
        }
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "flex max-w-fit fixed top-10 inset-x-0 mx-auto border border-white/[0.2] rounded-full bg-black shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] pr-2 pl-8 py-2 items-center justify-center space-x-4",
          className
        )}
      >
        {navItems.map((navItem: any, idx: number) => (
          <Link
            key={`link=${idx}`}
            href={navItem.link}
            className={cn(
              "relative text-neutral-50 items-center flex space-x-1 hover:text-neutral-300"
            )}
          >
            <span className="block sm:hidden">{navItem.icon}</span>
            <span className="hidden sm:block text-sm">{navItem.name}</span>
          </Link>
        ))}

        {/* --- Naya Login/Logout Logic --- */}
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="border text-sm font-medium relative border-red-500/50 text-red-500 px-4 py-2 rounded-full"
          >
            <span>Logout</span>
            <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-red-500 to-transparent h-px" />
          </button>
        ) : (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="border text-sm font-medium relative border-white/[0.2] text-white px-4 py-2 rounded-full"
            >
              <span>Login</span>
              <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent h-px" />
            </button>

            {isDropdownOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max bg-black/80 backdrop-blur-lg shadow-lg py-2 z-30 border border-white/[0.2] rounded-xl">
                <Link
                  href="/student-login"
                  onClick={() => setIsDropdownOpen(false)}
                  className="block px-4 py-2 text-sm text-neutral-200 hover:text-white hover:bg-gradient-to-r from-transparent via-neutral-900 to-transparent transition-colors duration-200"
                >
                  Student Login
                </Link>
                <Link
                  href="/teacher-login"
                  onClick={() => setIsDropdownOpen(false)}
                  className="block px-4 py-2 text-sm text-neutral-200 hover:text-white hover:bg-gradient-to-r from-transparent via-neutral-900 to-transparent transition-colors duration-200"
                >
                  Teacher Login
                </Link>
              </div>
            )}
          </div>
        )}
        {/* --- Logic Yahan Khatam --- */}
      </motion.div>
    </AnimatePresence>
  );
};
