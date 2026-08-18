// ==========================================
// RESUME AI - ATS ANALYZER
// ==========================================


// ==========================================
// DOM ELEMENTS
// ==========================================
console.log("ANALYZER WORKING");
const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("file-input");
const uploadBtn = document.getElementById("upload-btn");

const uploadSection = document.getElementById("upload-section");
const scanningSection = document.getElementById("scanning-section");
const resultsSection = document.getElementById("results-section");


// ==========================================
// SCORE ELEMENTS
// ==========================================

const scoreRing = document.getElementById("score-ring");
const scoreNumber = document.getElementById("score-number");

const contentScore =
    document.getElementById("content-score");

const contentBar =
    document.getElementById("content-bar");

const contentFeedback =
    document.getElementById("content-feedback");


const sectionScore =
    document.getElementById("section-score");

const sectionBar =
    document.getElementById("section-bar");

const sectionFeedback =
    document.getElementById("section-feedback");


const structureScore =
    document.getElementById("structure-score");

const structureBar =
    document.getElementById("structure-bar");

const structureFeedback =
    document.getElementById("structure-feedback");


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
// BACKEND URL
// ==========================================

const ANALYZER_API =
    "http://localhost:3000/api/analyzer/analyze";


// ==========================================
// STEPPER
// ==========================================

function setStep(step) {

    const dots =
        document.querySelectorAll(".step-dot");


    dots.forEach((dot, index) => {

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
        else {

            dot.classList.remove(
                "bg-teal-600",
                "text-white"
            );

            dot.classList.add(
                "bg-slate-200",
                "text-slate-500"
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
// FILE UPLOAD BUTTON
// ==========================================

if (uploadBtn && fileInput) {

    uploadBtn.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            fileInput.click();

        }
    );

}


// ==========================================
// DROPZONE CLICK
// ==========================================

if (dropzone && fileInput) {

    dropzone.addEventListener(
        "click",
        function () {

            fileInput.click();

        }
    );

}


// ==========================================
// FILE SELECTED
// ==========================================

if (fileInput) {

    fileInput.addEventListener(
        "change",
        function () {

            if (fileInput.files.length > 0) {

                const file =
                    fileInput.files[0];

                console.log(
                    "📄 Selected file:",
                    file.name
                );

                analyzeResume(file);

            }

        }
    );

}


// ==========================================
// DRAG & DROP
// ==========================================

if (dropzone) {

    dropzone.addEventListener(
        "dragover",
        function (event) {

            event.preventDefault();

            dropzone.classList.add(
                "border-teal-500"
            );

        }
    );


    dropzone.addEventListener(
        "dragleave",
        function () {

            dropzone.classList.remove(
                "border-teal-500"
            );

        }
    );


    dropzone.addEventListener(
        "drop",
        function (event) {

            event.preventDefault();

            dropzone.classList.remove(
                "border-teal-500"
            );


            const files =
                event.dataTransfer.files;


            if (
                files &&
                files.length > 0
            ) {

                const file =
                    files[0];

                analyzeResume(file);

            }

        }
    );

}


// ==========================================
// MAIN ATS ANALYSIS FUNCTION
// ==========================================

async function analyzeResume(file) {

    console.log(
        "=========================================="
    );

    console.log(
        "📤 Starting ATS analysis..."
    );

    console.log(
        "File:",
        file.name
    );

    console.log(
        "Type:",
        file.type
    );

    console.log(
        "Size:",
        file.size
    );


    // ==========================================
    // VALIDATE FILE
    // ==========================================

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


    // ==========================================
    // SHOW SCANNING UI
    // ==========================================

    if (uploadSection) {

        uploadSection.classList.add(
            "hidden"
        );

    }


    if (resultsSection) {

        resultsSection.classList.add(
            "hidden"
        );

    }


    if (scanningSection) {

        scanningSection.classList.remove(
            "hidden"
        );


        const scanningText =
            scanningSection.querySelector(
                "p.mt-4"
            );


        if (scanningText) {

            scanningText.textContent =
                `Scanning ${file.name}…`;

        }

    }


    setStep(2);


    // ==========================================
    // CREATE FORMDATA
    // ==========================================

    const formData =
        new FormData();


    // IMPORTANT:
    // This MUST match multer's upload.single("resume")

    formData.append(
        "resume",
        file
    );


    console.log(
        "📦 FormData created"
    );


    // ==========================================
    // VERIFY FORMDATA
    // ==========================================

    for (
        const [key, value]
        of formData.entries()
    ) {

        console.log(
            "FormData:",
            key,
            value
        );

    }


    try {

        // ==========================================
        // CALL BACKEND
        // ==========================================

        console.log(
            "🌐 Calling backend:"
        );

        console.log(
            ANALYZER_API
        );


        const response =
            await fetch(
                ANALYZER_API,
                {
                    method: "POST",
                    body: formData
                }
            );


        // ==========================================
        // LOG RESPONSE INFORMATION
        // ==========================================

        console.log(
            "📡 Backend status:",
            response.status
        );

        console.log(
            "📡 Backend status text:",
            response.statusText
        );

        console.log(
            "📡 Content-Type:",
            response.headers.get(
                "content-type"
            )
        );


        // ==========================================
        // READ RESPONSE AS TEXT
        // ==========================================

        /*
         * IMPORTANT:
         *
         * We read text first instead of directly
         * using response.json().
         *
         * This prevents:
         *
         * Unexpected token '<'
         *
         * when Express returns an HTML error page.
         */

        const rawResponse =
            await response.text();


        console.log(
            "📥 RAW BACKEND RESPONSE:"
        );

        console.log(
            rawResponse
        );


        // ==========================================
        // PARSE JSON
        // ==========================================

        let result;


        try {

            result =
                JSON.parse(
                    rawResponse
                );

        }
        catch (jsonError) {

            console.error(
                "❌ Backend did not return JSON."
            );


            console.error(
                "Raw response:",
                rawResponse
            );


            throw new Error(
                "Backend returned an invalid response.\n\n" +
                "HTTP Status: " +
                response.status +
                "\n\n" +
                "Response:\n" +
                rawResponse.substring(
                    0,
                    500
                )
            );

        }


        console.log(
            "✅ Parsed backend response:"
        );

        console.log(
            result
        );


        // ==========================================
        // CHECK BACKEND ERROR
        // ==========================================

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


        // ==========================================
        // GET ATS DATA
        // ==========================================

        const atsData =
            result.data;


        if (!atsData) {

            throw new Error(
                "Backend returned no ATS analysis data."
            );

        }


        console.log(
            "=========================================="
        );

        console.log(
            "🎯 ATS ANALYSIS RESULT"
        );

        console.log(
            "Overall Score:",
            atsData.overallScore
        );

        console.log(
            "Content Score:",
            atsData.contentScore
        );

        console.log(
            "Section Score:",
            atsData.sectionScore
        );

        console.log(
            "Structure Score:",
            atsData.structureScore
        );

        console.log(
            "Keyword Score:",
            atsData.keywordScore
        );

        console.log(
            "Strengths:",
            atsData.strengths
        );

        console.log(
            "Weaknesses:",
            atsData.weaknesses
        );

        console.log(
            "Missing Keywords:",
            atsData.missingKeywords
        );

        console.log(
            "Detected Skills:",
            atsData.detectedSkills
        );

        console.log(
            "Suggestions:",
            atsData.suggestions
        );


        // ==========================================
        // SAVE ATS RESULT
        // ==========================================

        localStorage.setItem(
            "atsAnalysis",
            JSON.stringify(
                atsData
            )
        );


        console.log(
            "💾 ATS result saved to localStorage"
        );


        // ==========================================
        // UPDATE UI
        // ==========================================

        updateATSResults(
            atsData
        );


        // ==========================================
        // SHOW RESULTS
        // ==========================================

        if (resultsSection) {

            resultsSection.classList.remove(
                "hidden"
            );

        }


        // ==========================================
        // HIDE SCANNING
        // ==========================================

        if (scanningSection) {

            scanningSection.classList.add(
                "hidden"
            );

        }


        // ==========================================
        // STEP 3
        // ==========================================

        setStep(3);


        console.log(
            "✅ ATS analysis completed successfully!"
        );

        console.log(
            "=========================================="
        );

    }


    catch (error) {

        console.error(
            "=========================================="
        );

        console.error(
            "❌ ATS ANALYSIS ERROR"
        );

        console.error(
            error
        );

        console.error(
            "=========================================="
        );


        // ==========================================
        // HIDE SCANNING
        // ==========================================

        if (scanningSection) {

            scanningSection.classList.add(
                "hidden"
            );

        }


        // ==========================================
        // SHOW UPLOAD AGAIN
        // ==========================================

        if (uploadSection) {

            uploadSection.classList.remove(
                "hidden"
            );

        }


        // ==========================================
        // RESET STEPPER
        // ==========================================

        setStep(1);


        // ==========================================
        // SHOW ERROR
        // ==========================================

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
        "📊 Updating ATS UI..."
    );


    // ==========================================
    // OVERALL SCORE
    // ==========================================

    const overall =
        Number(
            data.overallScore
        ) || 0;


    if (scoreNumber) {

        scoreNumber.textContent =
            `${overall}%`;

    }


    // Circle circumference
    const circumference = 377;


    const offset =
        circumference -
        (
            overall / 100
        ) *
        circumference;


    if (scoreRing) {

        scoreRing.style.strokeDashoffset =
            offset;

    }


    // ==========================================
    // CONTENT SCORE
    // ==========================================

    const content =
        Number(
            data.contentScore
        ) || 0;


    if (contentScore) {

        contentScore.textContent =
            `${content}%`;

    }


    if (contentBar) {

        contentBar.style.width =
            `${content}%`;

    }


    if (contentFeedback) {

        contentFeedback.textContent =
            getScoreMessage(
                content
            );

    }


    // ==========================================
    // SECTION SCORE
    // ==========================================

    const sections =
        Number(
            data.sectionScore
        ) || 0;


    if (sectionScore) {

        sectionScore.textContent =
            `${sections}%`;

    }


    if (sectionBar) {

        sectionBar.style.width =
            `${sections}%`;

    }


    if (sectionFeedback) {

        sectionFeedback.textContent =
            getScoreMessage(
                sections
            );

    }


    // ==========================================
    // STRUCTURE SCORE
    // ==========================================

    const structure =
        Number(
            data.structureScore
        ) || 0;


    if (structureScore) {

        structureScore.textContent =
            `${structure}%`;

    }


    if (structureBar) {

        structureBar.style.width =
            `${structure}%`;

    }


    if (structureFeedback) {

        structureFeedback.textContent =
            getScoreMessage(
                structure
            );

    }


    // ==========================================
    // STRENGTHS
    // ==========================================

    if (strengthsList) {

        strengthsList.innerHTML = "";


        if (
            Array.isArray(
                data.strengths
            ) &&
            data.strengths.length > 0
        ) {

            data.strengths.forEach(
                function (strength) {

                    const li =
                        document.createElement(
                            "li"
                        );


                    li.className =
                        "flex gap-2";


                    li.innerHTML = `
                        <span class="text-teal-600">
                            ✓
                        </span>

                        <span>
                            ${escapeHTML(strength)}
                        </span>
                    `;


                    strengthsList.appendChild(
                        li
                    );

                }
            );

        }

        else {

            strengthsList.innerHTML =
                `
                <li>
                    No strengths detected.
                </li>
                `;

        }

    }


    // ==========================================
    // WEAKNESSES
    // ==========================================

    if (weaknessesList) {

        weaknessesList.innerHTML = "";


        if (
            Array.isArray(
                data.weaknesses
            ) &&
            data.weaknesses.length > 0
        ) {

            data.weaknesses.forEach(
                function (weakness) {

                    const li =
                        document.createElement(
                            "li"
                        );


                    li.className =
                        "flex gap-2";


                    li.innerHTML = `
                        <span class="text-amber-500">
                            !
                        </span>

                        <span>
                            ${escapeHTML(weakness)}
                        </span>
                    `;


                    weaknessesList.appendChild(
                        li
                    );

                }
            );

        }

        else {

            weaknessesList.innerHTML =
                `
                <li>
                    No major weaknesses detected.
                </li>
                `;

        }

    }


    // ==========================================
    // MISSING KEYWORDS
    // ==========================================

    if (keywordsList) {

        keywordsList.innerHTML = "";


        if (
            Array.isArray(
                data.missingKeywords
            ) &&
            data.missingKeywords.length > 0
        ) {

            data.missingKeywords.forEach(
                function (keyword) {

                    const span =
                        document.createElement(
                            "span"
                        );


                    span.className =
                        "px-3 py-1.5 rounded-full " +
                        "bg-slate-100 text-slate-700 " +
                        "text-xs font-semibold";


                    span.textContent =
                        keyword;


                    keywordsList.appendChild(
                        span
                    );

                }
            );

        }

        else {

            keywordsList.innerHTML =
                `
                <span class="text-sm text-teal-600">
                    No major missing keywords detected.
                </span>
                `;

        }

    }


    // ==========================================
    // AI SUGGESTIONS
    // ==========================================

    const suggestions =
        Array.isArray(
            data.suggestions
        )
            ? data.suggestions
            : [];


    if (suggestionsTitle) {

        suggestionsTitle.textContent =
            `${suggestions.length} AI suggestions ready to apply`;

    }


    if (suggestionsSubtitle) {

        if (
            suggestions.length > 0
        ) {

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
        document.createElement(
            "div"
        );


    div.textContent =
        String(value ?? "");


    return div.innerHTML;

}


// ==========================================
// INITIAL PAGE STATE
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "🚀 ResumeAI ATS Analyzer loaded"
        );


        console.log(
            "Analyzer API:",
            ANALYZER_API
        );


        // Results should be hidden
        // until a resume is successfully analyzed.

        if (resultsSection) {

            resultsSection.classList.add(
                "hidden"
            );

        }


        if (scanningSection) {

            scanningSection.classList.add(
                "hidden"
            );

        }


        if (uploadSection) {

            uploadSection.classList.remove(
                "hidden"
            );

        }


        setStep(1);

    }
);