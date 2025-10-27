import { serve } from "http";
import { createClient } from "createClient";
import { create } from "djwt"; // Deno ki standard JWT library

// Secrets ko Deno.env se lein
const serviceAccountKey = JSON.parse(
  atob(Deno.env.get("GOOGLE_SERVICE_ACCOUNT_KEY")!)
);
const sheetId = Deno.env.get("GOOGLE_SHEET_ID")!;
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

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
    // 1. Manually Google Auth JWT banayein
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: serviceAccountKey.client_email,
      scope: "https://www.googleapis.com/auth/spreadsheets",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600, // Token 1 ghante mein expire hoga
      iat: now,
    };
    const header = { alg: "RS256" as const, typ: "JWT" };
    const jwt = await create(header, payload, serviceAccountKey.private_key);

    // 2. Is JWT ko Access Token ke liye exchange karein
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
    });

    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) {
      throw new Error(
        "Failed to get Google Access Token: " + JSON.stringify(tokenData)
      );
    }
    const accessToken = tokenData.access_token;

    // 3. Supabase se data fetch karein
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data: students, error: supabaseError } = await supabase
      .from("students")
      .select(
        "id,student_serial_id,created_at,name,email,class,due_fee,joining_date,monthly_fee,last_fee_update,status,subject"
      );

    if (supabaseError) throw supabaseError;

    // 4. Data ko Google Sheets ke format mein taiyar karein
    const dataForSheet = students.map((student: any) => [
      student.id,
      student.student_serial_id,
      student.created_at,
      student.name,
      student.email,
      student.class,
      student.due_fee,
      student.joining_date,
      student.monthly_fee,
      student.last_fee_update,
      student.status,
      student.subject,
    ]);

    // 5. Purana data (Row 2 se) clear karein
    const clearRange = "Sheet1!A2:L";
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${clearRange}:clear`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    // 6. Naya data sheet mein daalein
    const updateRange = "Sheet1!A2";
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${updateRange}?valueInputOption=RAW`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ values: dataForSheet }),
      }
    );

    return new Response(JSON.stringify({ message: "Sync successful!" }), {
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
