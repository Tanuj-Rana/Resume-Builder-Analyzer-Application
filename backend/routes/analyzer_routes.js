const express = require("express");
const multer = require("multer");
const path = require("path");

const {
    extractResumeText
} = require("../services/parser");

const {
    analyzeResumeStructure
} = require("../services/scoring");

const {
    analyzeResumeWithAI
} = require("../services/ai_helper");


const router = express.Router();


// ========================================
// TEMPORARY UPLOAD DIRECTORY
// ========================================

const upload = multer({

    dest: path.join(
        __dirname,
        "../uploads"
    ),

    limits: {
        fileSize: 10 * 1024 * 1024
    }

});


// ========================================
// POST /api/analyzer/analyze
// ========================================

router.post(
    "/analyze",

    upload.single("resume"),

    async (req, res) => {

        console.log("🔥 ANALYZE ROUTE HIT");


        try {

            // ========================================
            // CHECK FILE
            // ========================================

            console.log("📁 Checking uploaded file...");

            if (!req.file) {

                console.log("❌ No resume file received.");

                return res.status(400).json({

                    success: false,

                    error: "Resume file is required."

                });

            }


            console.log(
                "✅ Resume received:",
                req.file.originalname
            );


            // ========================================
            // STEP 1: EXTRACT RESUME TEXT
            // ========================================

            console.log("📖 Starting resume text extraction...");


            const resumeText =
                await extractResumeText(
                    req.file.path,
                    req.file.originalname
                );


            console.log(
                "✅ Resume text extracted."
            );


            if (!resumeText) {

                console.log(
                    "❌ Resume text is empty."
                );

                return res.status(400).json({

                    success: false,

                    error:
                        "Could not extract text from resume."

                });

            }


            console.log(
                "📝 Extracted characters:",
                resumeText.length
            );


            // ========================================
            // STEP 2: ATS STRUCTURE ANALYSIS
            // ========================================

            console.log(
                "🔍 Starting ATS structure analysis..."
            );


            const structureAnalysis =
                analyzeResumeStructure(
                    resumeText
                );


            console.log(
                "✅ ATS structure analysis complete."
            );


            console.log(
                "📊 Structure analysis:",
                structureAnalysis
            );


            // ========================================
            // STEP 3: AI / LLM ANALYSIS
            // ========================================

            console.log(
                "🧠 Sending resume to AI..."
            );


            const aiAnalysis =
                await analyzeResumeWithAI(
                    resumeText,
                    structureAnalysis
                );


            console.log(
                "✅ AI analysis complete."
            );


            // ========================================
            // STEP 4: SEND RESULT TO FRONTEND
            // ========================================

            console.log(
                "📤 Sending ATS result..."
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
                "❌ ATS ANALYSIS ERROR:"
            );

            console.error(error);


            return res.status(500).json({

                success: false,

                error:
                    "Unable to analyze resume.",

                // TEMPORARY:
                // Helps us see the real error
                // during development.

                details:
                    error.message

            });

        }

    }
);


module.exports = router;