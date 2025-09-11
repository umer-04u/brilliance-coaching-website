import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script"; // <-- Isko import karein

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
    <html lang="en">
      {/* Razorpay ki script ko yahan add karein */}
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <body className={inter.className}>{children}</body>
    </html>
  );
}
