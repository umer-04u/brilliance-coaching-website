import type { Metadata } from "next";
import { Poppins } from "next/font/google"; // Font wahi rakhein
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { IconHome, IconMessage, IconUser } from "@tabler/icons-react";


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Brilliance Coaching Academy",
  description: "Unlock your potential with us",
};

const navItems = [
  {
    name: "Home",
    link: "/",
    icon: <IconHome className="h-4 w-4 text-white" />,
  },
  {
    name: "About",
    link: "/about",
    icon: <IconUser className="h-4 w-4 text-white" />,
  },
  {
    name: "Contact",
    link: "/contact",
    icon: <IconMessage className="h-4 w-4 text-white" />,
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${poppins.className} animate-gradient-pan`}>

        <FloatingNav navItems={navItems} />

        <Toaster position="top-center" />
        <main className="relative z-10">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
      </body>
    </html>
  );
}
