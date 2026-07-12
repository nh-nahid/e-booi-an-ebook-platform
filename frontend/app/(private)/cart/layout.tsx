import type { Metadata } from "next";

import Navbar from "@/components/layout/navbar";
import SiteFooter from "@/components/layout/site-footer";

export const metadata: Metadata = {
  title: "কার্ট | ই-বই",
  description: "Your shopping cart",
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <SiteFooter />
    </>
  );
}