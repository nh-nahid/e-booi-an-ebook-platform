import SiteFooter from "@/components/layout/site-footer";
import AdminRedirectGuard from "@/features/home/components/admin-redirect-guard";
import HeroSection from "@/features/home/components/hero-section";
import CategorySection from "@/features/home/components/category-section";
import BookSection from "@/features/home/components/book-section";
import PreOrderSection from "@/features/home/components/preorder-section";
import TrustSection from "@/features/home/components/trust-section";
import TestimonialSection from "@/features/home/components/testimonial-section";

import { getHome } from "@/features/home/api/home.api";

export const revalidate = 60;

export default async function HomePage() {
  const response = await getHome();
  const homeData = response.data;

  return (
    <div className="min-h-screen bg-[#F7F9FA]">
      <AdminRedirectGuard />

      <HeroSection statistics={homeData.statistics} />

      <CategorySection categories={homeData.categories} />

      <BookSection
        title="সকল বই"
        href="/books?featured=true"
        books={homeData.featuredBooks}
      />


      <BookSection
        title="নতুন প্রকাশিত বই"
        href="/books?sort=latest"
        books={homeData.latestBooks}
      />

      <BookSection
        title="বেস্ট সেলিং বই"
        href="/books?sort=best-selling"
        books={homeData.bestSellingBooks}
      />

      <PreOrderSection books={homeData.preOrderBooks} />

      <SiteFooter />
    </div>
  );
}
