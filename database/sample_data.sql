INSERT INTO users
(first_name, last_name, email, password_hash, phone, profile_image)
VALUES
('Anish','Sharma','anish@gmail.com','hashed_password_1','9876543210','profile1.jpg'),
('Rahul','Verma','rahul@gmail.com','hashed_password_2','9876543211','profile2.jpg'),
('Priya','Singh','priya@gmail.com','hashed_password_3','9876543212','profile3.jpg'),
('Aman','Gupta','aman@gmail.com','hashed_password_4','9876543213','profile4.jpg'),
('Sneha','Patel','sneha@gmail.com','hashed_password_5','9876543214','profile5.jpg');

INSERT INTO resume_templates
(template_name, preview_img, premium)
VALUES
('Classic','classic.png',FALSE),
('Modern','modern.png',FALSE),
('Professional','professional.png',TRUE),
('Creative','creative.png',TRUE),
('Minimal','minimal.png',FALSE);

INSERT INTO resumes
(title, summary, user_id, template_id)
VALUES
('Software Engineer Resume',
'Passionate Computer Science student with strong DSA and Web Development skills.',
1,2),
('Backend Developer Resume',
'Node.js backend developer with REST API experience.',
2,3),
('Frontend Resume',
'React Developer passionate about UI/UX.',
3,2),
('Data Analyst Resume',
'SQL and Python enthusiast.',
4,5),
('Full Stack Resume',
'MERN Stack developer.',
5,1);

INSERT INTO educations
(institution, degree, field, score, grading_system,
start_date,end_date,resume_id)
VALUES
('Medhavi Skills University','B.Tech','Computer Science',8.90,'CGPA','2024-08-01','2028-06-01',1),
('Delhi University','B.Sc','Computer Science',82.5,'Percentage','2020-07-01','2023-06-01',2),
('Mumbai University','BCA','Computer Applications',8.30,'CGPA','2021-07-01','2024-05-01',3),
('IIT Delhi','M.Tech','Artificial Intelligence',9.20,'CGPA','2023-07-01','2027-06-01',4),
('Pune University','B.Tech','IT',8.50,'CGPA','2020-08-01','2024-05-01',5);

INSERT INTO experiences
(company_name,job_title,employment_type,
location,description,start_date,end_date,is_current,resume_id)
VALUES
('Infosys','Software Engineer','Full-time','Bangalore','Worked on backend APIs.','2025-01-01',NULL,TRUE,1),
('TCS','Frontend Developer','Internship','Remote','Developed React applications.','2024-06-01','2024-12-01',FALSE,2),
('Google','Software Intern','Internship','Hyderabad','Worked on internal tools.','2025-05-01','2025-08-01',FALSE,3),
('Amazon','SDE','Full-time','Bangalore','Worked on AWS services.','2023-01-01',NULL,TRUE,4),
('Microsoft','Software Engineer','Full-time','Remote','Developed cloud applications.','2024-02-01',NULL,TRUE,5);

INSERT INTO projects
(project_name,description,github_link,
live_link,start_date,end_date,is_ongoing,resume_id)
VALUES
('Resume Analyzer',
'AI powered ATS resume analyzer.','https://github.com/user/resume',
'https://resume.com','2025-01-01',NULL,TRUE,1),
('Hospital Management',
'Hospital Management System.','https://github.com/user/hospital',
NULL,'2024-01-01','2024-06-01',FALSE,2),
('Portfolio',
'Developer portfolio.','https://github.com/user/portfolio',
'https://portfolio.com','2024-03-01',NULL,TRUE,3),
('Weather App',
'Weather forecasting app.','https://github.com/user/weather',
'https://weather.com','2024-02-01','2024-05-01',FALSE,4),
('Chat Application',
'Real-time chat app.','https://github.com/user/chat',
NULL,'2025-02-01',NULL,TRUE,5);

INSERT INTO skills(skill_name)
VALUES
('C++'),('Java'),('Python'),('React'),('Node.js'),('MySQL'),('Docker'),('AWS');

INSERT INTO resume_skills
VALUES
(1,1),(1,2),(1,6),(2,4),(5,8);

INSERT INTO project_technologies
VALUES
(1,4),(1,5),(1,6),(2,2),(3,4),(4,3),(5,7);

INSERT INTO languages(language_name)
VALUES
('English'),('Hindi'),('French'),('German'),('Japanese');

INSERT INTO resume_languages
VALUES
(1,1,'Fluent'),(1,2,'Native'),(2,1,'Fluent'),(3,3,'Basic'),(5,4,'Intermediate');

INSERT INTO interests
(resume_id,interest_name)
VALUES
(1,'Competitive Programming'),(1,'Chess'),(2,'Photography'),(3,'Reading'),(5,'Travelling');

INSERT INTO certificates
(resume_id,certificate_name,issuer,issue_date,expiry_date,credential_id,credential_url)
VALUES
(1,'AWS Certified Cloud Practitioner','Amazon Web Services',
'2025-01-10','2028-01-10','AWS12345','https://credly.com/aws123'),
(2,'Oracle Java SE 17','Oracle',
'2024-07-15',NULL,'ORA56789','https://oracle.com/certificate'),
(3,'Google Data Analytics','Google',
'2025-03-20',NULL,'GOO9988','https://coursera.org/certificate'),
(4,'Microsoft Azure Fundamentals','Microsoft',
'2025-02-12',NULL,'AZ90055','https://learn.microsoft.com'),
(5,'CCNA','Cisco',
'2024-11-18','2027-11-18','CCNA123','https://cisco.com/certificate');

INSERT INTO achievements
(resume_id,title,description)
VALUES
(1,'Winner - College Coding Contest',
'Secured first position among 250 participants.'),
(2,'CodeChef 3 Star',
'Achieved 3-star rating on CodeChef.'),
(3,'Google Solution Challenge',
'Reached national finals.'),
(4,'Hackathon Winner',
'Won Smart India Hackathon.'),
(5,'Dean List',
'Maintained CGPA above 9.0.');

INSERT INTO ats_analysis
(resume_id,ats_score,missing_keywords,suggestions,analysis_date)
VALUES
(1,88,'AWS, Kubernetes','Add cloud experience.','2026-07-01'),
(2,75,'REST API','Mention backend experience.','2026-07-03'),
(3,92,'None','Excellent Resume.','2026-07-05'),
(4,69,'Python','Improve project section.','2026-07-08'),
(5,81,'Docker','Add deployment experience.','2026-07-10');

INSERT INTO jd_comparison
(resume_id,job_title,company_name,job_description,
match_score,missing_keywords,recommendations,comparison_date)
VALUES
(1,'Software Engineer','Google',
'Looking for MERN developer.',87,
'AWS','Add cloud projects.','2026-07-01'),
(2,'Backend Developer','Amazon',
'Node.js Developer.',80,
'Docker','Mention Docker.','2026-07-02'),
(3,'Frontend Developer','Microsoft',
'React Developer.',91,
'Redux','Add Redux project.','2026-07-03'),
(4,'Data Analyst','Accenture',
'Python + SQL.',70,
'Pandas','Mention analytics project.','2026-07-04'),
(5,'Full Stack Developer','Infosys',
'MERN Developer.',85,
'MongoDB','Add database project.','2026-07-05');

INSERT INTO premium_requests
(user_id,resume_id,status,request_date,remarks)
VALUES
(1,1,'Pending','2026-07-01',''),
(2,2,'Approved','2026-07-02','HR assigned.'),
(3,3,'Completed','2026-07-03','Resume reviewed successfully.'),
(4,4,'Rejected','2026-07-04','Incomplete payment.'),
(5,5,'Pending','2026-07-05','');