"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BookPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  previewUrl: string;
}

// Renders the preview PDF page-by-page onto a <canvas> via pdf.js instead
// of embedding it in an <iframe>. A native PDF viewer (iframe/object tag)
// always ships its own toolbar with download/print buttons, and those
// can't be reliably suppressed across browsers — Ctrl+S / right-click ->
// "Save As" still work regardless of any `#toolbar=0` URL hack. Rendering
// to a plain <canvas> means there's no PDF viewer chrome at all: nothing
// to download, nothing to print, no text layer to copy — just a picture
// of the page the shopper can flip through.
export default function BookPreviewModal({
  open,
  onOpenChange,
  title,
  previewUrl,
}: BookPreviewModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfDocRef = useRef<any>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const [numPages, setNumPages] = useState(0);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    setLoading(true);
    setError(false);
    setPageNum(1);
    setNumPages(0);

    (async () => {
      try {
        const pdfjsLib = await import("pdfjs-dist");

        // Self-hosted from /public rather than a CDN: the worker script's
        // version has to match the pdfjs-dist package version exactly, and
        // depending on an external CDN having that exact build (and being
        // reachable at all — some networks/ad-blockers block cdnjs) is a
        // common source of "the PDF just never renders". Shipping the
        // matching worker file ourselves removes that whole failure mode.
        // (.js rather than .mjs so static file servers that don't map the
        // .mjs extension to a JS content-type can't reject it as a module.)
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

        // Fetch the PDF bytes ourselves instead of handing pdf.js a bare
        // URL — pdf.js's own range-request networking depends on the
        // server exposing Content-Length/Accept-Ranges across origins,
        // which this API doesn't currently do. A plain fetch + typed
        // array sidesteps that entirely and surfaces a real HTTP error
        // (403/404/etc.) instead of a networking layer that silently
        // never resolves.
        const res = await fetch(previewUrl);

        if (!res.ok) {
          throw new Error(`Preview request failed: ${res.status}`);
        }

        const data = new Uint8Array(await res.arrayBuffer());

        const pdf = await pdfjsLib.getDocument({ data }).promise;

        if (cancelled) {
          pdf.destroy();
          return;
        }

        pdfDocRef.current = pdf;
        setNumPages(pdf.numPages);

        await renderPage(pdf, 1);

        if (!cancelled) setLoading(false);
      } catch (err) {
        // Surfaced to the console on purpose — this is the fastest way to
        // tell a bad preview URL/network error apart from a rendering bug
        // if the preview ever fails to load again.
        console.error("Book preview failed to load:", err);

        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      pdfDocRef.current?.destroy?.();
      pdfDocRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, previewUrl]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function renderPage(pdf: any, num: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const page = await pdf.getPage(num);

    const containerWidth = canvas.parentElement?.clientWidth || 600;
    const unscaledViewport = page.getViewport({ scale: 1 });
    const scale = containerWidth / unscaledViewport.width;
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

  const goToPage = async (num: number) => {
    if (!pdfDocRef.current || num < 1 || num > numPages) return;
    setPageNum(num);
    await renderPage(pdfDocRef.current, num);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Dialog's base styling ships `sm:max-w-md` — a different
          responsive bucket than a plain `max-w-*`, so overriding only the
          unprefixed class leaves it capped at 28rem on every real desktop
          viewport. Overriding `sm:max-w-*` explicitly is what actually
          widens it. */}
      <DialogContent className="top-12 flex h-[75vh] w-full max-w-[calc(100%-2rem)] -translate-y-0 flex-col gap-3 p-4 sm:top-20 sm:max-w-3xl sm:p-5">
        <DialogHeader>
          <DialogTitle className="pr-8 text-base font-bold text-[#0A0E2A]">
            {title} — কিছু অংশ পড়ে দেখুন
          </DialogTitle>
        </DialogHeader>

        <div
          className="relative flex flex-1 select-none items-start justify-center overflow-auto rounded-xl border border-[#E1E5E8] bg-[#F7F9FA] p-2"
          onContextMenu={(e) => e.preventDefault()}
        >
          {loading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-[#F7F9FA] text-[#9AA3AF]">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-xs font-medium">প্রিভিউ লোড হচ্ছে...</span>
            </div>
          )}

          {error && !loading && (
            <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-[#9AA3AF]">
              প্রিভিউ লোড করা যায়নি। একটু পরে আবার চেষ্টা করুন।
            </div>
          )}

          <canvas
            ref={canvasRef}
            className="max-w-full rounded-lg shadow-sm"
          />
        </div>

        {numPages > 1 && (
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => goToPage(pageNum - 1)}
              disabled={pageNum <= 1}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E1E5E8] text-[#0A0E2A] transition-colors hover:border-[#2DBDB6] hover:text-[#2DBDB6] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="আগের পাতা"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="text-xs font-semibold text-[#6B7280]">
              পাতা {pageNum} / {numPages}
            </span>

            <button
              type="button"
              onClick={() => goToPage(pageNum + 1)}
              disabled={pageNum >= numPages}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E1E5E8] text-[#0A0E2A] transition-colors hover:border-[#2DBDB6] hover:text-[#2DBDB6] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="পরের পাতা"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        <p className="text-center text-xs text-[#9AA3AF]">
          বইটির প্রথম কয়েক পাতা দেখানো হচ্ছে — সম্পূর্ণ বইটি পড়তে হলে কিনুন
        </p>
      </DialogContent>
    </Dialog>
  );
}
