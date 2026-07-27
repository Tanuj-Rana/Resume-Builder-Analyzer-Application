const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json()); 

// Basic test route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'Server is running normally' });
});

// --- NEW CODE: Attach the Auth Routes ---
const authRoutes = require('./routes/auth_routes');
app.use('/api/auth', authRoutes); 
// Every route inside auth_routes.js now starts with /api/auth
// Example: /api/auth/login and /api/auth/register

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 ResumeAI Backend running on http://localhost:${PORT}`);
});