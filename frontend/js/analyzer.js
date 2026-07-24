//script.js
const fileInput = document.getElementById("resumeFile");
const uploadButton = document.getElementById("uploadBtn");

// Upload Resume
uploadButton.addEventListener("click", async () => {
    // Get selected PDF
    const file = fileInput.files[0];
    // Check if user selected a file
    if (!file) {
        alert("Please select a PDF.");
        return;
    }
    
    // Create FormData object
    const formData = new FormData();

    // Add resume to FormData
    formData.append("resume", file);
    
    try {
        // Send resume to backend
        const response = await fetch("http://localhost:3000/upload", {
            method: "POST",
            body: formData
        });

        // Convert response to JSON
        const result = await response.json();

        // Get extracted resume text
        const resumeText = result.resumeText;

        // Get Job Description
        const jobDescription = document.getElementById("jobDescription").value;

        // Send both texts for ATS comparison
        compareResume(resumeText, jobDescription);

        alert("Resume uploaded successfully.");
    }
    catch (error) {
        console.error(error);
        alert("Something went wrong.");
    }
});