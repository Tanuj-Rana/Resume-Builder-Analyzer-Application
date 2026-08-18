const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { parseResume } = require("../services/parser");
const { analyzeResumeStructure } = require("../services/scoring");
const { analyzeResumeWithAI } = require("../services/ai_helper");

const router = express.Router();


// ======================================================
// UPLOAD DIRECTORY
// ======================================================

const uploadDir = path.join(__dirname, "..", "uploads");

// Make sure uploads directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

console.log("📂 Upload directory:", uploadDir);


// ======================================================
// MULTER STORAGE
// ======================================================

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },

    filename: function (req, file, cb) {

        const uniqueName =
            Date.now() + "-" + file.originalname;

        cb(null, uniqueName);
    }

});


// ======================================================
// MULTER CONFIGURATION
// ======================================================

const upload = multer({

    storage: storage,

    limits: {
        fileSize: 10 * 1024 * 1024
    },

    fileFilter: function (req, file, cb) {

        const allowedTypes = [

            "application/pdf",

            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

            "text/plain"

        ];

        if (allowedTypes.includes(file.mimetype)) {

            cb(null, true);

        } else {

            cb(
                new Error(
                    "Only PDF, DOCX, and TXT files are allowed."
                )
            );

        }

    }

});


// ======================================================
// ANALYZE RESUME
// POST /api/analyzer/analyze
// ======================================================

router.post(
    "/analyze",
    upload.single("resume"),

    async (req, res) => {

        console.log("\n====================================");
        console.log("🔥 ANALYZE ROUTE HIT");
        console.log("====================================");


        try {

            // ==================================================
            // CHECK FILE
            // ==================================================

            if (!req.file) {

                console.log("❌ No file received");

                return res.status(400).json({

                    success: false,

                    error: "Resume file is required."

                });

            }


            console.log("✅ Resume received:");
            console.log("   Original name:", req.file.originalname);
            console.log("   Saved name:", req.file.filename);
            console.log("   File path:", req.file.path);
            console.log("   Absolute path:", path.resolve(req.file.path));
            console.log("   Size:", req.file.size);


            // ==================================================
            // STEP 1 — PARSE RESUME
            // ==================================================

            console.log("\n📖 STEP 1: Parsing resume...");


            const resumeText =
                await parseResume(req);


            if (!resumeText) {

                console.log(
                    "❌ Parser returned empty text"
                );

                return res.status(400).json({

                    success: false,

                    error:
                        "Could not extract text from resume."

                });

            }


            console.log(
                "✅ Resume parsed successfully"
            );

            console.log(
                "📝 Characters extracted:",
                resumeText.length
            );


            // ==================================================
            // STEP 2 — DETERMINISTIC ATS ANALYSIS
            // ==================================================

            console.log(
                "\n🔍 STEP 2: Running ATS structure analysis..."
            );


            const structureAnalysis =
                analyzeResumeStructure(
                    resumeText
                );


            console.log(
                "✅ Structure analysis completed"
            );


            // ==================================================
            // STEP 3 — GEMINI AI ANALYSIS
            // ==================================================

            console.log(
                "\n🧠 STEP 3: Sending resume to Gemini..."
            );


            const aiAnalysis =
                await analyzeResumeWithAI(
                    resumeText,
                    structureAnalysis
                );


            console.log(
                "✅ Gemini analysis completed"
            );


            // ==================================================
            // STEP 4 — SEND RESPONSE
            // ==================================================

            console.log(
                "\n📤 STEP 4: Sending ATS result..."
            );


            return res.status(200).json({

                success: true,

                data: {

                    ...aiAnalysis,

                    technicalChecks:
                        structureAnalysis

                }

            });


        }

        catch (error) {

            console.error(
                "\n❌ ATS ANALYSIS ERROR"
            );

            console.error(
                "Message:",
                error.message
            );

            console.error(
                "Stack:",
                error.stack
            );


            return res.status(500).json({

                success: false,

                error:
                    "Unable to analyze resume.",

                details:
                    error.message

            });

        }

    }
);


module.exports = router;