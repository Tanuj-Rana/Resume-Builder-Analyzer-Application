const { GoogleGenAI } = require("@google/genai");

const client = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

// ========================================
// ATS JSON Schema
// ========================================
const ATS_SCHEMA = {
    type: "object",
    additionalProperties: false,
    properties: {
        overallScore: { type: "integer" },
        contentScore: { type: "integer" },
        sectionScore: { type: "integer" },
        structureScore: { type: "integer" },
        keywordScore: { type: "integer" },
        summary: { type: "string" },
        strengths: { type: "array", items: { type: "string" } },
        weaknesses: { type: "array", items: { type: "string" } },
        missingKeywords: { type: "array", items: { type: "string" } },
        detectedSkills: { type: "array", items: { type: "string" } },
        suggestions: {
            type: "array",
            items: {
                type: "object",
                additionalProperties: false,
                properties: {
                    priority: { type: "string", enum: ["high", "medium", "low"] },
                    issue: { type: "string" },
                    recommendation: { type: "string" }
                },
                required: ["priority", "issue", "recommendation"]
            }
        }
    },
    required: [
        "overallScore", "contentScore", "sectionScore", "structureScore",
        "keywordScore", "summary", "strengths", "weaknesses",
        "missingKeywords", "detectedSkills", "suggestions"
    ]
};

// ========================================
// 1. AI ATS ANALYSIS (For ATS Tab)
// ========================================
async function analyzeResumeWithAI(resumeText, deterministicAnalysis) {
    console.log("🤖 Starting Gemini ATS analysis...");

    const systemPrompt = `
You are an expert ATS resume analyzer, technical recruiter and career coach.
Analyze resumes using realistic ATS compatibility principles.
IMPORTANT RULES:
1. Do not invent information.
2. Do not assume the candidate has skills that are not present.
3. Scores must be integers from 0 to 100.
4. Return ONLY valid JSON matching the provided schema.
`;

    const userPrompt = `
Analyze the following resume.
========================
RESUME
========================
${resumeText}

========================
DETERMINISTIC ATS CHECKS
========================
${JSON.stringify(deterministicAnalysis, null, 2)}

Identify strengths, weaknesses, missing keywords, and actionable improvements.
Return the result using the required JSON schema.
`;

    try {
        console.log("🧠 Sending resume to Gemini...");
        const response = await client.models.generateContent({
            model: "gemini-3.5-flash-lite", // Fallback to gemini-2.5-flash if 3.5 is unavailable
            contents: `${systemPrompt}\n\n${userPrompt}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: ATS_SCHEMA
            }
        });

        console.log("✅ Gemini ATS JSON parsed successfully.");
        return JSON.parse(response.text);
    } catch (error) {
        console.error("❌ GEMINI ATS ERROR:", error.message);
        throw error;
    }
}

// ========================================
// 2. AI GENERAL PROMPT (For JD Matcher & Builder)
// ========================================
async function generateAIResponse(prompt) {
    try {
        console.log("🧠 Sending JD Match / General Prompt to Gemini...");
        
        const response = await client.models.generateContent({
            model: "gemini-3.5-flash-lite", // Fallback to gemini-2.5-flash if 3.5 is unavailable
            contents: prompt,
            config: {
                responseMimeType: "application/json" // Forces valid JSON output
            }
        });
        
        console.log("✅ Gemini generated response successfully.");
        return response.text; 
    } catch (error) {
        console.error("❌ GEMINI ERROR in generateAIResponse:", error.message);
        throw error;
    }
}

// ========================================
// EXPORT BOTH FUNCTIONS
// ========================================
module.exports = {
    analyzeResumeWithAI,
    generateAIResponse
};