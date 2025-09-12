import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const senderEmail = "welcome@brilliance.dev";

// CORS headers jo browser ko permission denge
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Browser dwara bheje gaye OPTIONS request ko handle karein
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
        from: `Brilliance Coaching Academy <${senderEmail}>`,
        to: [studentEmail],
        subject: `Welcome to Brilliance Coaching Academy, ${studentName}!`,
        html: `<h1>Hi ${studentName},</h1><p>Your registration has been approved. Welcome to Brilliance Coaching Academy! You can now log in to your student dashboard.</p>`,
      }),
    });

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      // Har response ke saath CORS headers bhejein
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      // Error response ke saath bhi CORS headers bhejein
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
