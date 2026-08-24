const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Base folder every eBooi asset lives under in the Cloudinary media
// library, so it's easy to find/manage things there without digging
// through an account that might hold other projects' assets too.
const ROOT_FOLDER = "ebooi";

// Deletes one asset from Cloudinary by its public_id. Safe to call with
// a missing/null publicId (e.g. a record that predates this migration,
// or a rollback where nothing was actually uploaded) — it just no-ops.
// resourceType must match what the asset was uploaded as: "image" for
// covers/avatars, "raw" for PDFs.
async function destroyAsset(publicId, resourceType = "image") {
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true,
    });
  } catch (err) {
    // Cleanup failing should never take down the request that triggered
    // it (a book update, a delete, an avatar change) — log and move on.
    // A stray orphaned asset in Cloudinary is a cosmetic cost; a failed
    // book update because Cloudinary hiccuped is not.
    console.error(
      `Cloudinary cleanup failed for ${resourceType} ${publicId}:`,
      err.message,
    );
  }
}

module.exports = {
  cloudinary,
  ROOT_FOLDER,
  destroyAsset,
};
