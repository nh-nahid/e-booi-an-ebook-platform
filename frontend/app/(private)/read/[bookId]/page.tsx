"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2, Minus, Plus } from "lucide-react";

import Loading from "@/app/loading";
import { useAuth } from "@/hooks/use-auth";
import { useBook } from "@/features/books/hooks/use-book";
import { useBookFile } from "@/features/orders/hooks/use-orders";
import { bn } from "@/features/books/utils/bn-number";

// In-platform reader — renders the purchased PDF page-by-page onto a
// <canvas> via pdf.js, same technique as the free-preview modal
// (book-preview-modal.tsx). No native PDF viewer chrome (iframe/object),
// so there's no built-in "save"/"print" button sitting on top of a
// purchased book — the reader is the only way to see the pages here.
type Theme = "light" | "warm";

const THEME_BG: Record<Theme, string> = {
  light: "bg-[#F7F9FA]",
  warm: "bg-[#F3E9D2]",
};

const THEME_FILTER: Record<Theme, string> = {
  light: "",
  warm: "sepia(0.35) saturate(1.05) brightness(0.98)",
};

export default function BookReaderPage() {
  const params = useParams();
  const bookId = params.bookId as string;
  const router = useRouter();

  const { user, isLoading: authLoading } = useAuth();
  const { data: book, isLoading: bookLoading } = useBook(bookId);
  const {
    data: fileBytes,
    isLoading: fileLoading,
    isError: fileError,
  } = useBookFile(bookId);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfDocRef = useRef<any>(null);

  const [rendering, setRendering] = useState(true);
  const [renderError, setRenderError] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, user, router]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function renderPage(pdf: any, num: number, zoomLevel: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const page = await pdf.getPage(num);

    const containerWidth = Math.min(containerRef.current?.clientWidth || 700, 700);
    const unscaledViewport = page.getViewport({ scale: 1 });
    const scale = (containerWidth / unscaledViewport.width) * zoomLevel;
    const viewport = page.getViewport({ scale });

    const ratio = window.devicePixelRatio || 1;
    canvas.width = viewport.width * ratio;
    canvas.height = viewport.height * ratio;
    canvas.style.width = `${viewport.width}px`;
    canvas.style.height = `${viewport.height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    await page.render({ canvasContext: ctx, viewport }).promise;
  }

  // Load the PDF once its bytes have arrived.
  useEffect(() => {
    if (!fileBytes) return;

    let cancelled = false;

    (async () => {
      try {
        setRendering(true);
        setRenderError(false);

        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

        // .slice() copies the bytes — pdf.js can transfer/detach the
        // buffer it's handed, and this Uint8Array is cached by react-query
        // so it must stay intact for the life of the query.
        const pdf = await pdfjsLib.getDocument({ data: fileBytes.slice() }).promise;

        if (cancelled) {
          pdf.destroy();
          return;
        }

        pdfDocRef.current = pdf;
        setNumPages(pdf.numPages);
        setPageNum(1);
        await renderPage(pdf, 1, zoom);

        if (!cancelled) setRendering(false);
      } catch (err) {
        console.error("Book failed to render:", err);
        if (!cancelled) {
          setRenderError(true);
          setRendering(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      pdfDocRef.current?.destroy?.();
      pdfDocRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileBytes]);

  const goToPage = async (num: number) => {
    if (!pdfDocRef.current || num < 1 || num > numPages) return;
    setPageNum(num);
    setRendering(true);
    await renderPage(pdfDocRef.current, num, zoom);
    setRendering(false);
  };

  // Re-render the current page whenever zoom changes.
  useEffect(() => {
    if (!pdfDocRef.current) return;

    let cancelled = false;

    (async () => {
      setRendering(true);
      await renderPage(pdfDocRef.current, pageNum, zoom);
      if (!cancelled) setRendering(false);
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom]);

  // Touch swipe — same threshold/pattern used across the site's sliders.
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > 50) goToPage(pageNum - 1);
    if (delta < -50) goToPage(pageNum + 1);
    touchStartX.current = null;
  };

  if (authLoading || bookLoading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  const bg = THEME_BG[theme];
  const filter = THEME_FILTER[theme];
  const showLoader = fileLoading || rendering;
  const showError = (fileError || renderError) && !showLoader;

  return (
    <div className={`fixed inset-0 z-50 flex flex-col ${bg}`}>
      {/* header */}
      <header className="flex shrink-0 items-center gap-3 bg-[#0A0E2A] px-3 py-2.5 text-white sm:px-5 sm:py-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/10"
          aria-label="ফিরে যান"
        >
          <ArrowLeft className="h-[18px] w-[18px]" />
        </button>

        <p className="min-w-0 flex-1 truncate text-sm font-bold sm:text-base">
          {book?.title ?? "..."}
        </p>

        {numPages > 0 && (
          <span className="shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold">
            {bn(pageNum)}/{bn(numPages)}
          </span>
        )}
      </header>

      {/* page area */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onContextMenu={(e) => e.preventDefault()}
        className="relative flex flex-1 select-none items-start justify-center overflow-auto p-3 sm:p-6"
      >
        {showLoader && (
          <div className={`absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 ${bg} text-[#6B7280]`}>
            <Loader2 className="h-7 w-7 animate-spin text-[#2DBDB6]" />
            <span className="text-xs font-medium">বইটি লোড হচ্ছে...</span>
          </div>
        )}

        {showError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-6 text-center">
            <p className="text-sm font-semibold text-[#0A0E2A]">বইটি লোড করা যায়নি</p>
            <p className="text-xs text-[#6B7280]">
              হয়তো বইটি এখনো কেনা হয়নি, অথবা নেটওয়ার্ক সমস্যা হয়েছে।
            </p>
          </div>
        )}

        <canvas
          ref={canvasRef}
          style={{ filter }}
          className="max-w-full rounded shadow-[0_4px_20px_rgba(0,0,0,0.12)] transition-[filter] duration-300"
        />

        {numPages > 1 && (
          <>
            <button
              type="button"
              onClick={() => goToPage(pageNum - 1)}
              disabled={pageNum <= 1}
              className="fixed left-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#0A0E2A] shadow-md transition-opacity hover:bg-white disabled:opacity-0 sm:flex"
              aria-label="আগের পাতা"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => goToPage(pageNum + 1)}
              disabled={pageNum >= numPages}
              className="fixed right-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#0A0E2A] shadow-md transition-opacity hover:bg-white disabled:opacity-0 sm:flex"
              aria-label="পরের পাতা"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* bottom toolbar */}
      <footer className="flex shrink-0 flex-col items-center gap-2 border-t border-black/5 bg-white px-3 py-2 sm:flex-row sm:justify-center sm:gap-4 sm:py-2.5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-0.5 rounded-full border border-[#E1E5E8] p-0.5">
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`rounded-full px-3 py-1 text-[11px] font-bold transition-colors ${
                theme === "light" ? "bg-[#0A0E2A] text-white" : "text-[#6B7280]"
              }`}
            >
              Light
            </button>
            <button
              type="button"
              onClick={() => setTheme("warm")}
              className={`rounded-full px-3 py-1 text-[11px] font-bold transition-colors ${
                theme === "warm" ? "bg-[#0A0E2A] text-white" : "text-[#6B7280]"
              }`}
            >
              Warm
            </button>
          </div>

          <div className="flex items-center gap-1 rounded-full border border-[#E1E5E8] px-1 py-0.5">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.15).toFixed(2)))}
              className="flex h-6 w-6 items-center justify-center rounded-full text-[#6B7280] transition-colors hover:text-[#2DBDB6]"
              aria-label="জুম আউট"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-9 text-center text-[11px] font-semibold text-[#0A0E2A]">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(2, +(z + 0.15).toFixed(2)))}
              className="flex h-6 w-6 items-center justify-center rounded-full text-[#6B7280] transition-colors hover:text-[#2DBDB6]"
              aria-label="জুম ইন"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {numPages > 1 && (
          <div className="flex items-center gap-4 sm:hidden">
            <button
              type="button"
              onClick={() => goToPage(pageNum - 1)}
              disabled={pageNum <= 1}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E1E5E8] text-[#0A0E2A] disabled:opacity-30"
              aria-label="আগের পাতা"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => goToPage(pageNum + 1)}
              disabled={pageNum >= numPages}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E1E5E8] text-[#0A0E2A] disabled:opacity-30"
              aria-label="পরের পাতা"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </footer>
    </div>
  );
}
