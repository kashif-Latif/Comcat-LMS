import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "COMCAT University — Official Web Portal",
  description:
    "COMCAT University Official Web Portal. A modern institution committed to academic excellence in Computer Science, IT, Software Engineering, and more. Developed by Muhammad Kashif Latif.",
  keywords: [
    "COMCAT University",
    "University Management",
    "Education",
    "Student Portal",
    "Lahore",
    "BS Computer Science",
    "BS IT",
    "Software Engineering",
    "Admissions",
  ],
  authors: [{ name: "Muhammad Kashif Latif", url: "https://github.com/kashif-Latif" }],
  creator: "Muhammad Kashif Latif",
  icons: {
    icon: "/hero-campus.jpg",
  },
  openGraph: {
    title: "COMCAT University — Official Web Portal",
    description:
      "Excellence in education. COMCAT University — shaping the future of technology leaders in Pakistan. Developed by Muhammad Kashif Latif.",
    type: "website",
    creator: "Muhammad Kashif Latif",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
