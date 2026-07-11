import Navbar from "@/components/layout/navbar";
import SiteFooter from "@/components/layout/site-footer";
import BookSection from "@/features/home/components/book-section";
import CategorySection from "@/features/home/components/category-section";
import HeroSection from "@/features/home/components/hero-section";
import PreOrderSection from "@/features/home/components/preorder-section";


// TODO: replace with real data fetching
const TOP_BOOKS: Book[] = [
  { id: "1", title: "বইয়ের নাম ০১", price: 250, badge: "popular" },
  { id: "2", title: "বইয়ের নাম ০২", price: 320, badge: "popular" },
  { id: "3", title: "বইয়ের নাম ০৩", price: 180 },
  { id: "4", title: "বইয়ের নাম ০৪", price: 410 },
  { id: "5", title: "বইয়ের নাম ০৫", price: 290 },
];

const ALL_BOOKS: Book[] = [
  { id: "6", title: "বইয়ের নাম ০৬", price: 210 },
  { id: "7", title: "বইয়ের নাম ০৭", price: 330 },
  { id: "8", title: "বইয়ের নাম ০৮", price: 175 },
  { id: "9", title: "বইয়ের নাম ০৯", price: 299 },
  { id: "10", title: "বইয়ের নাম ১০", price: 360 },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F7F9FA]">

      <HeroSection />
      <CategorySection />
      <BookSection title="Top Books" href="/books?sort=top" books={TOP_BOOKS} />
      <BookSection title="All Book" href="/books" books={ALL_BOOKS} />
      <PreOrderSection />

      <SiteFooter />
    </div>
  );
}
