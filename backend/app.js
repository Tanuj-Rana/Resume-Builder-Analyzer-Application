const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth_routes');

const resumeRoutes = require('./routes/resume_routes');

const app = express();

app.use(cors()); 

app.use(express.json()); 


app.get('/health', (req, res) => {
    res.status(200).json({ status: 'Server is running normally' });
});

app.use('/api/auth', authRoutes); 

app.use('/', resumeRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 ResumeAI Backend running on http://localhost:${PORT}`);
});

const aiRoutes = require('./routes/ai_routes');
const jdMatchRoutes = require('./routes/jd_match_routes');

app.use('/api/ai', aiRoutes);
app.use('/api', jdMatchRoutes);