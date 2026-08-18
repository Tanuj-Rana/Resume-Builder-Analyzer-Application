const fs = require("fs");
const path = require("path");
const { PDFParse } = require("pdf-parse"); 
const mammoth = require("mammoth");


// ======================================================
// CLEAN TEXT
// ======================================================

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


// ======================================================
// PARSE RESUME
// ======================================================

async function parseResume(req) {

    if (!req || !req.file) {
        throw new Error("Resume file information is missing");
    }

    const filePath = req.file.path;
    const originalName = req.file.originalname;
    const extension = path.extname(originalName).toLowerCase();

    console.log("====================================");
    console.log("📄 RESUME PARSER STARTED");
    console.log("====================================");
    console.log("File:", originalName);
    console.log("Path:", filePath);
    console.log("Extension:", extension);


    try {

        // --------------------------------------------------
        // Check file exists
        // --------------------------------------------------

        if (!fs.existsSync(filePath)) {
            throw new Error(
                `Uploaded file does not exist: ${filePath}`
            );
        }


        let rawText = "";


        // ==================================================
        // PDF
        // ==================================================

        if (extension === ".pdf") {

            console.log("📄 Parsing PDF using PDFParse class...");

            const buffer = fs.readFileSync(filePath);

            console.log(
                "📦 PDF buffer size:",
                buffer.length
            );

            try {
                // Initialize the class properly based on your package version
                const parser = new PDFParse({
                    data: buffer
                });

                const result = await parser.getText();
                rawText = result.text || "";

                // Clean up parser resources if the method exists
                if (typeof parser.destroy === "function") {
                    await parser.destroy();
                }

            } catch (pdfError) {
                console.error("🚨 PDF Extraction Error:", pdfError);
                throw new Error("Class initialization failed: " + pdfError.message);
            }

            console.log("✅ PDF parsed successfully.");
        }


        // ==================================================
        // DOCX
        // ==================================================

        else if (extension === ".docx") {

            console.log("📄 Parsing DOCX...");

            const result =
                await mammoth.extractRawText({
                    path: filePath
                });

            rawText = result.value || "";

            console.log("✅ DOCX parsed successfully.");
        }


        // ==================================================
        // TXT
        // ==================================================

        else if (extension === ".txt") {

            console.log("📄 Reading TXT...");

            rawText =
                fs.readFileSync(
                    filePath,
                    "utf8"
                );

            console.log("✅ TXT parsed successfully.");
        }


        // ==================================================
        // UNSUPPORTED FORMAT
        // ==================================================

        else {

            throw new Error(
                `Unsupported resume format: ${extension}`
            );
        }


        // ==================================================
        // CLEAN EXTRACTED TEXT
        // ==================================================

        const cleanedText =
            cleanText(rawText);


        console.log(
            "📝 Extracted characters:",
            cleanedText.length
        );


        if (!cleanedText) {

            throw new Error(
                "No text could be extracted from the resume."
            );
        }


        console.log("✅ Resume parsing completed.");

        return cleanedText;

    }

    finally {

        // ==================================================
        // DELETE TEMPORARY UPLOAD
        // ==================================================

        try {

            if (fs.existsSync(filePath)) {

                fs.unlinkSync(filePath);

                console.log(
                    "🗑️ Temporary resume file removed."
                );
            }

        } catch (deleteError) {

            console.error(
                "⚠️ Could not delete uploaded file:",
                deleteError.message
            );
        }
    }
}


module.exports = {
    parseResume
};