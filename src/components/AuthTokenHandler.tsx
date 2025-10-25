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
    ("use client");

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
        ); // Log 1: Check initial hash

        const handleAuthRedirect = async () => {
          // Check if tokens exist in the URL fragment
          if (
            window.location.hash.includes("access_token") &&
            window.location.hash.includes("refresh_token")
          ) {
            console.log("AuthTokenHandler: Hash contains tokens."); // Log 2
            const params = new URLSearchParams(
              window.location.hash.substring(1)
            ); // Remove '#'
            const access_token = params.get("access_token");
            const refresh_token = params.get("refresh_token");
            const type = params.get("type");
            console.log("AuthTokenHandler: Extracted tokens:", {
              access_token,
              refresh_token,
              type,
            }); // Log 3: Check extracted values

            if (access_token && refresh_token) {
              console.log("AuthTokenHandler: Attempting to set session..."); // Log 4
              // Set the session using the tokens
              const { data: sessionData, error: sessionError } =
                await supabase.auth.setSession({
                  access_token,
                  refresh_token,
                });
              console.log("AuthTokenHandler: setSession result:", {
                sessionData,
                sessionError,
              }); // Log 5: Check if setSession worked

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
                ); // Log 6
                // Clear the tokens from the URL
                window.history.replaceState(null, "", window.location.pathname);

                // Redirect based on the type
                if (type === "signup") {
                  toast.success("Email verified! Please log in.");
                  console.log(
                    "AuthTokenHandler: Redirecting to /student-login..."
                  ); // Log 7
                  router.push("/student-login");
                } else {
                  console.log("AuthTokenHandler: Redirecting to /..."); // Log 8
                  router.push("/");
                }
              }
            } else {
              console.log(
                "AuthTokenHandler: Invalid tokens in hash. Clearing hash..."
              ); // Log 9
              window.history.replaceState(null, "", window.location.pathname);
              toast.error("Invalid verification link.");
            }
          } else {
            console.log("AuthTokenHandler: No tokens found in hash."); // Log 10: If tokens weren't found initially
          }
        };

        handleAuthRedirect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []); // Empty dependency array ensures this runs only once on mount

      return null; // This component does not render anything visible
    }

    handleAuthRedirect();
    // Yeh sirf ek baar chalna chahiye jab component load ho
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array means run only once

  return null; // Yeh component kuch dikhata nahi hai
}
