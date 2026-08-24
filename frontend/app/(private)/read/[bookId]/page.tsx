"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2, Minus, Plus } from "lucide-react";

import Loading from "@/app/loading";
import { useAuth } from "@/hooks/use-auth";
import { useBook } from "@/features/books/hooks/use-book";
import { useBookFile } from "@/features/orders/hooks/use-orders";
import { bn } from "@/features/books/utils/bn-number";

// In-platform reader — renders the purchased PDF page-by-page onto stacked
// <canvas> elements via pdf.js (same technique as the free-preview modal),
// laid out as one continuous top-to-bottom scroll rather than a single page
// swapped left/right. No native PDF viewer chrome (iframe/object), so
// there's no built-in "save"/"print" button sitting on top of a purchased
// book — the reader is the only way to see the pages here.
//
// Pages render lazily as they scroll into view (via IntersectionObserver)
// instead of all at once — a long book can be hundreds of pages, and
// rendering every canvas up front would be slow and memory-heavy.
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

  const containerRef = useRef<HTMLDivElement>(null);
  const pageWrapperRefs = useRef<(HTMLDivElement | null)[]>([]);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfDocRef = useRef<any>(null);
  const baseScaleRef = useRef(1);
  const zoomRef = useRef(1);
  const renderedPagesRef = useRef<Set<number>>(new Set());
  const visiblePagesRef = useRef<Set<number>>(new Set());

  const [docReady, setDocReady] = useState(false);
  const [renderError, setRenderError] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [pageSize, setPageSize] = useState<{ width: number; height: number } | null>(null);
  const [renderedPages, setRenderedPages] = useState<Set<number>>(new Set());
  const [zoom, setZoom] = useState(1);
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function renderPageAt(pdf: any, num: number, zoomLevel: number) {
    const canvas = canvasRefs.current[num - 1];
    if (!canvas) return;

    const page = await pdf.getPage(num);
    const scale = baseScaleRef.current * zoomLevel;
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

  // Load the PDF once its bytes have arrived — parse it, work out a
  // shared page size (books have uniform page dimensions) so unrendered
  // pages can reserve the right amount of scroll space, then let the
  // IntersectionObserver effect below render pages as they come into view.
  useEffect(() => {
    if (!fileBytes) return;

    let cancelled = false;

    (async () => {
      try {
        setDocReady(false);
        setRenderError(false);
        renderedPagesRef.current = new Set();
        setRenderedPages(new Set());
        pageWrapperRefs.current = [];
        canvasRefs.current = [];

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

        const page1 = await pdf.getPage(1);
        const containerWidth = Math.min(containerRef.current?.clientWidth || 700, 700);
        const unscaledViewport = page1.getViewport({ scale: 1 });
        const baseScale = containerWidth / unscaledViewport.width;
        baseScaleRef.current = baseScale;

        const referenceViewport = page1.getViewport({ scale: baseScale });

        if (cancelled) return;

        setPageSize({ width: referenceViewport.width, height: referenceViewport.height });
        setNumPages(pdf.numPages);
        setPageNum(1);
        setDocReady(true);
      } catch (err) {
        console.error("Book failed to render:", err);
        if (!cancelled) {
          setRenderError(true);
          setDocReady(true);
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

  // Observe every page's placeholder — render a page onto its canvas the
  // first time it (or a neighbour, via rootMargin) scrolls into view.
  useEffect(() => {
    if (!docReady || !numPages || renderError) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let changed = false;

        entries.forEach((entry) => {
          const num = Number(entry.target.getAttribute("data-page"));
          if (!num) return;

          if (entry.isIntersecting) {
            visiblePagesRef.current.add(num);

            if (!renderedPagesRef.current.has(num) && pdfDocRef.current) {
              renderedPagesRef.current.add(num);
              changed = true;
              renderPageAt(pdfDocRef.current, num, zoomRef.current);
            }
          } else {
            visiblePagesRef.current.delete(num);
          }
        });

        if (changed) {
          setRenderedPages(new Set(renderedPagesRef.current));
        }

        if (visiblePagesRef.current.size) {
          setPageNum(Math.min(...visiblePagesRef.current));
        }
      },
      {
        root: containerRef.current,
        rootMargin: "600px 0px 600px 0px",
        threshold: 0.01,
      },
    );

    pageWrapperRefs.current.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docReady, numPages, renderError]);

  // Re-render every already-rendered page at the new zoom level.
  useEffect(() => {
    if (!pdfDocRef.current || !renderedPagesRef.current.size) return;

    renderedPagesRef.current.forEach((num) => {
      renderPageAt(pdfDocRef.current, num, zoom);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom]);

  const goToPage = (num: number) => {
    if (num < 1 || num > numPages) return;
    pageWrapperRefs.current[num - 1]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  if (authLoading || bookLoading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  const bg = THEME_BG[theme];
  const filter = THEME_FILTER[theme];
  const showLoader = fileLoading || !docReady;
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

      {/* page area — one continuous top-to-bottom scroll */}
      <div
        ref={containerRef}
        onContextMenu={(e) => e.preventDefault()}
        className="relative flex flex-1 select-none flex-col items-center gap-3 overflow-y-auto p-3 sm:p-6"
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

        {!showError &&
          docReady &&
          pageSize &&
          Array.from({ length: numPages }, (_, i) => i + 1).map((num) => (
            <div
              key={num}
              ref={(el) => {
                pageWrapperRefs.current[num - 1] = el;
              }}
              data-page={num}
              className="relative flex items-center justify-center rounded bg-white/40 shadow-[0_4px_20px_rgba(0,0,0,0.12)]"
              style={{
                width: pageSize.width * zoom,
                height: pageSize.height * zoom,
                maxWidth: "100%",
              }}
            >
              {!renderedPages.has(num) && (
                <Loader2 className="h-5 w-5 animate-spin text-[#2DBDB6]" />
              )}

              <canvas
                ref={(el) => {
                  canvasRefs.current[num - 1] = el;
                }}
                style={{ filter }}
                className="max-w-full rounded transition-[filter] duration-300"
              />
            </div>
          ))}
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
          <div className="flex items-center gap-4">
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
