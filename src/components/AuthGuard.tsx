"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import toast from "react-hot-toast";

interface AuthGuardProps {
  children: React.ReactNode;
  role: "student" | "teacher"; // Ab hum batayenge ki kaun sa role allowed hai
}

export default function AuthGuard({ children, role }: AuthGuardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      // 1. Pehle user ka login session check karo
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        // Agar login hi nahi hai, to wapas bhej do
        toast.error("You must be logged in to access this page.");
        router.replace("/student-login");
        return;
      }

      // 2. Agar login hai, to 'profiles' table se uska role nikalo
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (error || !profile) {
        toast.error("Could not verify user role. Logging out.");
        await supabase.auth.signOut();
        router.replace("/");
        return;
      }

      // 3. Check karo ki user ka role page ke required role se match karta hai ya nahi
      if (profile.role !== role) {
        // Agar role match nahi hota, to wapas bhej do
        toast.error("You do not have permission to access this page.");
        router.replace("/");
      } else {
        // Sab theek hai, page dikhao
        setIsLoading(false);
      }
    };

    checkUserRole();
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
