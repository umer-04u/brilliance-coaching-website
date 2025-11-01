"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import AuthGuard from "@/components/AuthGuard";
import Link from "next/link";

// Student aur Payment ke liye types define karein
interface Student {
  id: string;
  name: string;
  email: string;
  class: number;
  subject: string;
  monthly_fee: number;
  due_fee: number;
  joining_date: string;
}

interface Payment {
  id: number;
  amount_paid: number;
  payment_date: string;
  razorpay_payment_id: string;
}

export default function StudentDetailPage() {
  const params = useParams();
  const studentId = params.id as string; // URL se student ki ID nikalein

  const [student, setStudent] = useState<Student | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId) return;

    const fetchStudentDetails = async () => {
      // Student ki details nikalein
      const { data: studentData, error: studentError } = await supabase
        .from("students")
        .select("*")
        .eq("id", studentId)
        .single();

      if (studentError) {
        console.error("Error fetching student:", studentError);
        setLoading(false);
        return;
      }
      setStudent(studentData);

      // Student ki payment history nikalein
      const { data: paymentData, error: paymentError } = await supabase
        .from("payments")
        .select("*")
        .eq("student_id", studentId)
        .order("payment_date", { ascending: false });

      if (paymentError) {
        console.error("Error fetching payments:", paymentError);
      } else if (paymentData) {
        setPayments(paymentData);
      }

      setLoading(false);
    };

    fetchStudentDetails();
  }, [studentId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
        <p>Loading Student Details...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
        <p>Student not found.</p>
      </div>
    );
  }

  return (
    <AuthGuard role="teacher">
      <main className="min-h-screen bg-gray-900 text-white pt-24 px-4 md:px-8 pb-12">
        <div className="container mx-auto">
          <Link
            href="/teacher-dashboard"
            className="text-blue-400 hover:underline mb-8 inline-block"
          >
            &larr; Back to Dashboard
          </Link>

          {/* Student Details Card */}
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg mb-8">
            <h1 className="text-4xl font-bold mb-2">{student.name}</h1>
            <p className="text-gray-400 mb-6">{student.email}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-lg border-t border-gray-700 pt-6">
              <div>
                <strong className="block text-gray-400">Class</strong>{" "}
                {student.class}
              </div>
              <div>
                <strong className="block text-gray-400">Subject</strong>{" "}
                {student.subject}
              </div>
              <div>
                <strong className="block text-gray-400">Joining Date</strong>{" "}
                {new Date(student.joining_date).toLocaleDateString()}
              </div>
              <div>
                <strong className="block text-gray-400">Monthly Fee</strong> ₹
                {student.monthly_fee}
              </div>
              <div>
                <strong className="block text-red-400">Current Due</strong> ₹
                {student.due_fee}
              </div>
            </div>
          </div>

          {/* Payment History Table */}
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Payment History</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="p-2">Date</th>
                    <th className="p-2">Amount Paid</th>
                    <th className="p-2 text-right">Transaction ID</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.length > 0 ? (
                    payments.map((payment) => (
                      <tr
                        key={payment.id}
                        className="border-b border-gray-700 hover:bg-gray-700"
                      >
                        <td className="p-2">
                          {new Date(payment.payment_date).toLocaleDateString()}
                        </td>
                        <td className="p-2">₹{payment.amount_paid}</td>
                        <td className="p-2 text-right text-xs opacity-70">
                          {payment.razorpay_payment_id}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center p-4 text-gray-400">
                        No payment history found for this student.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </AuthGuard>
  );
}
