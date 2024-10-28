import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from '../../lib/AuthContext'; // Import the AuthProvider

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
// const gothamSerif = localFont({
//   src: "./fonts/GothamSerifVF.woff", // Corrected font path
//   variable: "--font-gotham-serif",
//   weight: "100 900",
// });
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "My Next Code Challenge",
  description: "This is a code assessment project by Angel Murunwa Sigidi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider> {/* Wrap children with AuthProvider */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
