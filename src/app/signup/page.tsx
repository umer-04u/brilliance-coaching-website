"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";
import Navbar from "@/components/Navbar";
import { useForm, SubmitHandler } from "react-hook-form";

type FormInputs = {
  name: string;
  email: string;
  password: string;
  studentClass: number;
  monthlyFee: number;
};

export default function SignupPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();

  // Form submit hone par yeh function chalega
  const onFormSubmit: SubmitHandler<FormInputs> = async (data) => {
    const loadingToast = toast.loading("Registering...");

    // Hum ab saari details Auth ke 'data' option mein bhejenge
    // Database trigger is data ka istemal karega
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.name,
          class: data.studentClass,
          monthly_fee: data.monthlyFee,
        },
      },
    });

    toast.dismiss(loadingToast);

    if (error) {
      toast.error(error.message);
    } else {
      // Yahan hum aup-to-date message dikha rahe hain
      toast.success(
        "Registration successful! Please check your email to verify your account."
      );
      router.push("/student-login");
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 pt-20">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-3xl font-bold text-white text-center mb-6">
            Student Registration
          </h1>
          <form className="space-y-4" onSubmit={handleSubmit(onFormSubmit)}>
            <div>
              <input
                type="text"
                placeholder="Full Name"
                {...register("name", { required: "Name is required" })}
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <input
                type="email"
                placeholder="Email Address"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <input
                type="password"
                placeholder="Create Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              />
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <input
                type="number"
                placeholder="Class"
                {...register("studentClass", {
                  required: "Class is required",
                  valueAsNumber: true,
                })}
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              />
              {errors.studentClass && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.studentClass.message}
                </p>
              )}
            </div>

            <div>
              <input
                type="number"
                placeholder="Monthly Fee (e.g., 500)"
                {...register("monthlyFee", {
                  required: "Monthly Fee is required",
                  valueAsNumber: true,
                })}
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              />
              {errors.monthlyFee && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.monthlyFee.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Sign Up
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
