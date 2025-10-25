"use client"; // Yeh hamesha sabse upar hona chahiye

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import toast from "react-hot-toast";

export default function AuthTokenHandler() {
  const router = useRouter();

  useEffect(() => {
    console.log(
      "AuthTokenHandler: useEffect started. Hash:",
      window.location.hash
    );

    const handleAuthRedirect = async () => {
      if (
        window.location.hash.includes("access_token") &&
        window.location.hash.includes("refresh_token")
      ) {
        console.log("AuthTokenHandler: Hash contains tokens.");
        const params = new URLSearchParams(window.location.hash.substring(1));
        const access_token = params.get("access_token");
        const refresh_token = params.get("refresh_token");
        const type = params.get("type");
        console.log("AuthTokenHandler: Extracted tokens:", {
          access_token,
          refresh_token,
          type,
        });

        if (access_token && refresh_token) {
          console.log("AuthTokenHandler: Attempting to set session...");
          const { data: sessionData, error: sessionError } =
            await supabase.auth.setSession({
              access_token,
              refresh_token,
            });
          console.log("AuthTokenHandler: setSession result:", {
            sessionData,
            sessionError,
          });

          if (sessionError) {
            console.error(
              "AuthTokenHandler: Error setting session:",
              sessionError
            );
            toast.error(
              "Failed to verify email session. Please try logging in."
            );
          } else {
            console.log(
              "AuthTokenHandler: Session set successfully. Clearing hash..."
            );
            window.history.replaceState(null, "", window.location.pathname);

            if (type === "signup") {
              toast.success("Email verified! Please log in.");
              console.log("AuthTokenHandler: Redirecting to /student-login...");
              router.push("/student-login");
            } else {
              console.log("AuthTokenHandler: Redirecting to /...");
              router.push("/");
            }
          }
        } else {
          console.log(
            "AuthTokenHandler: Invalid tokens in hash. Clearing hash..."
          );
          window.history.replaceState(null, "", window.location.pathname);
          toast.error("Invalid verification link.");
        }
      } else {
        console.log("AuthTokenHandler: No tokens found in hash.");
      }
    };

    handleAuthRedirect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
