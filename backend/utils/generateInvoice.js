const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

async function generateInvoice(order, user) {
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

    const doc = new PDFDocument({
      margin: 50,
    });

    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    // Title
    doc.fontSize(22).text("E-Booi Invoice", {
      align: "center",
    });

    doc.moveDown();

    doc.fontSize(12);

    doc.text(`Invoice: ${invoiceNumber}`);
    doc.text(`Order ID: ${order._id}`);
    doc.text(`Date: ${new Date().toLocaleString()}`);

    doc.moveDown();

    doc.text(`Customer: ${user.name}`);
    doc.text(`Email: ${user.email}`);

    doc.moveDown();

    doc.text("Books");

    doc.moveDown(0.5);

    order.items.forEach((item) => {
      doc.text(
        `${item.book.title}
Qty: ${item.quantity}
Price: ${item.price} BDT`,
      );

      doc.moveDown();
    });

    doc.moveDown();

    doc.fontSize(14);

    doc.text(`Subtotal: ${order.totalAmount} BDT`);

    doc.text(`Discount: ${order.discountAmount || 0} BDT`);

    doc.text(`Total Paid: ${order.finalAmount || order.totalAmount} BDT`);

    doc.moveDown();

    doc.text(`Transaction ID: ${order.transactionId}`);

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

module.exports = generateInvoice;
