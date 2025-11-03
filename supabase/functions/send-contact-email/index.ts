import { serve } from "http";
import { Request } from "https://deno.land/std@0.168.0/http/server.ts";

const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");
const COACH_EMAIL = "umerwaqarcls@gmail.com"; // <-- YAHAN APNI EMAIL ID DAALEIN

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
    const { name, email, message } = await req.json();

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": `${BREVO_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "Brilliance Website Contact Form",
          email: "umerwaqar1122@gmail.com",
        },
        to: [{ email: COACH_EMAIL }],
        replyTo: { email: email, name: name }, // <-- Yeh student ka email hai
        subject: `New Website Message from ${name}`,
        htmlContent: `
          <p>You received a new message from your website:</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
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
