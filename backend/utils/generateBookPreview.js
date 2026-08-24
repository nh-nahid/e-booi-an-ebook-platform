const fs = require("fs");
const path = require("path");
const { PDFDocument } = require("pdf-lib");

// How many pages of a Digital book get exposed through the public
// "preview" endpoint. Keep this small and server-controlled — the full
// pdfFile itself is never sent to that route, only a freshly-built PDF
// containing at most this many pages, so a shopper can only ever see a
// sample of the book, never the whole thing, before buying it.
const PREVIEW_PAGE_COUNT = 5;

function createFolder(folder) {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, {
      recursive: true,
    });
  }
}

function previewDir() {
  return path.join(process.cwd(), "public", "uploads", "previews");
}

function previewPathFor(bookId) {
  return path.join(previewDir(), `${bookId}.pdf`);
}

// Returns the absolute path to a short preview PDF (first few pages only)
// for the given book, building/caching it on first request. Returns null
// if the book has no readable source PDF to build a preview from.
//
// book.pdfFile is a Cloudinary secure_url (post-migration) — the source
// bytes are fetched over HTTP instead of read off local disk. The
// generated *preview* itself still caches locally (public/uploads/previews)
// since it's a small, freely-regenerable derivative, not an uploaded
// asset — bookController.updateBook calls removePreview() whenever a
// book's pdfFile is replaced, so there's no need for the old
// preview-vs-source mtime check to self-heal a stale cache.
async function getOrCreatePreview(book) {
  if (!book.pdfFile) return null;

  createFolder(previewDir());

  const previewPath = previewPathFor(book._id);

  if (fs.existsSync(previewPath)) {
    return previewPath;
  }

  let sourceBytes;

  try {
    const response = await fetch(book.pdfFile);

    if (!response.ok) {
      throw new Error(`Fetching source PDF failed: ${response.status}`);
    }

    sourceBytes = Buffer.from(await response.arrayBuffer());
  } catch (err) {
    console.error("Could not fetch source PDF for preview:", err.message);
    return null;
  }

  const sourceDoc = await PDFDocument.load(sourceBytes);

  const totalPages = sourceDoc.getPageCount();
  const pageCount = Math.min(PREVIEW_PAGE_COUNT, totalPages);

  const previewDoc = await PDFDocument.create();

  const pageIndices = Array.from({ length: pageCount }, (_, i) => i);
  const copiedPages = await previewDoc.copyPages(sourceDoc, pageIndices);

  copiedPages.forEach((page) => previewDoc.addPage(page));

  const previewBytes = await previewDoc.save();

  fs.writeFileSync(previewPath, previewBytes);

  return previewPath;
}

// Drops a cached preview file, e.g. when the book itself is deleted or
// its pdfFile is replaced. Safe to call even if no preview exists yet.
function removePreview(bookId) {
  if (!bookId) return;

  const previewPath = previewPathFor(bookId);

  if (fs.existsSync(previewPath)) {
    fs.unlinkSync(previewPath);
  }
}

module.exports = {
  getOrCreatePreview,
  removePreview,
  PREVIEW_PAGE_COUNT,
};
