"use client";

import { useState, useEffect } from "react";

// Dono files mein Student interface ek jaisa hona chahiye
interface Student {
  id: string; // ID ab UUID hai, isliye string
  name: string;
  email: string;
  class: number;
  monthly_fee: number;
  due_fee: number;
  joining_date: string;
  status: "pending" | "active";
}

interface EditModalProps {
  student: Student | null;
  onClose: () => void;
  onSave: (updatedStudent: Student) => void;
}

export default function EditStudentModal({
  student,
  onClose,
  onSave,
}: EditModalProps) {
  const [name, setName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [monthlyFee, setMonthlyFee] = useState("");

  useEffect(() => {
    if (student) {
      setName(student.name);
      setStudentClass(student.class.toString());
      setMonthlyFee(student.monthly_fee.toString());
    }
  }, [student]);

  if (!student) {
    return null;
  }

  const handleSave = () => {
    onSave({
      ...student,
      name: name,
      class: parseInt(studentClass, 10),
      monthly_fee: parseFloat(monthlyFee),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-white">
          Edit Student: {student.name}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Class
            </label>
            <input
              type="number"
              value={studentClass}
              onChange={(e) => setStudentClass(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Monthly Fee (₹)
            </label>
            <input
              type="number"
              value={monthlyFee}
              onChange={(e) => setMonthlyFee(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
