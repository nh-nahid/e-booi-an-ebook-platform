const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { cloudinary, ROOT_FOLDER } = require("../../utils/cloudinary");

// Cover images go up as "image" assets (Cloudinary can transform/optimize
// these); PDFs go up as "raw" assets — Cloudinary only serves non-image
// files (pdf, zip, etc.) as "raw", and trying to store a PDF as "image"
// either fails or gets it treated as an image conversion target.
const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    if (file.fieldname === "coverImage") {
      return {
        folder: `${ROOT_FOLDER}/books/covers`,
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png"],
      };
    }

    if (file.fieldname === "pdfFile") {
      return {
        folder: `${ROOT_FOLDER}/books/pdfs`,
        resource_type: "raw",
        // Cloudinary strips/ignores the original extension for raw
        // uploads by default — setting format explicitly keeps the
        // delivered URL ending in .pdf instead of the bare public_id.
        format: "pdf",
      };
    }

    throw new Error("Invalid upload field");
  },
});

function fileFilter(req, file, cb) {
  if (file.fieldname === "coverImage") {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Only JPG and PNG images allowed"));
    }
  } else if (file.fieldname === "pdfFile") {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files allowed"));
    }
  } else {
    cb(new Error("Invalid file field"));
  }
}

const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

// After this runs, each uploaded file (req.files.coverImage[0] /
// req.files.pdfFile[0]) carries `.path` (the Cloudinary secure_url — what
// gets stored as coverImage/pdfFile) and `.filename` (the Cloudinary
// public_id — what gets stored as coverImagePublicId/pdfFilePublicId, the
// handle needed to delete the asset later).
module.exports = upload.fields([
  {
    name: "coverImage",
    maxCount: 1,
  },
  {
    name: "pdfFile",
    maxCount: 1,
  },
]);
