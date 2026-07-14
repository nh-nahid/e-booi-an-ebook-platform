const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

// ---- Theme ----
const COLORS = {
  primary: "#1F3A5F",   // deep navy
  accent: "#D9A441",    // gold
  text: "#222222",
  muted: "#6B7280",
  border: "#E5E7EB",
  rowAlt: "#F7F8FA",
  white: "#FFFFFF",
};

const PAGE_MARGIN = 50;

// ---- Fonts ----
// PDFKit's built-in "Helvetica"/"Helvetica-Bold" only cover Latin glyphs —
// they contain no Bengali characters at all, so any Bangla text silently
// fails to render. Noto Sans Bengali (the script-specific Noto build) has
// the opposite problem: it only ships Bengali + digits, with NO Latin
// alphabet at all, so English labels disappear instead.
// Hind Siliguri covers full Latin (A-Z/a-z) AND Bengali in one font, so
// we use it everywhere for both scripts.
const FONT_REGULAR_PATH = path.join(
  __dirname,
  "fonts",
  "HindSiliguri-Regular.ttf",
);
const FONT_BOLD_PATH = path.join(
  __dirname,
  "fonts",
  "HindSiliguri-Bold.ttf",
);

const FONT_REGULAR = "Bengali";
const FONT_BOLD = "Bengali-Bold";

function registerFonts(doc) {
  if (!fs.existsSync(FONT_REGULAR_PATH) || !fs.existsSync(FONT_BOLD_PATH)) {
    throw new Error(
      `Missing Bengali font files. Expected:\n${FONT_REGULAR_PATH}\n${FONT_BOLD_PATH}`,
    );
  }

  doc.registerFont(FONT_REGULAR, FONT_REGULAR_PATH);
  doc.registerFont(FONT_BOLD, FONT_BOLD_PATH);
}

function generateInvoice(order, user) {
  return new Promise((resolve, reject) => {
    const invoiceNumber = `INV-${Date.now()}`;
    const fileName = `${invoiceNumber}.pdf`;

    const filePath = path.join(
      __dirname,
      "..",
      "public",
      "uploads",
      "invoices",
      fileName,
    );

    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    const doc = new PDFDocument({ size: "A4", margin: PAGE_MARGIN });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    try {
      registerFonts(doc);
    } catch (err) {
      reject(err);
      return;
    }

    const pageWidth = doc.page.width - PAGE_MARGIN * 2;

    drawHeader(doc, invoiceNumber, pageWidth);
    drawPartiesBlock(doc, order, user, pageWidth);
    drawItemsTable(doc, order, pageWidth);
    drawTotals(doc, order, pageWidth);
    drawFooter(doc, order, pageWidth);

    doc.end();

    stream.on("finish", () => {
      resolve({
        invoiceNumber,
        invoiceUrl: `/uploads/invoices/${fileName}`,
      });
    });

    stream.on("error", reject);
  });
}

// ---------- Sections ----------

function drawHeader(doc, invoiceNumber, pageWidth) {
  // Colored header band
  doc.rect(0, 0, doc.page.width, 110).fill(COLORS.primary);

  doc
    .fillColor(COLORS.white)
    .font(FONT_BOLD)
    .fontSize(24)
    .text("E-Booi", PAGE_MARGIN, 32);

  doc
    .font(FONT_REGULAR)
    .fontSize(10)
    .fillColor("#C9D4E3")
    .text("Your trusted online bookstore", PAGE_MARGIN, 62);

  // Invoice label on the right
  doc
    .font(FONT_BOLD)
    .fontSize(18)
    .fillColor(COLORS.accent)
    .text("INVOICE", PAGE_MARGIN, 30, { width: pageWidth, align: "right" });

  doc
    .font(FONT_REGULAR)
    .fontSize(10)
    .fillColor(COLORS.white)
    .text(invoiceNumber, PAGE_MARGIN, 56, { width: pageWidth, align: "right" })
    .text(new Date().toLocaleString(), PAGE_MARGIN, 70, {
      width: pageWidth,
      align: "right",
    });

  doc.y = 140;
}

function drawPartiesBlock(doc, order, user, pageWidth) {
  const startY = doc.y;
  const colWidth = pageWidth / 2;

  // Bill To
  doc
    .font(FONT_BOLD)
    .fontSize(10)
    .fillColor(COLORS.muted)
    .text("BILL TO", PAGE_MARGIN, startY);

  doc
    .font(FONT_BOLD)
    .fontSize(12)
    .fillColor(COLORS.text)
    .text(user.name, PAGE_MARGIN, startY + 14);

  doc
    .font(FONT_REGULAR)
    .fontSize(10)
    .fillColor(COLORS.muted)
    .text(user.email, PAGE_MARGIN, startY + 30);

  // Order Info (right column)
  const rightX = PAGE_MARGIN + colWidth;

  doc
    .font(FONT_BOLD)
    .fontSize(10)
    .fillColor(COLORS.muted)
    .text("ORDER DETAILS", rightX, startY, { width: colWidth, align: "right" });

  doc
    .font(FONT_REGULAR)
    .fontSize(10)
    .fillColor(COLORS.text)
    .text(`Order ID: ${order._id}`, rightX, startY + 14, {
      width: colWidth,
      align: "right",
    })
    .fillColor(COLORS.muted)
    .text(`Transaction: ${order.transactionId}`, rightX, startY + 28, {
      width: colWidth,
      align: "right",
    });

  doc.y = startY + 60;

  // divider
  doc
    .moveTo(PAGE_MARGIN, doc.y)
    .lineTo(PAGE_MARGIN + pageWidth, doc.y)
    .strokeColor(COLORS.border)
    .lineWidth(1)
    .stroke();

  doc.moveDown(1.5);
}

function drawItemsTable(doc, order, pageWidth) {
  const colTitle = { x: PAGE_MARGIN, w: pageWidth * 0.5 };
  const colQty = { x: colTitle.x + colTitle.w, w: pageWidth * 0.15 };
  const colPrice = { x: colQty.x + colQty.w, w: pageWidth * 0.17 };
  const colLineTotal = { x: colPrice.x + colPrice.w, w: pageWidth * 0.18 };

  const rowHeight = 28;
  let y = doc.y;

  // Table header
  doc.rect(PAGE_MARGIN, y, pageWidth, rowHeight).fill(COLORS.primary);
  doc.fillColor(COLORS.white).font(FONT_BOLD).fontSize(10);
  doc.text("BOOK TITLE", colTitle.x + 10, y + 9, { width: colTitle.w - 10 });
  doc.text("QTY", colQty.x, y + 9, { width: colQty.w, align: "center" });
  doc.text("PRICE", colPrice.x, y + 9, { width: colPrice.w, align: "right" });
  doc.text("TOTAL", colLineTotal.x, y + 9, {
    width: colLineTotal.w - 10,
    align: "right",
  });

  y += rowHeight;

  // Table rows
  doc.font(FONT_REGULAR).fontSize(10);

  order.items.forEach((item, idx) => {
    const lineTotal = (item.price || 0) * (item.quantity || 1);

    // alternate row background
    if (idx % 2 === 1) {
      doc.rect(PAGE_MARGIN, y, pageWidth, rowHeight).fill(COLORS.rowAlt);
    }

    doc.font(FONT_REGULAR).fillColor(COLORS.text);
    doc.text(item.book.title, colTitle.x + 10, y + 9, {
      width: colTitle.w - 20,
      ellipsis: true,
    });
    doc.text(String(item.quantity), colQty.x, y + 9, {
      width: colQty.w,
      align: "center",
    });
    doc.text(`${item.price} BDT`, colPrice.x, y + 9, {
      width: colPrice.w,
      align: "right",
    });
    doc.text(`${lineTotal} BDT`, colLineTotal.x, y + 9, {
      width: colLineTotal.w - 10,
      align: "right",
    });

    y += rowHeight;

    // page break safety
    if (y > doc.page.height - 200) {
      doc.addPage();
      y = PAGE_MARGIN;
    }
  });

  // bottom border of table
  doc
    .moveTo(PAGE_MARGIN, y)
    .lineTo(PAGE_MARGIN + pageWidth, y)
    .strokeColor(COLORS.border)
    .lineWidth(1)
    .stroke();

  doc.y = y + 20;
}

function drawTotals(doc, order, pageWidth) {
  const boxWidth = 220;
  const boxX = PAGE_MARGIN + pageWidth - boxWidth;
  let y = doc.y;

  const lineGap = 20;
  const subtotal = order.totalAmount || 0;
  const discount = order.discountAmount || 0;
  const total = order.finalAmount || order.totalAmount;

  function row(label, value, opts = {}) {
    doc
      .font(opts.bold ? FONT_BOLD : FONT_REGULAR)
      .fontSize(opts.size || 10)
      .fillColor(opts.color || COLORS.text)
      .text(label, boxX, y, { width: boxWidth - 90 })
      .text(value, boxX + boxWidth - 90, y, {
        width: 90,
        align: "right",
      });
    y += lineGap;
  }

  row("Subtotal", `${subtotal} BDT`, { color: COLORS.muted });
  row("Discount", `- ${discount} BDT`, { color: COLORS.muted });

  // divider
  doc
    .moveTo(boxX, y)
    .lineTo(boxX + boxWidth, y)
    .strokeColor(COLORS.border)
    .stroke();
  y += 8;

  row("Total Paid", `${total} BDT`, {
    bold: true,
    size: 13,
    color: COLORS.primary,
  });

  doc.y = y + 20;
}

function drawFooter(doc, order, pageWidth) {
  const y = doc.page.height - 90;

  doc
    .moveTo(PAGE_MARGIN, y)
    .lineTo(PAGE_MARGIN + pageWidth, y)
    .strokeColor(COLORS.border)
    .stroke();

  doc
    .font(FONT_REGULAR)
    .fontSize(9)
    .fillColor(COLORS.muted)
    .text(
      "Thank you for shopping with E-Booi. This is a system-generated invoice.",
      PAGE_MARGIN,
      y + 12,
      { width: pageWidth, align: "center" },
    )
    
}

module.exports = generateInvoice;