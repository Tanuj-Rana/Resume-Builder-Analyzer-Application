const express = require("express");
const multer = require("multer");

const { parseResume } = require("../services/parser");

const router = express.Router();

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
    fileFilter: function (req, file, cb) {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        }
        else {
            cb(new Error("Only PDF files are allowed."));
        }
    }
});

router.post("/upload", upload.single("resume"), async (req, res) => {

    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded."
            });
        }

        const extractedText = await parseResume(req);

        res.json({
            success: true,
            resumeText: extractedText
        });
    }
    catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }

});

module.exports = router;