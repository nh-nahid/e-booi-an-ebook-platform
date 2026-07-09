const multer = require("multer");
const path = require("path");
const fs = require("fs");

function createFolder(folder) {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, {
      recursive: true,
    });
  }
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    let uploadPath;

    if (file.fieldname === "coverImage") {
      uploadPath = "./public/uploads/books";
    } else if (file.fieldname === "pdfFile") {
      uploadPath = "./public/uploads/pdfs";
    } else {
      return cb(new Error("Invalid upload field"));
    }

    createFolder(uploadPath);

    cb(null, uploadPath);
  },

  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`,
    );
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
