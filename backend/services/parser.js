const fs = require("fs"); //file system
const path = require("path");
const pdf = require("pdf-parse");

async function parseResume(req) {
    const filePath = path.join(__dirname, "..", req.file.path);
    const buffer = fs.readFileSync(filePath);
    const data = await pdf(buffer);
    const extractedText = data.text;

    console.log("\n====================================");
    console.log("RESUME TEXT");
    console.log("====================================\n");
    console.log(extractedText);

    return extractedText;
}

module.exports = {
    parseResume
};