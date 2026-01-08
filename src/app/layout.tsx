// src/app/layout.tsx
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { twMerge } from "tailwind-merge";
import { Header } from "@/sections/Header";

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Saas Landing Page",
  description:
    "SaaS Landing Page with React, Next.js, TailwindCSS & Framer Motion",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="relative">
      <head>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
      </head>

      <body className={twMerge(dmSans.className, "antialiased bg-[#EAEEFE]")}>
        <Header />
        {children}
      </body>
    </html>
  );
}
