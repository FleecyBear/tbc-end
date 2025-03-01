import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "./contexts/userContext"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-b from-vibrantPink to-darkPurple dark:from-deepBlue dark:to-darkPurple`}>
        <div className="relative min-h-screen">
          <UserProvider> 
            <div className="absolute inset-0 bg-gradient-to-r from-warmCoral to-mutedGrayBlue dark:from-darkPurple dark:to-deepBlue clip-triangle"></div>
            <div className="relative z-10">{children}</div>
          </UserProvider>
        </div>
      </body>
    </html>
  );
}
