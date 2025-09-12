"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";
import Navbar from "@/components/Navbar";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [monthlyFee, setMonthlyFee] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const loadingToast = toast.loading("Registering...");

    // Step 1: Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (authError) {
      toast.dismiss(loadingToast);
      toast.error(authError.message);
      return;
    }

    // Step 2: If the auth user was created, insert their profile into the 'students' table
    if (authData.user) {
      const fee = parseFloat(monthlyFee);
      const { error: insertError } = await supabase.from("students").insert({
        id: authData.user.id, // This links the student record to the auth user's UUID
        name: name,
        email: email,
        class: parseInt(studentClass, 10),
        monthly_fee: fee,
        due_fee: fee, // First month's fee is due on signup
        status: "pending", // New students are always 'pending'
      });

      if (insertError) {
        toast.dismiss(loadingToast);
        // Note: In a real app, you might want to delete the auth user if this step fails.
        toast.error("Could not create student profile: " + insertError.message);
      } else {
        toast.dismiss(loadingToast);
        toast.success(
          "Registration successful! Please wait for teacher approval."
        );
        router.push("/student-login");
      }
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 pt-20">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-3xl font-bold text-white text-center mb-6">
            Student Registration
          </h1>
          <form className="space-y-4" onSubmit={handleSignup}>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            />
            <input
              type="password"
              placeholder="Create Password"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            />
            <input
              type="number"
              placeholder="Class"
              value={studentClass}
              onChange={(e) => setStudentClass(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            />
            <input
              type="number"
              placeholder="Monthly Fee (e.g., 500)"
              value={monthlyFee}
              onChange={(e) => setMonthlyFee(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            />
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Sign Up
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
