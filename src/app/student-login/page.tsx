"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import toast from "react-hot-toast";
import Link from "next/link";
import { BackgroundGradient } from "@/components/ui/background-gradient";

export default function StudentLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const loadingToast = toast.loading("Signing in...");

    // Step 1: Check if email and password are correct
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

    if (authError) {
      toast.dismiss(loadingToast);
      toast.error(authError.message);
      return;
    }

    // Step 2: If login is successful, check for approval status
    if (authData.user) {
      const { data: studentData, error: studentError } = await supabase
        .from("students")
        .select("status")
        .eq("id", authData.user.id)
        .single();

      if (studentError || !studentData) {
        toast.dismiss(loadingToast);
        toast.error(
          "Could not find your student profile. Please contact support."
        );
        await supabase.auth.signOut();
        return;
      }

      // Step 3: Check the status and act accordingly
      if (studentData.status === "active") {
        toast.dismiss(loadingToast);
        toast.success("Login successful!");
        router.push("/student-dashboard");
      } else if (studentData.status === "pending") {
        toast.dismiss(loadingToast);
        toast.error("Your account is pending approval from a teacher.");
        await supabase.auth.signOut();
      }
    }
  };

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-tr from-black via-neutral-700/60 to-black pt-20">
        <BackgroundGradient
          containerClassName="w-full max-w-md"
          className="bg-gray-800 rounded-[22px] p-8 shadow-lg"
        >
          <h1 className="text-3xl font-bold text-white text-center mb-6">
            Student Login
          </h1>
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="E.g. yourname@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Login
              </button>
            </div>
          </form>

          {/* Register Link Section */}
          <div className="text-center mt-6">
            <p className="text-gray-400">
              New to the academy?{" "}
              <Link
                href="/signup"
                className="font-medium text-blue-400 hover:text-blue-300"
              >
                Register here
              </Link>
            </p>
          </div>
        </BackgroundGradient>
      </main>
    </>
  );
}
