import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Dancing_Script } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { QueryProvider } from "@/providers/QueryProvider";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dancing-script",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GrowthCraft - Where Learning Meets Opportunity",
  description: "GrowthCraft - Your all-in-one platform to learn tech, master industry skills, join hands-on bootcamps, connect with mentors, and land your dream job.",
  authors: [{ name: "GrowthCraft by SYNTHWEB" }],
  keywords: ["tech education", "bootcamps", "coding courses", "web development", "data science", "career training"],
  openGraph: {
    title: "GrowthCraft - Where Learning Meets Opportunity",
    description: "Learn tech, master skills, join bootcamps, connect with mentors, and land your dream job.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GrowthCraft - Where Learning Meets Opportunity",
    description: "Learn tech, master skills, join bootcamps, and land your dream job.",
  },
  appleWebApp: {
    title: "GrowthCraft",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${plusJakartaSans.variable} ${dancingScript.variable}`}
    >
      <body className="font-sans antialiased">
        <QueryProvider>
          {children}
        </QueryProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
