const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Helpful console log to verify your .env file is working locally
console.log("Gemini API key loaded:", !!process.env.GEMINI_API_KEY);

// ==========================================
// 1. IMPORT ROUTES
// ==========================================
const authRoutes = require("./routes/auth_routes");
const resumeRoutes = require("./routes/resume_routes");
const analyzerRoutes = require("./routes/analyzer_routes");
const aiRoutes = require("./routes/ai_routes");
const jdMatchRoutes = require("./routes/jd_match_routes");

const app = express();

// ==========================================
// 2. MIDDLEWARE
// ==========================================
app.use(cors());
// Increased limit to 10mb to handle large PDF uploads
app.use(express.json({ limit: "10mb" })); 

// ==========================================
// 3. REGISTER ROUTES
// ==========================================
// Health check route
app.get("/health", (req, res) => {
    res.status(200).json({ status: "Server is running normally" });
});

// Feature routes
app.use("/api/auth", authRoutes);
app.use("/api/analyzer", analyzerRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api", jdMatchRoutes);
app.use("/", resumeRoutes);

// ==========================================
// 4. START SERVER
// ==========================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 ResumeAI Backend running on http://localhost:${PORT}`);
});