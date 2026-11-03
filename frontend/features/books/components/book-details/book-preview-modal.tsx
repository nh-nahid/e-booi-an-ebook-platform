"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Minus, Plus } from "lucide-react";

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

// Renders the preview PDF page-by-page onto <canvas> elements via pdf.js
// instead of embedding it in an <iframe>. A native PDF viewer (iframe/object
// tag) always ships its own toolbar with download/print buttons, and those
// can't be reliably suppressed across browsers — Ctrl+S / right-click ->
// "Save As" still work regardless of any `#toolbar=0` URL hack. Rendering
// to plain <canvas> elements means there's no PDF viewer chrome at all:
// nothing to download, nothing to print, no text layer to copy — just a
// picture of each page the shopper can scroll through, top to bottom
// (matching the full in-platform reader's layout).
export default function BookPreviewModal({
  open,
  onOpenChange,
  title,
  previewUrl,
}: BookPreviewModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfDocRef = useRef<any>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [numPages, setNumPages] = useState(0);
  const [zoom, setZoom] = useState(1);
  const zoomRef = useRef(1);

  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    setLoading(true);
    setError(false);
    setNumPages(0);
    setZoom(1);
    zoomRef.current = 1;
    canvasRefs.current = [];

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
        // Triggers the render effect below once React has actually
        // mounted a <canvas> for each page (see that effect's comment).
        setNumPages(pdf.numPages);
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

  // Actually render the pages. This has to be a separate effect keyed off
  // `numPages` rather than running right after `setNumPages` above —
  // state updates don't apply synchronously, so the <canvas> elements
  // (which only exist once `numPages` > 0, see the JSX below) aren't in
  // the DOM yet at that point and every canvasRefs lookup would still be
  // null, silently rendering nothing (a blank modal).
  useEffect(() => {
    if (!numPages || !pdfDocRef.current) return;

    let cancelled = false;

    (async () => {
      // A preview is only ever a handful of trimmed pages, so rendering
      // every page up front (rather than lazily as the reader does) is
      // cheap and keeps this component simple.
      for (let num = 1; num <= numPages; num++) {
        if (cancelled) return;
        await renderPage(pdfDocRef.current, num, zoomRef.current);
      }

      if (!cancelled) setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numPages]);

  // Re-render every page at the new zoom level once the user zooms.
  useEffect(() => {
    if (!numPages || !pdfDocRef.current || loading) return;

    let cancelled = false;

    (async () => {
      for (let num = 1; num <= numPages; num++) {
        if (cancelled) return;
        await renderPage(pdfDocRef.current, num, zoom);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function renderPage(pdf: any, num: number, zoomLevel: number) {
    const canvas = canvasRefs.current[num - 1];
    if (!canvas) return;

    const page = await pdf.getPage(num);

    // Fit to the container's HEIGHT rather than its width — the goal is
    // one page filling roughly one screen (one scroll "stop"), not a
    // page that's full-width but taller than the viewport and needs its
    // own internal scrolling before the next page appears. `zoomLevel`
    // scales on top of that fit-to-height base.
    const containerHeight = containerRef.current?.clientHeight || 700;
    const unscaledViewport = page.getViewport({ scale: 1 });
    const scale = (containerHeight / unscaledViewport.height) * zoomLevel;
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Dialog's base styling ships `sm:max-w-md` — a different
          responsive bucket than a plain `max-w-*`, so overriding only the
          unprefixed class leaves it capped at 28rem on every real desktop
          viewport. Overriding `sm:max-w-*` explicitly is what actually
          widens it. */}
      <DialogContent className="top-6 flex h-[92vh] w-full max-w-[calc(100%-2rem)] -translate-y-0 flex-col gap-3 p-4 sm:top-8 sm:h-[90vh] sm:max-w-xl sm:p-5">
        <DialogHeader>
          <DialogTitle className="pr-8 text-base font-bold text-ink">
            {title} — কিছু অংশ পড়ে দেখুন
          </DialogTitle>
        </DialogHeader>

        <div
          ref={containerRef}
          className="relative flex flex-1 select-none flex-col items-center gap-3 overflow-auto rounded-xl border border-line bg-canvas p-2"
          onContextMenu={(e) => e.preventDefault()}
        >
          {loading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-canvas text-subtle">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-xs font-medium">প্রিভিউ লোড হচ্ছে...</span>
            </div>
          )}

          {error && !loading && (
            <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-subtle">
              প্রিভিউ লোড করা যায়নি। একটু পরে আবার চেষ্টা করুন।
            </div>
          )}

          {!error &&
            Array.from({ length: numPages }, (_, i) => i + 1).map((num) => (
              <canvas
                key={num}
                ref={(el) => {
                  canvasRefs.current[num - 1] = el;
                }}
                className="shrink-0 rounded-lg shadow-sm"
              />
            ))}
        </div>

        <div className="flex items-center justify-center gap-3">
          <div className="flex items-center gap-1 rounded-full border border-line px-1 py-0.5">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.15).toFixed(2)))}
              className="flex h-6 w-6 items-center justify-center rounded-full text-muted-ink transition-colors hover:text-brand"
              aria-label="জুম আউট"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-9 text-center text-[11px] font-semibold text-ink">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(2.5, +(z + 0.15).toFixed(2)))}
              className="flex h-6 w-6 items-center justify-center rounded-full text-muted-ink transition-colors hover:text-brand"
              aria-label="জুম ইন"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-subtle">
          বইটির প্রথম কয়েক পাতা দেখানো হচ্ছে — সম্পূর্ণ বইটি পড়তে হলে কিনুন
        </p>
      </DialogContent>
    </Dialog>
  );
}
