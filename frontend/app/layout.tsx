import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import QueryProvider from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";

import { Toaster } from "react-hot-toast";

const inter = Inter({
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "E-Booi | An Ebook Platform",
    description: "Modern Online Book Store",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider>
                    <QueryProvider>
                        {children}
                        <Toaster position="top-right" />
                    </QueryProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}