const express = require('express');
const router = express.Router();

// Mock database connection for local testing
// Replace this with your actual DB logic when ready
router.post('/compare', async (req, res) => {
  console.log("Comparison received by backend:", req.body.job_title);
  res.json({ message: 'Comparison saved successfully', comparison_id: 1 });
});

router.get('/history/:resume_id', (req, res) => {
  res.json([]);
});

module.exports = router; // <-- This prevents the crash