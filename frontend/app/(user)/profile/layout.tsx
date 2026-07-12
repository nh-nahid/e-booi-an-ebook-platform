import type { Metadata } from "next";

import Navbar from "@/components/layout/navbar";

export const metadata: Metadata = {
  title: "প্রোফাইল | ই-বই",
  description: "Modern Online Book Store",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}