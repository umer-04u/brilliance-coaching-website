"use client";

import { useState, useEffect } from "react";
import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabaseClient";

interface Student {
  id: number;
  name: string;
  email: string;
  class: number;
  monthly_fee: number;
  due_fee: number;
  joining_date: string;
}

export default function TeacherDashboardPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [monthlyFee, setMonthlyFee] = useState("");

  const fetchStudents = async () => {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .order("joining_date", { ascending: false });
    if (data) setStudents(data);
    if (error) console.error("Error fetching students:", error);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAddStudent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const monthlyFeeValue = parseFloat(monthlyFee);
    const initialDueFee = monthlyFeeValue;

    const { error } = await supabase.from("students").insert([
      {
        name: name,
        email: email,
        class: parseInt(studentClass, 10),
        monthly_fee: monthlyFeeValue,
        due_fee: initialDueFee,
      },
    ]);

    if (error) {
      alert(error.message);
    } else {
      alert("Student added successfully!");
      setName("");
      setEmail("");
      setStudentClass("");
      setMonthlyFee("");
      fetchStudents();
    }
  };

  const handleDeleteStudent = async (studentId: number) => {
    if (confirm("Are you sure you want to delete this student?")) {
      const { error } = await supabase
        .from("students")
        .delete()
        .eq("id", studentId);
      if (error) {
        alert(error.message);
      } else {
        fetchStudents();
      }
    }
  };

  return (
    <AuthGuard>
      <Navbar />
      <main className="min-h-screen bg-gray-900 text-white pt-24 px-4 md:px-8">
        <div className="container mx-auto">
          {/* Apostrophe theek kiya gaya */}
          <h1 className="text-4xl font-bold mb-8">Teacher&apos;s Dashboard</h1>

          <div className="bg-gray-800 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4">Add New Student</h2>
            <form
              onSubmit={handleAddStudent}
              className="grid grid-cols-1 md:grid-cols-5 gap-4"
            >
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-gray-700 p-2 rounded"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-700 p-2 rounded"
              />
              <input
                type="number"
                placeholder="Class"
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                required
                className="bg-gray-700 p-2 rounded"
              />
              <input
                type="number"
                placeholder="Monthly Fee"
                value={monthlyFee}
                onChange={(e) => setMonthlyFee(e.target.value)}
                required
                className="bg-gray-700 p-2 rounded"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 p-2 rounded"
              >
                Add Student
              </button>
            </form>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Manage Students</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="p-2">Name</th>
                    <th className="p-2">Class</th>
                    <th className="p-2">Monthly Fee</th>
                    <th className="p-2">Current Due</th>
                    <th className="p-2">Joining Date</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr
                      key={student.id}
                      className="border-b border-gray-700 hover:bg-gray-700"
                    >
                      <td className="p-2">{student.name}</td>
                      <td className="p-2">{student.class}</td>
                      <td className="p-2">₹{student.monthly_fee}</td>
                      <td className="p-2">₹{student.due_fee}</td>
                      <td className="p-2">
                        {new Date(student.joining_date).toLocaleDateString()}
                      </td>
                      <td className="p-2">
                        <button
                          onClick={() => handleDeleteStudent(student.id)}
                          className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </AuthGuard>
  );
}
