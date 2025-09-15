"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import toast from "react-hot-toast";

// AuthGuard ab 'role' prop lega
interface AuthGuardProps {
  children: React.ReactNode;
  role: "student" | "teacher";
}

export default function AuthGuard({ children, role }: AuthGuardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkPermissions = async () => {
      // Step 1: Login session check karein
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        toast.error("You must be logged in.");
        router.replace("/student-login");
        return;
      }

      // Step 2: 'profiles' table se user ka role nikalein
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (!profile) {
        toast.error("Could not find user profile. Logging out.");
        await supabase.auth.signOut();
        router.replace("/");
        return;
      }

      // Step 3: Check karein ki user ka role page ke liye sahi hai ya nahi
      if (profile.role !== role) {
        toast.error("You do not have permission to access this page.");
        router.replace("/"); // Galat role hone par homepage par bhejein
        return;
      }

      // Step 4: Agar student hai, to approval status check karein
      if (role === "student") {
        const { data: student } = await supabase
          .from("students")
          .select("status")
          .eq("id", session.user.id)
          .single();

        if (student && student.status !== "active") {
          toast.error("Your account is pending teacher approval.");
          await supabase.auth.signOut();
          router.replace("/student-login");
          return;
        }
      }

      // Agar saare checks pass ho gaye, to page dikhayein
      setIsLoading(false);
    };

    checkPermissions();
  }, [router, role]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
        <p>Verifying permissions...</p>
      </div>
    );
  }

  return <>{children}</>;
}
