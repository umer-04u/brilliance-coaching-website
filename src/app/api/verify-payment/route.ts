import { NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import { createClient } from "@supabase/supabase-js";

// Helper function to verify signature
function verifySignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");
  // Use crypto.timingSafeEqual for security against timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(signature)
    );
  } catch {
    return false; // Handle cases where buffers might have different lengths
  }
}

export async function POST(request: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
  const signature = request.headers.get("x-razorpay-signature");
  const rawBody = await request.text(); // Raw body is needed for signature verification

  if (!signature) {
    console.error("Webhook Error: Signature missing");
    return NextResponse.json({ error: "Signature missing" }, { status: 400 });
  }

  // 1. Verify Webhook Signature
  const isVerified = verifySignature(rawBody, signature, secret);
  if (!isVerified) {
    console.error("Webhook Error: Invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log("Webhook Signature Verified Successfully!");

  try {
    const body = JSON.parse(rawBody);

    // 2. Check if it's the 'payment.captured' event
    if (body.event === "payment.captured") {
      console.log("Processing payment.captured event...");
      const payment = body.payload.payment.entity;
      const orderId = payment.order_id;
      const paymentId = payment.id;
      const amountPaid = payment.amount / 100; // Convert paisa to rupees

      // 3. Get student ID from order notes (using Admin client for security)
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Make sure this is set in Vercel
      if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error("Supabase URL or Service Role Key is missing.");
      }
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

      // Fetch the order from Razorpay to get the student_id from notes
      // Use TEST keys here because the order was created using TEST keys
      const instance = new Razorpay({
        key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!, // TEST KEY ID
        key_secret: process.env.RAZORPAY_KEY_SECRET!, // TEST KEY SECRET (Needs to be added)
      });
      const order = await instance.orders.fetch(orderId);
      console.log("Fetched Order:", order);

      if (!order || !order.notes || !order.notes.student_id) {
        throw new Error(
          `Order ${orderId} not found or missing student_id note.`
        );
      }
      const studentId = order.notes.student_id;
      console.log(`Found student ID: ${studentId} for order ${orderId}`);

      // 4. Update student's due_fee in Supabase
      console.log(`Updating due_fee for student ${studentId}...`);
      const { error: updateError } = await supabaseAdmin
        .from("students")
        .update({ due_fee: 0, last_fee_update: new Date().toISOString() })
        .eq("id", studentId);
      if (updateError)
        throw new Error(
          `Supabase student update error: ${updateError.message}`
        );
      console.log("Student due_fee updated.");

      // 5. Insert into payments table
      console.log(`Inserting payment record for student ${studentId}...`);
      const { error: paymentInsertError } = await supabaseAdmin
        .from("payments")
        .insert({
          student_id: studentId,
          amount_paid: amountPaid,
          razorpay_payment_id: paymentId,
        });
      if (paymentInsertError)
        throw new Error(
          `Supabase payment insert error: ${paymentInsertError.message}`
        );
      console.log("Payment record inserted.");

      // 6. Trigger receipt email function (Fetch student details needed for email)
      console.log(
        `Fetching student details for email for student ${studentId}...`
      );
      const { data: studentData, error: studentFetchError } =
        await supabaseAdmin
          .from("students")
          .select("name, email")
          .eq("id", studentId)
          .single();

      if (studentFetchError || !studentData) {
        console.error(
          "Could not fetch student details for email:",
          studentFetchError
        );
      } else {
        console.log("Invoking receipt email function...");
        // Error handling for invoke is optional, as email failing shouldn't stop the process
        await supabaseAdmin.functions.invoke("send-receipt-email", {
          body: {
            studentName: studentData.name,
            studentEmail: studentData.email,
            amountPaid: amountPaid,
            paymentId: paymentId,
          },
        });
        console.log("Receipt email function invoked.");
      }

      console.log(
        `Payment verified and recorded successfully for student ${studentId}`
      );
    } else {
      console.log(`Ignoring event: ${body.event}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Error processing Razorpay webhook:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
