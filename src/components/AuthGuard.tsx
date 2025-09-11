"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

// Ye component apne andar wrap kiye hue content (children) ko tabhi dikhayega jab user login hoga.
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        // Agar user login nahi hai, to use home page par bhej do.
        router.replace("/");
      } else {
        // Agar user login hai, to loading band kar do aur content dikhao.
        setIsLoading(false);
      }
    };

    checkSession();
  }, [router]);

  if (isLoading) {
    // Jab tak session check ho raha hai, loading dikhao.
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
        <p>Loading...</p>
      </div>
    );
  }

  // Agar loading poori ho gayi aur user login hai, to children (Dashboard page) ko dikhao.
  return <>{children}</>;
}
