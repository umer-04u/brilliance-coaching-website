import { serve } from "http";
import { Request } from "https://deno.land/std@0.168.0/http/server.ts";
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
    const { studentName, studentEmail, amountPaid, paymentId } =
      await req.json();

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": `${BREVO_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "Brilliance Coaching Academy",
          email: "umerwaqar1122@gmail.com",
        },
        to: [{ email: studentEmail, name: studentName }],
        subject: `Payment Receipt for Brilliance Coaching Academy`,
        htmlContent: `
          <h1>Payment Successful!</h1>
          <p>Hi ${studentName},</p>
          <p>We have successfully received your payment of <strong>₹${amountPaid}</strong>.</p>
          <p>Your transaction ID is: ${paymentId}</p>
          <p>Thank you for being a part of Brilliance Coaching Academy!</p>
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
