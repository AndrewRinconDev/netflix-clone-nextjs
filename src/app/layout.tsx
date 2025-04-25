'use client';
// import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "@/components/navigation/navbar/Navbar";
import Footer from "@/components/navigation/footer/Footer";
import ApolloWrapper from "@/provider/ApolloWrapper";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Netflix Clone",
//   description: "A Netflix clone built with Next.js",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ApolloWrapper>
      <html lang="en">
        <body className={`${inter.className} bg-black text-white`}>
          <ToastContainer theme="dark" />
          <Navbar />
          <main className="pt-16 relative">{children}</main>
          <Footer />
        </body>
      </html>
    </ApolloWrapper>
  );
}
