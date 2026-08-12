const express = require("express");
const cors = require("cors");
require("dotenv").config();
console.log(
    "Gemini API key loaded:",
    !!process.env.GEMINI_API_KEY
);
const authRoutes =
    require("./routes/auth_routes");

const resumeRoutes =
    require("./routes/resume_routes");

const analyzerRoutes =
    require("./routes/analyzer_routes");


const app = express();

app.use(cors());

app.use(
    express.json({
        limit: "10mb"
    })
);


app.get("/health", (req, res) => {

    res.status(200).json({
        status: "Server is running normally"
    });

});


app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/analyzer",
    analyzerRoutes
);

app.use(
    "/",
    resumeRoutes
);


const PORT =
    process.env.PORT || 3000;


app.listen(PORT, () => {

    console.log(
        `🚀 ResumeAI Backend running on http://localhost:${PORT}`
    );

});