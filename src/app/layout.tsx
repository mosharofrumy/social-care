import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Social Care | Together for Humanity",
  description:
    "Social Care is a community-driven platform dedicated to connecting people, supporting meaningful causes, and creating positive changes.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
          <Footer />
          <Toaster position="bottom-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
