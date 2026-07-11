import SiteFooter from "@/components/layout/site-footer";
import HeroSection from "@/features/home/components/hero-section";
import CategorySection from "@/features/home/components/category-section";
import BookSection from "@/features/home/components/book-section";
import PreOrderSection from "@/features/home/components/preorder-section";

import { getHome } from "@/features/home/api/home.api";

export default async function HomePage() {
  const response = await getHome();
  const homeData = response.data;

  return (
    <div className="min-h-screen bg-[#F7F9FA]">
      <HeroSection statistics={homeData.statistics} />

       <CategorySection categories={homeData.categories} />

      <BookSection
        title="Featured Books"
        href="/books?featured=true"
        books={homeData.featuredBooks}
      />

      <BookSection
        title="Latest Books"
        href="/books?sort=latest"
        books={homeData.latestBooks}
      />

      <BookSection
        title="Best Selling Books"
        href="/books?sort=best-selling"
        books={homeData.bestSellingBooks}
      />

      <PreOrderSection books={homeData.preOrderBooks} />

      <SiteFooter />
    </div>
  );
}