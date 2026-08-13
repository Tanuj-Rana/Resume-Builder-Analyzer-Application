const express = require("express");
const multer = require("multer");
const path = require("path");

// 1. FIXED: Imported the correct function name from your unified parser
const { parseResume } = require("../services/parser");

const { analyzeResumeStructure } = require("../services/scoring");
const { analyzeResumeWithAI } = require("../services/ai_helper");

const router = express.Router();

// 2. FIXED: Replaced aggressive 'dest' with safe 'diskStorage' to stop EEXIST crash
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: function (req, file, cb) {
        // Ensure only supported documents get through
        if (file.mimetype === "application/pdf" || 
            file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || 
            file.mimetype === "text/plain") {
            cb(null, true);
        } else {
            cb(new Error("Only PDF, DOCX, and TXT files are allowed."));
        }
    }
});

router.post("/analyze", upload.single("resume"), async (req, res) => {
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

        console.log("✅ Resume received:", req.file.originalname);

        // ========================================
        // STEP 1: EXTRACT RESUME TEXT
        // ========================================
        console.log("📖 Starting resume text extraction...");

        // 3. FIXED: Using the unified parseResume function that handles extraction and cleanup
        const resumeText = await parseResume(req);

        console.log("✅ Resume text extracted.");

        if (!resumeText) {
            console.log("❌ Resume text is empty.");
            return res.status(400).json({
                success: false,
                error: "Could not extract text from resume."
            });
        }

        console.log("📝 Extracted characters:", resumeText.length);

        // ========================================
        // STEP 2: ATS STRUCTURE ANALYSIS
        // ========================================
        console.log("🔍 Starting ATS structure analysis...");

        const structureAnalysis = analyzeResumeStructure(resumeText);

        console.log("✅ ATS structure analysis complete.");
        console.log("📊 Structure analysis:", structureAnalysis);

        // ========================================
        // STEP 3: AI / LLM ANALYSIS
        // ========================================
        console.log("🧠 Sending resume to AI...");

        const aiAnalysis = await analyzeResumeWithAI(resumeText, structureAnalysis);

        console.log("✅ AI analysis complete.");

        // ========================================
        // STEP 4: SEND RESULT TO FRONTEND
        // ========================================
        console.log("📤 Sending ATS result...");

        return res.status(200).json({
            success: true,
            data: {
                ...aiAnalysis,
                technicalChecks: structureAnalysis
            }
        });

    } catch (error) {
        console.error("❌ ATS ANALYSIS ERROR:");
        console.error(error);

        return res.status(500).json({
            success: false,
            error: "Unable to analyze resume.",
            details: error.message
        });
    }
});

module.exports = router;