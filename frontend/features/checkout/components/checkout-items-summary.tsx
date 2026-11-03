import { BookOpen } from "lucide-react";
import type { CheckoutItem } from "@/features/checkout/types/checkout.types";

interface CheckoutItemsSummaryProps {
  items: CheckoutItem[];
}

export default function CheckoutItemsSummary({ items }: CheckoutItemsSummaryProps) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5 animate-in fade-in slide-in-from-bottom-2 duration-500 [animation-delay:150ms]">
      <h3 className="mb-4 text-sm font-bold text-ink">অর্ডার রিভিউ</h3>

      <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-subtle">
        <BookOpen className="h-3.5 w-3.5 text-brand" />
        eBook ({items.length})
      </p>
      <div className="space-y-3">
        {items.map((item) => (
          <ItemRow key={item.id} item={item} />
        ))}
      </div>

      <p className="mt-3 rounded-xl bg-brand-soft px-3 py-2 text-xs font-medium text-ink">
        eBook গুলো অর্ডার সম্পন্ন হওয়ার সাথে সাথেই আপনার লাইব্রেরিতে যোগ হয়ে যাবে।
      </p>
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
      <div className="h-14 w-10 shrink-0 overflow-hidden rounded-lg border border-line bg-gradient-to-br from-soft to-line">
        <img src={imageUrl} alt={item.title} className="h-full w-full object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink">{item.title}</p>
        <p className="text-xs text-muted-ink">পরিমাণ: {item.quantity}</p>
      </div>
      <p className="shrink-0 text-sm font-bold text-ink">
        ৳ {(item.price * item.quantity).toLocaleString()}
      </p>
    </div>
  );
}
