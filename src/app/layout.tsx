import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast"; // Toast ke liye
import Script from "next/script"; // Razorpay ke liye

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Brilliance Coaching Academy",
  description: "Unlock your potential with us",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      {/* Razorpay Script yahan rahega */}
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <body className={inter.className}>
        {/* Toaster yahan rahega */}
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
}
