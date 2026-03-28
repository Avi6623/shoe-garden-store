import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shoe Garden | Premium Footwear",
  description: "Experience the next generation of premium sneakers and comfort wear.",
};

import { AuthProvider } from "@/components/auth/AuthProvider";
import { ThemeProvider } from "next-themes";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased">
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
