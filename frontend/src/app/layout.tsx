import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { QueryProvider } from "@/providers/QueryProvider";

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
      className="h-full antialiased"
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
