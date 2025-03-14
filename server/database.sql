CREATE DATABASE IF NOT EXISTS testadv;

CREATE TABLE IF NOT EXISTS "users" (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS "courses" (
    course_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    course_type VARCHAR(255) NOT NULL, 
    instructor_name VARCHAR(255) NOT NULL, 
    course_date DATE NOT NULL 
);

CREATE TABLE IF NOT EXISTS "enrollments" (
    enrollment_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'enrolled', 
    FOREIGN KEY (user_id) REFERENCES "users"(user_id),
    FOREIGN KEY (course_id) REFERENCES "courses"(course_id),
    UNIQUE(user_id, course_id) 
);
