const multer = require("multer");
const { cloudinary, ROOT_FOLDER } = require("../../utils/cloudinary");

// Cloudinary's free/base plan rejects any single-request upload over
// ~10MB ("File size too large. Got X. Maximum is 10485760.") no matter
// what limit we set on our own multer instance. Cover images are always
// small enough to stay under that with the plain upload_stream API, but
// book PDFs can legitimately be much bigger — so PDFs go up through
// Cloudinary's "large" (chunked) upload API instead, which streams the
// file in pieces and isn't subject to that per-request cap.
class CloudinaryBookStorage {
  _handleFile(req, file, cb) {
    let options;

    if (file.fieldname === "coverImage") {
      options = {
        folder: `${ROOT_FOLDER}/books/covers`,
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png"],
      };
    } else if (file.fieldname === "pdfFile") {
      options = {
        folder: `${ROOT_FOLDER}/books/pdfs`,
        resource_type: "raw",
        // Cloudinary strips/ignores the original extension for raw
        // uploads by default — setting format explicitly keeps the
        // delivered URL ending in .pdf instead of the bare public_id.
        format: "pdf",
      };
    } else {
      return cb(new Error("Invalid upload field"));
    }

    // NOTE: the chunked/streaming large-upload function in this SDK is
    // called `upload_chunked_stream` — there is no `upload_large_stream`
    // export (that name only exists for the path-based `upload_large`).
    const uploadFn =
      file.fieldname === "pdfFile"
        ? cloudinary.uploader.upload_chunked_stream
        : cloudinary.uploader.upload_stream;

    const uploadStream = uploadFn(options, (error, result) => {
      if (error) return cb(error);

      // Multer stores whatever we hand back here onto req.files.*[0] —
      // `.path` (secure_url) and `.filename` (public_id) match what the
      // rest of the app already expects from multer-storage-cloudinary.
      cb(null, {
        path: result.secure_url,
        filename: result.public_id,
        size: result.bytes,
      });
    });

    file.stream.pipe(uploadStream);
  }

  _removeFile(req, file, cb) {
    const resourceType = file.fieldname === "pdfFile" ? "raw" : "image";

    cloudinary.uploader.destroy(
      file.filename,
      { resource_type: resourceType },
      (error) => cb(error),
    );
  }
}

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
  storage: new CloudinaryBookStorage(),

  fileFilter,

  limits: {
    // Book PDFs can legitimately be large (scanned/illustrated books,
    // long novels, etc.), so this ceiling is generous — 200MB. Cover
    // images are always small in practice and share this same limit
    // since multer only supports one fileSize cap per instance.
    fileSize: 200 * 1024 * 1024,
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
