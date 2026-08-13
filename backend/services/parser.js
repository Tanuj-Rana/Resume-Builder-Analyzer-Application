const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse"); // Correct standard import
const mammoth = require("mammoth");

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

/**
 * Extract plain text from an uploaded resume (PDF, DOCX, TXT).
 */
async function parseResume(req) {
    if (!req || !req.file) {
        throw new Error("Resume file information is missing");
    }

    // Safely construct the path to the uploaded file
    const filePath = path.join(__dirname, "..", req.file.path);
    const originalName = req.file.originalname;
    const extension = path.extname(originalName).toLowerCase();

    try {
        let rawText = "";

        // ==============================
        // PDF
        // ==============================
        if (extension === ".pdf") {
            console.log("📄 Parsing PDF...");
            const buffer = fs.readFileSync(filePath);
            const data = await pdf(buffer);
            rawText = data.text;
            console.log("✅ PDF parsed successfully.");
        }

        // ==============================
        // DOCX
        // ==============================
        else if (extension === ".docx") {
            console.log("📄 Parsing DOCX...");
            const result = await mammoth.extractRawText({ path: filePath });
            rawText = result.value;
            console.log("✅ DOCX parsed successfully.");
        }

        // ==============================
        // TXT
        // ==============================
        else if (extension === ".txt") {
            console.log("📄 Reading TXT...");
            rawText = fs.readFileSync(filePath, "utf8");
            console.log("✅ TXT parsed successfully.");
        }

        else {
            throw new Error(`Unsupported resume format: ${extension}`);
        }

        const cleanedText = cleanText(rawText);

        console.log("\n====================================");
        console.log("RESUME TEXT PARSED");
        console.log("====================================\n");

        return cleanedText;

    } finally {
        // Remove temporary uploaded file to keep the server clean
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log("🗑️ Temporary resume file removed.");
        }
    }
}

module.exports = {
    parseResume
};