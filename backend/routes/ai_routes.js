const express = require('express');
const router = express.Router();
const { generateAIResponse } = require('../services/ai_helper'); 

router.post('/agents/jd_matcher', async (req, res) => {
  const { resume_text, job_description } = req.body;

  if (!resume_text || !job_description) {
    return res.status(400).json({ error: "Missing resume or job description" });
  }

  const prompt = `
    You are an expert ATS software. 
    Analyze this Resume against the Job Description.
    Resume: ${resume_text}
    Job Description: ${job_description}
    Respond ONLY with valid JSON matching this schema:
    {
      "score": 85,
      "matched": ["Keyword1"],
      "missing": ["Keyword2"],
      "recommendations": ["Tip 1"]
    }
  `;

  try {
    const aiText = await generateAIResponse(prompt);
    const cleanedText = aiText.replace(/```json/gi, '').replace(/```/g, '').trim();
    res.json(JSON.parse(cleanedText));
  } catch (error) {
    res.status(500).json({ error: "Failed to generate AI analysis." });
  }
});

module.exports = router; // <-- This is what prevents the crash