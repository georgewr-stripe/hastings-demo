'use client'

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Image from "next/image";
import { MessagesSquare, UserRound } from "lucide-react";
import React from "react";
import Toolbar from "../components/toolbar";
import { SessionProvider } from "@/hooks/useSession";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// export const metadata: Metadata = {
//   title: "Hastings Demo",
//   description: "Hastings Payment Element Demo",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#011831]`}
        >
          <Toolbar />
          <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-2 pb-20 gap-16 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full ">
              <div className="flex justify-center w-full">
              {children}
              </div>
            </main>
          </div>
        </body>
      </html>
    </SessionProvider>
  );
}
