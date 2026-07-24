create table users(
	user_id int AUTO_INCREMENT Primary KEY,
	first_name Varchar(50) not null,
	last_name Varchar(50) not null,
	email VARCHAR(100) unique not null,
	password_hash varchar(255) not null,
	phone varchar(15) not null,
	created_at Datetime default CURRENT_TIMESTAMP,
	updated_at datetime default CURRENT_TIMESTAMP on UPDATE CURRENT_TIMESTAMP,
	profile_image varchar(255)
);

create table resume_templates(
	template_id int Auto_increment primary Key,
	template_name varchar(100) not null unique,
	preview_img varchar(255) not null,
	premium BOOLEAN not null default false,
	created_at Datetime default CURRENT_TIMESTAMP,
	updated_at datetime default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP
);

create table resumes(
	resume_id int Auto_increment Primary key,
	title varchar(255) not NULL,
	summary TEXT,
	created_at Datetime default CURRENT_TIMESTAMP,
	updated_at datetime default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
	user_id int not null ,
	template_id int not null,
	FOREIGN key(user_id) REFERENCES users(user_id) on delete cascade on update cascade,
	FOREIGN key(template_id) REFERENCES resume_templates(template_id) on delete restrict on update cascade
);

create table educations(
	education_id int auto_increment primary key,
	institution varchar(255) not null,
	degree varchar(100) not null,
	field varchar(100),
	score decimal(5,2),
	grading_system enum('CGPA','Percentage','GPA'),
	start_date date not null,
	end_date date not null,
	resume_id int not null,
	FOREIGN key(resume_id) REFERENCES resumes(resume_id) on delete cascade on update cascade
);

create table experiences(
	experience_id int auto_increment primary key,
	company_name varchar(100) not null,
	job_title varchar(100) not null,
	employment_type enum('Full-time','Part-time','Internship','Freelance','Contract') not null,
	location varchar(100),
	description text,
	start_date date not null,
	is_current boolean default false,
	end_date date,
	resume_id int not null,
	FOREIGN key(resume_id) REFERENCES resumes(resume_id) on delete cascade on update cascade
);

create table projects(
	project_id int auto_increment primary key,
	project_name varchar(100) not null,
	description text not null,
	github_link varchar(255),
	live_link varchar(255),
	start_date date not null,
	is_ongoing boolean default false,
	end_date date,
	resume_id int not null,
	foreign key(resume_id) references resumes(resume_id) on delete cascade on update cascade
);

create table skills(
	skill_id int auto_increment primary key,
	skill_name varchar(100) not null unique
);

create table project_technologies(
	project_id int not null,
	skill_id int not null,
	
	FOREIGN key(skill_id) REFERENCES skills(skill_id) on delete CASCADE on update cascade,
	foreign key(project_id) references projects(project_id) on delete CASCADE on update cascade,
	
	primary key(project_id,skill_id)
);

create table resume_skills(
	resume_id int not null,
	skill_id int not null,
	
	primary key(resume_id,skill_id),
	
	FOREIGN key(resume_id) REFERENCES resumes(resume_id) on delete cascade on update cascade,
	foreign key(skill_id) REFERENCES skills(skill_id) on delete cascade on update cascade
);

create table languages(
	language_id int auto_increment primary key,
	language_name varchar(100) not null unique
);

create table resume_languages(
	resume_id int not null,
	language_id int not null,
	proficiency enum('Basic','Intermediate','Fluent','Native'),
	
	primary key(language_id,resume_id),
	
	foreign key(language_id) references languages(language_id) on delete cascade on update cascade,
	foreign key(resume_id) REFERENCES resumes(resume_id) on delete cascade on update cascade
);

create table interests(
	interest_id int auto_increment primary key,
	resume_id int not null,
	interest_name varchar(100) not null,
	
	FOREIGN key(resume_id) references resumes(resume_id) on delete cascade on update cascade
);

create table certificates(
	certificate_id int auto_increment primary key,
	resume_id int not null,
	certificate_name varchar(150) not null,
	issuer varchar(100) not null,
	issue_date date not null,
	expiry_date date,
	credential_id varchar(100),
	credential_url varchar(255) unique,
	
	foreign key(resume_id) REFERENCES resumes(resume_id) on delete cascade on update cascade
);

create table achievements(
	achievement_id int auto_increment primary key,
	resume_id int not null,
	title varchar(100) not null,
	description text not null,
	achievement_date date,
	
	foreign key(resume_id) REFERENCES resumes(resume_id) on delete cascade on update CASCADE
);

create table ats_analysis(
	analysis_id int auto_increment primary key,
	resume_id int not null,
	ats_score tinyint not null,
	missing_keywords text,
	suggestions text not null,
	analysis_date date not null,
	
	foreign key(resume_id) REFERENCES resumes(resume_id) on delete cascade on update CASCADE
);

create table jd_comparison(
	comparison_id int auto_increment primary key,
	resume_id int not null,
	job_title VARCHAR(100) not null,
	company_name varchar(100) not null,
	job_description text not null,
	match_score int not null,
	missing_keywords text,
	recommendations text not null,
	comparison_date date not null,
	
	FOREIGN key(resume_id) REFERENCES resumes(resume_id) on delete cascade on update CASCADE
);

create table premium_requests(
	request_id int auto_increment primary key,
	user_id int not null,
	resume_id int not null,
	status enum('Pending','Approved','Rejected','Completed'),
	request_date date not null,
	remarks text, 
	
	FOREIGN key(resume_id) REFERENCES resumes(resume_id) on delete cascade on update cascade,
	FOREIGN key(user_id) REFERENCES users(user_id) on delete cascade on update cascade
);