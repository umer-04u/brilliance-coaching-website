"use client"; // Navbar ko interactive banane ke liye

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };

    checkUser();

    // Yeh auth state mein badlaav ko sunta hai (login/logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    // Component unmount hone par subscription ko saaf karta hai
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <header className="bg-white/10 backdrop-blur-md text-white w-full fixed top-0 left-0 z-10">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold">
          <Link href="/">Brilliance Academy</Link>
        </div>
        <div className="space-x-8 text-lg flex items-center">
          {/* About Us aur Contact Us ke links abhi comment out hain, aap unhe baad mein bana sakte hain */}
          {/* <Link href="/about" className="hover:text-blue-300 transition duration-300">About Us</Link> */}
          {/* <Link href="/contact" className="hover:text-blue-300 transition duration-300">Contact Us</Link> */}

          <div className="h-6 border-l border-gray-500"></div>

          {/* Yahan logic hai: Agar login hai to Logout button, warna Login links */}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md text-sm transition duration-300"
            >
              Logout
            </button>
          ) : (
            <>
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
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
