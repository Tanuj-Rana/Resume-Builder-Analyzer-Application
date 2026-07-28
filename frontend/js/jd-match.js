//console.log("compare.js loaded");//compare.js

const techDictionary = {
    // Programming Languages
    "c++": "cpp",
    "c#": "csharp",
    "f#": "fsharp",

    // .NET
    ".net": "dotnet",
    ".net core": "dotnetcore",
    ".net framework": "dotnetframework",
    "asp.net": "aspnet",
    "asp.net core": "aspnetcore",
    "vb.net": "vbnet",
    "ado.net": "adonet",
    "entity framework": "entityframework",
    "entity framework core": "efcore",

    // JavaScript Ecosystem
    "node.js": "nodejs",
    "next.js": "nextjs",
    "nuxt.js": "nuxtjs",
    "vue.js": "vuejs",
    "express.js": "expressjs",
    "nest.js": "nestjs",
    "svelte.js": "sveltejs",
    "react native": "reactnative",

    // CSS
    "tailwind css": "tailwindcss",
    "material ui": "mui",
    "material-ui": "mui",
    "bootstrap 5": "bootstrap",

    // Databases
    "mongo db": "mongodb",
    "sql server": "mssql",
    "ms sql": "mssql",
    "postgresql": "postgres",
    "mysql server": "mysql",

    // Cloud
    "amazon web services": "aws",
    "google cloud platform": "gcp",
    "microsoft azure": "azure",

    // DevOps
    "k8s": "kubernetes",
    "docker compose": "dockercompose",
    "github actions": "githubactions",
    "azure devops": "azuredevops",

    // APIs
    "rest api": "restapi",
    "restful api": "restapi",
    "soap api": "soapapi",

    // AI / ML
    "machine learning": "machinelearning",
    "deep learning": "deeplearning",
    "natural language processing": "nlp",
    "large language models": "llm",
    "artificial intelligence": "ai",

    // Testing
    "unit testing": "unittesting",
    "integration testing": "integrationtesting",
    "end to end testing": "e2etesting",

    // Methodologies
    "test driven development": "tdd",
    "behavior driven development": "bdd",
    "continuous integration": "ci",
    "continuous deployment": "cd",

    // Operating Systems
    "mac os": "macos",
    "macos": "macos",
    "windows server": "windowsserver",

    // Miscellaneous
    "visual studio code": "vscode",
    "visual studio": "visualstudio",
    "android studio": "androidstudio",
    "intellij idea": "intellij",
    "pycharm": "pycharm"
};

function normalizeTechTerms(text) {
    for (const [key, value] of Object.entries(techDictionary)) {
        const regex = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
        text = text.replace(regex, value);
    }
    return text;
}

// Compare Resume with Job Description
function compareResume(resumeText, jobDescription) {

    // Comparison logic

    // Convert both texts to lowercase
    resumeText = resumeText.toLowerCase();
    jobDescription = jobDescription.toLowerCase();

    // Normalize technology names
    resumeText = normalizeTechTerms(resumeText);
    jobDescription = normalizeTechTerms(jobDescription);

    // Remove punctuation
    resumeText = resumeText.replace(/[^\w\s]/g, "");
    jobDescription = jobDescription.replace(/[^\w\s]/g, "");

    // Convert both texts into arrays
    let resumeArray = resumeText.split(/\s+/);
    let jobDescriptionArray = jobDescription.split(/\s+/);

    // Remove duplicate words
    resumeArray = [...new Set(resumeArray)];
    jobDescriptionArray = [...new Set(jobDescriptionArray)];

    //Remove empty strings
    resumeArray = resumeArray.filter(word => word.length > 0);
    jobDescriptionArray = jobDescriptionArray.filter(word => word.length > 0);

    if (jobDescriptionArray.length === 0) {
        alert("Please enter a Job Description.");
        return;
    }


    // Store matched and missing keywords
    let matchedKeywords = [];
    let missingKeywords = [];

    // Compare JD keywords with Resume keywords
    for (let keyword of jobDescriptionArray) {
        if (resumeArray.includes(keyword)) {
            matchedKeywords.push(keyword);
        }
        else {
            missingKeywords.push(keyword);
        }
    }

    const atsScore = (
        (matchedKeywords.length / jobDescriptionArray.length) * 100
    ).toFixed(2);

    // Output
    console.log(atsScore);
}