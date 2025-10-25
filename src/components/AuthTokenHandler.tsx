"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import toast from "react-hot-toast";

export default function AuthTokenHandler() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthRedirect = async () => {
      // Check karo ki URL fragment mein tokens hain ya nahi
      if (
        window.location.hash.includes("access_token") &&
        window.location.hash.includes("refresh_token")
      ) {
        const params = new URLSearchParams(window.location.hash.substring(1)); // '#' hatao
        const access_token = params.get("access_token");
        const refresh_token = params.get("refresh_token");
        const type = params.get("type");

        if (access_token && refresh_token) {
          // Supabase ko batao ki session set kare
          const { error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });

          if (error) {
            console.error("Error setting session:", error);
            toast.error("Failed to verify email. Please try logging in.");
          } else {
            // URL ko saaf karo
            window.history.replaceState(null, "", window.location.pathname);

            // Signup ke baad login page par bhejo
            if (type === "signup") {
              toast.success("Email verified! Please log in.");
              router.push("/student-login");
            } else {
              router.push("/"); // Doosre cases mein homepage par bhejo
            }
          }
        } else {
          window.history.replaceState(null, "", window.location.pathname);
          toast.error("Invalid verification link.");
        }
      }
    };

    handleAuthRedirect();
    // Yeh sirf ek baar chalna chahiye jab component load ho
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array means run only once

  return null; // Yeh component kuch dikhata nahi hai
}
