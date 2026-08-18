CREATE INDEX idx_users_email
ON users(email);

CREATE INDEX idx_skill_name
ON skills(skill_name);

CREATE INDEX idx_project_name
ON projects(project_name);

CREATE INDEX idx_certificate_name
ON certificates(certificate_name);

CREATE INDEX idx_analysis_date
ON ats_analysis(analysis_date);

CREATE INDEX idx_match_score
ON jd_comparison(match_score);

CREATE INDEX idx_request_status
ON premium_requests(status);
