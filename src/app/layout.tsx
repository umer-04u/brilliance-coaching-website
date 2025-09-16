import type { Metadata } from "next";
import { Poppins } from "next/font/google"; // Font wahi rakhein
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

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
      <body className={`${poppins.className} animate-gradient-pan`}>
        <Toaster position="top-center" />
        <main className="relative z-10"> {children}</main>
        <Footer />
      </body>
    </html>
  );
}
