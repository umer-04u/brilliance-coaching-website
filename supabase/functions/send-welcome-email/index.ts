import { serve } from "http";
import { Request } from "https://deno.land/std@0.168.0/http/server.ts";
// Brevo API key ko secrets se nikalein
const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { studentName, studentEmail } = await req.json();

    // Brevo ke API endpoint par request bhejein
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": `${BREVO_API_KEY}`, // Header ka naam badal gaya hai
        "content-type": "application/json",
      },
      // Body ka structure Brevo ke hisaab se badal gaya hai
      body: JSON.stringify({
        sender: {
          name: "Brilliance Coaching Academy",
          email: "umerwaqar1122@gmail.com", // Aap yahan apna email daal sakte hain
        },
        to: [
          {
            email: studentEmail,
            name: studentName,
          },
        ],
        subject: `Welcome to Brilliance Coaching Academy, ${studentName}!`,
        htmlContent: `<h1>Hi ${studentName},</h1><p>Your registration has been approved. Welcome to Brilliance Coaching Academy! You can now log in to your student dashboard.</p>`,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(JSON.stringify(errorData));
    }

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    let errorMessage = "An unknown error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
