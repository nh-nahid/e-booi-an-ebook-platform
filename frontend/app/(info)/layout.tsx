import Navbar from "@/components/layout/navbar";
import SiteFooter from "@/components/layout/site-footer";

export default function InfoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
