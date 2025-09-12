"use client";

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
      setIsLoggedIn(!!session);
    };

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

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
          <Link href="/">Brilliance Coaching Academy</Link>
        </div>

        {/* Naya HTML Structure (List) */}
        <ul className="flex items-center gap-6 text-sm">
          <li>
            <Link
              href="/about"
              className="hover:text-blue-300 transition duration-300"
            >
              About Us
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="hover:text-blue-300 transition duration-300"
            >
              Contact Us {/* Yeh nayi line hai */}
            </Link>
          </li>
          {isLoggedIn ? (
            <li>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
              >
                Logout
              </button>
            </li>
          ) : (
            <>
              <li>
                <Link
                  href="/signup"
                  className="hover:text-blue-300 transition duration-300"
                >
                  Register
                </Link>
              </li>
              <li>
                <Link
                  href="/student-login"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
                >
                  Student Login
                </Link>
              </li>
              <li>
                <Link
                  href="/teacher-login"
                  className="hover:text-blue-300 transition duration-300"
                >
                  Teacher Login
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
