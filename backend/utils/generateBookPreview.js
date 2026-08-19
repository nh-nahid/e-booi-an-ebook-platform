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
async function getOrCreatePreview(book) {
  if (!book.pdfFile) return null;

  const sourcePath = path.join(
    process.cwd(),
    "public",
    "uploads",
    "pdfs",
    book.pdfFile,
  );

  if (!fs.existsSync(sourcePath)) return null;

  createFolder(previewDir());

  const previewPath = previewPathFor(book._id);
  const sourceStat = fs.statSync(sourcePath);

  // Reuse the cached preview as long as it's not older than the source
  // file — this covers the normal case (many hits, one PDF) without
  // regenerating on every request, but still self-heals after the admin
  // uploads a new pdfFile for the book.
  if (fs.existsSync(previewPath)) {
    const previewStat = fs.statSync(previewPath);

    if (previewStat.mtimeMs >= sourceStat.mtimeMs) {
      return previewPath;
    }
  }

  const sourceBytes = fs.readFileSync(sourcePath);
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
