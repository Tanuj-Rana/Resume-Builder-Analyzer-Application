/**
 * Deterministic ATS checks.
 *
 * This is NOT the AI score.
 * It provides objective signals that
 * we pass to the LLM.
 */

function analyzeResumeStructure(resumeText) {

    const text = resumeText.toLowerCase();

    const checks = {

        contactInformation:
            hasContactInformation(text),

        summary:
            hasSection(text, [
                "summary",
                "professional summary",
                "profile",
                "objective"
            ]),

        experience:
            hasSection(text, [
                "experience",
                "work experience",
                "employment",
                "professional experience"
            ]),

        education:
            hasSection(text, [
                "education",
                "academic"
            ]),

        skills:
            hasSection(text, [
                "skills",
                "technical skills",
                "core skills"
            ]),

        projects:
            hasSection(text, [
                "projects",
                "personal projects",
                "academic projects"
            ]),

        certifications:
            hasSection(text, [
                "certifications",
                "certificates"
            ])

    };


    const sectionCount =
        Object.values(checks)
            .filter(Boolean)
            .length;


    const wordCount =
        text
            .split(/\s+/)
            .filter(Boolean)
            .length;


    const actionVerbCount =
        countActionVerbs(text);


    const measurableAchievementCount =
        countMeasurableAchievements(text);


    return {

        checks,

        sectionCount,

        totalPossibleSections:
            Object.keys(checks).length,

        wordCount,

        actionVerbCount,

        measurableAchievementCount

    };
}


/**
 * Check if resume contains basic
 * contact information.
 */
function hasContactInformation(text) {

    const hasEmail =
        /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
            .test(text);

    const hasPhone =
        /(?:\+?\d[\d\s().-]{7,}\d)/.test(text);

    return hasEmail && hasPhone;
}


/**
 * Detect section headings.
 */
function hasSection(text, keywords) {

    return keywords.some(
        keyword => text.includes(keyword)
    );

}


/**
 * Common resume action verbs.
 */
function countActionVerbs(text) {

    const verbs = [

        "developed",
        "designed",
        "implemented",
        "built",
        "created",
        "engineered",
        "optimized",
        "automated",
        "managed",
        "led",
        "launched",
        "deployed",
        "integrated",
        "improved",
        "analyzed",
        "configured",
        "maintained",
        "architected",
        "delivered",
        "reduced",
        "increased"

    ];


    return verbs.filter(
        verb => text.includes(verb)
    ).length;

}


/**
 * Detect numbers / percentages that
 * may represent measurable achievements.
 */
function countMeasurableAchievements(text) {

    const matches =
        text.match(
            /\b\d+(?:\.\d+)?%?\b/g
        );

    return matches
        ? matches.length
        : 0;

}


module.exports = {
    analyzeResumeStructure
};