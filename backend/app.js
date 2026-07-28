const express = require("express");
const cors = require("cors");

const resumeRoutes = require("./routes/resume_routes");

const app = express();

app.use(cors());

app.use("/", resumeRoutes);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});