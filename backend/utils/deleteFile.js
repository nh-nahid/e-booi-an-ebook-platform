const fs = require("fs");
const path = require("path");

function deleteFile(filePath) {
    if (!filePath) return;

    const fullPath = path.join(
        process.cwd(),
        "public",
        filePath
    );

    fs.unlink(fullPath, (err) => {
        if (err) {
            console.log("File delete error:", err.message);
        }
    });
}

module.exports = deleteFile;