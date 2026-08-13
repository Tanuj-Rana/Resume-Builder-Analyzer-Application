// ==========================================
// RESUME AI - ATS ANALYZER
// ==========================================

const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("file-input");
const uploadBtn = document.getElementById("upload-btn");

const uploadSection = document.getElementById("upload-section");
const scanningSection = document.getElementById("scanning-section");

const scoreRing = document.getElementById("score-ring");
const scoreNumber = document.getElementById("score-number");


// ==========================================
// SCORE ELEMENTS
// ==========================================

const contentScore = document.getElementById("content-score");
const contentBar = document.getElementById("content-bar");
const contentFeedback = document.getElementById("content-feedback");

const sectionScore = document.getElementById("section-score");
const sectionBar = document.getElementById("section-bar");
const sectionFeedback = document.getElementById("section-feedback");

const structureScore = document.getElementById("structure-score");
const structureBar = document.getElementById("structure-bar");
const structureFeedback = document.getElementById("structure-feedback");


// ==========================================
// ANALYSIS ELEMENTS
// ==========================================

const strengthsList =
    document.getElementById("strengths-list");

const weaknessesList =
    document.getElementById("weaknesses-list");

const keywordsList =
    document.getElementById("keywords-list");

const suggestionsTitle =
    document.getElementById("suggestions-title");

const suggestionsSubtitle =
    document.getElementById("suggestions-subtitle");


// ==========================================
// STEPPER
// ==========================================

function setStep(step) {

    document
        .querySelectorAll(".step-dot")
        .forEach((dot, index) => {

            const number = index + 1;

            if (number <= step) {

                dot.classList.remove(
                    "bg-slate-200",
                    "text-slate-500"
                );

                dot.classList.add(
                    "bg-teal-600",
                    "text-white"
                );

            }

        });


    const line12 =
        document.getElementById("line-1-2");

    const line23 =
        document.getElementById("line-2-3");


    if (line12) {

        line12.classList.toggle(
            "bg-teal-500",
            step >= 2
        );

    }


    if (line23) {

        line23.classList.toggle(
            "bg-teal-500",
            step >= 3
        );

    }

}


// ==========================================
// FILE SELECTION
// ==========================================

uploadBtn.addEventListener(
    "click",
    function (event) {

        event.stopPropagation();

        fileInput.click();

    }
);


dropzone.addEventListener(
    "click",
    function () {

        fileInput.click();

    }
);


fileInput.addEventListener(
    "change",
    function () {

        if (fileInput.files.length > 0) {

            analyzeResume(
                fileInput.files[0]
            );

        }

    }
);


// ==========================================
// MAIN ATS FUNCTION
// ==========================================

async function analyzeResume(file) {

    console.log(
        "📤 Sending resume to ATS backend..."
    );


    // ------------------------------------------
    // Validate file
    // ------------------------------------------

    const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain"
    ];


    if (!allowedTypes.includes(file.type)) {

        alert(
            "Please upload a PDF, DOCX or TXT resume."
        );

        return;

    }


    // ------------------------------------------
    // Show scanning UI
    // ------------------------------------------

    setStep(2);

    uploadSection.classList.add("hidden");

    scanningSection.classList.remove("hidden");


    const scanningText =
        scanningSection.querySelector("p.mt-4");

    if (scanningText) {

        scanningText.textContent =
            `Scanning ${file.name}…`;

    }


    // ------------------------------------------
    // Create FormData
    // ------------------------------------------

    const formData =
        new FormData();

    formData.append(
        "resume",
        file
    );


    try {

        // --------------------------------------
        // CALL BACKEND
        // --------------------------------------

        const response =
            await fetch(
                "http://localhost:3000/api/analyzer/analyze",
                {
                    method: "POST",
                    body: formData
                }
            );


        console.log(
            "Backend status:",
            response.status
        );


        // --------------------------------------
        // Parse response
        // --------------------------------------

        const result =
            await response.json();


        console.log(
            "ATS backend result:",
            result
        );


        // --------------------------------------
        // Check backend error
        // --------------------------------------

        if (
            !response.ok ||
            !result.success
        ) {

            throw new Error(
                result.error ||
                result.details ||
                "Unable to analyze resume."
            );

        }


        // --------------------------------------
        // Get ATS data
        // --------------------------------------

        const atsData =
            result.data;
        const resultsSection = document.getElementById("results-section");
        resultsSection.classList.remove("hidden");

        console.log(
            "Overall Score:",
            atsData.overallScore
        );


        // --------------------------------------
        // Save data
        // --------------------------------------

        localStorage.setItem(
            "atsAnalysis",
            JSON.stringify(atsData)
        );


        // --------------------------------------
        // Update UI
        // --------------------------------------

        updateATSResults(
            atsData
        );


        // --------------------------------------
        // Hide scanning
        // --------------------------------------

        scanningSection.classList.add(
            "hidden"
        );


        setStep(3);


        console.log(
            "✅ ATS analysis completed!"
        );

    }

    catch (error) {

        console.error(
            "❌ ATS Analysis Error:",
            error
        );


        scanningSection.classList.add(
            "hidden"
        );


        uploadSection.classList.remove(
            "hidden"
        );


        setStep(1);


        alert(
            "Unable to analyze resume.\n\n" +
            error.message
        );

    }

}


// ==========================================
// UPDATE ATS RESULTS
// ==========================================

function updateATSResults(data) {

    console.log(
        "Updating ATS UI...",
        data
    );


    // ========================================
    // OVERALL SCORE
    // ========================================

    const overall =
        Number(data.overallScore) || 0;


    scoreNumber.textContent =
        `${overall}%`;


    // Circle circumference = 377
    const circumference = 377;


    const offset =
        circumference -
        (overall / 100) *
        circumference;


    scoreRing.style.strokeDashoffset =
        offset;


    // ========================================
    // CONTENT SCORE
    // ========================================

    const content =
        Number(data.contentScore) || 0;


    contentScore.textContent =
        `${content}%`;


    contentBar.style.width =
        `${content}%`;


    contentFeedback.textContent =
        getScoreMessage(content);


    // ========================================
    // SECTION SCORE
    // ========================================

    const sections =
        Number(data.sectionScore) || 0;


    sectionScore.textContent =
        `${sections}%`;


    sectionBar.style.width =
        `${sections}%`;


    sectionFeedback.textContent =
        getScoreMessage(sections);


    // ========================================
    // STRUCTURE SCORE
    // ========================================

    const structure =
        Number(data.structureScore) || 0;


    structureScore.textContent =
        `${structure}%`;


    structureBar.style.width =
        `${structure}%`;


    structureFeedback.textContent =
        getScoreMessage(structure);


    // ========================================
    // STRENGTHS
    // ========================================

    strengthsList.innerHTML = "";


    if (
        Array.isArray(data.strengths) &&
        data.strengths.length > 0
    ) {

        data.strengths.forEach(
            function (strength) {

                const li =
                    document.createElement("li");

                li.className =
                    "flex gap-2";


                li.innerHTML = `
                    <span class="text-teal-600">✓</span>
                    <span>${escapeHTML(strength)}</span>
                `;


                strengthsList.appendChild(li);

            }
        );

    }

    else {

        strengthsList.innerHTML =
            `<li>No strengths detected.</li>`;

    }


    // ========================================
    // WEAKNESSES
    // ========================================

    weaknessesList.innerHTML = "";


    if (
        Array.isArray(data.weaknesses) &&
        data.weaknesses.length > 0
    ) {

        data.weaknesses.forEach(
            function (weakness) {

                const li =
                    document.createElement("li");

                li.className =
                    "flex gap-2";


                li.innerHTML = `
                    <span class="text-amber-500">!</span>
                    <span>${escapeHTML(weakness)}</span>
                `;


                weaknessesList.appendChild(li);

            }
        );

    }

    else {

        weaknessesList.innerHTML =
            `<li>No major weaknesses detected.</li>`;

    }


    // ========================================
    // MISSING KEYWORDS
    // ========================================

    keywordsList.innerHTML = "";


    if (
        Array.isArray(data.missingKeywords) &&
        data.missingKeywords.length > 0
    ) {

        data.missingKeywords.forEach(
            function (keyword) {

                const span =
                    document.createElement("span");


                span.className =
                    "px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold";


                span.textContent =
                    keyword;


                keywordsList.appendChild(span);

            }
        );

    }

    else {

        keywordsList.innerHTML =
            `<span class="text-sm text-teal-600">
                No major missing keywords detected.
            </span>`;

    }


    // ========================================
    // AI SUGGESTIONS
    // ========================================

    const suggestions =
        Array.isArray(data.suggestions)
            ? data.suggestions
            : [];


    suggestionsTitle.textContent =
        `${suggestions.length} AI suggestions ready to apply`;


    if (suggestions.length > 0) {

        const firstSuggestion =
            suggestions[0];


        suggestionsSubtitle.textContent =
            firstSuggestion.recommendation ||
            "Review the recommendations below to improve your ATS score.";

    }

    else {

        suggestionsSubtitle.textContent =
            "Your resume looks good. Continue refining it for your target role.";

    }

}


// ==========================================
// SCORE MESSAGE
// ==========================================

function getScoreMessage(score) {

    if (score >= 85) {

        return "Excellent — this area is strong.";

    }


    if (score >= 70) {

        return "Good — a few improvements could make it stronger.";

    }


    if (score >= 50) {

        return "Needs improvement — review the recommendations.";

    }


    return "Needs significant improvement.";

}


// ==========================================
// SECURITY HELPER
// ==========================================

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value;

    return div.innerHTML;

}