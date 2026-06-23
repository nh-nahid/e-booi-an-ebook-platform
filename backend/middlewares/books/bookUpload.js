const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination(req, file, cb) {
        if (file.fieldname === "coverImage") {
            cb(null, "./public/uploads/books");
        } else {
            cb(null, "./public/uploads/pdfs");
        }
    },

    filename(req, file, cb) {
        cb(
            null,
            file.fieldname +
                "-" +
                Date.now() +
                path.extname(file.originalname)
        );
    },
});

function fileFilter(req, file, cb) {
    if (file.fieldname === "coverImage") {
        if (
            file.mimetype === "image/jpeg" ||
            file.mimetype === "image/png"
        ) {
            cb(null, true);
        } else {
            cb(new Error("Only JPG and PNG allowed."));
        }
    }

    if (file.fieldname === "pdfFile") {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDF allowed."));
        }
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
    { name: "coverImage", maxCount: 1 },
    { name: "pdfFile", maxCount: 1 },
]);