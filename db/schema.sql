DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;
USE employee_db;

CREATE TABLE department {
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30),
}

CREATE TABLE position {
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INTEGER,
}

CREATE TABLE employee{
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    position_id INTEGER,
    manager_id INTEGER,
}