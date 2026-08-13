// Simulated AI Service for Local Testing
const generateAIResponse = async (prompt) => {
    
    // Simulate the network delay of an AI model "thinking"
    await new Promise(resolve => setTimeout(resolve, 1800));
    
    // Return a perfectly formatted mock JSON response
    return JSON.stringify({
        score: 78,
        matched: ["JavaScript", "Node.js", "React", "Docker", "MySQL"],
        missing: ["TypeScript", "GraphQL", "AWS", "Kubernetes"],
        recommendations: [
            "Add 'AWS' and 'TypeScript' to your skills section.",
            "Quantify your backend experience with specific performance metrics.",
            "Include more action verbs related to leadership and system architecture."
        ]
    });
};

module.exports = { generateAIResponse };