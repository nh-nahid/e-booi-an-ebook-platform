import type { Metadata } from "next";
import { Inter, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";

import QueryProvider from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import AuthProvider from "@/providers/auth-provider";
import { Toaster } from "@/components/ui/sonner";
import SearchCleanup from "@/components/search/search-cleanup";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

const banglaFont = Noto_Sans_Bengali({
  subsets: ["bengali"],
  variable: "--font-bangla",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "E-Booi | ই-বই",
  description: "Modern Online Book Store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body className={`${inter.variable} ${banglaFont.variable}`}>
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>
              <SearchCleanup />
              {children}
              <Toaster position="bottom-right" richColors />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}