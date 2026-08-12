const {
    GoogleGenAI
} = require("@google/genai");


// ========================================
// Gemini Client
// ========================================

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

        overallScore: {
            type: "integer"
        },

        contentScore: {
            type: "integer"
        },

        sectionScore: {
            type: "integer"
        },

        structureScore: {
            type: "integer"
        },

        keywordScore: {
            type: "integer"
        },

        summary: {
            type: "string"
        },

        strengths: {

            type: "array",

            items: {
                type: "string"
            }

        },

        weaknesses: {

            type: "array",

            items: {
                type: "string"
            }

        },

        missingKeywords: {

            type: "array",

            items: {
                type: "string"
            }

        },

        detectedSkills: {

            type: "array",

            items: {
                type: "string"
            }

        },

        suggestions: {

            type: "array",

            items: {

                type: "object",

                additionalProperties: false,

                properties: {

                    priority: {

                        type: "string",

                        enum: [
                            "high",
                            "medium",
                            "low"
                        ]

                    },

                    issue: {
                        type: "string"
                    },

                    recommendation: {
                        type: "string"
                    }

                },

                required: [
                    "priority",
                    "issue",
                    "recommendation"
                ]

            }

        }

    },

    required: [

        "overallScore",
        "contentScore",
        "sectionScore",
        "structureScore",
        "keywordScore",
        "summary",
        "strengths",
        "weaknesses",
        "missingKeywords",
        "detectedSkills",
        "suggestions"

    ]

};


// ========================================
// AI ATS ANALYSIS
// ========================================

async function analyzeResumeWithAI(
    resumeText,
    deterministicAnalysis
) {

    console.log("🤖 Starting Gemini ATS analysis...");


    // ========================================
    // SYSTEM INSTRUCTIONS
    // ========================================

    const systemPrompt = `

You are an expert ATS resume analyzer,
technical recruiter and career coach.

Analyze resumes using realistic ATS
compatibility principles.

Evaluate:

- Resume structure
- Section completeness
- Contact information
- Professional summary
- Work experience
- Education
- Skills
- Projects
- Certifications
- Keywords
- Action verbs
- Quantifiable achievements
- Readability
- ATS compatibility
- Professional quality

IMPORTANT RULES:

1. Do not invent information.

2. Do not assume the candidate has skills
   that are not present.

3. Do not fabricate metrics.

4. Do not recommend adding a skill unless
   it is relevant to the resume or job context.

5. Distinguish between missing keywords
   and irrelevant keywords.

6. Give actionable recommendations.

7. Scores must be integers from 0 to 100.

8. The overall score must reflect the
   actual resume quality.

9. This is an ATS compatibility estimate,
   not a guarantee of an employer's ATS result.

10. Return ONLY valid JSON matching
    the provided schema.

`;


// ========================================
// USER PROMPT
// ========================================

    const userPrompt = `

Analyze the following resume.

========================
RESUME
========================

${resumeText}


========================
DETERMINISTIC ATS CHECKS
========================

${JSON.stringify(
    deterministicAnalysis,
    null,
    2
)}


Use the deterministic ATS checks
as supporting evidence.

Perform your own holistic evaluation
of the resume.

Identify:

- strengths
- weaknesses
- missing keywords
- detected skills
- ATS compatibility issues
- actionable improvements

Return the result using the required
JSON schema.

`;


// ========================================
// CALL GEMINI
// ========================================

    try {

        console.log(
            "🧠 Sending resume to Gemini..."
        );


        const response =
            await client.models.generateContent({

                model:
                    "gemini-3.5-flash-lite",

                contents:
                    `${systemPrompt}

${userPrompt}`,

                config: {

                    responseMimeType:
                        "application/json",

                    responseSchema:
                        ATS_SCHEMA

                }

            });


        console.log(
            "✅ Gemini response received."
        );


        // ========================================
        // Extract JSON
        // ========================================

        const result =
            JSON.parse(
                response.text
            );


        console.log(
            "✅ Gemini ATS JSON parsed successfully."
        );


        return result;

    }

    catch (error) {

        console.error(
            "❌ GEMINI ATS ERROR:"
        );

        console.error(
            "Status:",
            error.status
        );

        console.error(
            "Message:",
            error.message
        );

        throw error;

    }

}


// ========================================
// EXPORT
// ========================================

module.exports = {
    analyzeResumeWithAI
};