import { BookOpen, Package } from "lucide-react";
import type { CheckoutItem } from "@/features/checkout/types/checkout.types";

interface CheckoutItemsSummaryProps {
  items: CheckoutItem[];
}

export default function CheckoutItemsSummary({ items }: CheckoutItemsSummaryProps) {
  const physicalItems = items.filter((i) => i.format === "physical");
  const ebookItems = items.filter((i) => i.format === "digital");

  return (
    <div className="rounded-2xl border border-[#E1E5E8] bg-white p-5 animate-in fade-in slide-in-from-bottom-2 duration-500 [animation-delay:150ms]">
      <h3 className="mb-4 text-sm font-bold text-[#0A0E2A]">অর্ডার রিভিউ</h3>

      {physicalItems.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[#9AA3AF]">
            <Package className="h-3.5 w-3.5 text-[#2DBDB6]" />
            ফিজিক্যাল বই ({physicalItems.length})
          </p>
          <div className="space-y-3">
            {physicalItems.map((item) => (
              <ItemRow key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {ebookItems.length > 0 && (
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[#9AA3AF]">
            <BookOpen className="h-3.5 w-3.5 text-[#2DBDB6]" />
            eBook ({ebookItems.length})
          </p>
          <div className="space-y-3">
            {ebookItems.map((item) => (
              <ItemRow key={item.id} item={item} />
            ))}
          </div>

          <p className="mt-3 rounded-xl bg-[#E6F7F6] px-3 py-2 text-xs font-medium text-[#0A0E2A]">
            eBook গুলো অর্ডার সম্পন্ন হওয়ার সাথে সাথেই আপনার লাইব্রেরিতে যোগ হয়ে যাবে।
          </p>
        </div>
      )}
    </div>
  );
}

function ItemRow({ item }: { item: CheckoutItem }) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "");

  const imageUrl = !item.coverImage
    ? "/placeholder-book.png"
    : item.coverImage.startsWith("http")
      ? item.coverImage
      : `${baseUrl}/uploads/books/${item.coverImage}`;

  return (
    <div className="flex items-center gap-3">
      <div className="h-14 w-10 shrink-0 overflow-hidden rounded-lg border border-[#E1E5E8] bg-gradient-to-br from-[#dfe7ea] to-[#cfd8db]">
        <img src={imageUrl} alt={item.title} className="h-full w-full object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-[#0A0E2A]">{item.title}</p>
        <p className="text-xs text-[#6B7280]">পরিমাণ: {item.quantity}</p>
      </div>
      <p className="shrink-0 text-sm font-bold text-[#0A0E2A]">
        ৳ {(item.price * item.quantity).toLocaleString()}
      </p>
    </div>
  );
}