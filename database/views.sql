-- 1
CREATE VIEW resume_overview AS
SELECT r.resume_id, r.title, u.first_name, u.last_name, u.email, rt.template_name
FROM resumes r
JOIN users u 
ON r.user_id=u.user_id

JOIN resume_templates rt
ON r.template_id=rt.template_id;

-- 2
CREATE VIEW ats_results AS
SELECT r.title, a.ats_score, a.analysis_date
FROM ats_analysis a
JOIN resumes r ON a.resume_id=r.resume_id;

-- 3
CREATE VIEW premium_dashboard AS
SELECT pr.request_id, u.first_name, u.last_name, r.title, pr.status, pr.request_date
FROM premium_requests pr

JOIN users u ON pr.user_id=u.user_id

JOIN resumes r ON pr.resume_id=r.resume_id;

-- 4
CREATE VIEW resume_skill_list AS
SELECT r.resume_id, r.title, s.skill_name
FROM resume_skills rs

JOIN resumes r ON rs.resume_id=r.resume_id
JOIN skills s ON rs.skill_id=s.skill_id;

-- 5 
CREATE VIEW resume_language_list AS
SELECT r.title, l.language_name, rl.proficiency
FROM resume_languages rl

JOIN resumes r ON rl.resume_id=r.resume_id

JOIN languages l ON rl.language_id=l.language_id;