import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Yeh function POST request handle karega
export async function POST(request: Request) {
  try {
    // Request se student ID nikalein
    const { studentId } = await request.json();

    // Environment variables se Admin credentials lein
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Yeh secret key hai

    // Check karein ki keys maujood hain ya nahi
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error(
        "Supabase URL or Service Role Key is missing in environment variables."
      );
    }
    if (!studentId) {
      throw new Error("Student ID is missing in the request body.");
    }

    // Ek naya Supabase client banayein jo Admin rights ke saath kaam karega
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Supabase Auth se user ko delete karein (Isse profiles table se bhi delete ho jayega)
    const { error } = await supabaseAdmin.auth.admin.deleteUser(studentId);

    // Agar user delete karne mein error aaya
    if (error) {
      // Agar error 'User not found' hai, to ho sakta hai Auth user pehle hi delete ho gaya ho
      // Lekin humein students table se record phir bhi hatana hai (Safety check)
      if (error.message.includes("User not found")) {
        console.warn(
          `Auth user ${studentId} not found, attempting to delete from students table anyway.`
        );
        const { error: studentDeleteError } = await supabaseAdmin
          .from("students")
          .delete()
          .eq("id", studentId);
        if (studentDeleteError) {
          throw new Error(
            `Auth user not found, and failed to delete student record: ${studentDeleteError.message}`
          );
        }
        // Agar student record delete ho gaya, to success maan lo
      } else {
        // Koi aur error hai
        throw error;
      }
    }

    // Sab theek raha, success message bhejein
    return NextResponse.json({
      message: "User and associated data deleted successfully",
    });
  } catch (error: any) {
    // Agar koi bhi error aata hai, to use log karein aur error message bhejein
    console.error("Error in delete-student API route:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

// Yeh GET requests ko handle karega (Optional, bas 405 error rokne ke liye)
export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
