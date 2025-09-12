"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabaseClient";
import EditStudentModal from "@/components/EditStudentModal";

interface Student {
  id: string;
  name: string;
  email: string;
  class: number;
  monthly_fee: number;
  due_fee: number;
  joining_date: string;
  status: "pending" | "active";
}

export default function TeacherDashboardPage() {
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [monthlyFee, setMonthlyFee] = useState("");
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const fetchStudents = async () => {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) {
      setAllStudents(data as Student[]);
    }
    if (error) {
      toast.error("Could not fetch students.");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAddStudent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const loadingToast = toast.loading("Adding student...");

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (authError) {
      toast.dismiss(loadingToast);
      toast.error(`Auth Error: ${authError.message}`);
      return;
    }

    if (authData.user) {
      const monthlyFeeValue = parseFloat(monthlyFee);
      const { error: insertError } = await supabase.from("students").insert({
        id: authData.user.id,
        name: name,
        email: email,
        class: parseInt(studentClass, 10),
        monthly_fee: monthlyFeeValue,
        due_fee: monthlyFeeValue,
        status: "active",
        joining_date: new Date().toISOString(),
      });

      if (insertError) {
        toast.dismiss(loadingToast);
        toast.error(`Profile Error: ${insertError.message}`);
      } else {
        toast.dismiss(loadingToast);
        toast.success("Student added successfully!");
        setName("");
        setEmail("");
        setPassword("");
        setStudentClass("");
        setMonthlyFee("");
        fetchStudents();
      }
    }
  };

  const handleApproveStudent = async (studentId: string) => {
    const { error } = await supabase
      .from("students")
      .update({ status: "active", joining_date: new Date().toISOString() })
      .eq("id", studentId);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Student approved!");
      fetchStudents();
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (
      confirm(
        "Are you sure? This will only delete the student record, not their login."
      )
    ) {
      const { error } = await supabase
        .from("students")
        .delete()
        .eq("id", studentId);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Student record deleted.");
        fetchStudents();
      }
    }
  };

  const handleUpdateStudent = async (updatedStudent: Student) => {
    const { error } = await supabase
      .from("students")
      .update({
        name: updatedStudent.name,
        class: updatedStudent.class,
        monthly_fee: updatedStudent.monthly_fee,
      })
      .eq("id", updatedStudent.id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Student details updated!");
      setEditingStudent(null);
      fetchStudents();
    }
  };

  const filteredStudents = allStudents
    .filter((student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((student) => {
      if (classFilter === "all") {
        return true; // Agar 'All Classes' select hai to sabko dikhao
      }
      return student.class.toString() === classFilter; // Warna sirf selected class ke students dikhao
    });
  const pendingStudents = filteredStudents.filter(
    (s) => s.status === "pending"
  );
  const activeStudents = filteredStudents.filter((s) => s.status === "active");

  return (
    <AuthGuard role="teacher">
      <Navbar />
      <main className="min-h-screen bg-gray-900 text-white pt-24 px-4 md:px-8 pb-12">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-8">Teacher&apos;s Dashboard</h1>
          <div className="bg-gray-800 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Add New Student (Directly)
            </h2>
            <form
              onSubmit={handleAddStudent}
              className="grid grid-cols-1 md:grid-cols-6 gap-4"
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
                type="password"
                placeholder="Set Password"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          <div className="bg-gray-800 p-4 rounded-lg mb-8 flex items-center">
            <h2 className="text-2xl font-semibold mr-4">Find Student</h2>
            <input
              type="text"
              placeholder="Search students by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-700 p-2 rounded w-full md:w-1/3 mr-1 mask-radial-from-1"
            />
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="bg-gray-700 p-2 rounded mr-1"
            >
              <option value="all">All Classes</option>
              <option value="6">Class 6</option>
              <option value="7">Class 7</option>
              <option value="8">Class 8</option>
              <option value="9">Class 9</option>
              <option value="10">Class 10</option>
              <option value="11">Class 11</option>
              <option value="12">Class 12</option>
            </select>
          </div>
          {pendingStudents.length > 0 && (
            <div className="bg-yellow-900/50 p-6 rounded-lg mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-yellow-300">
                Pending Approvals
              </h2>
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="p-2">Name</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingStudents.map((student) => (
                    <tr key={student.id} className="border-b border-gray-700">
                      <td className="p-2">{student.name}</td>
                      <td className="p-2">{student.email}</td>
                      <td className="p-2">
                        <button
                          onClick={() => handleApproveStudent(student.id)}
                          className="bg-green-600 hover:bg-green-700 font-bold py-1 px-3 rounded text-xs"
                        >
                          Approve
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Active Students</h2>
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
                  {activeStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="border-b border-gray-700 hover:bg-gray-700"
                    >
                      <td className="p-2">{student.name}</td>
                      <td className="p-2">{student.class}</td>
                      <td className="p-2">₹{student.monthly_fee}</td>
                      <td className="p-2">₹{student.due_fee}</td>
                      <td className="p-2">
                        {student.joining_date
                          ? new Date(student.joining_date).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="p-2 flex space-x-2">
                        <button
                          onClick={() => setEditingStudent(student)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded text-xs"
                        >
                          Edit
                        </button>
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
      {editingStudent && (
        <EditStudentModal
          student={editingStudent}
          onClose={() => setEditingStudent(null)}
          onSave={handleUpdateStudent}
        />
      )}
    </AuthGuard>
  );
}
