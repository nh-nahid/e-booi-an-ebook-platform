// Diagnostic — lists every "raw" (PDF) asset actually sitting in this
// project's Cloudinary folder, regardless of what any Book document's
// pdfFile field currently says. Read-only — does not touch Cloudinary or
// the database.
//
// Why: find-broken-pdfs.js showed every Digital book's pdfFile field
// holding a bogus "pdfFile-<timestamp>.pdf" value instead of a Cloudinary
// secure_url. Before assuming every book's PDF has to be re-uploaded by
// hand, it's worth checking whether the *original* uploaded files are
// still sitting in Cloudinary under this project's folder — only the DB
// reference to them may have been lost/overwritten, not the files
// themselves. If they're still there, matching each by its created_at
// (and byte size, if you remember roughly how big each book's PDF is)
// against when each book was first added can let us restore the correct
// secure_url directly, with no re-upload needed.
//
// Run from the backend folder, with a working DB connection is NOT
// required — only CLOUDINARY_* in .env:
//   node scripts/list-cloudinary-pdfs.js

require("dotenv").config();
const { cloudinary, ROOT_FOLDER } = require("../utils/cloudinary");

async function run() {
  const prefix = `${ROOT_FOLDER}/books/pdfs/`;

  console.log(`Listing raw assets under "${prefix}" ...\n`);

  const result = await cloudinary.api.resources({
    type: "upload",
    resource_type: "raw",
    prefix,
    max_results: 500,
  });

  if (!result.resources.length) {
    console.log(
      "No raw assets found under this prefix — the original PDFs do not " +
        "appear to still be in Cloudinary. Each book's PDF will need to be " +
        "re-uploaded through the admin panel.",
    );
  } else {
    console.log(`Found ${result.resources.length} raw asset(s):\n`);

    result.resources
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      .forEach((r) => {
        const kb = (r.bytes / 1024).toFixed(1);
        console.log(
          `- ${r.public_id}\n    created: ${r.created_at}  size: ${kb} KB\n    url: ${r.secure_url}\n`,
        );
      });
  }

  if (result.next_cursor) {
    console.log(
      "(More than 500 results exist — re-run with a next_cursor param if needed.)",
    );
  }
}

run().catch((error) => {
  console.error("Listing failed:", error);
  process.exit(1);
});
