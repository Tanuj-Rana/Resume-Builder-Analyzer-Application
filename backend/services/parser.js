const fs = require("fs");
const path = require("path");
const { PDFParse } = require("pdf-parse");
const mammoth = require("mammoth");

/**
 * Extract plain text from an uploaded resume.
 *
 * Supported:
 * PDF
 * DOCX
 * TXT
 */
async function extractResumeText(filePath, originalName) {

    if (!filePath || !originalName) {
        throw new Error("Resume file information is missing");
    }

    const extension = path
        .extname(originalName)
        .toLowerCase();

    try {

        // ==============================
        // PDF
        // ==============================

        if (extension === ".pdf") {

            console.log("📄 Parsing PDF...");

            const buffer =
                fs.readFileSync(filePath);

            const parser =
                new PDFParse({
                    data: buffer
                });

            const result =
                await parser.getText();

            await parser.destroy();

            console.log("✅ PDF parsed successfully.");

            return cleanText(result.text);
        }


        // ==============================
        // DOCX
        // ==============================

        if (extension === ".docx") {

            console.log("📄 Parsing DOCX...");

            const result =
                await mammoth.extractRawText({
                    path: filePath
                });

            console.log("✅ DOCX parsed successfully.");

            return cleanText(result.value);
        }


        // ==============================
        // TXT
        // ==============================

        if (extension === ".txt") {

            console.log("📄 Reading TXT...");

            const text =
                fs.readFileSync(
                    filePath,
                    "utf8"
                );

            return cleanText(text);
        }


        throw new Error(
            `Unsupported resume format: ${extension}`
        );

    }

    finally {

        // Remove temporary uploaded file

        if (fs.existsSync(filePath)) {

            fs.unlinkSync(filePath);

            console.log(
                "🗑️ Temporary resume file removed."
            );
        }
    }
}


/**
 * Normalize extracted resume text.
 */
function cleanText(text) {

    if (!text) {
        return "";
    }

    return text
        .replace(/\r/g, "")
        .replace(/[ \t]+/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}


module.exports = {
    extractResumeText
};