"use client";

import { useState, useEffect, useCallback } from "react";
import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabaseClient";

interface StudentDetails {
  id: number;
  name: string;
  class: number;
  email: string;
  monthly_fee: number;
  due_fee: number;
  joining_date: string;
  last_fee_update: string;
}

// Razorpay ke response ke liye type define kiya
interface RazorpayResponse {
  razorpay_payment_id: string;
}

export default function StudentDashboardPage() {
  const [student, setStudent] = useState<StudentDetails | null>(null);
  const [dueMonths, setDueMonths] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper function to get all billable months since joining
  const getAllBillableMonths = (joiningDate: string) => {
    const billableMonths: string[] = [];
    const today = new Date();
    const joinDate = new Date(joiningDate);
    let iteratorDate = new Date(joinDate.getFullYear(), joinDate.getMonth(), 1);

    while (
      iteratorDate.getFullYear() < today.getFullYear() ||
      (iteratorDate.getFullYear() === today.getFullYear() &&
        iteratorDate.getMonth() <= today.getMonth())
    ) {
      const monthName = iteratorDate.toLocaleString("default", {
        month: "long",
      });
      const year = iteratorDate.getFullYear();
      billableMonths.push(`${monthName} ${year}`);
      iteratorDate.setMonth(iteratorDate.getMonth() + 1);
    }
    return billableMonths;
  };

  const manageStudentFees = useCallback(async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    let { data: studentData, error } = await supabase
      .from("students")
      .select("*")
      .eq("email", user.email)
      .single();
    if (error || !studentData) {
      console.error("Error fetching student details:", error);
      setLoading(false);
      return;
    }

    if (!studentData.monthly_fee || studentData.monthly_fee <= 0) {
      setStudent(studentData);
      setDueMonths([]);
      setLoading(false);
      return;
    }

    const lastUpdateDate = new Date(studentData.last_fee_update);
    const today = new Date();
    let monthsSinceLastUpdate =
      (today.getFullYear() - lastUpdateDate.getFullYear()) * 12;
    monthsSinceLastUpdate -= lastUpdateDate.getMonth();
    monthsSinceLastUpdate += today.getMonth();

    if (monthsSinceLastUpdate > 0) {
      const feeToAdd = monthsSinceLastUpdate * studentData.monthly_fee;
      const newDueFee = studentData.due_fee + feeToAdd;

      const { data: updatedStudent, error: updateError } = await supabase
        .from("students")
        .update({
          due_fee: newDueFee,
          last_fee_update: new Date().toISOString(),
        })
        .eq("id", studentData.id)
        .select()
        .single();

      if (updateError) {
        console.error("Error updating fee:", updateError);
      } else {
        studentData = updatedStudent;
      }
    }

    setStudent(studentData);
    if (studentData.due_fee > 0 && studentData.monthly_fee > 0) {
      const allBillableMonths = getAllBillableMonths(studentData.joining_date);
      const numberOfDueMonths = Math.round(
        studentData.due_fee / studentData.monthly_fee
      );
      setDueMonths(allBillableMonths.slice(-numberOfDueMonths));
    } else {
      setDueMonths([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    manageStudentFees();
  }, [manageStudentFees]);

  const makePayment = async () => {
    if (!student || student.due_fee <= 0) return;

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: student.due_fee * 100,
      currency: "INR",
      name: "Brilliance Coaching Academy",
      description: `Fee Payment for ${student.name}`,
      handler: async function (response: RazorpayResponse) {
        alert(
          "Payment Successful! Payment ID: " + response.razorpay_payment_id
        );

        const { error } = await supabase
          .from("students")
          .update({ due_fee: 0, last_fee_update: new Date().toISOString() })
          .eq("id", student.id);

        if (error) {
          alert("Error updating fee status: " + error.message);
        } else {
          manageStudentFees();
        }
      },
      prefill: {
        name: student.name,
        email: student.email,
      },
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
        Loading...
      </div>
    );
  }

  return (
    <AuthGuard>
      <Navbar />
      <main className="min-h-screen bg-gray-900 text-white pt-24 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-8">Student Dashboard</h1>
          {student ? (
            <div className="bg-gray-800 p-8 rounded-lg max-w-2xl mx-auto">
              <h2 className="text-3xl font-semibold mb-6 border-b border-gray-700 pb-4">
                {student.name}
              </h2>
              <div className="space-y-4 text-lg">
                <p>
                  <strong>Class:</strong> {student.class}
                </p>
                <p>
                  <strong>Monthly Fee:</strong> ₹{student.monthly_fee}
                </p>
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <p className="text-2xl font-bold">
                    Outstanding Fees:
                    <span
                      className={
                        student.due_fee > 0
                          ? "text-red-400 ml-2"
                          : "text-green-400 ml-2"
                      }
                    >
                      ₹{student.due_fee}
                    </span>
                  </p>

                  {student.due_fee > 0 ? (
                    <>
                      {dueMonths.length > 0 && (
                        <div className="mt-4">
                          <h3 className="text-lg font-semibold text-gray-300">
                            Due for months:
                          </h3>
                          <ul className="list-disc list-inside text-red-400">
                            {dueMonths.map((month) => (
                              <li key={month}>{month}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <button
                        onClick={makePayment}
                        className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg text-lg transition duration-300"
                      >
                        Pay Now
                      </button>
                    </>
                  ) : (
                    <div className="mt-6 text-center bg-green-500/10 text-green-400 font-bold p-4 rounded-lg">
                      ✓ All Dues Cleared!
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p>Could not find student details.</p>
          )}
        </div>
      </main>
    </AuthGuard>
  );
}
