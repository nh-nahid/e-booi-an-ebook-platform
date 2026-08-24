const multer = require("multer");
const createError = require("http-errors");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { cloudinary, ROOT_FOLDER } = require("./cloudinary");

// Generic single/any-file Cloudinary uploader. Kept as a factory (same
// shape as before the Cloudinary migration) so callers like avatarUpload.js
// don't need to change — only where the bytes end up changes.
//
// The uploaded file object (req.files[0], since avatarUpload calls
// upload.any()) carries `.path` (the Cloudinary secure_url) and
// `.filename` (the Cloudinary public_id) after this runs.
function uploader(subfolder_path, allowed_file_types, max_file_size, error_msg) {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `${ROOT_FOLDER}/${subfolder_path}`,
      resource_type: "image",
    },
  });

  const upload = multer({
    storage: storage,
    limits: {
      fileSize: max_file_size,
    },
    fileFilter: (req, file, cb) => {
      if (allowed_file_types.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(createError(error_msg));
      }
    },
  });

  return upload;
}

module.exports = uploader;
