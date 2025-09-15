import { serve } from "http";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    const { studentName, studentEmail } = await req.json();

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        // --- YAHAN BADLAAV HUA HAI ---
        // Hum Resend ka special testing email use kar rahe hain
        from: `Brilliance Coaching Academy <onboarding@resend.dev>`,
        to: [studentEmail],
        subject: `Welcome to Brilliance Coaching Academy, ${studentName}!`,
        html: `<h1>Hi ${studentName},</h1><p>Your registration has been approved. Welcome to Brilliance Coaching Academy! You can now log in to your student dashboard.</p>`,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      // Agar Resend se error aaya, to use log karo
      console.error("Resend API Error:", data);
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
