-- ==========================================================
-- EmployeeHub Database Initialization Script
-- ==========================================================

-- 1. Create database if it doesn't already exist
CREATE DATABASE IF NOT EXISTS employeehub_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE employeehub_db;

-- 2. Create the employees table
CREATE TABLE IF NOT EXISTS employees (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    department VARCHAR(50) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_department (department),
    INDEX idx_name (name),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Seed Initial Sample Data
INSERT INTO employees (name, email, department, designation)
VALUES
    ('Sarah Jenkins', 'sarah.jenkins@employeehub.io', 'Engineering', 'Lead Full-Stack Architect'),
    ('Alex Rivera', 'alex.rivera@employeehub.io', 'Engineering', 'Senior Frontend Engineer'),
    ('Priya Sharma', 'priya.sharma@employeehub.io', 'Product', 'Principal Product Manager'),
    ('David Chen', 'david.chen@employeehub.io', 'Engineering', 'DevOps & Cloud Engineer'),
    ('Elena Rostova', 'elena.rostova@employeehub.io', 'Design', 'Lead UX/UI Designer'),
    ('Marcus Vance', 'marcus.vance@employeehub.io', 'Marketing', 'Growth Marketing Specialist'),
    ('Aaliyah Patel', 'aaliyah.patel@employeehub.io', 'Human Resources', 'HR Operations Lead'),
    ('James Wilson', 'james.wilson@employeehub.io', 'Finance', 'Senior Financial Analyst'),
    ('Rachel Green', 'rachel.green@employeehub.io', 'Design', 'Visual Brand Designer'),
    ('Liam O''Connor', 'liam.oconnor@employeehub.io', 'Engineering', 'Backend Systems Engineer')
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    department = VALUES(department),
    designation = VALUES(designation);
